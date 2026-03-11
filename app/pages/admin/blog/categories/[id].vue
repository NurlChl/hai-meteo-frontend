<script setup lang="ts">
import type { FetchError } from '~/types'
import FormInput from '~/components/admin/FormInput.vue'

definePageMeta({
  layout: 'admin',
  middleware: 'auth',
})

const route = useRoute()
const { get, patch } = useApi()
const toast = useToast()

const form = ref({
  name: '',
  slug: '',
})

const errors = ref<Record<string, string>>({})
const submitting = ref(false)

async function loadCategory() {
  try {
    const response = (await get(`/blog-categories/${route.params.id}`)) as {
      name?: string
      slug?: string
    }
    form.value = {
      name: response.name || '',
      slug: response.slug || '',
    }
  }
  catch (err) {
    console.error(err)
    toast.error('Failed to load blog category')
    await navigateTo('/admin/blog/categories')
  }
}

async function handleSubmit() {
  submitting.value = true
  errors.value = {}

  try {
    await patch(`/blog-categories/${route.params.id}`, form.value)
    toast.success('Blog category updated successfully')
    await navigateTo('/admin/blog/categories')
  }
  catch (error: unknown) {
    const e = error as FetchError
    if (e.data?.message) {
      toast.error(e.data.message)
    }
    else {
      toast.error('Failed to update blog category')
    }
  }
  finally {
    submitting.value = false
  }
}

onMounted(() => {
  loadCategory()
})
</script>

<template>
  <div>
    <form @submit.prevent="handleSubmit">
      <BaseCard title="Edit Blog Category">
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
            Update
          </BaseButton>
        </template>
      </BaseCard>
    </form>
  </div>
</template>
