<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
      <h2 class="text-2xl font-bold text-center text-gray-800">Create your account</h2>
      <form class="space-y-4" @submit.prevent="handleSignUp">
        <div>
          <label class="block text-sm font-medium text-gray-700">Email</label>
          <input v-model="email" type="email" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="you@example.com" required />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Password</label>
          <input v-model="password" type="password" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="••••••••" required />
        </div>
        <div class="text-red-500 text-sm min-h-[1.5em]">{{ error }}</div>
        <button type="submit" class="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold" :disabled="loading">
          <span v-if="loading">Signing up...</span>
          <span v-else>Sign Up</span>
        </button>
      </form>
      <div class="text-center text-sm mt-2">
        Already have an account?
        <router-link to="/" class="text-blue-600 hover:underline">Sign In</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../supabase'

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const router = useRouter()

async function handleSignUp() {
  error.value = ''
  loading.value = true
  const { error: signUpError } = await supabase.auth.signUp({
    email: email.value,
    password: password.value
  })
  loading.value = false
  if (signUpError) {
    error.value = signUpError.message
  } else {
    router.push('/pricing')
  }
}
</script> 