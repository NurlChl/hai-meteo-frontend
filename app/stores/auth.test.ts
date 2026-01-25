import type { AdminUser } from '~/types/models'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { useAuthStore } from '~/stores/auth'

describe('useAuthStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should initialize with empty state', () => {
    const store = useAuthStore()

    expect(store.user).toBe(null)
    expect(store.token).toBe(null)
    expect(store.isAuthenticated).toBe(false)
  })

  it('should set user correctly', () => {
    const store = useAuthStore()
    const mockUser: AdminUser = {
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      isActive: true,
      lastLoginAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    store.setUser(mockUser)

    expect(store.user).toEqual(mockUser)
    expect(store.userName).toBe('Test User')
    expect(store.userEmail).toBe('test@example.com')
  })

  it('should set token correctly', () => {
    const store = useAuthStore()
    const mockToken = 'mock-token'

    store.setToken(mockToken)

    expect(store.token).toBe(mockToken)
    expect(store.isAuthenticated).toBe(true)
  })

  it('should logout correctly', () => {
    const store = useAuthStore()

    store.setUser({
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      isActive: true,
      lastLoginAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    store.setToken('mock-token')

    store.logout()

    expect(store.user).toBe(null)
    expect(store.token).toBe(null)
    expect(store.isAuthenticated).toBe(false)
  })
})
