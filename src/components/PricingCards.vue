<template>
  <div class="min-h-screen bg-gray-50 py-12 flex flex-col items-center">
    <h2 class="text-3xl font-bold mb-8 text-gray-800">Choose your plan</h2>
    
    <div class="flex flex-wrap gap-8 justify-center">
      <div v-for="tier in tiers" :key="tier.name" 
           class="bg-white rounded-lg shadow-lg p-8 w-80 flex flex-col items-center relative transition-transform duration-300 hover:transform hover:scale-105">
        <div v-if="tier.popular" class="absolute top-0 right-0 bg-blue-500 text-white py-1 px-3 rounded-tr-lg rounded-bl-lg font-semibold text-sm">
          POPULAR
        </div>
        
        <h3 class="text-xl font-semibold mb-2">{{ tier.name }}</h3>
        <div class="text-4xl font-bold mb-4">${{ tier.price }}<span class="text-base font-normal">/mo</span></div>
        
        <ul class="mb-6 space-y-2 w-full">
          <li v-for="feature in tier.features" :key="feature" class="text-gray-600 flex items-center">
            <span class="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2"></span>{{ feature }}
          </li>
        </ul>
        
        <button 
          class="w-full py-2 px-4 rounded font-semibold transition-colors duration-300"
          :class="[
            tier.popular 
              ? 'bg-blue-600 text-white hover:bg-blue-700' 
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          ]"
          @click="handleSubscribe(tier)" 
          :disabled="loading">
          <span v-if="loading && loadingTier === tier.name">
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </span>
          <span v-else>Subscribe</span>
        </button>
      </div>
    </div>
    
    <div class="mt-16 max-w-4xl w-full px-4">
      <h3 class="text-2xl font-bold mb-6 text-center text-gray-800">Plan Comparison</h3>
      <div class="overflow-x-auto">
        <table class="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead>
            <tr>
              <th class="py-3 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">Feature</th>
              <th v-for="tier in tiers" :key="`head-${tier.name}`" class="py-3 px-4 border-b border-gray-200 text-center text-sm font-semibold text-gray-700">
                {{ tier.name }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr class="hover:bg-gray-50">
              <td class="py-3 px-4 border-b border-gray-200 text-sm text-gray-700">Projects</td>
              <td class="py-3 px-4 border-b border-gray-200 text-center text-sm text-gray-700">1</td>
              <td class="py-3 px-4 border-b border-gray-200 text-center text-sm text-gray-700">10</td>
              <td class="py-3 px-4 border-b border-gray-200 text-center text-sm text-gray-700">Unlimited</td>
            </tr>
            <tr class="hover:bg-gray-50">
              <td class="py-3 px-4 border-b border-gray-200 text-sm text-gray-700">Support</td>
              <td class="py-3 px-4 border-b border-gray-200 text-center text-sm text-gray-700">Email</td>
              <td class="py-3 px-4 border-b border-gray-200 text-center text-sm text-gray-700">Priority</td>
              <td class="py-3 px-4 border-b border-gray-200 text-center text-sm text-gray-700">Dedicated</td>
            </tr>
            <tr class="hover:bg-gray-50">
              <td class="py-3 px-4 border-b border-gray-200 text-sm text-gray-700">Analytics</td>
              <td class="py-3 px-4 border-b border-gray-200 text-center text-sm text-gray-700">Basic</td>
              <td class="py-3 px-4 border-b border-gray-200 text-center text-sm text-gray-700">Advanced</td>
              <td class="py-3 px-4 border-b border-gray-200 text-center text-sm text-gray-700">Advanced</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { createCheckoutSession } from '../services/stripe-service'
import { useSession } from '../composables/useSession'
import { SUBSCRIPTIONS } from '../utils/constants'

const loading = ref(false)
const loadingTier = ref('')
const { user } = useSession()

const tiers = [
  {
    name: SUBSCRIPTIONS.STARTER.name,
    price: SUBSCRIPTIONS.STARTER.price,
    features: [
      'Basic analytics',
      'Email support',
      '1 project'
    ],
    popular: false,
    lookup_key: SUBSCRIPTIONS.STARTER.lookup_key
  },
  {
    name: SUBSCRIPTIONS.PRO.name,
    price: SUBSCRIPTIONS.PRO.price,
    features: [
      'Advanced analytics',
      'Priority email support',
      '10 projects'
    ],
    popular: true,
    lookup_key: SUBSCRIPTIONS.PRO.lookup_key
  },
  {
    name: SUBSCRIPTIONS.ENTERPRISE.name,
    price: SUBSCRIPTIONS.ENTERPRISE.price,
    features: [
      'All features',
      'Dedicated support',
      'Unlimited projects'
    ],
    popular: false,
    lookup_key: SUBSCRIPTIONS.ENTERPRISE.lookup_key
  }
]

async function handleSubscribe(tier) {
  debugger;
  if (!user.value) {

    alert('Please log in to subscribe')
    return
  }

  try {
    loading.value = true
    loadingTier.value = tier.name


    const checkoutUrl = await createCheckoutSession(tier.lookup_key)
    

    window.location.href = checkoutUrl
  } catch (error) {
    console.error('Failed to redirect to checkout:', error)
    alert('Something went wrong. Please try again.')
  } finally {
    loading.value = false
    loadingTier.value = ''
  }
}
</script>

<style scoped>
@media (max-width: 768px) {
  .flex.flex-wrap {
    flex-direction: column;
    align-items: center;
  }
}
</style> 