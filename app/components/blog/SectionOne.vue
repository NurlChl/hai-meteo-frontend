<script setup lang="ts">
import type { BlogSectionOneContent } from '~/data/blogDefaults'

interface Props {
  content: BlogSectionOneContent
}

defineOptions({ name: 'BlogSectionOne' })

defineProps<Props>()
</script>

<template>
  <section class="relative py-12 md:py-20 lg:py-[90px] px-6 md:px-12 lg:px-[120px] overflow-hidden bg-bg-primary">
    <div class="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none" />
    <img
      v-if="content.backgroundImage"
      :src="content.backgroundImage.url"
      :alt="content.backgroundImage.alt"
      class="absolute bottom-0 left-1/2 -translate-x-1/2 h-[500px] object-cover pointer-events-none z-0 opacity-50"
    >

    <div class="mx-auto max-w-[1440px] relative z-10 text-center">
      <h1 class="text-4xl md:text-5xl lg:text-[56px] leading-tight lg:leading-[68px] tracking-[-0.6px] font-medium text-white mb-6 lg:mb-8">
        {{ content.title }}
      </h1>

      <p class="max-w-[768px] mx-auto text-base md:text-lg leading-relaxed lg:leading-[28px] text-text-secondary">
        {{ content.description }}
      </p>
    </div>
  </section>
</template>
