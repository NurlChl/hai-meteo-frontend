<script setup lang="ts">
import type { LandingSectionTwoContent } from '~/data/landingDefaults'
import { Brain, CloudRain, History, MapPin } from 'lucide-vue-next'

interface Props {
  content: LandingSectionTwoContent
}

const props = defineProps<Props>()

const iconMap: Record<string, any> = {
  MapPin,
  CloudRain,
  Brain,
  History,
}

function getIcon(iconName: string) {
  return iconMap[iconName] || MapPin
}
</script>

<template>
  <section class="section-two relative py-24 px-6 md:px-28 overflow-hidden bg-[#020515] text-white">
    <!-- Background Glow -->
    <div class="absolute top-[133px] left-1/2 -translate-x-1/2 w-72 h-44 opacity-80 bg-[radial-gradient(ellipse_55.05%_55.05%_at_50.00%_50.00%,_rgba(0,_42,_254,_0)_0%,_rgba(0,_42,_254,_0.24)_100%)] rounded-full blur-3xl pointer-events-none" />

    <div class="max-w-[1200px] mx-auto flex flex-col items-center gap-20 relative z-10">
      <!-- Header -->
      <div class="flex flex-col items-center gap-8">
        <h2 class="text-blue-500 text-2xl font-semibold font-['Inter'] leading-8">
          {{ content.description }}
        </h2>
        <h3 class="max-w-[857px] text-center text-white text-4xl font-medium font-['Inter'] leading-[48px]">
          {{ content.title }}
        </h3>
      </div>

      <!-- Features + Button -->
      <div class="self-stretch flex flex-col items-center gap-14">
        <!-- Feature Cards -->
        <div class="w-full relative flex flex-wrap justify-center lg:justify-between items-center gap-6 lg:gap-0">
          <!-- Horizontal Connector Line -->
          <div class="hidden lg:block absolute top-[115px] left-0 w-full h-0 border-t border-dashed border-white/20" />

          <!-- Animated White Line -->
          <div class="hidden lg:block absolute top-[115px] left-0 w-full h-[1px] overflow-hidden pointer-events-none">
            <div class="absolute top-0 w-[20%] h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-80 animate-beam" />
          </div>

          <!-- Feature Card -->
          <div
            v-for="(feature, index) in content.features"
            :key="index"
            class="w-64 h-48 relative"
          >
            <!-- Card Body -->
            <div class="w-64 px-6 pt-16 pb-7 absolute top-[38px] left-0 rounded-3xl outline outline-1 outline-offset-[-1px] outline-white/10 flex flex-col justify-center items-center gap-5" style="background: conic-gradient(from 255deg at 50% 50%, rgba(0, 0, 0, 0) 160deg, rgba(59, 130, 246, 0.30) 240deg, rgba(46, 81, 140, 0.12) 300deg, rgba(0, 0, 0, 0) 360deg), rgba(2, 5, 21, 0.80);">
              <!-- Feature Title -->
              <div class="self-stretch text-center text-white text-2xl font-normal font-['Inter'] leading-8 whitespace-pre-line">
                {{ feature.title }}
              </div>

              <!-- Star Decorations -->
              <div class="w-52 absolute left-[23px] top-[24px] flex justify-between items-center">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="white" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 0L7.29 4.71L12 6L7.29 7.29L6 12L4.71 7.29L0 6L4.71 4.71L6 0Z" />
                </svg>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="white" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 0L7.29 4.71L12 6L7.29 7.29L6 12L4.71 7.29L0 6L4.71 4.71L6 0Z" />
                </svg>
              </div>
            </div>

            <!-- Icon Circle -->
            <div class="w-20 h-20 absolute left-1/2 -translate-x-1/2 top-0 bg-blue-600/20 rounded-full outline outline-1 outline-offset-[-1px] outline-sky-700 backdrop-blur-xl flex justify-center items-center">
              <component :is="getIcon(feature.icon)" class="w-8 h-8 text-white relative z-10" :stroke-width="1.5" />
            </div>
          </div>
        </div>

        <!-- See More Button Wrapper -->
        <div class="relative mt-8 group z-10 flex justify-center">
          <div class="absolute -inset-1.5 bg-gradient-to-r from-blue-600 to-sky-400 rounded-full blur-md opacity-20 group-hover:opacity-60 transition duration-1000 group-hover:duration-300" />

          <NuxtLink to="/partnership" class="relative flex h-14 w-48 items-center justify-center overflow-hidden rounded-full p-[1.5px] focus:outline-none transition-transform duration-300 active:scale-95 group-hover:scale-105">
            <span class="absolute -inset-[1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_33%,#38bdf8_50%,transparent_66%,transparent_100%)] group-hover:bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_15%,#38bdf8_35%,#818cf8_50%,#38bdf8_65%,transparent_85%,transparent_100%)] opacity-80 group-hover:opacity-100 transition-all duration-500" />

            <span class="inline-flex h-full w-full items-center justify-between rounded-full bg-gradient-to-br from-[#0c1844] to-[#020515] pl-7 pr-2 py-3 text-sm font-semibold text-white/90 backdrop-blur-3xl transition-all duration-300 group-hover:from-[#102263] group-hover:to-[#061136] group-hover:shadow-[inset_0_0_20px_rgba(56,189,248,0.2)]">
              <span class="tracking-[0.2em] uppercase bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent">See More</span>

              <div class="relative flex items-center justify-center w-10 h-10 rounded-full bg-white/5 group-hover:bg-sky-400/20 transition-colors duration-300 border border-white/5 group-hover:border-sky-400/30">
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
    </div>
  </section>
</template>

<style scoped>
.section-two {
  font-family: 'Inter', sans-serif;
}

@keyframes beam {
  0% { left: -20%; }
  100% { left: 100%; }
}

.animate-beam {
  animation: beam 3s linear infinite;
}
</style>
