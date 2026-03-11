<script setup lang="ts">
const route = useRoute()
const config = useRuntimeConfig()
const isOpen = ref(false)
const userInput = ref('')
const chatBodyRef = ref<HTMLElement | null>(null)

const isAdminRoute = computed(() => route.path.startsWith('/admin'))

const {
  messages,
  isLoading,
  isRateLimited,
  rateLimitMessage,
  sendMessage,
  resetChat,
} = useAskMeteo()

// --- Quick Action Questions ---
const DEFAULT_QUICK_QUESTIONS = [
  'Saya ingin tau apa itu HAI-Meteo',
  'Saya bingung harus kontak ke mana',
  'Butuh info lebih lanjut tentang layanan.',
]

const quickQuestions = ref<string[]>(DEFAULT_QUICK_QUESTIONS)

async function loadQuickQuestions() {
  try {
    const response = await $fetch<{ results: { question: string, sortOrder: number, isEnabled: boolean }[] }>(
      '/chat-questions',
      {
        baseURL: config.public.apiBase as string,
        query: { isEnabled: true, limit: 5 },
      },
    )
    const loaded = response?.results ?? []
    if (loaded.length > 0) {
      quickQuestions.value = loaded.map(q => q.question)
    }
  }
  catch {
    // silently fallback to defaults
  }
}

const canSend = computed(
  () => userInput.value.trim().length > 0 && !isLoading.value && !isRateLimited.value,
)

function toggle() {
  isOpen.value = !isOpen.value
}

function close() {
  isOpen.value = false
}

async function handleSend() {
  if (!canSend.value) return
  const question = userInput.value.trim()
  userInput.value = ''
  await sendMessage(question)
  scrollToBottom()
}

async function handleQuickAction(text: string) {
  if (isLoading.value || isRateLimited.value) return
  await sendMessage(text)
  scrollToBottom()
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    handleSend()
  }
}

function scrollToBottom() {
  nextTick(() => {
    if (chatBodyRef.value) {
      chatBodyRef.value.scrollTop = chatBodyRef.value.scrollHeight
    }
  })
}

// Watch for new messages and scroll
watch(messages, () => scrollToBottom(), { deep: true })

onMounted(() => {
  loadQuickQuestions()
})
</script>

