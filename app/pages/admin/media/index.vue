<script setup lang="ts">
import FormInput from '~/components/admin/FormInput.vue'
import Modal from '~/components/admin/Modal.vue'
import Pagination from '~/components/admin/Pagination.vue'

definePageMeta({
  layout: 'admin',
  middleware: 'auth',
})

const { get, post, del } = useApi()
const toast = useToast()

const mediaAssets = ref<
  Array<{
    id: number
    fileUrl: string
    altText: string
    mimeType: string
    width: number
    height: number
  }>
>([])
const deleting = ref(false)
const isDeleteModalOpen = ref(false)
const mediaToDelete = ref<{ id: number } | null>(null)

const isCreateModalOpen = ref(false)
const creating = ref(false)
const createForm = ref({
  fileUrl: '',
  altText: '',
  mimeType: 'image/jpeg',
  width: 0,
  height: 0,
})

const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

async function loadMedia() {
  try {
    const response = (await get('/media-assets', {
      query: {
        limit: pageSize.value,
        offset: (currentPage.value - 1) * pageSize.value,
      },
    })) as {
      results: Array<{
        id: number
        fileUrl: string
        altText: string
        mimeType: string
        width: number
        height: number
      }>
      totalResults: number
    }

    mediaAssets.value = response.results || []
    total.value = response.totalResults || 0
  }
  catch (err) {
    console.error(err)
    toast.error('Failed to load media assets')
  }
}

function handlePageChange(page: number) {
  currentPage.value = page
  loadMedia()
}

function openCreateModal() {
  createForm.value = {
    fileUrl: '',
    altText: '',
    mimeType: 'image/jpeg',
    width: 800,
    height: 600,
  }
  isCreateModalOpen.value = true
}

function closeCreateModal() {
  isCreateModalOpen.value = false
}

async function handleCreate() {
  creating.value = true
  try {
    await post('/media-assets', {
      ...createForm.value,
      width: Number(createForm.value.width),
      height: Number(createForm.value.height),
    })
    toast.success('Media asset created successfully')
    closeCreateModal()
    await loadMedia()
  }
  catch (err) {
    console.error(err)
    toast.error('Failed to create media asset')
  }
  finally {
    creating.value = false
  }
}

function confirmDelete(media: any) {
  mediaToDelete.value = media
  isDeleteModalOpen.value = true
}

function closeDeleteModal() {
  isDeleteModalOpen.value = false
  mediaToDelete.value = null
}

async function handleDelete() {
  if (!mediaToDelete.value)
    return

  deleting.value = true
  try {
    await del(`/media-assets/${mediaToDelete.value!.id}`)
    toast.success('Media deleted successfully')
    closeDeleteModal()
    await loadMedia()
  }
  catch (err) {
    console.error(err)
    toast.error('Failed to delete media')
  }
  finally {
    deleting.value = false
  }
}

onMounted(() => {
  loadMedia()
})
</script>

<template>
  <div>
    <BaseCard title="Media Library">
      <template #actions>
        <BaseButton variant="primary" @click="openCreateModal">
          Create Media
        </BaseButton>
      </template>

      <div v-if="mediaAssets.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <BaseCard
          v-for="media in mediaAssets"
          :key="media.id"
          :no-padding="true"
          class="overflow-hidden shadow-card hover:shadow-glow transition-shadow duration-300"
        >
          <div style="aspect-ratio: 16 / 9" class="bg-bg-surface">
            <img
              :src="media.fileUrl"
              :alt="media.altText || 'Media'"
              class="w-full h-48 object-cover"
            >
          </div>
          <div class="p-4">
            <p class="text-sm font-medium text-text-primary truncate">
              {{ media.fileUrl.split('/').pop() }}
            </p>
            <p class="text-xs text-text-muted mt-1">
              {{ media.mimeType }}
            </p>
            <div class="flex justify-between items-center mt-2">
              <span class="text-xs text-text-muted"> {{ media.width }}x{{ media.height }} </span>
              <BaseButton variant="link" @click="confirmDelete(media)">
                Delete
              </BaseButton>
            </div>
          </div>
        </BaseCard>
      </div>

      <div v-else class="text-center py-12 text-text-muted">
        No media assets found
      </div>

      <template #footer>
        <div class="w-full">
          <Pagination
            v-if="total > 0"
            :current-page="currentPage"
            :page-size="pageSize"
            :total="total"
            @page-change="handlePageChange"
          />
        </div>
      </template>
    </BaseCard>

    <Modal
      v-model:is-open="isCreateModalOpen"
      title="Create Media Asset"
      confirm-text="Create"
      :loading="creating"
      @confirm="handleCreate"
      @close="closeCreateModal"
    >
      <div class="space-y-4">
        <FormInput
          v-model="createForm.fileUrl"
          label="File URL"
          placeholder="https://example.com/image.jpg"
          required
        />
        <FormInput
          v-model="createForm.altText"
          label="Alt Text"
          placeholder="Description of the image"
        />
        <FormInput
          v-model="createForm.mimeType"
          label="MIME Type"
          placeholder="image/jpeg"
        />
        <div class="grid grid-cols-2 gap-4">
          <FormInput
            v-model="createForm.width"
            label="Width"
            type="number"
          />
          <FormInput
            v-model="createForm.height"
            label="Height"
            type="number"
          />
        </div>
      </div>
    </Modal>

    <Modal
      v-model:is-open="isDeleteModalOpen"
      title="Delete Media"
      confirm-text="Delete"
      :loading="deleting"
      @confirm="handleDelete"
      @close="closeDeleteModal"
    >
      <p class="text-text-secondary">
        Are you sure you want to delete this media asset?
      </p>
    </Modal>
  </div>
</template>
