<script setup lang="ts">
import type { ChatQuestion } from '~/types/models'
import DataTable from '~/components/admin/DataTable.vue'
import Modal from '~/components/admin/Modal.vue'

definePageMeta({
  layout: 'admin',
  middleware: 'auth',
})

const { get, del } = useApi()
const toast = useToast()

const columns = [
  { key: 'question', label: 'Pertanyaan' },
  { key: 'sortOrder', label: 'Urutan' },
  { key: 'isEnabled', label: 'Status' },
  { key: 'createdAt', label: 'Dibuat' },
]

const questions = ref<ChatQuestion[]>([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const deleting = ref(false)
const isDeleteModalOpen = ref(false)
const questionToDelete = ref<ChatQuestion | null>(null)

async function loadQuestions() {
  loading.value = true
  try {
    const response = (await get('/chat-questions', {
      query: {
        limit: pageSize.value,
        offset: (currentPage.value - 1) * pageSize.value,
      },
    })) as { results: ChatQuestion[], totalResults: number }

    questions.value = response.results || []
    total.value = response.totalResults || 0
  }
  catch (err) {
    console.error(err)
    toast.error('Gagal memuat pertanyaan')
  }
  finally {
    loading.value = false
  }
}

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--
    loadQuestions()
  }
}

function nextPage() {
  const totalPages = Math.ceil(total.value / pageSize.value)
  if (currentPage.value < totalPages) {
    currentPage.value++
    loadQuestions()
  }
}

function editQuestion(q: ChatQuestion) {
  navigateTo(`/admin/chat-questions/${q.id}`)
}

function confirmDelete(q: ChatQuestion) {
  questionToDelete.value = q
  isDeleteModalOpen.value = true
}

function closeDeleteModal() {
  isDeleteModalOpen.value = false
  questionToDelete.value = null
}

async function handleDelete() {
  if (!questionToDelete.value)
    return

  deleting.value = true
  try {
    await del(`/chat-questions/${questionToDelete.value.id}`)
    toast.success('Pertanyaan berhasil dihapus')
    closeDeleteModal()
    loadQuestions()
  }
  catch (err) {
    console.error(err)
    toast.error('Gagal menghapus pertanyaan')
  }
  finally {
    deleting.value = false
  }
}

onMounted(() => {
  loadQuestions()
})
</script>

<template>
  <div>
    <DataTable
      title="Chat Questions"
      :columns="columns"
      :data="questions"
      :loading="loading"
      :current-page="currentPage"
      :page-size="pageSize"
      :total="total"
      @prev-page="prevPage"
      @next-page="nextPage"
      @refresh="loadQuestions"
    >
      <template #actions>
        <BaseButton variant="primary" to="/admin/chat-questions/create">
          Tambah Pertanyaan
        </BaseButton>
      </template>
      <template #cell-isEnabled="{ item }">
        <BaseBadge :variant="item.isEnabled ? 'success' : 'warning'" size="sm">
          {{ item.isEnabled ? 'Aktif' : 'Nonaktif' }}
        </BaseBadge>
      </template>
      <template #rowActions="{ item }">
        <div class="flex items-center gap-2">
          <BaseButton variant="link" @click="editQuestion(item)">
            Edit
          </BaseButton>
          <BaseButton variant="link" class="text-red-500 hover:text-red-600" @click="confirmDelete(item)">
            Hapus
          </BaseButton>
        </div>
      </template>
    </DataTable>

    <Modal
      v-model:is-open="isDeleteModalOpen"
      title="Hapus Pertanyaan"
      confirm-text="Hapus"
      :loading="deleting"
      @confirm="handleDelete"
      @close="closeDeleteModal"
    >
      <p class="text-text-secondary">
        Yakin ingin menghapus pertanyaan ini? Tindakan ini tidak dapat dibatalkan.
      </p>
    </Modal>
  </div>
</template>
