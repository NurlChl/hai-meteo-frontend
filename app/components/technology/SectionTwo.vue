<script setup lang="ts">
import type { TechnologySectionContent } from '~/data/technologyDefaults'

const props = defineProps<{
  content: TechnologySectionContent
}>()

const activeTab = ref(0)
const activeItem = computed(() => props.content.items?.[activeTab.value])

function isAssetUrl(value: string) {
  return value.startsWith('/') || value.startsWith('http://') || value.startsWith('https://')
}
</script>

<template>
  <section
    class="py-16 md:py-24 lg:py-[204px] px-6 md:px-12 lg:px-[120px] bg-bg-primary relative overflow-hidden flex justify-center items-start"
  >
    <div class="w-full max-w-[1440px] flex flex-col gap-12 md:gap-16 lg:gap-[72px] relative z-10">
      <div class="flex flex-col items-center gap-8 md:gap-12 lg:gap-[56px] p-0">
        <div class="flex flex-col items-center gap-4 lg:gap-[16px] w-full max-w-[828px]">
          <h2
            class="font-medium text-3xl md:text-4xl lg:text-[40px] leading-tight lg:leading-[48px] tracking-[-0.3px] text-white/90 text-center"
          >
            {{ props.content.title }}
          </h2>
          <p
            class="font-normal text-base md:text-[16px] leading-relaxed lg:leading-[24px] text-[#D2D6DB] text-center px-4 md:px-0"
          >
            {{ props.content.description }}
          </p>
        </div>
      </div>

      <div
        class="box-border flex flex-col lg:flex-row justify-between items-center px-6 py-8 md:px-10 md:py-10 lg:px-[40px] lg:py-[24px] gap-8 lg:gap-[107px] bg-white/5 border border-[#055ABA] shadow-[0px_0px_100px_24px_rgba(5,90,186,0.32)] rounded-[24px] flex-none order-0 self-stretch grow-0"
      >
        <div class="space-y-4 md:space-y-6 z-10 w-full lg:w-[450px] text-center lg:text-left">
          <h3 class="text-2xl md:text-3xl lg:text-4xl font-semibold text-white leading-tight">
            {{ activeItem?.title }}
          </h3>
          <p
            class="text-text-secondary text-base md:text-lg leading-relaxed max-w-md mx-auto lg:mx-0"
          >
            {{ activeItem?.description }}
          </p>
        </div>

        <img
          v-if="activeItem?.image?.url"
          :src="activeItem.image.url"
          :alt="activeItem.image.alt || activeItem.title"
          class="flex-none order-1 grow-0 w-full max-w-[300px] md:max-w-[400px] lg:w-[450px] h-auto"
        >
      </div>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-5xl mx-auto w-full">
        <button
          v-for="(item, index) in props.content.items"
          :key="index"
          class="group flex flex-col items-center text-center space-y-3 md:space-y-4 transition-all duration-300 outline-none p-2"
          @click="activeTab = index"
        >
          <img
            v-if="isAssetUrl(item.icon)"
            :src="item.icon"
            :alt="item.title"
            class="w-12 h-12 object-contain"
          >

          <div class="relative pb-2 w-full">
            <span
              class="text-xs md:text-sm font-semibold whitespace-pre-line leading-tight block transition-colors duration-300"
              :class="
                activeTab === index ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'
              "
            >
              {{ item.title }}
            </span>

            <div
              class="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-blue-500 transition-all duration-300"
              :class="
                activeTab === index
                  ? 'w-8 md:w-12 opacity-100 shadow-[0_0_10px_#3b82f6]'
                  : 'w-0 opacity-0'
              "
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
