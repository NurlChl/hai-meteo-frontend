<script setup lang="ts">
import type { LandingSectionOneContent } from '~/data/landingDefaults'

interface Props {
  content: LandingSectionOneContent
}

defineProps<Props>()
</script>

<template>
  <section class="relative w-full min-h-screen overflow-hidden flex flex-col justify-center items-center text-center text-white bg-bg-primary px-6 md:px-12 lg:px-[120px]">
    <div class="absolute inset-0 z-0">
      <div class="w-full h-full bg-bg-primary relative overflow-hidden">
        <video
          v-if="content.backgroundVideo"
          autoplay
          loop
          muted
          playsinline
          class="absolute inset-x-0 top-[28vh] h-full w-full object-cover object-top opacity-50"
        >
          <source :src="content.backgroundVideo" type="video/mp4">
        </video>
      </div>

      <div class="absolute inset-0 bg-gradient-to-b from-bg-primary via-[#03081d]/78 via-38% to-[#02050f]/92" />
      <div class="absolute inset-x-0 top-0 h-[34vh] bg-gradient-to-b from-bg-primary via-bg-primary/95 via-45% to-transparent" />
      <div class="absolute inset-x-0 top-0 h-24 bg-bg-primary/90 backdrop-blur-[2px]" />

      <div class="absolute -bottom-1/4 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-blue-600/30 rounded-full blur-[120px] pointer-events-none" />
    </div>

    <div class="relative z-10 max-w-[1440px] w-full mx-auto flex flex-col items-center mt-16 md:mt-20">
      <div class="flex flex-col items-center gap-4 md:gap-6 p-0 mb-10 md:mb-12">
        <h1 class="w-full max-w-[914px] font-medium text-4xl md:text-6xl lg:text-[72px] leading-tight lg:leading-[88px] tracking-[-0.8px] text-center text-white whitespace-pre-line">
          {{ content.title }}
        </h1>

        <p class="font-normal text-base md:text-lg lg:text-[20px] leading-relaxed lg:leading-[30px] text-center text-white max-w-3xl">
          {{ content.description }}
        </p>
      </div>

      <div class="relative w-full max-w-6xl aspect-video bg-gradient-to-l from-slate-950 via-slate-950/0 to-slate-950 rounded-3xl p-[10px]">
        <div v-if="content.showcaseVideo" class="relative w-full h-full rounded-2xl overflow-hidden group">
          <video autoplay loop muted playsinline class="w-full h-full object-cover">
            <source :src="content.showcaseVideo" type="video/mp4">
          </video>
        </div>
      </div>
    </div>
    <div class="absolute bottom-0 left-0 w-full h-80 bg-gradient-to-b from-slate-950/0 to-slate-950 z-20 pointer-events-none" />
  </section>
</template>
