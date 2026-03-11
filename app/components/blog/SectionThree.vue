<script setup lang="ts">
import type { BlogPost, BlogSectionThreeContent } from '~/data/blogDefaults'
import { computed, ref, watch } from 'vue'

interface Props {
  content: BlogSectionThreeContent
  posts: BlogPost[]
}

defineOptions({ name: 'BlogSectionThree' })

const props = defineProps<Props>()

const activeCategory = ref(props.content.categories[0] || 'All')
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = 6

const filteredPosts = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  const activeCategoryValue = activeCategory.value.toLowerCase()
  return props.posts.filter((post) => {
    const postCategory = post.category?.toLowerCase()
    const matchesCategory = activeCategoryValue === 'all'
      || (postCategory && postCategory === activeCategoryValue)
    const matchesSearch = !query
      || post.title.toLowerCase().includes(query)
      || post.description.toLowerCase().includes(query)
      || post.author.toLowerCase().includes(query)
    return matchesCategory && matchesSearch
  })
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredPosts.value.length / pageSize)))

const visiblePosts = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredPosts.value.slice(start, start + pageSize)
})

const pageNumbers = computed(() => Array.from({ length: totalPages.value }, (_, index) => index + 1))

watch([activeCategory, searchQuery, () => props.posts], () => {
  currentPage.value = 1
})

watch(() => props.content.categories, (categories) => {
  if (!categories.includes(activeCategory.value)) {
    activeCategory.value = categories[0] || 'All'
  }
})

watch(totalPages, (value) => {
  if (currentPage.value > value) {
    currentPage.value = value
  }
})
</script>

<template>
  <section class="py-12 md:py-16 lg:py-20 px-6 md:px-12 lg:px-[120px] bg-bg-primary min-h-screen">
    <div class="mx-auto max-w-[1440px]">
      <!-- Filters and Search -->
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 md:mb-12">
        <!-- Categories -->
        <div class="flex items-center gap-4 md:gap-8 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
          <button
            v-for="category in content.categories"
            :key="category"
            class="text-sm font-medium whitespace-nowrap transition-colors"
            :class="activeCategory === category ? 'text-white' : 'text-text-secondary hover:text-white'"
            @click="activeCategory = category"
          >
            {{ category }}
          </button>
        </div>

        <!-- Search -->
        <div class="relative w-full lg:w-[320px]">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search...."
            class="w-full h-[44px] bg-[#0F1629] border border-white/5 rounded-lg px-4 pl-10 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/10 transition-all font-light tracking-wide"
          >
          <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <!-- Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-16">
        <NuxtLink v-for="post in visiblePosts" :key="post.id" :to="`/blog/${post.id}`" class="flex flex-col group cursor-pointer">
          <div class="relative w-full aspect-[16/10] bg-white/5 rounded-2xl overflow-hidden mb-6">
            <div class="absolute inset-0 bg-gradient-to-br from-blue-900/10 to-purple-900/10" />
            <img :src="post.image.url" :alt="post.image.alt" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" onerror="this.src='https://placehold.co/600x400/1e293b/white?text=Blog+Image'">
          </div>

          <div class="flex items-center gap-4 text-sm text-text-secondary mb-3">
            <span class="font-medium text-white">{{ post.author }}</span>
            <span>{{ post.date }}</span>
          </div>

          <h3 class="text-lg md:text-[20px] md:leading-[28px] font-medium text-white mb-3 group-hover:text-primary transition-colors">
            {{ post.title }}
          </h3>

          <p class="text-text-secondary text-sm leading-relaxed line-clamp-3">
            {{ post.description }}
          </p>
        </NuxtLink>

        <div v-if="visiblePosts.length === 0" class="col-span-full rounded-2xl border border-white/10 p-8 text-center text-text-secondary">
          No blog posts found.
        </div>
      </div>

      <!-- Pagination -->
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-t border-white/10 pt-6 md:pt-8">
        <div class="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0">
          <button class="px-4 py-2 rounded-lg border border-white/10 text-sm text-white hover:bg-white/5 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed" :disabled="currentPage === 1" @click="currentPage = Math.max(1, currentPage - 1)">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Prev
          </button>

          <div class="flex items-center gap-1 shrink-0">
            <button
              v-for="page in pageNumbers"
              :key="page"
              class="w-9 h-9 flex items-center justify-center rounded-lg border text-sm transition-colors"
              :class="page === currentPage ? 'border-white/10 bg-primary text-white' : 'border-transparent text-text-secondary hover:text-white'"
              @click="currentPage = page"
            >
              {{ page }}
            </button>
          </div>

          <button class="px-4 py-2 rounded-lg border border-white/10 text-sm text-white hover:bg-white/5 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed" :disabled="currentPage >= totalPages" @click="currentPage = Math.min(totalPages, currentPage + 1)">
            Next
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div class="relative self-start lg:self-auto">
          <button class="px-4 py-2 rounded-lg border border-white/10 text-sm text-white hover:bg-white/5 transition-colors flex items-center gap-2">
            {{ pageSize }} per page
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
