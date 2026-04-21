import process from 'node:process'
import { object, string } from 'valibot'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: ['@pinia/nuxt', '@vueuse/nuxt', '@nuxtjs/tailwindcss', '@nuxt/test-utils/module', 'nuxt-safe-runtime-config', '@nuxt/image'],

  app: {
    head: {
      title: 'Hai Meteo CMS',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap' },
      ],
    },
  },

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || process.env.API_BASE_URL || 'http://localhost:8000/v1',
      chatbotApiBase: process.env.NUXT_PUBLIC_CHATBOT_API_BASE || '',
      chatbotUsername: process.env.NUXT_PUBLIC_CHATBOT_USERNAME || '',
      chatbotPassword: process.env.NUXT_PUBLIC_CHATBOT_PASSWORD || '',
    },
  },

  safeRuntimeConfig: {
    $schema: object({
      public: object({
        apiBase: string(),
        chatbotApiBase: string(),
        chatbotUsername: string(),
        chatbotPassword: string(),
      }),
    }),
    validateAtRuntime: true,
  },

  typescript: {
    strict: true,
    typeCheck: true,
  },
})
