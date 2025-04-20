<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white p-4">
    <div class="max-w-md w-full p-8 bg-white rounded-xl shadow-lg text-center animate-fadeIn">
      <div class="bg-amber-100 rounded-full h-24 w-24 flex items-center justify-center mx-auto mb-6 animate-bounceIn">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </div>
      
      <h2 class="text-2xl font-bold text-gray-800 mb-4 animate-slideUp">Checkout Cancelled</h2>
      <p class="text-gray-600 mb-6 animate-slideUp animation-delay-100">No worries! Your checkout process was cancelled and no payment has been made.</p>
      
      <div class="mb-8 p-4 bg-gray-50 rounded-lg text-left animate-slideUp animation-delay-200">
        <h3 class="font-semibold text-gray-700 mb-2">Common Reasons for Cancellation:</h3>
        <ul class="space-y-1 text-gray-600 text-sm">
          <li>• Reconsidering plan options</li>
          <li>• Need more information before purchasing</li>
          <li>• Payment method issues</li>
          <li>• Changed mind about subscription</li>
        </ul>
      </div>
      
      <div class="mb-8 p-4 bg-blue-50 rounded-lg text-left animate-slideUp animation-delay-300">
        <h3 class="font-semibold text-blue-700 mb-2">Need Help?</h3>
        <p class="text-blue-600 text-sm">
          If you encountered any issues during checkout or have questions about our subscription plans, 
          please contact our support team at <a href="mailto:support@example.com" class="underline">support@example.com</a>.
        </p>
      </div>
      
      <div class="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 animate-slideUp animation-delay-400">
        <router-link to="/pricing" class="flex-1 bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-md">
          Return to Pricing
        </router-link>
        <button class="flex-1 border border-gray-300 text-gray-700 font-semibold px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors">
          Contact Support
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes bounceIn {
  0% { opacity: 0; transform: scale(0.3); }
  50% { opacity: 1; transform: scale(1.05); }
  70% { transform: scale(0.9); }
  100% { transform: scale(1); }
}

.animate-fadeIn {
  animation: fadeIn 0.5s ease-out forwards;
}

.animate-slideUp {
  animation: slideUp 0.6s ease-out forwards;
}

.animate-bounceIn {
  animation: bounceIn 0.8s ease-out forwards;
}

.animation-delay-100 {
  animation-delay: 0.1s;
}

.animation-delay-200 {
  animation-delay: 0.2s;
}

.animation-delay-300 {
  animation-delay: 0.3s;
}

.animation-delay-400 {
  animation-delay: 0.4s;
}
</style> 