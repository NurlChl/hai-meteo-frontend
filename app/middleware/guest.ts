export default defineNuxtRouteMiddleware(async (_to, _from) => {
  const authStore = useAuthStore()

  await authStore.initializeFromStorage()

  if (authStore.isAuthenticated) {
    return navigateTo('/admin')
  }
})
