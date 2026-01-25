<script setup lang="ts">
definePageMeta({
  layout: 'default',
  middleware: 'guest',
})

const form = ref({
  email: '',
  password: '',
})

const loading = ref(false)

const { login } = useAuth()

async function handleLogin() {
  loading.value = true
  try {
    await login({
      email: form.value.email,
      password: form.value.password,
    })
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <BaseCard>
    <div>
      <h2 class="mt-6 text-center text-3xl font-extrabold text-text-primary">
        Sign in to your account
      </h2>
      <p class="mt-2 text-center text-sm text-text-secondary">
        Hai Meteo CMS
      </p>
    </div>

    <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
      <div class="space-y-4">
        <div>
          <label for="email" class="sr-only">Email address</label>
          <BaseInput
            id="email"
            v-model="form.email"
            name="email"
            type="email"
            autocomplete="email"
            required
            placeholder="Email address"
          />
        </div>
        <div>
          <label for="password" class="sr-only">Password</label>
          <BaseInput
            id="password"
            v-model="form.password"
            name="password"
            type="password"
            autocomplete="current-password"
            required
            placeholder="Password"
          />
        </div>
      </div>

      <div>
        <BaseButton
          type="submit"
          :loading="loading"
          :full-width="true"
        >
          Sign in
        </BaseButton>
      </div>
    </form>
  </BaseCard>
</template>
