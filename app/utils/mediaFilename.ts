export function getMediaFilename(fileUrl: string): string {
  if (!fileUrl)
    return ''

  try {
    const parsedUrl = new URL(fileUrl)
    const segments = parsedUrl.pathname.split('/').filter(Boolean)
    return segments.at(-1) || fileUrl
  }
  catch {
    const sanitizedUrl = fileUrl.split('?')[0] || fileUrl
    const segments = sanitizedUrl.split('/').filter(Boolean)
    return segments.at(-1) || sanitizedUrl
  }
}
