import { expect, test } from '@playwright/test'

test.describe('Blog Categories Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/login')

    await page.waitForLoadState('networkidle')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'password123')
    await page.click('button[type="submit"]')
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()
  })

  test('should create, read, update, and delete a blog category', async ({ page }) => {
    await page.goto('/admin/blog/categories')
    await expect(page.getByRole('heading', { name: 'Blog Categories' })).toBeVisible()

    const createBtn = page.locator('a[href="/admin/blog/categories/create"]')
    await expect(createBtn).toBeVisible()
    await createBtn.click()
    await expect(page.getByRole('heading', { name: 'Create Blog Category' })).toBeVisible()
    await page.waitForLoadState('networkidle')

    const timestamp = Date.now()
    const categoryName = `Test Category ${timestamp}`
    const categorySlug = `test-category-${timestamp}`

    await page.fill('#name', categoryName)
    await expect(page.locator('#slug')).toHaveValue(categorySlug)

    await page.click('button[type="submit"]')

    await expect(page).toHaveURL(/\/admin\/blog\/categories$/, { timeout: 5000 })
    await expect(page.getByRole('heading', { name: 'Blog Categories' })).toBeVisible()

    const row = page.getByRole('row', { name: categoryName })
    await expect(row).toBeVisible()
    await expect(row).toContainText(categorySlug)

    await row.getByRole('link', { name: 'Edit' }).click()

    await expect(page.getByRole('heading', { name: 'Edit Blog Category' })).toBeVisible()
    await expect(page.locator('#name')).toHaveValue(categoryName)
    await expect(page.locator('#slug')).toHaveValue(categorySlug)

    const updatedName = `${categoryName} Updated`
    await page.fill('#name', updatedName)
    await page.click('button[type="submit"]')

    await expect(page).toHaveURL(/\/admin\/blog\/categories$/)
    await expect(page.getByRole('heading', { name: 'Blog Categories' })).toBeVisible()
    await expect(page.getByRole('row', { name: updatedName })).toBeVisible()

    const updatedRow = page.getByRole('row', { name: updatedName })
    await updatedRow.getByRole('button', { name: 'Delete' }).click()

    await expect(page.getByRole('heading', { name: 'Delete Category' })).toBeVisible()
    await page.locator('button').filter({ hasText: /^Delete$/ }).last().click()

    await expect(updatedRow).not.toBeVisible()
  })

  test('should search and filter blog categories', async ({ page }) => {
    await page.goto('/admin/blog/categories')
    await expect(page.getByRole('heading', { name: 'Blog Categories' })).toBeVisible()

    const timestamp = Date.now()
    const category1 = `Apple ${timestamp} 1`
    const category2 = `Banana ${timestamp} 2`

    for (const name of [category1, category2]) {
      await page.locator('a[href="/admin/blog/categories/create"]').click()
      await page.waitForLoadState('networkidle')
      await page.fill('#name', name)
      await expect(page.locator('#slug')).not.toHaveValue('')
      await page.click('button[type="submit"]')
      await page.waitForURL(/\/admin\/blog\/categories$/, { timeout: 10000 })
    }

    const searchInput = page.getByPlaceholder('Search...')
    await expect(searchInput).toBeVisible()

    await searchInput.fill('Apple')
    await page.waitForLoadState('networkidle')
    await expect(page.getByRole('row', { name: category1 })).toBeVisible()
    await expect(page.getByRole('row', { name: category2 })).not.toBeVisible()

    await searchInput.fill('Banana')
    await page.waitForLoadState('networkidle')
    await expect(page.getByRole('row', { name: category1 })).not.toBeVisible()
    await expect(page.getByRole('row', { name: category2 })).toBeVisible()

    await searchInput.fill('')
    await page.waitForLoadState('networkidle')
    await expect(page.getByRole('row', { name: category1 })).toBeVisible()
    await expect(page.getByRole('row', { name: category2 })).toBeVisible()
  })
})
