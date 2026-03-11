<script setup lang="ts">
import type { BlogPost as ApiBlogPost, MediaAsset } from '~/types/models'
import type { BlogPost } from '~/data/blogDefaults'
import DetailContent from '~/components/blog/DetailContent.vue'
import DetailCta from '~/components/blog/DetailCta.vue'
import DetailHero from '~/components/blog/DetailHero.vue'
import DetailRelated from '~/components/blog/DetailRelated.vue'
import LandingLayout from '~/layouts/landing.vue'

interface BlogPostDetail extends ApiBlogPost {
  categoryIds?: number[]
  tagIds?: number[]
}

definePageMeta({
  layout: false,
})

const route = useRoute()
const { get } = useApi()
const { resolveMediaUrl } = useMediaUrl()

const blogPostId = computed(() => {
  const raw = route.params.id
  const id = Number(Array.isArray(raw) ? raw[0] : raw)
  return Number.isFinite(id) && id > 0 ? id : null
})

const post = ref<BlogPostDetail | null>(null)
const coverImageUrl = ref('')
const coverImageAlt = ref('Blog cover image')
const relatedPosts = ref<BlogPost[]>([])
const isLoading = ref(true)
const hasError = ref(false)

/**
 * Format an ISO date string to a readable format (e.g. "October 15, 2025").
 */
function formatDate(dateStr: string | null): string {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

/**
 * Resolve cover image from the media asset endpoint.
 */
async function loadCoverImage(mediaId: number | null): Promise<void> {
  if (!mediaId) return
  try {
    const media = await get<MediaAsset>(`/media-assets/${mediaId}`)
    if (media?.fileUrl) {
      coverImageUrl.value = resolveMediaUrl(media.fileUrl)
      coverImageAlt.value = media.altText || 'Blog cover image'
    }
  }
  catch {
    // Silently fail — use placeholder
  }
}

/**
 * Resolve a single cover image by media ID, returning a BlogImage or fallback.
 */
async function resolveCoverImage(mediaId: number | null): Promise<{ url: string, alt: string }> {
  if (!mediaId) return { url: '/images/blog/BackgroundSectionOne.png', alt: 'Blog image' }
  try {
    const media = await get<MediaAsset>(`/media-assets/${mediaId}`)
    if (media?.fileUrl) {
      return { url: resolveMediaUrl(media.fileUrl), alt: media.altText || 'Blog image' }
    }
  }
  catch {
    // fallback
  }
  return { url: '/images/blog/BackgroundSectionOne.png', alt: 'Blog image' }
}

/**
 * Load related blog posts (other published posts excluding the current one).
 */
async function loadRelatedPosts(): Promise<void> {
  try {
    const response = await get<{ results: ApiBlogPost[] }>('/blog-posts', {
      query: { status: 'published', limit: 10, offset: 0 },
    })

    const otherPosts = (response.results || [])
      .filter(p => p.id !== blogPostId.value)
      .slice(0, 3)

    const mapped = await Promise.all(otherPosts.map(async (p) => {
      const image = await resolveCoverImage(p.coverMediaId)
      return {
        id: p.id,
        title: p.title,
        description: p.excerpt || '',
        author: p.authorName || 'HAI Meteo',
        date: formatDate(p.publishedAt || p.createdAt),
        image,
      }
    }))

    relatedPosts.value = mapped
  }
  catch {
    relatedPosts.value = []
  }
}

/**
 * Load the blog post data from the backend.
 */
async function loadBlogPost(): Promise<void> {
  if (!blogPostId.value) {
    hasError.value = true
    isLoading.value = false
    return
  }

  try {
    const result = await get<BlogPostDetail>(`/blog-posts/${blogPostId.value}`)
    if (!result) {
      hasError.value = true
      isLoading.value = false
      return
    }

    post.value = result
    await Promise.all([
      loadCoverImage(result.coverMediaId),
      loadRelatedPosts(),
    ])
  }
  catch {
    hasError.value = true
  }
  finally {
    isLoading.value = false
  }
}

await loadBlogPost()

/**
 * SEO: Set page title and meta description from post data.
 */
useHead(computed(() => {
  if (!post.value) {
    return {
      title: 'Blog Post Not Found — HAI Meteo',
    }
  }
  return {
    title: `${post.value.title} — HAI Meteo Blog`,
    meta: [
      { name: 'description', content: post.value.excerpt || post.value.title },
      { property: 'og:title', content: post.value.title },
      { property: 'og:description', content: post.value.excerpt || '' },
      ...(coverImageUrl.value ? [{ property: 'og:image', content: coverImageUrl.value }] : []),
    ],
  }
}))
</script>

<template>
  <LandingLayout>
    <main>
      <!-- Loading state -->
      <div v-if="isLoading" class="min-h-screen bg-bg-primary flex items-center justify-center">
        <div class="flex flex-col items-center gap-4">
          <div class="w-8 h-8 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin" />
          <span class="text-text-secondary text-sm">Loading article…</span>
        </div>
      </div>

      <!-- Error state -->
      <div v-else-if="hasError || !post" class="min-h-screen bg-bg-primary flex items-center justify-center">
        <div class="text-center max-w-md mx-auto px-6">
          <div class="text-6xl mb-4 opacity-30">📰</div>
          <h1 class="text-2xl font-semibold text-white mb-3">Article Not Found</h1>
          <p class="text-text-secondary mb-6">
            The blog post you're looking for doesn't exist or has been removed.
          </p>
          <NuxtLink
            to="/blog"
            class="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-white transition-all"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Articles
          </NuxtLink>
        </div>
      </div>

      <!-- Blog detail content -->
      <template v-else>
        <DetailHero
          :title="post.title"
          :excerpt="post.excerpt || ''"
          :author-name="post.authorName || 'HAI Meteo'"
          :published-date="formatDate(post.publishedAt || post.createdAt)"
          :cover-image-url="coverImageUrl"
          :cover-image-alt="coverImageAlt"
        />

        <DetailContent :content-md="post.contentMd" />

        <DetailRelated :posts="relatedPosts" />

        <DetailCta />
      </template>
    </main>
  </LandingLayout>
</template>
