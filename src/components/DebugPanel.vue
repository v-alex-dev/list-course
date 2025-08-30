<template>
  <!-- Debug Panel - Affiché seulement en développement -->
  <div
    v-if="isDev && (hasOfflineData || offlineQueue.length > 0)"
    class="fixed bottom-4 left-4 z-40 p-4 max-w-sm backdrop-blur-xl bg-gradient-to-br from-slate-900/90 to-slate-800/90 border border-purple-500/30 rounded-2xl shadow-2xl shadow-purple-500/25"
  >
    <div class="flex items-center gap-2 mb-3">
      <div class="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></div>
      <h3 class="text-sm font-semibold text-white">Debug PWA</h3>
    </div>

    <!-- Statut de connexion -->
    <div class="mb-3 text-xs">
      <span class="text-gray-300">Statut:</span>
      <span
        :class="{
          'text-green-400': isOnline && !pendingSync,
          'text-orange-400': pendingSync,
          'text-red-400': !isOnline,
        }"
        class="ml-1 font-medium"
      >
        {{ connectionStatus }}
      </span>
    </div>

    <!-- Queue hors ligne -->
    <div v-if="offlineQueue.length > 0" class="mb-3">
      <div class="text-xs text-gray-300 mb-1">Queue hors ligne ({{ offlineQueue.length }})</div>
      <div class="space-y-1 max-h-32 overflow-y-auto">
        <div
          v-for="action in offlineQueue.slice(-5)"
          :key="action.id"
          class="text-xs p-2 bg-purple-500/20 rounded border border-purple-500/30"
        >
          <div class="text-purple-300 font-medium">{{ action.type }}</div>
          <div class="text-gray-400 text-xs">
            {{ formatTime(action.timestamp) }}
          </div>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex gap-2">
      <button
        v-if="isOnline && offlineQueue.length > 0"
        @click="syncNow"
        :disabled="pendingSync"
        class="flex-1 px-3 py-1 text-xs bg-purple-500 hover:bg-purple-600 disabled:opacity-50 text-white rounded-lg transition-colors"
      >
        {{ pendingSync ? 'Sync...' : 'Sync' }}
      </button>

      <button
        v-if="offlineQueue.length > 0"
        @click="clearQueue"
        class="px-3 py-1 text-xs bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
      >
        Clear
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useShoppingListStore } from '../stores/shoppingList.js'

const shoppingListStore = useShoppingListStore()

// Vérifier si on est en mode développement
const isDev = computed(() => import.meta.env.DEV)

const isOnline = computed(() => shoppingListStore.isOnline)
const pendingSync = computed(() => shoppingListStore.pendingSync)
const offlineQueue = computed(() => shoppingListStore.offlineQueue)
const hasOfflineData = computed(() => shoppingListStore.hasOfflineData)

const connectionStatus = computed(() => {
  if (!isOnline.value) return 'Hors ligne'
  if (pendingSync.value) return 'Synchronisation'
  return 'En ligne'
})

function formatTime(timestamp) {
  return new Date(timestamp).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

function syncNow() {
  shoppingListStore.syncOfflineData()
}

function clearQueue() {
  if (confirm('Vider la queue hors ligne ? Les données non synchronisées seront perdues.')) {
    shoppingListStore.clearOfflineQueue()
  }
}
</script>
