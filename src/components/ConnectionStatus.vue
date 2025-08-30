<template>
  <div
    v-if="!isOnline || pendingSync"
    class="fixed top-4 right-4 z-50 flex items-center gap-2 px-3 py-2 rounded-lg shadow-lg text-sm font-medium transition-all duration-300"
    :class="statusClass"
  >
    <!-- Icône de statut -->
    <div class="flex items-center justify-center w-4 h-4">
      <!-- Hors ligne -->
      <svg v-if="!isOnline" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path
          fill-rule="evenodd"
          d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
          clip-rule="evenodd"
        />
        <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M16 1L4 13" />
      </svg>

      <!-- Synchronisation en cours -->
      <svg v-else-if="pendingSync" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    </div>

    <!-- Texte de statut -->
    <span>{{ statusText }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useShoppingListStore } from '../stores/shoppingList.js'

const shoppingListStore = useShoppingListStore()

const isOnline = computed(() => shoppingListStore.isOnline)
const pendingSync = computed(() => shoppingListStore.pendingSync)

const statusClass = computed(() => {
  if (!isOnline.value) {
    return 'bg-red-500 text-white'
  } else if (pendingSync.value) {
    return 'bg-orange-500 text-white'
  }
  return 'bg-green-500 text-white'
})

const statusText = computed(() => {
  if (!isOnline.value) {
    return 'Mode hors ligne'
  } else if (pendingSync.value) {
    return 'Synchronisation...'
  }
  return 'En ligne'
})
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fixed {
  animation: fadeIn 0.3s ease-out;
}
</style>