<template>
  <div v-if="!isAdminRoute" class="ask-meteo-widget">
    <!-- Floating Button -->
    <Transition name="fab">
      <button
        v-if="!isOpen"
        class="ask-meteo-fab"
        @click="toggle"
        aria-label="Ask Meteo"
      >
        <span class="fab-logo">
          <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M-3.24323 26.7025V19.1231C6.23502 19.1231 12.9189 3.78381 17.5676 3.78381C25.027 3.78381 15.7297 18.1622 16.9189 18.1622C18.3243 18.1622 21.0001 13.0001 25.0001 13.0001C28.5001 13.0001 25.0001 19.0001 28.0001 19.0001C32.419 19.0001 35.6216 14.9717 35.6216 8.54036H37.3514C37.3514 15.4461 32.5949 23.8919 25.027 23.8919C20.4865 23.8919 25.5001 15.5001 24.0001 15.5001C22.0001 15.5001 17.01 24.5 13.5001 24.5C5.75905 24.5 21.419 8.00012 18.5001 8.00012C15.5811 8.00012 6.44963 26.7025 -3.24323 26.7025Z" fill="white"/>
          </svg>
        </span>
        <span class="fab-text">Ask Meteo</span>
      </button>
    </Transition>

    <!-- Chat Panel -->
    <Transition name="chat-panel">
      <div v-if="isOpen" class="chat-panel">
        <!-- Header -->
        <div class="chat-header">
          <span class="chat-header-title">Meteo Assistant</span>
          <div class="chat-header-actions">
            <button
              v-if="messages.length > 0"
              class="chat-header-btn"
              @click="resetChat"
              aria-label="New Chat"
              title="Mulai chat baru"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="1 4 1 10 7 10" />
                <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
              </svg>
            </button>
            <button class="chat-header-btn" @click="close" aria-label="Close">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Body -->
        <div ref="chatBodyRef" class="chat-body">
          <!-- Greeting (shown when no messages) -->
          <template v-if="messages.length === 0">
            <div class="chat-greeting">
              <div class="chat-logo">
                <svg width="36" height="36" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="32" height="32" rx="8" fill="#007AFF"/>
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M-3.24323 26.7025V19.1231C6.23502 19.1231 12.9189 3.78381 17.5676 3.78381C25.027 3.78381 15.7297 18.1622 16.9189 18.1622C18.3243 18.1622 21.0001 13.0001 25.0001 13.0001C28.5001 13.0001 25.0001 19.0001 28.0001 19.0001C32.419 19.0001 35.6216 14.9717 35.6216 8.54036H37.3514C37.3514 15.4461 32.5949 23.8919 25.027 23.8919C20.4865 23.8919 25.5001 15.5001 24.0001 15.5001C22.0001 15.5001 17.01 24.5 13.5001 24.5C5.75905 24.5 21.419 8.00012 18.5001 8.00012C15.5811 8.00012 6.44963 26.7025 -3.24323 26.7025Z" fill="white"/>
                </svg>
              </div>
              <h3 class="chat-greeting-title">HAI-Meteo 👋</h3>
              <p class="chat-greeting-subtitle">How can I assist you today?</p>
            </div>

            <!-- Quick Actions -->
            <div class="chat-actions">
              <button
                v-for="q in quickQuestions"
                :key="q"
                class="chat-action-btn"
                @click="handleQuickAction(q)"
              >
                <span class="chat-action-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="7" y1="17" x2="17" y2="7" />
                    <polyline points="7 7 17 7 17 17" />
                  </svg>
                </span>
                <span>{{ q }}</span>
              </button>
            </div>
          </template>

          <!-- Messages -->
          <template v-else>
            <div class="chat-messages">
              <div
                v-for="(msg, index) in messages"
                :key="index"
                class="chat-message"
                :class="msg.role === 'user' ? 'chat-message--user' : 'chat-message--assistant'"
              >
                <!-- Assistant avatar -->
                <div v-if="msg.role === 'assistant'" class="chat-message-avatar">
                  <svg width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="32" height="32" rx="8" fill="#007AFF"/>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M-3.24323 26.7025V19.1231C6.23502 19.1231 12.9189 3.78381 17.5676 3.78381C25.027 3.78381 15.7297 18.1622 16.9189 18.1622C18.3243 18.1622 21.0001 13.0001 25.0001 13.0001C28.5001 13.0001 25.0001 19.0001 28.0001 19.0001C32.419 19.0001 35.6216 14.9717 35.6216 8.54036H37.3514C37.3514 15.4461 32.5949 23.8919 25.027 23.8919C20.4865 23.8919 25.5001 15.5001 24.0001 15.5001C22.0001 15.5001 17.01 24.5 13.5001 24.5C5.75905 24.5 21.419 8.00012 18.5001 8.00012C15.5811 8.00012 6.44963 26.7025 -3.24323 26.7025Z" fill="white"/>
                  </svg>
                </div>
                <div class="chat-message-bubble">
                  <p v-if="msg.role === 'user'" class="chat-message-text">{{ msg.text }}</p>
                  <div v-else class="chat-message-text chat-message-html" v-html="msg.text"></div>
                  <!-- WhatsApp Button -->
                  <a
                    v-if="msg.showWhatsAppButton && msg.whatsAppUrl"
                    :href="msg.whatsAppUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="chat-whatsapp-btn"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    <span>Hubungi via WhatsApp</span>
                  </a>
                </div>
              </div>

              <!-- Typing Indicator -->
              <div v-if="isLoading" class="chat-message chat-message--assistant">
                <div class="chat-message-avatar">
                  <svg width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="32" height="32" rx="8" fill="#007AFF"/>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M-3.24323 26.7025V19.1231C6.23502 19.1231 12.9189 3.78381 17.5676 3.78381C25.027 3.78381 15.7297 18.1622 16.9189 18.1622C18.3243 18.1622 21.0001 13.0001 25.0001 13.0001C28.5001 13.0001 25.0001 19.0001 28.0001 19.0001C32.419 19.0001 35.6216 14.9717 35.6216 8.54036H37.3514C37.3514 15.4461 32.5949 23.8919 25.027 23.8919C20.4865 23.8919 25.5001 15.5001 24.0001 15.5001C22.0001 15.5001 17.01 24.5 13.5001 24.5C5.75905 24.5 21.419 8.00012 18.5001 8.00012C15.5811 8.00012 6.44963 26.7025 -3.24323 26.7025Z" fill="white"/>
                  </svg>
                </div>
                <div class="chat-message-bubble chat-typing-bubble">
                  <div class="chat-typing-indicator">
                    <span class="dot"></span>
                    <span class="dot"></span>
                    <span class="dot"></span>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>

        <!-- Input Area -->
        <div class="chat-input-area">
          <!-- Rate limit warning -->
          <div v-if="isRateLimited" class="chat-rate-limit-warning">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{{ rateLimitMessage }}</span>
          </div>
          <div class="chat-input-container" :class="{ 'chat-input-disabled': isRateLimited }">
            <textarea
              v-model="userInput"
              class="chat-input"
              placeholder="Tulis Pertanyaan Anda"
              rows="2"
              :disabled="isRateLimited"
              @keydown="handleKeydown"
            />
            <button
              class="chat-send-btn"
              :class="{ 'chat-send-btn--disabled': !canSend }"
              :disabled="!canSend"
              aria-label="Send"
              @click="handleSend"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
            </button>
          </div>
          <p class="chat-footer-text">Butuh info lebih lanjut hubungi kontak CS.</p>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* ============================================
   FLOATING ACTION BUTTON
   ============================================ */
