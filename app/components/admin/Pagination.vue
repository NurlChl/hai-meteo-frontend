<script setup lang="ts">
import BaseButton from '~/components/base/Button.vue'

interface Props {
  currentPage: number
  pageSize: number
  total: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  pageChange: [page: number]
}>()

const totalPages = computed(() => Math.ceil(props.total / props.pageSize))

const visiblePages = computed(() => {
  const pages: (number | string)[] = []
  const delta = 2

  for (let i = 1; i <= totalPages.value; i++) {
    if (
      i === 1
      || i === totalPages.value
      || (i >= props.currentPage - delta && i <= props.currentPage + delta)
    ) {
      pages.push(i)
    }
    else if (pages[pages.length - 1] !== '...') {
      pages.push('...')
    }
  }

  return pages
})

function goToPage(page: number) {
  if (page >= 1 && page <= totalPages.value) {
    emit('pageChange', page)
  }
}
</script>

<template>
  <div class="flex items-center justify-between">
    <div class="text-sm text-text-secondary">
      Showing {{ (currentPage - 1) * pageSize + 1 }} to
      {{ Math.min(currentPage * pageSize, total) }} of {{ total }} results
    </div>
    <nav class="flex gap-1">
      <BaseButton
        variant="secondary"
        class="px-3 py-2 text-sm !rounded-md"
        :disabled="currentPage === 1"
        @click="goToPage(currentPage - 1)"
      >
        Previous
      </BaseButton>

      <template v-for="page in visiblePages" :key="page">
        <BaseButton
          v-if="page !== '...'"
          :variant="page === currentPage ? 'primary' : 'secondary'"
          class="px-3 py-2 text-sm !rounded-md w-10 justify-center"
          :class="{ '!bg-gradient-button': page !== currentPage }"
          @click="goToPage(page as number)"
        >
          {{ page }}
        </BaseButton>
        <span v-else class="px-3 py-2 text-sm font-medium text-text-secondary flex items-center justify-center"> ... </span>
      </template>

      <BaseButton
        variant="secondary"
        class="px-3 py-2 text-sm !rounded-md"
        :disabled="currentPage >= totalPages"
        @click="goToPage(currentPage + 1)"
      >
        Next
      </BaseButton>
    </nav>
  </div>
</template>
