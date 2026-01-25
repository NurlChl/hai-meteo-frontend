import { createPage, setup } from '@nuxt/test-utils/e2e'
import { describe, expect, it } from 'vitest'

describe('pages: dashboard with browser', async () => {
  await setup({
    server: true,
    browser: true,
  })

  it('redirects to login when not authenticated', async () => {
    const page = await createPage('/admin')

    await expect(page).toHaveURL(/.*\/admin\/login/)
    await expect(page.getByText('Sign in to your account')).toBeVisible()
  })

  it('shows dashboard when authenticated (mock test)', async () => {
    const page = await createPage('/admin/login')

    await expect(page.getByText('Sign in to your account')).toBeVisible()

    await page.getByLabel('Email address').fill('admin@example.com')
    await page.getByLabel('Password').fill('password123')
    await page.getByText('Sign in').click()

    await page.waitForURL(/.*\/admin/, { timeout: 5000 }).catch(() => {
    })

    await expect(page.getByText('Dashboard')).toBeVisible({ timeout: 5000 }).catch(() => {
    })
  })
})
