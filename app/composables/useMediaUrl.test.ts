import { describe, expect, it } from 'vitest'
import { resolveMediaUrlFromBase } from './useMediaUrl'

describe('useMediaUrl', () => {
  it('resolves relative upload paths against the backend origin', () => {
    expect(resolveMediaUrlFromBase('http://localhost:8080/api', '/uploads/image.png')).toBe(
      'http://localhost:8080/uploads/image.png',
    )
  })

  it('preserves absolute GCS URLs as-is', () => {
    expect(
      resolveMediaUrlFromBase(
        'http://localhost:8080/api',
        'https://storage.googleapis.com/hai-meteo-bkt/media-assets/test.png',
      ),
    ).toBe('https://storage.googleapis.com/hai-meteo-bkt/media-assets/test.png')
  })
})
