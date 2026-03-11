import type { ApiError, ApiRequestOptions, HttpMethod } from '~/types'

export async function apiClient<T = unknown>(
  endpoint: string,
  options: ApiRequestOptions & { method?: HttpMethod } = {},
): Promise<T> {
  const { method = 'GET', headers = {}, query, body } = options
  const config = useRuntimeConfig()

  try {
    const response = await $fetch<T>(endpoint, {
      baseURL: config.public.apiBase,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      } as HeadersInit,
      query,
      body:
        method === 'POST' || method === 'PUT' || method === 'PATCH' || method === 'DELETE'
          ? JSON.stringify(body)
          : undefined,
      onRequest({ options }) {
        const authToken = useAuthStore().token
        if (authToken) {
          options.headers = new Headers({
            ...options.headers,
            Authorization: `Bearer ${authToken}`,
          })
        }
      },
      onResponseError({ response }) {
        if (response.status === 401) {
          const authStore = useAuthStore()
          authStore.logout()
          navigateTo('/admin/login')
        }
      },
    })

    return response
  }
  catch (error: unknown) {
    const fetchError = error as { data?: ApiError, statusCode?: number, status?: number, message?: string }

    if (fetchError.data) {
      throw createError({
        statusCode: fetchError.data.code || fetchError.statusCode || fetchError.status || 500,
        message: fetchError.data.message || fetchError.message || 'An error occurred',
      })
    }

    throw createError({
      statusCode: fetchError.statusCode || fetchError.status || 500,
      message: fetchError.message || 'An unknown error occurred',
    })
  }
}

export const api = {
  get: <T>(endpoint: string, options?: ApiRequestOptions) =>
    apiClient<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(endpoint: string, body?: unknown, options?: ApiRequestOptions) =>
    apiClient<T>(endpoint, { ...options, method: 'POST', body }),

  put: <T>(endpoint: string, body?: unknown, options?: ApiRequestOptions) =>
    apiClient<T>(endpoint, { ...options, method: 'PUT', body }),

  patch: <T>(endpoint: string, body?: unknown, options?: ApiRequestOptions) =>
    apiClient<T>(endpoint, { ...options, method: 'PATCH', body }),

  delete: <T>(endpoint: string, options?: ApiRequestOptions) =>
    apiClient<T>(endpoint, { ...options, method: 'DELETE' }),

  upload: async <T>(endpoint: string, formData: FormData): Promise<T> => {
    const config = useRuntimeConfig()
    const authToken = useAuthStore().token

    const response = await $fetch<T>(endpoint, {
      baseURL: config.public.apiBase,
      method: 'POST',
      body: formData,
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
      onResponseError({ response }) {
        if (response.status === 401) {
          const authStore = useAuthStore()
          authStore.logout()
          navigateTo('/admin/login')
        }
      },
    })

    return response
  },
}
