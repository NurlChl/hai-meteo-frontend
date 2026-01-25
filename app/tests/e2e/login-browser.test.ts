import { createPage, setup } from '@nuxt/test-utils/e2e'
import { describe, expect, it } from 'vitest'

describe('pages: login with browser', async () => {
  await setup({
    server: true,
    browser: true,
  })

  it('can access login page and interact with form', async () => {
    const page = await createPage('/admin/login')

    await expect(page.getByText('Sign in to your account')).toBeVisible()
    await expect(page.getByLabel('Email address')).toBeVisible()
    await expect(page.getByLabel('Password')).toBeVisible()
  })
})
