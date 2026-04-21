import { describe, expect, it } from 'vitest'
import { technologyDefaults } from '~/data/technologyDefaults'
import { buildTechnologySections } from './technologySections'

describe('buildTechnologySections', () => {
  it('resolves item icon media refs into file URLs', async () => {
    const result = await buildTechnologySections({
      defaults: technologyDefaults,
      sectionContent: {
        'technology-section-three': {
          items: [
            { icon: { __mediaId: 77 } },
          ],
        },
      },
      resolveMedia: async () => ({ fileUrl: 'https://cdn.example.com/icon.svg', altText: 'Satellite Icon' }),
    })

    expect(result.sectionThree.items?.[0]?.icon).toBe('https://cdn.example.com/icon.svg')
  })
})
