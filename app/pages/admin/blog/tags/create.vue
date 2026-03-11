<script setup lang="ts">
import type { FetchError } from '~/types'
import FormInput from '~/components/admin/FormInput.vue'

definePageMeta({
  layout: 'admin',
  middleware: 'auth',
})

const { post } = useApi()
const toast = useToast()

const form = ref({
  name: '',
  slug: '',
})

const errors = ref<Record<string, string>>({})
const submitting = ref(false)

watch(() => form.value.name, (newName) => {
  if (newName) {
    form.value.slug = newName
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
    await post('/blog-tags', form.value)
    toast.success('Blog tag created successfully')
    await navigateTo('/admin/blog/tags')
  }
  catch (error: unknown) {
    const e = error as FetchError
    if (e.data?.message) {
      toast.error(e.data.message)
    }
    else {
      toast.error('Failed to create blog tag')
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
      <BaseCard title="Create Blog Tag">
        <template #actions>
          <BaseButton variant="secondary" to="/admin/blog/tags">
            Back to List
          </BaseButton>
        </template>

        <FormInput
          id="name"
          v-model="form.name"
          label="Name"
          placeholder="Enter tag name"
          required
          :error="errors.name"
        />

        <FormInput
          id="slug"
          v-model="form.slug"
          label="Slug"
          placeholder="tag-slug"
          required
          :error="errors.slug"
        />

        <template #footer>
          <BaseButton variant="secondary" type="button" @click="navigateTo('/admin/blog/tags')">
            Cancel
          </BaseButton>
          <BaseButton type="submit" variant="primary" :loading="submitting">
            Create
          </BaseButton>
        </template>
      </BaseCard>
    </form>
  </div>
</template>
