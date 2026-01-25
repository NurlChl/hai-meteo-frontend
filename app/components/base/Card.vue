<script setup lang="ts">
interface Props {
  variant?: 'default' | 'glass'
  title?: string
  noPadding?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  title: '',
  noPadding: false,
})

const classes = computed(() => {
  const base = 'relative overflow-hidden transition-all duration-300 rounded-2xl'
  const padding = props.noPadding ? '' : 'p-4 sm:p-6 lg:p-8'

  const variants = {
    default: 'bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl',
    glass: 'bg-white/[0.02] backdrop-blur-2xl border border-white/[0.05] shadow-inner-glow',
  }

  return `${base} ${padding} ${variants[props.variant]}`
})
</script>

<template>
  <div :class="classes">
    <div
      v-if="title || $slots.actions"
      class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8"
    >
      <h3
        v-if="title"
        class="text-lg sm:text-xl font-bold text-text-primary tracking-tight"
      >
        {{ title }}
      </h3>
      <div
        v-if="$slots.actions"
        class="flex items-center gap-2"
      >
        <slot name="actions" />
      </div>
    </div>

    <div class="text-text-secondary leading-relaxed">
      <slot />
    </div>

    <div
      v-if="$slots.footer"
      class="mt-6 sm:mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-end gap-3"
    >
      <slot name="footer" />
    </div>
  </div>
</template>
