# Hai Meteo Frontend

Enterprise-level Nuxt.js frontend for Hai Meteo CMS.

## Features

- **Type-Safe**: Full TypeScript support with strict mode
- **Testable**: Vitest + Vue Test Utils setup
- **Scalable**: Modular architecture with composables, stores, and reusable components
- **Responsive**: Mobile-first Tailwind CSS design
- **State Management**: Pinia for complex state
- **API Integration**: Centralized, type-safe API calls with ofetch
- **Authentication**: JWT-based auth with protected routes
- **Error Handling**: Global error boundary, retry logic
- **Performance**: Code splitting, lazy loading, response caching

## Project Structure

```
app/
├── components/
│   ├── admin/                # Admin dashboard components
│   │   ├── DataTable.vue    # Reusable data table
│   │   ├── Modal.vue        # Modal component
│   │   ├── FormInput.vue    # Form input component
│   │   ├── StatusBadge.vue  # Status badge component
│   │   ├── Pagination.vue   # Pagination component
│   │   └── UploadZone.vue   # File upload zone
│   └── public/              # Public-facing components
├── composables/
│   ├── useApi.ts            # API client composable
│   ├── useAuth.ts           # Auth helpers
│   ├── useToast.ts          # Toast notifications
│   ├── useModal.ts          # Modal management
│   └── useTable.ts          # Reusable table logic
├── layouts/
│   ├── admin.vue            # Admin dashboard layout
│   └── default.vue          # Default layout
├── middleware/
│   ├── auth.ts              # Protected route guard
│   └── guest.ts             # Guest redirect guard
├── pages/
│   ├── admin/               # Admin pages
│   │   ├── index.vue        # Dashboard
│   │   ├── login.vue        # Login page
│   │   ├── blog/            # Blog management
│   │   │   ├── index.vue
│   │   │   ├── create.vue
│   │   │   └── [id].vue
│   │   ├── media/           # Media library
│   │   ├── pages/           # Pages management
│   │   ├── faqs/            # FAQ management
│   │   ├── navigation/      # Navigation management
│   │   └── messages/        # Contact messages
│   └── blog/                # Public blog pages (TODO)
├── server/                  # Server API proxies (optional)
├── stores/
│   ├── auth.ts              # Auth state
│   ├── ui.ts                # UI state
│   └── cache.ts             # Response caching
├── types/
│   ├── api.ts               # API request/response types
│   ├── models.ts            # Domain models
│   └── index.ts
├── utils/
│   └── api.ts               # API wrapper with interceptors
├── app.vue                  # Root component
└── assets/                  # Static assets
```

## Setup

### Prerequisites

- Node.js 18+
- npm, pnpm, or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Configuration

Create a `.env` file in the root directory:

```env
API_BASE_URL=http://localhost:3000/v1
```

## Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run format       # Format code with Prettier
npm run test         # Run tests
npm run test:coverage # Run tests with coverage
```

### Code Style

- **ESLint**: For linting
- **Prettier**: For code formatting
- **TypeScript**: Strict mode enabled

Run `npm run lint:fix` and `npm run format` before committing.

### Testing

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test -- --watch

# Run tests with coverage
npm run test:coverage
```

## API Integration

The frontend communicates with the backend through a centralized API layer:

### Using the API

```typescript
// Using the api utility directly
import { api } from '~/utils/api'

const posts = await api.get('/blog-posts')
const newPost = await api.post('/blog-posts', { title: '...' })
```

### Using the useApi composable

```typescript
const { get, post, loading, error } = useApi()

async function loadData() {
  const data = await get('/blog-posts')
  return data
}
```

### Authentication

```typescript
const { login, logout, isAuthenticated, user } = useAuth()

// Login
await login({ email: '...', password: '...' })

// Logout
await logout()

// Check auth status
if (isAuthenticated.value) {
  console.log(user.value)
}
```

## State Management

### Pinia Stores

```typescript
// Auth store
const authStore = useAuthStore()
authStore.setUser(user)
authStore.setToken(token)
authStore.logout()

// UI store
const uiStore = useUIStore()
uiStore.toggleSidebar()
uiStore.setTheme('dark')

// Cache store
const cacheStore = useCacheStore()
cacheStore.set('key', data, 60000)
const cached = cacheStore.get('key')
```

## Components

### DataTable

Reusable data table with sorting, filtering, and pagination:

```vue
<DataTable
  :columns="columns"
  :data="items"
  :loading="loading"
  :current-page="currentPage"
  :page-size="pageSize"
  :total="total"
  show-search
  @sort="handleSort"
  @search="handleSearch"
  @prev-page="prevPage"
  @next-page="nextPage"
>
  <template #cell-status="{ item }">
    <StatusBadge :status="item.status" />
  </template>
  <template #rowActions="{ item }">
    <button @click="edit(item)">Edit</button>
  </template>
</DataTable>
```

### Modal

```vue
<Modal v-model:is-open="isOpen" title="Confirm" @confirm="handleConfirm" @close="close">
  <p>Are you sure?</p>
</Modal>
```

### Form Components

```vue
<FormInput v-model="form.title" label="Title" required :error="errors.title" />
```

## Middleware

### Protect Routes

```typescript
definePageMeta({
  middleware: 'auth', // Requires authentication
  layout: 'admin',
})
```

### Guest Only Routes

```typescript
definePageMeta({
  middleware: 'guest', // Redirect if authenticated
  layout: 'default',
})
```

## Deployment

### Environment Variables

Ensure these are set in production:

```env
API_BASE_URL=https://your-api-domain.com/v1
```

### Build

```bash
npm run build
```

The `.output` directory contains the production build.

## Performance Optimization

- **Code Splitting**: Automatic with Nuxt
- **Lazy Loading**: Components loaded on demand
- **Response Caching**: Cache store for API responses
- **Image Optimization**: Use Nuxt Image (TODO)

## Security

- **Protected Routes**: Auth middleware
- **Token Management**: JWT with refresh support (TODO)
- **CSRF Protection**: Nuxt handles this automatically
- **Input Validation**: Zod for runtime validation (TODO)

## Next Steps

- [ ] Add Nuxt Image for optimization
- [ ] Implement token refresh logic
- [ ] Add Zod validation
- [ ] Set up E2E tests with Playwright
- [ ] Add SEO meta tags
- [ ] Implement public pages (Home, Features, Technology, Partnership, Blog)
- [ ] Add rich text editor for blog posts

## License

ISC
