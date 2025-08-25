<template>
  <button 
    @click="openModal" 
    class="fixed top-4 right-4 w-14 h-14 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full text-white cursor-pointer shadow-lg hover:shadow-xl transition-all duration-200 z-50 flex items-center justify-center hover:scale-105"
  >
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-6 h-6">
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  </button>
</template>

<script setup>
import { useShoppingListStore } from '../stores/shoppingList.js'

const store = useShoppingListStore()

const openModal = () => {
  store.openModal()
}
</script>

<style scoped>
/* Optimisation mobile */
@media (max-width: 768px) {
  button {
    width: 52px !important;
    height: 52px !important;
    transition-duration: 0.15s !important;
  }
  
  svg {
    width: 22px !important;
    height: 22px !important;
  }
}
</style>
