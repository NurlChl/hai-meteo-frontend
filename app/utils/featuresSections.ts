import type { MediaAssetSummary, MediaRef } from './sectionContent'
import type { FeaturesImage, FeaturesItem, FeaturesSectionsData } from '~/data/featuresDefaults'
import { featuresSectionKeys } from '~/data/featuresDefaults'
import {
  coerceText,
  isMediaRef,
  isRecord,

  mediaUrlOrFallback,
} from './sectionContent'

interface BuildFeaturesSectionsOptions {
  defaults: FeaturesSectionsData
  sectionContent: Record<string, Record<string, unknown> | undefined>
  resolveMedia: (ref: MediaRef | null | undefined) => Promise<MediaAssetSummary | null>
}

async function resolveImage(
  value: unknown,
  resolveMedia: BuildFeaturesSectionsOptions['resolveMedia'],
): Promise<FeaturesImage | undefined> {
  if (isMediaRef(value)) {
    const media = await resolveMedia(value)
    return media?.fileUrl ? { url: media.fileUrl, alt: media.altText || '' } : undefined
  }

  if (isRecord(value) && typeof value.url === 'string' && value.url.trim()) {
    return {
      url: value.url,
      alt: typeof value.alt === 'string' ? value.alt : '',
    }
  }

  if (typeof value === 'string' && value.trim())
    return { url: value, alt: '' }

  return undefined
}

async function resolveMediaPath(
  value: unknown,
  resolveMedia: BuildFeaturesSectionsOptions['resolveMedia'],
): Promise<string | undefined> {
  if (isMediaRef(value))
    return mediaUrlOrFallback(await resolveMedia(value))

  if (typeof value === 'string' && value.trim())
    return value

  return undefined
}

async function resolveItem(
  raw: unknown,
  resolveMedia: BuildFeaturesSectionsOptions['resolveMedia'],
): Promise<FeaturesItem> {
  const source = isRecord(raw) ? raw : {}

  return {
    id: coerceText(source.id, ''),
    title: coerceText(source.title, ''),
    description: coerceText(source.description, ''),
    icon: isMediaRef(source.icon)
      ? mediaUrlOrFallback(await resolveMedia(source.icon), '') || ''
      : coerceText(source.icon, ''),
    image: await resolveMediaPath(source.image, resolveMedia),
    secondaryImage: await resolveMediaPath(source.secondaryImage, resolveMedia),
    video: await resolveMediaPath(source.video, resolveMedia),
  }
}

async function resolveItemList(
  value: unknown,
  resolveMedia: BuildFeaturesSectionsOptions['resolveMedia'],
): Promise<FeaturesItem[]> {
  if (!Array.isArray(value))
    return []

  return Promise.all(value.map(item => resolveItem(item, resolveMedia)))
}

export async function buildFeaturesSections({
  defaults,
  sectionContent,
  resolveMedia,
}: BuildFeaturesSectionsOptions): Promise<FeaturesSectionsData> {
  const sectionOne = sectionContent[featuresSectionKeys.sectionOne]
  const sectionTwo = sectionContent[featuresSectionKeys.sectionTwo]
  const sectionThree = sectionContent[featuresSectionKeys.sectionThree]
  const sectionFour = sectionContent[featuresSectionKeys.sectionFour]

  return {
    sectionOne: {
      ...defaults.sectionOne,
      title: coerceText(sectionOne?.title, defaults.sectionOne.title),
      description: coerceText(sectionOne?.description, defaults.sectionOne.description),
      backgroundImage: await resolveImage(sectionOne?.backgroundImage, resolveMedia),
      video: await resolveMediaPath(sectionOne?.video, resolveMedia),
    },
    sectionTwo: {
      ...defaults.sectionTwo,
      title: coerceText(sectionTwo?.title, defaults.sectionTwo.title),
      items: await resolveItemList(sectionTwo?.items, resolveMedia),
    },
    sectionThree: {
      ...defaults.sectionThree,
      title: coerceText(sectionThree?.title, defaults.sectionThree.title),
      topFeatures: await resolveItemList(sectionThree?.topFeatures, resolveMedia),
      bottomFeatures: await resolveItemList(sectionThree?.bottomFeatures, resolveMedia),
    },
    sectionFour: {
      ...defaults.sectionFour,
      title: coerceText(sectionFour?.title, defaults.sectionFour.title),
      dashboardFeatures: await resolveItemList(sectionFour?.dashboardFeatures, resolveMedia),
    },
  }
}
