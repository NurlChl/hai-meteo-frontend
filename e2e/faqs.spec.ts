import { expect, test } from '@playwright/test'

test.describe('FAQs Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/login')

    await page.waitForLoadState('networkidle')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'password123')
    await page.click('button[type="submit"]')
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()
  })

  test('should create, read, and update a FAQ', async ({ page }) => {
    await page.goto('/admin/faqs')
    await expect(page.getByRole('heading', { name: 'FAQs' })).toBeVisible()

    const createBtn = page.locator('a[href="/admin/faqs/create"]')
    await expect(createBtn).toBeVisible()
    await createBtn.click()
    await expect(page.getByRole('heading', { name: 'Create FAQ' })).toBeVisible()
    await page.waitForLoadState('networkidle')

    const timestamp = Date.now()
    const question = `Test Question ${timestamp}`
    const answer = `Test Answer ${timestamp} **Markdown**`

    await page.fill('#question', question)
    await page.fill('#answerMd', answer)
    await page.fill('#sortOrder', '10')

    await page.selectOption('#isPublishedStatus', '1')

    await page.click('button[type="submit"]')

    await expect(page).toHaveURL(/\/admin\/faqs$/, { timeout: 5000 })
    await expect(page.getByRole('heading', { name: 'FAQs' })).toBeVisible()

    const row = page.getByRole('row', { name: question })
    await expect(row).toBeVisible()
    await expect(row).toContainText('Published')

    await row.getByRole('button', { name: 'Edit' }).click()

    await expect(page.getByRole('heading', { name: 'Edit FAQ' })).toBeVisible()

    await expect(page.locator('#question')).toHaveValue(question)

    const updatedQuestion = `${question} Updated`
    await page.fill('#question', updatedQuestion)
    await page.click('button[type="submit"]')

    await expect(page).toHaveURL(/\/admin\/faqs$/)
    await expect(page.getByRole('heading', { name: 'FAQs' })).toBeVisible()
    await expect(page.getByRole('row', { name: updatedQuestion })).toBeVisible()

    const oldRow = page.getByRole('row', { name: question, exact: true })
    await expect(oldRow).not.toBeVisible()

    const updatedRow = page.getByRole('row', { name: updatedQuestion })
    await updatedRow.getByRole('button', { name: 'Delete' }).click()

    await expect(page.getByRole('heading', { name: 'Delete FAQ' })).toBeVisible()
    await page.locator('button').filter({ hasText: /^Delete$/ }).last().click()

    await expect(updatedRow).not.toBeVisible()
  })
})
