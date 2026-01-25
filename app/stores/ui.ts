import { defineStore } from 'pinia'

interface UIState {
  sidebarOpen: boolean
  theme: 'light' | 'dark'
}

export const useUIStore = defineStore('ui', {
  state: (): UIState => ({
    sidebarOpen: true,
    theme: 'light',
  }),

  getters: {
    isDark: (state): boolean => state.theme === 'dark',
  },

  actions: {
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen
      if (import.meta.client) {
        localStorage.setItem('sidebar_open', String(this.sidebarOpen))
      }
    },

    setSidebarOpen(open: boolean) {
      this.sidebarOpen = open
      if (import.meta.client) {
        localStorage.setItem('sidebar_open', String(open))
      }
    },

    setTheme(theme: 'light' | 'dark') {
      this.theme = theme
      if (import.meta.client) {
        localStorage.setItem('theme', theme)
        document.documentElement.classList.toggle('dark', theme === 'dark')
      }
    },

    toggleTheme() {
      this.setTheme(this.theme === 'light' ? 'dark' : 'light')
    },

    initializeFromStorage() {
      if (import.meta.client) {
        const sidebarOpen = localStorage.getItem('sidebar_open')
        if (sidebarOpen) {
          this.sidebarOpen = sidebarOpen === 'true'
        }

        const theme = localStorage.getItem('theme') as 'light' | 'dark' | null
        if (theme) {
          this.setTheme(theme)
        }
      }
    },
  },
})
