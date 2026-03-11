import type { AdminUser, FetchError } from '~/types'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AdminUser | null>(null)
  const token = useCookie<string | null>('auth_token', {
    maxAge: 60 * 60 * 24 * 7,
    sameSite: 'lax',
    path: '/',
    default: () => null,
  })

  const isAuthenticated = computed(() => !!token.value)
  const userName = computed(() => user.value?.name || '')
  const userEmail = computed(() => user.value?.email || '')

  function setUser(newUser: AdminUser) {
    user.value = newUser
  }

  function setToken(newToken: string) {
    token.value = newToken
  }

  function logout() {
    user.value = null
    token.value = null
  }

  async function initializeFromStorage() {
    if (token.value && !user.value) {
      const config = useRuntimeConfig()
      try {
        const userData = await $fetch<AdminUser>('/auth/me', {
          baseURL: config.public.apiBase,
          headers: {
            Authorization: `Bearer ${token.value}`,
          },
        })
        setUser(userData)
      }
      catch (error: unknown) {
        const e = error as FetchError
        console.error('Failed to fetch user profile:', e)
        if (e.response?.status === 401 || e.statusCode === 401) {
          logout()
        }
      }
    }
  }

  return {
    user,
    token,
    isAuthenticated,
    userName,
    userEmail,
    setUser,
    setToken,
    logout,
    initializeFromStorage,
  }
})
