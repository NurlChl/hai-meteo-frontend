<script setup lang="ts">
import type { FetchError } from '~/types'
import FormInput from '~/components/admin/FormInput.vue'
import Modal from '~/components/admin/Modal.vue'
import Pagination from '~/components/admin/Pagination.vue'
import { getMediaFilename } from '~/utils/mediaFilename'

definePageMeta({
  layout: 'admin',
  middleware: 'auth',
})

const { get, del, upload } = useApi()
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

const isUploadModalOpen = ref(false)
const uploading = ref(false)
const uploadForm = ref({
  file: null as File | null,
  altText: '',
  width: '',
  height: '',
})

const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const fileInputRef = ref<HTMLInputElement | null>(null)

function getUploadErrorMessage(error: unknown, fallback: string): string {
  const fetchError = error as FetchError
  return fetchError.data?.message || fetchError.message || fallback
}

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

function openUploadModal() {
  uploadForm.value = {
    file: null,
    altText: '',
    width: '',
    height: '',
  }
  isUploadModalOpen.value = true
}

function closeUploadModal() {
  isUploadModalOpen.value = false
  uploadForm.value = {
    file: null,
    altText: '',
    width: '',
    height: '',
  }
}

function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    uploadForm.value.file = target.files[0]
  }
}

function triggerFileInput() {
  fileInputRef.value?.click()
}

async function handleUpload() {
  if (!uploadForm.value.file) {
    toast.error('Please select a file')
    return
  }

  uploading.value = true
  try {
    const formData = new FormData()
    formData.append('file', uploadForm.value.file)
    if (uploadForm.value.altText) {
      formData.append('altText', uploadForm.value.altText)
    }
    if (uploadForm.value.width) {
      formData.append('width', uploadForm.value.width.toString())
    }
    if (uploadForm.value.height) {
      formData.append('height', uploadForm.value.height.toString())
    }

    await upload('/media-assets/upload', formData)
    toast.success('Media uploaded successfully')
    closeUploadModal()
    await loadMedia()
  }
  catch (err) {
    console.error(err)
    toast.error(getUploadErrorMessage(err, 'Failed to upload media'))
  }
  finally {
    uploading.value = false
  }
}

function confirmDelete(media: { id: number }) {
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
        <BaseButton variant="primary" @click="openUploadModal">
          Upload Media
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
            <NuxtImg
              :src="media.fileUrl"
              :alt="media.altText || 'Media'"
              class="w-full h-48 object-cover"
            />
          </div>
          <div class="p-4">
            <p class="text-sm font-medium text-text-primary truncate">
              {{ getMediaFilename(media.fileUrl) }}
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
      v-model:is-open="isUploadModalOpen"
      title="Upload Media"
      confirm-text="Upload"
      :loading="uploading"
      @confirm="handleUpload"
      @close="closeUploadModal"
    >
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-text-secondary mb-2">
            File <span class="text-red-500">*</span>
          </label>
          <input
            ref="fileInputRef"
            type="file"
            accept="image/*"
            class="hidden"
            @change="handleFileSelect"
          >
          <div
            class="border-2 border-dashed border-white/20 rounded-xl p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
            @click="triggerFileInput"
          >
            <div v-if="uploadForm.file" class="space-y-2">
              <p class="text-text-primary font-medium">
                {{ uploadForm.file.name }}
              </p>
              <p class="text-text-muted text-sm">
                {{ (uploadForm.file.size / 1024 / 1024).toFixed(2) }} MB
              </p>
            </div>
            <div v-else class="space-y-2">
              <svg class="w-12 h-12 mx-auto text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p class="text-text-muted">
                Click to select an image
              </p>
              <p class="text-text-muted text-xs">
                PNG, JPG, GIF, WebP, SVG (max 10MB)
              </p>
            </div>
          </div>
        </div>
        <FormInput
          v-model="uploadForm.altText"
          label="Alt Text"
          placeholder="Description of the image"
        />
        <div class="grid grid-cols-2 gap-4">
          <FormInput
            v-model="uploadForm.width"
            type="number"
            label="Width"
            placeholder="Width in pixels"
          />
          <FormInput
            v-model="uploadForm.height"
            type="number"
            label="Height"
            placeholder="Height in pixels"
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
