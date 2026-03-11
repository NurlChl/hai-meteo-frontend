<script setup lang="ts">
import type {
  BlogImage,
  BlogPost,
  BlogSectionOneContent,
  BlogSectionsData,
  BlogSectionThreeContent,
  BlogSectionTwoContent,
} from '~/data/blogDefaults'
import type { BlogCategory as ApiBlogCategory, BlogPost as ApiBlogPost } from '~/types/models'
import SectionOne from '~/components/blog/SectionOne.vue'
import SectionThree from '~/components/blog/SectionThree.vue'
import SectionTwo from '~/components/blog/SectionTwo.vue'
import { blogDefaults, blogSectionKeys } from '~/data/blogDefaults'
import LandingLayout from '~/layouts/landing.vue'

interface PageRecord {
  id: number
}

interface SectionRecord {
  sectionKey: string
  content: Record<string, unknown>
}

interface MediaAsset {
  id: number
  fileUrl: string
  altText?: string
}

interface MediaRef {
  __mediaId: number
}

interface ApiBlogPostDetail extends ApiBlogPost {
  categoryIds?: number[]
}

const { get } = useApi()
const config = useRuntimeConfig()
const coverImageCache = new Map<number, Promise<BlogImage | null>>()

const sections = ref<BlogSectionsData>(cloneDefaults())
const blogPosts = ref<BlogPost[]>([])
const backendCategories = ref<string[]>([])
const sectionTwoContent = computed<BlogSectionTwoContent>(() => ({
  ...sections.value.sectionTwo,
  featuredPosts: blogPosts.value.length > 0
    ? blogPosts.value.slice(0, 2)
    : sections.value.sectionTwo.featuredPosts,
}))
const sectionThreeContent = computed<BlogSectionThreeContent>(() => {
  const categories = ['All', ...new Set(backendCategories.value)]

  return {
    ...sections.value.sectionThree,
    categories,
  }
})

definePageMeta({
  layout: false,
})

await Promise.all([
  loadBlogContent(),
  loadBlogPosts(),
])

