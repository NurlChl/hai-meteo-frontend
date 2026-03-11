<script setup lang="ts">
import type { LandingSectionOneContent } from '~/data/landingDefaults'

interface Props {
  content: LandingSectionOneContent
}

const props = defineProps<Props>()
</script>

<template>
  <section class="relative w-full min-h-screen overflow-hidden flex flex-col justify-center items-center text-center text-white bg-black px-6 md:px-12 lg:px-[120px]">
    <div class="absolute inset-0 z-0">
      <!-- Background Base - Earth Video -->
      <div class="w-full h-full bg-slate-900 flex items-center justify-center relative">
        <video autoplay loop muted playsinline class="w-full h-full object-cover opacity-50">
          <source src="/video/Slow Version Hero Meteo.mp4" type="video/mp4">
        </video>
      </div>

      <!-- Overlays -->
      <div class="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/90" />

      <!-- Blue Glow Effect at Bottom -->
      <div class="absolute -bottom-1/4 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-blue-600/30 rounded-full blur-[120px] pointer-events-none" />
    </div>

    <div class="relative z-10 max-w-[1440px] w-full mx-auto flex flex-col items-center mt-16 md:mt-20">
      <!-- Text Container (Frame 32) -->
      <div class="flex flex-col items-center gap-4 md:gap-6 p-0 mb-10 md:mb-12">
        <h1 class="w-full max-w-[914px] font-medium text-4xl md:text-6xl lg:text-[72px] leading-tight lg:leading-[88px] tracking-[-0.8px] text-center text-white whitespace-pre-line">
          {{ content.title }}
        </h1>

        <p class="font-normal text-base md:text-lg lg:text-[20px] leading-relaxed lg:leading-[30px] text-center text-white max-w-3xl">
          {{ content.description }}
        </p>
      </div>

      <div class="relative w-full max-w-6xl aspect-video bg-gradient-to-l from-slate-950 via-slate-950/0 to-slate-950 rounded-3xl p-[10px]">
        <div class="relative w-full h-full rounded-2xl overflow-hidden group">
          <video autoplay loop muted playsinline class="w-full h-full object-cover">
            <source src="/video/Compress%20Demo%203%20HAI%20Meteo.mp4" type="video/mp4">
          </video>
        </div>
      </div>
    </div>
    <div class="absolute bottom-0 left-0 w-full h-80 bg-gradient-to-b from-slate-950/0 to-slate-950 z-20 pointer-events-none" />
  </section>
</template>
