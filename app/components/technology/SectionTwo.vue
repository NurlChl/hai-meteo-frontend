<script setup lang="ts">
import type { TechnologySectionContent } from '~/data/technologyDefaults'

const props = defineProps<{
  content: TechnologySectionContent
}>()

const activeTab = ref(0)

function getIconPath(type: string) {
  switch (type) {
    case 'ai': return 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m-5 8h2m-2-4h2'
    case 'fusion': return 'M12 2L2 7l10 5 10-5-10-5zm0 9l2-1 5 2.5M12 11l-2-1-5 2.5m7 9.5L2 17l10 5 10-5-10 5z'
    case 'weather': return 'M12 3v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M3 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32l1.41-1.41M12 8a4 4 0 100 8 4 4 0 000-8z'
    case 'intelligence': return 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6'
    default: return ''
  }
}
</script>

<template>
  <section class="py-16 md:py-24 lg:py-[204px] px-6 md:px-12 lg:px-[120px] bg-bg-primary relative overflow-hidden flex justify-center items-start">
    <div class="w-full max-w-[1440px] flex flex-col gap-12 md:gap-16 lg:gap-[72px] relative z-10">
      <div class="flex flex-col items-center gap-8 md:gap-12 lg:gap-[56px] p-0">
        <div class="flex flex-col items-center gap-4 lg:gap-[16px] w-full max-w-[828px]">
          <h2 class="font-medium text-3xl md:text-4xl lg:text-[40px] leading-tight lg:leading-[48px] tracking-[-0.3px] text-white/90 text-center">
            {{ props.content.title }}
          </h2>
          <p class="font-normal text-base md:text-[16px] leading-relaxed lg:leading-[24px] text-[#D2D6DB] text-center px-4 md:px-0">
            {{ props.content.description }}
          </p>
        </div>
      </div>

      <div
        class="box-border flex flex-col lg:flex-row justify-between items-center px-6 py-8 md:px-10 md:py-10 lg:px-[40px] lg:py-[24px] gap-8 lg:gap-[107px] bg-white/5 border border-[#055ABA] shadow-[0px_0px_100px_24px_rgba(5,90,186,0.32)] rounded-[24px] flex-none order-0 self-stretch grow-0"
      >
        <div class="space-y-4 md:space-y-6 z-10 w-full lg:w-[450px] text-center lg:text-left">
          <h3 class="text-2xl md:text-3xl lg:text-4xl font-semibold text-white leading-tight">
            {{ props.content.items?.[activeTab]?.title }}
          </h3>
          <p class="text-text-secondary text-base md:text-lg leading-relaxed max-w-md mx-auto lg:mx-0">
            {{ props.content.items?.[activeTab]?.description }}
          </p>
        </div>

        <img :src="props.content.image.url" :alt="props.content.image.alt" class="flex-none order-1 grow-0 w-full max-w-[300px] md:max-w-[400px] lg:w-[450px] h-auto">
      </div>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-5xl mx-auto w-full">
        <button
          v-for="(item, index) in props.content.items"
          :key="index"
          class="group flex flex-col items-center text-center space-y-3 md:space-y-4 transition-all duration-300 outline-none p-2"
          @click="activeTab = index"
        >
          <div
            class="w-12 h-12 md:w-16 md:h-16 rounded-xl flex items-center justify-center transition-all duration-300 border"
            :class="[
              activeTab === index
                ? 'bg-blue-600/20 border-blue-500 text-blue-400 shadow-[0_0_20px_rgba(37,99,235,0.3)]'
                : 'bg-white/5 border-white/10 text-white/50 group-hover:border-white/30 group-hover:text-white',
            ]"
          >
            <svg class="w-6 h-6 md:w-8 md:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" :d="getIconPath(item.icon)" />
            </svg>
          </div>

          <div class="relative pb-2 w-full">
            <span
              class="text-xs md:text-sm font-semibold whitespace-pre-line leading-tight block transition-colors duration-300"
              :class="activeTab === index ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'"
            >
              {{ item.title }}
            </span>

            <div
              class="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-blue-500 transition-all duration-300"
              :class="activeTab === index ? 'w-8 md:w-12 opacity-100 shadow-[0_0_10px_#3b82f6]' : 'w-0 opacity-0'"
            />
          </div>
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.perspective-1000 {
  perspective: 1000px;
}
</style>
