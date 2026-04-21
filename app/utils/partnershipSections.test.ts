import { describe, expect, it } from 'vitest'
import { partnershipDefaults } from '~/data/partnershipDefaults'
import { buildPartnershipSections } from './partnershipSections'

describe('buildPartnershipSections', () => {
  it('resolves benefit item icons into CMS media URLs', async () => {
    const result = await buildPartnershipSections({
      defaults: partnershipDefaults,
      sectionContent: {
        'partnership-section-two': {
          items: [{ icon: { __mediaId: 55 } }],
        },
      },
      resolveMedia: async () => ({
        fileUrl: 'https://cdn.example.com/partner-icon.svg',
        altText: 'Partner Icon',
      }),
    })

    expect(result.sectionTwo.items[0]!.icon).toBe('https://cdn.example.com/partner-icon.svg')
  })

  it('resolves section three background video into a CMS media URL', async () => {
    const result = await buildPartnershipSections({
      defaults: partnershipDefaults,
      sectionContent: {
        'partnership-section-three': {
          video: { __mediaId: 56 },
        },
      },
      resolveMedia: async (ref) => {
        if (ref?.__mediaId === 56) {
          return {
            fileUrl: 'https://cdn.example.com/partner-bg.mp4',
            altText: 'Partner Background Video',
          }
        }

        return null
      },
    })

    expect(result.sectionThree.video).toBe('https://cdn.example.com/partner-bg.mp4')
  })
})
