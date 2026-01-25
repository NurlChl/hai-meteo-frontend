import type { AdminUser, AuthTokens, LoginCredentials, RegisterData } from '~/types'
import { api } from '~/utils/api'

export function useAuth() {
  const authStore = useAuthStore()
  const toast = useToast()

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await api.post<{ user: AdminUser, tokens: AuthTokens }>(
        '/auth/login',
        credentials,
      )

      authStore.setUser(response.user)
      authStore.setToken(response.tokens.access.token)

      toast.success('Login successful!')
      await navigateTo('/admin')
    }
    catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed'
      toast.error(errorMessage)
      throw error
    }
  }

  const register = async (data: RegisterData) => {
    try {
      const response = await api.post<{ user: AdminUser, tokens: AuthTokens }>(
        '/auth/register',
        data,
      )

      authStore.setUser(response.user)
      authStore.setToken(response.tokens.access.token)

      toast.success('Registration successful!')
      await navigateTo('/admin')
    }
    catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed'
      toast.error(errorMessage)
      throw error
    }
  }

  const logout = async () => {
    authStore.logout()
    toast.success('Logged out successfully')
    await navigateTo('/admin/login')
  }

  const checkAuth = () => {
    return authStore.isAuthenticated
  }

  return {
    login,
    register,
    logout,
    checkAuth,
    user: computed(() => authStore.user),
    isAuthenticated: computed(() => authStore.isAuthenticated),
  }
}
