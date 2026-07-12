<script setup lang="ts">
import Footer from '~/components/landing/Footer.vue'
import Header from '~/components/landing/Header.vue'
</script>

<template>
  <div class="min-h-screen bg-bg-primary text-text-primary flex flex-col font-sans">
    <div class="relative w-full">
      <div class="sticky top-0 z-50 w-full">
        <Header />
      </div>
      <slot />
    </div>

    <Footer />
  </div>
</template>
