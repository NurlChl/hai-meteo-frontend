import { $fetch, setup } from '@nuxt/test-utils/e2e'
import { describe, expect, it } from 'vitest'

describe('pages: dashboard', async () => {
  await setup({
    server: true,
  })

  it('renders the dashboard page', async () => {
    const html = await $fetch('/admin')
    expect(html).toContain('Dashboard')
  })

  it('displays stats cards', async () => {
    const html = await $fetch('/admin')
    expect(html).toContain('Total Blog Posts')
    expect(html).toContain('Contact Messages')
    expect(html).toContain('Media Assets')
    expect(html).toContain('Pages')
  })
})
