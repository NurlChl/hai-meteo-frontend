<script setup lang="ts">
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import StarterKit from '@tiptap/starter-kit'
import { EditorContent, useEditor } from '@tiptap/vue-3'

interface Props {
  modelValue: string
  label?: string
  required?: boolean
  error?: string
  helperText?: string
  disabled?: boolean
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  required: false,
  error: '',
  helperText: '',
  disabled: false,
  placeholder: 'Start writing...',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
const { upload } = useApi()
const { resolveMediaUrl } = useMediaUrl()
const toast = useToast()

const fileInputRef = ref<HTMLInputElement | null>(null)
const uploading = ref(false)

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit.configure({
      heading: {
        levels: [1, 2, 3, 4],
      },
    }),
    Link.configure({
      openOnClick: false,
      HTMLAttributes: {
        class: 'text-primary hover:underline',
      },
    }),
    Image.configure({
      HTMLAttributes: {
        class: 'max-w-full h-auto rounded-lg',
      },
    }),
    Placeholder.configure({
      placeholder: props.placeholder,
    }),
  ],
  editorProps: {
    attributes: {
      class: 'prose prose-invert max-w-none min-h-[300px] focus:outline-none p-4',
    },
  },
  onUpdate: ({ editor }: { editor: any }) => {
    emit('update:modelValue', editor.getHTML())
  },
})

watch(
  () => props.modelValue,
  (value) => {
    if (editor.value && editor.value.getHTML() !== value) {
      editor.value.commands.setContent(value)
    }
  },
)

watch(
  () => props.disabled,
  (disabled) => {
    editor.value?.setEditable(!disabled)
  },
)

onBeforeUnmount(() => {
  editor.value?.destroy()
})

function setLink() {
  const previousUrl = editor.value?.getAttributes('link').href
  // eslint-disable-next-line no-alert
  const url = window.prompt('URL', previousUrl)

  if (url === null)
    return

  if (url === '') {
    editor.value?.chain().focus().extendMarkRange('link').unsetLink().run()
    return
  }

  editor.value?.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
}

function triggerImageUpload() {
  fileInputRef.value?.click()
}

async function handleImageUpload(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file)
    return

  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
  if (!validTypes.includes(file.type)) {
    toast.error('Please select a valid image file (JPEG, PNG, GIF, WebP, SVG)')
    return
  }

  if (file.size > 10 * 1024 * 1024) {
    toast.error('Image must be less than 10MB')
    return
  }

  uploading.value = true
  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('altText', file.name)

    const response = await upload('/media-assets/upload', formData) as { fileUrl: string }

    if (response.fileUrl) {
      editor.value?.chain().focus().setImage({ src: resolveMediaUrl(response.fileUrl), alt: file.name }).run()
      toast.success('Image uploaded successfully')
    }
  }
  catch (err) {
    console.error(err)
    toast.error('Failed to upload image')
  }
  finally {
    uploading.value = false
    if (fileInputRef.value) {
      fileInputRef.value.value = ''
    }
  }
}

function addImageByUrl() {
  // eslint-disable-next-line no-alert
  const url = window.prompt('Image URL')

  if (url) {
    editor.value?.chain().focus().setImage({ src: url }).run()
  }
}
</script>

