import { expect, test } from '@playwright/test'

test.describe('Blog Tags Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/login')

    await page.waitForLoadState('networkidle')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'password123')
    await page.click('button[type="submit"]')
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()
  })

  test('should create, read, update, and delete a blog tag', async ({ page }) => {
    await page.goto('/admin/blog/tags')
    await expect(page.getByRole('heading', { name: 'Blog Tags' })).toBeVisible()

    const createBtn = page.locator('a[href="/admin/blog/tags/create"]')
    await expect(createBtn).toBeVisible()
    await createBtn.click()
    await expect(page.getByRole('heading', { name: 'Create Blog Tag' })).toBeVisible()
    await page.waitForLoadState('networkidle')

    const timestamp = Date.now()
    const tagName = `Test Tag ${timestamp}`
    const tagSlug = `test-tag-${timestamp}`

    await page.fill('#name', tagName)
    await expect(page.locator('#slug')).toHaveValue(tagSlug)

    await page.click('button[type="submit"]')

    await expect(page).toHaveURL(/\/admin\/blog\/tags$/, { timeout: 5000 })
    await expect(page.getByRole('heading', { name: 'Blog Tags' })).toBeVisible()

    const row = page.getByRole('row', { name: tagName })
    await expect(row).toBeVisible()
    await expect(row).toContainText(tagSlug)

    await row.getByRole('link', { name: 'Edit' }).click()

    await expect(page.getByRole('heading', { name: 'Edit Blog Tag' })).toBeVisible()
    await expect(page.locator('#name')).toHaveValue(tagName)
    await expect(page.locator('#slug')).toHaveValue(tagSlug)

    const updatedName = `${tagName} Updated`
    await page.fill('#name', updatedName)
    await page.click('button[type="submit"]')

    await expect(page).toHaveURL(/\/admin\/blog\/tags$/)
    await expect(page.getByRole('heading', { name: 'Blog Tags' })).toBeVisible()
    await expect(page.getByRole('row', { name: updatedName })).toBeVisible()

    const updatedRow = page.getByRole('row', { name: updatedName })
    await updatedRow.getByRole('button', { name: 'Delete' }).click()

    await expect(page.getByRole('heading', { name: 'Delete Tag' })).toBeVisible()
    await page.locator('button').filter({ hasText: /^Delete$/ }).last().click()

    await expect(updatedRow).not.toBeVisible()
  })

  test('should search and filter blog tags', async ({ page }) => {
    await page.goto('/admin/blog/tags')
    await expect(page.getByRole('heading', { name: 'Blog Tags' })).toBeVisible()

    const timestamp = Date.now()
    const tag1 = `Apple ${timestamp} 1`
    const tag2 = `Banana ${timestamp} 2`

    for (const name of [tag1, tag2]) {
      await page.locator('a[href="/admin/blog/tags/create"]').click()
      await page.waitForLoadState('networkidle')
      await page.fill('#name', name)
      await expect(page.locator('#slug')).not.toHaveValue('')
      await page.click('button[type="submit"]')
      await page.waitForURL(/\/admin\/blog\/tags$/, { timeout: 10000 })
    }

    const searchInput = page.getByPlaceholder('Search...')
    await expect(searchInput).toBeVisible()

    await searchInput.fill('Apple')
    await page.waitForLoadState('networkidle')
    await expect(page.getByRole('row', { name: tag1 })).toBeVisible()
    await expect(page.getByRole('row', { name: tag2 })).not.toBeVisible()

    await searchInput.fill('Banana')
    await page.waitForLoadState('networkidle')
    await expect(page.getByRole('row', { name: tag1 })).not.toBeVisible()
    await expect(page.getByRole('row', { name: tag2 })).toBeVisible()

    await searchInput.fill('')
    await page.waitForLoadState('networkidle')
    await expect(page.getByRole('row', { name: tag1 })).toBeVisible()
    await expect(page.getByRole('row', { name: tag2 })).toBeVisible()
  })
})
