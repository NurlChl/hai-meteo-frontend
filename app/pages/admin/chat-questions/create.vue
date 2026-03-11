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
  sortOrder: 0,
  isEnabledStatus: '1',
})

const errors = ref<Record<string, string>>({})
const submitting = ref(false)

async function handleSubmit() {
  submitting.value = true
  errors.value = {}

  try {
    const payload = {
      question: form.value.question,
      sortOrder: Number(form.value.sortOrder),
      isEnabled: form.value.isEnabledStatus === '1',
    }

    await post('/chat-questions', payload)
    toast.success('Pertanyaan berhasil dibuat')
    await navigateTo('/admin/chat-questions')
  }
  catch {
    toast.error('Gagal membuat pertanyaan')
  }
  finally {
    submitting.value = false
  }
}
</script>

<template>
  <div>
    <form @submit.prevent="handleSubmit">
      <BaseCard title="Tambah Pertanyaan">
        <template #actions>
          <BaseButton variant="secondary" to="/admin/chat-questions">
            Kembali
          </BaseButton>
        </template>

        <FormInput
          id="question"
          v-model="form.question"
          label="Pertanyaan"
          placeholder="Tulis teks pertanyaan saran..."
          required
          :error="errors.question"
        />

        <FormInput
          id="sortOrder"
          v-model="form.sortOrder"
          label="Urutan Tampil"
          type="number"
          placeholder="0"
          :error="errors.sortOrder"
        />

        <FormInput
          id="isEnabledStatus"
          v-model="form.isEnabledStatus"
          label="Status"
          type="select"
          :options="[
            { label: 'Aktif', value: '1' },
            { label: 'Nonaktif', value: '0' },
          ]"
        />

        <template #footer>
          <BaseButton variant="secondary" type="button" @click="navigateTo('/admin/chat-questions')">
            Batal
          </BaseButton>
          <BaseButton type="submit" variant="primary" :loading="submitting">
            Simpan
          </BaseButton>
        </template>
      </BaseCard>
    </form>
  </div>
</template>
