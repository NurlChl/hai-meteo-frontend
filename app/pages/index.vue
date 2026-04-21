<script setup lang="ts">
import type { LandingSectionsData } from '~/data/landingDefaults'
import SectionFive from '~/components/landing/SectionFive.vue'
import SectionFour from '~/components/landing/SectionFour.vue'
import SectionOne from '~/components/landing/SectionOne.vue'
import SectionSeven from '~/components/landing/SectionSeven.vue'
import SectionSix from '~/components/landing/SectionSix.vue'
import SectionThree from '~/components/landing/SectionThree.vue'
import SectionTwo from '~/components/landing/SectionTwo.vue'
import { landingDefaults } from '~/data/landingDefaults'
import LandingLayout from '~/layouts/landing.vue'
import { buildLandingSections } from '~/utils/landingSections'

interface PageRecord {
  id: number
}

interface SectionRecord {
  sectionKey: string
  content: Record<string, unknown>
}

const { get } = useApi()
const { resolveMedia } = useSectionMedia()

const sections = ref<LandingSectionsData>(cloneDefaults())

definePageMeta({
  layout: false,
})

await loadLandingContent()

function cloneDefaults(): LandingSectionsData {
  return JSON.parse(JSON.stringify(landingDefaults))
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

    sections.value = await buildLandingSections({
      defaults: cloneDefaults(),
      sectionContent: Object.fromEntries((sectionResponse.results || []).map(section => [section.sectionKey, section.content])),
      resolveMedia,
    })
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