<template>
  <div class="mb-4">
    <label v-if="label" class="block text-sm font-medium text-text-secondary mb-2">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>

    <div
      class="rounded-xl border overflow-hidden transition-all duration-300" :class="[
        error
          ? 'border-red-500/50'
          : 'border-white/10 hover:border-white/20 focus-within:border-primary/50',
        disabled ? 'opacity-50 pointer-events-none' : '',
      ]"
    >
      <div
        v-if="editor"
        class="flex flex-wrap items-center gap-1 p-2 bg-white/5 border-b border-white/10"
      >
        <button
          type="button"
          class="p-2 rounded-lg transition-colors" :class="[
            editor.isActive('bold') ? 'bg-primary/20 text-primary' : 'hover:bg-white/10 text-text-secondary',
          ]"
          title="Bold"
          @click="editor.chain().focus().toggleBold().run()"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z" />
          </svg>
        </button>

        <button
          type="button"
          class="p-2 rounded-lg transition-colors" :class="[
            editor.isActive('italic') ? 'bg-primary/20 text-primary' : 'hover:bg-white/10 text-text-secondary',
          ]"
          title="Italic"
          @click="editor.chain().focus().toggleItalic().run()"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 4h4m2 0l-6 16m-2 0h4" />
          </svg>
        </button>

        <button
          type="button"
          class="p-2 rounded-lg transition-colors" :class="[
            editor.isActive('strike') ? 'bg-primary/20 text-primary' : 'hover:bg-white/10 text-text-secondary',
          ]"
          title="Strikethrough"
          @click="editor.chain().focus().toggleStrike().run()"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 10H3m18 0h-4m0 0a4 4 0 10-8 0 4 4 0 008 0z" />
          </svg>
        </button>

        <button
          type="button"
          class="p-2 rounded-lg transition-colors" :class="[
            editor.isActive('code') ? 'bg-primary/20 text-primary' : 'hover:bg-white/10 text-text-secondary',
          ]"
          title="Inline Code"
          @click="editor.chain().focus().toggleCode().run()"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        </button>

        <div class="w-px h-6 bg-white/10 mx-1" />

        <button
          type="button"
          class="p-2 rounded-lg transition-colors text-sm font-bold" :class="[
            editor.isActive('heading', { level: 1 }) ? 'bg-primary/20 text-primary' : 'hover:bg-white/10 text-text-secondary',
          ]"
          title="Heading 1"
          @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
        >
          H1
        </button>

        <button
          type="button"
          class="p-2 rounded-lg transition-colors text-sm font-bold" :class="[
            editor.isActive('heading', { level: 2 }) ? 'bg-primary/20 text-primary' : 'hover:bg-white/10 text-text-secondary',
          ]"
          title="Heading 2"
          @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
        >
          H2
        </button>

        <button
          type="button"
          class="p-2 rounded-lg transition-colors text-sm font-bold" :class="[
            editor.isActive('heading', { level: 3 }) ? 'bg-primary/20 text-primary' : 'hover:bg-white/10 text-text-secondary',
          ]"
          title="Heading 3"
          @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
        >
          H3
        </button>

        <div class="w-px h-6 bg-white/10 mx-1" />

        <button
          type="button"
          class="p-2 rounded-lg transition-colors" :class="[
            editor.isActive('bulletList') ? 'bg-primary/20 text-primary' : 'hover:bg-white/10 text-text-secondary',
          ]"
          title="Bullet List"
          @click="editor.chain().focus().toggleBulletList().run()"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <button
          type="button"
          class="p-2 rounded-lg transition-colors" :class="[
            editor.isActive('orderedList') ? 'bg-primary/20 text-primary' : 'hover:bg-white/10 text-text-secondary',
          ]"
          title="Numbered List"
          @click="editor.chain().focus().toggleOrderedList().run()"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h10m-10 4h10M3 8h.01M3 12h.01M3 16h.01" />
          </svg>
        </button>

        <div class="w-px h-6 bg-white/10 mx-1" />

        <button
          type="button"
          class="p-2 rounded-lg transition-colors" :class="[
            editor.isActive('blockquote') ? 'bg-primary/20 text-primary' : 'hover:bg-white/10 text-text-secondary',
          ]"
          title="Blockquote"
          @click="editor.chain().focus().toggleBlockquote().run()"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </button>

        <button
          type="button"
          class="p-2 rounded-lg transition-colors" :class="[
            editor.isActive('codeBlock') ? 'bg-primary/20 text-primary' : 'hover:bg-white/10 text-text-secondary',
          ]"
          title="Code Block"
          @click="editor.chain().focus().toggleCodeBlock().run()"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </button>

        <button
          type="button"
          class="p-2 rounded-lg transition-colors hover:bg-white/10 text-text-secondary"
          title="Horizontal Rule"
          @click="editor.chain().focus().setHorizontalRule().run()"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14" />
          </svg>
        </button>

        <div class="w-px h-6 bg-white/10 mx-1" />

        <button
          type="button"
          class="p-2 rounded-lg transition-colors" :class="[
            editor.isActive('link') ? 'bg-primary/20 text-primary' : 'hover:bg-white/10 text-text-secondary',
          ]"
          title="Add Link"
          @click="setLink"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        </button>

        <button
          type="button"
          class="p-2 rounded-lg transition-colors" :class="[
            uploading ? 'bg-primary/20 text-primary' : 'hover:bg-white/10 text-text-secondary',
          ]"
          :disabled="uploading"
          title="Upload Image"
          @click="triggerImageUpload"
        >
          <svg v-if="!uploading" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <svg v-else class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>

        <button
          type="button"
          class="p-2 rounded-lg transition-colors hover:bg-white/10 text-text-secondary"
          title="Add Image from URL"
          @click="addImageByUrl"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
          </svg>
        </button>

        <input
          ref="fileInputRef"
          type="file"
          accept="image/*"
          class="hidden"
          @change="handleImageUpload"
        >

        <div class="w-px h-6 bg-white/10 mx-1" />

        <button
          type="button"
          class="p-2 rounded-lg transition-colors hover:bg-white/10 text-text-secondary disabled:opacity-30"
          title="Undo"
          :disabled="!editor.can().undo()"
          @click="editor.chain().focus().undo().run()"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
          </svg>
        </button>

        <button
          type="button"
          class="p-2 rounded-lg transition-colors hover:bg-white/10 text-text-secondary disabled:opacity-30"
          title="Redo"
          :disabled="!editor.can().redo()"
          @click="editor.chain().focus().redo().run()"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" />
          </svg>
        </button>
      </div>

      <div class="bg-white/5">
        <EditorContent :editor="editor" />
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

