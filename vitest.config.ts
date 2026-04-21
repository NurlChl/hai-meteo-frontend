import { fileURLToPath } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [vue()],
  test: {
    include: ['app/**/*.test.ts', 'app/**/*.spec.ts'],
    exclude: ['app/tests/e2e/**'],
    environment: 'happy-dom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        '.nuxt/',
        'app/app.vue',
        '**/*.d.ts',
        '**/*.config.*',
        '**/types/**',
        'app/tests/**',
      ],
    },
  },
  resolve: {
    alias: {
      '~': fileURLToPath(new URL('./app', import.meta.url)),
      '@': fileURLToPath(new URL('./app', import.meta.url)),
      '~~': fileURLToPath(new URL('./', import.meta.url)),
      '@@': fileURLToPath(new URL('./', import.meta.url)),
      'assets': fileURLToPath(new URL('./app/assets', import.meta.url)),
      'public': fileURLToPath(new URL('./public', import.meta.url)),
    },
  },
})
