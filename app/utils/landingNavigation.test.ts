import { describe, expect, it } from 'vitest'
import { buildLandingNavigation } from './landingNavigation'

describe('buildLandingNavigation', () => {
  it('groups enabled navigation items by location and resolves social icons from media', async () => {
    const result = await buildLandingNavigation({
      items: [
        { id: 1, label: 'Blog', href: '/blog', location: 'footer', iconMediaId: null, sortOrder: 2, isEnabled: true },
        { id: 2, label: 'Features', href: '/features', location: 'header', iconMediaId: null, sortOrder: 1, isEnabled: true },
        { id: 3, label: 'YouTube', href: 'https://youtube.com/@hai-meteo', location: 'social', iconMediaId: 33, sortOrder: 1, isEnabled: true },
        { id: 4, label: 'Hidden', href: '/hidden', location: 'header', iconMediaId: null, sortOrder: 99, isEnabled: false },
      ],
      resolveMedia: async mediaId => mediaId === 33
        ? { fileUrl: 'https://storage.googleapis.com/hai-meteo-bkt/social/youtube.png', altText: 'YouTube Icon' }
        : null,
    })

    expect(result.header).toEqual([
      { name: 'Features', href: '/features' },
    ])
    expect(result.footer).toEqual([
      { name: 'Blog', href: '/blog' },
    ])
    expect(result.social).toEqual([
      {
        name: 'YouTube',
        href: 'https://youtube.com/@hai-meteo',
        iconUrl: 'https://storage.googleapis.com/hai-meteo-bkt/social/youtube.png',
        iconAlt: 'YouTube Icon',
      },
    ])
  })

  it('returns empty groups when backend has no navigation items', async () => {
    const result = await buildLandingNavigation({
      items: [],
      resolveMedia: async () => null,
    })

    expect(result.header).toEqual([])
    expect(result.footer).toEqual([])
    expect(result.social).toEqual([])
  })
})
