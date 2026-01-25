<script setup lang="ts">
import Icon from '~/components/Icon.vue'

definePageMeta({
  layout: 'admin',
  middleware: 'auth',
})

const authStore = useAuthStore()
const config = useRuntimeConfig()

const fetchOptions = computed(() => {
  const headers: Record<string, string> = {}
  if (authStore.token) {
    headers.Authorization = `Bearer ${authStore.token}`
  }
  return {
    baseURL: config.public.apiBase,
    headers,
  }
})

const { data: statsData } = await useAsyncData('dashboard-stats', async () => {
  const [posts, messages, media, pages] = await Promise.all([
    $fetch<{ totalResults: number }>('/blog-posts', fetchOptions.value),
    $fetch<{ totalResults: number }>('/contact-messages', fetchOptions.value),
    $fetch<{ totalResults: number }>('/media-assets', fetchOptions.value),
    $fetch<{ totalResults: number }>('/pages', fetchOptions.value),
  ])

  return {
    blogPosts: posts.totalResults || 0,
    messages: messages.totalResults || 0,
    mediaAssets: media.totalResults || 0,
    pages: pages.totalResults || 0,
  }
})

const stats = computed(() => statsData.value || {
  blogPosts: 0,
  messages: 0,
  mediaAssets: 0,
  pages: 0,
})

const { data: recentPostsData } = await useFetch<{ results: Array<{ id: number, title: string, status: string, createdAt: string }> }>('/blog-posts', {
  baseURL: config.public.apiBase,
  query: { limit: 5, offset: 0 },
  headers: fetchOptions.value.headers,
  key: 'recent-posts',
})

const recentPosts = computed(() => recentPostsData.value?.results || [])

const { data: recentMessagesData } = await useFetch<{ results: Array<{ id: number, name: string, email: string, status: string }> }>('/contact-messages', {
  baseURL: config.public.apiBase,
  query: { limit: 5, offset: 0 },
  headers: fetchOptions.value.headers,
  key: 'recent-messages',
})

const recentMessages = computed(() => recentMessagesData.value?.results || [])

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function getStatusVariant(status: string) {
  switch (status) {
    case 'published':
      return 'success'
    case 'draft':
      return 'warning'
    case 'archived':
      return 'danger'
    default:
      return 'info'
  }
}

function getMessageStatusVariant(status: string) {
  switch (status) {
    case 'done':
      return 'success'
    case 'in_progress':
      return 'warning'
    case 'new':
      return 'info'
    case 'spam':
      return 'danger'
    default:
      return 'info'
  }
}

const statItems = computed(() => [
  {
    label: 'Total Blog Posts',
    value: stats.value.blogPosts,
    icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z',
    colorClass: 'text-primary',
    bgClass: 'bg-primary/10',
  },
  {
    label: 'Contact Messages',
    value: stats.value.messages,
    icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z',
    colorClass: 'text-green-500',
    bgClass: 'bg-green-500/10',
  },
  {
    label: 'Media Assets',
    value: stats.value.mediaAssets,
    icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
    colorClass: 'text-accent-purple',
    bgClass: 'bg-accent-purple/10',
  },
  {
    label: 'Pages',
    value: stats.value.pages,
    icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    colorClass: 'text-yellow-500',
    bgClass: 'bg-yellow-500/10',
  },
])
</script>

<template>
  <div>
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-text-primary">
        Dashboard
      </h1>
      <p class="mt-1 text-sm text-text-secondary">
        Welcome back, {{ authStore.user?.name }}!
      </p>
    </div>

    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
      <BaseCard
        v-for="item in statItems"
        :key="item.label"
      >
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div
              class="p-3 rounded-lg"
              :class="item.bgClass"
            >
              <Icon
                :path="item.icon"
                class="h-6 w-6"
                :class="item.colorClass"
              />
            </div>
          </div>
          <div class="ml-4">
            <dt class="text-sm font-medium text-text-secondary truncate">
              {{ item.label }}
            </dt>
            <dd class="text-2xl font-semibold text-text-primary">
              {{ item.value }}
            </dd>
          </div>
        </div>
      </BaseCard>
    </div>

    <div class="grid gap-6 lg:grid-cols-2">
      <BaseCard>
        <div class="mb-4">
          <h2 class="text-lg font-semibold text-text-primary">
            Recent Blog Posts
          </h2>
        </div>
        <div class="space-y-4">
          <div
            v-for="post in recentPosts"
            :key="post.id"
            class="flex items-center justify-between p-3 border border-border-subtle rounded-lg bg-bg-surface"
          >
            <div>
              <p class="font-medium text-text-primary">
                {{ post.title }}
              </p>
              <p class="text-sm text-text-muted">
                {{ formatDate(post.createdAt) }}
              </p>
            </div>
            <BaseBadge :variant="getStatusVariant(post.status)" size="sm">
              {{ post.status }}
            </BaseBadge>
          </div>
        </div>
      </BaseCard>

      <BaseCard>
        <div class="mb-4">
          <h2 class="text-lg font-semibold text-text-primary">
            Recent Messages
          </h2>
        </div>
        <div class="space-y-4">
          <div
            v-for="message in recentMessages"
            :key="message.id"
            class="flex items-center justify-between p-3 border border-border-subtle rounded-lg bg-bg-surface"
          >
            <div>
              <p class="font-medium text-text-primary">
                {{ message.name }}
              </p>
              <p class="text-sm text-text-muted">
                {{ message.email }}
              </p>
            </div>
            <BaseBadge :variant="getMessageStatusVariant(message.status)" size="sm">
              {{ message.status }}
            </BaseBadge>
          </div>
        </div>
      </BaseCard>
    </div>
  </div>
</template>
