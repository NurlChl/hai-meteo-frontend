<script setup lang="ts">
import type { FeaturesSectionThreeContent } from '~/data/featuresDefaults'
import { computed } from 'vue'

interface Props {
  content: FeaturesSectionThreeContent
}

const props = defineProps<Props>()

const allFeatures = computed(() => {
  return [...props.content.topFeatures, ...props.content.bottomFeatures]
})

function isAssetUrl(value: string) {
  return value.startsWith('/') || value.startsWith('http://') || value.startsWith('https://')
}

function hasPrimaryImage(feature: FeaturesSectionThreeContent['topFeatures'][number]) {
  return Boolean(feature.image && isAssetUrl(feature.image))
}

function hasSecondaryImage(feature: FeaturesSectionThreeContent['topFeatures'][number]) {
  return Boolean(feature.secondaryImage && isAssetUrl(feature.secondaryImage))
}
</script>

<template>
  <section
    class="py-16 md:py-24 lg:py-[140px] px-6 md:px-12 lg:px-[120px] bg-bg-primary text-white"
  >
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
            'md:col-span-2 lg:col-span-2': feature.id === 'climate-extremes',
          }"
        >
          <h3 class="text-lg md:text-xl font-medium mb-4 mt-2">
            {{ feature.title }}
          </h3>
          <p
            class="text-text-secondary text-sm md:text-base leading-relaxed"
            :class="[
              hasPrimaryImage(feature) ? 'mb-8' : '',
              feature.id === 'climate-extremes' ? 'max-w-md mx-auto' : '',
            ]"
          >
            {{ feature.description }}
          </p>

          <div
            v-if="
              hasPrimaryImage(feature)
                && feature.id !== 'climate-extremes'
                && !(feature.id === 'seasonal-intelligence' && hasSecondaryImage(feature))
            "
            class="w-full mt-auto"
          >
            <img
              :src="feature.image"
              :alt="`${feature.title} UI`"
              class="w-full h-auto object-contain"
            >
          </div>

          <div
            v-if="feature.id === 'climate-extremes' && hasPrimaryImage(feature)"
            class="w-full mt-auto pt-8 lg:pt-10 w-[95%] mx-auto"
          >
            <img
              :src="feature.image"
              alt="Climate Extremes Summary UI"
              class="w-full h-auto object-contain mx-auto"
            >
          </div>

          <div
            v-if="feature.id === 'seasonal-intelligence' && hasSecondaryImage(feature)"
            class="w-full mt-auto pt-6 lg:pt-8 flex flex-col overflow-visible"
          >
            <div class="relative w-full pb-[85%] mx-auto max-w-[90%]">
              <img
                :src="feature.image"
                alt="Dry Season UI"
                class="absolute top-0 left-0 w-[80%] h-auto object-contain z-10 drop-shadow-xl transition-transform hover:z-30 hover:scale-105 duration-300"
              >
              <img
                :src="feature.secondaryImage"
                alt="Wet Season UI"
                class="absolute top-[45%] right-0 w-[80%] h-auto object-contain z-20 drop-shadow-xl transition-transform hover:z-30 hover:scale-105 duration-300"
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
