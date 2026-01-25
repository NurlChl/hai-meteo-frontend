<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  placeholder: '',
  disabled: false,
  readonly: false,
  required: false,
  rows: 4,
  options: () => [],
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  'blur': []
}>()

interface Props {
  modelValue: string | number
  type?: string
  label?: string
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  rows?: number
  options?: Array<{ label: string, value: any }>
  error?: string
}

const inputValue = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})

const inputClasses = computed(() => {
  const base = 'w-full px-4 py-3 rounded-xl bg-white/5 border text-text-primary placeholder:text-text-muted transition-all duration-300 outline-none focus:ring-2'
  const state = props.error
    ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20'
    : 'border-white/10 hover:border-white/20 focus:border-primary/50 focus:ring-primary/20 bg-white/5 focus:bg-white/10'
  const disabled = props.disabled ? 'opacity-50 cursor-not-allowed grayscale' : ''

  return `${base} ${state} ${disabled}`
})
</script>

<template>
  <div class="space-y-1.5">
    <label
      v-if="label"
      class="block text-sm font-medium text-text-secondary ml-1"
    >
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>

    <div class="relative group">
      <textarea
        v-if="type === 'textarea'"
        v-model="inputValue"
        v-bind="$attrs"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :rows="rows"
        :class="inputClasses"
        @blur="emit('blur')"
      />

      <select
        v-else-if="type === 'select'"
        v-model="inputValue"
        v-bind="$attrs"
        :disabled="disabled"
        :required="required"
        class="appearance-none"
        :class="[inputClasses]"
        @blur="emit('blur')"
      >
        <option
          v-for="option in options"
          :key="option.value"
          :value="option.value"
          class="bg-bg-dark text-white"
        >
          {{ option.label }}
        </option>
      </select>

      <input
        v-else
        v-model="inputValue"
        v-bind="$attrs"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :class="inputClasses"
        @blur="emit('blur')"
      >

      <div
        v-if="type === 'select'"
        class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted group-hover:text-text-primary transition-colors"
      >
        <Icon path="M19 9l-7 7-7-7" class="h-5 w-5" />
      </div>
    </div>

    <p
      v-if="error"
      class="text-xs text-red-500 ml-1"
    >
      {{ error }}
    </p>
  </div>
</template>
