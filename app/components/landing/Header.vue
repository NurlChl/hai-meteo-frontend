<script setup lang="ts">
import { defaultLandingHeaderNavigation } from '~/data/landingNavigationDefaults'

const route = useRoute()
const isMobileMenuOpen = ref(false)

const isActive = (path: string) => route.path === path || (path !== '/' && route.path.startsWith(path))

function closeMobileMenu() {
  isMobileMenuOpen.value = false
}
</script>

<template>
  <header class="w-full bg-bg-primary px-6 md:px-12 lg:px-[120px]">
    <div class="w-full max-w-[1440px] mx-auto xl:py-6 py-4">
      <div class="flex flex-row justify-between items-center gap-6 md:gap-8">
        <div class="flex-shrink-0 flex items-center">
          <NuxtLink to="/" class="block" @click="closeMobileMenu">
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

        <div class="hidden lg:flex items-center">
          <BaseButton variant="secondary" to="/partnership#contact-form">
            Contact Us
          </BaseButton>
        </div>

        <button
          type="button"
          class="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white hover:border-white/30 hover:bg-white/5 transition-colors"
          aria-controls="mobile-header-menu"
          :aria-expanded="isMobileMenuOpen"
          :aria-label="isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'"
          @click="isMobileMenuOpen = !isMobileMenuOpen"
        >
          <span class="sr-only">Toggle navigation menu</span>
          <span class="flex flex-col gap-1.5">
            <span
              class="block h-0.5 w-5 rounded-full bg-current transition-transform"
              :class="{ 'translate-y-2 rotate-45': isMobileMenuOpen }"
            />
            <span
              class="block h-0.5 w-5 rounded-full bg-current transition-opacity"
              :class="{ 'opacity-0': isMobileMenuOpen }"
            />
            <span
              class="block h-0.5 w-5 rounded-full bg-current transition-transform"
              :class="{ '-translate-y-2 -rotate-45': isMobileMenuOpen }"
            />
          </span>
        </button>
      </div>

      <nav
        id="mobile-header-menu"
        class="lg:hidden overflow-hidden transition-[max-height,opacity] duration-200 ease-out"
        :class="isMobileMenuOpen ? 'max-h-[420px] opacity-100' : 'max-h-0 opacity-0'"
      >
        <div class="mt-4 flex flex-col gap-1 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
          <NuxtLink
            v-for="item in defaultLandingHeaderNavigation"
            :key="item.name"
            :to="item.href"
            class="font-['Inter'] text-sm leading-6 text-white/70 hover:text-white transition-colors rounded-xl px-4 py-3"
            :class="{ 'bg-white/10 text-white': isActive(item.href) }"
            @click="closeMobileMenu"
          >
            {{ item.name }}
          </NuxtLink>

          <BaseButton
            class="mt-2 w-full justify-center"
            variant="secondary"
            to="/partnership#contact-form"
            @click="closeMobileMenu"
          >
            Contact Us
          </BaseButton>
        </div>
      </nav>
    </div>
  </header>
</template>
