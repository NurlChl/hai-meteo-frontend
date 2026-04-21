<script setup lang="ts">
import type { TechnologySectionContent } from '~/data/technologyDefaults'

defineOptions({ name: 'TechnologySectionOne' })

defineProps<{
  content: TechnologySectionContent
}>()
</script>

<template>
  <section class=" relative py-12 md:py-20 lg:py-[90px] px-6 md:px-12 lg:px-[120px] overflow-hidden bg-bg-primary">
    <div v-if="content.backgroundImage?.url">
      <img :src="content.backgroundImage.url" :alt="content.backgroundImage.alt" class="absolute top-0 min-[1440px]: right-0 h-full object-cover pointer-events-none z-0 opacity-50 lg:opacity-100">
    </div>

    <div class="max-w-[1440px] mx-auto relative z-10">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 lg:gap-0">
        <div class="w-full lg:flex-1 text-center lg:text-left">
          <h1 class="font-sans font-medium text-4xl md:text-5xl lg:text-[56px] leading-tight lg:leading-[68px] tracking-[-0.6px] text-white flex-none self-stretch grow-0 mb-6 lg:mb-8 whitespace-pre-line">
            {{ content.title }}
          </h1>

          <p class="w-full max-w-[668px] mx-auto lg:mx-0 font-sans font-normal text-base md:text-lg leading-relaxed lg:leading-[28px] text-[#D2D6DB] flex-none order-1 grow-0">
            {{ content.description }}
          </p>
        </div>

        <div v-if="content.image.url" class="block lg:flex-shrink-0 flex justify-center lg:justify-end mt-8 lg:mt-0">
          <img :src="content.image.url" :alt="content.image.alt" class="w-full max-w-[300px] md:max-w-[400px] lg:max-w-[450px] h-auto">
        </div>
      </div>
    </div>
  </section>
</template>
