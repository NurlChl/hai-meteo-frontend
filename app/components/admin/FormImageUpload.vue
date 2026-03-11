<script setup lang="ts">
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
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  required: false,
  error: '',
  helperText: '',
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: number | null]
}>()

const { get, upload } = useApi()
const toast = useToast()

const selectedMedia = ref<MediaAsset | null>(null)
const uploading = ref(false)
const fileInputRef = ref<HTMLInputElement | null>(null)

async function loadSelectedMedia() {
  if (!props.modelValue) {
    selectedMedia.value = null
    return
  }

  try {
    const response = (await get(`/media-assets/${props.modelValue}`)) as MediaAsset
    selectedMedia.value = response
  }
  catch (err) {
    console.error('Failed to load media:', err)
    selectedMedia.value = null
  }
}

function triggerFileInput() {
  if (props.disabled)
    return
  fileInputRef.value?.click()
}

async function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement
  if (!target.files || !target.files[0])
    return

  const file = target.files[0]
  uploading.value = true

  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('altText', file.name)

    const response = (await upload('/media-assets/upload', formData)) as MediaAsset
    selectedMedia.value = response
    emit('update:modelValue', response.id)
    toast.success('Image uploaded successfully')
  }
  catch (err) {
    console.error('Failed to upload:', err)
    toast.error('Failed to upload image')
  }
  finally {
    uploading.value = false
    if (fileInputRef.value) {
      fileInputRef.value.value = ''
    }
  }
}

function removeMedia() {
  selectedMedia.value = null
  emit('update:modelValue', null)
}

watch(() => props.modelValue, loadSelectedMedia, { immediate: true })
</script>

<template>
  <div class="mb-4">
    <label v-if="label" class="block text-sm font-medium text-text-secondary mb-2">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>

    <input
      ref="fileInputRef"
      type="file"
      accept="image/*"
      class="hidden"
      :disabled="disabled"
      @change="handleFileSelect"
    >

    <div v-if="selectedMedia" class="relative rounded-xl overflow-hidden bg-white/5 border border-white/10">
      <div class="flex items-center gap-4 p-4">
        <div class="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-white/5">
          <NuxtImg
            :src="selectedMedia.fileUrl"
            :alt="selectedMedia.altText || 'Preview'"
            class="w-full h-full object-cover"
          />
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-text-primary truncate">
            {{ selectedMedia.fileUrl.split('/').pop() }}
          </p>
          <p class="text-xs text-text-muted mt-1">
            {{ selectedMedia.mimeType }}
          </p>
        </div>
        <div class="flex gap-2">
          <button
            type="button"
            class="p-2 rounded-lg hover:bg-white/10 text-text-secondary transition-colors"
            title="Change image"
            :disabled="disabled || uploading"
            @click="triggerFileInput"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </button>
          <button
            type="button"
            class="p-2 rounded-lg hover:bg-red-500/20 text-red-500 transition-colors"
            title="Remove image"
            :disabled="disabled"
            @click="removeMedia"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <div
      v-else
      class="border-2 border-dashed rounded-xl p-6 text-center transition-colors" :class="[
        disabled ? 'opacity-50 cursor-not-allowed border-white/10' : 'cursor-pointer border-white/20 hover:border-primary/50',
        error ? 'border-red-500/50' : '',
      ]"
      @click="triggerFileInput"
    >
      <div v-if="uploading" class="space-y-2">
        <div class="w-8 h-8 mx-auto border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <p class="text-text-muted">
          Uploading...
        </p>
      </div>
      <div v-else class="space-y-2">
        <svg class="w-10 h-10 mx-auto text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        <p class="text-text-muted text-sm">
          Click to upload an image
        </p>
        <p class="text-text-muted text-xs">
          PNG, JPG, GIF, WebP, SVG
        </p>
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
