<script setup lang="ts">
import type { FAQ } from '~/types/models'
import DataTable from '~/components/admin/DataTable.vue'
import Modal from '~/components/admin/Modal.vue'

definePageMeta({
  layout: 'admin',
  middleware: 'auth',
})

const { get, del } = useApi()
const toast = useToast()

const columns = [
  { key: 'question', label: 'Question' },
  { key: 'sortOrder', label: 'Order' },
  { key: 'isPublished', label: 'Status' },
  { key: 'createdAt', label: 'Created At' },
]

const faqs = ref<FAQ[]>([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const sortKey = ref('')
const filter = ref('')

const deleting = ref(false)
const isDeleteModalOpen = ref(false)
const faqToDelete = ref<FAQ | null>(null)

async function loadFAQs() {
  loading.value = true
  try {
    const response = (await get('/faqs', {
      query: {
        limit: pageSize.value,
        offset: (currentPage.value - 1) * pageSize.value,
        search: filter.value || undefined,
      },
    })) as { results: FAQ[], totalResults: number, limit: number, offset: number }

    faqs.value = response.results || []
    total.value = response.totalResults || 0
  }
  catch (err) {
    console.error(err)
    toast.error('Failed to load FAQs')
  }
  finally {
    loading.value = false
  }
}

function handleSort(key: string) {
  sortKey.value = sortKey.value === key ? '' : key
  currentPage.value = 1
  loadFAQs()
}

function handleSearch(query: string) {
  filter.value = query
  currentPage.value = 1
  loadFAQs()
}

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--
    loadFAQs()
  }
}

function nextPage() {
  const totalPages = Math.ceil(total.value / pageSize.value)
  if (currentPage.value < totalPages) {
    currentPage.value++
    loadFAQs()
  }
}

function editFAQ(faq: FAQ) {
  navigateTo(`/admin/faqs/${faq.id}`)
}

function confirmDelete(faq: FAQ) {
  faqToDelete.value = faq
  isDeleteModalOpen.value = true
}

function closeDeleteModal() {
  isDeleteModalOpen.value = false
  faqToDelete.value = null
}

async function handleDelete() {
  if (!faqToDelete.value)
    return

  deleting.value = true
  try {
    await del(`/faqs/${faqToDelete.value.id}`)
    toast.success('FAQ deleted successfully')
    closeDeleteModal()
    loadFAQs()
  }
  catch (err) {
    console.error(err)
    toast.error('Failed to delete FAQ')
  }
  finally {
    deleting.value = false
  }
}

onMounted(() => {
  loadFAQs()
})
</script>

<template>
  <div>
    <DataTable
      title="FAQs"
      :columns="columns"
      :data="faqs"
      :loading="loading"
      :current-page="currentPage"
      :page-size="pageSize"
      :total="total"
      show-search
      @sort="handleSort"
      @search="handleSearch"
      @prev-page="prevPage"
      @next-page="nextPage"
      @refresh="loadFAQs"
    >
      <template #actions>
        <BaseButton variant="primary" to="/admin/faqs/create">
          Create FAQ
        </BaseButton>
      </template>
      <template #cell-isPublished="{ item }">
        <BaseBadge :variant="item.isPublished ? 'success' : 'warning'" size="sm">
          {{ item.isPublished ? 'Published' : 'Draft' }}
        </BaseBadge>
      </template>
      <template #rowActions="{ item }">
        <div class="flex items-center gap-2">
          <BaseButton variant="link" @click="editFAQ(item)">
            Edit
          </BaseButton>
          <BaseButton variant="link" class="text-red-500 hover:text-red-600" @click="confirmDelete(item)">
            Delete
          </BaseButton>
        </div>
      </template>
    </DataTable>

    <Modal
      v-model:is-open="isDeleteModalOpen"
      title="Delete FAQ"
      confirm-text="Delete"
      :loading="deleting"
      @confirm="handleDelete"
      @close="closeDeleteModal"
    >
      <p class="text-text-secondary">
        Are you sure you want to delete this FAQ? This action cannot be undone.
      </p>
    </Modal>
  </div>
</template>
