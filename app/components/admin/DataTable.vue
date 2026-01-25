<script setup lang="ts" generic="T extends Record<string, any>">
import BaseButton from '~/components/base/Button.vue'
import BaseInput from '~/components/base/Input.vue'

interface Column {
  key: string
  label: string
}

interface Props<T> {
  columns: Column[]
  data: T[]
  title?: string
  loading?: boolean
  sortKey?: string
  sortOrder?: 'asc' | 'desc'
  currentPage?: number
  pageSize?: number
  total?: number
  showSearch?: boolean
  showRefresh?: boolean
  showPagination?: boolean
  searchQuery?: string
}

const props = withDefaults(defineProps<Props<T>>(), {
  title: '',
  loading: false,
  sortKey: '',
  sortOrder: 'asc',
  currentPage: 1,
  pageSize: 10,
  total: 0,
  showSearch: false,
  showRefresh: false,
  showPagination: true,
  searchQuery: '',
})

const emit = defineEmits<{
  sort: [key: string]
  search: [query: string]
  refresh: []
  prevPage: []
  nextPage: []
}>()

const searchQuery = ref(props.searchQuery)

const totalPages = computed(() => Math.ceil(props.total / props.pageSize))

function getItemKey(item: T) {
  const itemRecord = item as Record<string, unknown>
  return (itemRecord.id as string | number) || JSON.stringify(item)
}

function getItemValue(item: T, key: string): any {
  const keys = key.split('.')
  let value: any = item
  for (const k of keys) {
    value = value?.[k]
  }
  return value
}

function handleSort(key: string) {
  emit('sort', key)
}

watchDebounced(searchQuery, (query) => {
  emit('search', query || '')
}, { debounce: 500 })
</script>

<template>
  <div class="space-y-6">
    <div
      v-if="title || showSearch || showRefresh || $slots.actions"
      class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-card"
    >
      <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3 sm:flex-1">
        <h1 v-if="title" class="text-2xl font-bold text-text-primary">
          {{ title }}
        </h1>
        <div v-if="showSearch" class="relative w-full sm:max-w-md">
          <BaseInput
            v-model="searchQuery"
            type="text"
            placeholder="Search..."
            class="pl-10"
          />
          <svg
            class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-text-muted"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>
      <div class="flex items-center gap-2 sm:justify-end">
        <slot name="actions" />
        <BaseButton
          v-if="showRefresh"
          variant="secondary"
          :disabled="loading"
          @click="$emit('refresh')"
        >
          <svg
            class="h-5 w-5"
            :class="{ 'animate-spin': loading }"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </BaseButton>
      </div>
    </div>

    <div class="overflow-hidden border border-white/10 rounded-2xl bg-white/5 backdrop-blur-md shadow-card">
      <table class="min-w-full divide-y divide-white/10">
        <thead class="bg-white/5">
          <tr>
            <th
              v-for="column in columns"
              :key="column.key"
              class="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider cursor-pointer hover:text-text-primary transition-colors select-none"
              @click="handleSort(column.key)"
            >
              <div class="flex items-center gap-1">
                {{ column.label }}
                <svg
                  v-if="sortKey === column.key"
                  class="h-4 w-4"
                  :class="{ 'rotate-180': sortOrder === 'desc' }"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </th>
            <th
              v-if="$slots.rowActions"
              class="px-6 py-4 text-right text-xs font-semibold text-text-secondary uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-white/10">
          <tr v-for="item in data" :key="getItemKey(item)" class="hover:bg-white/5 transition-colors duration-200">
            <td v-for="column in columns" :key="column.key" class="px-6 py-5 whitespace-nowrap text-sm text-text-primary font-medium">
              <slot
                v-if="$slots[`cell-${column.key}`]"
                :name="`cell-${column.key}`"
                :item="item"
                :value="getItemValue(item, column.key)"
              >
                {{ getItemValue(item, column.key) }}
              </slot>
              <template v-else>
                {{ getItemValue(item, column.key) }}
              </template>
            </td>
            <td
              v-if="$slots.rowActions"
              class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
            >
              <slot name="rowActions" :item="item" />
            </td>
          </tr>
          <tr v-if="data.length === 0">
            <td
              :colspan="columns.length + ($slots.rowActions ? 1 : 0)"
              class="px-6 py-12 text-center text-text-muted"
            >
              No data available
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showPagination" class="flex items-center justify-between">
      <div class="text-sm text-text-secondary">
        Showing {{ (currentPage - 1) * pageSize + 1 }} to
        {{ Math.min(currentPage * pageSize, total) }} of {{ total }} results
      </div>
      <div class="flex gap-2">
        <BaseButton
          variant="secondary"
          :disabled="currentPage === 1 || loading"
          @click="$emit('prevPage')"
        >
          Previous
        </BaseButton>
        <BaseButton
          variant="secondary"
          :disabled="currentPage >= totalPages || loading"
          @click="$emit('nextPage')"
        >
          Next
        </BaseButton>
      </div>
    </div>
  </div>
</template>
