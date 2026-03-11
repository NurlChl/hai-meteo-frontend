<script setup lang="ts">
import type { NavigationItem } from '~/types/models'
import DataTable from '~/components/admin/DataTable.vue'
import Modal from '~/components/admin/Modal.vue'

definePageMeta({
  layout: 'admin',
  middleware: 'auth',
})

const { del } = useApi()
const toast = useToast()
const config = useRuntimeConfig()
const authStore = useAuthStore()

const columns = [
  { key: 'label', label: 'Label' },
  { key: 'href', label: 'URL' },
  { key: 'location', label: 'Location' },
  { key: 'sortOrder', label: 'Order' },
  { key: 'isEnabled', label: 'Status' },
]

const currentPage = ref(1)
const pageSize = ref(10)
const sortKey = ref('')
const filter = ref('')

const queryParams = computed(() => ({
  limit: pageSize.value,
  offset: (currentPage.value - 1) * pageSize.value,
  search: filter.value,
}))

interface NavItem extends NavigationItem {
}

const { data: navData, status, refresh } = await useFetch<{ results: NavItem[], totalResults: number, limit: number, offset: number }>('/navigation-items', {
  baseURL: config.public.apiBase,
  query: queryParams,
  onRequest({ options }) {
    if (authStore.token) {
      options.headers = new Headers(options.headers)
      options.headers.set('Authorization', `Bearer ${authStore.token}`)
    }
  },
})

const navItems = computed(() => navData.value?.results || [])
const total = computed(() => navData.value?.totalResults || 0)
const loading = computed(() => status.value === 'pending')

const deleting = ref(false)
const isDeleteModalOpen = ref(false)
const itemToDelete = ref<NavigationItem | null>(null)

function handleSort(key: string) {
  sortKey.value = sortKey.value === key ? '' : key
  currentPage.value = 1
}

function handleSearch(query: string) {
  filter.value = query
  currentPage.value = 1
}

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

function nextPage() {
  const totalPages = Math.ceil(total.value / pageSize.value)
  if (currentPage.value < totalPages) {
    currentPage.value++
  }
}

function confirmDelete(item: NavigationItem) {
  itemToDelete.value = item
  isDeleteModalOpen.value = true
}

function closeDeleteModal() {
  isDeleteModalOpen.value = false
  itemToDelete.value = null
}

async function handleDelete() {
  if (!itemToDelete.value)
    return

  deleting.value = true
  try {
    await del(`/navigation-items/${itemToDelete.value.id}`)
    toast.success('Navigation item deleted successfully')
    closeDeleteModal()
    refresh()
  }
  catch (err) {
    console.error(err)
    toast.error('Failed to delete navigation item')
  }
  finally {
    deleting.value = false
  }
}
</script>

<template>
  <div>
    <DataTable
      title="Navigation Items"
      :columns="columns"
      :data="navItems"
      :loading="loading"
      :current-page="currentPage"
      :page-size="pageSize"
      :total="total"
      show-search
      @sort="handleSort"
      @search="handleSearch"
      @prev-page="prevPage"
      @next-page="nextPage"
      @refresh="refresh"
    >
      <template #actions>
        <BaseButton variant="primary" to="/admin/navigation/create">
          Add Item
        </BaseButton>
      </template>
      <template #cell-isEnabled="{ item }">
        <BaseBadge :variant="item.isEnabled ? 'success' : 'danger'" size="sm">
          {{ item.isEnabled ? 'Enabled' : 'Disabled' }}
        </BaseBadge>
      </template>
      <template #rowActions="{ item }">
        <div class="flex items-center gap-2">
          <BaseButton
            variant="link"
            :to="`/admin/navigation/${item.id}`"
          >
            Edit
          </BaseButton>
          <BaseButton
            variant="link"
            class="text-red-500 hover:text-red-600"
            @click="confirmDelete(item as NavigationItem)"
          >
            Delete
          </BaseButton>
        </div>
      </template>
    </DataTable>

    <Modal
      v-model:is-open="isDeleteModalOpen"
      title="Delete Item"
      confirm-text="Delete"
      :loading="deleting"
      @confirm="handleDelete"
      @close="closeDeleteModal"
    >
      <p class="text-text-secondary">
        Are you sure you want to delete "{{ itemToDelete?.label }}"? This action cannot be undone.
      </p>
    </Modal>
  </div>
</template>
