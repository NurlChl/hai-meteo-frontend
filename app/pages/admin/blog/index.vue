<script setup lang="ts">
import DataTable from '~/components/admin/DataTable.vue'
import Modal from '~/components/admin/Modal.vue'
import StatusBadge from '~/components/admin/StatusBadge.vue'

definePageMeta({
  layout: 'admin',
  middleware: 'auth',
})

const { get, del } = useApi()
const toast = useToast()

const columns = [
  { key: 'title', label: 'Title' },
  { key: 'status', label: 'Status' },
  { key: 'createdAt', label: 'Created At' },
]

interface BlogPost {
  id: number
  title: string
  status: string
  createdAt: string
  [key: string]: unknown
}

const posts = ref<BlogPost[]>([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const sortKey = ref('')
const filter = ref('')

const deleting = ref(false)
const isDeleteModalOpen = ref(false)
const postToDelete = ref<BlogPost | null>(null)

async function loadPosts() {
  loading.value = true
  try {
    const response = (await get('/blog-posts', {
      query: {
        limit: pageSize.value,
        offset: (currentPage.value - 1) * pageSize.value,
        search: filter.value || undefined,
      },
    })) as { results: BlogPost[], totalResults: number }

    posts.value = response.results || []
    total.value = response.totalResults || 0
  }
  catch (err) {
    console.error(err)
    toast.error('Failed to load blog posts')
  }
  finally {
    loading.value = false
  }
}

function handleSort(key: string) {
  sortKey.value = sortKey.value === key ? '' : key
  currentPage.value = 1
  loadPosts()
}

function handleSearch(query: string) {
  filter.value = query
  currentPage.value = 1
  loadPosts()
}

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--
    loadPosts()
  }
}

function nextPage() {
  const totalPages = Math.ceil(total.value / pageSize.value)
  if (currentPage.value < totalPages) {
    currentPage.value++
    loadPosts()
  }
}

function confirmDelete(post: BlogPost) {
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
    loadPosts()
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

onMounted(() => {
  loadPosts()
})
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
      @refresh="loadPosts"
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
        {{ formatDate(value as string) }}
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
