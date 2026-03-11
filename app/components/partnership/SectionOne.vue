<script setup lang="ts">
import type { PartnershipSectionOneContent } from '~/data/partnershipDefaults'

defineOptions({ name: 'PartnershipSectionOne' })

defineProps<{
  content: PartnershipSectionOneContent
}>()
</script>

<template>
  <section class="relative py-12 md:py-20 lg:py-[90px] px-6 md:px-12 lg:px-[120px] overflow-hidden bg-bg-primary">
    <div>
      <img :src="content.backgroundImage.url" :alt="content.backgroundImage.alt" class="absolute top-0 right-0 h-full object-cover pointer-events-none z-0 opacity-60 lg:opacity-100">
    </div>

    <div class="max-w-[1440px] mx-auto relative z-10">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 lg:gap-0">
        <div class="w-full lg:flex-1 text-center lg:text-left">
          <h1 class="font-sans font-medium text-4xl md:text-5xl lg:text-[56px] leading-tight lg:leading-[68px] tracking-[-0.6px] text-white mb-6 lg:mb-8 whitespace-pre-line">
            {{ content.title }}
          </h1>

          <p class="w-full max-w-[668px] mx-auto lg:mx-0 font-sans font-normal text-base md:text-lg leading-relaxed lg:leading-[28px] text-[#D2D6DB] mb-8 md:mb-10">
            {{ content.description }}
          </p>

          <div class="relative group z-10 inline-flex flex-col sm:flex-row justify-center w-fit mx-auto lg:mx-0">
            <div class="absolute -inset-1.5 bg-gradient-to-r from-blue-600 to-sky-400 rounded-full blur-md opacity-20 group-hover:opacity-60 transition duration-1000 group-hover:duration-300" />

            <NuxtLink :to="content.ctaHref" class="relative flex h-14 w-fit min-w-[200px] items-center justify-center overflow-hidden rounded-full p-[1.5px] focus:outline-none transition-transform duration-300 active:scale-95 group-hover:scale-105">
              <span class="absolute -inset-[1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_33%,#38bdf8_50%,transparent_66%,transparent_100%)] group-hover:bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_15%,#38bdf8_35%,#818cf8_50%,#38bdf8_65%,transparent_85%,transparent_100%)] opacity-80 group-hover:opacity-100 transition-all duration-500" />

              <span class="inline-flex h-full w-full items-center justify-between gap-4 rounded-full bg-gradient-to-br from-[#0c1844] to-[#020515] pl-6 pr-2 py-3 text-sm font-semibold text-white/90 backdrop-blur-3xl transition-all duration-300 group-hover:from-[#102263] group-hover:to-[#061136] group-hover:shadow-[inset_0_0_20px_rgba(56,189,248,0.2)]">
                <span class="text-white text-sm font-semibold font-['Inter'] leading-5 whitespace-nowrap pr-2">{{ content.ctaText }}</span>

                <div class="relative flex items-center justify-center w-10 h-10 rounded-full bg-white/5 group-hover:bg-sky-400/20 transition-colors duration-300 border border-white/5 group-hover:border-sky-400/30 flex-shrink-0">
                  <div class="relative w-4 h-4 flex items-center justify-center overflow-hidden">
                    <svg class="absolute w-4 h-4 text-sky-400 -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" />
                    </svg>
                    <svg class="absolute w-4 h-4 text-sky-400 group-hover:translate-x-full transition-transform duration-300 ease-out" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </span>
            </NuxtLink>
          </div>
        </div>

        <div class="block lg:flex-shrink-0 flex justify-center lg:justify-end mt-8 lg:mt-0">
          <div class="relative w-full max-w-[450px]">
            <img
              :src="content.image.url"
              :alt="content.image.alt"
              class="w-full h-auto object-contain drop-shadow-2xl"
            >
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
