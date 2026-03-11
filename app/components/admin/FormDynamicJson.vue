<script setup lang="ts">
type ValueType = 'text' | 'list' | 'image'
type ListItemValueType = 'text' | 'image'

interface ContentKeyOption {
  key: string
  label: string
  valueType: ValueType
  description: string
}

interface ListItemKeyOption {
  key: string
  label: string
  valueType: ListItemValueType
}

interface ListItemField {
  id: string
  key: string
  valueType: ListItemValueType
  textValue: string
  imageValue: number | null
  imageUrl: string
  imageUploading: boolean
}

interface ListItem {
  id: string
  fields: ListItemField[]
}

interface MediaAsset {
  id: number
  fileUrl: string
  altText: string
  mimeType: string
}

interface Field {
  id: string
  key: string
  valueType: ValueType
  textValue: string
  listValue: ListItem[]
  imageValue: number | null
  imageUrl: string
  imageUploading: boolean
}

interface Props {
  modelValue: Record<string, unknown>
  label?: string
  helperText?: string
  error?: string
}

const props = withDefaults(defineProps<Props>(), {
  label: 'Content',
  helperText: 'Build your section content dynamically',
  error: '',
})

const emit = defineEmits<{
  'update:modelValue': [value: Record<string, unknown>]
}>()
const { upload, get } = useApi()
const toast = useToast()

const contentKeyOptions: ContentKeyOption[] = [
  {
    key: 'title',
    label: 'Title',
    valueType: 'text',
    description: 'Main heading text',
  },
  {
    key: 'description',
    label: 'Description',
    valueType: 'text',
    description: 'Descriptive paragraph text',
  },
  {
    key: 'items',
    label: 'Items',
    valueType: 'list',
    description: 'List of items (title, description, icon, image)',
  },
  {
    key: 'image',
    label: 'Image',
    valueType: 'image',
    description: 'Primary section image',
  },
  {
    key: 'backgroundImage',
    label: 'Background Image',
    valueType: 'image',
    description: 'Background image for this section',
  },
  {
    key: 'ctaText',
    label: 'CTA Text',
    valueType: 'text',
    description: 'Call-to-action button text',
  },
  {
    key: 'ctaHref',
    label: 'CTA Link',
    valueType: 'text',
    description: 'Call-to-action link target',
  },
  {
    key: 'submitText',
    label: 'Submit Text',
    valueType: 'text',
    description: 'Submit button text',
  },
  {
    key: 'features',
    label: 'Features',
    valueType: 'list',
    description: 'List of features',
  },
  {
    key: 'solutions',
    label: 'Solutions',
    valueType: 'list',
    description: 'List of solutions',
  },
  {
    key: 'technologies',
    label: 'Technologies',
    valueType: 'list',
    description: 'List of technologies',
  },
  {
    key: 'faqs',
    label: 'FAQs',
    valueType: 'list',
    description: 'List of frequently asked questions',
  },
  {
    key: 'date',
    label: 'Date',
    valueType: 'text',
    description: 'Date string or label for news section',
  },
]

const listItemKeyOptions: ListItemKeyOption[] = [
  { key: 'id', label: 'ID', valueType: 'text' },
  { key: 'title', label: 'Title', valueType: 'text' },
  { key: 'description', label: 'Description', valueType: 'text' },
  { key: 'icon', label: 'Icon', valueType: 'text' },
  { key: 'image', label: 'Image', valueType: 'image' },
  { key: 'question', label: 'Question', valueType: 'text' },
  { key: 'answer', label: 'Answer', valueType: 'text' },
]

function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

const fields = ref<Field[]>([])

const availableKeys = computed(() => {
  const usedKeys = fields.value.map(f => f.key)
  return contentKeyOptions.filter(opt => !usedKeys.includes(opt.key))
})

const canAddField = computed(() => availableKeys.value.length > 0)

function getKeyOption(key: string): ContentKeyOption | undefined {
  return contentKeyOptions.find(opt => opt.key === key)
}

function getKeyLabel(key: string): string {
  return getKeyOption(key)?.label || key
}

function getListItemKeyOption(key: string): ListItemKeyOption | undefined {
  return listItemKeyOptions.find(opt => opt.key === key)
}

