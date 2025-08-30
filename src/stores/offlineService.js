import { defineStore } from 'pinia'

const OFFLINE_QUEUE_KEY = 'easysholi_offline_queue'
const OFFLINE_DATA_KEY = 'easysholi_offline_data'

export const useOfflineStore = defineStore('offlineService', {
  state: () => ({
    isOnline: navigator.onLine,
    offlineQueue: [],
    offlineData: {},
    syncing: false,
    lastSyncTime: null,
    syncErrors: [],
  }),

  getters: {
    // Status getters
    hasOfflineActions: (state) => state.offlineQueue.length > 0,

    pendingActionsCount: (state) => state.offlineQueue.length,

    hasSyncErrors: (state) => state.syncErrors.length > 0,

    canSync: (state) => state.isOnline && state.offlineQueue.length > 0 && !state.syncing,

    // Queue getters
    queueByType: (state) => (type) => state.offlineQueue.filter((action) => action.type === type),

    latestQueueAction: (state) =>
      state.offlineQueue.length > 0 ? state.offlineQueue[state.offlineQueue.length - 1] : null,

    // Offline data getters
    getOfflineDataForList: (state) => (listId) => state.offlineData[listId] || null,

    hasOfflineDataForList: (state) => (listId) => Boolean(state.offlineData[listId]),
  },

  actions: {
    // ===== CONNECTIVITY =====
    setOnlineStatus(status) {
      this.isOnline = status

      if (status) {
        console.log('🌐 Connexion rétablie')
        // Auto-sync when coming back online
        if (this.hasOfflineActions) {
          this.scheduleSync()
        }
      } else {
        console.log('📴 Connexion perdue')
      }
    },

    setupConnectivityListeners() {
      const handleOnline = () => this.setOnlineStatus(true)
      const handleOffline = () => this.setOnlineStatus(false)

      window.addEventListener('online', handleOnline)
      window.addEventListener('offline', handleOffline)

      // Return cleanup function
      return () => {
        window.removeEventListener('online', handleOnline)
        window.removeEventListener('offline', handleOffline)
      }
    },

    // ===== LOCAL STORAGE =====
    saveToLocalStorage(key, data) {
      try {
        localStorage.setItem(key, JSON.stringify(data))
        console.log(`💾 Données sauvegardées localement: ${key}`)
      } catch (error) {
        console.error('❌ Erreur sauvegarde locale:', error)
      }
    },

    getFromLocalStorage(key) {
      try {
        const data = localStorage.getItem(key)
        return data ? JSON.parse(data) : null
      } catch (error) {
        console.error('❌ Erreur récupération locale:', error)
        return null
      }
    },

    // ===== OFFLINE QUEUE =====
    addToOfflineQueue(action) {
      const newAction = {
        ...action,
        timestamp: Date.now(),
        id: `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      }

      this.offlineQueue.push(newAction)
      this.saveToLocalStorage(OFFLINE_QUEUE_KEY, this.offlineQueue)
      console.log('📦 Action ajoutée à la queue hors ligne:', action.type)
    },

    loadOfflineQueue() {
      const queue = this.getFromLocalStorage(OFFLINE_QUEUE_KEY) || []
      this.offlineQueue = queue
      console.log(`📦 Queue hors ligne chargée: ${queue.length} actions`)
    },

    clearOfflineQueue() {
      this.offlineQueue = []
      localStorage.removeItem(OFFLINE_QUEUE_KEY)
      console.log('🧹 Queue hors ligne vidée')
    },

    removeFromQueue(actionId) {
      this.offlineQueue = this.offlineQueue.filter((action) => action.id !== actionId)
      this.saveToLocalStorage(OFFLINE_QUEUE_KEY, this.offlineQueue)
    },

    // ===== OFFLINE DATA =====
    saveOfflineData(listId, items) {
      this.offlineData[listId] = {
        items: items,
        lastModified: Date.now(),
      }
      this.saveToLocalStorage(OFFLINE_DATA_KEY, this.offlineData)
    },

    loadOfflineData() {
      this.offlineData = this.getFromLocalStorage(OFFLINE_DATA_KEY) || {}
    },

    clearOfflineData(listId) {
      if (listId) {
        delete this.offlineData[listId]
      } else {
        this.offlineData = {}
      }
      this.saveToLocalStorage(OFFLINE_DATA_KEY, this.offlineData)
    },

    // ===== SYNCHRONIZATION =====
    async syncOfflineQueue(dataService) {
      if (!this.isOnline) {
        console.log('📴 Pas de connexion, synchronisation impossible')
        return false
      }

      if (this.offlineQueue.length === 0) {
        console.log('✅ Aucune action à synchroniser')
        return true
      }

      if (this.syncing) {
        console.log('🔄 Synchronisation déjà en cours')
        return false
      }

      this.syncing = true
      this.syncErrors = []

      console.log(`🔄 Synchronisation de ${this.offlineQueue.length} actions...`)

      let successCount = 0
      const failedActions = []

      for (const action of [...this.offlineQueue]) {
        try {
          await this.executeOfflineAction(action, dataService)
          successCount++
          this.removeFromQueue(action.id)
          console.log(`✅ Action synchronisée: ${action.type}`)
        } catch (error) {
          console.error(`❌ Échec synchronisation action ${action.type}:`, error)
          this.syncErrors.push({
            action: action.type,
            error: error.message,
            timestamp: Date.now(),
          })
          failedActions.push(action)
        }
      }

      this.syncing = false
      this.lastSyncTime = Date.now()

      console.log(
        `🎉 Synchronisation terminée: ${successCount}/${successCount + failedActions.length} actions réussies`,
      )
      return failedActions.length === 0
    },

    async executeOfflineAction(action, dataService) {
      switch (action.type) {
        case 'CREATE_LIST': {
          return await dataService.createShoppingList(action.data.profileId, action.data.items)
        }

        case 'UPDATE_LIST': {
          return await dataService.updateShoppingList(action.data.listId, action.data.items)
        }

        case 'ADD_ITEM': {
          // Pour ADD_ITEM, on doit récupérer la liste actuelle et ajouter l'item
          const currentList = await dataService.fetchShoppingLists(action.data.profileId)
          if (currentList.length > 0) {
            const items = currentList[0].items || []
            items.push(action.data.item)
            return await dataService.updateShoppingList(currentList[0].id, items)
          }
          break
        }

        case 'UPDATE_ITEM': {
          // Similaire pour UPDATE_ITEM
          const listForUpdate = await dataService.fetchShoppingLists(action.data.profileId)
          if (listForUpdate.length > 0) {
            const items = listForUpdate[0].items || []
            const itemIndex = items.findIndex((item) => item.id === action.data.itemId)
            if (itemIndex !== -1) {
              items[itemIndex] = { ...items[itemIndex], ...action.data.updates }
              return await dataService.updateShoppingList(listForUpdate[0].id, items)
            }
          }
          break
        }

        case 'DELETE_ITEM': {
          const listForDelete = await dataService.fetchShoppingLists(action.data.profileId)
          if (listForDelete.length > 0) {
            const items = listForDelete[0].items.filter((item) => item.id !== action.data.itemId)
            return await dataService.updateShoppingList(listForDelete[0].id, items)
          }
          break
        }

        default:
          throw new Error(`Type d'action non supporté: ${action.type}`)
      }
    },

    scheduleSync(delay = 1000) {
      setTimeout(() => {
        if (this.canSync) {
          // Injection du dataService sera nécessaire ici
          // this.syncOfflineQueue(dataService)
          console.log('🔄 Synchronisation programmée')
        }
      }, delay)
    },

    // ===== INITIALIZATION =====
    init() {
      this.loadOfflineQueue()
      this.loadOfflineData()
      this.setOnlineStatus(navigator.onLine)

      // Setup connectivity listeners
      const cleanup = this.setupConnectivityListeners()

      // Return cleanup function for component unmounting
      return cleanup
    },

    // ===== ERROR MANAGEMENT =====
    clearSyncErrors() {
      this.syncErrors = []
    },

    getSyncErrorsForAction(actionType) {
      return this.syncErrors.filter((error) => error.action === actionType)
    },
  },
})
