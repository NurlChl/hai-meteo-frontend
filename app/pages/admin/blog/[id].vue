<script setup lang="ts">
import FormInput from '~/components/admin/FormInput.vue'

definePageMeta({
  layout: 'admin',
  middleware: 'auth',
})

const route = useRoute()
const { get, post, patch } = useApi()
const toast = useToast()

const isEdit = computed(() => !!route.params.id)

const form = ref({
  title: '',
  slug: '',
  excerpt: '',
  contentMd: '',
  authorName: '',
  status: 'draft',
  publishedAt: '',
  coverMediaId: null as number | null,
})

const coverMediaIdInput = computed({
  get: () => (form.value.coverMediaId ?? '') as string | number,
  set: (value) => {
    if (value === '' || value === null || value === undefined) {
      form.value.coverMediaId = null
      return
    }
    const parsed = Number(value)
    form.value.coverMediaId = Number.isNaN(parsed) ? null : parsed
  },
})

const errors = ref<Record<string, string>>({})
const submitting = ref(false)

async function loadPost() {
  try {
    const response = (await get(`/blog-posts/${route.params.id}`)) as {
      title?: string
      slug?: string
      excerpt?: string
      contentMd?: string
      authorName?: string
      status?: string
      publishedAt?: string
      coverMediaId?: number | null
    }
    form.value = {
      title: response.title || '',
      slug: response.slug || '',
      excerpt: response.excerpt || '',
      contentMd: response.contentMd || '',
      authorName: response.authorName || '',
      status: response.status || 'draft',
      publishedAt: response.publishedAt
        ? new Date(response.publishedAt).toISOString().slice(0, 16)
        : '',
      coverMediaId: response.coverMediaId || null,
    }
  }
  catch (err) {
    console.error(err)
    toast.error('Failed to load blog post')
    await navigateTo('/admin/blog')
  }
}

async function handleSubmit() {
  submitting.value = true
  errors.value = {}

  try {
    const payload = {
      ...form.value,
      coverMediaId: form.value.coverMediaId ? Number(form.value.coverMediaId) : null,
      publishedAt: form.value.publishedAt ? new Date(form.value.publishedAt).toISOString() : null,
    }

    if (isEdit.value) {
      await patch(`/blog-posts/${route.params.id}`, payload)
      toast.success('Blog post updated successfully')
    }
    else {
      await post('/blog-posts', payload)
      toast.success('Blog post created successfully')
    }

    await navigateTo('/admin/blog')
  }
  catch {
    toast.error(isEdit.value ? 'Failed to update blog post' : 'Failed to create blog post')
  }
  finally {
    submitting.value = false
  }
}

onMounted(() => {
  if (isEdit.value) {
    loadPost()
  }
})
</script>

<template>
  <div>
    <form @submit.prevent="handleSubmit">
      <BaseCard :title="isEdit ? 'Edit Post' : 'Create Post'">
        <template #actions>
          <BaseButton variant="secondary" to="/admin/blog">
            Back to List
          </BaseButton>
        </template>

        <FormInput
          id="title"
          v-model="form.title"
          label="Title"
          placeholder="Enter post title"
          required
          :error="errors.title"
        />

        <FormInput
          id="slug"
          v-model="form.slug"
          label="Slug"
          placeholder="post-slug"
          required
          :error="errors.slug"
        />

        <FormInput
          id="excerpt"
          v-model="form.excerpt"
          label="Excerpt"
          type="textarea"
          :rows="3"
          placeholder="Brief description of the post"
        />

        <FormInput
          id="content"
          v-model="form.contentMd"
          label="Content (Markdown)"
          type="textarea"
          :rows="15"
          required
          placeholder="Write your post content in Markdown format..."
        />

        <FormInput
          id="author"
          v-model="form.authorName"
          label="Author Name"
          placeholder="Author name"
        />

        <FormInput
          id="status"
          v-model="form.status"
          label="Status"
          type="select"
          :options="[
            { label: 'Draft', value: 'draft' },
            { label: 'Published', value: 'published' },
            { label: 'Archived', value: 'archived' },
          ]"
        />

        <FormInput
          id="publishedAt"
          v-model="form.publishedAt"
          label="Published At"
          type="datetime-local"
        />

        <FormInput
          id="coverMediaId"
          v-model="coverMediaIdInput"
          label="Cover Image ID"
          type="number"
          placeholder="Enter media asset ID"
        />

        <template #footer>
          <BaseButton variant="secondary" type="button" @click="navigateTo('/admin/blog')">
            Cancel
          </BaseButton>
          <BaseButton type="submit" variant="primary" :loading="submitting">
            {{ isEdit ? 'Update' : 'Create' }}
          </BaseButton>
        </template>
      </BaseCard>
    </form>
  </div>
</template>
