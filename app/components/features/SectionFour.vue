<script setup lang="ts">
import type { FeaturesSectionFourContent } from '~/data/featuresDefaults'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'

interface Props {
  content: FeaturesSectionFourContent
}

const props = defineProps<Props>()

const activeIndex = ref(-1)
const isPaused = ref(false)
const currentSegment = ref(0)
const segmentFraction = ref(0)

const videoSources = [
  '/video/features/Analytic Data.mp4',
  '/video/features/Crop.mp4',
  '/video/features/Slider.mp4',
  '/video/features/Trend.mp4',
  '/video/features/Wind Animation.mp4',
]

const videoRefs = ref<HTMLVideoElement[]>([])

const activeVideoIndex = computed(() => {
  if (activeIndex.value >= 0) return activeIndex.value
  return currentSegment.value
})

watch(activeVideoIndex, (newIdx, oldIdx) => {
  if (oldIdx !== undefined && oldIdx !== newIdx && videoRefs.value[oldIdx]) {
    videoRefs.value[oldIdx].pause()
    videoRefs.value[oldIdx].currentTime = 0
  }
  if (videoRefs.value[newIdx]) {
    videoRefs.value[newIdx].play()
  }
})

let animationFrame: number | null = null
let lastTimestamp: number | null = null

const SEGMENT_DURATION = 3000
const nodeCount = props.content.dashboardFeatures.length
const segmentCount = nodeCount

function getNodeCalcPosition(index: number) {
  return `calc(${index} * (100% + 2rem) / 5)`
}

function getProgressWidth() {
  const seg = currentSegment.value
  const frac = segmentFraction.value

  if (seg < nodeCount - 1) {
    const progress = seg + frac
    return `calc(${progress} * (100% + 2rem) / 5)`
  }
  else {
    return `calc((4 * (100% + 2rem) + ${frac} * (100% - 8rem)) / 5)`
  }
}

function animate(timestamp: number) {
  if (!lastTimestamp)
    lastTimestamp = timestamp

  if (!isPaused.value) {
    const delta = timestamp - lastTimestamp
    segmentFraction.value += delta / SEGMENT_DURATION

    if (segmentFraction.value >= 1) {
      segmentFraction.value = 0
      currentSegment.value = (currentSegment.value + 1) % segmentCount
    }
  }

  lastTimestamp = timestamp
  animationFrame = requestAnimationFrame(animate)
}

function handleFeatureClick(index: number) {
  if (activeIndex.value === index) {
    activeIndex.value = -1
    isPaused.value = false
  }
  else {
    activeIndex.value = index
    isPaused.value = true
    if (index === 0) {
      currentSegment.value = 0
      segmentFraction.value = 0
    }
    else {
      currentSegment.value = index - 1
      segmentFraction.value = 1
    }
  }
}

onMounted(() => {
  animationFrame = requestAnimationFrame(animate)
})

onUnmounted(() => {
  if (animationFrame)
    cancelAnimationFrame(animationFrame)
})

function getIconPath(type: string) {
  switch (type) {
    case 'wind': return 'M4 17v2a2 2 0 102 2 2 2 0 00-2-2zm0-2h12a2 2 0 10-2-2 2 2 0 002 2 6 6 0 01-6 6H4a4 4 0 01-4-4 4 4 0 014-4zm-2-5a2 2 0 110-4h14a2 2 0 10-2-2 2 2 0 002 2 6 6 0 01-6 6H2z'
    case 'lightning-bolt': return 'M7 2v11h3v9l7-12h-4l4-8z'
    case 'adjustments': return 'M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z'
    case 'chart-pie': return 'M11 2v20c-5.07-.5-9-4.79-9-10s3.93-9.5 9-10zm2.03 0v8.99H22c-.47-4.74-4.24-8.52-8.97-8.99zm0 11.01V22c4.74-.47 8.5-4.25 8.97-8.99h-8.97z'
    case 'trending-up': return 'M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z'
    default: return ''
  }
}

function isNodeReached(index: number) {
  if (activeIndex.value === index)
    return true
  if (index === 0)
    return true
  return currentSegment.value >= index
    || (currentSegment.value === index - 1 && segmentFraction.value >= 1)
}
</script>

<template>
  <section class="py-16 md:py-24 lg:py-[140px] px-6 md:px-12 lg:px-[120px] bg-bg-primary text-white">
    <div class="mx-auto max-w-[1440px]">
      <div class="text-center mb-10 md:mb-12 lg:mb-16">
        <h2 class="text-3xl md:text-4xl lg:text-[40px] leading-tight lg:leading-[48px] font-medium">
          {{ content.title }}
        </h2>
      </div>

      <div class="relative w-full aspect-video bg-bg-secondary border border-white/5 rounded-2xl overflow-hidden mb-10 md:mb-12 lg:mb-16">
        <video
          v-for="(src, index) in videoSources"
          :key="src"
          :ref="(el) => { if (el) videoRefs[index] = el as HTMLVideoElement }"
          :src="src"
          class="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
          :class="activeVideoIndex === index ? 'opacity-100 z-10' : 'opacity-0 z-0'"
          muted
          loop
          playsinline
          @loadeddata="() => { if (index === 0) (videoRefs[0] as HTMLVideoElement)?.play() }"
        />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 md:gap-8">
        <div
          v-for="(feature, index) in content.dashboardFeatures"
          :key="index"
          class="flex flex-col cursor-pointer group/card"
          @click="handleFeatureClick(index)"
        >
          <div class="flex items-start gap-3 mb-4">
            <div class="w-10 h-10 min-w-[40px] bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-white/70">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path :d="getIconPath(feature.icon)" />
              </svg>
            </div>
            <h3
              class="text-sm font-semibold leading-tight whitespace-pre-line transition-colors" :class="[
                activeIndex === index ? 'text-white' : 'text-white/80',
              ]"
            >
              {{ feature.title }}
            </h3>
          </div>
          <p class="text-text-secondary text-xs leading-relaxed">
            {{ feature.description }}
          </p>
        </div>
      </div>

      <div class="hidden lg:block mt-10 md:mt-12 lg:mt-14 relative">
        <div class="absolute top-1/2 -translate-y-1/2 left-0 w-full h-[2px] bg-white/10" />
        <div
          class="absolute top-1/2 -translate-y-1/2 left-0 h-[2px] bg-gradient-to-r from-blue-500 to-blue-400"
          :style="{ width: getProgressWidth() }"
        />

        <div class="relative grid grid-cols-5 gap-6 md:gap-8">
          <div
            v-for="(feature, index) in content.dashboardFeatures"
            :key="`node-${index}`"
            class="flex items-center"
          >
            <div
              class="w-3 h-3 border-2 rounded-sm transition-all duration-300 cursor-pointer" :class="[
                isNodeReached(index)
                  ? 'bg-blue-500 border-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.5)]'
                  : 'bg-bg-primary border-white/20',
              ]"
              @click="handleFeatureClick(index)"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
