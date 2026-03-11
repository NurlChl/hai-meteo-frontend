<script setup lang="ts">
import type { PartnershipSectionThreeContent } from '~/data/partnershipDefaults'

defineOptions({ name: 'PartnershipSectionThree' })

defineProps<{
  content: PartnershipSectionThreeContent
}>()

const { post } = useApi()
const toast = useToast()
const route = useRoute()

const form = ref({
  companyName: '',
  website: '',
  name: '',
  phone: '',
  email: '',
  message: '',
})

const countryCode = ref('ID')
const isSubmitting = ref(false)

// Auto-fill email from query or sessionStorage on mount and scroll if needed
onMounted(() => {
  const emailFromQuery = route.query.email as string
  const savedEmail = sessionStorage.getItem('partnership_email')
  
  if (emailFromQuery) {
    form.value.email = emailFromQuery
  } else if (savedEmail) {
    form.value.email = savedEmail
    sessionStorage.removeItem('partnership_email')
  }

  // Check if we need to scroll to this section (when coming from hash link)
  if (window.location.hash === '#contact-form') {
    setTimeout(() => {
      const contactForm = document.getElementById('contact-form')
      if (contactForm) {
        contactForm.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 200)
  }
})

async function submitForm() {
  if (!form.value.name || !form.value.email || !form.value.message) {
    toast.error('Please fill in all required fields')
    return
  }

  isSubmitting.value = true

  try {
    await post('/contact-messages', {
      name: form.value.name,
      email: form.value.email,
      company: form.value.companyName,
      subject: form.value.website ? `Partnership Inquiry - ${form.value.website}` : 'Partnership Inquiry',
      message: form.value.message,
    })

    toast.success('Thank you! Your message has been sent successfully.')

    // Reset form
    form.value = {
      companyName: '',
      website: '',
      name: '',
      phone: '',
      email: '',
      message: '',
    }
  }
  catch (error) {
    console.error('Failed to submit form:', error)
    toast.error('Failed to send message. Please try again later.')
  }
  finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <section id="contact-form" class="relative py-16 md:py-24 lg:py-32 px-6 md:px-12 lg:px-[120px] min-h-[700px] md:min-h-[800px] flex items-center bg-bg-primary overflow-hidden">
    <!-- Background Video -->
    <div class="absolute inset-0 z-0">
      <video autoplay loop muted playsinline class="w-full h-full object-cover opacity-50">
        <source src="/video/Slow Version Hero Meteo.mp4" type="video/mp4">
      </video>
    </div>

    <div class="absolute inset-0 bg-gradient-to-r from-bg-primary via-bg-primary/80 to-transparent z-0" />

    <div class="max-w-[1440px] mx-auto relative z-10 w-full">
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-12">
        <div class="w-full lg:w-1/3 text-center lg:text-left">
          <h2 class="text-3xl md:text-4xl lg:text-[56px] font-medium text-white leading-tight whitespace-pre-line">
            {{ content.title }}
          </h2>
        </div>

        <div class="w-full lg:w-[600px] bg-bg-primary/80 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-8 lg:p-10 shadow-2xl">
          <div class="mb-6 md:mb-8">
            <p class="text-white text-base md:text-lg">
              {{ content.description }}
            </p>
          </div>

          <form class="space-y-5" @submit.prevent="submitForm">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div class="space-y-1.5">
                <label class="text-sm text-gray-300 block">Company Name</label>
                <input v-model="form.companyName" type="text" placeholder="Your company" class="w-full h-12 px-4 bg-white rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500">
              </div>
              <div class="space-y-1.5">
                <label class="text-sm text-gray-300 block">Company Website</label>
                <input v-model="form.website" type="text" placeholder="HAI-Meteo.com" class="w-full h-12 px-4 bg-white rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500">
              </div>
            </div>

            <div class="space-y-1.5">
              <label class="text-sm text-gray-300 block">Name</label>
              <input v-model="form.name" type="text" placeholder="Your name" class="w-full h-12 px-4 bg-white rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>

            <div class="space-y-1.5">
              <label class="text-sm text-gray-300 block">Phone number</label>
              <div class="flex">
                <div class="h-12 px-2.5 md:px-3 bg-white border-r border-gray-200 rounded-l-lg flex items-center text-gray-500 min-w-[64px] md:min-w-[70px]">
                  <span class="text-sm">{{ countryCode }}</span>
                  <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
                <input v-model="form.phone" type="text" placeholder="+62 (851) 000-0000" class="flex-1 h-12 px-4 bg-white rounded-r-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500">
              </div>
            </div>

            <div class="space-y-1.5">
              <label class="text-sm text-gray-300 block">Email</label>
              <input v-model="form.email" type="email" placeholder="you@company.com" class="w-full h-12 px-4 bg-white rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>

            <div class="space-y-1.5">
              <label class="text-sm text-gray-300 block">How can we help?</label>
              <textarea v-model="form.message" rows="4" placeholder="Tell us a little about the project..." class="w-full p-4 bg-white rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
            </div>

            <button
              type="submit"
              :disabled="isSubmitting"
              class="w-full h-12 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors mt-2 flex items-center justify-center gap-2"
            >
              <svg v-if="isSubmitting" class="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              {{ isSubmitting ? 'Sending...' : content.submitText }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>
