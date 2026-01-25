<script setup lang="ts">
import DataTable from '~/components/admin/DataTable.vue'
import Modal from '~/components/admin/Modal.vue'
import StatusBadge from '~/components/admin/StatusBadge.vue'
import BaseButton from '~/components/base/Button.vue'
import BaseInput from '~/components/base/Input.vue'

definePageMeta({
  layout: 'admin',
  middleware: 'auth',
})

const { get, patch } = useApi()
const toast = useToast()

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'subject', label: 'Subject' },
  { key: 'status', label: 'Status' },
  { key: 'createdAt', label: 'Received' },
]

interface Message {
  id: number
  name: string
  email: string
  subject: string
  status: string
  createdAt: string
  company?: string
  message?: string
  [key: string]: any
}

const messages = ref<Message[]>([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const sortKey = ref('')
const filter = ref('')

const isViewModalOpen = ref(false)
const selectedMessage = ref<Message | null>(null)

async function loadMessages() {
  loading.value = true
  try {
    const response = (await get('/contact-messages', {
      query: {
        limit: pageSize.value,
        offset: (currentPage.value - 1) * pageSize.value,

      },
    })) as { results: Message[], totalResults: number, limit: number, offset: number }

    messages.value = response.results || []
    total.value = response.totalResults || 0
  }
  catch (err) {
    console.error(err)
    toast.error('Failed to load messages')
  }
  finally {
    loading.value = false
  }
}

function handleSort(key: string) {
  sortKey.value = sortKey.value === key ? '' : key
  currentPage.value = 1
  loadMessages()
}

function handleSearch(query: string) {
  filter.value = query
  currentPage.value = 1
  loadMessages()
}

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--
    loadMessages()
  }
}

function nextPage() {
  const totalPages = Math.ceil(total.value / pageSize.value)
  if (currentPage.value < totalPages) {
    currentPage.value++
    loadMessages()
  }
}

function viewMessage(message: Message) {
  selectedMessage.value = { ...message }
  isViewModalOpen.value = true
}

function closeViewModal() {
  isViewModalOpen.value = false
  selectedMessage.value = null
}

async function updateStatus() {
  if (!selectedMessage.value)
    return

  try {
    await patch(`/contact-messages/${selectedMessage.value!.id}`, {
      status: selectedMessage.value!.status,
    })
    toast.success('Message status updated')
    await loadMessages()
  }
  catch (err) {
    console.error(err)
    toast.error('Failed to update message status')
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
  loadMessages()
})
</script>

<template>
  <div>
    <DataTable
      title="Contact Messages"
      :columns="columns"
      :data="messages"
      :loading="loading"
      :current-page="currentPage"
      :page-size="pageSize"
      :total="total"
      @sort="handleSort"
      @search="handleSearch"
      @prev-page="prevPage"
      @next-page="nextPage"
      @refresh="loadMessages"
    >
      <template #cell-status="{ item }">
        <StatusBadge :status="item.status" type="message" />
      </template>
      <template #cell-createdAt="{ value }">
        {{ formatDate(value) }}
      </template>
      <template #rowActions="{ item }">
        <BaseButton variant="link" @click="viewMessage(item)">
          View
        </BaseButton>
      </template>
    </DataTable>

    <Modal
      v-model:is-open="isViewModalOpen"
      title="Message Details"
      :show-footer="false"
      @close="closeViewModal"
    >
      <div v-if="selectedMessage" class="space-y-4">
        <div>
          <p class="text-sm font-medium text-text-secondary">
            From
          </p>
          <p class="text-lg font-semibold text-text-primary">
            {{ selectedMessage.name }}
            <span class="text-sm font-normal text-text-muted">({{ selectedMessage.email }})</span>
          </p>
        </div>
        <div v-if="selectedMessage.company">
          <p class="text-sm font-medium text-text-secondary">
            Company
          </p>
          <p class="text-text-primary">
            {{ selectedMessage.company }}
          </p>
        </div>
        <div v-if="selectedMessage.subject">
          <p class="text-sm font-medium text-text-secondary">
            Subject
          </p>
          <p class="text-text-primary">
            {{ selectedMessage.subject }}
          </p>
        </div>
        <div>
          <p class="text-sm font-medium text-text-secondary">
            Message
          </p>
          <p class="text-text-primary whitespace-pre-wrap">
            {{ selectedMessage.message }}
          </p>
        </div>
        <div class="pt-4">
          <BaseInput
            v-if="selectedMessage"
            v-model="selectedMessage.status"
            type="select"
            :options="[
              { label: 'New', value: 'new' },
              { label: 'In Progress', value: 'in_progress' },
              { label: 'Done', value: 'done' },
              { label: 'Spam', value: 'spam' },
            ]"
            @blur="updateStatus"
          />
        </div>
      </div>
    </Modal>
  </div>
</template>
