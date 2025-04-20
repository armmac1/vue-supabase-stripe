<script setup>
import { useSession } from './composables/useSession'
import LogoutButton from './components/LogoutButton.vue'
import { onMounted } from 'vue';

const { user, hasActiveSubscription, fetchSubscription, fetchUser } = useSession()

onMounted(async () => {
  await fetchUser();
  await fetchSubscription();
})
</script>

<template>
  <div>
    <nav class="bg-white shadow mb-8">
      <div class="container mx-auto px-4 py-4 flex justify-between items-center">
        <div class="text-xl font-bold text-blue-700">SaaS App</div>
        <div class="space-x-4 flex items-center">
          <RouterLink v-if="!user" to="/" class="text-gray-700 hover:text-blue-600 font-medium">Login</RouterLink>
          <RouterLink to="/pricing" class="text-gray-700 hover:text-blue-600 font-medium">Pricing</RouterLink>
          <RouterLink 
            v-if="user && hasActiveSubscription" 
            to="/members" 
            class="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors font-medium"
          >
            Members Area
          </RouterLink>
          <LogoutButton v-if="user" />
        </div>
      </div>
    </nav>
    <main>
      <RouterView />
    </main>
  </div>
</template>