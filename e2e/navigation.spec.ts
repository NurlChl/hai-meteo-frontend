import { expect, test } from '@playwright/test'

test.describe('Navigation Items Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/login')

    await page.waitForLoadState('networkidle')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'password123')
    await page.click('button[type="submit"]')
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()
  })

  test('should create, read, update, and delete a navigation item', async ({ page }) => {
    await page.goto('/admin/navigation')
    await expect(page.getByRole('heading', { name: 'Navigation Items' })).toBeVisible()

    const createBtn = page.locator('a[href="/admin/navigation/create"]')
    await expect(createBtn).toBeVisible()
    await createBtn.click()
    await expect(page.getByRole('heading', { name: 'Add Navigation Item' })).toBeVisible()
    await page.waitForLoadState('networkidle')

    const timestamp = Date.now()
    const navLabel = `Test Nav ${timestamp}`
    const navHref = `/test-${timestamp}`

    await page.fill('#label', navLabel)
    await page.fill('#href', navHref)
    await page.selectOption('#location', 'footer')
    await page.fill('#sortOrder', '5')
    await page.check('#isEnabled')

    await page.click('button[type="submit"]')

    await expect(page).toHaveURL(/\/admin\/navigation$/, { timeout: 10000 })
    await expect(page.getByRole('heading', { name: 'Navigation Items' })).toBeVisible()

    const row = page.getByRole('row', { name: navLabel })
    await expect(row).toBeVisible()
    await expect(row).toContainText(navHref)
    await expect(row).toContainText('footer')
    await expect(row).toContainText('Enabled')

    await row.getByRole('link', { name: 'Edit' }).click()

    await expect(page.getByRole('heading', { name: 'Edit Navigation Item' })).toBeVisible()
    await expect(page.locator('#label')).toHaveValue(navLabel)
    await expect(page.locator('#href')).toHaveValue(navHref)
    await expect(page.locator('#location')).toHaveValue('footer')
    await expect(page.locator('#isEnabled')).toBeChecked()

    const updatedLabel = `${navLabel} Updated`
    await page.fill('#label', updatedLabel)
    await page.uncheck('#isEnabled')
    await page.click('button[type="submit"]')

    await expect(page).toHaveURL(/\/admin\/navigation$/)
    await expect(page.getByRole('heading', { name: 'Navigation Items' })).toBeVisible()
    await expect(page.getByRole('row', { name: updatedLabel })).toBeVisible()

    const updatedRow = page.getByRole('row', { name: updatedLabel })
    await expect(updatedRow).toContainText('Disabled')
    await updatedRow.getByRole('button', { name: 'Delete' }).click()

    await expect(page.getByRole('heading', { name: 'Delete Item' })).toBeVisible()
    await page.locator('button').filter({ hasText: /^Delete$/ }).last().click()

    await expect(updatedRow).not.toBeVisible()
  })

  test('should search and filter navigation items', async ({ page }) => {
    await page.goto('/admin/navigation')
    await expect(page.getByRole('heading', { name: 'Navigation Items' })).toBeVisible()

    const timestamp = Date.now()
    const nav1 = `Apple ${timestamp} 1`
    const nav2 = `Banana ${timestamp} 2`

    for (const name of [nav1, nav2]) {
      await page.locator('a[href="/admin/navigation/create"]').click()
      await page.waitForLoadState('networkidle')
      await page.fill('#label', name)
      await page.fill('#href', `/test-${timestamp}`)
      await page.click('button[type="submit"]')
      await page.waitForURL(/\/admin\/navigation$/, { timeout: 10000 })
    }

    const searchInput = page.getByPlaceholder('Search...')
    await expect(searchInput).toBeVisible()

    await searchInput.fill('Apple')
    await page.waitForLoadState('networkidle')
    await expect(page.getByRole('row', { name: nav1 })).toBeVisible()
    await expect(page.getByRole('row', { name: nav2 })).not.toBeVisible()

    await searchInput.fill('Banana')
    await page.waitForLoadState('networkidle')
    await expect(page.getByRole('row', { name: nav1 })).not.toBeVisible()
    await expect(page.getByRole('row', { name: nav2 })).toBeVisible()

    await searchInput.fill('')
    await page.waitForLoadState('networkidle')
    await expect(page.getByRole('row', { name: nav1 })).toBeVisible()
    await expect(page.getByRole('row', { name: nav2 })).toBeVisible()
  })
})
