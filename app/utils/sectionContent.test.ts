import { describe, expect, it } from 'vitest'
import { coerceText, isMediaRef, mergeMediaField } from './sectionContent'

describe('sectionContent', () => {
  it('detects media references', () => {
    expect(isMediaRef({ __mediaId: 12 })).toBe(true)
    expect(isMediaRef({ id: 12 })).toBe(false)
  })

  it('coerces strings with escaped newlines', () => {
    expect(coerceText('Hello\\nWorld', 'Fallback')).toBe('Hello\nWorld')
    expect(coerceText('', 'Fallback')).toBe('Fallback')
  })

  it('prefers CMS media URL over fallback', () => {
    expect(mergeMediaField(
      { fileUrl: 'https://cdn.example.com/hero.png', altText: 'Hero' },
      { url: '/images/fallback.png', alt: 'Fallback' },
    )).toEqual({
      url: 'https://cdn.example.com/hero.png',
      alt: 'Hero',
    })
  })
})
