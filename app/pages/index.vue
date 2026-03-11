<script setup lang="ts">
import type {
  LandingFaq,
  LandingFeature,
  LandingImage,
  LandingNews,
  LandingSectionFourContent,
  LandingSectionOneContent,
  LandingSectionsData,
  LandingSectionSevenContent,
  LandingSectionSixContent,
  LandingSectionThreeContent,
  LandingSectionTwoContent,
  LandingSolution,
  LandingTechnology,
} from '~/data/landingDefaults'
import SectionFive from '~/components/landing/SectionFive.vue'
import SectionFour from '~/components/landing/SectionFour.vue'
import SectionOne from '~/components/landing/SectionOne.vue'
import SectionSeven from '~/components/landing/SectionSeven.vue'
import SectionSix from '~/components/landing/SectionSix.vue'
import SectionThree from '~/components/landing/SectionThree.vue'
import SectionTwo from '~/components/landing/SectionTwo.vue'
import { landingDefaults, landingSectionKeys } from '~/data/landingDefaults'
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

const sections = ref<LandingSectionsData>(cloneDefaults())

definePageMeta({
  layout: false,
})

await loadLandingContent()

function cloneDefaults(): LandingSectionsData {
  return JSON.parse(JSON.stringify(landingDefaults))
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

async function resolveImage(value: unknown, fallback: LandingImage): Promise<LandingImage> {
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

async function resolveFeatures(value: unknown, fallback: LandingFeature[]): Promise<LandingFeature[]> {
  if (!Array.isArray(value) || value.length === 0) {
    return fallback
  }

  const mergedFeatures = [...fallback]

  await Promise.all(value.map(async (rawItem, index) => {
    if (!isRecord(rawItem)) {
      return
    }

    const fallbackItem = fallback[index]
    const baseItem: LandingFeature = fallbackItem
      ? { ...fallbackItem }
      : { title: '', description: '', icon: '' }

    const mergedItem: LandingFeature = {
      title: toText(rawItem.title, baseItem.title),
      description: toText(rawItem.description, baseItem.description),
      icon: toText(rawItem.icon, baseItem.icon),
    }

    if (index < mergedFeatures.length) {
      mergedFeatures[index] = mergedItem
      return
    }

    mergedFeatures.push(mergedItem)
  }))

  return mergedFeatures
}

async function resolveSolutions(value: unknown, fallback: LandingSolution[]): Promise<LandingSolution[]> {
  if (!Array.isArray(value) || value.length === 0) {
    return fallback
  }

  const mergedSolutions = [...fallback]

  await Promise.all(value.map(async (rawItem, index) => {
    if (!isRecord(rawItem)) {
      return
    }

    const fallbackItem = fallback[index]
    const baseItem: LandingSolution = fallbackItem
      ? { ...fallbackItem }
      : { id: '', title: '', description: '', image: { url: '', alt: '' }, video: undefined }

    const mergedItem: LandingSolution = {
      id: toText(rawItem.id, baseItem.id),
      title: toText(rawItem.title, baseItem.title),
      description: toText(rawItem.description, baseItem.description),
      image: baseItem.image,
      video: typeof rawItem.video === 'string' && rawItem.video.trim() ? rawItem.video : baseItem.video,
    }

    if (rawItem.image && baseItem.image) {
      mergedItem.image = await resolveImage(rawItem.image, baseItem.image)
    }

    if (index < mergedSolutions.length) {
      mergedSolutions[index] = mergedItem
      return
    }

    mergedSolutions.push(mergedItem)
  }))

  return mergedSolutions
}

async function resolveTechnologies(value: unknown, fallback: LandingTechnology[]): Promise<LandingTechnology[]> {
  if (!Array.isArray(value) || value.length === 0) {
    return fallback
  }

  const mergedTechnologies = [...fallback]

  await Promise.all(value.map(async (rawItem, index) => {
    if (!isRecord(rawItem)) {
      return
    }

    const fallbackItem = fallback[index]
    const baseItem: LandingTechnology = fallbackItem
      ? { ...fallbackItem }
      : { title: '', description: '', icon: '' }

    const mergedItem: LandingTechnology = {
      title: toText(rawItem.title, baseItem.title),
      description: toText(rawItem.description, baseItem.description),
      icon: toText(rawItem.icon, baseItem.icon),
    }

    if (index < mergedTechnologies.length) {
      mergedTechnologies[index] = mergedItem
      return
    }

    mergedTechnologies.push(mergedItem)
  }))

  return mergedTechnologies
}

async function resolveFaqs(value: unknown, fallback: LandingFaq[]): Promise<LandingFaq[]> {
  if (!Array.isArray(value) || value.length === 0) {
    return fallback
  }

  const mergedFaqs = [...fallback]

  await Promise.all(value.map(async (rawItem, index) => {
    if (!isRecord(rawItem)) {
      return
    }

    const fallbackItem = fallback[index]
    const baseItem: LandingFaq = fallbackItem
      ? { ...fallbackItem }
      : { question: '', answer: '' }

    const mergedItem: LandingFaq = {
      question: toText(rawItem.question, baseItem.question),
      answer: toText(rawItem.answer, baseItem.answer),
    }

    if (index < mergedFaqs.length) {
      mergedFaqs[index] = mergedItem
      return
    }

    mergedFaqs.push(mergedItem)
  }))

  return mergedFaqs
}

async function mergeSectionOne(
  apiContent: Record<string, unknown> | undefined,
): Promise<LandingSectionOneContent> {
  const fallback = landingDefaults.sectionOne
  if (!apiContent) {
    return fallback
  }

  return {
    title: toText(apiContent.title, fallback.title),
    description: toText(apiContent.description, fallback.description),
    backgroundImage: fallback.backgroundImage
      ? await resolveImage(apiContent.backgroundImage, fallback.backgroundImage)
      : undefined,
  }
}

async function mergeSectionTwo(
  apiContent: Record<string, unknown> | undefined,
): Promise<LandingSectionTwoContent> {
  const fallback = landingDefaults.sectionTwo
  if (!apiContent) {
    return fallback
  }

  return {
    title: toText(apiContent.title, fallback.title),
    description: toText(apiContent.description, fallback.description),
    features: await resolveFeatures(apiContent.features, fallback.features),
  }
}

async function mergeSectionThree(
  apiContent: Record<string, unknown> | undefined,
): Promise<LandingSectionThreeContent> {
  const fallback = landingDefaults.sectionThree
  if (!apiContent) {
    return fallback
  }

  return {
    title: toText(apiContent.title, fallback.title),
    description: toText(apiContent.description, fallback.description),
    solutions: await resolveSolutions(apiContent.solutions, fallback.solutions),
  }
}

async function mergeSectionFour(
  apiContent: Record<string, unknown> | undefined,
): Promise<LandingSectionFourContent> {
  const fallback = landingDefaults.sectionFour
  if (!apiContent) {
    return fallback
  }

  return {
    title: toText(apiContent.title, fallback.title),
    description: toText(apiContent.description, fallback.description),
    technologies: await resolveTechnologies(apiContent.technologies, fallback.technologies),
  }
}

async function mergeSectionFive(
  apiContent: Record<string, unknown> | undefined,
): Promise<LandingNews> {
  const fallback = landingDefaults.sectionFive
  if (!apiContent) {
    return fallback
  }

  return {
    title: toText(apiContent.title, fallback.title),
    date: toText(apiContent.date, fallback.date),
    description: toText(apiContent.description, fallback.description),
    image: await resolveImage(apiContent.image, fallback.image),
  }
}

async function mergeSectionSix(
  apiContent: Record<string, unknown> | undefined,
): Promise<LandingSectionSixContent> {
  const fallback = landingDefaults.sectionSix
  if (!apiContent) {
    return fallback
  }

  return {
    title: toText(apiContent.title, fallback.title),
    description: toText(apiContent.description, fallback.description),
    faqs: await resolveFaqs(apiContent.faqs, fallback.faqs),
  }
}

async function mergeSectionSeven(
  apiContent: Record<string, unknown> | undefined,
): Promise<LandingSectionSevenContent> {
  const fallback = landingDefaults.sectionSeven
  if (!apiContent) {
    return fallback
  }

  return {
    title: toText(apiContent.title, fallback.title),
    description: toText(apiContent.description, fallback.description),
    backgroundImage: fallback.backgroundImage
      ? await resolveImage(apiContent.backgroundImage, fallback.backgroundImage)
      : undefined,
  }
}

async function loadLandingContent() {
  try {
    const pageResponse = await get<{ results: PageRecord[] }>('/pages', {
      query: {
        slug: 'home',
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
      sectionOne: await mergeSectionOne(sectionMap.get(landingSectionKeys.sectionOne)),
      sectionTwo: await mergeSectionTwo(sectionMap.get(landingSectionKeys.sectionTwo)),
      sectionThree: await mergeSectionThree(sectionMap.get(landingSectionKeys.sectionThree)),
      sectionFour: await mergeSectionFour(sectionMap.get(landingSectionKeys.sectionFour)),
      sectionFive: await mergeSectionFive(sectionMap.get(landingSectionKeys.sectionFive)),
      sectionSix: await mergeSectionSix(sectionMap.get(landingSectionKeys.sectionSix)),
      sectionSeven: await mergeSectionSeven(sectionMap.get(landingSectionKeys.sectionSeven)),
    }
  }
  catch {
    sections.value = cloneDefaults()
  }
}
</script>

<template>
  <LandingLayout>
    <main class="bg-[#020515]">
      <SectionOne :content="sections.sectionOne" />
      <SectionTwo :content="sections.sectionTwo" />
      <SectionThree :content="sections.sectionThree" />
      <SectionFour :content="sections.sectionFour" />
      <SectionFive :content="sections.sectionFive" />
      <SectionSix :content="sections.sectionSix" />
      <SectionSeven :content="sections.sectionSeven" />
    </main>
  </LandingLayout>
</template>
