<script setup lang="ts">
import DataTable from '~/components/admin/DataTable.vue'
import Modal from '~/components/admin/Modal.vue'
import StatusBadge from '~/components/admin/StatusBadge.vue'

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
  { key: 'status', label: 'Status' },
  { key: 'createdAt', label: 'Created At' },
]

const currentPage = ref(1)
const pageSize = ref(10)
const sortKey = ref('')
const filter = ref('')

const queryParams = computed(() => ({
  limit: pageSize.value,
  offset: (currentPage.value - 1) * pageSize.value,
}))

interface BlogPost {
  id: number
  title: string
  status: string
  createdAt: string
  [key: string]: any
}

const { data: postsData, status, refresh } = await useFetch<{ results: BlogPost[], totalResults: number, limit: number, offset: number }>('/blog-posts', {
  baseURL: config.public.apiBase,
  query: queryParams,
  onRequest({ options }) {
    if (authStore.token) {
      options.headers = new Headers(options.headers)
      options.headers.set('Authorization', `Bearer ${authStore.token}`)
    }
  },
})

const posts = computed(() => postsData.value?.results || [])
const total = computed(() => postsData.value?.totalResults || 0)
const loading = computed(() => status.value === 'pending')

const deleting = ref(false)
const isDeleteModalOpen = ref(false)
const postToDelete = ref<any>(null)

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

function confirmDelete(post: any) {
  postToDelete.value = post
  isDeleteModalOpen.value = true
}

function closeDeleteModal() {
  isDeleteModalOpen.value = false
  postToDelete.value = null
}

async function handleDelete() {
  if (!postToDelete.value)
    return

  deleting.value = true
  try {
    await del(`/blog-posts/${postToDelete.value.id}`)
    toast.success('Blog post deleted successfully')
    closeDeleteModal()
    refresh()
  }
  catch (err) {
    console.error(err)
    toast.error('Failed to delete blog post')
  }
  finally {
    deleting.value = false
  }
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
</script>

<template>
  <div>
    <DataTable
      title="Blog Posts"
      :columns="columns"
      :data="posts"
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
        <BaseButton variant="primary" to="/admin/blog/create">
          Create Post
        </BaseButton>
      </template>
      <template #cell-status="{ item }">
        <StatusBadge :status="item.status" type="blog" />
      </template>
      <template #cell-createdAt="{ value }">
        {{ formatDate(value) }}
      </template>
      <template #rowActions="{ item }">
        <BaseButton
          variant="link"
          :to="`/admin/blog/${item.id}`"
        >
          Edit
        </BaseButton>
        <BaseButton
          variant="link"
          @click="confirmDelete(item)"
        >
          Delete
        </BaseButton>
      </template>
    </DataTable>

    <Modal
      v-model:is-open="isDeleteModalOpen"
      title="Delete Post"
      confirm-text="Delete"
      :loading="deleting"
      @confirm="handleDelete"
      @close="closeDeleteModal"
    >
      <p class="text-text-secondary">
        Are you sure you want to delete "{{ postToDelete?.title }}"? This action cannot be undone.
      </p>
    </Modal>
  </div>
</template>
