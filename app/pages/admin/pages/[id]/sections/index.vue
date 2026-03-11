<script setup lang="ts">
import DataTable from '~/components/admin/DataTable.vue'
import Modal from '~/components/admin/Modal.vue'

definePageMeta({
  layout: 'admin',
  middleware: 'auth',
})

const route = useRoute()
const { get, del } = useApi()
const toast = useToast()

const pageId = computed(() => Number(route.params.id))
const pageName = ref('')

interface PageSection {
  id: number
  sectionKey: string
  sortOrder: number
  isEnabled: boolean
  [key: string]: unknown
}

const columns = [
  { key: 'sectionKey', label: 'Key' },
  { key: 'sortOrder', label: 'Order' },
  { key: 'isEnabled', label: 'Status' },
]

const sections = ref<PageSection[]>([])
const total = ref(0)
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)

const deleting = ref(false)
const isDeleteModalOpen = ref(false)
const sectionToDelete = ref<PageSection | null>(null)

async function loadPage() {
  try {
    const response = await get(`/pages/${pageId.value}`) as { title?: string }
    pageName.value = response.title || `Page #${pageId.value}`
  }
  catch (err) {
    console.error(err)
    pageName.value = `Page #${pageId.value}`
  }
}

async function loadSections() {
  loading.value = true
  try {
    const response = await get('/page-sections', {
      query: {
        pageId: pageId.value,
        limit: pageSize.value,
        offset: (currentPage.value - 1) * pageSize.value,
      },
    }) as { results: PageSection[], totalResults: number }
    sections.value = response.results || []
    total.value = response.totalResults || 0
  }
  catch (err) {
    console.error(err)
    toast.error('Failed to load sections')
    sections.value = []
    total.value = 0
  }
  finally {
    loading.value = false
  }
}

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--
    loadSections()
  }
}

function nextPage() {
  const totalPages = Math.ceil(total.value / pageSize.value)
  if (currentPage.value < totalPages) {
    currentPage.value++
    loadSections()
  }
}

function confirmDelete(section: PageSection) {
  sectionToDelete.value = section
  isDeleteModalOpen.value = true
}

function closeDeleteModal() {
  isDeleteModalOpen.value = false
  sectionToDelete.value = null
}

async function handleDelete() {
  if (!sectionToDelete.value)
    return

  deleting.value = true
  try {
    await del(`/page-sections/${sectionToDelete.value.id}`)
    toast.success('Section deleted successfully')
    closeDeleteModal()
    loadSections()
  }
  catch (err) {
    console.error(err)
    toast.error('Failed to delete section')
  }
  finally {
    deleting.value = false
  }
}

onMounted(() => {
  loadPage()
  loadSections()
})
</script>

<template>
  <div>
    <DataTable
      :title="`Sections for: ${pageName}`"
      :columns="columns"
      :data="sections"
      :loading="loading"
      :current-page="currentPage"
      :page-size="pageSize"
      :total="total"
      @prev-page="prevPage"
      @next-page="nextPage"
      @refresh="loadSections"
    >
      <template #actions>
        <BaseButton variant="secondary" to="/admin/pages">
          Back to Pages
        </BaseButton>
        <BaseButton variant="primary" :to="`/admin/pages/${pageId}/sections/create`">
          Create Section
        </BaseButton>
      </template>
      <template #cell-isEnabled="{ item }">
        <BaseBadge :variant="item.isEnabled ? 'success' : 'warning'" size="sm">
          {{ item.isEnabled ? 'Enabled' : 'Disabled' }}
        </BaseBadge>
      </template>
      <template #rowActions="{ item }">
        <div class="flex items-center gap-2">
          <BaseButton
            variant="link"
            :to="`/admin/pages/${pageId}/sections/${item.id}`"
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
      title="Delete Section"
      confirm-text="Delete"
      :loading="deleting"
      @confirm="handleDelete"
      @close="closeDeleteModal"
    >
      <p class="text-text-secondary">
        Are you sure you want to delete section "{{ sectionToDelete?.sectionKey }}"? This action cannot be undone.
      </p>
    </Modal>
  </div>
</template>
