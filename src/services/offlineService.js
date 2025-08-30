/**
 * Service de gestion des données hors ligne
 * Gère la mise en cache locale et la synchronisation quand la connexion revient
 */

const OFFLINE_QUEUE_KEY = 'easysholi_offline_queue'
const OFFLINE_DATA_KEY = 'easysholi_offline_data'

export const offlineService = {
  /**
   * Vérifie si l'application est en ligne
   */
  isOnline() {
    return navigator.onLine
  },

  /**
   * Sauvegarde des données localement
   */
  saveToLocalStorage(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data))
      console.log(`💾 Données sauvegardées localement: ${key}`)
    } catch (error) {
      console.error('❌ Erreur sauvegarde locale:', error)
    }
  },

  /**
   * Récupère des données depuis le stockage local
   */
  getFromLocalStorage(key) {
    try {
      const data = localStorage.getItem(key)
      return data ? JSON.parse(data) : null
    } catch (error) {
      console.error('❌ Erreur récupération locale:', error)
      return null
    }
  },

  /**
   * Ajoute une action à la queue hors ligne
   */
  addToOfflineQueue(action) {
    const queue = this.getOfflineQueue()
    queue.push({
      ...action,
      timestamp: Date.now(),
      id: `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    })
    this.saveToLocalStorage(OFFLINE_QUEUE_KEY, queue)
    console.log('📦 Action ajoutée à la queue hors ligne:', action.type)
  },

  /**
   * Récupère la queue des actions hors ligne
   */
  getOfflineQueue() {
    return this.getFromLocalStorage(OFFLINE_QUEUE_KEY) || []
  },

  /**
   * Vide la queue hors ligne
   */
  clearOfflineQueue() {
    localStorage.removeItem(OFFLINE_QUEUE_KEY)
    console.log('🧹 Queue hors ligne vidée')
  },

  /**
   * Sauvegarde les données de la liste hors ligne
   */
  saveOfflineData(listId, items) {
    const offlineData = this.getFromLocalStorage(OFFLINE_DATA_KEY) || {}
    offlineData[listId] = {
      items: items,
      lastModified: Date.now(),
    }
    this.saveToLocalStorage(OFFLINE_DATA_KEY, offlineData)
  },

  /**
   * Récupère les données hors ligne pour une liste
   */
  getOfflineData(listId) {
    const offlineData = this.getFromLocalStorage(OFFLINE_DATA_KEY) || {}
    return offlineData[listId] || null
  },

  /**
   * Supprime les données hors ligne pour une liste
   */
  clearOfflineData(listId) {
    const offlineData = this.getFromLocalStorage(OFFLINE_DATA_KEY) || {}
    delete offlineData[listId]
    this.saveToLocalStorage(OFFLINE_DATA_KEY, offlineData)
  },

  /**
   * Synchronise la queue hors ligne avec le serveur
   */
  async syncOfflineQueue(dataService) {
    if (!this.isOnline()) {
      console.log('📴 Pas de connexion, synchronisation impossible')
      return false
    }

    const queue = this.getOfflineQueue()
    if (queue.length === 0) {
      console.log('✅ Aucune action à synchroniser')
      return true
    }

    console.log(`🔄 Synchronisation de ${queue.length} actions...`)

    let successCount = 0
    const failedActions = []

    for (const action of queue) {
      try {
        await this.executeOfflineAction(action, dataService)
        successCount++
        console.log(`✅ Action synchronisée: ${action.type}`)
      } catch (error) {
        console.error(`❌ Échec synchronisation action ${action.type}:`, error)
        failedActions.push(action)
      }
    }

    // Mettre à jour la queue avec seulement les actions qui ont échoué
    if (failedActions.length > 0) {
      this.saveToLocalStorage(OFFLINE_QUEUE_KEY, failedActions)
      console.log(`⚠️ ${failedActions.length} actions ont échoué et restent en queue`)
    } else {
      this.clearOfflineQueue()
    }

    console.log(`🎉 Synchronisation terminée: ${successCount}/${queue.length} actions réussies`)
    return failedActions.length === 0
  },

  /**
   * Exécute une action de la queue hors ligne
   */
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
        const currentList = await dataService.getShoppingLists(action.data.profileId)
        if (currentList.length > 0) {
          const items = currentList[0].items || []
          items.push(action.data.item)
          return await dataService.updateShoppingList(currentList[0].id, items)
        }
        break
      }

      case 'UPDATE_ITEM': {
        // Similaire pour UPDATE_ITEM
        const listForUpdate = await dataService.getShoppingLists(action.data.profileId)
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
        const listForDelete = await dataService.getShoppingLists(action.data.profileId)
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

  /**
   * Configure les écouteurs d'événements pour la connectivité
   */
  setupConnectivityListeners(onOnline, onOffline) {
    window.addEventListener('online', () => {
      console.log('🌐 Connexion rétablie')
      if (onOnline) onOnline()
    })

    window.addEventListener('offline', () => {
      console.log('📴 Connexion perdue')
      if (onOffline) onOffline()
    })
  },
}
