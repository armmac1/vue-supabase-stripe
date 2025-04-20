<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
    <div class="max-w-md w-full p-8 bg-white rounded-xl shadow-lg text-center relative overflow-hidden animate-fadeIn">
      <div class="absolute inset-0 pointer-events-none">
        <div v-for="i in 30" :key="i" 
             class="absolute w-2 h-2 rounded-full animate-confetti"
             :style="{ 
               backgroundColor: ['#FFD700', '#FF6347', '#4169E1', '#32CD32', '#9370DB'][Math.floor(Math.random() * 5)], 
               left: `${Math.random() * 100}%`, 
               animationDelay: `${Math.random() * 2}s`,
               animationDuration: `${1 + Math.random() * 3}s`
             }">
        </div>
      </div>
      
      <div class="bg-green-100 rounded-full h-24 w-24 flex items-center justify-center mx-auto mb-6 relative animate-bounceIn">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      
      <h2 class="text-2xl font-bold text-gray-800 mb-4 animate-slideUp">Payment Successful!</h2>
      <p class="text-gray-600 mb-6 animate-slideUp animation-delay-100">Thank you for your subscription. Your account has been upgraded and you now have access to all the premium features.</p>
      
      <div class="mb-8 p-4 bg-gray-50 rounded-lg text-left animate-slideUp animation-delay-200">
        <h3 class="font-semibold text-gray-700 mb-2">Subscription Details:</h3>
        <ul class="space-y-1 text-gray-600 text-sm">
          <li>• Your subscription is now active</li>
          <li>• You'll receive a confirmation email shortly</li>
          <li>• Billing will recur monthly</li>
          <li>• You can manage your subscription in your account settings</li>
        </ul>
      </div>
      
      <div class="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 animate-slideUp animation-delay-300">
        <router-link to="/pricing" class="flex-1 bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-md">
          Return to Dashboard
        </router-link>
        <button class="flex-1 border border-gray-300 text-gray-700 font-semibold px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors">
          View Receipt
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

@keyframes confetti {
  0% { transform: translateY(-10px) rotate(0deg); opacity: 1; }
  100% { transform: translateY(400px) rotate(720deg); opacity: 0; }
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

.animate-confetti {
  animation: confetti 3s ease-in forwards;
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
</style> 