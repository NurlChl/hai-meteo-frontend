interface ToastOptions {
  message: string
  type?: 'success' | 'error' | 'warning' | 'info'
  duration?: number
}

const toasts = ref<ToastOptions[]>([])

export function useToast() {
  const remove = (toast: ToastOptions) => {
    const index = toasts.value.indexOf(toast)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  const show = (options: ToastOptions) => {
    const toast = { ...options }

    toasts.value.push(toast)

    setTimeout(() => {
      remove(toast)
    }, options.duration || 3000)
  }

  const success = (message: string, duration?: number) =>
    show({ message, type: 'success', duration })
  const error = (message: string, duration?: number) => show({ message, type: 'error', duration })
  const warning = (message: string, duration?: number) =>
    show({ message, type: 'warning', duration })
  const info = (message: string, duration?: number) => show({ message, type: 'info', duration })

  return {
    toasts,
    show,
    remove,
    success,
    error,
    warning,
    info,
  }
}
