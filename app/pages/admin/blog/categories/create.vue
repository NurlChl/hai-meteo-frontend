<script setup lang="ts">
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
    await post('/blog-categories', form.value)
    toast.success('Blog category created successfully')
    await navigateTo('/admin/blog/categories')
  }
  catch (error: any) {
    if (error.data?.message) {
      toast.error(error.data.message)
    }
    else {
      toast.error('Failed to create blog category')
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
      <BaseCard title="Create Blog Category">
        <template #actions>
          <BaseButton variant="secondary" to="/admin/blog/categories">
            Back to List
          </BaseButton>
        </template>

        <FormInput
          id="name"
          v-model="form.name"
          label="Name"
          placeholder="Enter category name"
          required
          :error="errors.name"
        />

        <FormInput
          id="slug"
          v-model="form.slug"
          label="Slug"
          placeholder="category-slug"
          required
          :error="errors.slug"
        />

        <template #footer>
          <BaseButton variant="secondary" type="button" @click="navigateTo('/admin/blog/categories')">
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
