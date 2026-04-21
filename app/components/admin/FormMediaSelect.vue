<script setup lang="ts">
import type { FetchError } from '~/types'
import { getMediaFilename } from '~/utils/mediaFilename'

interface MediaAsset {
  id: number
  fileUrl: string
  altText: string
  mimeType: string
  width: number
  height: number
}

interface Props {
  modelValue: number | null
  label?: string
  required?: boolean
  error?: string
  helperText?: string
  disabled?: boolean
  placeholder?: string
  showPreview?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  required: false,
  error: '',
  helperText: '',
  disabled: false,
  placeholder: 'Select a media asset',
  showPreview: true,
})

const emit = defineEmits<{
  'update:modelValue': [value: number | null]
}>()

const { get, upload } = useApi()
const toast = useToast()

const mediaAssets = ref<MediaAsset[]>([])
const loading = ref(false)
const uploading = ref(false)
const loadError = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

const selectedId = computed({
  get: () => props.modelValue?.toString() ?? '',
  set: (value: string | number | null) => {
    if (value === '' || value === null) {
      emit('update:modelValue', null)
      return
    }
    emit('update:modelValue', Number(value))
  },
})

const selectedMedia = computed(() => {
  if (!selectedId.value)
    return null
  return mediaAssets.value.find(m => m.id === Number(selectedId.value))
})

function getUploadErrorMessage(error: unknown, fallback: string): string {
  const fetchError = error as FetchError
  return fetchError.data?.message || fetchError.message || fallback
}

async function loadMediaAssets() {
  loading.value = true
  loadError.value = false

  try {
    const response = await get('/media-assets', {
      query: { limit: 100, offset: 0 },
    }) as { results: MediaAsset[] }

    mediaAssets.value = response.results || []
  }
  catch (err) {
    console.error('Failed to load media assets:', err)
    loadError.value = true
    mediaAssets.value = []
  }
  finally {
    loading.value = false
  }
}

function getMediaLabel(media: MediaAsset): string {
  const filename = getMediaFilename(media.fileUrl) || 'Unknown'
  const dimensions = `${media.width}x${media.height}`
  return `${filename} (${dimensions})`
}

async function handleFileUpload(event: Event) {
  const input = event.target as HTMLInputElement
  if (!input.files?.length)
    return

  const file = input.files[0]
  if (!file)
    return

  const formData = new FormData()
  formData.append('file', file)

  uploading.value = true
  try {
    const response = await upload('/media-assets/upload', formData) as MediaAsset

    await loadMediaAssets()
    selectedId.value = response.id.toString()
    toast.success('Media uploaded successfully')

    if (fileInput.value)
      fileInput.value.value = ''
  }
  catch (err) {
    console.error('Failed to upload file:', err)
    toast.error(getUploadErrorMessage(err, 'Failed to upload media asset'))
  }
  finally {
    uploading.value = false
  }
}

onMounted(() => {
  loadMediaAssets()
})
</script>

<template>
  <div class="mb-4">
    <label v-if="label" class="block text-sm font-medium text-text-secondary mb-2">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>

    <div class="space-y-3">
      <div class="flex gap-2">
        <select
          v-model="selectedId"
          :disabled="disabled || loading || uploading"
          :required="required"
          class="flex-1 px-4 py-3 rounded-xl border transition-all duration-300 outline-none focus:ring-2 text-text-primary appearance-none" :class="[
            error
              ? 'bg-red-500/5 border-red-500/50 focus:border-red-500 focus:ring-red-500/20'
              : 'bg-white/5 border-white/10 hover:border-white/20 focus:border-primary/50 focus:ring-primary/20',
            disabled || loading || uploading
              ? 'opacity-50 cursor-not-allowed'
              : 'cursor-pointer',
          ]"
        >
          <option value="" class="bg-bg-dark text-white">
            {{ loading ? 'Loading...' : placeholder }}
          </option>
          <option
            v-for="media in mediaAssets"
            :key="media.id"
            :value="media.id"
            class="bg-bg-dark text-white"
          >
            {{ getMediaLabel(media) }}
          </option>
        </select>

        <div class="relative">
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            class="hidden"
            @change="handleFileUpload"
          >
          <BaseButton
            type="button"
            variant="secondary"
            :loading="uploading"
            :disabled="disabled || loading"
            @click="fileInput?.click()"
          >
            Upload
          </BaseButton>
        </div>
      </div>

      <div
        v-if="loadError"
        class="text-sm text-yellow-600 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3"
      >
        Failed to load media assets. Using manual input instead.
      </div>

      <div
        v-if="showPreview && selectedMedia"
        class="relative rounded-xl overflow-hidden bg-white/5 border border-white/10 p-4"
      >
        <div class="flex items-start gap-4">
          <div class="flex-shrink-0 w-32 h-32 rounded-lg overflow-hidden bg-white/5">
            <NuxtImg
              :src="selectedMedia.fileUrl"
              :alt="selectedMedia.altText || 'Preview'"
              class="w-full h-full object-cover"
            />
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-text-primary truncate">
              {{ getMediaFilename(selectedMedia.fileUrl) }}
            </p>
            <p class="text-xs text-text-muted mt-1">
              {{ selectedMedia.mimeType }}
            </p>
            <p class="text-xs text-text-muted mt-1">
              {{ selectedMedia.width }} x {{ selectedMedia.height }}
            </p>
            <p v-if="selectedMedia.altText" class="text-xs text-text-secondary mt-2">
              {{ selectedMedia.altText }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <p v-if="error" class="mt-1 text-sm text-red-600">
      {{ error }}
    </p>
    <p v-else-if="helperText" class="mt-1 text-sm text-text-muted">
      {{ helperText }}
    </p>
  </div>
</template>
