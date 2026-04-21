import { describe, expect, it } from 'vitest'
import {
  defaultLandingFooterNavigation,
  defaultLandingHeaderNavigation,
  defaultLandingSocialLinks,
} from './landingNavigationDefaults'

describe('landingNavigationDefaults', () => {
  it('provides the legacy static header navigation links', () => {
    expect(defaultLandingHeaderNavigation).toEqual([
      { name: 'Features', href: '/features' },
      { name: 'Technologies', href: '/technology' },
      { name: 'Partnership', href: '/partnership' },
      { name: 'FAQ', href: '/#faq' },
      { name: 'Blog', href: '/blog' },
    ])
  })

  it('provides the legacy static footer navigation and social links', () => {
    expect(defaultLandingFooterNavigation).toEqual([
      { name: 'Features', href: '/features' },
      { name: 'Technology', href: '/technology' },
      { name: 'Partnership', href: '/partnership' },
      { name: 'FAQ', href: '/faq' },
      { name: 'Blog', href: '/blog' },
    ])

    expect(defaultLandingSocialLinks).toEqual([
      { name: 'X', href: '#' },
      { name: 'Instagram', href: '#' },
      { name: 'YouTube', href: '#' },
    ])
  })
})
