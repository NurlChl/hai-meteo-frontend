<script setup lang="ts">
import type { FeaturesSectionsData } from '~/data/featuresDefaults'
import SectionFour from '~/components/features/SectionFour.vue'
import SectionOne from '~/components/features/SectionOne.vue'
import SectionThree from '~/components/features/SectionThree.vue'
import SectionTwo from '~/components/features/SectionTwo.vue'
import { featuresDefaults } from '~/data/featuresDefaults'
import LandingLayout from '~/layouts/landing.vue'
import { buildFeaturesSections } from '~/utils/featuresSections'

interface PageRecord {
  id: number
}

interface SectionRecord {
  sectionKey: string
  content: Record<string, unknown>
}

const { get } = useApi()
const { resolveMedia } = useSectionMedia()

const sections = ref<FeaturesSectionsData>(cloneDefaults())
const hasSectionOne = computed(() =>
  Boolean(
    sections.value.sectionOne.title
    || sections.value.sectionOne.description
    || sections.value.sectionOne.backgroundImage?.url
    || sections.value.sectionOne.video,
  ),
)
const hasSectionTwo = computed(() =>
  Boolean(sections.value.sectionTwo.title || sections.value.sectionTwo.items.length),
)
const hasSectionThree = computed(() =>
  Boolean(
    sections.value.sectionThree.title
    || sections.value.sectionThree.topFeatures.length
    || sections.value.sectionThree.bottomFeatures.length,
  ),
)
const hasSectionFour = computed(() =>
  Boolean(sections.value.sectionFour.title || sections.value.sectionFour.dashboardFeatures.length),
)

definePageMeta({
  layout: false,
})

await loadFeaturesContent()

function cloneDefaults(): FeaturesSectionsData {
  return JSON.parse(JSON.stringify(featuresDefaults))
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

    sections.value = await buildFeaturesSections({
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
      <SectionOne v-if="hasSectionOne" :content="sections.sectionOne" />
      <SectionTwo v-if="hasSectionTwo" :content="sections.sectionTwo" />
      <SectionThree v-if="hasSectionThree" :content="sections.sectionThree" />
      <SectionFour v-if="hasSectionFour" :content="sections.sectionFour" />
    </main>
  </LandingLayout>
</template>
