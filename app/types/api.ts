export type ApiResponse<T = unknown> = T

export interface PaginatedResponse<T> {
  results: T[]
  totalResults: number
  limit: number
  offset: number
}

export interface ApiError {
  code: number
  message: string
  stack?: string
}

export interface FetchError {
  data?: { message?: string, code?: number }
  message?: string
  status?: number
  statusCode?: number
  response?: { status?: number }
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export interface ApiRequestOptions {
  headers?: Record<string, string>
  query?: Record<string, unknown>
  body?: unknown
}
