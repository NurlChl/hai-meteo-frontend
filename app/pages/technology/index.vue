<script setup lang="ts">
import type { TechnologySectionsData } from '~/data/technologyDefaults'
import SectionFour from '~/components/technology/SectionFour.vue'
import SectionOne from '~/components/technology/SectionOne.vue'
import SectionThree from '~/components/technology/SectionThree.vue'
import SectionTwo from '~/components/technology/SectionTwo.vue'
import { technologyDefaults } from '~/data/technologyDefaults'
import LandingLayout from '~/layouts/landing.vue'
import { buildTechnologySections } from '~/utils/technologySections'

interface PageRecord {
  id: number
}

interface SectionRecord {
  sectionKey: string
  content: Record<string, unknown>
}

const { get } = useApi()
const { resolveMedia } = useSectionMedia()

const sections = ref<TechnologySectionsData>(cloneDefaults())

definePageMeta({
  layout: false,
})

await loadTechnologyContent()

function cloneDefaults(): TechnologySectionsData {
  return JSON.parse(JSON.stringify(technologyDefaults))
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

    sections.value = await buildTechnologySections({
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
    <main>
      <SectionOne :content="sections.sectionOne" />
      <SectionTwo :content="sections.sectionTwo" />
      <SectionThree :content="sections.sectionThree" />
      <SectionFour :content="sections.sectionFour" />
    </main>
  </LandingLayout>
</template>
