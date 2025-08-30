/**
 * Service de gestion des toasts
 * Gère l'affichage des notifications avec le style glassmorphism dark néon
 */

import { ref, reactive } from 'vue'

// État global des toasts
const toasts = ref([])
let toastId = 0

export const toastService = {
  toasts,

  /**
   * Affiche un toast de succès
   */
  success(message, duration = 4000) {
    this.show({
      type: 'success',
      message,
      duration,
      icon: 'check',
    })
  },

  /**
   * Affiche un toast d'information
   */
  info(message, duration = 4000) {
    this.show({
      type: 'info',
      message,
      duration,
      icon: 'info',
    })
  },

  /**
   * Affiche un toast d'avertissement
   */
  warning(message, duration = 5000) {
    this.show({
      type: 'warning',
      message,
      duration,
      icon: 'warning',
    })
  },

  /**
   * Affiche un toast d'erreur
   */
  error(message, duration = 6000) {
    this.show({
      type: 'error',
      message,
      duration,
      icon: 'error',
    })
  },

  /**
   * Affiche un toast de synchronisation
   */
  sync(message, duration = 3000) {
    this.show({
      type: 'sync',
      message,
      duration,
      icon: 'sync',
    })
  },

  /**
   * Affiche un toast personnalisé
   */
  show(toast) {
    const newToast = reactive({
      id: ++toastId,
      type: toast.type || 'info',
      message: toast.message,
      duration: toast.duration || 4000,
      icon: toast.icon || 'info',
      visible: false,
    })

    toasts.value.push(newToast)

    // Animer l'entrée
    setTimeout(() => {
      newToast.visible = true
    }, 50)

    // Auto-suppression
    if (newToast.duration > 0) {
      setTimeout(() => {
        this.remove(newToast.id)
      }, newToast.duration)
    }

    return newToast.id
  },

  /**
   * Supprime un toast
   */
  remove(id) {
    const index = toasts.value.findIndex((toast) => toast.id === id)
    if (index > -1) {
      const toast = toasts.value[index]
      toast.visible = false

      // Supprimer après l'animation de sortie
      setTimeout(() => {
        const currentIndex = toasts.value.findIndex((t) => t.id === id)
        if (currentIndex > -1) {
          toasts.value.splice(currentIndex, 1)
        }
      }, 300)
    }
  },

  /**
   * Supprime tous les toasts
   */
  clear() {
    toasts.value.forEach((toast) => {
      toast.visible = false
    })

    setTimeout(() => {
      toasts.value.splice(0)
    }, 300)
  },
}
