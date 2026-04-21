import type { MediaAssetSummary, MediaRef } from './sectionContent'
import type {
  LandingFaq,
  LandingFeature,
  LandingImage,
  LandingSectionsData,
  LandingSolution,
  LandingTechnology,
} from '~/data/landingDefaults'
import { landingSectionFourAnimationFile, landingSectionKeys } from '~/data/landingDefaults'
import {
  coerceText,
  isMediaRef,
  isRecord,

  mediaUrlOrFallback,
  mergeMediaField,
} from './sectionContent'

interface BuildLandingSectionsOptions {
  defaults: LandingSectionsData
  sectionContent: Record<string, Record<string, unknown> | undefined>
  resolveMedia: (ref: MediaRef | null | undefined) => Promise<MediaAssetSummary | null>
}

async function resolveImage(
  value: unknown,
  fallback: LandingImage,
  resolveMedia: BuildLandingSectionsOptions['resolveMedia'],
): Promise<LandingImage> {
  if (isMediaRef(value))
    return mergeMediaField(await resolveMedia(value), fallback)

  if (isRecord(value) && typeof value.url === 'string')
    return { url: value.url, alt: typeof value.alt === 'string' ? value.alt : fallback.alt }

  if (typeof value === 'string' && value.trim())
    return { url: value, alt: fallback.alt }

  return fallback
}

async function resolveOptionalImage(
  value: unknown,
  fallback: LandingImage | undefined,
  resolveMedia: BuildLandingSectionsOptions['resolveMedia'],
): Promise<LandingImage | undefined> {
  if (fallback)
    return resolveImage(value, fallback, resolveMedia)

  if (isMediaRef(value)) {
    const media = await resolveMedia(value)
    return media?.fileUrl ? { url: media.fileUrl, alt: media.altText || '' } : undefined
  }

  if (isRecord(value) && typeof value.url === 'string')
    return { url: value.url, alt: typeof value.alt === 'string' ? value.alt : '' }

  if (typeof value === 'string' && value.trim())
    return { url: value, alt: '' }

  return undefined
}

async function resolveMediaPath(
  value: unknown,
  fallback: string | undefined,
  resolveMedia: BuildLandingSectionsOptions['resolveMedia'],
): Promise<string | undefined> {
  if (isMediaRef(value))
    return mediaUrlOrFallback(await resolveMedia(value), fallback)

  if (typeof value === 'string' && value.trim())
    return value

  return fallback
}

async function resolveFeature(
  raw: unknown,
  fallback: LandingFeature,
  resolveMedia: BuildLandingSectionsOptions['resolveMedia'],
): Promise<LandingFeature> {
  if (!isRecord(raw))
    return fallback

  return {
    title: coerceText(raw.title, fallback.title),
    description: coerceText(raw.description, fallback.description),
    icon: isMediaRef(raw.icon) ? mediaUrlOrFallback(await resolveMedia(raw.icon), fallback.icon) || fallback.icon : coerceText(raw.icon, fallback.icon),
  }
}

async function resolveSolution(
  raw: unknown,
  fallback: LandingSolution,
  resolveMedia: BuildLandingSectionsOptions['resolveMedia'],
): Promise<LandingSolution> {
  if (!isRecord(raw))
    return fallback

  return {
    id: coerceText(raw.id, fallback.id),
    title: coerceText(raw.title, fallback.title),
    description: coerceText(raw.description, fallback.description),
    video: isMediaRef(raw.video) ? mediaUrlOrFallback(await resolveMedia(raw.video), fallback.video) : coerceText(raw.video, fallback.video || '') || fallback.video,
  }
}

async function resolveTechnology(
  raw: unknown,
  fallback: LandingTechnology,
  resolveMedia: BuildLandingSectionsOptions['resolveMedia'],
): Promise<LandingTechnology> {
  if (!isRecord(raw))
    return fallback

  return {
    title: coerceText(raw.title, fallback.title),
    description: coerceText(raw.description, fallback.description),
    icon: isMediaRef(raw.icon) ? mediaUrlOrFallback(await resolveMedia(raw.icon), fallback.icon) || fallback.icon : coerceText(raw.icon, fallback.icon),
  }
}

function resolveFaq(raw: unknown, fallback: LandingFaq): LandingFaq {
  if (!isRecord(raw))
    return fallback

  return {
    question: coerceText(raw.question, fallback.question),
    answer: coerceText(raw.answer, fallback.answer),
  }
}

