<script setup lang="ts">
import type { SectionFieldSchema, SectionFieldType } from './sectionSchemas'
import type { FetchError } from '~/types'
import type { MediaAsset } from '~/types/models'
import { getMediaFilename } from '~/utils/mediaFilename'
import { getSectionSchema } from './sectionSchemas'

interface MediaRef {
  __mediaId: number
}

interface EditorFieldState {
  id: string
  key: string
  label: string
  type: SectionFieldType
  helperText?: string
  textValue: string
  mediaId: number | null
  mediaUrl: string
  uploading: boolean
  listItems: ListItemState[]
  itemFields?: SectionFieldSchema[]
}

interface ListItemState {
  id: string
  fields: EditorFieldState[]
}

interface Props {
  modelValue: Record<string, unknown>
  sectionKey?: string
  label?: string
  helperText?: string
  error?: string
}

const props = withDefaults(defineProps<Props>(), {
  sectionKey: '',
  label: 'Content',
  helperText: 'Build your section content dynamically',
  error: '',
})

const emit = defineEmits<{
  'update:modelValue': [value: Record<string, unknown>]
}>()

const { upload, get } = useApi()
const toast = useToast()

const schema = computed(() => props.sectionKey ? getSectionSchema(props.sectionKey) : null)
const fields = ref<EditorFieldState[]>([])
const initializing = ref(false)

function generateId(): string {
  return Math.random().toString(36).slice(2, 11)
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isMediaRef(value: unknown): value is MediaRef {
  return isRecord(value) && typeof value.__mediaId === 'number'
}

function isMediaFieldType(type: SectionFieldType): boolean {
  return type === 'image' || type === 'icon' || type === 'video'
}

function buildEmptyField(fieldSchema: SectionFieldSchema): EditorFieldState {
  return {
    id: generateId(),
    key: fieldSchema.key,
    label: fieldSchema.label,
    type: fieldSchema.type,
    helperText: fieldSchema.helperText,
    textValue: '',
    mediaId: null,
    mediaUrl: '',
    uploading: false,
    listItems: [],
    itemFields: fieldSchema.itemFields,
  }
}

async function resolveMediaPreview(mediaId: number | null): Promise<string> {
  if (!mediaId)
    return ''

  try {
    const media = await get<MediaAsset>(`/media-assets/${mediaId}`)
    return media.fileUrl || ''
  }
  catch {
    return ''
  }
}

async function hydrateFieldValue(field: EditorFieldState, value: unknown) {
  if (field.type === 'list') {
    const items = Array.isArray(value) ? value : []
    field.listItems = await Promise.all(items.map(item => buildListItem(field.itemFields || [], item)))
    return
  }

  if (isMediaFieldType(field.type)) {
    if (isMediaRef(value)) {
      field.mediaId = value.__mediaId
      field.mediaUrl = await resolveMediaPreview(value.__mediaId)
    }
    else if (typeof value === 'string' && value.trim()) {
      field.textValue = value
      field.mediaUrl = value
    }
    return
  }

  field.textValue = typeof value === 'string' ? value : String(value ?? '')
}

async function buildListItem(itemSchemas: SectionFieldSchema[], value: unknown): Promise<ListItemState> {
  const source = isRecord(value) ? value : {}
  const fields = await Promise.all(itemSchemas.map(async (itemSchema) => {
    const field = buildEmptyField(itemSchema)
    await hydrateFieldValue(field, source[itemSchema.key])
    return field
  }))

  return {
    id: generateId(),
    fields,
  }
}

async function initializeFields() {
  initializing.value = true

  try {
    if (!schema.value) {
      fields.value = []
      return
    }

    const nextFields = await Promise.all(schema.value.fields.map(async (fieldSchema) => {
      const field = buildEmptyField(fieldSchema)
      await hydrateFieldValue(field, props.modelValue?.[fieldSchema.key])
      return field
    }))

    fields.value = nextFields
  }
  finally {
    initializing.value = false
  }
}

function fieldToJson(field: EditorFieldState): unknown {
  if (field.type === 'list') {
    return field.listItems.map((item) => {
      const result: Record<string, unknown> = {}
      for (const childField of item.fields) {
        result[childField.key] = fieldToJson(childField)
      }
      return result
    })
  }

  if (isMediaFieldType(field.type)) {
    return field.mediaId ? { __mediaId: field.mediaId } : ''
  }

  return field.textValue
}

function emitChange() {
  if (!schema.value || initializing.value)
    return

  const nextValue: Record<string, unknown> = {}
  for (const field of fields.value) {
    nextValue[field.key] = fieldToJson(field)
  }

  emit('update:modelValue', nextValue)
}

function addListItem(field: EditorFieldState) {
  if (!field.itemFields)
    return

  field.listItems.push({
    id: generateId(),
    fields: field.itemFields.map(buildEmptyField),
  })
  emitChange()
}

function removeListItem(field: EditorFieldState, itemId: string) {
  field.listItems = field.listItems.filter(item => item.id !== itemId)
  emitChange()
}

function shouldShowListChildField(
  parentField: EditorFieldState,
  childField: EditorFieldState,
  itemIndex: number,
): boolean {
  if (
    props.sectionKey === 'features-section-three'
    && parentField.key === 'bottomFeatures'
    && childField.key === 'secondaryImage'
  ) {
    return itemIndex === 0
  }

  return true
}

function getAcceptForType(type: SectionFieldType): string {
  if (type === 'video')
    return 'video/*'

  return 'image/*,.svg'
}

function matchesAcceptedType(file: File, type: SectionFieldType): boolean {
  if (type === 'video')
    return file.type.startsWith('video/')

  return file.type.startsWith('image/') || file.type === 'image/svg+xml'
}

function getMediaLabel(type: SectionFieldType): string {
  if (type === 'icon')
    return 'icon'
  if (type === 'video')
    return 'video'
  return 'image'
}

function getUploadErrorMessage(error: unknown, fallback: string): string {
  const fetchError = error as FetchError
  return fetchError.data?.message || fetchError.message || fallback
}

async function uploadMedia(field: EditorFieldState, event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file)
    return

  if (!matchesAcceptedType(file, field.type)) {
    toast.error(`Please select a valid ${getMediaLabel(field.type)} file`)
    input.value = ''
    return
  }

  field.uploading = true
  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('altText', file.name)

    const response = await upload<MediaAsset>('/media-assets/upload', formData)
    field.mediaId = response.id
    field.mediaUrl = response.fileUrl
    emitChange()
    toast.success(`${getMediaLabel(field.type)} uploaded successfully`)
  }
  catch (error) {
    console.error('Failed to upload media field:', error)
    toast.error(getUploadErrorMessage(error, `Failed to upload ${getMediaLabel(field.type)}`))
  }
  finally {
    field.uploading = false
    input.value = ''
  }
}

