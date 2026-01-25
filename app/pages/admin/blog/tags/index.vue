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
  { key: 'name', label: 'Name' },
  { key: 'slug', label: 'Slug' },
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

interface BlogTag {
  id: number
  name: string
  slug: string
  [key: string]: any
}

const { data: tagsData, status, refresh } = await useFetch<{ results: BlogTag[], totalResults: number, limit: number, offset: number }>('/blog-tags', {
  baseURL: config.public.apiBase,
  query: queryParams,
  onRequest({ options }) {
    if (authStore.token) {
      options.headers = new Headers(options.headers)
      options.headers.set('Authorization', `Bearer ${authStore.token}`)
    }
  },
})

const tags = computed(() => tagsData.value?.results || [])
const total = computed(() => tagsData.value?.totalResults || 0)
const loading = computed(() => status.value === 'pending')

const deleting = ref(false)
const isDeleteModalOpen = ref(false)
const tagToDelete = ref<any>(null)

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

function confirmDelete(tag: any) {
  tagToDelete.value = tag
  isDeleteModalOpen.value = true
}

function closeDeleteModal() {
  isDeleteModalOpen.value = false
  tagToDelete.value = null
}

async function handleDelete() {
  if (!tagToDelete.value)
    return

  deleting.value = true
  try {
    await del(`/blog-tags/${tagToDelete.value.id}`)
    toast.success('Blog tag deleted successfully')
    closeDeleteModal()
    refresh()
  }
  catch (err) {
    console.error(err)
    toast.error('Failed to delete blog tag')
  }
  finally {
    deleting.value = false
  }
}
</script>

<template>
  <div>
    <DataTable
      title="Blog Tags"
      :columns="columns"
      :data="tags"
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
        <BaseButton variant="primary" to="/admin/blog/tags/create">
          Create Tag
        </BaseButton>
      </template>
      <template #rowActions="{ item }">
        <div class="flex items-center gap-2">
          <BaseButton
            variant="link"
            :to="`/admin/blog/tags/${item.id}`"
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
        </div>
      </template>
    </DataTable>

    <Modal
      v-model:is-open="isDeleteModalOpen"
      title="Delete Tag"
      confirm-text="Delete"
      :loading="deleting"
      @confirm="handleDelete"
      @close="closeDeleteModal"
    >
      <p class="text-text-secondary">
        Are you sure you want to delete "{{ tagToDelete?.name }}"? This action cannot be undone.
      </p>
    </Modal>
  </div>
</template>
