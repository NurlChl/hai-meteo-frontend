import type { MediaAssetSummary, MediaRef } from './sectionContent'
import type { TechnologyImage, TechnologyItem, TechnologySectionsData } from '~/data/technologyDefaults'
import { technologySectionKeys } from '~/data/technologyDefaults'
import {
  coerceText,
  isMediaRef,
  isRecord,

  mediaUrlOrFallback,
  mergeMediaField,
} from './sectionContent'

interface BuildTechnologySectionsOptions {
  defaults: TechnologySectionsData
  sectionContent: Record<string, Record<string, unknown> | undefined>
  resolveMedia: (ref: MediaRef | null | undefined) => Promise<MediaAssetSummary | null>
}

async function resolveImage(
  value: unknown,
  fallback: TechnologyImage,
  resolveMedia: BuildTechnologySectionsOptions['resolveMedia'],
): Promise<TechnologyImage> {
  if (isMediaRef(value))
    return mergeMediaField(await resolveMedia(value), fallback)

  if (isRecord(value) && typeof value.url === 'string' && value.url.trim()) {
    return {
      url: value.url,
      alt: typeof value.alt === 'string' ? value.alt : fallback.alt,
    }
  }

  return fallback
}

async function resolveItem(
  raw: unknown,
  resolveMedia: BuildTechnologySectionsOptions['resolveMedia'],
): Promise<TechnologyItem> {
  const source = isRecord(raw) ? raw : {}
  const fallbackImage: TechnologyImage = { url: '', alt: '' }

  return {
    title: coerceText(source.title, ''),
    description: coerceText(source.description, ''),
    icon: isMediaRef(source.icon)
      ? mediaUrlOrFallback(await resolveMedia(source.icon), '') || ''
      : coerceText(source.icon, ''),
    image: isMediaRef(source.image) || isRecord(source.image)
      ? await resolveImage(source.image, fallbackImage, resolveMedia)
      : undefined,
  }
}

async function resolveItemList(
  value: unknown,
  resolveMedia: BuildTechnologySectionsOptions['resolveMedia'],
): Promise<TechnologyItem[] | undefined> {
  if (!Array.isArray(value))
    return []

  return Promise.all(value.map(item => resolveItem(item, resolveMedia)))
}

export async function buildTechnologySections({
  defaults,
  sectionContent,
  resolveMedia,
}: BuildTechnologySectionsOptions): Promise<TechnologySectionsData> {
  async function buildSection(
    sectionKey: string,
    fallback: TechnologySectionsData[keyof TechnologySectionsData],
  ) {
    const source = sectionContent[sectionKey]
    return {
      ...fallback,
      title: coerceText(source?.title, fallback.title),
      description: coerceText(source?.description, fallback.description),
      image: await resolveImage(source?.image, fallback.image, resolveMedia),
      backgroundImage: fallback.backgroundImage
        ? await resolveImage(source?.backgroundImage, fallback.backgroundImage, resolveMedia)
        : undefined,
      items: await resolveItemList(source?.items, resolveMedia),
    }
  }

  return {
    sectionOne: await buildSection(technologySectionKeys.sectionOne, defaults.sectionOne),
    sectionTwo: await buildSection(technologySectionKeys.sectionTwo, defaults.sectionTwo),
    sectionThree: await buildSection(technologySectionKeys.sectionThree, defaults.sectionThree),
    sectionFour: await buildSection(technologySectionKeys.sectionFour, defaults.sectionFour),
  }
}
