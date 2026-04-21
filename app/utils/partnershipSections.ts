import type { MediaAssetSummary, MediaRef } from './sectionContent'
import type {
  PartnershipBenefitItem,
  PartnershipImage,
  PartnershipSectionsData,
} from '~/data/partnershipDefaults'
import { partnershipSectionKeys } from '~/data/partnershipDefaults'
import {
  coerceText,
  isMediaRef,
  isRecord,

  mediaUrlOrFallback,
  mergeMediaField,
} from './sectionContent'

interface BuildPartnershipSectionsOptions {
  defaults: PartnershipSectionsData
  sectionContent: Record<string, Record<string, unknown> | undefined>
  resolveMedia: (ref: MediaRef | null | undefined) => Promise<MediaAssetSummary | null>
}

async function resolveImage(
  value: unknown,
  fallback: PartnershipImage,
  resolveMedia: BuildPartnershipSectionsOptions['resolveMedia'],
): Promise<PartnershipImage> {
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
  resolveMedia: BuildPartnershipSectionsOptions['resolveMedia'],
): Promise<PartnershipBenefitItem> {
  const source = isRecord(raw) ? raw : {}

  return {
    title: coerceText(source.title, ''),
    description: coerceText(source.description, ''),
    icon: isMediaRef(source.icon)
      ? mediaUrlOrFallback(await resolveMedia(source.icon), '') || ''
      : coerceText(source.icon, ''),
  }
}

async function resolveMediaPath(
  value: unknown,
  fallback: string | undefined,
  resolveMedia: BuildPartnershipSectionsOptions['resolveMedia'],
): Promise<string | undefined> {
  if (isMediaRef(value))
    return mediaUrlOrFallback(await resolveMedia(value), fallback)

  if (typeof value === 'string' && value.trim())
    return value

  return fallback
}

export async function buildPartnershipSections({
  defaults,
  sectionContent,
  resolveMedia,
}: BuildPartnershipSectionsOptions): Promise<PartnershipSectionsData> {
  const sectionOne = sectionContent[partnershipSectionKeys.sectionOne]
  const sectionTwo = sectionContent[partnershipSectionKeys.sectionTwo]
  const sectionThree = sectionContent[partnershipSectionKeys.sectionThree]

  return {
    sectionOne: {
      ...defaults.sectionOne,
      title: coerceText(sectionOne?.title, defaults.sectionOne.title),
      description: coerceText(sectionOne?.description, defaults.sectionOne.description),
      image: await resolveImage(sectionOne?.image, defaults.sectionOne.image, resolveMedia),
      backgroundImage: await resolveImage(
        sectionOne?.backgroundImage,
        defaults.sectionOne.backgroundImage,
        resolveMedia,
      ),
      ctaText: coerceText(sectionOne?.ctaText, defaults.sectionOne.ctaText),
      ctaHref: coerceText(sectionOne?.ctaHref, defaults.sectionOne.ctaHref),
    },
    sectionTwo: {
      ...defaults.sectionTwo,
      title: coerceText(sectionTwo?.title, defaults.sectionTwo.title),
      description: coerceText(sectionTwo?.description, defaults.sectionTwo.description),
      items: Array.isArray(sectionTwo?.items)
        ? await Promise.all(sectionTwo.items.map(item => resolveItem(item, resolveMedia)))
        : [],
    },
    sectionThree: {
      ...defaults.sectionThree,
      title: coerceText(sectionThree?.title, defaults.sectionThree.title),
      description: coerceText(sectionThree?.description, defaults.sectionThree.description),
      video: await resolveMediaPath(sectionThree?.video, defaults.sectionThree.video, resolveMedia),
      submitText: coerceText(sectionThree?.submitText, defaults.sectionThree.submitText),
    },
  }
}
