<script setup lang="ts">
import type { LandingSectionFourContent } from '~/data/landingDefaults'
import { BarChart3, Database, Signal } from 'lucide-vue-next'
import { defineAsyncComponent } from 'vue'
import { landingSectionFourAnimationFile } from '~/data/landingDefaults'

interface Props {
  content: LandingSectionFourContent
}

defineProps<Props>()

const Vue3Lottie = defineAsyncComponent(() => import('vue3-lottie').then(module => module.Vue3Lottie))

const iconMap: Record<string, any> = {
  Signal,
  Database,
  BarChart3,
}

function getIcon(iconName: string) {
  return iconMap[iconName] || Signal
}

function isAssetUrl(value: string) {
  return value.startsWith('/') || value.startsWith('http://') || value.startsWith('https://')
}
</script>

<template>
  <section class="py-16 md:py-24 px-6 md:px-12 lg:px-[120px] bg-[#020515] text-white overflow-hidden relative font-['Inter']">
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-blue-900/10 blur-[120px] rounded-full pointer-events-none" />

    <div class="max-w-[1110px] mx-auto flex flex-col items-center gap-20 relative z-10">
      <div class="flex flex-col items-center w-full">
        <div class="relative w-full max-w-[1200px]">
          <div class="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-0 pointer-events-none w-[320px] h-[320px] sm:w-[520px] sm:h-[520px] md:w-[820px] md:h-[820px] lg:w-[1100px] lg:h-[1100px] flex items-center justify-center overflow-hidden">
            <ClientOnly>
              <Vue3Lottie
                :animation-link="landingSectionFourAnimationFile"
                class="w-full h-full"
              />
            </ClientOnly>

            <div class="absolute bottom-0 left-0 w-full h-1/2 z-10 pointer-events-none">
              <div class="absolute inset-0 backdrop-blur-[12px] [mask-image:linear-gradient(to_bottom,transparent_0%,black_30%,black_100%)] [-webkit-mask-image:linear-gradient(to_bottom,transparent_0%,black_30%,black_100%)]" />
              <div class="absolute inset-0 bg-gradient-to-b from-transparent via-[#020515]/90 to-[#020515]" />
            </div>
          </div>

          <div class="relative z-10 w-full overflow-hidden flex justify-center items-end" style="padding-bottom: 50%;">
            <img
              v-if="content.radarImage?.url"
              :src="content.radarImage.url"
              class="absolute left-1/2 -translate-x-1/2 w-[100%] max-w-none h-auto"
              style="top: 2.5%;"
              :alt="content.radarImage.alt"
            >
          </div>

          <div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-[100vw] z-20 flex items-center justify-center translate-y-1/2">
            <div class="w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-80" />
            <div class="w-3/4 h-[4px] bg-gradient-to-r from-transparent via-blue-600 to-transparent blur-[2px] absolute pointer-events-none" />
            <div class="w-1/2 h-[12px] bg-gradient-to-r from-transparent via-blue-700/50 to-transparent blur-md absolute pointer-events-none" />
          </div>

          <div class="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-30 flex items-center justify-center">
            <div
              class="w-[76px] h-[76px] md:w-[90px] md:h-[90px] relative rounded-full flex items-center justify-center z-20"
              style="box-shadow: 0px 0px 20px 10px rgba(59,130,246,0.3), 0px 0px 50px 20px rgba(59,130,246,0.12);"
            >
              <div class="w-full h-full absolute inset-0 bg-blue-600 rounded-full border border-white/20" />
              <div class="w-[96%] h-[96%] absolute bg-blue-600 rounded-full overflow-hidden flex items-center justify-center">
                <div class="w-24 h-16 absolute -left-2 top-2 bg-white blur-2xl opacity-35" />
                <img v-if="content.logoImage?.url" :src="content.logoImage.url" :alt="content.logoImage.alt" class="w-full h-full object-cover relative z-10">
              </div>
            </div>
          </div>
        </div>

        <div class="h-16 md:h-20" />

        <div class="flex flex-col items-center gap-6 mt-2 relative z-30">
          <div class="text-blue-500 text-2xl font-semibold leading-7">
            {{ content.description }}
          </div>
          <div class="max-w-[828px] text-center text-white/90 text-3xl md:text-4xl font-medium leading-[48px]">
            {{ content.title }}
          </div>
        </div>
      </div>

      <div class="w-full grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 text-center relative z-30">
        <div v-for="(tech, index) in content.technologies" :key="index" class="flex flex-col items-center gap-4">
          <img
            v-if="isAssetUrl(tech.icon)"
            :src="tech.icon"
            :alt="tech.title"
            class="w-12 h-12 object-contain relative z-10"
          >
          <component :is="getIcon(tech.icon)" v-else class="w-8 h-8 text-white relative z-10" :stroke-width="1.5" />
          <div class="flex flex-col items-center gap-2">
            <h4 class="text-violet-50 text-xl font-medium leading-8">
              {{ tech.title }}
            </h4>
            <p class="text-gray-300 text-base font-normal leading-6 max-w-xs">
              {{ tech.description }}
            </p>
          </div>
        </div>
      </div>

      <div class="relative group z-10 flex justify-center mt-6">
        <div class="absolute -inset-1.5 bg-gradient-to-r from-blue-600 to-sky-400 rounded-full blur-md opacity-20 group-hover:opacity-60 transition duration-1000 group-hover:duration-300" />

        <NuxtLink to="/technology" class="relative flex h-14 w-52 items-center justify-center overflow-hidden rounded-full p-[1.5px] focus:outline-none transition-transform duration-300 active:scale-95 group-hover:scale-105">
          <span class="absolute -inset-[1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_33%,#38bdf8_50%,transparent_66%,transparent_100%)] group-hover:bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_15%,#38bdf8_35%,#818cf8_50%,#38bdf8_65%,transparent_85%,transparent_100%)] opacity-80 group-hover:opacity-100 transition-all duration-500" />

          <span class="inline-flex h-full w-full items-center justify-between rounded-full bg-gradient-to-br from-[#0c1844] to-[#020515] pl-7 pr-2 py-3 text-sm font-semibold text-white/90 backdrop-blur-3xl transition-all duration-300 group-hover:from-[#102263] group-hover:to-[#061136] group-hover:shadow-[inset_0_0_20px_rgba(56,189,248,0.2)]">
            <span class="text-white text-sm font-semibold font-['Inter'] leading-5 truncate pr-2">Our Technology</span>

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
  </section>
</template>
