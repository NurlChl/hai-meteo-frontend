<script setup lang="ts">
import type { BlogImage, BlogPost } from '~/data/blogDefaults'

interface Props {
  posts: BlogPost[]
}

defineOptions({ name: 'BlogDetailRelated' })

defineProps<Props>()
</script>

<template>
  <section v-if="posts.length > 0" class="py-16 md:py-20 lg:py-24 px-6 md:px-12 lg:px-[120px] bg-bg-primary">
    <div class="mx-auto max-w-[1440px]">
      <h2 class="text-2xl md:text-3xl lg:text-[36px] font-semibold text-white mb-10 lg:mb-14">
        See related articles
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        <NuxtLink
          v-for="post in posts"
          :key="post.id"
          :to="`/blog/${post.id}`"
          class="flex flex-col group cursor-pointer"
        >
          <div class="relative w-full aspect-[16/10] bg-white/5 rounded-2xl overflow-hidden mb-5">
            <img
              :src="post.image.url"
              :alt="post.image.alt"
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onerror="this.src='https://placehold.co/600x400/1e293b/white?text=Blog+Image'"
            >
          </div>

          <div class="flex items-center gap-3 text-sm text-text-secondary mb-2.5">
            <span class="font-medium text-white">{{ post.author }}</span>
            <span>{{ post.date }}</span>
          </div>

          <h3 class="text-lg md:text-xl font-medium text-white mb-2.5 group-hover:text-primary transition-colors leading-snug">
            {{ post.title }}
          </h3>

          <p class="text-text-secondary text-sm leading-relaxed line-clamp-2">
            {{ post.description }}
          </p>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
