<script setup lang="ts">
import Footer from '~/components/landing/Footer.vue'
import Header from '~/components/landing/Header.vue'
</script>

<template>
  <div class="min-h-screen bg-bg-primary text-text-primary flex flex-col font-sans">
    <div class="relative z-50 w-full">
      <Header />
      <slot />
    </div>

    <Footer />
  </div>
</template>
