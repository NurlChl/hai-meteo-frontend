<script setup lang="ts">
interface TocItem {
  id: string
  text: string
  level: number
}

interface Props {
  contentMd: string
}

defineOptions({ name: 'BlogDetailContent' })

const props = defineProps<Props>()

const activeHeadingId = ref('')
const contentRef = ref<HTMLElement | null>(null)

/**
 * Process the HTML content:
 * - Inject IDs on headings so the TOC can link to them.
 *
 * The `contentMd` field actually stores HTML from the Tiptap WYSIWYG editor,
 * despite its name. We process it directly as HTML.
 */
const renderedHtml = computed(() => {
  if (!props.contentMd) return ''

  // Inject IDs into heading tags for TOC anchoring
  return props.contentMd.replace(
    /<h([1-3])([^>]*)>(.*?)<\/h[1-3]>/gi,
    (_match, level, attrs, text) => {
      const plainText = text.replace(/<[^>]*>/g, '').trim()
      const id = plainText
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
      return `<h${level}${attrs} id="${id}">${text}</h${level}>`
    },
  )
})

/**
 * Extract headings from the HTML content to build a table of contents.
 */
const tocItems = computed<TocItem[]>(() => {
  if (!props.contentMd) return []

  const headingRegex = /<h([1-3])[^>]*>(.*?)<\/h[1-3]>/gi
  const items: TocItem[] = []
  let match: RegExpExecArray | null = headingRegex.exec(props.contentMd)

  while (match !== null) {
    const level = Number(match[1] ?? '2')
    const rawText = match[2] ?? ''
    // Strip inner HTML tags to get plain text
    const text = rawText.replace(/<[^>]*>/g, '').trim()
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()

    if (text) {
      items.push({ id, text, level })
    }
    match = headingRegex.exec(props.contentMd)
  }

  return items
})

/**
 * Set up IntersectionObserver to track which heading is currently active
 * for the table of contents highlighting.
 */
onMounted(() => {
  if (!contentRef.value) return

  const headings = contentRef.value.querySelectorAll('h1, h2, h3')
  if (headings.length === 0) return

  // Set the first heading as active by default
  const firstId = headings[0]?.getAttribute('id')
  if (firstId) activeHeadingId.value = firstId

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          activeHeadingId.value = entry.target.id
        }
      }
    },
    {
      rootMargin: '-80px 0px -70% 0px',
      threshold: 0,
    },
  )

  headings.forEach(heading => observer.observe(heading))

  onUnmounted(() => observer.disconnect())
})

function scrollToHeading(id: string) {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}
</script>

<template>
  <section class="bg-bg-primary min-h-screen">
    <div class="mx-auto max-w-[1440px] px-6 md:px-12 lg:px-[120px] py-12 md:py-16 lg:py-20">
      <div class="flex flex-col lg:flex-row gap-10 lg:gap-16">
        <!-- Left Sidebar -->
        <aside class="lg:w-[220px] lg:shrink-0">
          <div class="lg:sticky lg:top-24 flex flex-col gap-6">
            <!-- Back link -->
            <NuxtLink
              to="/blog"
              class="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-white transition-colors group"
            >
              <svg class="w-4 h-4 transition-transform group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
              Back to Articles
            </NuxtLink>

            <!-- Table of Contents -->
            <div v-if="tocItems.length > 0">
              <div class="flex items-center gap-2 text-sm text-white/60 mb-4">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
                </svg>
                On this page
              </div>

              <nav class="flex flex-col gap-1">
                <button
                  v-for="item in tocItems"
                  :key="item.id"
                  class="text-left text-sm leading-snug py-1.5 border-l-2 transition-all duration-200"
                  :class="[
                    activeHeadingId === item.id
                      ? 'border-blue-400 text-white pl-3'
                      : 'border-white/10 text-text-secondary hover:text-white hover:border-white/30 pl-3',
                    item.level === 3 ? 'pl-5' : '',
                  ]"
                  @click="scrollToHeading(item.id)"
                >
                  {{ item.text }}
                </button>
              </nav>
            </div>
          </div>
        </aside>

        <!-- Right: Main Content -->
        <article
          ref="contentRef"
          class="flex-1 min-w-0 blog-prose"
          v-html="renderedHtml"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Prose styling for rendered HTML content */
.blog-prose :deep(h1) {
  font-size: 2rem;
  font-weight: 700;
  color: white;
  margin-top: 2.5rem;
  margin-bottom: 1rem;
  line-height: 1.3;
  letter-spacing: -0.3px;
}

.blog-prose :deep(h2) {
  font-size: 1.5rem;
  font-weight: 600;
  color: white;
  margin-top: 2rem;
  margin-bottom: 0.75rem;
  line-height: 1.35;
}

.blog-prose :deep(h3) {
  font-size: 1.25rem;
  font-weight: 600;
  color: white;
  margin-top: 1.75rem;
  margin-bottom: 0.5rem;
  line-height: 1.4;
}

.blog-prose :deep(h4) {
  font-size: 1.1rem;
  font-weight: 600;
  color: white;
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
  line-height: 1.4;
}

.blog-prose :deep(p) {
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.8;
  margin-bottom: 1.25rem;
  font-size: 0.9375rem;
}

.blog-prose :deep(ul),
.blog-prose :deep(ol) {
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 1.25rem;
  padding-left: 1.5rem;
  line-height: 1.8;
}

.blog-prose :deep(ul) {
  list-style-type: disc;
}

.blog-prose :deep(ol) {
  list-style-type: decimal;
}

.blog-prose :deep(li) {
  margin-bottom: 0.5rem;
}

.blog-prose :deep(blockquote) {
  border-left: 3px solid rgba(96, 165, 250, 0.5);
  padding-left: 1rem;
  margin: 1.5rem 0;
  color: rgba(255, 255, 255, 0.6);
  font-style: italic;
}

.blog-prose :deep(code) {
  background: rgba(255, 255, 255, 0.06);
  color: #93c5fd;
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
  font-size: 0.875rem;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
}

.blog-prose :deep(pre) {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  padding: 1rem 1.25rem;
  margin: 1.5rem 0;
  overflow-x: auto;
}

.blog-prose :deep(pre code) {
  background: transparent;
  padding: 0;
  color: rgba(255, 255, 255, 0.8);
}

.blog-prose :deep(a) {
  color: #60a5fa;
  text-decoration: underline;
  text-underline-offset: 2px;
  transition: color 0.2s;
}

.blog-prose :deep(a:hover) {
  color: #93c5fd;
}

.blog-prose :deep(img) {
  max-width: 100%;
  border-radius: 12px;
  margin: 1.5rem 0;
}

.blog-prose :deep(hr) {
  border: none;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  margin: 2rem 0;
}

.blog-prose :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 1.5rem 0;
}

.blog-prose :deep(th),
.blog-prose :deep(td) {
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 0.6rem 1rem;
  text-align: left;
  color: rgba(255, 255, 255, 0.7);
}

.blog-prose :deep(th) {
  background: rgba(255, 255, 255, 0.04);
  font-weight: 600;
  color: white;
}

.blog-prose :deep(strong) {
  color: white;
  font-weight: 600;
}

.blog-prose :deep(em) {
  font-style: italic;
}

/* First child heading should have no top margin */
.blog-prose :deep(> :first-child) {
  margin-top: 0;
}
</style>
