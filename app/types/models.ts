export interface AdminUser {
  id: number
  name: string
  email: string
  isActive: boolean
  lastLoginAt: string | null
  createdAt: string
  updatedAt: string
}

export interface AuthTokens {
  access: {
    token: string
    expires: string
  }
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
}

export interface MediaAsset {
  id: number
  fileUrl: string
  altText: string | null
  mimeType: string | null
  width: number | null
  height: number | null
  createdAt: string
}

export interface Page {
  id: number
  slug: string
  title: string | null
  metaTitle: string | null
  metaDesc: string | null
  isPublished: boolean
  createdAt: string
  updatedAt: string
}

export interface PageSection {
  id: number
  pageId: number
  sectionKey: string
  sortOrder: number
  content: Record<string, unknown>
  isEnabled: boolean
  createdAt: string
  updatedAt: string
}

export type BlogPostStatus = 'draft' | 'published' | 'archived'

export interface BlogPost {
  id: number
  slug: string
  title: string
  excerpt: string | null
  contentMd: string
  coverMediaId: number | null
  authorName: string | null
  status: BlogPostStatus
  publishedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface BlogCategory {
  id: number
  name: string
  slug: string
}

export interface BlogTag {
  id: number
  name: string
  slug: string
}

export interface FAQ {
  id: number
  question: string
  answerMd: string
  sortOrder: number
  isPublished: boolean
  createdAt: string
  updatedAt: string
}

export interface NavigationItem {
  id: number
  location: string
  label: string
  href: string
  iconMediaId: number | null
  sortOrder: number
  isEnabled: boolean
  createdAt: string
  updatedAt: string
}

export type ContactMessageStatus = 'new' | 'in_progress' | 'done' | 'spam'

export interface ContactMessage {
  id: number
  name: string
  email: string
  company: string | null
  subject: string | null
  message: string
  status: ContactMessageStatus
  createdAt: string
}

export interface ChatQuestion {
  id: number
  question: string
  sortOrder: number
  isEnabled: boolean
  createdAt: string
  updatedAt: string
}
