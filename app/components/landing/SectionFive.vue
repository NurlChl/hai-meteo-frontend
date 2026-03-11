<script setup lang="ts">
import type { LandingSectionFiveContent } from '~/data/landingDefaults'
import type { BlogPost, MediaAsset } from '~/types/models'

interface Props {
  content: LandingSectionFiveContent
}

const props = defineProps<Props>()

const { get } = useApi()
const config = useRuntimeConfig()

const newsItems = ref<LandingSectionFiveContent[]>([])
const currentIndex = ref(0)
const loading = ref(true)

const currentNews = computed(() => {
  if (newsItems.value.length > 0) {
    return newsItems.value[currentIndex.value] || props.content
  }
  return props.content
})

const dotsCount = computed(() => {
  return newsItems.value.length > 0 ? newsItems.value.length : 3
})

function formatDate(value: string | null): string {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

function resolveMediaUrl(fileUrl: string): string {
  if (!fileUrl) return ''
  try {
    const apiUrl = new URL(config.public.apiBase as string)
    const backendOrigin = apiUrl.origin
    if (fileUrl.startsWith('http://') || fileUrl.startsWith('https://')) {
      const parsed = new URL(fileUrl)
      return `${backendOrigin}${parsed.pathname}`
    }
    return `${backendOrigin}${fileUrl}`
  } catch {
    return fileUrl
  }
}

onMounted(async () => {
  try {
    loading.value = true
    const { results } = await get<{ results: BlogPost[] }>('/blog-posts', {
      query: {
        status: 'published',
        limit: 3,
        offset: 0,
      },
    })

    if (results && results.length > 0) {
      const formattedItems = await Promise.all(
        results.map(async (post) => {
          let imageUrl = ''
          let imageAlt = 'News Image'

          if (post.coverMediaId) {
            try {
              const media = await get<MediaAsset>(`/media-assets/${post.coverMediaId}`)
              if (media.fileUrl) {
                imageUrl = resolveMediaUrl(media.fileUrl)
              }
              imageAlt = media.altText || post.title
            } catch {
              // Ignore media fetch error
            }
          }

          return {
            title: post.title,
            description: post.excerpt || '',
            date: formatDate(post.publishedAt || post.createdAt),
            image: {
              url: imageUrl || props.content.image.url,
              alt: imageAlt,
            },
            link: `/blog/${post.id}`
          }
        })
      )

      newsItems.value = formattedItems
    }
  } catch (error) {
    console.error('Failed to fetch latest news for landing page:', error)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <section class="py-16 md:py-24 px-6 md:px-12 lg:px-[120px] bg-[#020515] text-white overflow-hidden">
    <div class="max-w-[1440px] mx-auto flex flex-col lg:flex-row items-center gap-10 md:gap-16">
      <div class="lg:w-1/2 w-full relative">
        <div class="relative aspect-square rounded-3xl overflow-hidden shadow-2xl border border-gray-800 group">
          <img
            :src="currentNews.image.url"
            :alt="currentNews.image.alt"
            class="w-full h-full object-cover transition-opacity duration-300"
          >
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        </div>

        <div class="absolute left-[-40px] top-1/2 -translate-y-1/2 flex flex-col gap-4">
          <button
            v-for="(_, index) in dotsCount"
            :key="index"
            class="w-3 h-3 rounded-full transition-colors duration-200"
            :class="index === currentIndex ? 'bg-blue-500' : 'bg-gray-700 hover:bg-gray-500'"
            @click="currentIndex = index"
            :aria-label="`Slide ${index + 1}`"
          />
        </div>
      </div>

      <div class="lg:w-1/2 text-center lg:text-left">
        <h2 class="text-blue-500 font-semibold mb-2 uppercase tracking-wider">
          Latest News
        </h2>
        <h3 class="text-3xl md:text-5xl font-bold mb-6 md:mb-8 leading-tight transition-all duration-300">
          {{ currentNews.title }}
        </h3>

        <p class="text-gray-400 mb-6 text-base md:text-lg leading-relaxed transition-all duration-300">
          {{ currentNews.description }}
        </p>

        <p class="text-gray-500 text-sm mb-8 md:mb-10 transition-all duration-300">
          {{ currentNews.date }}
        </p>

        <div class="relative group inline-flex z-10">
          <div class="absolute -inset-1.5 bg-gradient-to-r from-blue-600 to-sky-400 rounded-full blur-md opacity-20 group-hover:opacity-60 transition duration-1000 group-hover:duration-300" />

          <NuxtLink :to="currentNews.link || '/blog'" class="relative flex h-14 w-48 items-center justify-center overflow-hidden rounded-full p-[1.5px] focus:outline-none transition-transform duration-300 active:scale-95 group-hover:scale-105">
            <span class="absolute -inset-[1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_33%,#38bdf8_50%,transparent_66%,transparent_100%)] group-hover:bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_15%,#38bdf8_35%,#818cf8_50%,#38bdf8_65%,transparent_85%,transparent_100%)] opacity-80 group-hover:opacity-100 transition-all duration-500" />

            <span class="inline-flex h-full w-full items-center justify-between rounded-full bg-gradient-to-br from-[#0c1844] to-[#020515] pl-7 pr-2 py-3 text-sm font-semibold text-white/90 backdrop-blur-3xl transition-all duration-300 group-hover:from-[#102263] group-hover:to-[#061136] group-hover:shadow-[inset_0_0_20px_rgba(56,189,248,0.2)]">
              <span class="tracking-[0.2em] uppercase bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent">See More</span>

              <div class="relative flex items-center justify-center w-10 h-10 rounded-full bg-white/5 group-hover:bg-sky-400/20 transition-colors duration-300 border border-white/5 group-hover:border-sky-400/30">
                <div class="relative w-4 h-4 flex items-center justify-center overflow-hidden">
                  <svg class="absolute w-4 h-4 text-sky-400 -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" />
                  </svg>
                  <svg class="absolute w-4 h-4 text-sky-400 group-hover:translate-x-full transition-transform duration-300 ease-out" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </span>
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>
