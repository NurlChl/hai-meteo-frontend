export interface TableOptions<T> {
  fetchData: (params: {
    page: number
    pageSize: number
    sort?: string
    filter?: string
  }) => Promise<{ data: T[], total: number }>
  initialPageSize?: number
}

export function useTable<T>(options: TableOptions<T>) {
  const { fetchData, initialPageSize = 10 } = options

  const data = ref<T[]>([])
  const loading = ref(false)
  const total = ref(0)
  const currentPage = ref(1)
  const pageSize = ref(initialPageSize)
  const sort = ref<string>()
  const filter = ref<string>()

  const totalPages = computed(() => Math.ceil(total.value / pageSize.value))

  const load = async () => {
    loading.value = true
    try {
      const result = await fetchData({
        page: currentPage.value,
        pageSize: pageSize.value,
        sort: sort.value,
        filter: filter.value,
      })
      data.value = result.data
      total.value = result.total
    }
    catch (error) {
      console.error('Failed to load table data:', error)
    }
    finally {
      loading.value = false
    }
  }

  const refresh = () => {
    currentPage.value = 1
    load()
  }

  const nextPage = () => {
    if (currentPage.value < totalPages.value) {
      currentPage.value++
      load()
    }
  }

  const prevPage = () => {
    if (currentPage.value > 1) {
      currentPage.value--
      load()
    }
  }

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
      load()
    }
  }

  const setPageSize = (size: number) => {
    pageSize.value = size
    currentPage.value = 1
    load()
  }

  const setSort = (newSort: string) => {
    sort.value = newSort === sort.value ? undefined : newSort
    load()
  }

  const setFilter = (newFilter: string) => {
    filter.value = newFilter
    currentPage.value = 1
    load()
  }

  const resetFilters = () => {
    filter.value = undefined
    sort.value = undefined
    currentPage.value = 1
    load()
  }

  onMounted(() => {
    load()
  })

  return {
    data,
    loading,
    total,
    currentPage,
    pageSize,
    sort,
    filter,
    totalPages,
    load,
    refresh,
    nextPage,
    prevPage,
    goToPage,
    setPageSize,
    setSort,
    setFilter,
    resetFilters,
  }
}
