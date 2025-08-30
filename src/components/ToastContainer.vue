<template>
  <!-- Container des toasts -->
  <Teleport to="body">
    <div
      v-if="activeToasts.length > 0"
      class="fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none"
    >
      <Transition v-for="toast in activeToasts" :key="toast.id" name="toast" appear>
        <div
          v-if="toast.visible"
          :class="toastClasses(toast)"
          class="pointer-events-auto cursor-pointer transform transition-all duration-300 hover:scale-105"
          @click="hideToast(toast.id)"
        >
          <!-- Icône -->
          <div class="flex-shrink-0">
            <!-- Success Icon -->
            <svg
              v-if="toast.type === 'success'"
              :class="iconClasses(toast)"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clip-rule="evenodd"
              />
            </svg>

            <!-- Error Icon -->
            <svg
              v-else-if="toast.type === 'error'"
              :class="iconClasses(toast)"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clip-rule="evenodd"
              />
            </svg>

            <!-- Warning Icon -->
            <svg
              v-else-if="toast.type === 'warning'"
              :class="iconClasses(toast)"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clip-rule="evenodd"
              />
            </svg>

            <!-- Sync Icon -->
            <svg
              v-else-if="toast.type === 'sync'"
              :class="iconClasses(toast) + ' animate-spin'"
              fill="none"
              viewBox="0 0 24 24"
            >
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

            <!-- Info Icon (default) -->
            <svg v-else :class="iconClasses(toast)" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clip-rule="evenodd"
              />
            </svg>
          </div>

          <!-- Message -->
          <div class="flex-1 text-sm font-medium">
            {{ toast.message }}
          </div>

          <!-- Bouton fermer -->
          <button
            @click.stop="hideToast(toast.id)"
            class="flex-shrink-0 ml-2 p-1 rounded-full hover:bg-white/10 transition-colors duration-200"
            aria-label="Fermer"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
              />
            </svg>
          </button>

          <!-- Barre de progression pour les toasts temporaires -->
          <div
            v-if="toast.duration > 0"
            class="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-cyan-400 to-purple-500 transition-all duration-300 ease-linear"
            :style="{ width: getProgressWidth(toast) + '%' }"
          ></div>
        </div>
      </Transition>
    </div>
  </Teleport>
</template>

<script setup>
import { computed, onMounted, onUnmounted } from 'vue'
import { useToastStore } from '../stores/toast.js'

const toastStore = useToastStore()

const activeToasts = computed(() => toastStore.activeToasts)

function toastClasses(toast) {
  const baseClasses = [
    'relative flex items-center gap-3 p-4 min-w-[320px] max-w-md',
    'backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl',
    'bg-gradient-to-br from-slate-900/90 to-slate-800/90',
    'text-white overflow-hidden',
  ]

  // Couleurs spécifiques selon le type avec le thème néon
  switch (toast.type) {
    case 'success':
      baseClasses.push('shadow-cyan-500/25 border-cyan-500/30')
      break
    case 'error':
      baseClasses.push('shadow-red-500/25 border-red-500/30')
      break
    case 'warning':
      baseClasses.push('shadow-orange-500/25 border-orange-500/30')
      break
    case 'sync':
      baseClasses.push('shadow-purple-500/25 border-purple-500/30')
      break
    default:
      baseClasses.push('shadow-blue-500/25 border-blue-500/30')
  }

  return baseClasses.join(' ')
}

function iconClasses(toast) {
  const baseClasses = ['w-5 h-5 flex-shrink-0']

  switch (toast.type) {
    case 'success':
      baseClasses.push('text-cyan-400')
      break
    case 'error':
      baseClasses.push('text-red-400')
      break
    case 'warning':
      baseClasses.push('text-orange-400')
      break
    case 'sync':
      baseClasses.push('text-purple-400')
      break
    default:
      baseClasses.push('text-blue-400')
  }

  return baseClasses.join(' ')
}

function hideToast(id) {
  toastStore.hide(id)
}

// Calculer la largeur de la barre de progression
function getProgressWidth(toast) {
  if (toast.duration <= 0) return 100

  const elapsed = Date.now() - toast.createdAt
  const progress = Math.max(0, 100 - (elapsed / toast.duration) * 100)
  return progress
}

// Mettre à jour la barre de progression
let progressInterval = null

onMounted(() => {
  // Mettre à jour la barre de progression toutes les 100ms
  progressInterval = setInterval(() => {
    // Force reactive update (les computed se mettront à jour automatiquement)
  }, 100)
})

onUnmounted(() => {
  if (progressInterval) {
    clearInterval(progressInterval)
  }
})
</script>

<style scoped>
/* Transitions pour les toasts */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%) scale(0.9);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%) scale(0.9);
}

/* Effet de glow subtil */
.relative::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(6, 182, 212, 0.1), rgba(168, 85, 247, 0.1));
  border-radius: inherit;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.relative:hover::before {
  opacity: 1;
}

/* Animation de la barre de progression */
.absolute.bottom-0 {
  border-radius: 0 0 1rem 1rem;
}
</style>
