import { $fetch, setup } from '@nuxt/test-utils/e2e'
import { describe, expect, it } from 'vitest'

describe('pages: login', async () => {
  await setup({
    server: true,
  })

  it('renders the login page', async () => {
    const html = await $fetch('/admin/login')
    expect(html).toContain('Sign in to your account')
    expect(html).toContain('Email address')
    expect(html).toContain('Password')
  })

  it('has email and password input fields', async () => {
    const html = await $fetch('/admin/login')
    expect(html).toContain('id="email"')
    expect(html).toContain('id="password"')
  })
})
