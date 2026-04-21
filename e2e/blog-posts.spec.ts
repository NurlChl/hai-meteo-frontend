import { expect, test } from '@playwright/test'

test.describe('Blog Posts Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/login')

    await page.waitForLoadState('networkidle')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'password123')
    await page.click('button[type="submit"]')
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()
  })

  test('should create a blog post with categories and tags', async ({ page }) => {
    page.on('response', async (response) => {
      if (!response.ok() && (response.url().includes('/blog-categories') || response.url().includes('/blog-tags'))) {
        console.error('FAILED REQUEST:', response.url(), response.status())
        console.error('RESPONSE:', await response.text())
      }
    })

    await page.goto('/admin/blog/categories')
    await page.locator('a[href="/admin/blog/categories/create"]').click()
    await page.waitForLoadState('networkidle')
    const timestamp = Date.now()
    const categoryName = `E2E Category ${timestamp}`
    const categorySlug = categoryName.toLowerCase().replace(/\s+/g, '-')
    await page.locator('#name').fill(categoryName)
    await page.locator('#slug').fill(categorySlug)
    await page.click('button[type="submit"]')
    await page.waitForURL(/\/admin\/blog\/categories$/, { timeout: 10000 })

    await page.goto('/admin/blog/tags')
    await page.locator('a[href="/admin/blog/tags/create"]').click()
    await page.waitForLoadState('networkidle')
    const tagName = `E2E Tag ${timestamp}`
    const tagSlug = tagName.toLowerCase().replace(/\s+/g, '-')
    await page.locator('#name').fill(tagName)
    await page.locator('#slug').fill(tagSlug)
    await page.click('button[type="submit"]')
    await page.waitForURL(/\/admin\/blog\/tags$/)

    await page.goto('/admin/blog')
    await expect(page.getByRole('heading', { name: 'Blog Posts' })).toBeVisible()

    const createBtn = page.locator('a[href="/admin/blog/create"]')
    await expect(createBtn).toBeVisible()
    await createBtn.click()
    await expect(page.getByRole('heading', { name: 'Create Post' })).toBeVisible()
    await page.waitForLoadState('networkidle')

    const postTitle = `E2E Test Post ${timestamp}`
    const postExcerpt = 'This is an E2E test post excerpt'
    const postContent = '# E2E Test Content\n\nThis is markdown content for testing.'
    const authorName = 'E2E Test Author'
    const publishedAt = new Date().toISOString().slice(0, 16)

    await page.fill('#title', postTitle)
    await page.fill('#excerpt', postExcerpt)
    await page.locator('#content').fill(postContent)
    await page.fill('#author', authorName)
    await page.fill('#publishedAt', publishedAt)

    const categoryCheckbox = page.locator(`label:has-text("${categoryName}") input[type="checkbox"]`)
    await expect(categoryCheckbox).toBeVisible()
    await categoryCheckbox.check()
    await expect(categoryCheckbox).toBeChecked()

    const tagCheckbox = page.locator(`label:has-text("${tagName}") input[type="checkbox"]`)
    await expect(tagCheckbox).toBeVisible()
    await tagCheckbox.check()
    await expect(tagCheckbox).toBeChecked()

    await page.click('button[type="submit"]')

    await expect(page).toHaveURL(/\/admin\/blog$/, { timeout: 5000 })
    await expect(page.getByRole('heading', { name: 'Blog Posts' })).toBeVisible()

    const row = page.getByRole('row', { name: new RegExp(postTitle) })
    await expect(row).toBeVisible()
  })

  test('should create, read, update, and delete a blog post', async ({ page }) => {
    await page.goto('/admin/blog')
    await expect(page.getByRole('heading', { name: 'Blog Posts' })).toBeVisible()

    const createBtn = page.locator('a[href="/admin/blog/create"]')
    await expect(createBtn).toBeVisible()
    await createBtn.click()
    await expect(page.getByRole('heading', { name: 'Create Post' })).toBeVisible()
    await page.waitForLoadState('networkidle')

    const timestamp = Date.now()
    const postTitle = `Test Post ${timestamp}`
    const postExcerpt = 'This is a test post excerpt'
    const postContent = '# Test Content\n\nThis is a test post.'
    const authorName = 'Test Author'
    const publishedAt = new Date().toISOString().slice(0, 16)

    await page.fill('#title', postTitle)
    await page.fill('#excerpt', postExcerpt)
    await page.locator('#content').fill(postContent)
    await page.fill('#author', authorName)
    await page.fill('#publishedAt', publishedAt)

    await page.click('button[type="submit"]')

    await expect(page).toHaveURL(/\/admin\/blog$/, { timeout: 10000 })
    await expect(page.getByRole('heading', { name: 'Blog Posts' })).toBeVisible()

    const row = page.getByRole('row', { name: new RegExp(postTitle) })
    await expect(row).toBeVisible()

    await row.getByRole('link', { name: 'Edit' }).click()

    await expect(page.getByRole('heading', { name: 'Edit Post' })).toBeVisible()
    await expect(page.locator('#title')).toHaveValue(postTitle)

    const updatedTitle = `${postTitle} Updated`
    await page.fill('#title', updatedTitle)
    await page.click('button[type="submit"]')

    await expect(page).toHaveURL(/\/admin\/blog$/)
    await expect(page.getByRole('heading', { name: 'Blog Posts' })).toBeVisible()
    await expect(page.getByRole('row', { name: new RegExp(updatedTitle) })).toBeVisible()

    const updatedRow = page.getByRole('row', { name: new RegExp(updatedTitle) })
    await updatedRow.getByRole('button', { name: 'Delete' }).click()

    await expect(page.getByRole('heading', { name: 'Delete Post' })).toBeVisible()
    await page.locator('button').filter({ hasText: /^Delete$/ }).last().click()

    await expect(updatedRow).not.toBeVisible({ timeout: 5000 })
  })

  test('should update blog post with multiple categories and tags', async ({ page }) => {
    const timestamp = Date.now()
    const category1 = `Category A ${timestamp}`
    const category2 = `Category B ${timestamp}`

    for (const categoryName of [category1, category2]) {
      await page.goto('/admin/blog/categories')
      await page.locator('a[href="/admin/blog/categories/create"]').click()
      await page.waitForLoadState('networkidle')
      const categorySlug = categoryName.toLowerCase().replace(/\s+/g, '-')
      await page.locator('#name').fill(categoryName)
      await page.locator('#slug').fill(categorySlug)
      await page.click('button[type="submit"]')
      await page.waitForURL(/\/admin\/blog\/categories$/)
    }

    const tag1 = `Tag A ${timestamp}`
    const tag2 = `Tag B ${timestamp}`

    for (const tagName of [tag1, tag2]) {
      await page.goto('/admin/blog/tags')
      await page.locator('a[href="/admin/blog/tags/create"]').click()
      await page.waitForLoadState('networkidle')
      const tagSlug = tagName.toLowerCase().replace(/\s+/g, '-')
      await page.locator('#name').fill(tagName)
      await page.locator('#slug').fill(tagSlug)
      await page.click('button[type="submit"]')
      await page.waitForURL(/\/admin\/blog\/tags$/)
    }

    await page.goto('/admin/blog')
    await page.locator('a[href="/admin/blog/create"]').click()
    await page.waitForLoadState('networkidle')

    const postTitle = `Multi Select Test ${timestamp}`
    const postExcerpt = 'Multi select test excerpt'
    const authorName = 'Test Author'
    const publishedAt = new Date().toISOString().slice(0, 16)

    await page.fill('#title', postTitle)
    await page.fill('#excerpt', postExcerpt)
    await page.locator('#content').fill('# Test content')
    await page.fill('#author', authorName)
    await page.fill('#publishedAt', publishedAt)

    await page.locator(`label:has-text("${category1}") input[type="checkbox"]`).check()
    await page.locator(`label:has-text("${category2}") input[type="checkbox"]`).check()

    await page.locator(`label:has-text("${tag1}") input[type="checkbox"]`).check()
    await page.locator(`label:has-text("${tag2}") input[type="checkbox"]`).check()

    await page.click('button[type="submit"]')
    await page.waitForURL(/\/admin\/blog$/)

    const row = page.getByRole('row', { name: new RegExp(postTitle) })
    await row.getByRole('link', { name: 'Edit' }).click()
    await page.waitForLoadState('networkidle')

    await expect(page.locator(`label:has-text("${category1}") input[type="checkbox"]`)).toBeChecked()
    await expect(page.locator(`label:has-text("${category2}") input[type="checkbox"]`)).toBeChecked()

    await expect(page.locator(`label:has-text("${tag1}") input[type="checkbox"]`)).toBeChecked()
    await expect(page.locator(`label:has-text("${tag2}") input[type="checkbox"]`)).toBeChecked()

    await page.locator(`label:has-text("${category2}") input[type="checkbox"]`).uncheck()
    await page.locator(`label:has-text("${tag2}") input[type="checkbox"]`).uncheck()

    await page.waitForTimeout(500)
    await page.click('button[type="submit"]')
    await page.waitForURL(/\/admin\/blog$/)

    await row.getByRole('link', { name: 'Edit' }).click()
    await page.waitForLoadState('networkidle')

    await expect(page.locator(`label:has-text("${category1}") input[type="checkbox"]`)).toBeChecked()
    await expect(page.locator(`label:has-text("${category2}") input[type="checkbox"]`)).not.toBeChecked()
    await expect(page.locator(`label:has-text("${tag1}") input[type="checkbox"]`)).toBeChecked()
    await expect(page.locator(`label:has-text("${tag2}") input[type="checkbox"]`)).not.toBeChecked()
  })

  test('should handle blog post status changes', async ({ page }) => {
    await page.goto('/admin/blog')
    await page.locator('a[href="/admin/blog/create"]').click()
    await page.waitForLoadState('networkidle')

    const timestamp = Date.now()
    const postTitle = `Status Test ${timestamp}`
    const postExcerpt = 'Status test excerpt'
    const authorName = 'Test Author'
    const publishedAt = new Date().toISOString().slice(0, 16)

    await page.fill('#title', postTitle)
    await page.fill('#excerpt', postExcerpt)
    await page.locator('#content').fill('# Status test content')
    await page.fill('#author', authorName)
    await page.fill('#publishedAt', publishedAt)

    await page.locator('#status').selectOption('published')

    await page.click('button[type="submit"]')
    await page.waitForURL(/\/admin\/blog$/)

    const row = page.getByRole('row', { name: new RegExp(postTitle) })
    await expect(row).toBeVisible()

    await expect(row.getByText('published', { exact: false })).toBeVisible()

    await row.getByRole('link', { name: 'Edit' }).click()
    await page.waitForLoadState('networkidle')

    await page.locator('#status').selectOption('draft')
    await page.click('button[type="submit"]')
    await page.waitForURL(/\/admin\/blog$/)
    await page.waitForLoadState('networkidle')

    const updatedRow = page.getByRole('row', { name: new RegExp(postTitle) })
    await expect(updatedRow).toBeVisible()
    await expect(updatedRow.getByText('draft', { exact: false })).toBeVisible()
  })

  test('should require mandatory fields when creating a post', async ({ page }) => {
    await page.goto('/admin/blog')
    await page.locator('a[href="/admin/blog/create"]').click()
    await page.waitForLoadState('networkidle')

    await page.click('button[type="submit"]')

    await expect(page.getByRole('heading', { name: 'Create Post' })).toBeVisible()

    const titleInput = page.locator('#title')
    await expect(titleInput).toHaveAttribute('required', '')
  })

  test('should display empty state when no categories or tags available', async ({ page }) => {
    await page.goto('/admin/blog/create')
    await page.waitForLoadState('networkidle')

    const categorySection = page.locator('label:has-text("Categories")').locator('..')
    const tagSection = page.locator('label:has-text("Tags")').locator('..')

    await expect(categorySection).toBeVisible()
    await expect(tagSection).toBeVisible()
  })
})
