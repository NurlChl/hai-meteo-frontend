<script setup lang="ts">
import type { BlogSectionTwoContent } from '~/data/blogDefaults'

interface Props {
  content: BlogSectionTwoContent
}

defineOptions({ name: 'BlogSectionTwo' })

const props = defineProps<Props>()
</script>

<template>
  <section class="py-16 md:py-24 lg:py-[120px] px-6 md:px-12 lg:px-[120px] bg-bg-primary">
    <div class="mx-auto max-w-[1440px]">
      <h2 class="text-3xl md:text-4xl lg:text-[40px] leading-tight lg:leading-[48px] font-medium tracking-[-0.3px] text-white/90 flex items-center mb-8 md:mb-12">
        {{ content.title }}
      </h2>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <NuxtLink v-for="post in content.featuredPosts" :key="post.id" :to="`/blog/${post.id}`" class="flex flex-col group cursor-pointer">
          <div class="relative w-full aspect-[16/9] bg-white/5 rounded-2xl overflow-hidden mb-6">
            <div class="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20" />
            <img :src="post.image.url" :alt="post.image.alt" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" onerror="this.src='https://placehold.co/800x450/1e293b/white?text=Featured+Image'">
          </div>

          <div class="flex items-center gap-4 text-sm text-text-secondary mb-3">
            <span class="font-medium text-white">{{ post.author }}</span>
            <span>{{ post.date }}</span>
          </div>

          <h3 class="text-xl md:text-2xl md:leading-[32px] font-medium text-white mb-4 group-hover:text-primary transition-colors">
            {{ post.title }}
          </h3>

          <p class="text-text-secondary leading-relaxed line-clamp-3">
            {{ post.description }}
          </p>
        </NuxtLink>
      </div>

      <div class="w-full h-px bg-white/10 mt-16 md:mt-24 lg:mt-32" />
    </div>
  </section>
</template>
