<script setup lang="ts">
import type { FeaturesSectionOneContent } from '~/data/featuresDefaults'

interface Props {
  content: FeaturesSectionOneContent
}

defineOptions({ name: 'FeaturesSectionOne' })

defineProps<Props>()
</script>

<template>
  <section
    class="relative py-12 md:py-20 lg:py-[90px] px-6 md:px-12 lg:px-[120px] overflow-hidden bg-bg-primary"
  >
    <div>
      <img
        v-if="content.backgroundImage"
        :src="content.backgroundImage.url"
        :alt="content.backgroundImage.alt"
        class="absolute top-0 right-0 h-full object-cover pointer-events-none z-0 opacity-50 lg:opacity-100"
      >
    </div>

    <div class="max-w-[1440px] w-full mx-auto relative z-10">
      <div
        class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 lg:gap-0 lg:py-16 relative pointer-events-none"
      >
        <div
          class="w-full lg:w-[60%] text-center lg:text-left relative z-20 pointer-events-auto py-8 lg:py-0"
        >
          <h1
            class="font-sans font-medium text-4xl md:text-5xl lg:text-[56px] leading-tight lg:leading-[68px] tracking-[-0.6px] text-white mb-6 lg:mb-8 whitespace-pre-line drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]"
          >
            {{ content.title }}
          </h1>

          <p
            class="w-full max-w-[668px] mx-auto lg:mx-0 font-sans font-normal text-base md:text-lg leading-relaxed lg:leading-[28px] text-[#D2D6DB] drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]"
          >
            {{ content.description }}
          </p>
        </div>

        <div class="hidden lg:block absolute right-[-150px] top-1 w-[1150px] z-0 opacity-40">
          <div
            class="relative z-10 w-full rounded-2xl overflow-hidden ring-1 ring-white/10"
            style="
              transform: perspective(1200px) rotateY(-20deg) rotateX(5deg) rotateZ(2deg);
              box-shadow:
                -20px 20px 60px rgba(0, 0, 0, 0.8),
                inset 0 0 20px rgba(255, 255, 255, 0.05);
            "
          >
            <video
              v-if="content.video"
              autoplay
              loop
              muted
              playsinline
              class="w-full h-auto object-cover"
            >
              <source :src="content.video" type="video/mp4">
            </video>
          </div>
        </div>

        <div class="block lg:hidden w-full flex justify-center mt-2 relative z-10 opacity-50">
          <div
            class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] max-w-[500px] bg-blue-600/30 blur-[80px] rounded-full pointer-events-none z-0"
          />

          <div
            class="relative z-10 w-full max-w-[500px] rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.8)] ring-1 ring-white/10"
            style="transform: perspective(1000px) rotateY(-15deg) rotateX(5deg) rotateZ(2deg)"
          >
            <video
              v-if="content.video"
              autoplay
              loop
              muted
              playsinline
              class="w-full h-auto object-cover"
            >
              <source :src="content.video" type="video/mp4">
            </video>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
