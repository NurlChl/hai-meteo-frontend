import { expect, test } from '@playwright/test'

test('login page interaction', async ({ page }) => {
  await page.goto('/admin/login')
  await page.waitForLoadState('networkidle')

  await expect(page.getByRole('heading', { name: 'Sign in to your account' })).toBeVisible()

  await page.fill('input[name="email"]', 'test@example.com')
  await page.fill('input[name="password"]', 'password123')

  await page.click('button[type="submit"]')

  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()

  await page.waitForTimeout(2000)
})
