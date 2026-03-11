export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const url = getRequestURL(event)

  const backendUrl = config.public.apiBase + url.pathname.replace('/api', '')

  try {
    const response = await $fetch.raw(backendUrl, {
      method: event.node.req.method as 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
      headers: {
        ...getHeaders(event),
        host: new URL(config.public.apiBase).host,
      },
      body: event.node.req.method !== 'GET' ? await readBody(event) : undefined,
    })

    for (const [key, value] of Object.entries(response.headers)) {
      setHeader(event, key, value)
    }

    return response._data
  }
  catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Backend API Error',
    })
  }
})
