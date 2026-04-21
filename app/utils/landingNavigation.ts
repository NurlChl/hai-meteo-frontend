import type { MediaAsset, NavigationItem } from '~/types/models'

export interface LandingNavigationLink {
  name: string
  href: string
}

export interface LandingSocialLink extends LandingNavigationLink {
  iconUrl?: string
  iconAlt?: string
}

export interface LandingNavigationContent {
  header: LandingNavigationLink[]
  footer: LandingNavigationLink[]
  social: LandingSocialLink[]
}

interface BuildLandingNavigationOptions {
  items: Array<Pick<NavigationItem, 'id' | 'label' | 'href' | 'location' | 'iconMediaId' | 'sortOrder' | 'isEnabled'>>
  resolveMedia: (mediaId: number) => Promise<Pick<MediaAsset, 'fileUrl' | 'altText'> | null>
}

function sortAndFilter(items: BuildLandingNavigationOptions['items']) {
  return items
    .filter(item => item.isEnabled)
    .sort((left, right) => left.sortOrder - right.sortOrder)
}

export async function buildLandingNavigation({
  items,
  resolveMedia,
}: BuildLandingNavigationOptions): Promise<LandingNavigationContent> {
  const enabledItems = sortAndFilter(items)

  const header = enabledItems
    .filter(item => item.location === 'header')
    .map(item => ({
      name: item.label,
      href: item.href,
    }))

  const footer = enabledItems
    .filter(item => item.location === 'footer')
    .map(item => ({
      name: item.label,
      href: item.href,
    }))

  const social = await Promise.all(enabledItems
    .filter(item => item.location === 'social')
    .map(async (item) => {
      const media = item.iconMediaId ? await resolveMedia(item.iconMediaId) : null

      return {
        name: item.label,
        href: item.href,
        iconUrl: media?.fileUrl,
        iconAlt: media?.altText || item.label,
      }
    }))

  return {
    header,
    footer,
    social,
  }
}

export function cloneFallbackLandingNavigation(): LandingNavigationContent {
  return {
    header: [],
    footer: [],
    social: [],
  }
}
