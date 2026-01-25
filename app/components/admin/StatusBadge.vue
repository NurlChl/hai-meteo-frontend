<script setup lang="ts">
import BaseBadge from '~/components/base/Badge.vue'

interface Props {
  status: string
  type?: 'blog' | 'message' | 'default'
  size?: 'sm' | 'md'
}

const props = withDefaults(defineProps<Props>(), {
  type: 'default',
  size: 'sm',
})

const text = computed(() => {
  if (props.type === 'blog') {
    return props.status.charAt(0).toUpperCase() + props.status.slice(1)
  }
  return props.status.charAt(0).toUpperCase() + props.status.slice(1)
})

const variant = computed(() => {
  const status = props.status.toLowerCase()

  if (props.type === 'blog') {
    switch (status) {
      case 'published':
        return 'success'
      case 'draft':
        return 'warning'
      case 'archived':
        return 'danger'
      default:
        return 'info'
    }
  }

  if (props.type === 'message') {
    switch (status) {
      case 'done':
        return 'success'
      case 'in_progress':
        return 'warning'
      case 'new':
        return 'info'
      case 'spam':
        return 'danger'
      default:
        return 'info'
    }
  }

  return 'info'
})
</script>

<template>
  <BaseBadge :variant="variant" :size="size">
    {{ text }}
  </BaseBadge>
</template>
