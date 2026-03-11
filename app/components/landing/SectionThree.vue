<script setup lang="ts">
import type { LandingSectionThreeContent, LandingSolution } from '~/data/landingDefaults'
import { computed, onMounted, onUnmounted, ref } from 'vue'

interface Props {
  content: LandingSectionThreeContent
}

const props = defineProps<Props>()

const activeSolutionIndex = ref(0)
const activeSolution = computed(() => props.content.solutions[activeSolutionIndex.value]!)
const isPaused = ref(false)
const segmentFraction = ref(0)

let animationFrame: number | null = null
let lastTimestamp: number | null = null

const SEGMENT_DURATION = 4000
const nodeCount = props.content.solutions.length

function animate(timestamp: number) {
  if (!lastTimestamp)
    lastTimestamp = timestamp

  if (!isPaused.value) {
    const delta = timestamp - lastTimestamp
    segmentFraction.value += delta / SEGMENT_DURATION

    if (segmentFraction.value >= 1) {
      segmentFraction.value = 0
      activeSolutionIndex.value = (activeSolutionIndex.value + 1) % nodeCount
    }
  }

  lastTimestamp = timestamp
  animationFrame = requestAnimationFrame(animate)
}

function handleSolutionClick(index: number) {
  if (activeSolutionIndex.value === index) {
    if (isPaused.value) {
      isPaused.value = false
    } else {
      isPaused.value = true
    }
  }
  else {
    activeSolutionIndex.value = index
    segmentFraction.value = 0
    isPaused.value = true
  }
}

onMounted(() => {
  animationFrame = requestAnimationFrame(animate)
})

onUnmounted(() => {
  if (animationFrame)
    cancelAnimationFrame(animationFrame)
})

const getTimelineHeight = computed(() => {
  const totalProgress = (activeSolutionIndex.value + segmentFraction.value) / nodeCount
  return `${totalProgress * 100}%`
})

const getStarPosition = computed(() => {
  const totalProgress = (activeSolutionIndex.value + segmentFraction.value) / nodeCount
  return `${totalProgress * 100}%`
})
</script>

<template>
  <section class="section-three relative py-24 md:py-52 px-6 md:px-28 overflow-hidden bg-[#020515] text-white">
    <div class="max-w-[1440px] mx-auto flex flex-col lg:flex-row justify-between items-center lg:items-end gap-10 md:gap-16 relative z-10">
      <!-- Left Content -->
      <div class="lg:w-auto flex flex-col justify-start items-start gap-14">
        <!-- Header -->
        <div class="w-full max-w-[549px] flex flex-col justify-center items-start gap-6">
          <div class="rounded-[50px] inline-flex justify-start items-center">
            <h2 class="text-blue-500 text-2xl font-semibold font-['Inter'] leading-8">
              {{ content.description }}
            </h2>
          </div>
          <h3 class="self-stretch text-white text-3xl md:text-4xl font-medium font-['Inter'] leading-tight md:leading-[48px] whitespace-pre-line">
            {{ content.title }}
          </h3>
        </div>

        <!-- Timeline + Solutions -->
        <div class="self-stretch flex justify-start items-start gap-6">
          <!-- Timeline Bar -->
          <div class="w-10 h-[460px] relative hidden md:block flex-shrink-0">
            <!-- Full track -->
            <div class="absolute left-[19px] top-0 w-0 h-full border-l-2 border-gray-600" />
            <!-- Active segment with glow -->
            <!-- Active segment container (masked) -->
            <div
              class="absolute top-0 left-0 w-full overflow-hidden"
              :style="{ height: getTimelineHeight }"
            >
              <!-- Glow Layer -->
              <div
                class="absolute left-[17px] top-0 w-[6px] h-[460px] blur-[6px]"
                style="background: linear-gradient(180deg, #3B82F6 0%, #A855F7 50%, #F97316 100%); opacity: 0.8;"
              />
              <!-- Line Layer -->
              <div
                class="absolute left-[19px] top-0 w-[2px] h-[460px]"
                style="background: linear-gradient(180deg, #3B82F6 0%, #A855F7 50%, #F97316 100%);"
              />
            </div>
            <!-- Star indicator -->
            <div
              class="absolute left-0 w-10 h-10 flex items-center justify-center -translate-y-1/2"
              :style="{ top: getStarPosition }"
            >
              <img src="/images/landing/star.svg" alt="star" class="w-40 h-40">
            </div>
          </div>

          <!-- Solution Items -->
          <div class="flex-1 max-w-[486px] flex flex-col justify-start items-start gap-10">
            <div
              v-for="(solution, index) in content.solutions"
              :key="solution.id"
              class="w-full pl-0 md:pl-4 flex flex-col justify-center items-start gap-2 cursor-pointer transition-all duration-500 ease-in-out"
              :class="{ 
                'opacity-100 translate-x-4': activeSolutionIndex === index, 
                'opacity-40 hover:opacity-70': activeSolutionIndex !== index 
              }"
              @click="handleSolutionClick(index)"
            >
              <h4 class="text-2xl md:text-4xl font-semibold font-['Inter'] leading-tight md:leading-[48px]">
                {{ solution.title }}
              </h4>
              <p
                class="self-stretch text-xl font-normal font-['Inter'] leading-8"
                :class="activeSolution.id === solution.id ? 'text-gray-300' : 'text-gray-400'"
              >
                {{ solution.description }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Image -->
      <div class="w-full lg:w-[612px] flex-shrink-0 relative">
        <!-- Background Glow -->
        <div class="absolute w-[601px] h-96 left-1/2 -top-20 -translate-x-1/2 bg-[radial-gradient(ellipse_55.05%_55.05%_at_50.00%_50.00%,_rgba(0,_42,_254,_0)_0%,_rgba(0,_42,_254,_0.5)_100%)] rounded-full blur-3xl pointer-events-none -z-10" />
        <div class="relative w-full aspect-[612/585] rounded-3xl overflow-hidden">
          <video
            :key="activeSolution.video"
            :src="activeSolution.video"
            autoplay
            loop
            muted
            playsinline
            class="w-full h-full object-cover rounded-3xl border border-white/10"
          ></video>
          <!-- Fallback placeholder -->
          <div class="absolute inset-0 flex items-center justify-center bg-gray-800 rounded-3xl border border-white/10 -z-10">
            <span class="text-xl text-gray-600">{{ activeSolution.title }}</span>
          </div>
          <!-- Gradient Overlay from bottom -->
          <div class="absolute inset-0 bg-gradient-to-b from-[#020515]/0 to-[#020515] pointer-events-none" />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.section-three {
  font-family: 'Inter', sans-serif;
}
</style>
