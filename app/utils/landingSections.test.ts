import { describe, expect, it } from 'vitest'
import { landingDefaults } from '~/data/landingDefaults'
import { buildLandingSections } from './landingSections'

describe('buildLandingSections', () => {
  it('replaces fallback image and video fields with resolved CMS media', async () => {
    const result = await buildLandingSections({
      defaults: landingDefaults,
      sectionContent: {
        'landing-section-three': {
          solutions: [
            {
              id: 'mining',
              video: { __mediaId: 99 },
            },
          ],
        },
      },
      resolveMedia: async ref => ref?.__mediaId === 99
        ? { fileUrl: 'https://cdn.example.com/mining.mp4', altText: 'Mining Video' }
        : null,
    })

    expect(result.sectionThree.solutions[0]!.video).toBe('https://cdn.example.com/mining.mp4')
  })

  it('resolves section hero and CTA media fields from CMS uploads', async () => {
    const result = await buildLandingSections({
      defaults: landingDefaults,
      sectionContent: {
        'landing-section-one': {
          backgroundVideo: { __mediaId: 10 },
          showcaseVideo: { __mediaId: 11 },
        },
        'landing-section-seven': {
          demoVideo: { __mediaId: 12 },
          lineImage: { __mediaId: 13 },
        },
      },
      resolveMedia: async (ref) => {
        if (ref?.__mediaId === 10)
          return { fileUrl: 'https://cdn.example.com/hero-bg.mp4', altText: null }
        if (ref?.__mediaId === 11)
          return { fileUrl: 'https://cdn.example.com/hero-showcase.mp4', altText: null }
        if (ref?.__mediaId === 12)
          return { fileUrl: 'https://cdn.example.com/cta-demo.mp4', altText: null }
        if (ref?.__mediaId === 13)
          return { fileUrl: 'https://cdn.example.com/cta-line.png', altText: 'CTA Line' }
        return null
      },
    })

    expect(result.sectionOne.backgroundVideo).toBe('https://cdn.example.com/hero-bg.mp4')
    expect(result.sectionOne.showcaseVideo).toBe('https://cdn.example.com/hero-showcase.mp4')
    expect(result.sectionSeven.demoVideo).toBe('https://cdn.example.com/cta-demo.mp4')
    expect(result.sectionSeven.lineImage).toEqual({
      url: 'https://cdn.example.com/cta-line.png',
      alt: 'CTA Line',
    })
  })

  it('does not fall back to frontend media when CMS media is missing', async () => {
    const result = await buildLandingSections({
      defaults: landingDefaults,
      sectionContent: {},
      resolveMedia: async () => null,
    })

    expect(result.sectionOne.backgroundVideo).toBeUndefined()
    expect(result.sectionOne.showcaseVideo).toBeUndefined()
    expect(result.sectionSeven.demoVideo).toBeUndefined()
    expect(result.sectionSeven.lineImage).toBeUndefined()
  })

  it('always uses the static animation file for landing section four', async () => {
    const result = await buildLandingSections({
      defaults: landingDefaults,
      sectionContent: {
        'landing-section-four': {
          animationFile: 'https://cdn.example.com/override.json',
        },
      },
      resolveMedia: async () => ({ fileUrl: 'https://cdn.example.com/from-cms.json', altText: null }),
    })

    expect(result.sectionFour.animationFile).toBe('/video/Flow 6.json')
  })
})