.ask-meteo-widget {
  position: fixed;
  bottom: 28px;
  right: 28px;
  z-index: 9999;
  font-family: 'Inter', sans-serif;
}

.ask-meteo-fab {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 28px;
  background: linear-gradient(135deg, #007AFF 0%, #0062CC 100%);
  color: #fff;
  border: none;
  border-radius: 60px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0.02em;
  box-shadow:
    0 8px 32px rgba(0, 122, 255, 0.35),
    0 2px 8px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
}

.ask-meteo-fab:hover {
  transform: translateY(-3px) scale(1.03);
  box-shadow:
    0 12px 40px rgba(0, 122, 255, 0.45),
    0 4px 12px rgba(0, 0, 0, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.ask-meteo-fab:active {
  transform: translateY(-1px) scale(0.98);
}

.fab-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  flex-shrink: 0;
}

.fab-text {
  line-height: 1;
}

/* ============================================
   CHAT PANEL
   ============================================ */
.chat-panel {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 380px;
  max-height: calc(100vh - 100px);
  background: #ffffff;
  border-radius: 20px;
  box-shadow:
    0 25px 60px rgba(0, 0, 0, 0.3),
    0 10px 24px rgba(0, 0, 0, 0.15),
    0 0 0 1px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Header */
.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 22px;
  border-bottom: 1px solid #f0f0f0;
  background: #ffffff;
}

.chat-header-title {
  font-size: 16px;
  font-weight: 700;
  color: #1a1a1a;
  letter-spacing: -0.01em;
}

.chat-header-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

.chat-header-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: #f5f5f5;
  border-radius: 10px;
  cursor: pointer;
  color: #666;
  transition: all 0.2s ease;
}

.chat-header-btn:hover {
  background: #e8e8e8;
  color: #333;
}

/* Body */
.chat-body {
  flex: 1;
  overflow-y: auto;
  padding: 28px 22px 16px;
  min-height: 300px;
  max-height: 420px;
  scroll-behavior: smooth;
}

/* Greeting */
.chat-greeting {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 28px;
}

.chat-logo {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: linear-gradient(135deg, #007AFF 0%, #0062CC 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  box-shadow: 0 6px 20px rgba(0, 122, 255, 0.25);
}

.chat-greeting-title {
  font-size: 22px;
  font-weight: 800;
  color: #1a1a1a;
  margin: 0 0 6px 0;
  letter-spacing: -0.02em;
}

.chat-greeting-subtitle {
  font-size: 14px;
  color: #888;
  margin: 0;
  font-weight: 400;
}

/* Quick Actions */
.chat-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.chat-action-btn {
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  padding: 14px 16px;
  background: #ffffff;
  border: 1px solid #e8e8e8;
  border-radius: 14px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: #2a2a2a;
  text-align: left;
  transition: all 0.2s ease;
  line-height: 1.4;
}

.chat-action-btn:hover {
  background: #f8f9ff;
  border-color: #c4d4ff;
  transform: translateX(4px);
  box-shadow: 0 2px 8px rgba(0, 122, 255, 0.08);
}

.chat-action-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  flex-shrink: 0;
  color: #888;
}

.chat-action-btn:hover .chat-action-icon {
  color: #007AFF;
}

/* ============================================
   MESSAGES
   ============================================ */
.chat-messages {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.chat-message {
  display: flex;
  gap: 10px;
  animation: messageIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes messageIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.chat-message--user {
  flex-direction: row-reverse;
}

.chat-message--assistant {
  flex-direction: row;
}

.chat-message-avatar {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
  margin-top: 2px;
}

.chat-message-bubble {
  max-width: 80%;
  padding: 12px 16px;
  border-radius: 16px;
  line-height: 1.5;
}

.chat-message--user .chat-message-bubble {
  background: linear-gradient(135deg, #007AFF 0%, #0062CC 100%);
  color: #fff;
  border-bottom-right-radius: 4px;
}

.chat-message--assistant .chat-message-bubble {
  background: #f2f3f5;
  color: #1a1a1a;
  border-bottom-left-radius: 4px;
}

.chat-message-text {
  margin: 0;
  font-size: 14px;
  white-space: pre-wrap;
  word-break: break-word;
}

/* HTML content from API responses */
.chat-message-html {
  white-space: normal;
}

.chat-message-html :deep(br) {
  display: block;
  content: '';
  margin-top: 4px;
}

.chat-message-html :deep(strong) {
  font-weight: 700;
}

.chat-message-html :deep(ul),
.chat-message-html :deep(ol) {
  margin: 8px 0 4px 0;
  padding-left: 20px;
}

.chat-message-html :deep(li) {
  margin-bottom: 6px;
  line-height: 1.5;
}

.chat-message-html :deep(p) {
  margin: 4px 0;
}

/* WhatsApp Button */
.chat-whatsapp-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
  padding: 8px 16px;
  background: #25D366;
  color: #fff;
  border-radius: 10px;
  text-decoration: none;
  font-size: 13px;
  font-weight: 600;
  transition: all 0.2s ease;
}

.chat-whatsapp-btn:hover {
  background: #1fba59;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(37, 211, 102, 0.3);
}

/* Typing Indicator */
.chat-typing-bubble {
  display: flex;
  align-items: center;
  padding: 14px 20px !important;
}

.chat-typing-indicator {
  display: flex;
  gap: 5px;
  align-items: center;
}

.chat-typing-indicator .dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #aaa;
  animation: typingBounce 1.4s ease-in-out infinite;
}

.chat-typing-indicator .dot:nth-child(2) {
  animation-delay: 0.2s;
}

.chat-typing-indicator .dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typingBounce {
  0%, 60%, 100% {
    transform: translateY(0);
    opacity: 0.5;
  }
  30% {
    transform: translateY(-6px);
    opacity: 1;
  }
}

/* ============================================
   INPUT AREA
   ============================================ */
.chat-input-area {
  padding: 12px 22px 18px;
  border-top: 1px solid #f0f0f0;
  background: #fafafa;
}

/* Rate Limit Warning */
.chat-rate-limit-warning {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  margin-bottom: 10px;
  background: #fff3e0;
  border: 1px solid #ffe0b2;
  border-radius: 12px;
  color: #e65100;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.4;
  animation: messageIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.chat-rate-limit-warning svg {
  flex-shrink: 0;
  stroke: #e65100;
}

.chat-input-container {
  position: relative;
  background: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.2s ease;
}

.chat-input-container:focus-within {
  border-color: #007AFF;
  box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.08);
}

.chat-input-disabled {
  opacity: 0.6;
  pointer-events: none;
}

.chat-input {
  width: 100%;
  padding: 14px 50px 14px 16px;
  border: none;
  outline: none;
  font-size: 14px;
  font-family: 'Inter', sans-serif;
  color: #1a1a1a;
  background: transparent;
  resize: none;
  line-height: 1.5;
}

.chat-input::placeholder {
  color: #b0b0b0;
}

.chat-send-btn {
  position: absolute;
  right: 10px;
  bottom: 10px;
  width: 36px;
  height: 36px;
  border: none;
  background: linear-gradient(135deg, #007AFF 0%, #0062CC 100%);
  border-radius: 12px;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(0, 122, 255, 0.3);
}

.chat-send-btn:hover:not(:disabled) {
  transform: scale(1.08);
  box-shadow: 0 6px 16px rgba(0, 122, 255, 0.4);
}

.chat-send-btn--disabled {
  opacity: 0.4;
  cursor: not-allowed;
  box-shadow: none;
}

.chat-footer-text {
  text-align: center;
  font-size: 12px;
  color: #a0a0a0;
  margin: 12px 0 0;
  font-weight: 400;
}

/* ============================================
   TRANSITIONS
   ============================================ */

/* FAB enter/leave */
.fab-enter-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.fab-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 1, 1);
}

.fab-enter-from {
  opacity: 0;
  transform: scale(0.8) translateY(10px);
}

.fab-leave-to {
  opacity: 0;
  transform: scale(0.8) translateY(10px);
}

/* Chat panel enter/leave */
.chat-panel-enter-active {
  transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.chat-panel-leave-active {
  transition: all 0.25s cubic-bezier(0.4, 0, 1, 1);
}

.chat-panel-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

.chat-panel-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

/* ============================================
   RESPONSIVE
   ============================================ */
@media (max-width: 440px) {
  .ask-meteo-widget {
    bottom: 16px;
    right: 16px;
    left: 16px;
  }

  .chat-panel {
    width: 100%;
    max-height: calc(100vh - 80px);
    border-radius: 18px;
  }

  .ask-meteo-fab {
    padding: 12px 22px;
    font-size: 14px;
  }
}
</style>
