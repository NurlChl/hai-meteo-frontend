export interface MediaRef {
  __mediaId: number
}

export interface MediaAssetSummary {
  fileUrl: string
  altText?: string | null
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

export function isMediaRef(value: unknown): value is MediaRef {
  return isRecord(value) && typeof value.__mediaId === 'number'
}

export function coerceText(value: unknown, fallback: string): string {
  if (typeof value === 'string' && value.trim())
    return value.replace(/\\n/g, '\n')

  return fallback
}

export function mergeMediaField<T extends { url: string, alt: string }>(
  media: MediaAssetSummary | null | undefined,
  fallback: T,
): T {
  if (!media?.fileUrl)
    return fallback

  return {
    ...fallback,
    url: media.fileUrl,
    alt: media.altText || fallback.alt,
  }
}

export function mediaUrlOrFallback(
  media: MediaAssetSummary | null | undefined,
  fallback?: string,
): string | undefined {
  return media?.fileUrl || fallback
}
