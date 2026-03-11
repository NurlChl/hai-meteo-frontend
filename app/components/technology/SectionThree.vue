<script setup lang="ts">
import type { TechnologySectionContent } from '~/data/technologyDefaults'

defineOptions({ name: 'TechnologySectionThree' })

defineProps<{
  content: TechnologySectionContent
}>()

function getIconPath(type: string) {
  switch (type) {
    case 'satellite': return 'M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-6.442-5.942a9 9 0 0112.884 0M2.11 11.5a12.5 12.5 0 0119.778 0'
    case 'historical': return 'M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z'
    case 'reanalysis': return 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
    default: return ''
  }
}
</script>

<template>
  <section class="relative py-16 md:py-24 lg:py-32 px-6 md:px-12 lg:px-[120px] overflow-hidden bg-bg-primary">
    <div class="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
      <div class="w-[400px] h-[400px] md:w-[600px] md:h-[600px] lg:w-[800px] lg:h-[800px] border border-white/10 rounded-full" />
      <div class="absolute w-[600px] h-[600px] md:w-[900px] md:h-[900px] lg:w-[1200px] lg:h-[1200px] border border-white/5 rounded-full" />
      <div class="absolute w-[800px] h-[800px] md:w-[1200px] md:h-[1200px] lg:w-[1600px] lg:h-[1600px] border border-white/5 rounded-full" />
    </div>

    <div class="mx-auto max-w-[1440px] relative z-10">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
        <div class="relative">
          <div class="mb-12 md:mb-16 relative z-10 text-center lg:text-left">
            <h2 class="text-3xl md:text-4xl lg:text-5xl font-medium text-white mb-4 md:mb-6 relative inline-block">
              {{ content.title }}
              <div class="absolute -inset-10 bg-blue-500/20 blur-3xl -z-10 rounded-full translate-y-10" />
            </h2>
            <p class="text-base md:text-lg text-text-secondary max-w-md mx-auto lg:mx-0">
              {{ content.description }}
            </p>
          </div>

          <div class="relative w-full max-w-md mx-auto lg:mx-0">
            <img :src="content.image.url" :alt="content.image.alt" class="w-full h-auto object-contain">
          </div>
        </div>

        <div class="space-y-8 md:space-y-12">
          <div v-for="(item, index) in content.items" :key="index" class="flex gap-4 md:gap-6 group">
            <div class="flex-shrink-0">
              <div class="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-blue-900/20 flex items-center justify-center border border-blue-500/30 text-blue-400 group-hover:scale-110 transition-transform duration-300">
                <svg class="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" :d="getIconPath(item.icon)" />
                </svg>
              </div>
            </div>
            <div>
              <h3 class="text-lg md:text-xl font-semibold text-white mb-2 md:mb-3">
                {{ item.title }}
              </h3>
              <p class="text-sm md:text-base text-text-secondary leading-relaxed">
                {{ item.description }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
