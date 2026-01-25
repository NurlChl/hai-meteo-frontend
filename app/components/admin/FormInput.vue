<script setup lang="ts">
import BaseInput from '~/components/base/Input.vue'

interface Props {
  id?: string
  modelValue: string | number
  label?: string
  type?: string
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  error?: string
  helperText?: string
  rows?: number
  options?: Array<{ label: string, value: any }>
}

const props = withDefaults(defineProps<Props>(), {
  id: () => `input-${Math.random().toString(36).substr(2, 9)}`,
  type: 'text',
  placeholder: '',
  disabled: false,
  readonly: false,
  required: false,
  error: '',
  helperText: '',
  rows: 4,
  options: () => [],
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  'blur': []
}>()

const inputValue = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})

function handleBlur() {
  emit('blur')
}
</script>

<template>
  <div class="mb-4">
    <label v-if="label" :for="id" class="block text-sm font-medium text-text-secondary mb-1">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <BaseInput
      :id="id"
      v-model="inputValue"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :required="required"
      :rows="rows"
      :options="options"
      :class="{ 'border-red-500': error }"
      @blur="handleBlur"
    />
    <p v-if="error" class="mt-1 text-sm text-red-600">
      {{ error }}
    </p>
    <p v-else-if="helperText" class="mt-1 text-sm text-text-muted">
      {{ helperText }}
    </p>
  </div>
</template>
