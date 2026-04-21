<script setup lang="ts">
import { defaultLandingHeaderNavigation } from '~/data/landingNavigationDefaults'

const route = useRoute()

const isActive = (path: string) => route.path === path || (path !== '/' && route.path.startsWith(path))
</script>

<template>
  <header class="w-full bg-bg-primary px-6 md:px-12 lg:px-[120px]">
    <div class="flex flex-row justify-between items-center w-full max-w-[1440px] mx-auto xl:py-6 py-4 gap-6 md:gap-8">
      <div class="flex-shrink-0 flex items-center">
        <NuxtLink to="/" class="block">
          <img src="/logo.svg" alt="Hai Meteo Logo" class="h-10 w-10">
        </NuxtLink>
      </div>

      <nav class="hidden lg:flex items-center gap-6 xl:gap-8">
        <NuxtLink
          v-for="item in defaultLandingHeaderNavigation"
          :key="item.name"
          :to="item.href"
          class="relative font-['Inter'] font-normal text-[13px] leading-[26px] flex items-center tracking-[-0.0001em] text-white/60 hover:text-white transition-colors p-[14px]"
          :class="{ 'text-white': isActive(item.href) }"
        >
          {{ item.name }}
        </NuxtLink>
      </nav>

      <div class="flex items-center">
        <BaseButton variant="secondary" to="/partnership#contact-form">
          Contact Us
        </BaseButton>
      </div>
    </div>
  </header>
</template>
