<script setup lang="ts">
import type { FeaturesSectionTwoContent } from '~/data/featuresDefaults'
import { ref } from 'vue'

interface Props {
  content: FeaturesSectionTwoContent
}

const props = defineProps<Props>()

const activeId = ref(props.content.items[0]?.id || '')

function getIconPath(type: string) {
  switch (type) {
    case 'target': return 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9h10v2H7z M12 8v8l4-4'
    case 'cloud-sun': return 'M17 19a5 5 0 001.07-9.88c-.68-2.6-3.05-4.12-5.57-4.12-2.13 0-4.06 1.05-5.07 2.76C4.09 7.82 2 10.13 2 13c0 3.31 2.69 6 6 6h9zm-5-3c0-1.66 1.34-3 3-3s3 1.34 3 3-1.34 3-3 3-3-1.34-3-3z m-3.5-3.5l1.5 1.5M6 6l1.5 1.5'
    case 'brain': return 'M12 2a9 9 0 019 9c0 3.96-2.52 7.35-6.07 8.55-.38.13-.67.43-.67.83v.62c0 .55-.45 1-1 1h-2.52c-.55 0-1-.45-1-1v-.62c0-.4-.29-.7-.67-.83A9.006 9.006 0 013 11a9 9 0 019-9zm0 2a7 7 0 00-7 7c0 2.21 1.03 4.18 2.66 5.5l.84.68V20h5v-2.82l.84-.68A7.003 7.003 0 0019 11a7 7 0 00-7-7z'
    case 'history': return 'M13 3a9 9 0 00-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0113 21a9 9 0 010-18zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z'
    default: return ''
  }
}
</script>

<template>
  <section class="py-16 md:py-24 lg:py-[140px] px-6 md:px-12 lg:px-[120px] bg-bg-primary text-white">
    <div class="mx-auto max-w-[1440px]">
      <h2 class="text-3xl md:text-4xl lg:text-[40px] leading-tight lg:leading-[48px] font-medium mb-10 md:mb-12 lg:mb-16 text-center lg:text-left">
        {{ content.title }}
      </h2>

      <div class="flex flex-col lg:flex-row gap-10 md:gap-12 lg:gap-16">
        <!-- Accordion/List -->
        <div class="w-full lg:w-5/12 flex flex-col gap-6">
          <div
            v-for="item in content.items"
            :key="item.id"
            class="cursor-pointer border-b border-white/10 pb-6 last:border-0"
            @click="activeId = item.id"
          >
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-4">
                <div class="w-6 h-6 rounded flex items-center justify-center text-text-secondary">
                  <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path :d="getIconPath(item.icon)" />
                  </svg>
                </div>
                <h3 class="text-lg md:text-xl font-medium transition-colors" :class="[activeId === item.id ? 'text-white' : 'text-text-secondary']">
                  {{ item.title }}
                </h3>
              </div>
              <div class="transform transition-transform duration-300" :class="[activeId === item.id ? 'rotate-180' : '']">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </div>
            </div>

            <div
              v-show="activeId === item.id"
              class="text-text-secondary text-sm md:text-base leading-relaxed pl-10"
            >
              {{ item.description }}
            </div>
          </div>
        </div>

        <div class="w-full lg:w-7/12">
          <div class="relative w-full aspect-[678/441] bg-bg-secondary rounded-2xl border border-white/5 overflow-hidden">
            <template v-for="item in content.items" :key="'img-' + item.id">
              <transition
                enter-active-class="transition-opacity duration-500"
                enter-from-class="opacity-0"
                enter-to-class="opacity-100"
                leave-active-class="transition-opacity duration-500"
                leave-from-class="opacity-100"
                leave-to-class="opacity-0"
              >
                <img
                  v-if="activeId === item.id && item.image"
                  :src="item.image"
                  :alt="item.title"
                  class="absolute inset-0 w-full h-full object-cover"
                />
              </transition>
            </template>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
