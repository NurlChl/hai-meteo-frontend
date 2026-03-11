/**
 * Composable to resolve media file URLs to the backend server.
 *
 * The backend may return fileUrl as either:
 * - A relative path like `/uploads/image.png`
 * - An absolute URL with its internal port (e.g. `http://localhost:3000/uploads/...`)
 *
 * In both cases, we need the URL to point to the backend's externally-accessible
 * origin, derived from the apiBase runtime config.
 */
export function useMediaUrl() {
    const config = useRuntimeConfig()

    /**
     * Resolve a media fileUrl to an absolute URL pointing to the backend.
     * Extracts the pathname from the URL and rebuilds it with the correct backend origin.
     */
    function resolveMediaUrl(fileUrl: string): string {
        if (!fileUrl) return ''

        try {
            const apiUrl = new URL(config.public.apiBase as string)
            const backendOrigin = apiUrl.origin

            // If already absolute, extract just the pathname and rebuild
            if (fileUrl.startsWith('http://') || fileUrl.startsWith('https://')) {
                const parsed = new URL(fileUrl)
                return `${backendOrigin}${parsed.pathname}`
            }

            // Relative path — prepend the backend origin
            return `${backendOrigin}${fileUrl}`
        }
        catch {
            return fileUrl
        }
    }

    return {
        resolveMediaUrl,
    }
}
