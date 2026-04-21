<script setup lang="ts">
import type { TechnologySectionContent } from '~/data/technologyDefaults'

defineOptions({ name: 'TechnologySectionThree' })

defineProps<{
  content: TechnologySectionContent
}>()

function isAssetUrl(value: string) {
  return value.startsWith('/') || value.startsWith('http://') || value.startsWith('https://')
}
</script>

<template>
  <section
    class="relative py-16 md:py-24 lg:py-32 px-6 md:px-12 lg:px-[120px] overflow-hidden bg-bg-primary"
  >
    <div class="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
      <div
        class="w-[400px] h-[400px] md:w-[600px] md:h-[600px] lg:w-[800px] lg:h-[800px] border border-white/10 rounded-full"
      />
      <div
        class="absolute w-[600px] h-[600px] md:w-[900px] md:h-[900px] lg:w-[1200px] lg:h-[1200px] border border-white/5 rounded-full"
      />
      <div
        class="absolute w-[800px] h-[800px] md:w-[1200px] md:h-[1200px] lg:w-[1600px] lg:h-[1600px] border border-white/5 rounded-full"
      />
    </div>

    <div class="mx-auto max-w-[1440px] relative z-10">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
        <div class="relative">
          <div class="mb-12 md:mb-16 relative z-10 text-center lg:text-left">
            <h2
              class="text-3xl md:text-4xl lg:text-5xl font-medium text-white mb-4 md:mb-6 relative inline-block"
            >
              {{ content.title }}
              <div
                class="absolute -inset-10 bg-blue-500/20 blur-3xl -z-10 rounded-full translate-y-10"
              />
            </h2>
            <p class="text-base md:text-lg text-text-secondary max-w-md mx-auto lg:mx-0">
              {{ content.description }}
            </p>
          </div>

          <div v-if="content.image.url" class="relative w-full max-w-md mx-auto lg:mx-0">
            <img
              :src="content.image.url"
              :alt="content.image.alt"
              class="w-full h-auto object-contain"
            >
          </div>
        </div>

        <div class="space-y-8 md:space-y-12">
          <div
            v-for="(item, index) in content.items"
            :key="index"
            class="flex gap-4 md:gap-6 group"
          >
            <div class="flex-shrink-0">
              <img
                v-if="isAssetUrl(item.icon)"
                :src="item.icon"
                :alt="item.title"
                class="w-8 h-8 object-contain"
              >
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
