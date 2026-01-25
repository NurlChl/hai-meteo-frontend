const modals = ref<Map<string, { isOpen: boolean, data?: unknown }>>(new Map())

export function useModal() {
  const open = (id: string, data?: unknown) => {
    modals.value.set(id, { isOpen: true, data })
  }

  const close = (id: string) => {
    modals.value.set(id, { isOpen: false })
  }

  const toggle = (id: string) => {
    const modal = modals.value.get(id)
    if (modal) {
      modals.value.set(id, { isOpen: !modal.isOpen, data: modal.data })
    }
    else {
      modals.value.set(id, { isOpen: true })
    }
  }

  const isOpen = (id: string) => {
    return modals.value.get(id)?.isOpen ?? false
  }

  const getData = (id: string) => {
    return modals.value.get(id)?.data
  }

  return {
    modals,
    open,
    close,
    toggle,
    isOpen,
    getData,
  }
}
