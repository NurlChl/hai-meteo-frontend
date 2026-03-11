<script setup lang="ts">
import { computed } from 'vue'
import type { FeaturesSectionThreeContent } from '~/data/featuresDefaults'

interface Props {
  content: FeaturesSectionThreeContent
}

const props = defineProps<Props>()

const allFeatures = computed(() => {
  return [...props.content.topFeatures, ...props.content.bottomFeatures]
})

function getIconPath(type: string) {
  switch (type) {
    case 'chart-bar': return 'M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z'
    case 'clock': return 'M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z'
    case 'calendar': return 'M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z'
    case 'sun': return 'M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.79 1.42-1.41zM4 10.5H1v2h3v-2zm9-9.95h-2V3.5h2V.55zm7.45 3.91l-1.41-1.41-1.79 1.79 1.41 1.41 1.79-1.79zm-3.21 13.7l1.79 1.79 1.41-1.41-1.79-1.79-1.41 1.41zM20 10.5v2h3v-2h-3zm-8-5c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm-1 16.95h2V19.5h-2v2.95zm-7.45-3.91l1.41 1.41 1.79-1.8-1.41-1.41-1.79 1.8z'
    case 'shield-exclamation': return 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z'
    default: return ''
  }
}
</script>

<template>
  <section class="py-16 md:py-24 lg:py-[140px] px-6 md:px-12 lg:px-[120px] bg-bg-primary text-white">
    <div class="mx-auto max-w-[1440px]">
      <div class="text-center mb-10 md:mb-12 lg:mb-16">
        <h2 class="text-3xl md:text-4xl lg:text-[40px] leading-tight lg:leading-[48px] font-medium">
          {{ content.title }}
        </h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        <div
          v-for="(feature, index) in allFeatures"
          :key="index"
          class="bg-bg-secondary border border-white/5 rounded-2xl p-6 md:p-8 hover:border-white/10 transition-colors flex flex-col items-center text-center overflow-hidden"
          :class="{
            'md:col-span-2 lg:col-span-2': feature.id === 'climate-extremes'
          }"
        >
          <!-- Show icon only if feature doesn't have an image design -->
          <div v-if="!['detail-prediction', 'multi-year-historical', 'short-long-forecasts', 'seasonal-intelligence', 'climate-extremes'].includes(feature.id)" class="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center mb-6 text-white text-opacity-80">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path :d="getIconPath(feature.icon)" />
            </svg>
          </div>
          
          <h3 class="text-lg md:text-xl font-medium mb-4 mt-2">
            {{ feature.title }}
          </h3>
          <p class="text-text-secondary text-sm md:text-base leading-relaxed" 
            :class="[
              ['detail-prediction', 'multi-year-historical', 'short-long-forecasts', 'seasonal-intelligence'].includes(feature.id) ? 'mb-8' : '',
              feature.id === 'climate-extremes' ? 'max-w-md mx-auto' : ''
            ]"
          >
            {{ feature.description }}
          </p>

          <div v-if="['detail-prediction', 'multi-year-historical', 'short-long-forecasts'].includes(feature.id)" class="w-full mt-auto">
            <img :src="`/images/features/${feature.id === 'short-long-forecasts' ? 'short-to-long-term-forecasts' : feature.id}.png`" :alt="`${feature.title} UI`" class="w-full h-auto object-contain" />
          </div>

          <div v-if="feature.id === 'climate-extremes'" class="w-full mt-auto pt-8 lg:pt-10 w-[95%] mx-auto">
            <img src="/images/features/Climate-Extremes-Summary.png" alt="Climate Extremes Summary UI" class="w-full h-auto object-contain mx-auto" />
          </div>

          <div v-if="feature.id === 'seasonal-intelligence'" class="w-full mt-auto pt-6 lg:pt-8 flex flex-col overflow-visible">
            <div class="relative w-full pb-[85%] mx-auto max-w-[90%]">
              <!-- Dry Season (Top Left) -->
              <img 
                src="/images/features/Seasonal-Intelligence-1.png" 
                alt="Dry Season UI" 
                class="absolute top-0 left-0 w-[80%] h-auto object-contain z-10 drop-shadow-xl transition-transform hover:z-30 hover:scale-105 duration-300" 
              />
              <!-- Wet Season (Bottom Right) -->
              <img 
                src="/images/features/Seasonal-Intelligence-2.png" 
                alt="Wet Season UI" 
                class="absolute top-[45%] right-0 w-[80%] h-auto object-contain z-20 drop-shadow-xl transition-transform hover:z-30 hover:scale-105 duration-300" 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
