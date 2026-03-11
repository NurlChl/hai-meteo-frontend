interface ChatMessage {
    role: 'user' | 'assistant'
    text: string
    whatsAppUrl?: string | null
    showWhatsAppButton?: boolean
}

interface LoginResponse {
    code: number
    token: string
    expires_in: number
}

interface ChatResponse {
    code: number
    answer: string
    showWhatsAppButton: boolean
    redirectTo: string | null
    message?: string
}

// Module-level state so it persists across component re-renders
let authToken: string | null = null
let tokenExpiresAt: number = 0

function generateSessionId(): string {
    // Simple UUID v4 generator
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0
        const v = c === 'x' ? r : (r & 0x3 | 0x8)
        return v.toString(16)
    })
}

export function useAskMeteo() {
    const config = useRuntimeConfig()
    const baseUrl = config.public.chatbotApiBase as string
    const username = config.public.chatbotUsername as string
    const password = config.public.chatbotPassword as string

    const messages = ref<ChatMessage[]>([])
    const isLoading = ref(false)
    const errorMessage = ref<string | null>(null)
    const sessionId = ref(generateSessionId())

    // --- Rate Limiting ---
    const RATE_LIMIT_MAX = 10
    const RATE_LIMIT_WINDOW_MS = 60_000

    const requestTimestamps = ref<number[]>([])
    const isRateLimited = ref(false)
    const rateLimitMessage = ref('')
    let rateLimitTimer: ReturnType<typeof setTimeout> | null = null

    function cleanOldTimestamps() {
        const now = Date.now()
        requestTimestamps.value = requestTimestamps.value.filter(
            ts => now - ts < RATE_LIMIT_WINDOW_MS,
        )
    }

    function checkRateLimit(): boolean {
        cleanOldTimestamps()
        if (requestTimestamps.value.length >= RATE_LIMIT_MAX) {
            isRateLimited.value = true
            rateLimitMessage.value = 'Sabar ya, kamu terlalu cepat bertanya. Tunggu 1 menit lagi.'

            // Auto-reset after 1 minute from the oldest request in window
            if (rateLimitTimer) clearTimeout(rateLimitTimer)
            const oldestTs = requestTimestamps.value[0]!
            const waitMs = RATE_LIMIT_WINDOW_MS - (Date.now() - oldestTs)
            rateLimitTimer = setTimeout(() => {
                cleanOldTimestamps()
                if (requestTimestamps.value.length < RATE_LIMIT_MAX) {
                    isRateLimited.value = false
                    rateLimitMessage.value = ''
                }
            }, Math.max(waitMs, 0))

            return true
        }
        return false
    }

    function recordRequest() {
        requestTimestamps.value.push(Date.now())
    }

    // --- Auth ---
    async function login(): Promise<string> {
        // If we have a valid token, reuse it
        if (authToken && Date.now() < tokenExpiresAt) {
            return authToken
        }

        const credentials = btoa(`${username}:${password}`)

        const response = await $fetch<LoginResponse>(`${baseUrl}/haimeteo-login`, {
            method: 'POST',
            headers: {
                Authorization: `Basic ${credentials}`,
            },
        })

        if (response.code === 200 && response.token) {
            authToken = response.token
            // Set expiry with 5-minute buffer
            tokenExpiresAt = Date.now() + (response.expires_in * 1000) - 300_000
            return authToken
        }

        throw new Error('Login gagal. Silakan coba lagi.')
    }

    // --- Chat ---
    async function sendMessage(question: string) {
        if (!question.trim()) return
        if (checkRateLimit()) return

        // Add user message
        messages.value.push({ role: 'user', text: question.trim() })
        isLoading.value = true
        errorMessage.value = null
        recordRequest()

        try {
            const token = await login()

            const response = await $fetch<ChatResponse>(`${baseUrl}/haimeteo-chat`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: {
                    sessionId: sessionId.value,
                    question: question.trim(),
                },
            })

            if (response.code === 200) {
                messages.value.push({
                    role: 'assistant',
                    text: response.answer,
                    showWhatsAppButton: response.showWhatsAppButton,
                    whatsAppUrl: response.redirectTo,
                })
            }
            else if (response.code === 401) {
                // Token expired, clear and retry once
                authToken = null
                tokenExpiresAt = 0
                const freshToken = await login()

                const retryResponse = await $fetch<ChatResponse>(`${baseUrl}/haimeteo-chat`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${freshToken}`,
                        'Content-Type': 'application/json',
                    },
                    body: {
                        sessionId: sessionId.value,
                        question: question.trim(),
                    },
                })

                messages.value.push({
                    role: 'assistant',
                    text: retryResponse.answer,
                    showWhatsAppButton: retryResponse.showWhatsAppButton,
                    whatsAppUrl: retryResponse.redirectTo,
                })
            }
            else {
                messages.value.push({
                    role: 'assistant',
                    text: response.message || 'Maaf, terjadi kesalahan. Silakan coba lagi.',
                })
            }
        }
        catch (err: unknown) {
            const errorText = err instanceof Error ? err.message : 'Terjadi kesalahan. Silakan coba lagi.'
            messages.value.push({
                role: 'assistant',
                text: `Maaf, ${errorText}`,
            })
        }
        finally {
            isLoading.value = false
        }
    }

    function resetChat() {
        messages.value = []
        sessionId.value = generateSessionId()
        errorMessage.value = null
    }

    return {
        messages,
        isLoading,
        errorMessage,
        isRateLimited,
        rateLimitMessage,
        sendMessage,
        resetChat,
    }
}
