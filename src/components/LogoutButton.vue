<template>
  <button @click="handleLogout" class="py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600 font-semibold">
    Logout
  </button>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useSession } from '../composables/useSession'

const router = useRouter()
const { clearUserSession } = useSession()

async function handleLogout() {
  await clearUserSession()
  router.push('/')
}
</script> 