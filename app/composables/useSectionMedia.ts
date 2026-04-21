import type { MediaRef } from '~/utils/sectionContent'

interface MediaAsset {
  id: number
  fileUrl: string
  altText?: string | null
}

export function useSectionMedia() {
  const { get } = useApi()
  const { resolveMediaUrl } = useMediaUrl()
  const cache = new Map<number, MediaAsset>()

  async function resolveMedia(ref: MediaRef | null | undefined): Promise<MediaAsset | null> {
    if (!ref?.__mediaId)
      return null

    if (cache.has(ref.__mediaId))
      return cache.get(ref.__mediaId) || null

    const media = await get<MediaAsset>(`/media-assets/${ref.__mediaId}`)
    const normalizedMedia = {
      ...media,
      fileUrl: resolveMediaUrl(media.fileUrl),
    }

    cache.set(ref.__mediaId, normalizedMedia)
    return normalizedMedia
  }

  return {
    resolveMedia,
  }
}
