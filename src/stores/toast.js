import { defineStore } from 'pinia'

export const useToastStore = defineStore('toast', {
  state: () => ({
    toasts: [],
    nextId: 1,
  }),

  getters: {
    activeToasts: (state) => state.toasts.filter((toast) => toast.visible),

    hasErrorToasts: (state) =>
      state.toasts.some((toast) => toast.type === 'error' && toast.visible),

    hasSuccessToasts: (state) =>
      state.toasts.some((toast) => toast.type === 'success' && toast.visible),
  },

  actions: {
    show(message, type = 'info', duration = 2000) {
      const toast = {
        id: this.nextId++,
        message,
        type, // 'success', 'error', 'warning', 'info', 'sync'
        duration,
        visible: true,
        createdAt: Date.now(),
      }

      this.toasts.push(toast)

      // Auto-remove après la durée spécifiée
      if (duration > 0) {
        setTimeout(() => {
          this.hide(toast.id)
        }, duration)
      }

      return toast.id
    },

    hide(id) {
      const toast = this.toasts.find((t) => t.id === id)
      if (toast) {
        toast.visible = false

        // Supprimer complètement après l'animation
        setTimeout(() => {
          this.remove(id)
        }, 300)
      }
    },

    remove(id) {
      const index = this.toasts.findIndex((t) => t.id === id)
      if (index > -1) {
        this.toasts.splice(index, 1)
      }
    },

    clear() {
      this.toasts.forEach((toast) => {
        toast.visible = false
      })

      setTimeout(() => {
        this.toasts = []
      }, 300)
    },

    // Méthodes de convenance avec le style du site
    success(message, duration = 3000) {
      return this.show(message, 'success', duration)
    },

    error(message, duration = 5000) {
      return this.show(message, 'error', duration)
    },

    warning(message, duration = 4000) {
      return this.show(message, 'warning', duration)
    },

    info(message, duration = 3000) {
      return this.show(message, 'info', duration)
    },

    // Toast spécial pour la synchronisation
    sync(message, duration = 0) {
      return this.show(message, 'sync', duration)
    },

    // Notifications spécifiques PWA
    dataSaved() {
      return this.success('✅ Données sauvegardées')
    },

    dataSync() {
      return this.sync('🔄 Synchronisation en cours...')
    },

    dataSynced() {
      return this.success('🌐 Données synchronisées')
    },

    offlineMode() {
      return this.warning('📴 Mode hors ligne activé')
    },

    onlineMode() {
      return this.info('🌐 Connexion rétablie')
    },

    syncError() {
      return this.error('❌ Erreur de synchronisation')
    },

    itemAdded(itemName) {
      return this.success(`➕ "${itemName}" ajouté à la liste`)
    },

    itemRemoved(itemName) {
      return this.info(`🗑️ "${itemName}" supprimé`)
    },

    itemCompleted(itemName) {
      return this.success(`✅ "${itemName}" terminé`)
    },
  },
})
