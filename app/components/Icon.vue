<script setup lang="ts">
interface Props {
  path: string
  viewBox?: string
  classAttr?: string
}

const props = withDefaults(defineProps<Props>(), {
  viewBox: '0 0 24 24',
  classAttr: 'h-5 w-5',
})
</script>

<template>
  <svg
    :class="props.classAttr"
    :view-box="props.viewBox"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path :d="props.path" />
  </svg>
</template>
