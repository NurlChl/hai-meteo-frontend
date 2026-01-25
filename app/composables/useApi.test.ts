import { beforeEach, describe, expect, it } from 'vitest'
import { useApi } from '~/composables/useApi'

describe('useApi', () => {
  beforeEach(() => {

  })

  it('should initialize with default values', () => {
    const api = useApi()

    expect(api.loading.value).toBe(false)
    expect(api.error.value).toBe(null)
  })

  it('should have get, post, put, patch, delete methods', () => {
    const api = useApi()

    expect(typeof api.get).toBe('function')
    expect(typeof api.post).toBe('function')
    expect(typeof api.put).toBe('function')
    expect(typeof api.patch).toBe('function')
    expect(typeof api.del).toBe('function')
  })
})