function getListItemKeyLabel(key: string): string {
  return getListItemKeyOption(key)?.label || key
}

function getAvailableListItemKeys(item: ListItem): ListItemKeyOption[] {
  const usedKeys = item.fields.map(f => f.key)
  return listItemKeyOptions.filter(opt => !usedKeys.includes(opt.key))
}

function canAddListItemField(item: ListItem): boolean {
  return getAvailableListItemKeys(item).length > 0
}

async function initializeFields() {
  const value = props.modelValue
  if (!value || Object.keys(value).length === 0) {
    fields.value = []
    return
  }

  const fieldsToInit: Field[] = []

  for (const [key, val] of Object.entries(value)) {
    const keyOption = getKeyOption(key)
    const valueType = keyOption?.valueType || 'text'

    const field: Field = {
      id: generateId(),
      key,
      valueType,
      textValue: '',
      listValue: [],
      imageValue: null,
      imageUrl: '',
      imageUploading: false,
    }

    if (valueType === 'image' && typeof val === 'object' && val !== null && '__mediaId' in val) {
      field.imageValue = (val as { __mediaId: number }).__mediaId
      try {
        const media = await get<MediaAsset>(`/media-assets/${field.imageValue}`)
        field.imageUrl = media.fileUrl
      }
      catch {
        field.imageUrl = ''
      }
    }
    else if (valueType === 'list' && Array.isArray(val)) {
      const listItems: ListItem[] = []
      for (const item of val) {
        const listItem: ListItem = {
          id: generateId(),
          fields: [],
        }

        for (const [itemKey, itemVal] of Object.entries(item)) {
          const itemKeyOption = getListItemKeyOption(itemKey)
          const itemValueType = itemKeyOption?.valueType || 'text'

          const listItemField: ListItemField = {
            id: generateId(),
            key: itemKey,
            valueType: itemValueType,
            textValue: '',
            imageValue: null,
            imageUrl: '',
            imageUploading: false,
          }

          if (itemValueType === 'image' && typeof itemVal === 'object' && itemVal !== null && '__mediaId' in itemVal) {
            listItemField.imageValue = (itemVal as { __mediaId: number }).__mediaId
            try {
              const media = await get<MediaAsset>(`/media-assets/${listItemField.imageValue}`)
              listItemField.imageUrl = media.fileUrl
            }
            catch {
              listItemField.imageUrl = ''
            }
          }
          else {
            listItemField.textValue = String(itemVal ?? '')
          }

          listItem.fields.push(listItemField)
        }

        listItems.push(listItem)
      }
      field.listValue = listItems
    }
    else if (valueType === 'text') {
      field.textValue = String(val ?? '')
    }

    fieldsToInit.push(field)
  }

  fields.value = fieldsToInit
}

function fieldsToJson(): Record<string, unknown> {
  const result: Record<string, unknown> = {}

  for (const field of fields.value) {
    if (!field.key)
      continue

    switch (field.valueType) {
      case 'image':
        if (field.imageValue) {
          result[field.key] = { __mediaId: field.imageValue }
        }
        break
      case 'list':
        result[field.key] = field.listValue.map((item) => {
          const obj: Record<string, unknown> = {}
          for (const f of item.fields) {
            if (f.key) {
              if (f.valueType === 'image' && f.imageValue) {
                obj[f.key] = { __mediaId: f.imageValue }
              }
              else {
                obj[f.key] = f.textValue
              }
            }
          }
          return obj
        })
        break
      default:
        result[field.key] = field.textValue
    }
  }

  return result
}

function emitChange() {
  emit('update:modelValue', fieldsToJson())
}

function addField() {
  if (!canAddField.value)
    return

  const firstAvailable = availableKeys.value[0]
  if (!firstAvailable)
    return

  const field: Field = {
    id: generateId(),
    key: firstAvailable.key,
    valueType: firstAvailable.valueType,
    textValue: '',
    listValue: [],
    imageValue: null,
    imageUrl: '',
    imageUploading: false,
  }

  if (firstAvailable.valueType === 'list') {
    field.listValue.push({
      id: generateId(),
      fields: [{
        id: generateId(),
        key: 'title',
        valueType: 'text',
        textValue: '',
        imageValue: null,
        imageUrl: '',
        imageUploading: false,
      }],
    })
  }

  fields.value.push(field)
  emitChange()
}

