<script setup lang="ts">
import FormCheckboxGroup from '~/components/admin/FormCheckboxGroup.vue'
import FormInput from '~/components/admin/FormInput.vue'
import FormMediaSelect from '~/components/admin/FormMediaSelect.vue'
import FormWysiwyg from '~/components/admin/FormWysiwyg.vue'

definePageMeta({
  layout: 'admin',
  middleware: 'auth',
})

const route = useRoute()
const { get, post, put } = useApi()
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
  categoryIds: [] as number[],
  tagIds: [] as number[],
})

const errors = ref<Record<string, string>>({})
const submitting = ref(false)

const categories = ref<Array<{ id: number, name: string }>>([])
const tags = ref<Array<{ id: number, name: string }>>([])

watch(() => form.value.title, (newTitle) => {
  if (newTitle && !isEdit.value) {
    form.value.slug = newTitle
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }
  else if (!newTitle && !isEdit.value) {
    form.value.slug = ''
  }
})

async function loadCategories() {
  try {
    const response = (await get('/blog-categories', {
      query: { limit: 100, offset: 0 },
    })) as { results: Array<{ id: number, name: string }> }
    categories.value = response.results || []
  }
  catch (err) {
    console.error('Failed to load categories:', err)
  }
}

async function loadTags() {
  try {
    const response = (await get('/blog-tags', {
      query: { limit: 100, offset: 0 },
    })) as { results: Array<{ id: number, name: string }> }
    tags.value = response.results || []
  }
  catch (err) {
    console.error('Failed to load tags:', err)
  }
}

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
      categoryIds?: number[]
      tagIds?: number[]
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
      categoryIds: response.categoryIds || [],
      tagIds: response.tagIds || [],
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
      coverMediaId: form.value.coverMediaId,
      publishedAt: form.value.publishedAt ? new Date(form.value.publishedAt).toISOString() : null,
      categoryIds: form.value.categoryIds,
      tagIds: form.value.tagIds,
    }

    if (isEdit.value) {
      await put(`/blog-posts/${route.params.id}`, payload)
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
  loadCategories()
  loadTags()
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

        <FormWysiwyg
          v-model="form.contentMd"
          label="Content"
          required
          placeholder="Write your post content..."
          :error="errors.contentMd"
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

        <FormMediaSelect
          v-model="form.coverMediaId"
          label="Cover Image"
          helper-text="Select a media asset for the blog post cover"
        />

        <FormCheckboxGroup
          v-model="form.categoryIds"
          label="Categories"
          :options="categories"
          empty-text="No categories available"
        />

        <FormCheckboxGroup
          v-model="form.tagIds"
          label="Tags"
          :options="tags"
          empty-text="No tags available"
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
