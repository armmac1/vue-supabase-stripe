<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
      <h2 class="text-2xl font-bold text-center text-gray-800">Sign in to your account</h2>
      <form class="space-y-4" @submit.prevent="login">
        <div>
          <label class="block text-sm font-medium text-gray-700">Email</label>
          <input v-model="email" type="email" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="you@example.com" required />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Password</label>
          <input v-model="password" type="password" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="••••••••" required />
        </div>
        <div class="text-red-500 text-sm min-h-[1.5em]">{{ userLoginError }}</div>
        <button type="submit" class="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold" :disabled="isLoadingUser">
          <span v-if="isLoadingUser">Signing in...</span>
          <span v-else>Sign In</span>
        </button>
      </form>
      <div class="text-center text-sm mt-2">
        Don't have an account?
        <router-link to="/signup" class="text-blue-600 hover:underline">Sign Up</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useSession } from '../composables/useSession'

const email = ref('')
const password = ref('')
const error = ref('')
const { handleLogin, isLoadingUser, userLoginError } = useSession()

async function login() {
  error.value = ''
  await handleLogin(email.value, password.value)
}
</script> 