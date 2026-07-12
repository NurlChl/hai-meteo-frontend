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
            class="relative font-['Inter'] font-normal text-[13px] leading-[26px] flex items-center tracking-[-0.0001em] text-white/60 hover:text-white transition-colors rounded-full px-[14px] py-2"
            :class="{ 'bg-white/10 text-white ring-1 ring-white/15 shadow-[0_0_24px_rgba(56,189,248,0.12)]': isActive(item.href) }"
          >
            {{ item.name }}
          </NuxtLink>
        </nav>

        <div class="hidden lg:flex items-center">
          <div class="relative group">
            <div class="absolute -inset-1.5 bg-gradient-to-r from-blue-600 to-sky-400 rounded-full blur-md opacity-20 group-hover:opacity-60 transition duration-1000 group-hover:duration-300" />

            <NuxtLink
              to="/partnership#contact-form"
              class="relative flex h-12 w-40 items-center justify-center overflow-hidden rounded-full p-[1.5px] focus:outline-none transition-transform duration-300 active:scale-95 group-hover:scale-105"
            >
              <span class="absolute -inset-[1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_33%,#38bdf8_50%,transparent_66%,transparent_100%)] group-hover:bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_15%,#38bdf8_35%,#818cf8_50%,#38bdf8_65%,transparent_85%,transparent_100%)] opacity-80 group-hover:opacity-100 transition-all duration-500" />

              <span class="inline-flex h-full w-full items-center justify-between rounded-full bg-gradient-to-br from-[#0c1844] to-[#020515] pl-5 pr-2 py-2 text-sm font-semibold text-white/90 backdrop-blur-3xl transition-all duration-300 group-hover:from-[#102263] group-hover:to-[#061136] group-hover:shadow-[inset_0_0_20px_rgba(56,189,248,0.2)]">
                <span class="text-white text-sm font-semibold font-['Inter'] leading-5 truncate pr-2">Contact Us</span>

                <div class="relative flex items-center justify-center w-8 h-8 rounded-full bg-white/5 group-hover:bg-sky-400/20 transition-colors duration-300 border border-white/5 group-hover:border-sky-400/30 flex-shrink-0">
                  <div class="relative w-3.5 h-3.5 flex items-center justify-center overflow-hidden">
                    <svg class="absolute w-3.5 h-3.5 text-sky-400 -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" />
                    </svg>
                    <svg class="absolute w-3.5 h-3.5 text-sky-400 group-hover:translate-x-full transition-transform duration-300 ease-out" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </span>
            </NuxtLink>
          </div>
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

          <div class="relative group mt-2">
            <div class="absolute -inset-1.5 bg-gradient-to-r from-blue-600 to-sky-400 rounded-full blur-md opacity-20 group-hover:opacity-60 transition duration-1000 group-hover:duration-300" />

            <NuxtLink
              to="/partnership#contact-form"
              class="relative flex h-12 w-full items-center justify-center overflow-hidden rounded-full p-[1.5px] focus:outline-none transition-transform duration-300 active:scale-95 group-hover:scale-105"
              @click="closeMobileMenu"
            >
              <span class="absolute -inset-[1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_33%,#38bdf8_50%,transparent_66%,transparent_100%)] group-hover:bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_15%,#38bdf8_35%,#818cf8_50%,#38bdf8_65%,transparent_85%,transparent_100%)] opacity-80 group-hover:opacity-100 transition-all duration-500" />

              <span class="inline-flex h-full w-full items-center justify-between rounded-full bg-gradient-to-br from-[#0c1844] to-[#020515] px-5 py-2 text-sm font-semibold text-white/90 backdrop-blur-3xl transition-all duration-300 group-hover:from-[#102263] group-hover:to-[#061136] group-hover:shadow-[inset_0_0_20px_rgba(56,189,248,0.2)]">
                <span class="text-white text-sm font-semibold font-['Inter'] leading-5 truncate pr-2">Contact Us</span>

                <div class="relative flex items-center justify-center w-8 h-8 rounded-full bg-white/5 group-hover:bg-sky-400/20 transition-colors duration-300 border border-white/5 group-hover:border-sky-400/30 flex-shrink-0">
                  <div class="relative w-3.5 h-3.5 flex items-center justify-center overflow-hidden">
                    <svg class="absolute w-3.5 h-3.5 text-sky-400 -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" />
                    </svg>
                    <svg class="absolute w-3.5 h-3.5 text-sky-400 group-hover:translate-x-full transition-transform duration-300 ease-out" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </span>
            </NuxtLink>
          </div>
        </div>
      </nav>
    </div>
  </header>
</template>
