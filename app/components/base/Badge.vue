<script setup lang="ts">
interface Props {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'
  size?: 'sm' | 'md'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'md',
})

const classes = computed(() => {
  const base = 'inline-flex items-center justify-center font-bold tracking-wide uppercase'

  const sizes = {
    sm: 'px-2 py-0.5 text-[10px] rounded-md',
    md: 'px-2.5 py-1 text-[11px] rounded-lg',
  }

  const variants = {
    default: 'bg-white/10 text-text-secondary border border-white/10',
    success: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    danger: 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
    info: 'bg-sky-500/10 text-sky-400 border border-sky-500/20',
  }

  return `${base} ${sizes[props.size]} ${variants[props.variant]}`
})
</script>

<template>
  <span :class="classes">
    <slot />
  </span>
</template>
