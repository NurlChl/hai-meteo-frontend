<script setup lang="ts">
interface Props {
  type?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'secondary' | 'small' | 'link' | 'danger'
  disabled?: boolean
  loading?: boolean
  to?: string
  fullWidth?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'button',
  variant: 'primary',
  disabled: false,
  loading: false,
  fullWidth: false,
})

const classes = computed(() => {
  const base = 'inline-flex items-center justify-center rounded-xl text-sm font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg-dark'

  const sizes = {
    primary: 'px-8 py-3.5',
    secondary: 'px-8 py-3.5',
    small: 'px-4 py-2 text-xs',
    link: 'p-0',
    danger: 'px-8 py-3.5',
  }

  const variants = {
    primary: 'bg-primary text-white shadow-lg shadow-primary/20 hover:bg-primary-light hover:-translate-y-0.5 focus:ring-primary',
    secondary: 'bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20 focus:ring-white/20',
    small: 'bg-white/5 border border-white/10 text-white hover:bg-white/10 focus:ring-primary',
    link: 'bg-transparent text-primary hover:text-primary-light underline-offset-4 hover:underline',
    danger: 'bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white focus:ring-red-500',
  }

  return [
    base,
    sizes[props.variant === 'small' ? 'small' : props.variant],
    variants[props.variant],
    props.fullWidth ? 'w-full' : '',
  ].join(' ')
})
</script>

<template>
  <NuxtLink
    v-if="to"
    :to="to"
    :class="classes"
  >
    <svg
      v-if="loading"
      class="animate-spin -ml-1 mr-3 h-4 w-4 text-current"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      />
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
    <slot />
  </NuxtLink>

  <button
    v-else
    :type="type"
    :disabled="disabled || loading"
    :class="classes"
  >
    <svg
      v-if="loading"
      class="animate-spin -ml-1 mr-3 h-4 w-4 text-current"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      />
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
    <slot />
  </button>
</template>
