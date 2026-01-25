<script setup lang="ts">
import BaseButton from '~/components/base/Button.vue'
import BaseCard from '~/components/base/Card.vue'
import Icon from '~/components/Icon.vue'

interface Props {
  isOpen: boolean
  title: string
  showFooter?: boolean
  confirmText?: string
  loading?: boolean
  closeOnBackdrop?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showFooter: true,
  confirmText: 'Confirm',
  loading: false,
  closeOnBackdrop: true,
})

const emit = defineEmits<{
  'update:isOpen': [value: boolean]
  'close': []
  'confirm': []
}>()

function close() {
  emit('update:isOpen', false)
  emit('close')
}

function handleConfirm() {
  emit('confirm')
}

function handleCancel() {
  close()
}

function handleBackdropClick() {
  if (props.closeOnBackdrop) {
    close()
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
        @click="handleBackdropClick"
      >
        <div class="fixed inset-0 bg-bg-overlay" aria-hidden="true" />
        <Transition
          enter-active-class="transition-all duration-200"
          enter-from-class="scale-95 opacity-0"
          enter-to-class="scale-100 opacity-100"
          leave-active-class="transition-all duration-200"
          leave-from-class="scale-100 opacity-100"
          leave-to-class="scale-95 opacity-0"
        >
          <div
            v-if="isOpen"
            class="relative max-w-lg w-full"
            @click.stop
          >
            <BaseCard class="!p-0 overflow-hidden shadow-card">
              <div class="flex items-center justify-between p-4 border-b border-border-subtle">
                <h3 class="text-lg font-semibold text-text-primary">
                  {{ title }}
                </h3>
                <button type="button" class="text-text-muted hover:text-text-primary transition-colors" @click="close">
                  <Icon path="M6 18L18 6M6 6l12 12" class="h-6 w-6" />
                </button>
              </div>
              <div class="p-6">
                <slot />
              </div>
              <div v-if="showFooter" class="flex justify-end gap-2 p-4 border-t border-border-subtle bg-bg-surface/30">
                <BaseButton variant="secondary" @click="handleCancel">
                  Cancel
                </BaseButton>
                <BaseButton
                  variant="primary"
                  :disabled="loading"
                  @click="handleConfirm"
                >
                  {{ confirmText }}
                </BaseButton>
              </div>
            </BaseCard>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