function removeMedia(field: EditorFieldState) {
  field.mediaId = null
  field.mediaUrl = ''
  emitChange()
}

watch(
  () => [props.sectionKey, JSON.stringify(props.modelValue || {})],
  async () => {
    await initializeFields()
  },
  { immediate: true },
)

const inputClasses = 'w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 text-text-primary placeholder:text-text-muted transition-all duration-300 outline-none text-sm'
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <label class="block text-sm font-medium text-text-secondary">
        {{ label }}
      </label>
      <span v-if="schema" class="text-xs text-text-muted">
        {{ schema.fields.length }} fields
      </span>
    </div>

    <div v-if="!schema" class="p-6 rounded-xl border border-dashed border-white/10 text-center">
      <p class="text-text-muted text-sm">
        No section schema found for this section key.
      </p>
    </div>

    <div v-else-if="initializing" class="p-6 rounded-xl border border-white/10 text-center text-text-muted text-sm">
      Loading section content...
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="field in fields"
        :key="field.id"
        class="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-3"
      >
        <div>
          <p class="text-sm font-medium text-text-secondary">
            {{ field.label }}
          </p>
          <p v-if="field.helperText" class="mt-1 text-xs text-text-muted">
            {{ field.helperText }}
          </p>
        </div>

        <div v-if="field.type === 'text' || field.type === 'link'">
          <input
            v-model="field.textValue"
            :type="field.type === 'link' ? 'url' : 'text'"
            :placeholder="`Enter ${field.label.toLowerCase()}`"
            :class="inputClasses"
            @input="emitChange"
          >
        </div>

        <div v-else-if="field.type === 'textarea'">
          <textarea
            v-model="field.textValue"
            rows="4"
            :placeholder="`Enter ${field.label.toLowerCase()}`"
            :class="inputClasses"
            @input="emitChange"
          />
        </div>

        <div v-else-if="field.type === 'list'" class="space-y-3">
          <div
            v-for="(item, itemIndex) in field.listItems"
            :key="item.id"
            class="p-3 rounded-lg bg-white/[0.03] border border-white/5 space-y-3"
          >
            <div class="flex items-center justify-between">
              <span class="text-xs font-medium text-text-muted">Item {{ itemIndex + 1 }}</span>
              <button
                type="button"
                class="p-1 rounded text-red-400 hover:bg-red-500/10 transition-all"
                @click="removeListItem(field, item.id)"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <template
              v-for="childField in item.fields"
              :key="childField.id"
            >
              <div
                v-if="shouldShowListChildField(field, childField, itemIndex)"
                class="space-y-2"
              >
                <label class="block text-xs font-medium text-text-secondary">
                  {{ childField.label }}
                </label>

                <input
                  v-if="childField.type === 'text' || childField.type === 'link'"
                  v-model="childField.textValue"
                  :type="childField.type === 'link' ? 'url' : 'text'"
                  :placeholder="`Enter ${childField.label.toLowerCase()}`"
                  :class="inputClasses"
                  @input="emitChange"
                >

                <textarea
                  v-else-if="childField.type === 'textarea'"
                  v-model="childField.textValue"
                  rows="3"
                  :placeholder="`Enter ${childField.label.toLowerCase()}`"
                  :class="inputClasses"
                  @input="emitChange"
                />

                <div v-else class="space-y-3">
                  <div
                    v-if="childField.mediaUrl"
                    class="rounded-lg border border-white/10 bg-white/5 p-3"
                  >
                    <div class="flex items-start gap-3">
                      <div class="w-20 h-20 rounded-lg overflow-hidden bg-white/5 flex items-center justify-center">
                        <video
                          v-if="childField.type === 'video'"
                          :src="childField.mediaUrl"
                          class="w-full h-full object-cover"
                          muted
                          playsinline
                        />
                        <NuxtImg
                          v-else
                          :src="childField.mediaUrl"
                          :alt="childField.label"
                          class="w-full h-full object-cover"
                        />
                      </div>
                      <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium text-text-primary truncate">
                          {{ getMediaFilename(childField.mediaUrl) }}
                        </p>
                        <p class="text-xs text-text-muted mt-1">
                          Media ID: {{ childField.mediaId }}
                        </p>
                        <button
                          type="button"
                          class="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"
                          @click="removeMedia(childField)"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>

                  <label
                    v-else
                    :for="`media-upload-${childField.id}`"
                    class="flex flex-col items-center justify-center w-full h-28 rounded-lg border-2 border-dashed cursor-pointer transition-all"
                    :class="childField.uploading
                      ? 'border-primary/50 bg-primary/5'
                      : 'border-white/10 hover:border-white/20 hover:bg-white/[0.02]'"
                  >
                    <span class="text-xs text-text-muted">
                      {{ childField.uploading ? 'Uploading...' : `Upload ${getMediaLabel(childField.type)}` }}
                    </span>
                  </label>
                  <input
                    :id="`media-upload-${childField.id}`"
                    type="file"
                    class="hidden"
                    :accept="getAcceptForType(childField.type)"
                    :disabled="childField.uploading"
                    @change="uploadMedia(childField, $event)"
                  >
                </div>
              </div>
            </template>
          </div>

          <button
            type="button"
            class="w-full py-2 rounded-lg border border-dashed border-white/10 text-text-muted text-xs hover:border-white/20 hover:text-text-secondary hover:bg-white/[0.02] transition-all"
            @click="addListItem(field)"
          >
            + Add Item
          </button>
        </div>

        <div v-else class="space-y-3">
          <div
            v-if="field.mediaUrl"
            class="rounded-lg border border-white/10 bg-white/5 p-3"
          >
            <div class="flex items-start gap-3">
              <div class="w-24 h-24 rounded-lg overflow-hidden bg-white/5 flex items-center justify-center">
                <video
                  v-if="field.type === 'video'"
                  :src="field.mediaUrl"
                  class="w-full h-full object-cover"
                  muted
                  playsinline
                />
                <NuxtImg
                  v-else
                  :src="field.mediaUrl"
                  :alt="field.label"
                  class="w-full h-full object-cover"
                />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-text-primary truncate">
                  {{ getMediaFilename(field.mediaUrl) }}
                </p>
                <p class="text-xs text-text-muted mt-1">
                  Media ID: {{ field.mediaId }}
                </p>
                <button
                  type="button"
                  class="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"
                  @click="removeMedia(field)"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>

          <label
            v-else
            :for="`media-upload-${field.id}`"
            class="flex flex-col items-center justify-center w-full h-32 rounded-lg border-2 border-dashed cursor-pointer transition-all"
            :class="field.uploading
              ? 'border-primary/50 bg-primary/5'
              : 'border-white/10 hover:border-white/20 hover:bg-white/[0.02]'"
          >
            <span class="text-xs text-text-muted">
              {{ field.uploading ? 'Uploading...' : `Upload ${getMediaLabel(field.type)}` }}
            </span>
          </label>
          <input
            :id="`media-upload-${field.id}`"
            type="file"
            class="hidden"
            :accept="getAcceptForType(field.type)"
            :disabled="field.uploading"
            @change="uploadMedia(field, $event)"
          >
        </div>
      </div>
    </div>

    <p v-if="error" class="text-sm text-red-500">
      {{ error }}
    </p>
    <p v-else-if="helperText" class="text-sm text-text-muted">
      {{ helperText }}
    </p>
  </div>
</template>
