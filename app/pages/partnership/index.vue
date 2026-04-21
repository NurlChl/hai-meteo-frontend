<script setup lang="ts">
import type { PartnershipSectionsData } from '~/data/partnershipDefaults'
import SectionOne from '~/components/partnership/SectionOne.vue'
import SectionThree from '~/components/partnership/SectionThree.vue'
import SectionTwo from '~/components/partnership/SectionTwo.vue'
import { partnershipDefaults } from '~/data/partnershipDefaults'
import LandingLayout from '~/layouts/landing.vue'
import { buildPartnershipSections } from '~/utils/partnershipSections'

interface PageRecord {
  id: number
}

interface SectionRecord {
  sectionKey: string
  content: Record<string, unknown>
}

const { get } = useApi()
const { resolveMedia } = useSectionMedia()
const route = useRoute()

const sections = ref<PartnershipSectionsData>(cloneDefaults())

definePageMeta({
  layout: false,
})

onMounted(() => {
  const emailFromQuery = route.query.email as string
  if (emailFromQuery) {
    sessionStorage.setItem('partnership_email', emailFromQuery)

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

    sections.value = await buildPartnershipSections({
      defaults: cloneDefaults(),
      sectionContent: Object.fromEntries((sectionResponse.results || []).map(section => [section.sectionKey, section.content])),
      resolveMedia,
    })
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
