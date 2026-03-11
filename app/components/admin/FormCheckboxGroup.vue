<script setup lang="ts" generic="T extends string | number">
interface Option {
  id: T
  name: string
  [key: string]: unknown
}

interface Props {
  modelValue: T[]
  label?: string
  options: Option[]
  required?: boolean
  error?: string
  helperText?: string
  disabled?: boolean
  maxHeight?: string
  emptyText?: string
  idKey?: string
  labelKey?: string
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  required: false,
  error: '',
  helperText: '',
  disabled: false,
  maxHeight: 'max-h-48',
  emptyText: 'No options available',
  idKey: 'id',
  labelKey: 'name',
})

const emit = defineEmits<{
  'update:modelValue': [value: T[]]
}>()

const selectedIds = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})

function getOptionId(option: Option): T {
  return option[props.idKey] as T
}

function getOptionLabel(option: Option): string {
  return option[props.labelKey] as string
}

function isChecked(optionId: T): boolean {
  return selectedIds.value.includes(optionId)
}

function toggleOption(optionId: T): void {
  if (props.disabled)
    return

  const currentValues = [...selectedIds.value]
  const index = currentValues.indexOf(optionId)

  if (index === -1) {
    currentValues.push(optionId)
  }
  else {
    currentValues.splice(index, 1)
  }

  selectedIds.value = currentValues
}

const hasOptions = computed(() => props.options.length > 0)
</script>

<template>
  <div class="mb-4">
    <label v-if="label" class="block text-sm font-medium text-text-secondary mb-2">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>

    <div
      class="space-y-2 p-4 rounded-xl border transition-colors overflow-y-auto" :class="[
        error
          ? 'bg-red-500/5 border-red-500/50'
          : 'bg-white/5 border-white/10',
        maxHeight,
      ]"
    >
      <template v-if="hasOptions">
        <label
          v-for="option in options"
          :key="getOptionId(option)"
          class="flex items-center space-x-2 p-2 rounded transition-colors" :class="[
            disabled
              ? 'opacity-50 cursor-not-allowed'
              : 'cursor-pointer hover:bg-white/5',
          ]"
        >
          <input
            :id="`checkbox-${getOptionId(option)}`"
            :checked="isChecked(getOptionId(option))"
            type="checkbox"
            :value="getOptionId(option)"
            :disabled="disabled"
            class="w-4 h-4 rounded border-white/20 bg-white/5 text-primary focus:ring-2 focus:ring-primary/20 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
            @change="toggleOption(getOptionId(option))"
          >
          <span class="text-text-primary text-sm select-none">
            {{ getOptionLabel(option) }}
          </span>
        </label>
      </template>

      <p
        v-else
        class="text-text-muted text-sm text-center py-2"
      >
        {{ emptyText }}
      </p>
    </div>

    <p v-if="error" class="mt-1 text-sm text-red-600">
      {{ error }}
    </p>
    <p v-else-if="helperText" class="mt-1 text-sm text-text-muted">
      {{ helperText }}
    </p>
  </div>
</template>
