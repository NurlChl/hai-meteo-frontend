<script setup lang="ts">
import FormImageUpload from '~/components/admin/FormImageUpload.vue'
import FormInput from '~/components/admin/FormInput.vue'

definePageMeta({
  layout: 'admin',
  middleware: 'auth',
})

const route = useRoute()
const { get, patch } = useApi()
const toast = useToast()

const form = ref({
  label: '',
  href: '',
  location: 'header',
  iconMediaId: null as number | null,
  sortOrder: 0,
  isEnabled: true,
})

const errors = ref<Record<string, string>>({})
const submitting = ref(false)

async function loadNavItem() {
  try {
    const response = (await get(`/navigation-items/${route.params.id}`)) as {
      label?: string
      href?: string
      location?: string
      iconMediaId?: number | null
      sortOrder?: number
      isEnabled?: boolean
    }
    form.value = {
      label: response.label || '',
      href: response.href || '',
      location: response.location || 'header',
      iconMediaId: response.iconMediaId || null,
      sortOrder: response.sortOrder || 0,
      isEnabled: typeof response.isEnabled === 'boolean' ? response.isEnabled : true,
    }
  }
  catch (err) {
    console.error(err)
    toast.error('Failed to load navigation item')
    await navigateTo('/admin/navigation')
  }
}

async function handleSubmit() {
  submitting.value = true
  errors.value = {}

  try {
    await patch(`/navigation-items/${route.params.id}`, form.value)
    toast.success('Navigation item updated successfully')
    await navigateTo('/admin/navigation')
  }
  catch (error: unknown) {
    const err = error as { data?: { message?: string } }
    if (err.data?.message) {
      toast.error(err.data.message)
    }
    else {
      toast.error('Failed to update navigation item')
    }
  }
  finally {
    submitting.value = false
  }
}

onMounted(() => {
  loadNavItem()
})
</script>

<template>
  <div>
    <form @submit.prevent="handleSubmit">
      <BaseCard title="Edit Navigation Item">
        <template #actions>
          <BaseButton variant="secondary" to="/admin/navigation">
            Back to List
          </BaseButton>
        </template>

        <div class="grid gap-6">
          <FormInput
            id="label"
            v-model="form.label"
            label="Label"
            placeholder="Enter label"
            required
            :error="errors.label"
          />

          <FormInput
            id="href"
            v-model="form.href"
            label="URL (href)"
            placeholder="/example or https://..."
            required
            :error="errors.href"
          />

          <FormInput
            id="location"
            v-model="form.location"
            label="Location"
            type="select"
            :options="[
              { label: 'Header', value: 'header' },
              { label: 'Footer', value: 'footer' },
              { label: 'Social', value: 'social' },
            ]"
            required
          />

          <FormImageUpload
            v-model="form.iconMediaId"
            label="Icon Image"
            helper-text="Upload an icon for this navigation item (optional)"
          />

          <FormInput
            id="sortOrder"
            v-model="form.sortOrder"
            label="Sort Order"
            type="number"
            required
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
          <BaseButton variant="secondary" type="button" @click="navigateTo('/admin/navigation')">
            Cancel
          </BaseButton>
          <BaseButton type="submit" variant="primary" :loading="submitting">
            Update Item
          </BaseButton>
        </template>
      </BaseCard>
    </form>
  </div>
</template>
