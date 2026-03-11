<script setup lang="ts">
import type { LandingSectionSevenContent } from '~/data/landingDefaults'

interface Props {
  content: LandingSectionSevenContent
}

const props = defineProps<Props>()
const router = useRouter()
const email = ref('')

function handleRequestDemo() {
  if (!email.value.trim()) {
    return
  }
  router.push(`/partnership?email=${encodeURIComponent(email.value.trim())}#contact-form`)
}
</script>

<template>
  <section class="relative w-full py-20 lg:py-32 px-6 md:px-12 lg:px-[120px] bg-bg-primary overflow-hidden">
    <!-- Background Image -->
    <div class="absolute top-0 right-0 h-full w-full pointer-events-none z-0">
      <img
        v-if="content.backgroundImage"
        :src="content.backgroundImage.url"
        :alt="content.backgroundImage.alt"
        class="absolute top-0 right-0 h-full object-cover opacity-50 lg:opacity-100"
      >
      <img src="/images/landing/line.png" alt="Decorative line" class="absolute bottom-0 right-0 max-w-[50%] lg:max-w-full object-contain">
    </div>

    <div class="max-w-[1440px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-10 relative">
      <!-- Left Column: Content -->
      <div class="relative flex flex-col justify-start items-start gap-7 max-w-xl z-10">
        <h2 class="self-stretch text-white text-4xl md:text-5xl lg:text-6xl font-medium font-['Inter'] leading-tight lg:leading-[68px] whitespace-pre-line">
          {{ content.title }}
        </h2>
        <p class="self-stretch text-gray-300 text-lg md:text-xl font-normal font-['Inter'] leading-8">
          {{ content.description }}
        </p>

        <div class="w-full max-w-md flex flex-col justify-center items-start gap-2.5 mt-4">
          <div class="self-stretch px-1 py-1 relative rounded-lg outline outline-1 outline-offset-[-1px] outline-white/10 inline-flex justify-between items-center backdrop-blur-sm">
            <input
              v-model="email"
              type="email"
              placeholder="Your email"
              class="bg-transparent border-none outline-none text-white text-base font-normal font-['Inter'] leading-6 placeholder:text-white/50 w-full px-4"
              @keyup.enter="handleRequestDemo"
            >

            <button
              class="relative flex h-11 items-center justify-center overflow-hidden rounded-md p-[1.5px] focus:outline-none transition-transform duration-300 active:scale-95 group shrink-0"
              @click="handleRequestDemo"
            >
              <span class="absolute -inset-[1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_33%,#38bdf8_50%,transparent_66%,transparent_100%)] group-hover:bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_15%,#38bdf8_35%,#818cf8_50%,#38bdf8_65%,transparent_85%,transparent_100%)] opacity-80 group-hover:opacity-100 transition-all duration-500" />

              <span class="inline-flex h-full w-full items-center justify-between rounded-md bg-gradient-to-br from-[#0c1844] to-[#020515] pl-5 pr-1.5 py-1 sm:py-2 text-sm font-semibold text-white/90 backdrop-blur-3xl transition-all duration-300 group-hover:from-[#102263] group-hover:to-[#061136] group-hover:shadow-[inset_0_0_20px_rgba(56,189,248,0.2)]">
                <span class="text-white text-sm font-semibold font-['Inter'] leading-5 pr-3">Request Demo</span>

                <div class="relative flex items-center justify-center w-8 h-8 rounded bg-white/5 group-hover:bg-sky-400/20 transition-colors duration-300 border border-white/5 group-hover:border-sky-400/30 flex-shrink-0">
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
            </button>
          </div>
        </div>
      </div>

      <!-- Right Column: Video -->
      <div class="relative w-full max-w-[600px] lg:max-w-[530px] flex justify-center lg:justify-end">
        <!-- Video Content -->
        <div class="relative w-full aspect-square md:aspect-video lg:aspect-square flex items-center justify-center">
          <video
            autoplay
            loop
            muted
            playsinline
            class="w-full h-full object-contain mix-blend-screen"
          >
            <source src="/video/strom.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
    </div>
  </section>
</template>
