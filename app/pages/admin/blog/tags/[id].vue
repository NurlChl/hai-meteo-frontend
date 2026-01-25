<script setup lang="ts">
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

async function loadTag() {
  try {
    const response = (await get(`/blog-tags/${route.params.id}`)) as {
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
    toast.error('Failed to load blog tag')
    await navigateTo('/admin/blog/tags')
  }
}

async function handleSubmit() {
  submitting.value = true
  errors.value = {}

  try {
    await patch(`/blog-tags/${route.params.id}`, form.value)
    toast.success('Blog tag updated successfully')
    await navigateTo('/admin/blog/tags')
  }
  catch (error: any) {
    if (error.data?.message) {
      toast.error(error.data.message)
    }
    else {
      toast.error('Failed to update blog tag')
    }
  }
  finally {
    submitting.value = false
  }
}

onMounted(() => {
  loadTag()
})
</script>

<template>
  <div>
    <form @submit.prevent="handleSubmit">
      <BaseCard title="Edit Blog Tag">
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
            Update
          </BaseButton>
        </template>
      </BaseCard>
    </form>
  </div>
</template>
