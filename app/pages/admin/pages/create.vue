<script setup lang="ts">
import FormInput from '~/components/admin/FormInput.vue'

definePageMeta({
  layout: 'admin',
  middleware: 'auth',
})

const { post } = useApi()
const toast = useToast()

const form = ref({
  title: '',
  slug: '',
  isPublished: false,
})

const errors = ref<Record<string, string>>({})
const submitting = ref(false)

watch(() => form.value.title, (newTitle) => {
  if (newTitle) {
    form.value.slug = newTitle
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }
  else {
    form.value.slug = ''
  }
})

async function handleSubmit() {
  submitting.value = true
  errors.value = {}

  try {
    await post('/pages', form.value)
    toast.success('Page created successfully')
    await navigateTo('/admin/pages')
  }
  catch (error: any) {
    if (error.data?.message) {
      toast.error(error.data.message)
    }
    else {
      toast.error('Failed to create page')
    }
  }
  finally {
    submitting.value = false
  }
}
</script>

<template>
  <div>
    <form @submit.prevent="handleSubmit">
      <BaseCard title="Create Page">
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
            Create Page
          </BaseButton>
        </template>
      </BaseCard>
    </form>
  </div>
</template>