export async function buildLandingSections({
  defaults,
  sectionContent,
  resolveMedia,
}: BuildLandingSectionsOptions): Promise<LandingSectionsData> {
  const sectionOne = sectionContent[landingSectionKeys.sectionOne]
  const sectionTwo = sectionContent[landingSectionKeys.sectionTwo]
  const sectionThree = sectionContent[landingSectionKeys.sectionThree]
  const sectionFour = sectionContent[landingSectionKeys.sectionFour]
  const sectionFive = sectionContent[landingSectionKeys.sectionFive]
  const sectionSix = sectionContent[landingSectionKeys.sectionSix]
  const sectionSeven = sectionContent[landingSectionKeys.sectionSeven]

  return {
    sectionOne: {
      ...defaults.sectionOne,
      title: coerceText(sectionOne?.title, defaults.sectionOne.title),
      description: coerceText(sectionOne?.description, defaults.sectionOne.description),
      backgroundImage: await resolveOptionalImage(sectionOne?.backgroundImage, defaults.sectionOne.backgroundImage, resolveMedia),
      backgroundVideo: await resolveMediaPath(sectionOne?.backgroundVideo, defaults.sectionOne.backgroundVideo, resolveMedia),
      showcaseVideo: await resolveMediaPath(sectionOne?.showcaseVideo, defaults.sectionOne.showcaseVideo, resolveMedia),
    },
    sectionTwo: {
      ...defaults.sectionTwo,
      title: coerceText(sectionTwo?.title, defaults.sectionTwo.title),
      description: coerceText(sectionTwo?.description, defaults.sectionTwo.description),
      features: await Promise.all(defaults.sectionTwo.features.map((fallback, index) =>
        resolveFeature(Array.isArray(sectionTwo?.features) ? sectionTwo.features[index] : null, fallback, resolveMedia))),
    },
    sectionThree: {
      ...defaults.sectionThree,
      title: coerceText(sectionThree?.title, defaults.sectionThree.title),
      description: coerceText(sectionThree?.description, defaults.sectionThree.description),
      timelineMarkerImage: await resolveOptionalImage(sectionThree?.timelineMarkerImage, defaults.sectionThree.timelineMarkerImage, resolveMedia),
      solutions: await Promise.all(defaults.sectionThree.solutions.map((fallback, index) =>
        resolveSolution(Array.isArray(sectionThree?.solutions) ? sectionThree.solutions[index] : null, fallback, resolveMedia))),
    },
    sectionFour: {
      ...defaults.sectionFour,
      title: coerceText(sectionFour?.title, defaults.sectionFour.title),
      description: coerceText(sectionFour?.description, defaults.sectionFour.description),
      animationFile: landingSectionFourAnimationFile,
      radarImage: await resolveOptionalImage(sectionFour?.radarImage, defaults.sectionFour.radarImage, resolveMedia),
      logoImage: await resolveOptionalImage(sectionFour?.logoImage, defaults.sectionFour.logoImage, resolveMedia),
      technologies: await Promise.all(defaults.sectionFour.technologies.map((fallback, index) =>
        resolveTechnology(Array.isArray(sectionFour?.technologies) ? sectionFour.technologies[index] : null, fallback, resolveMedia))),
    },
    sectionFive: {
      ...defaults.sectionFive,
      title: coerceText(sectionFive?.title, defaults.sectionFive.title),
      date: coerceText(sectionFive?.date, defaults.sectionFive.date),
      description: coerceText(sectionFive?.description, defaults.sectionFive.description),
      link: coerceText(sectionFive?.link, defaults.sectionFive.link || '') || defaults.sectionFive.link,
      image: await resolveImage(sectionFive?.image, defaults.sectionFive.image, resolveMedia),
    },
    sectionSix: {
      ...defaults.sectionSix,
      title: coerceText(sectionSix?.title, defaults.sectionSix.title),
      description: coerceText(sectionSix?.description, defaults.sectionSix.description),
      faqs: defaults.sectionSix.faqs.map((fallback, index) =>
        resolveFaq(Array.isArray(sectionSix?.faqs) ? sectionSix.faqs[index] : null, fallback)),
    },
    sectionSeven: {
      ...defaults.sectionSeven,
      title: coerceText(sectionSeven?.title, defaults.sectionSeven.title),
      description: coerceText(sectionSeven?.description, defaults.sectionSeven.description),
      backgroundImage: await resolveOptionalImage(sectionSeven?.backgroundImage, defaults.sectionSeven.backgroundImage, resolveMedia),
      lineImage: await resolveOptionalImage(sectionSeven?.lineImage, defaults.sectionSeven.lineImage, resolveMedia),
      demoVideo: await resolveMediaPath(sectionSeven?.demoVideo, defaults.sectionSeven.demoVideo, resolveMedia),
    },
  }
}
