<script setup lang="ts">
interface Props {
  accept?: string
  multiple?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  accept: 'image/*',
  multiple: false,
  disabled: false,
})

const emit = defineEmits<{
  fileSelected: [files: File[]]
}>()

const fileInput = ref<HTMLInputElement>()
const isDragging = ref(false)

const dragText = computed(() => {
  return isDragging.value
    ? 'Drop files here'
    : props.multiple
      ? 'Drop files here or click to select'
      : 'Drop file here or click to select'
})

const helperText = computed(() => {
  return `Max size: 10MB. Supported: ${props.accept}`
})

function openFileDialog() {
  fileInput.value?.click()
}

function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement
  const files = Array.from(target.files || [])
  if (files.length > 0) {
    emit('fileSelected', files)
  }
  target.value = ''
}

function handleDragOver() {
  isDragging.value = true
}

function handleDragLeave() {
  isDragging.value = false
}

function handleDrop(event: DragEvent) {
  isDragging.value = false
  const files = Array.from(event.dataTransfer?.files || [])
  if (files.length > 0) {
    emit('fileSelected', files)
  }
}
</script>

<template>
  <div
    class="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors"
    :class="[
      isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400',
      disabled ? 'cursor-not-allowed opacity-50' : '',
    ]"
    @click="!disabled && openFileDialog()"
    @dragover.prevent="handleDragOver"
    @dragleave.prevent="handleDragLeave"
    @drop.prevent="handleDrop"
  >
    <input
      ref="fileInput"
      type="file"
      class="hidden"
      :accept="accept"
      :multiple="multiple"
      @change="handleFileSelect"
    >
    <svg
      class="mx-auto h-12 w-12 text-gray-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
      />
    </svg>
    <p class="mt-2 text-sm text-gray-600">
      {{ dragText }}
    </p>
    <p class="mt-1 text-xs text-gray-500">
      {{ helperText }}
    </p>
  </div>
</template>
