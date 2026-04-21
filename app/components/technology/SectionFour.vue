<script setup lang="ts">
import type { TechnologySectionContent } from '~/data/technologyDefaults'

defineOptions({ name: 'TechnologySectionFour' })

defineProps<{
  content: TechnologySectionContent
}>()
</script>

<template>
  <section class="relative py-16 md:py-24 lg:py-32 bg-bg-primary overflow-hidden">
    <div class="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_70%)] pointer-events-none" />

    <div class="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
      <div class="max-w-3xl mx-auto mb-12 md:mb-16 lg:mb-20">
        <h2 class="text-3xl md:text-4xl lg:text-5xl font-medium text-white mb-4 md:mb-6">
          {{ content.title }}
        </h2>
        <p class="text-lg md:text-xl text-text-secondary">
          {{ content.description }}
        </p>
      </div>

      <div v-if="content.image.url" class="relative w-full max-w-[1000px] mx-auto">
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-blue-900/20 blur-[100px] rounded-full -z-10" />

        <img
          :src="content.image.url"
          :alt="content.image.alt"
          class="w-full h-auto object-contain relative z-10"
        >
      </div>
    </div>
  </section>
</template>
