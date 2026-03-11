import type { ModuleOptions as SafeRuntimeConfigOptions } from 'nuxt-safe-runtime-config'

declare module '@nuxt/schema' {
  interface NuxtConfig {
    safeRuntimeConfig?: SafeRuntimeConfigOptions
  }

  interface NuxtOptions {
    safeRuntimeConfig?: SafeRuntimeConfigOptions
  }
}

export {}
