<script setup lang="ts">
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
  { key: 'title', label: 'Title' },
  { key: 'slug', label: 'Slug' },
  { key: 'isPublished', label: 'Status' },
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

interface Page {
  id: number
  title: string
  slug: string
  isPublished: boolean
  [key: string]: any
}

const { data: pagesData, status, refresh } = await useFetch<{ results: Page[], totalResults: number, limit: number, offset: number }>('/pages', {
  baseURL: config.public.apiBase,
  query: queryParams,
  onRequest({ options }) {
    if (authStore.token) {
      options.headers = new Headers(options.headers)
      options.headers.set('Authorization', `Bearer ${authStore.token}`)
    }
  },
})

const pages = computed(() => pagesData.value?.results || [])
const total = computed(() => pagesData.value?.totalResults || 0)
const loading = computed(() => status.value === 'pending')

const deleting = ref(false)
const isDeleteModalOpen = ref(false)
const pageToDelete = ref<any>(null)

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

function confirmDelete(page: any) {
  pageToDelete.value = page
  isDeleteModalOpen.value = true
}

function closeDeleteModal() {
  isDeleteModalOpen.value = false
  pageToDelete.value = null
}

async function handleDelete() {
  if (!pageToDelete.value)
    return

  deleting.value = true
  try {
    await del(`/pages/${pageToDelete.value.id}`)
    toast.success('Page deleted successfully')
    closeDeleteModal()
    refresh()
  }
  catch (err) {
    console.error(err)
    toast.error('Failed to delete page')
  }
  finally {
    deleting.value = false
  }
}
</script>

<template>
  <div>
    <DataTable
      title="Pages"
      :columns="columns"
      :data="pages"
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
        <BaseButton variant="primary" to="/admin/pages/create">
          Create Page
        </BaseButton>
      </template>
      <template #cell-isPublished="{ item }">
        <BaseBadge :variant="item.isPublished ? 'success' : 'warning'" size="sm">
          {{ item.isPublished ? 'Published' : 'Draft' }}
        </BaseBadge>
      </template>
      <template #rowActions="{ item }">
        <div class="flex items-center gap-2">
          <BaseButton
            variant="link"
            :to="`/admin/pages/${item.id}`"
          >
            Edit
          </BaseButton>
          <BaseButton
            variant="link"
            class="text-red-500 hover:text-red-600"
            @click="confirmDelete(item)"
          >
            Delete
          </BaseButton>
          <BaseButton
            variant="link"
            :to="`/admin/pages/${item.id}/sections`"
            class="text-primary hover:text-primary-light"
          >
            Sections
          </BaseButton>
        </div>
      </template>
    </DataTable>

    <Modal
      v-model:is-open="isDeleteModalOpen"
      title="Delete Page"
      confirm-text="Delete"
      :loading="deleting"
      @confirm="handleDelete"
      @close="closeDeleteModal"
    >
      <p class="text-text-secondary">
        Are you sure you want to delete "{{ pageToDelete?.title }}"? This action cannot be undone.
      </p>
    </Modal>
  </div>
</template>