function cloneDefaults(): BlogSectionsData {
  return JSON.parse(JSON.stringify(blogDefaults))
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isMediaRef(value: unknown): value is MediaRef {
  return isRecord(value) && typeof value.__mediaId === 'number'
}

function toText(value: unknown, fallback: string): string {
  if (typeof value === 'string' && value.trim()) {
    return value.replace(/\\n/g, '\n')
  }

  return fallback
}

function formatDate(value: string | null): string {
  if (!value) {
    return ''
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return ''
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

function resolveMediaUrl(fileUrl: string): string {
  if (!fileUrl) {
    return ''
  }

  try {
    const apiUrl = new URL(config.public.apiBase as string)
    const backendOrigin = apiUrl.origin

    if (fileUrl.startsWith('http://') || fileUrl.startsWith('https://')) {
      const parsed = new URL(fileUrl)
      return `${backendOrigin}${parsed.pathname}`
    }

    return `${backendOrigin}${fileUrl}`
  }
  catch {
    return fileUrl
  }
}

async function resolveImage(value: unknown, fallback: BlogImage): Promise<BlogImage> {
  if (isMediaRef(value)) {
    try {
      const media = await get<MediaAsset>(`/media-assets/${value.__mediaId}`)
      return {
        url: media.fileUrl ? resolveMediaUrl(media.fileUrl) : fallback.url,
        alt: media.altText || fallback.alt,
      }
    }
    catch {
      return fallback
    }
  }

  if (typeof value === 'string' && value.trim()) {
    return {
      url: value,
      alt: fallback.alt,
    }
  }

  if (isRecord(value)) {
    const maybeUrl = typeof value.url === 'string' ? value.url : typeof value.src === 'string' ? value.src : ''
    if (maybeUrl) {
      return {
        url: maybeUrl,
        alt: typeof value.alt === 'string' && value.alt ? value.alt : fallback.alt,
      }
    }
  }

  return fallback
}

function parseMediaId(value: number | string | null | undefined): number | null {
  if (value === null || value === undefined) {
    return null
  }

  const id = typeof value === 'number' ? value : Number(value)
  if (!Number.isFinite(id) || id <= 0) {
    return null
  }

  return id
}

function resolveCoverImageByMediaIdDirect(mediaIdRaw: number | string | null | undefined): Promise<BlogImage | null> {
  const mediaId = parseMediaId(mediaIdRaw)
  if (!mediaId) {
    return Promise.resolve(null)
  }

  const cachedPromise = coverImageCache.get(mediaId)
  if (cachedPromise) {
    return cachedPromise
  }

  const promise = $fetch<MediaAsset>(`/media-assets/${mediaId}`, {
    baseURL: config.public.apiBase,
    method: 'GET',
  })
    .then((media) => {
      if (!media?.fileUrl) {
        return null
      }

      return {
        url: resolveMediaUrl(media.fileUrl),
        alt: media.altText || 'Blog image',
      }
    })
    .catch(() => null)

  coverImageCache.set(mediaId, promise)
  return promise
}

async function mapApiPostToCard(post: ApiBlogPost, categoryName?: string): Promise<BlogPost> {
  const image = await resolveCoverImageByMediaIdDirect(post.coverMediaId)

  return {
    id: post.id,
    title: post.title,
    description: post.excerpt || '',
    author: post.authorName || 'HAI Meteo',
    date: formatDate(post.publishedAt || post.createdAt),
    image: image || {
      url: '/images/blog/BackgroundSectionOne.png',
      alt: 'Blog image',
    },
    category: categoryName || 'Uncategorized',
  }
}

async function resolvePosts(value: unknown, fallback: BlogPost[]): Promise<BlogPost[]> {
  if (!Array.isArray(value) || value.length === 0) {
    return fallback
  }

  const mergedPosts = [...fallback]

  await Promise.all(value.map(async (rawItem, index) => {
    if (!isRecord(rawItem)) {
      return
    }

    const fallbackItem = fallback[index]
    const baseItem: BlogPost = fallbackItem
      ? { ...fallbackItem }
      : { id: 0, title: '', description: '', author: '', date: '', image: { url: '', alt: '' } }

    const mergedItem: BlogPost = {
      id: typeof rawItem.id === 'number' ? rawItem.id : baseItem.id,
      title: toText(rawItem.title || '', baseItem.title),
      description: toText(rawItem.description || '', baseItem.description),
      author: toText(rawItem.author || '', baseItem.author),
      date: toText(rawItem.date || '', baseItem.date),
      image: baseItem.image,
      category: toText(rawItem.category || '', baseItem.category || ''),
      featured: typeof rawItem.featured === 'boolean' ? rawItem.featured : baseItem.featured,
    }

    if (rawItem.image && baseItem.image) {
      mergedItem.image = await resolveImage(rawItem.image, baseItem.image)
    }

    if (index < mergedPosts.length) {
      mergedPosts[index] = mergedItem
      return
    }

    mergedPosts.push(mergedItem)
  }))

  return mergedPosts
}

async function mergeSectionOne(
  apiContent: Record<string, unknown> | undefined,
): Promise<BlogSectionOneContent> {
  const fallback = blogDefaults.sectionOne
  if (!apiContent) {
    return fallback
  }

  return {
    title: toText(apiContent.title, fallback.title),
    description: toText(apiContent.description, fallback.description),
    backgroundImage: fallback.backgroundImage
      ? await resolveImage(apiContent.backgroundImage, fallback.backgroundImage)
      : undefined,
  }
}

async function mergeSectionTwo(
  apiContent: Record<string, unknown> | undefined,
): Promise<BlogSectionTwoContent> {
  const fallback = blogDefaults.sectionTwo
  if (!apiContent) {
    return fallback
  }

  return {
    title: toText(apiContent.title ?? '', fallback.title),
    description: toText(apiContent.description ?? '', fallback.description),
    featuredPosts: await resolvePosts(apiContent.featuredPosts, fallback.featuredPosts),
  }
}

async function mergeSectionThree(
  apiContent: Record<string, unknown> | undefined,
): Promise<BlogSectionThreeContent> {
  const fallback = blogDefaults.sectionThree
  if (!apiContent) {
    return fallback
  }

  const categories = Array.isArray(apiContent.categories)
    ? apiContent.categories.map((c: unknown) => toText(c || '', fallback.categories[0] || ''))
    : fallback.categories

  return {
    title: toText(apiContent.title ?? '', fallback.title),
    description: toText(apiContent.description ?? '', fallback.description),
    categories: categories.length > 0 ? categories : fallback.categories,
  }
}

async function loadBlogContent() {
  try {
    const pageResponse = await get<{ results: PageRecord[] }>('/pages', {
      query: {
        slug: 'blog',
        limit: 1,
      },
    })

    const page = pageResponse.results?.[0]
    if (!page?.id) {
      sections.value = cloneDefaults()
      return
    }

    const sectionResponse = await get<{ results: SectionRecord[] }>('/page-sections', {
      query: {
        pageId: page.id,
        isEnabled: true,
        limit: 100,
      },
    })

    const sectionMap = new Map(
      (sectionResponse.results || []).map(section => [section.sectionKey, section.content]),
    )

    sections.value = {
      sectionOne: await mergeSectionOne(sectionMap.get(blogSectionKeys.sectionOne)),
      sectionTwo: await mergeSectionTwo(sectionMap.get(blogSectionKeys.sectionTwo)),
      sectionThree: await mergeSectionThree(sectionMap.get(blogSectionKeys.sectionThree)),
    }
  }
  catch {
    sections.value = cloneDefaults()
  }
}

async function loadBlogPosts() {
  try {
    coverImageCache.clear()

    const postsResponse = await get<{ results: ApiBlogPost[] }>('/blog-posts', {
      query: {
        status: 'published',
        limit: 100,
        offset: 0,
      },
    })

    const categoriesResponse = await get<{ results: ApiBlogCategory[] }>('/blog-categories', {
      query: {
        limit: 100,
        offset: 0,
      },
    }).catch(() => ({ results: [] as ApiBlogCategory[] }))

    const posts = postsResponse.results || []
    const categoryNameById = new Map(
      (categoriesResponse.results || []).map(category => [category.id, category.name]),
    )
    backendCategories.value = [...new Set((categoriesResponse.results || []).map(category => category.name))]

    const postDetailsSettled = await Promise.allSettled(
      posts.map(post => get<ApiBlogPostDetail>(`/blog-posts/${post.id}`)),
    )

    const detailByPostId = new Map<number, ApiBlogPostDetail>()
    postDetailsSettled.forEach((result, index) => {
      const post = posts[index]
      if (!post) {
        return
      }

      if (result.status === 'fulfilled') {
        detailByPostId.set(post.id, result.value)
      }
    })

    const mappedPosts = await Promise.all(posts.map(async (post) => {
      const detail = detailByPostId.get(post.id)
      const primaryCategoryId = detail?.categoryIds?.[0]
      const categoryName = primaryCategoryId ? categoryNameById.get(primaryCategoryId) : undefined

      return mapApiPostToCard(post, categoryName)
    }))
    blogPosts.value = mappedPosts
  }
  catch {
    blogPosts.value = []
    backendCategories.value = []
  }
}
</script>

<template>
  <LandingLayout>
    <main>
      <SectionOne :content="sections.sectionOne" />
      <SectionTwo :content="sectionTwoContent" />
      <SectionThree :content="sectionThreeContent" :posts="blogPosts" />
    </main>
  </LandingLayout>
</template>
