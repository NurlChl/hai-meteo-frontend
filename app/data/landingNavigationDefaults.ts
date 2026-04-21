import type { LandingNavigationLink, LandingSocialLink } from '~/utils/landingNavigation'

export const defaultLandingHeaderNavigation: LandingNavigationLink[] = [
  { name: 'Features', href: '/features' },
  { name: 'Technologies', href: '/technology' },
  { name: 'Partnership', href: '/partnership' },
  { name: 'FAQ', href: '/#faq' },
  { name: 'Blog', href: '/blog' },
]

export const defaultLandingFooterNavigation: LandingNavigationLink[] = [
  { name: 'Features', href: '/features' },
  { name: 'Technology', href: '/technology' },
  { name: 'Partnership', href: '/partnership' },
  { name: 'FAQ', href: '/faq' },
  { name: 'Blog', href: '/blog' },
]

export const defaultLandingSocialLinks: LandingSocialLink[] = [
  { name: 'X', href: '#' },
  { name: 'Instagram', href: '#' },
  { name: 'YouTube', href: '#' },
]
