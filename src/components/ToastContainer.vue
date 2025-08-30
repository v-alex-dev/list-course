<template>
  <!-- Container des toasts -->
  <Teleport to="body">
    <div
      v-if="activeToasts.length > 0"
      class="fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none"
    >
      <div v-for="toast in activeToasts" :key="toast.id">
        <div v-if="toast.visible" :class="toastClasses(toast)" class="pointer-events-auto">
          <!-- Message seulement -->
          <div class="text-sm font-medium">
            {{ toast.message }}
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'
import { useToastStore } from '../stores/toast.js'

const toastStore = useToastStore()

const activeToasts = computed(() => toastStore.activeToasts)

function toastClasses(toast) {
  const baseClasses = [
    'p-4 min-w-[280px] max-w-md',
    'backdrop-blur-xl rounded-2xl shadow-2xl',
    'text-white font-medium text-center',
    'transition-all duration-300',
  ]

  // Styles néon selon le type avec couleurs de l'app
  switch (toast.type) {
    case 'success':
      baseClasses.push(
        'bg-gradient-to-br from-slate-900/95 to-slate-800/95',
        'border-2 border-green-400/60',
        'shadow-green-500/30',
        'shadow-[0_0_20px_rgba(34,197,94,0.3)]',
      )
      break
    case 'error':
      baseClasses.push(
        'bg-gradient-to-br from-slate-900/95 to-slate-800/95',
        'border-2 border-red-400/60',
        'shadow-red-500/30',
        'shadow-[0_0_20px_rgba(239,68,68,0.3)]',
      )
      break
    case 'warning':
      baseClasses.push(
        'bg-gradient-to-br from-slate-900/95 to-slate-800/95',
        'border-2 border-orange-400/60',
        'shadow-orange-500/30',
        'shadow-[0_0_20px_rgba(249,115,22,0.3)]',
      )
      break
    case 'info':
    case 'sync':
    default:
      baseClasses.push(
        'bg-gradient-to-br from-slate-900/95 to-slate-800/95',
        'border-2 border-cyan-400/60',
        'shadow-cyan-500/30',
        'shadow-[0_0_20px_rgba(6,182,212,0.3)]',
      )
  }

  return baseClasses.join(' ')
}
</script>

<style scoped>
/* Pas d'animations */
</style>
