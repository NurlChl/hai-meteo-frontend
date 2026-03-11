<script setup lang="ts">
import type { LandingSectionSixContent } from '~/data/landingDefaults'
import { ChevronDown } from 'lucide-vue-next'
import { ref } from 'vue'

interface Props {
  content: LandingSectionSixContent
}

const props = defineProps<Props>()

const activeIndex = ref<number | null>(null)

function toggle(index: number) {
  activeIndex.value = activeIndex.value === index ? null : index
}
</script>

<template>
  <section id="faq" class="relative py-16 md:py-24 px-6 md:px-12 lg:px-[120px] bg-[#020515] text-white overflow-hidden">
    <!-- Background Radial Glow -->
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] md:w-[700px] h-60 bg-[radial-gradient(ellipse_55%_55%_at_50%_50%,_rgba(0,42,254,0.5)_0%,_rgba(0,42,254,0)_100%)] rounded-full blur-3xl pointer-events-none" />

    <div class="max-w-[1440px] mx-auto relative z-10">
      <!-- Header -->
      <div class="flex flex-col items-center gap-4 mb-12 md:mb-16 text-center">
        <h2 class="text-blue-500 text-xl md:text-2xl font-semibold font-['Inter'] leading-7">
          FAQ
        </h2>
        <h3 class="text-white text-3xl md:text-4xl font-medium font-['Inter'] leading-tight md:leading-[48px]">
          {{ content.title }}
        </h3>
        <h6 class="max-w-6xl text-gray-300 text-base md:text-xl font-medium font-['Inter'] leading-7 md:leading-8">
          {{ content.description }}
        </h6>
      </div>

      <!-- FAQ List -->
      <div class="w-full max-w-[992px] mx-auto flex flex-col">
        <div
          v-for="(faq, index) in content.faqs"
          :key="index"
          class="border-b border-white/10 cursor-pointer"
          @click="toggle(index)"
        >
          <!-- Question -->
          <div class="flex items-center justify-between py-6 md:py-7 gap-4">
            <span class="flex-1 text-white text-base md:text-xl font-medium font-['Inter'] leading-7 md:leading-8">
              {{ index + 1 }}. {{ faq.question }}
            </span>
            <div class="flex-shrink-0 p-1">
              <ChevronDown
                class="w-5 h-5 text-white transition-transform duration-300"
                :class="{ 'rotate-180': activeIndex === index }"
              />
            </div>
          </div>

          <!-- Answer (collapsible) -->
          <div
            class="overflow-hidden transition-all duration-300 ease-in-out"
            :style="{
              maxHeight: activeIndex === index ? '300px' : '0px',
              opacity: activeIndex === index ? 1 : 0,
            }"
          >
            <p class="pb-6 md:pb-7 text-gray-400 text-sm md:text-base font-normal font-['Inter'] leading-6 md:leading-7 pr-10">
              {{ faq.answer }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
