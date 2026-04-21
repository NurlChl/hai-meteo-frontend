export function resolveMediaUrlFromBase(apiBase: string, fileUrl: string): string {
  if (!fileUrl)
    return ''

  try {
    if (fileUrl.startsWith('http://') || fileUrl.startsWith('https://'))
      return fileUrl

    const apiUrl = new URL(apiBase)
    const backendOrigin = apiUrl.origin

    return `${backendOrigin}${fileUrl}`
  }
  catch {
    return fileUrl
  }
}

export function useMediaUrl() {
  const config = useRuntimeConfig()

  function resolveMediaUrl(fileUrl: string): string {
    return resolveMediaUrlFromBase(config.public.apiBase as string, fileUrl)
  }

  return {
    resolveMediaUrl,
  }
}
