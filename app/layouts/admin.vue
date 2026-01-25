<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'

const authStore = useAuthStore()
const uiStore = useUIStore()
const { logout } = useAuth()
const route = useRoute()

uiStore.initializeFromStorage()

const navigation = [
  {
    label: 'Dashboard',
    href: '/admin',
    icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z',
  },
  {
    label: 'Blog Posts',
    href: '/admin/blog',
    icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z',
  },
  {
    label: 'Blog Categories',
    href: '/admin/blog/categories',
    icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z',
  },
  {
    label: 'Blog Tags',
    href: '/admin/blog/tags',
    icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z',
  },
  {
    label: 'Media Library',
    href: '/admin/media',
    icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
  },
  {
    label: 'Pages',
    href: '/admin/pages',
    icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  },
  {
    label: 'FAQs',
    href: '/admin/faqs',
    icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  },
  {
    label: 'Navigation',
    href: '/admin/navigation',
    icon: 'M4 6h16M4 12h16M4 18h16',
  },
  {
    label: 'Messages',
    href: '/admin/messages',
    icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  },
]

function isActive(href: string) {
  if (href === '/admin') {
    return route.path === '/admin'
  }
  return route.path.startsWith(href)
}

function closeSidebarMobile() {
  if (window.innerWidth < 1024) {
    uiStore.sidebarOpen = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-bg-dark font-sans antialiased text-text-primary">
    <div
      v-if="uiStore.sidebarOpen"
      class="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity duration-300"
      @click="uiStore.toggleSidebar"
    />

    <aside
      class="fixed inset-y-0 left-0 z-50 w-72 bg-bg-dark/90 backdrop-blur-2xl border-r border-white/5 transition-transform duration-300 ease-in-out lg:translate-x-0"
      :class="[uiStore.sidebarOpen ? 'translate-x-0' : '-translate-x-full']"
    >
      <div class="flex h-full flex-col">
        <div class="flex h-20 items-center justify-between px-8 border-b border-white/5">
          <div class="flex items-center gap-3">
            <div class="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <span class="text-white font-bold">H</span>
            </div>
            <h1 class="text-lg font-bold tracking-tight">
              Hai Meteo <span class="text-primary">CMS</span>
            </h1>
          </div>
          <button
            class="lg:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
            @click="uiStore.toggleSidebar"
          >
            <Icon path="M6 18L18 6M6 6l12 12" class="h-5 w-5" />
          </button>
        </div>

        <nav class="flex-1 overflow-y-auto px-4 py-6 scrollbar-hide">
          <ul class="space-y-1.5">
            <li v-for="item in navigation" :key="item.href">
              <NuxtLink
                :to="item.href"
                class="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 group relative"
                :class="
                  isActive(item.href)
                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                    : 'text-text-secondary hover:bg-white/5 hover:text-white'
                "
                @click="closeSidebarMobile"
              >
                <Icon :path="item.icon" class="h-5 w-5" />
                <span>{{ item.label }}</span>
                <div
                  v-if="isActive(item.href)"
                  class="absolute right-2 h-1.5 w-1.5 rounded-full bg-white/50"
                />
              </NuxtLink>
            </li>
          </ul>
        </nav>

        <div class="p-4 border-t border-white/5">
          <button
            class="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-text-muted hover:bg-white/5 hover:text-white transition-all"
            @click="logout"
          >
            <Icon
              path="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              class="h-5 w-5"
            />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>

    <div
      class="flex flex-col min-h-screen transition-all duration-300 ease-in-out"
      :class="[uiStore.sidebarOpen ? 'lg:ml-72' : 'lg:ml-0']"
    >
      <header class="sticky top-0 z-30 h-16 bg-bg-dark/80 backdrop-blur-xl border-b border-white/5">
        <div class="h-full flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <button
            class="p-2 rounded-lg text-text-muted hover:bg-white/5 lg:hidden transition-colors"
            @click="uiStore.toggleSidebar"
          >
            <Icon path="M4 6h16M4 12h16M4 18h16" class="h-6 w-6" />
          </button>

          <div class="flex items-center gap-4 ml-auto">
            <div class="flex items-center gap-3 pl-4 border-l border-white/10">
              <div class="flex flex-col items-end hidden sm:flex">
                <span class="text-sm font-semibold text-text-primary">{{ authStore.user?.name }}</span>
                <span class="text-xs text-text-muted">Administrator</span>
              </div>
              <div class="h-9 w-9 rounded-full bg-gradient-to-tr from-primary to-primary-light flex items-center justify-center text-white font-bold shadow-md">
                {{ authStore.user?.name?.charAt(0).toUpperCase() || 'A' }}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main class="flex-1 p-4 sm:p-6 lg:p-8 xl:p-10 max-w-7xl w-full mx-auto">
        <slot />
      </main>
    </div>
  </div>
</template>
