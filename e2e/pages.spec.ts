import { expect, test } from '@playwright/test'

test.describe('Pages Management', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/admin/login')

        await page.waitForLoadState('networkidle')
        await page.fill('input[name="email"]', 'test@example.com')
        await page.fill('input[name="password"]', 'password123')
        await page.click('button[type="submit"]')
        await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()
    })

    test('should create, read, update, and delete a page', async ({ page }) => {
        await page.goto('/admin/pages')
        await expect(page.getByRole('heading', { name: 'Pages' })).toBeVisible()

        const createBtn = page.locator('a[href="/admin/pages/create"]')
        await expect(createBtn).toBeVisible()
        await createBtn.click()
        await expect(page.getByRole('heading', { name: 'Create Page' })).toBeVisible()
        await page.waitForLoadState('networkidle')

        const timestamp = Date.now()
        const pageTitle = `Test Page ${timestamp}`
        const pageSlug = `test-page-${timestamp}`

        await page.fill('#title', pageTitle)
        await expect(page.locator('#slug')).toHaveValue(pageSlug)
        await page.check('#isPublished')

        await page.click('button[type="submit"]')

        await expect(page).toHaveURL(/\/admin\/pages$/, { timeout: 10000 })
        await expect(page.getByRole('heading', { name: 'Pages' })).toBeVisible()

        const row = page.getByRole('row', { name: pageTitle })
        await expect(row).toBeVisible()
        await expect(row).toContainText(pageSlug)
        await expect(row).toContainText('Published')

        await row.getByRole('link', { name: 'Edit' }).click()

        await expect(page.getByRole('heading', { name: 'Edit Page' })).toBeVisible()
        await expect(page.locator('#title')).toHaveValue(pageTitle)
        await expect(page.locator('#slug')).toHaveValue(pageSlug)
        await expect(page.locator('#isPublished')).toBeChecked()

        const updatedTitle = `${pageTitle} Updated`
        await page.fill('#title', updatedTitle)
        await page.uncheck('#isPublished')
        await page.click('button[type="submit"]')

        await expect(page).toHaveURL(/\/admin\/pages$/)
        await expect(page.getByRole('heading', { name: 'Pages' })).toBeVisible()
        await expect(page.getByRole('row', { name: updatedTitle })).toBeVisible()

        const updatedRow = page.getByRole('row', { name: updatedTitle })
        await expect(updatedRow).toContainText('Draft')
        await updatedRow.getByRole('button', { name: 'Delete' }).click()

        await expect(page.getByRole('heading', { name: 'Delete Page' })).toBeVisible()
        await page.locator('button').filter({ hasText: /^Delete$/ }).last().click()

        await expect(updatedRow).not.toBeVisible()
    })

    test('should search and filter pages', async ({ page }) => {
        await page.goto('/admin/pages')
        await expect(page.getByRole('heading', { name: 'Pages' })).toBeVisible()

        const timestamp = Date.now()
        const page1 = `Apple ${timestamp} 1`
        const page2 = `Banana ${timestamp} 2`

        for (const name of [page1, page2]) {
            await page.locator('a[href="/admin/pages/create"]').click()
            await page.waitForLoadState('networkidle')
            await page.fill('#title', name)
            await expect(page.locator('#slug')).not.toHaveValue('')
            await page.click('button[type="submit"]')
            await page.waitForURL(/\/admin\/pages$/, { timeout: 10000 })
        }

        const searchInput = page.getByPlaceholder('Search...')
        await expect(searchInput).toBeVisible()

        await searchInput.fill('Apple')
        await page.waitForLoadState('networkidle')
        await expect(page.getByRole('row', { name: page1 })).toBeVisible()
        await expect(page.getByRole('row', { name: page2 })).not.toBeVisible()

        await searchInput.fill('Banana')
        await page.waitForLoadState('networkidle')
        await expect(page.getByRole('row', { name: page1 })).not.toBeVisible()
        await expect(page.getByRole('row', { name: page2 })).toBeVisible()

        await searchInput.fill('')
        await page.waitForLoadState('networkidle')
        await expect(page.getByRole('row', { name: page1 })).toBeVisible()
        await expect(page.getByRole('row', { name: page2 })).toBeVisible()
    })
})
