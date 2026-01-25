import { defineStore } from 'pinia'

interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
}

interface CacheState {
  entries: Map<string, CacheEntry<unknown>>
}

export const useCacheStore = defineStore('cache', {
  state: (): CacheState => ({
    entries: new Map(),
  }),

  actions: {
    get<T>(key: string): T | null {
      const entry = this.entries.get(key) as CacheEntry<T> | undefined

      if (!entry) {
        return null
      }

      const now = Date.now()
      if (now - entry.timestamp > entry.ttl) {
        this.entries.delete(key)
        return null
      }

      return entry.data
    },

    set<T>(key: string, data: T, ttl: number = 60000) {
      this.entries.set(key, {
        data,
        timestamp: Date.now(),
        ttl,
      })
    },

    has(key: string): boolean {
      const entry = this.entries.get(key)
      if (!entry) {
        return false
      }

      const now = Date.now()
      if (now - entry.timestamp > entry.ttl) {
        this.entries.delete(key)
        return false
      }

      return true
    },

    delete(key: string) {
      this.entries.delete(key)
    },

    clear() {
      this.entries.clear()
    },

    invalidate(pattern: string) {
      const regex = new RegExp(pattern)
      for (const key of this.entries.keys()) {
        if (regex.test(key)) {
          this.entries.delete(key)
        }
      }
    },
  },
})
