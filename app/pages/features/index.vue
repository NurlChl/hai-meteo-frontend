<script setup lang="ts">
import type {
  FeaturesImage,
  FeaturesItem,
  FeaturesSectionFourContent,
  FeaturesSectionOneContent,
  FeaturesSectionsData,
  FeaturesSectionThreeContent,
  FeaturesSectionTwoContent,
} from '~/data/featuresDefaults'
import SectionFour from '~/components/features/SectionFour.vue'
import SectionOne from '~/components/features/SectionOne.vue'
import SectionThree from '~/components/features/SectionThree.vue'
import SectionTwo from '~/components/features/SectionTwo.vue'
import { featuresDefaults, featuresSectionKeys } from '~/data/featuresDefaults'
import LandingLayout from '~/layouts/landing.vue'

interface PageRecord {
  id: number
}

interface SectionRecord {
  sectionKey: string
  content: Record<string, unknown>
}

interface MediaAsset {
  fileUrl: string
  altText?: string
}

interface MediaRef {
  __mediaId: number
}

const { get } = useApi()

const sections = ref<FeaturesSectionsData>(cloneDefaults())

definePageMeta({
  layout: false,
})

await loadFeaturesContent()

function cloneDefaults(): FeaturesSectionsData {
  return JSON.parse(JSON.stringify(featuresDefaults))
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isMediaRef(value: unknown): value is MediaRef {
  return isRecord(value) && typeof value.__mediaId === 'number'
}

function toText(value: unknown, fallback: string): string {
  if (typeof value === 'string' && value.trim()) {
    return value.replace(/\\n/g, '\n')
  }

  return fallback
}

async function resolveImage(value: unknown, fallback: FeaturesImage): Promise<FeaturesImage> {
  if (isMediaRef(value)) {
    try {
      const media = await get<MediaAsset>(`/media-assets/${value.__mediaId}`)
      return {
        url: media.fileUrl || fallback.url,
        alt: media.altText || fallback.alt,
      }
    }
    catch {
      return fallback
    }
  }

  if (typeof value === 'string' && value.trim()) {
    return {
      url: value,
      alt: fallback.alt,
    }
  }

  if (isRecord(value)) {
    const maybeUrl = typeof value.url === 'string' ? value.url : typeof value.src === 'string' ? value.src : ''
    if (maybeUrl) {
      return {
        url: maybeUrl,
        alt: typeof value.alt === 'string' && value.alt ? value.alt : fallback.alt,
      }
    }
  }

  return fallback
}

async function resolveItems(value: unknown, fallback: FeaturesItem[]): Promise<FeaturesItem[]> {
  if (!Array.isArray(value) || value.length === 0) {
    return fallback
  }

  const mergedItems = [...fallback]

  await Promise.all(value.map(async (rawItem, index) => {
    if (!isRecord(rawItem)) {
      return
    }

    const fallbackItem = fallback[index]
    const baseItem: FeaturesItem = fallbackItem
      ? { ...fallbackItem }
      : { id: '', title: '', description: '', icon: '' }

    const mergedItem: FeaturesItem = {
      id: toText(rawItem.id, baseItem.id),
      title: toText(rawItem.title, baseItem.title),
      description: toText(rawItem.description, baseItem.description),
      icon: toText(rawItem.icon, baseItem.icon),
      image: toText(rawItem.image, baseItem.image || '') || undefined,
    }

    if (index < mergedItems.length) {
      mergedItems[index] = mergedItem
      return
    }

    mergedItems.push(mergedItem)
  }))

  return mergedItems
}

async function mergeSectionOne(
  apiContent: Record<string, unknown> | undefined,
): Promise<FeaturesSectionOneContent> {
  const fallback = featuresDefaults.sectionOne
  if (!apiContent) {
    return fallback
  }

  return {
    title: toText(apiContent.title, fallback.title),
    description: toText(apiContent.description, fallback.description),
    image: fallback.image
      ? await resolveImage(apiContent.image, fallback.image)
      : undefined,
    backgroundImage: fallback.backgroundImage
      ? await resolveImage(apiContent.backgroundImage, fallback.backgroundImage)
      : undefined,
  }
}

async function mergeSectionTwo(
  apiContent: Record<string, unknown> | undefined,
): Promise<FeaturesSectionTwoContent> {
  const fallback = featuresDefaults.sectionTwo
  if (!apiContent) {
    return fallback
  }

  return {
    title: toText(apiContent.title, fallback.title),
    description: toText(apiContent.description, fallback.description),
    items: await resolveItems(apiContent.items, fallback.items),
  }
}

async function mergeSectionThree(
  apiContent: Record<string, unknown> | undefined,
): Promise<FeaturesSectionThreeContent> {
  const fallback = featuresDefaults.sectionThree
  if (!apiContent) {
    return fallback
  }

  return {
    title: toText(apiContent.title, fallback.title),
    description: toText(apiContent.description, fallback.description),
    topFeatures: await resolveItems(apiContent.topFeatures, fallback.topFeatures),
    bottomFeatures: await resolveItems(apiContent.bottomFeatures, fallback.bottomFeatures),
  }
}

async function mergeSectionFour(
  apiContent: Record<string, unknown> | undefined,
): Promise<FeaturesSectionFourContent> {
  const fallback = featuresDefaults.sectionFour
  if (!apiContent) {
    return fallback
  }

  return {
    title: toText(apiContent.title, fallback.title),
    description: toText(apiContent.description, fallback.description),
    dashboardFeatures: await resolveItems(apiContent.dashboardFeatures, fallback.dashboardFeatures),
  }
}

async function loadFeaturesContent() {
  try {
    const pageResponse = await get<{ results: PageRecord[] }>('/pages', {
      query: {
        slug: 'features',
        limit: 1,
      },
    })

    const page = pageResponse.results?.[0]
    if (!page?.id) {
      sections.value = cloneDefaults()
      return
    }

    const sectionResponse = await get<{ results: SectionRecord[] }>('/page-sections', {
      query: {
        pageId: page.id,
        isEnabled: true,
        limit: 100,
      },
    })

    const sectionMap = new Map(
      (sectionResponse.results || []).map(section => [section.sectionKey, section.content]),
    )

    sections.value = {
      sectionOne: await mergeSectionOne(sectionMap.get(featuresSectionKeys.sectionOne)),
      sectionTwo: await mergeSectionTwo(sectionMap.get(featuresSectionKeys.sectionTwo)),
      sectionThree: await mergeSectionThree(sectionMap.get(featuresSectionKeys.sectionThree)),
      sectionFour: await mergeSectionFour(sectionMap.get(featuresSectionKeys.sectionFour)),
    }
  }
  catch {
    sections.value = cloneDefaults()
  }
}
</script>

<template>
  <LandingLayout>
    <main>
      <SectionOne :content="sections.sectionOne" />
      <SectionTwo :content="sections.sectionTwo" />
      <SectionThree :content="sections.sectionThree" />
      <SectionFour :content="sections.sectionFour" />
    </main>
  </LandingLayout>
</template>