<style>
.tiptap {
  min-height: 300px;
}

.tiptap p.is-editor-empty:first-child::before {
  color: rgba(255, 255, 255, 0.3);
  content: attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
}

.tiptap h1 {
  font-size: 2em;
  font-weight: 700;
  margin-top: 1em;
  margin-bottom: 0.5em;
}

.tiptap h2 {
  font-size: 1.5em;
  font-weight: 600;
  margin-top: 1em;
  margin-bottom: 0.5em;
}

.tiptap h3 {
  font-size: 1.25em;
  font-weight: 600;
  margin-top: 1em;
  margin-bottom: 0.5em;
}

.tiptap h4 {
  font-size: 1.1em;
  font-weight: 600;
  margin-top: 1em;
  margin-bottom: 0.5em;
}

.tiptap p {
  margin-bottom: 0.75em;
}

.tiptap ul,
.tiptap ol {
  padding-left: 1.5em;
  margin-bottom: 0.75em;
}

.tiptap ul {
  list-style-type: disc;
}

.tiptap ol {
  list-style-type: decimal;
}

.tiptap li {
  margin-bottom: 0.25em;
}

.tiptap blockquote {
  border-left: 3px solid rgba(255, 255, 255, 0.3);
  padding-left: 1em;
  margin-left: 0;
  margin-bottom: 0.75em;
  font-style: italic;
  color: rgba(255, 255, 255, 0.7);
}

.tiptap pre {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 0.5rem;
  padding: 1em;
  margin-bottom: 0.75em;
  overflow-x: auto;
}

.tiptap code {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 0.25rem;
  padding: 0.2em 0.4em;
  font-family: ui-monospace, monospace;
  font-size: 0.9em;
}

.tiptap pre code {
  background: none;
  padding: 0;
}

.tiptap hr {
  border: none;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  margin: 1.5em 0;
}

.tiptap a {
  color: var(--color-primary, #3b82f6);
  text-decoration: none;
}

.tiptap a:hover {
  text-decoration: underline;
}

.tiptap img {
  max-width: 100%;
  height: auto;
  border-radius: 0.5rem;
  margin: 1em 0;
}

.tiptap strong {
  font-weight: 700;
}

.tiptap em {
  font-style: italic;
}

.tiptap s {
  text-decoration: line-through;
}
</style>