function handleKeyChange(field: Field, newKey: string) {
  const keyOption = getKeyOption(newKey)
  if (!keyOption)
    return

  field.key = newKey
  field.valueType = keyOption.valueType
  field.textValue = ''
  field.listValue = []
  field.imageValue = null
  field.imageUrl = ''

  if (keyOption.valueType === 'list') {
    field.listValue.push({
      id: generateId(),
      fields: [{
        id: generateId(),
        key: 'title',
        valueType: 'text',
        textValue: '',
        imageValue: null,
        imageUrl: '',
        imageUploading: false,
      }],
    })
  }

  emitChange()
}

function removeField(id: string) {
  fields.value = fields.value.filter(f => f.id !== id)
  emitChange()
}

function addListItem(field: Field) {
  field.listValue.push({
    id: generateId(),
    fields: [{
      id: generateId(),
      key: 'title',
      valueType: 'text',
      textValue: '',
      imageValue: null,
      imageUrl: '',
      imageUploading: false,
    }],
  })
  emitChange()
}

function removeListItem(field: Field, itemId: string) {
  field.listValue = field.listValue.filter(item => item.id !== itemId)
  emitChange()
}

function addListItemField(item: ListItem) {
  const available = getAvailableListItemKeys(item)
  const firstAvailable = available[0]
  if (!firstAvailable)
    return

  item.fields.push({
    id: generateId(),
    key: firstAvailable.key,
    valueType: firstAvailable.valueType,
    textValue: '',
    imageValue: null,
    imageUrl: '',
    imageUploading: false,
  })
  emitChange()
}

function handleListItemKeyChange(item: ListItem, fieldItem: ListItemField, newKey: string) {
  const keyOption = getListItemKeyOption(newKey)
  if (!keyOption)
    return

  fieldItem.key = newKey
  fieldItem.valueType = keyOption.valueType
  fieldItem.textValue = ''
  fieldItem.imageValue = null
  fieldItem.imageUrl = ''
  emitChange()
}

function removeListItemField(item: ListItem, fieldId: string) {
  item.fields = item.fields.filter(f => f.id !== fieldId)
  emitChange()
}

async function handleImageUpload(field: Field, event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file)
    return

  if (!file.type.startsWith('image/')) {
    toast.error('Please select an image file')
    return
  }

  field.imageUploading = true
  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('altText', file.name)

    const response = await upload<MediaAsset>('/media-assets/upload', formData)
    field.imageValue = response.id
    field.imageUrl = response.fileUrl
    emitChange()
    toast.success('Image uploaded successfully')
  }
  catch (err) {
    console.error('Upload failed:', err)
    toast.error('Failed to upload image')
  }
  finally {
    field.imageUploading = false
    input.value = ''
  }
}

function removeImage(field: Field) {
  field.imageValue = null
  field.imageUrl = ''
  emitChange()
}

async function handleListItemImageUpload(fieldItem: ListItemField, event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file)
    return

  if (!file.type.startsWith('image/')) {
    toast.error('Please select an image file')
    return
  }

  fieldItem.imageUploading = true
  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('altText', file.name)

    const response = await upload<MediaAsset>('/media-assets/upload', formData)
    fieldItem.imageValue = response.id
    fieldItem.imageUrl = response.fileUrl
    emitChange()
    toast.success('Image uploaded successfully')
  }
  catch (err) {
    console.error('Upload failed:', err)
    toast.error('Failed to upload image')
  }
  finally {
    fieldItem.imageUploading = false
    input.value = ''
  }
}

function removeListItemImage(fieldItem: ListItemField) {
  fieldItem.imageValue = null
  fieldItem.imageUrl = ''
  emitChange()
}

watch(
  () => props.modelValue,
  () => {
    const currentJson = JSON.stringify(fieldsToJson())
    const newJson = JSON.stringify(props.modelValue)
    if (currentJson !== newJson) {
      initializeFields()
    }
  },
  { deep: true },
)

onMounted(() => {
  initializeFields()
})

const inputClasses = 'w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 text-text-primary placeholder:text-text-muted transition-all duration-300 outline-none text-sm'

const selectClasses = 'w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 text-text-primary transition-all duration-300 outline-none text-sm appearance-none cursor-pointer'
</script>

