<script setup lang="ts">
import type { PartnershipSectionTwoContent } from '~/data/partnershipDefaults'

defineOptions({ name: 'PartnershipSectionTwo' })

defineProps<{
  content: PartnershipSectionTwoContent
}>()
</script>

<template>
  <section class="py-16 md:py-24 lg:py-[140px] px-6 md:px-12 lg:px-[120px] bg-bg-primary relative">
    <div class="mx-auto max-w-[1440px]">
      <div class="text-center max-w-3xl mx-auto mb-10 md:mb-12 lg:mb-16">
        <h2 class="text-3xl md:text-4xl lg:text-[40px] leading-tight lg:leading-[48px] font-medium text-white mb-4 md:mb-6 whitespace-pre-line">
          {{ content.title }}
        </h2>
        <p class="text-text-secondary text-base md:text-lg">
          {{ content.description }}
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        <div
          v-for="(benefit, index) in content.items"
          :key="index"
          class="p-6 md:p-8 rounded-2xl border border-white/10 bg-white/5 hover:border-blue-500/50 transition-all duration-300 group"
        >
          <div class="w-12 h-12 mb-6 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 group-hover:text-blue-300 transition-colors">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" :d="benefit.icon" />
            </svg>
          </div>

          <h3 class="text-lg md:text-xl font-semibold text-white mb-4 whitespace-pre-line">
            {{ benefit.title }}
          </h3>

          <p class="text-text-secondary text-sm md:text-base leading-relaxed">
            {{ benefit.description }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
