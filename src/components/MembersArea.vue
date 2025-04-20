<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="max-w-4xl mx-auto px-4">
      <div class="bg-white rounded-xl shadow-lg overflow-hidden">
        <div class="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-8 sm:px-10">
          <div class="flex items-center space-x-4">
            <div class="bg-white rounded-full p-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h1 class="text-2xl font-bold text-white">Members Area</h1>
              <p class="text-blue-100">Welcome to your premium content!</p>
            </div>
          </div>
        </div>
        
        <div class="p-6 sm:p-10">
          <div class="mb-8">
            <h2 class="text-xl font-semibold text-gray-800 mb-2">Welcome, {{ user?.email || 'Valued Member' }}!</h2>
            <p class="text-gray-600">Thank you for being a subscriber. Below you'll find your premium resources and tools.</p>
          </div>
          
          <div class="mb-8 bg-blue-50 rounded-lg p-4 border border-blue-100">
            <h3 class="font-semibold text-blue-800 mb-2">Your Subscription</h3>
            <div v-if="subscription" class="text-sm text-gray-700 space-y-2">
              <p><span class="font-medium">Plan:</span> {{ subscriptionName }}</p>
              <p><span class="font-medium">Status:</span> <span class="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs">Active</span></p>
              <p><span class="font-medium">Started:</span> {{ new Date(subscription.created_at).toLocaleDateString() }}</p>
              <p v-if="subscription.current_period_end"><span class="font-medium">Next billing date:</span> {{ new Date(subscription.current_period_end).toLocaleDateString() }}</p>
            </div>
            <div v-else class="text-sm text-gray-700">
              <p>Loading subscription details...</p>
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div v-for="item in premiumContent" :key="item.title" class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <h3 class="font-semibold text-gray-800 mb-2">{{ item.title }}</h3>
              <p class="text-gray-600 text-sm mb-4">{{ item.description }}</p>
              <a :href="item.link" class="text-blue-600 hover:text-blue-800 text-sm font-medium">
                {{ item.linkText }} →
              </a>
            </div>
          </div>
          
          <div class="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <h3 class="font-semibold text-gray-800 mb-2">Need Help?</h3>
            <p class="text-gray-600 text-sm mb-4">If you have any questions about your subscription or need assistance with the premium features, our support team is here to help.</p>
            <button class="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium transition-colors">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useSession } from '../composables/useSession'
import { SUBSCRIPTIONS } from '../utils/constants';

const { user, subscription } = useSession();

const subscriptionName = computed(() => Object.values(SUBSCRIPTIONS).find(s => s.lookup_key === subscription.value?.plan)?.name || 'Unknown');

const premiumContent = [
  {
    title: 'Exclusive Tutorials',
    description: 'Access our library of premium tutorials and guides.',
    link: '#',
    linkText: 'Browse tutorials'
  },
  {
    title: 'Premium Resources',
    description: 'Download templates, code samples, and other resources.',
    link: '#',
    linkText: 'View resources'
  },
  {
    title: 'Priority Support',
    description: 'Get faster responses from our dedicated support team.',
    link: '#',
    linkText: 'Submit a ticket'
  },
  {
    title: 'Community Access',
    description: 'Join our private community of premium members.',
    link: '#',
    linkText: 'Join community'
  }
]
</script> 