<template>
  <div class="space-y-3">
    <div class="flex items-center justify-between">
      <label class="block text-sm font-medium text-text-secondary">
        {{ label }}
      </label>
      <button
        v-if="canAddField"
        type="button"
        class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-all duration-300"
        @click="addField"
      >
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Add Field
      </button>
      <span v-else class="text-xs text-text-muted">
        All fields added
      </span>
    </div>

    <div v-if="fields.length === 0" class="p-6 rounded-xl border border-dashed border-white/10 text-center">
      <p class="text-text-muted text-sm">
        No fields added yet. Click "Add Field" to start building your content.
      </p>
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="field in fields"
        :key="field.id"
        class="p-4 rounded-xl bg-white/[0.02] border border-white/10"
      >
        <div class="flex items-start gap-3 mb-3">
          <div class="flex-1">
            <select
              :value="field.key"
              :class="selectClasses"
              @change="handleKeyChange(field, ($event.target as HTMLSelectElement).value)"
            >
              <option
                :value="field.key"
                class="bg-bg-dark text-white"
              >
                {{ getKeyLabel(field.key) }}
              </option>
              <option
                v-for="opt in availableKeys"
                :key="opt.key"
                :value="opt.key"
                class="bg-bg-dark text-white"
              >
                {{ opt.label }}
              </option>
            </select>
            <p class="mt-1 text-xs text-text-muted">
              {{ getKeyOption(field.key)?.description }}
            </p>
          </div>
          <button
            type="button"
            class="p-2 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all"
            title="Remove field"
            @click="removeField(field.id)"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>

        <div v-if="field.valueType === 'text'">
          <input
            v-model="field.textValue"
            type="text"
            placeholder="Enter text value"
            :class="inputClasses"
            @input="emitChange"
          >
        </div>

        <div v-else-if="field.valueType === 'image'" class="space-y-3">
          <div v-if="field.imageUrl" class="relative rounded-lg overflow-hidden bg-white/5 border border-white/10 p-3">
            <div class="flex items-start gap-3">
              <div class="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden bg-white/5">
                <NuxtImg
                  :src="field.imageUrl"
                  alt="Uploaded image"
                  class="w-full h-full object-cover"
                />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-text-primary truncate">
                  {{ field.imageUrl.split('/').pop() }}
                </p>
                <p class="text-xs text-text-muted mt-1">
                  Media ID: {{ field.imageValue }}
                </p>
                <button
                  type="button"
                  class="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"
                  @click="removeImage(field)"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Remove
                </button>
              </div>
            </div>
          </div>

          <div v-else class="relative">
            <label
              :for="`image-upload-${field.id}`"
              class="flex flex-col items-center justify-center w-full h-32 rounded-lg border-2 border-dashed cursor-pointer transition-all"
              :class="field.imageUploading
                ? 'border-primary/50 bg-primary/5'
                : 'border-white/10 hover:border-white/20 hover:bg-white/[0.02]'"
            >
              <div v-if="field.imageUploading" class="flex flex-col items-center">
                <svg class="w-8 h-8 text-primary animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span class="mt-2 text-xs text-text-muted">Uploading...</span>
              </div>
              <div v-else class="flex flex-col items-center">
                <svg class="w-8 h-8 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span class="mt-2 text-xs text-text-muted">Click to upload image</span>
                <span class="mt-1 text-xs text-text-muted/60">PNG, JPG, GIF up to 10MB</span>
              </div>
            </label>
            <input
              :id="`image-upload-${field.id}`"
              type="file"
              accept="image/*"
              class="hidden"
              :disabled="field.imageUploading"
              @change="handleImageUpload(field, $event)"
            >
          </div>
        </div>

        <div v-else-if="field.valueType === 'list'" class="space-y-3">
          <div
            v-for="(item, itemIndex) in field.listValue"
            :key="item.id"
            class="p-3 rounded-lg bg-white/[0.03] border border-white/5"
          >
            <div class="flex items-center justify-between mb-3">
              <span class="text-xs font-medium text-text-muted">Item {{ itemIndex + 1 }}</span>
              <div class="flex items-center gap-1">
                <button
                  v-if="canAddListItemField(item)"
                  type="button"
                  class="p-1 rounded text-primary hover:bg-primary/10 transition-all"
                  title="Add property"
                  @click="addListItemField(item)"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                </button>
                <button
                  type="button"
                  class="p-1 rounded text-red-400 hover:bg-red-500/10 transition-all"
                  title="Remove item"
                  @click="removeListItem(field, item.id)"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div class="space-y-3">
              <div
                v-for="fieldItem in item.fields"
                :key="fieldItem.id"
                class="p-2 rounded-md bg-white/[0.02] border border-white/5"
              >
                <div class="flex items-center gap-2 mb-2">
                  <select
                    :value="fieldItem.key"
                    class="flex-1 px-2.5 py-1.5 rounded-md bg-white/5 border border-white/10 hover:border-white/20 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 text-text-primary transition-all outline-none text-xs appearance-none cursor-pointer"
                    @change="handleListItemKeyChange(item, fieldItem, ($event.target as HTMLSelectElement).value)"
                  >
                    <option
                      :value="fieldItem.key"
                      class="bg-bg-dark text-white"
                    >
                      {{ getListItemKeyLabel(fieldItem.key) }}
                    </option>
                    <option
                      v-for="opt in getAvailableListItemKeys(item)"
                      :key="opt.key"
                      :value="opt.key"
                      class="bg-bg-dark text-white"
                    >
                      {{ opt.label }}
                    </option>
                  </select>
                  <button
                    v-if="item.fields.length > 1"
                    type="button"
                    class="p-1 rounded text-red-400/60 hover:text-red-400 hover:bg-red-500/10 transition-all"
                    title="Remove property"
                    @click="removeListItemField(item, fieldItem.id)"
                  >
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div v-if="fieldItem.valueType === 'text'">
                  <input
                    v-model="fieldItem.textValue"
                    type="text"
                    :placeholder="`Enter ${getListItemKeyLabel(fieldItem.key).toLowerCase()}`"
                    class="w-full px-2.5 py-1.5 rounded-md bg-white/5 border border-white/10 hover:border-white/20 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 text-text-primary placeholder:text-text-muted transition-all outline-none text-xs"
                    @input="emitChange"
                  >
                </div>

                <div v-else-if="fieldItem.valueType === 'image'">
                  <div v-if="fieldItem.imageUrl" class="flex items-center gap-2 p-2 rounded bg-white/5 border border-white/10">
                    <NuxtImg
                      :src="fieldItem.imageUrl"
                      alt="Uploaded"
                      class="w-12 h-12 rounded object-cover"
                    />
                    <div class="flex-1 min-w-0">
                      <p class="text-xs text-text-primary truncate">
                        {{ fieldItem.imageUrl.split('/').pop() }}
                      </p>
                      <p class="text-xs text-text-muted">
                        ID: {{ fieldItem.imageValue }}
                      </p>
                    </div>
                    <button
                      type="button"
                      class="p-1 rounded text-red-400 hover:bg-red-500/10 transition-all"
                      @click="removeListItemImage(fieldItem)"
                    >
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <label
                    v-else
                    :for="`list-image-${fieldItem.id}`"
                    class="flex items-center justify-center gap-2 w-full py-3 rounded-md border border-dashed cursor-pointer transition-all"
                    :class="fieldItem.imageUploading
                      ? 'border-primary/50 bg-primary/5'
                      : 'border-white/10 hover:border-white/20 hover:bg-white/[0.02]'"
                  >
                    <svg v-if="fieldItem.imageUploading" class="w-4 h-4 text-primary animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <svg v-else class="w-4 h-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span class="text-xs text-text-muted">
                      {{ fieldItem.imageUploading ? 'Uploading...' : 'Upload image' }}
                    </span>
                  </label>
                  <input
                    :id="`list-image-${fieldItem.id}`"
                    type="file"
                    accept="image/*"
                    class="hidden"
                    :disabled="fieldItem.imageUploading"
                    @change="handleListItemImageUpload(fieldItem, $event)"
                  >
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            class="w-full py-2 rounded-lg border border-dashed border-white/10 text-text-muted text-xs hover:border-white/20 hover:text-text-secondary hover:bg-white/[0.02] transition-all"
            @click="addListItem(field)"
          >
            + Add Item
          </button>
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
