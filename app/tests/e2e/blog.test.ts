import { $fetch, setup } from '@nuxt/test-utils/e2e'
import { describe, expect, it } from 'vitest'

describe('pages: blog', async () => {
  await setup({
    server: true,
  })

  it('renders the blog index page', async () => {
    const html = await $fetch('/admin/blog')
    expect(html).toContain('Blog')
  })
})
