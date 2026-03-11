<script setup lang="ts">
import type {
  TechnologyImage,
  TechnologyItem,
  TechnologySectionContent,
  TechnologySectionsData,
} from '~/data/technologyDefaults'
import SectionFour from '~/components/technology/SectionFour.vue'
import SectionOne from '~/components/technology/SectionOne.vue'
import SectionThree from '~/components/technology/SectionThree.vue'
import SectionTwo from '~/components/technology/SectionTwo.vue'
import { technologyDefaults, technologySectionKeys } from '~/data/technologyDefaults'
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

const sections = ref<TechnologySectionsData>(cloneDefaults())

definePageMeta({
  layout: false,
})

await loadTechnologyContent()

function cloneDefaults(): TechnologySectionsData {
  return JSON.parse(JSON.stringify(technologyDefaults))
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

async function resolveImage(value: unknown, fallback: TechnologyImage): Promise<TechnologyImage> {
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

async function resolveItems(value: unknown, fallback: TechnologyItem[]): Promise<TechnologyItem[]> {
  if (!Array.isArray(value) || value.length === 0) {
    return fallback
  }

  const mergedItems = [...fallback]

  await Promise.all(value.map(async (rawItem, index) => {
    if (!isRecord(rawItem)) {
      return
    }

    const fallbackItem = fallback[index]
    const baseItem: TechnologyItem = fallbackItem
      ? { ...fallbackItem }
      : { title: '', description: '', icon: '' }

    const mergedItem: TechnologyItem = {
      title: toText(rawItem.title, baseItem.title),
      description: toText(rawItem.description, baseItem.description),
      icon: toText(rawItem.icon, baseItem.icon),
      image: baseItem.image,
    }

    if (rawItem.image && baseItem.image) {
      mergedItem.image = await resolveImage(rawItem.image, baseItem.image)
    }

    if (index < mergedItems.length) {
      mergedItems[index] = mergedItem
      return
    }

    mergedItems.push(mergedItem)
  }))

  return mergedItems
}

async function mergeSectionContent(
  fallback: TechnologySectionContent,
  apiContent: Record<string, unknown> | undefined,
): Promise<TechnologySectionContent> {
  if (!apiContent) {
    return fallback
  }

  const merged: TechnologySectionContent = {
    title: toText(apiContent.title, fallback.title),
    description: toText(apiContent.description, fallback.description),
    image: await resolveImage(apiContent.image, fallback.image),
  }

  if (fallback.backgroundImage) {
    merged.backgroundImage = await resolveImage(apiContent.backgroundImage, fallback.backgroundImage)
  }

  if (fallback.items) {
    merged.items = await resolveItems(apiContent.items, fallback.items)
  }

  return merged
}

async function loadTechnologyContent() {
  try {
    const pageResponse = await get<{ results: PageRecord[] }>('/pages', {
      query: {
        slug: 'technology',
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
      sectionOne: await mergeSectionContent(
        technologyDefaults.sectionOne,
        sectionMap.get(technologySectionKeys.sectionOne),
      ),
      sectionTwo: await mergeSectionContent(
        technologyDefaults.sectionTwo,
        sectionMap.get(technologySectionKeys.sectionTwo),
      ),
      sectionThree: await mergeSectionContent(
        technologyDefaults.sectionThree,
        sectionMap.get(technologySectionKeys.sectionThree),
      ),
      sectionFour: await mergeSectionContent(
        technologyDefaults.sectionFour,
        sectionMap.get(technologySectionKeys.sectionFour),
      ),
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
