import type { ApiRequestOptions, HttpMethod } from '~/types'
import { api } from '~/utils/api'

export function useApi() {
  const loading = ref(false)
  const error = ref<Error | null>(null)

  const execute = async <T>(
    method: HttpMethod,
    endpoint: string,
    data?: unknown,
    options?: ApiRequestOptions,
  ): Promise<T> => {
    loading.value = true
    error.value = null

    try {
      const apiMethod = api[method.toLowerCase() as Lowercase<HttpMethod>]
      if (!apiMethod) {
        throw new Error(`Unsupported HTTP method: ${method}`)
      }

      let response: T
      if (method === 'GET') {
        response = await api.get<T>(endpoint, options)
      }
      else if (method === 'DELETE') {
        response = await api.delete<T>(endpoint, options)
      }
      else if (method === 'POST') {
        response = await api.post<T>(endpoint, data, options)
      }
      else if (method === 'PUT') {
        response = await api.put<T>(endpoint, data, options)
      }
      else if (method === 'PATCH') {
        response = await api.patch<T>(endpoint, data, options)
      }
      else {
        throw new Error(`Unsupported HTTP method: ${method}`)
      }
      return response
    }
    catch (err) {
      error.value = err as Error
      throw err
    }
    finally {
      loading.value = false
    }
  }

  const get = <T>(endpoint: string, options?: ApiRequestOptions) =>
    execute<T>('GET', endpoint, undefined, options)
  const post = <T>(endpoint: string, body?: unknown, options?: ApiRequestOptions) =>
    execute<T>('POST', endpoint, body, options)
  const put = <T>(endpoint: string, body?: unknown, options?: ApiRequestOptions) =>
    execute<T>('PUT', endpoint, body, options)
  const patch = <T>(endpoint: string, body?: unknown, options?: ApiRequestOptions) =>
    execute<T>('PATCH', endpoint, body, options)
  const del = <T>(endpoint: string, options?: ApiRequestOptions) =>
    execute<T>('DELETE', endpoint, undefined, options)

  return {
    loading,
    error,
    execute,
    get,
    post,
    put,
    patch,
    del,
  }
}
