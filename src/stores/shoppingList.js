import { defineStore } from 'pinia'
import { dataService } from '../services/dataService.js'
import { useToastStore } from './toast.js'
import tagsData from '../data/tags.json'

// Clés pour le localStorage
const OFFLINE_QUEUE_KEY = 'easysholi_offline_queue'
const OFFLINE_DATA_KEY = 'easysholi_offline_data'

export const useShoppingListStore = defineStore('shoppingList', {
  state: () => ({
    currentList: null,
    items: [],
    tags: tagsData.tags,
    selectedTags: [],
    isModalOpen: false,
    loading: false,
    error: null,
    isOnline: navigator.onLine,
    pendingSync: false,
    offlineQueue: [],
  }),

  getters: {
    filteredItems: (state) => {
      if (state.selectedTags.length === 0) {
        return state.items
      }
      return state.items.filter((item) => state.selectedTags.includes(item.tagId))
    },

    getTagById: (state) => (id) => {
      return state.tags.find((tag) => tag.id === id)
    },

    completedItemsCount: (state) => {
      return state.items.filter((item) => item.completed).length
    },

    totalItemsCount: (state) => state.items.length,

    uncompletedItems() {
      return this.filteredItems.filter((item) => !item.completed)
    },

    completedItems() {
      return this.filteredItems.filter((item) => item.completed)
    },

    hasOfflineData: (state) => state.offlineQueue.length > 0,

    connectionStatus() {
      if (!this.isOnline) return 'offline'
      if (this.pendingSync) return 'syncing'
      return 'online'
    },
  },

  actions: {
    // ===== GESTION HORS LIGNE =====
    saveToLocalStorage(key, data) {
      try {
        localStorage.setItem(key, JSON.stringify(data))
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

    addToOfflineQueue(action) {
      const queueItem = {
        ...action,
        timestamp: Date.now(),
        id: `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      }

      this.offlineQueue.push(queueItem)
      this.saveToLocalStorage(OFFLINE_QUEUE_KEY, this.offlineQueue)

      this.showToast(`📦 Action sauvegardée hors ligne`, 'warning')
    },

    loadOfflineQueue() {
      this.offlineQueue = this.getFromLocalStorage(OFFLINE_QUEUE_KEY) || []
    },

    clearOfflineQueue() {
      this.offlineQueue = []
      localStorage.removeItem(OFFLINE_QUEUE_KEY)
    },

    saveOfflineData(listId, items) {
      const offlineData = this.getFromLocalStorage(OFFLINE_DATA_KEY) || {}
      offlineData[listId] = {
        items: items,
        lastModified: Date.now(),
      }
      this.saveToLocalStorage(OFFLINE_DATA_KEY, offlineData)
    },

    getOfflineData(listId) {
      const offlineData = this.getFromLocalStorage(OFFLINE_DATA_KEY) || {}
      return offlineData[listId] || null
    },

    // ===== GESTION DES TOASTS =====
    showToast(message, type = 'info') {
      // Utilisation du store toast avec import statique
      const toastStore = useToastStore()
      toastStore.show(message, type)
    },

    // ===== INITIALIZATION =====
    init() {
      // Charger la queue hors ligne
      this.loadOfflineQueue()

      // Configure les écouteurs de connectivité
      window.addEventListener('online', () => this.handleOnline())
      window.addEventListener('offline', () => this.handleOffline())

      // Met à jour l'état initial
      this.isOnline = navigator.onLine

      if (this.isOnline && this.offlineQueue.length > 0) {
        this.syncOfflineData()
      }
    },

    async handleOnline() {
      this.isOnline = true
      this.showToast('🌐 Connexion rétablie', 'info')

      if (this.offlineQueue.length > 0) {
        await this.syncOfflineData()
      }
    },

    handleOffline() {
      this.isOnline = false
      this.showToast('📴 Mode hors ligne activé', 'warning')
    },

    async syncOfflineData() {
      if (!this.isOnline || this.pendingSync || this.offlineQueue.length === 0) return

      this.pendingSync = true
      this.showToast('🔄 Synchronisation en cours...', 'sync')

      try {
        let successCount = 0
        const failedActions = []

        for (const action of this.offlineQueue) {
          try {
            const result = await this.executeOfflineAction(action)
            successCount

            // Si c'était une création de liste offline, mettre à jour la liste actuelle
            if (
              action.type === 'UPDATE_LIST' &&
              typeof action.data.listId === 'string' &&
              action.data.listId.startsWith('offline_') &&
              result
            ) {
              this.currentList = result
            }
          } catch (error) {
            console.error(`❌ Échec synchronisation action ${action.type}:`, error)
            failedActions.push(action)
          }
        }

        // Mettre à jour la queue avec seulement les actions qui ont échoué
        this.offlineQueue = failedActions
        this.saveToLocalStorage(OFFLINE_QUEUE_KEY, this.offlineQueue)

        if (failedActions.length === 0) {
          this.clearOfflineQueue()
          this.showToast('🌐 Données synchronisées', 'success')

          // Recharger les données depuis le serveur pour s'assurer de la cohérence
          if (this.currentList && this.currentList.profile_id) {
            await this.loadShoppingList(this.currentList.profile_id, false)
          }
        } else {
          this.showToast(`⚠️ ${failedActions.length} actions ont échoué`, 'warning')
        }
      } catch (error) {
        console.error('❌ Erreur lors de la synchronisation:', error)
        this.error = 'Erreur lors de la synchronisation des données'
        this.showToast('❌ Erreur de synchronisation', 'error')
      } finally {
        this.pendingSync = false
      }
    },

    async executeOfflineAction(action) {
      switch (action.type) {
        case 'CREATE_LIST': {
          return await dataService.createShoppingList(action.data.profileId, action.data.items)
        }

        case 'UPDATE_LIST': {
          // Si c'est une liste offline, on doit d'abord créer une vraie liste
          if (typeof action.data.listId === 'string' && action.data.listId.startsWith('offline_')) {
            // Pour les listes offline, on fusionne avec les données existantes
            const profileId = action.data.listId.replace('offline_', '')
            const existingLists = await dataService.getShoppingLists(profileId)
            const localItems = action.data.items || []

            if (existingLists.length > 0) {
              // Une liste existe déjà, fusionner les données
              const serverItems = await dataService.getShoppingItems(existingLists[0].id)
              const mergedItems = this.mergeItems(serverItems, localItems)

              return await dataService.updateShoppingList(existingLists[0].id, mergedItems)
            } else {
              // Pas de liste existante, on crée une nouvelle
              return await dataService.createShoppingList(profileId, action.data.items)
            }
          } else {
            // Pour les listes réelles, on fusionne aussi pour éviter l'écrasement
            const currentList = await dataService.getShoppingLists(action.data.profileId)
            if (currentList.length > 0) {
              const serverItems = currentList[0].items || []
              const localItems = action.data.items || []
              const mergedItems = this.mergeItems(serverItems, localItems)

              return await dataService.updateShoppingList(action.data.listId, mergedItems)
            } else {
              return await dataService.updateShoppingList(action.data.listId, action.data.items)
            }
          }
        }

        case 'ADD_ITEM': {
          const currentList = await dataService.getShoppingLists(action.data.profileId)
          if (currentList.length > 0) {
            const items = currentList[0].items || []
            // Vérifier si l'item n'existe pas déjà
            if (!items.find((item) => item.id === action.data.item.id)) {
              items.push(action.data.item)
              return await dataService.updateShoppingList(currentList[0].id, items)
            } else {
              return currentList[0]
            }
          }
          break
        }

        case 'UPDATE_ITEM': {
          const listForUpdate = await dataService.getShoppingLists(action.data.profileId)
          if (listForUpdate.length > 0) {
            const items = listForUpdate[0].items || []
            const itemIndex = items.findIndex((item) => item.id === action.data.itemId)
            if (itemIndex !== -1) {
              // Fusionner les modifications avec gestion des conflits par timestamp
              const serverItem = items[itemIndex]
              const localUpdates = action.data.updates

              // Si on a des timestamps, prendre le plus récent
              if (serverItem.updatedAt && localUpdates.updatedAt) {
                const serverTime = new Date(serverItem.updatedAt).getTime()
                const localTime = new Date(localUpdates.updatedAt).getTime()

                if (localTime > serverTime) {
                  items[itemIndex] = { ...serverItem, ...localUpdates }
                  console.log('🔄 Modification locale plus récente appliquée:', serverItem.name)
                } else {
                  console.log(
                    '⚠️ Modification serveur plus récente, synchronisation ignorée:',
                    serverItem.name,
                  )
                  return listForUpdate[0]
                }
              } else {
                // Pas de timestamp, on applique les modifications locales
                items[itemIndex] = { ...serverItem, ...localUpdates }
              }

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

    // ===== FUSION INTELLIGENTE DES ITEMS =====
    mergeItems(serverItems, localItems) {
      const mergedItems = [...serverItems]
      const serverIds = new Set(serverItems.map((item) => item.id))

      // Créer un index des noms normalisés pour détecter les doublons
      const serverNameMap = new Map()
      serverItems.forEach((item, index) => {
        const normalizedName = this.normalizeName(item.name)
        serverNameMap.set(normalizedName, { item, index })
      })

      localItems.forEach((localItem) => {
        const localNormalizedName = this.normalizeName(localItem.name)
        const existingByName = serverNameMap.get(localNormalizedName)

        if (!serverIds.has(localItem.id)) {
          // Nouveau ID local
          if (existingByName) {
            // Même nom mais ID différent = doublon détecté
            console.log(
              `🔍 Doublon détecté: "${localItem.name}" existe déjà comme "${existingByName.item.name}"`,
            )

            // Fusionner les informations (prendre le plus récent ou merger les quantités)
            const serverItem = existingByName.item
            const mergedItem = this.mergeDuplicateItems(serverItem, localItem)
            mergedItems[existingByName.index] = mergedItem

            this.showToast(`🔄 "${localItem.name}" fusionné avec l'existant`, 'info')
          } else {
            // Vraiment nouveau item
            mergedItems.push(localItem)
            console.log('➕ Nouvel item local ajouté:', localItem.name)
          }
        } else {
          // Item existant avec même ID, fusionner en cas de conflit
          const serverItemIndex = mergedItems.findIndex((item) => item.id === localItem.id)
          const serverItem = mergedItems[serverItemIndex]

          // Gestion des conflits par timestamp
          if (serverItem.updatedAt && localItem.updatedAt) {
            const serverTime = new Date(serverItem.updatedAt).getTime()
            const localTime = new Date(localItem.updatedAt).getTime()

            if (localTime > serverTime) {
              mergedItems[serverItemIndex] = { ...serverItem, ...localItem }
              console.log('🔄 Modification locale plus récente:', localItem.name)
            } else {
              console.log('⚠️ Modification serveur conservée:', serverItem.name)
            }
          } else if (localItem.updatedAt) {
            // Le local a un timestamp mais pas le serveur, prendre le local
            mergedItems[serverItemIndex] = { ...serverItem, ...localItem }
            console.log('🔄 Modification locale appliquée:', localItem.name)
          }
          // Si aucun timestamp ou que le serveur est plus récent, on garde la version serveur
        }
      })

      return mergedItems
    },

    // ===== NORMALISATION ET FUSION DES DOUBLONS =====
    normalizeName(name) {
      return name.toLowerCase().trim().replace(/\s+/g, ' ')
    },

    mergeDuplicateItems(serverItem, localItem) {
      // Prendre la version la plus récente basée sur les timestamps
      if (serverItem.updatedAt && localItem.updatedAt) {
        const serverTime = new Date(serverItem.updatedAt).getTime()
        const localTime = new Date(localItem.updatedAt).getTime()

        if (localTime > serverTime) {
          // Version locale plus récente, mais garder l'ID du serveur
          return {
            ...localItem,
            id: serverItem.id, // Garder l'ID original pour éviter les doublons futurs
            quantity: (serverItem.quantity || 1) + (localItem.quantity || 1), // Additionner les quantités
            updatedAt: localItem.updatedAt,
          }
        } else {
          // Version serveur plus récente, mais peut-être additionner les quantités
          return {
            ...serverItem,
            quantity: (serverItem.quantity || 1) + (localItem.quantity || 1),
            updatedAt: serverItem.updatedAt,
          }
        }
      } else {
        // Pas de timestamps, fusionner en additionnant les quantités
        return {
          ...serverItem,
          quantity: (serverItem.quantity || 1) + (localItem.quantity || 1),
          updatedAt: new Date().toISOString(),
        }
      }
    },

    // ===== GESTION DE LA LISTE COURANTE =====
    async loadShoppingList(profileId, useOfflineFirst = true) {
      this.loading = true
      this.error = null
      try {
        // Si hors ligne ou si demandé, essayer d'abord les données locales
        if (useOfflineFirst && (!this.isOnline || this.getOfflineData(profileId))) {
          const offlineData = this.getOfflineData(profileId)
          if (offlineData) {
            console.log('📱 Chargement des données hors ligne')
            this.items = offlineData.items
            this.currentList = {
              id: `offline_${profileId}`,
              profile_id: profileId,
              items: offlineData.items,
            }

            // Si on est en ligne, essayer de synchroniser en arrière-plan
            if (this.isOnline) {
              this.syncOfflineData()
            }
            return
          }
        }

        // Chargement depuis le serveur
        if (this.isOnline) {
          const lists = await dataService.getShoppingLists(profileId)

          if (lists.length > 0) {
            // Prendre la liste la plus récente
            this.currentList = lists[0]
            this.items = this.currentList.items || []
          } else {
            // Créer une nouvelle liste si aucune n'existe
            this.currentList = await dataService.createShoppingList(profileId, [])
            this.items = []
          }

          // Sauvegarder en local
          this.saveOfflineData(profileId, this.items)
          console.log('✅ Liste de courses chargée depuis le serveur:', this.currentList.id)
          this.showToast('✅ Liste chargée', 'success')
        } else {
          // Hors ligne et pas de données locales
          console.log("📴 Hors ligne: création d'une liste temporaire")
          this.currentList = {
            id: `offline_${profileId}`,
            profile_id: profileId,
            items: [],
          }
          this.items = []
        }
      } catch (error) {
        console.error('❌ Erreur lors du chargement de la liste:', error)
        this.error = 'Erreur lors du chargement de la liste de courses'

        // En cas d'erreur, essayer les données hors ligne
        const offlineData = this.getOfflineData(profileId)
        if (offlineData) {
          console.log('🔄 Utilisation des données hors ligne de secours')
          this.items = offlineData.items
          this.currentList = {
            id: `offline_${profileId}`,
            profile_id: profileId,
            items: offlineData.items,
          }
          this.showToast('📱 Données hors ligne chargées', 'warning')
        } else {
          this.items = []
          this.currentList = null
          this.showToast('❌ Erreur de chargement', 'error')
        }
      } finally {
        this.loading = false
      }
    },

    async saveShoppingList() {
      if (!this.currentList) return

      // Toujours sauvegarder en local en premier
      this.saveOfflineData(this.currentList.profile_id, this.items)

      // Si en ligne, essayer de sauvegarder sur le serveur
      if (this.isOnline) {
        this.loading = true
        this.error = null
        try {
          // Si c'est une liste offline, on doit la créer en base
          if (
            typeof this.currentList.id === 'string' &&
            this.currentList.id.startsWith('offline_')
          ) {
            console.log("🔄 Création d'une nouvelle liste en base pour les données hors ligne")
            const newList = await dataService.createShoppingList(
              this.currentList.profile_id,
              this.items,
            )
            this.currentList = newList
            console.log('✅ Nouvelle liste créée:', newList.id)
            this.showToast('✅ Liste créée en ligne', 'success')
          } else {
            // Mise à jour d'une liste existante
            const updatedList = await dataService.updateShoppingList(
              this.currentList.id,
              this.items,
            )
            this.currentList = updatedList
            console.log('✅ Liste sauvegardée sur le serveur')
            this.showToast('✅ Données sauvegardées', 'success')
          }
        } catch (error) {
          console.error('❌ Erreur lors de la sauvegarde serveur:', error)
          // Ajouter à la queue hors ligne
          this.addToOfflineQueue({
            type: 'UPDATE_LIST',
            data: {
              listId: this.currentList.id,
              items: this.items,
              profileId: this.currentList.profile_id,
            },
          })
          console.log('📦 Action ajoutée à la queue hors ligne')
        } finally {
          this.loading = false
        }
      } else {
        // Hors ligne: ajouter à la queue
        this.addToOfflineQueue({
          type: 'UPDATE_LIST',
          data: {
            listId: this.currentList.id,
            items: this.items,
            profileId: this.currentList.profile_id,
          },
        })
        console.log('📴 Sauvegarde hors ligne, ajoutée à la queue')
      }
    },

    // ===== GESTION DES ITEMS =====
    async addItem(newItem) {
      const item = {
        id: Date.now().toString(),
        name: newItem.name,
        quantity: newItem.quantity || 1,
        tagId: newItem.tagId,
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      this.items.push(item)
      await this.saveShoppingList()

      // Toast de confirmation
      this.showToast(`➕ "${item.name}" ajouté à la liste`, 'success')
    },

    async updateItem(itemId, updates) {
      const index = this.items.findIndex((item) => item.id === itemId)
      if (index !== -1) {
        const oldItem = { ...this.items[index] }
        this.items[index] = {
          ...this.items[index],
          ...updates,
          updatedAt: new Date().toISOString(),
        }
        await this.saveShoppingList()

        // Toast spécifique selon le type de mise à jour
        if (updates.completed !== undefined) {
          const action = updates.completed ? 'terminé' : 'réactivé'
          this.showToast(
            `${updates.completed ? '✅' : '🔄'} "${oldItem.name}" ${action}`,
            'success',
          )
        } else {
          this.showToast(`✏️ "${oldItem.name}" modifié`, 'info')
        }
      }
    },

    async toggleItemCompleted(itemId) {
      const item = this.items.find((item) => item.id === itemId)
      if (item) {
        item.completed = !item.completed
        item.updatedAt = new Date().toISOString()
        await this.saveShoppingList()

        // Toast spécifique
        const action = item.completed ? 'terminé' : 'réactivé'
        const icon = item.completed ? '✅' : '🔄'
        this.showToast(`${icon} "${item.name}" ${action}`, 'success')
      }
    },

    async deleteItem(itemId) {
      const item = this.items.find((item) => item.id === itemId)
      const itemName = item ? item.name : 'Élément'

      this.items = this.items.filter((item) => item.id !== itemId)
      await this.saveShoppingList()

      // Toast de confirmation
      this.showToast(`🗑️ "${itemName}" supprimé`, 'info')
    },

    async clearCompleted() {
      const completedCount = this.items.filter((item) => item.completed).length
      this.items = this.items.filter((item) => !item.completed)
      await this.saveShoppingList()

      if (completedCount > 0) {
        this.showToast(
          `🧹 ${completedCount} élément${completedCount > 1 ? 's' : ''} supprimé${completedCount > 1 ? 's' : ''}`,
          'info',
        )
      }
    },

    // ===== GESTION DES FILTRES =====
    toggleTagFilter(tagId) {
      const index = this.selectedTags.indexOf(tagId)
      if (index > -1) {
        this.selectedTags.splice(index, 1)
      } else {
        this.selectedTags.push(tagId)
      }
    },

    clearFilters() {
      this.selectedTags = []
    },

    // ===== GESTION DE LA MODAL =====
    openModal() {
      this.isModalOpen = true
    },

    closeModal() {
      this.isModalOpen = false
    },

    // ===== NETTOYAGE =====
    reset() {
      this.currentList = null
      this.items = []
      this.selectedTags = []
      this.isModalOpen = false
      this.loading = false
      this.error = null
      this.isOnline = navigator.onLine
      this.pendingSync = false
    },
  },
})
