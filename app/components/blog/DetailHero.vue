<script setup lang="ts">
interface Props {
  title: string
  excerpt: string
  authorName: string
  publishedDate: string
  coverImageUrl: string
  coverImageAlt: string
}

defineOptions({ name: 'BlogDetailHero' })

defineProps<Props>()
</script>

<template>
  <section class="relative bg-bg-primary overflow-hidden">
    <!-- Background image (partnership-style, top-right corner) -->
    <div class="absolute top-0 right-0 h-full pointer-events-none z-0">
      <img
        src="/images/partnership/BackgroundSectionOne.png"
        alt="Background pattern"
        class="h-full object-cover opacity-50 lg:opacity-100"
      >
    </div>

    <div class="relative z-10 mx-auto max-w-[1440px] px-6 md:px-12 lg:px-[120px] py-16 md:py-20 lg:py-[100px]">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <!-- Left: Text content -->
        <div class="flex flex-col gap-6">
          <h1 class="text-3xl md:text-4xl lg:text-[44px] lg:leading-[54px] font-bold text-white tracking-[-0.5px]">
            {{ title }}
          </h1>

          <p class="text-base md:text-lg leading-relaxed text-text-secondary max-w-[540px]">
            {{ excerpt }}
          </p>

          <div class="flex items-center gap-3 text-sm text-text-secondary mt-2">
            <span class="text-blue-400 font-medium">{{ authorName }}</span>
            <span class="text-white/20">•</span>
            <span>{{ publishedDate }}</span>
          </div>
        </div>

        <!-- Right: Cover image -->
        <div class="relative flex justify-center lg:justify-end">
          <div class="relative w-full max-w-[520px] aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl shadow-black/30 ring-1 ring-white/5">
            <img
              v-if="coverImageUrl"
              :src="coverImageUrl"
              :alt="coverImageAlt"
              class="w-full h-full object-cover"
              onerror="this.src='https://placehold.co/800x600/1e293b/white?text=Cover+Image'"
            >
            <div v-else class="w-full h-full bg-white/5 flex items-center justify-center text-white/20 text-sm">
              No cover image
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
