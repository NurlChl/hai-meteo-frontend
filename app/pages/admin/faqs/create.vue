<script setup lang="ts">
import FormInput from '~/components/admin/FormInput.vue'

definePageMeta({
  layout: 'admin',
  middleware: 'auth',
})

const { post } = useApi()
const toast = useToast()

const form = ref({
  question: '',
  answerMd: '',
  sortOrder: 0,
  isPublishedStatus: '0',
})

const errors = ref<Record<string, string>>({})
const submitting = ref(false)

async function handleSubmit() {
  submitting.value = true
  errors.value = {}

  try {
    const payload = {
      question: form.value.question,
      answerMd: form.value.answerMd,
      sortOrder: Number(form.value.sortOrder),
      isPublished: form.value.isPublishedStatus === '1',
    }

    await post('/faqs', payload)
    toast.success('FAQ created successfully')
    await navigateTo('/admin/faqs')
  }
  catch {
    toast.error('Failed to create FAQ')
  }
  finally {
    submitting.value = false
  }
}
</script>

<template>
  <div>
    <form @submit.prevent="handleSubmit">
      <BaseCard title="Create FAQ">
        <template #actions>
          <BaseButton variant="secondary" to="/admin/faqs">
            Back to List
          </BaseButton>
        </template>

        <FormInput
          id="question"
          v-model="form.question"
          label="Question"
          placeholder="Enter question"
          required
          :error="errors.question"
        />

        <FormInput
          id="answerMd"
          v-model="form.answerMd"
          label="Answer (Markdown)"
          type="textarea"
          :rows="5"
          required
          placeholder="Enter answer in Markdown"
          :error="errors.answerMd"
        />

        <FormInput
          id="sortOrder"
          v-model="form.sortOrder"
          label="Sort Order"
          type="number"
          placeholder="0"
          :error="errors.sortOrder"
        />

        <FormInput
          id="isPublishedStatus"
          v-model="form.isPublishedStatus"
          label="Status"
          type="select"
          :options="[
            { label: 'Draft', value: '0' },
            { label: 'Published', value: '1' },
          ]"
        />

        <template #footer>
          <BaseButton variant="secondary" type="button" @click="navigateTo('/admin/faqs')">
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
