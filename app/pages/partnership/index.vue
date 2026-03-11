<script setup lang="ts">
import type {
  PartnershipBenefitItem,
  PartnershipImage,
  PartnershipSectionOneContent,
  PartnershipSectionsData,
  PartnershipSectionThreeContent,
} from '~/data/partnershipDefaults'
import SectionOne from '~/components/partnership/SectionOne.vue'
import SectionThree from '~/components/partnership/SectionThree.vue'
import SectionTwo from '~/components/partnership/SectionTwo.vue'
import { partnershipDefaults, partnershipSectionKeys } from '~/data/partnershipDefaults'
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
const route = useRoute()

const sections = ref<PartnershipSectionsData>(cloneDefaults())

definePageMeta({
  layout: false,
})

// Auto-fill email from query parameter and scroll to contact form
onMounted(() => {
  const emailFromQuery = route.query.email as string
  if (emailFromQuery) {
    sessionStorage.setItem('partnership_email', emailFromQuery)

    // Scroll to contact form after a short delay to ensure content is rendered
    setTimeout(() => {
      const contactForm = document.getElementById('contact-form')
      if (contactForm) {
        contactForm.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 100)
  }
})

await loadPartnershipContent()

function cloneDefaults(): PartnershipSectionsData {
  return JSON.parse(JSON.stringify(partnershipDefaults))
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

async function resolveImage(value: unknown, fallback: PartnershipImage): Promise<PartnershipImage> {
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

function mergeItems(value: unknown, fallback: PartnershipBenefitItem[]): PartnershipBenefitItem[] {
  if (!Array.isArray(value) || value.length === 0) {
    return fallback
  }

  const merged = [...fallback]

  value.forEach((rawItem, index) => {
    if (!isRecord(rawItem)) {
      return
    }

    const base = fallback[index] || { title: '', description: '', icon: '' }
    const item: PartnershipBenefitItem = {
      title: toText(rawItem.title, base.title),
      description: toText(rawItem.description, base.description),
      icon: toText(rawItem.icon, base.icon),
    }

    if (index < merged.length) {
      merged[index] = item
      return
    }

    merged.push(item)
  })

  return merged
}

async function mergeSectionOne(
  apiContent: Record<string, unknown> | undefined,
): Promise<PartnershipSectionOneContent> {
  const fallback = partnershipDefaults.sectionOne
  if (!apiContent) {
    return fallback
  }

  return {
    title: toText(apiContent.title, fallback.title),
    description: toText(apiContent.description, fallback.description),
    image: await resolveImage(apiContent.image, fallback.image),
    backgroundImage: await resolveImage(apiContent.backgroundImage, fallback.backgroundImage),
    ctaText: toText(apiContent.ctaText, fallback.ctaText),
    ctaHref: toText(apiContent.ctaHref, fallback.ctaHref),
  }
}

async function mergeSectionThree(
  apiContent: Record<string, unknown> | undefined,
): Promise<PartnershipSectionThreeContent> {
  const fallback = partnershipDefaults.sectionThree
  if (!apiContent) {
    return fallback
  }

  return {
    title: toText(apiContent.title, fallback.title),
    description: toText(apiContent.description, fallback.description),
    backgroundImage: await resolveImage(apiContent.backgroundImage, fallback.backgroundImage),
    submitText: toText(apiContent.submitText, fallback.submitText),
  }
}

async function loadPartnershipContent() {
  try {
    const pageResponse = await get<{ results: PageRecord[] }>('/pages', {
      query: {
        slug: 'partnership',
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
      sectionOne: await mergeSectionOne(sectionMap.get(partnershipSectionKeys.sectionOne)),
      sectionTwo: {
        title: toText(sectionMap.get(partnershipSectionKeys.sectionTwo)?.title, partnershipDefaults.sectionTwo.title),
        description: toText(sectionMap.get(partnershipSectionKeys.sectionTwo)?.description, partnershipDefaults.sectionTwo.description),
        items: mergeItems(sectionMap.get(partnershipSectionKeys.sectionTwo)?.items, partnershipDefaults.sectionTwo.items),
      },
      sectionThree: await mergeSectionThree(sectionMap.get(partnershipSectionKeys.sectionThree)),
    }
  }
  catch {
    sections.value = cloneDefaults()
  }
}

useHead({
  title: 'Partnership | HAI-Meteo',
  meta: [
    { name: 'description', content: 'Partner with HAI-Meteo to leverage enterprise-grade weather intelligence for your business solutions. Enhance your product portfolio and establish market differentiation.' },
  ],
})
</script>

<template>
  <LandingLayout>
    <main>
      <SectionOne :content="sections.sectionOne" />
      <SectionTwo :content="sections.sectionTwo" />
      <SectionThree :content="sections.sectionThree" />
    </main>
  </LandingLayout>
</template>
