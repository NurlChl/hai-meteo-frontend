import { describe, expect, it } from 'vitest'
import { getMediaFilename } from './mediaFilename'

describe('getMediaFilename', () => {
  it('returns the last path segment for signed urls without query params', () => {
    expect(
      getMediaFilename(
        'https://storage.googleapis.com/hai-meteo-bkt/media-assets/1776585507348-880709828.mp4?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Signature=test',
      ),
    ).toBe('1776585507348-880709828.mp4')
  })

  it('returns the last path segment for relative paths', () => {
    expect(getMediaFilename('/uploads/hero-banner.png')).toBe('hero-banner.png')
  })
})
