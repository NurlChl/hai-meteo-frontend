import { describe, expect, it } from 'vitest'
import { featuresDefaults } from '~/data/featuresDefaults'
import { buildFeaturesSections } from './featuresSections'

describe('buildFeaturesSections', () => {
  it('returns empty features content when CMS sections are missing', async () => {
    const result = await buildFeaturesSections({
      defaults: featuresDefaults,
      sectionContent: {},
      resolveMedia: async () => null,
    })

    expect(result.sectionOne.title).toBe('')
    expect(result.sectionOne.description).toBe('')
    expect(result.sectionOne.backgroundImage).toBeUndefined()
    expect(result.sectionOne.video).toBeUndefined()
    expect(result.sectionTwo.title).toBe('')
    expect(result.sectionTwo.items).toEqual([])
    expect(result.sectionThree.title).toBe('')
    expect(result.sectionThree.topFeatures).toEqual([])
    expect(result.sectionThree.bottomFeatures).toEqual([])
    expect(result.sectionFour.title).toBe('')
    expect(result.sectionFour.dashboardFeatures).toEqual([])
  })

  it('replaces section one video with a resolved CMS media URL', async () => {
    const result = await buildFeaturesSections({
      defaults: featuresDefaults,
      sectionContent: {
        'features-section-one': {
          title: 'CMS hero',
          video: { __mediaId: 20 },
        },
      },
      resolveMedia: async (ref) => {
        if (ref?.__mediaId === 20)
          return { fileUrl: 'https://cdn.example.com/hero.mp4', altText: 'Hero video' }
        return null
      },
    })

    expect(result.sectionOne.title).toBe('CMS hero')
    expect(result.sectionOne.video).toBe('https://cdn.example.com/hero.mp4')
  })

  it('builds section two items from CMS and resolves their media fields', async () => {
    const result = await buildFeaturesSections({
      defaults: featuresDefaults,
      sectionContent: {
        'features-section-two': {
          title: 'Core Capabilities',
          items: [
            {
              id: 'location-a',
              title: 'Location A',
              description: 'A localized weather feed.',
              icon: { __mediaId: 10 },
              image: { __mediaId: 11 },
            },
          ],
        },
      },
      resolveMedia: async (ref) => {
        if (ref?.__mediaId === 10)
          return { fileUrl: 'https://cdn.example.com/icon.svg', altText: 'Icon' }
        if (ref?.__mediaId === 11)
          return { fileUrl: 'https://cdn.example.com/bg.png', altText: 'Background' }
        return null
      },
    })

    expect(result.sectionTwo.title).toBe('Core Capabilities')
    expect(result.sectionTwo.items).toHaveLength(1)
    expect(result.sectionTwo.items[0]!.id).toBe('location-a')
    expect(result.sectionTwo.items[0]!.title).toBe('Location A')
    expect(result.sectionTwo.items[0]!.description).toBe('A localized weather feed.')
    expect(result.sectionTwo.items[0]!.icon).toBe('https://cdn.example.com/icon.svg')
    expect(result.sectionTwo.items[0]!.image).toBe('https://cdn.example.com/bg.png')
  })

  it('builds section three and four items from CMS and resolves their media fields', async () => {
    const result = await buildFeaturesSections({
      defaults: featuresDefaults,
      sectionContent: {
        'features-section-three': {
          topFeatures: [
            {
              id: 'detail-prediction',
              title: 'Detail Prediction',
              description: 'Detailed weather information.',
              icon: { __mediaId: 30 },
              image: { __mediaId: 31 },
            },
          ],
          bottomFeatures: [
            {
              id: 'seasonal-intelligence',
              title: 'Seasonal Intelligence',
              description: 'Seasonal weather intelligence.',
              image: { __mediaId: 32 },
              secondaryImage: { __mediaId: 33 },
            },
          ],
        },
        'features-section-four': {
          dashboardFeatures: [
            {
              title: 'Visual Wind Motion',
              description: 'Animated wind visualization.',
              icon: { __mediaId: 34 },
              video: { __mediaId: 35 },
            },
          ],
        },
      },
      resolveMedia: async (ref) => {
        switch (ref?.__mediaId) {
          case 30:
            return { fileUrl: 'https://cdn.example.com/detail-icon.svg', altText: 'Detail icon' }
          case 31:
            return { fileUrl: 'https://cdn.example.com/detail.png', altText: 'Detail image' }
          case 32:
            return { fileUrl: 'https://cdn.example.com/seasonal-a.png', altText: 'Seasonal dry' }
          case 33:
            return { fileUrl: 'https://cdn.example.com/seasonal-b.png', altText: 'Seasonal wet' }
          case 34:
            return {
              fileUrl: 'https://cdn.example.com/dashboard-icon.svg',
              altText: 'Dashboard icon',
            }
          case 35:
            return { fileUrl: 'https://cdn.example.com/dashboard.mp4', altText: 'Dashboard video' }
          default:
            return null
        }
      },
    })

    expect(result.sectionThree.topFeatures).toHaveLength(1)
    expect(result.sectionThree.bottomFeatures).toHaveLength(1)
    expect(result.sectionThree.topFeatures[0]!.icon).toBe('https://cdn.example.com/detail-icon.svg')
    expect(result.sectionThree.topFeatures[0]!.image).toBe('https://cdn.example.com/detail.png')
    expect(result.sectionThree.bottomFeatures[0]!.image).toBe(
      'https://cdn.example.com/seasonal-a.png',
    )
    expect(result.sectionThree.bottomFeatures[0]!.secondaryImage).toBe(
      'https://cdn.example.com/seasonal-b.png',
    )
    expect(result.sectionFour.dashboardFeatures[0]!.icon).toBe(
      'https://cdn.example.com/dashboard-icon.svg',
    )
    expect(result.sectionFour.dashboardFeatures[0]!.video).toBe(
      'https://cdn.example.com/dashboard.mp4',
    )
  })
})
