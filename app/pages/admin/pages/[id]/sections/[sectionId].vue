<script setup lang="ts">
import type { FetchError } from '~/types'
import FormDynamicJson from '~/components/admin/FormDynamicJson.vue'
import FormInput from '~/components/admin/FormInput.vue'

definePageMeta({
  layout: 'admin',
  middleware: 'auth',
})

const route = useRoute()
const { get, patch } = useApi()
const toast = useToast()

const pageId = computed(() => Number(route.params.id))
const sectionId = computed(() => Number(route.params.sectionId))

const form = ref({
  sectionKey: '',
  sortOrder: 0,
  content: {} as Record<string, unknown>,
  isEnabled: true,
})

const errors = ref<Record<string, string>>({})
const submitting = ref(false)
const loading = ref(true)

async function loadSection() {
  loading.value = true
  try {
    const response = await get(`/page-sections/${sectionId.value}`) as {
      sectionKey?: string
      sortOrder?: number
      content?: Record<string, unknown>
      isEnabled?: boolean
    }
    form.value = {
      sectionKey: response.sectionKey || '',
      sortOrder: response.sortOrder || 0,
      content: response.content || ({} as Record<string, unknown>),
      isEnabled: response.isEnabled !== false,
    }
  }
  catch (err) {
    console.error(err)
    toast.error('Failed to load section')
    await navigateTo(`/admin/pages/${pageId.value}/sections`)
  }
  finally {
    loading.value = false
  }
}

async function handleSubmit() {
  submitting.value = true
  errors.value = {}

  try {
    const payload = {
      sectionKey: form.value.sectionKey,
      sortOrder: Number(form.value.sortOrder),
      content: form.value.content,
      isEnabled: form.value.isEnabled,
    }
    await patch(`/page-sections/${sectionId.value}`, payload)
    toast.success('Section updated successfully')
    await navigateTo(`/admin/pages/${pageId.value}/sections`)
  }
  catch (error: unknown) {
    const e = error as FetchError
    if (e.data?.message) {
      toast.error(e.data.message)
    }
    else {
      toast.error('Failed to update section')
    }
  }
  finally {
    submitting.value = false
  }
}

onMounted(() => {
  loadSection()
})
</script>

<template>
  <div>
    <form @submit.prevent="handleSubmit">
      <BaseCard title="Edit Section">
        <template #actions>
          <BaseButton variant="secondary" :to="`/admin/pages/${pageId}/sections`">
            Back to Sections
          </BaseButton>
        </template>

        <div v-if="loading" class="flex items-center justify-center py-12">
          <div class="text-text-muted">
            Loading...
          </div>
        </div>

        <div v-else class="grid gap-6">
          <FormInput
            id="sectionKey"
            v-model="form.sectionKey"
            label="Section Key"
            placeholder="section-key"
            required
            :error="errors.sectionKey"
          />

          <FormInput
            id="sortOrder"
            v-model.number="form.sortOrder"
            type="number"
            label="Sort Order"
            placeholder="0"
            :error="errors.sortOrder"
          />

          <FormDynamicJson
            v-model="form.content"
            label="Content"
            helper-text="Build your section content dynamically - add key-value pairs or lists"
          />

          <div class="flex items-center gap-3 px-1">
            <input
              id="isEnabled"
              v-model="form.isEnabled"
              type="checkbox"
              class="h-5 w-5 rounded border-white/10 bg-white/5 text-primary focus:ring-primary focus:ring-offset-bg-dark transition-all"
            >
            <label for="isEnabled" class="text-sm font-medium text-text-primary select-none cursor-pointer">
              Enabled
            </label>
          </div>
        </div>

        <template #footer>
          <BaseButton variant="secondary" type="button" @click="navigateTo(`/admin/pages/${pageId}/sections`)">
            Cancel
          </BaseButton>
          <BaseButton type="submit" variant="primary" :loading="submitting" :disabled="loading">
            Update Section
          </BaseButton>
        </template>
      </BaseCard>
    </form>
  </div>
</template>
