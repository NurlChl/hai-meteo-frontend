<script setup lang="ts">
import type { FetchError } from '~/types'
import FormInput from '~/components/admin/FormInput.vue'
import FormMediaSelect from '~/components/admin/FormMediaSelect.vue'

definePageMeta({
  layout: 'admin',
  middleware: 'auth',
})

const route = useRoute()
const { get, patch } = useApi()
const toast = useToast()

const form = ref({
  title: '',
  slug: '',
  metaTitle: '',
  metaDesc: '',
  metaImageId: null as number | null,
  isPublished: false,
})

const errors = ref<Record<string, string>>({})
const submitting = ref(false)

async function loadPage() {
  try {
    const response = (await get(`/pages/${route.params.id}`)) as {
      title?: string
      slug?: string
      metaTitle?: string
      metaDesc?: string
      metaImageId?: number | null
      isPublished?: boolean
    }
    form.value = {
      title: response.title || '',
      slug: response.slug || '',
      metaTitle: response.metaTitle || '',
      metaDesc: response.metaDesc || '',
      metaImageId: response.metaImageId || null,
      isPublished: !!response.isPublished,
    }
  }
  catch (err) {
    console.error(err)
    toast.error('Failed to load page')
    await navigateTo('/admin/pages')
  }
}

async function handleSubmit() {
  submitting.value = true
  errors.value = {}

  try {
    await patch(`/pages/${route.params.id}`, form.value)
    toast.success('Page updated successfully')
    await navigateTo('/admin/pages')
  }
  catch (error: unknown) {
    const e = error as FetchError
    if (e.data?.message) {
      toast.error(e.data.message)
    }
    else {
      toast.error('Failed to update page')
    }
  }
  finally {
    submitting.value = false
  }
}

onMounted(() => {
  loadPage()
})
</script>

<template>
  <div>
    <form @submit.prevent="handleSubmit">
      <BaseCard title="Edit Page">
        <template #actions>
          <BaseButton variant="secondary" to="/admin/pages">
            Back to List
          </BaseButton>
        </template>

        <div class="grid gap-6">
          <FormInput
            id="title"
            v-model="form.title"
            label="Title"
            placeholder="Enter page title"
            required
            :error="errors.title"
          />

          <FormInput
            id="slug"
            v-model="form.slug"
            label="Slug"
            placeholder="page-slug"
            required
            :error="errors.slug"
          />

          <FormInput
            id="metaTitle"
            v-model="form.metaTitle"
            label="Meta Title"
            placeholder="SEO title for search engines"
            :error="errors.metaTitle"
          />

          <div>
            <label class="block text-sm font-medium text-text-secondary mb-2">
              Meta Description
            </label>
            <textarea
              id="metaDesc"
              v-model="form.metaDesc"
              rows="3"
              placeholder="SEO description for search engines"
              class="w-full px-4 py-3 rounded-xl border bg-white/5 border-white/10 hover:border-white/20 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 text-text-primary transition-all duration-300 outline-none"
            />
          </div>

          <FormMediaSelect
            v-model="form.metaImageId"
            label="Meta Image"
            placeholder="Select an image for meta tag"
          />

          <div class="flex items-center gap-3 px-1">
            <input
              id="isPublished"
              v-model="form.isPublished"
              type="checkbox"
              class="h-5 w-5 rounded border-white/10 bg-white/5 text-primary focus:ring-primary focus:ring-offset-bg-dark transition-all"
            >
            <label for="isPublished" class="text-sm font-medium text-text-primary select-none cursor-pointer">
              Published
            </label>
          </div>
        </div>

        <template #footer>
          <BaseButton variant="secondary" type="button" @click="navigateTo('/admin/pages')">
            Cancel
          </BaseButton>
          <BaseButton type="submit" variant="primary" :loading="submitting">
            Update Page
          </BaseButton>
        </template>
      </BaseCard>
    </form>
  </div>
</template>
