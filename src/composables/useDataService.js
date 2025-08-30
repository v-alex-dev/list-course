import { useDataStore } from '../stores/dataService.js'
import { useOfflineStore } from '../stores/offlineService.js'
import { useToasts } from './useToasts.js'

/**
 * Composable pour utiliser le service de données avec gestion hors ligne
 * Combine dataService et offlineService en une interface unifiée
 */
export function useDataService() {
  const dataStore = useDataStore()
  const offlineStore = useOfflineStore()
  const { error: showError, success: showSuccess, warning: showWarning } = useToasts()

  // Actions avec gestion hors ligne automatique
  const createProfileWithOffline = async (name) => {
    if (!offlineStore.isOnline) {
      offlineStore.addToOfflineQueue({
        type: 'CREATE_PROFILE',
        data: { name },
      })
      showWarning('Profil créé hors ligne, sera synchronisé à la reconnexion')
      return null
    }

    try {
      const profile = await dataStore.createProfile(name)
      showSuccess('Profil créé avec succès')
      return profile
    } catch (error) {
      showError('Erreur lors de la création du profil')
      throw error
    }
  }

  const createShoppingListWithOffline = async (profileId, items = []) => {
    if (!offlineStore.isOnline) {
      offlineStore.addToOfflineQueue({
        type: 'CREATE_LIST',
        data: { profileId, items },
      })
      offlineStore.saveOfflineData(`temp_${Date.now()}`, items)
      showWarning('Liste créée hors ligne, sera synchronisée à la reconnexion')
      return null
    }

    try {
      const list = await dataStore.createShoppingList(profileId, items)
      showSuccess('Liste créée avec succès')
      return list
    } catch (error) {
      // Fallback en mode hors ligne
      offlineStore.addToOfflineQueue({
        type: 'CREATE_LIST',
        data: { profileId, items },
      })
      showError('Erreur lors de la création, sauvegardé pour synchronisation')
      throw error
    }
  }

  const updateShoppingListWithOffline = async (listId, items) => {
    if (!offlineStore.isOnline) {
      offlineStore.addToOfflineQueue({
        type: 'UPDATE_LIST',
        data: { listId, items },
      })
      offlineStore.saveOfflineData(listId, items)
      showWarning('Modifications sauvegardées hors ligne')
      return null
    }

    try {
      const list = await dataStore.updateShoppingList(listId, items)
      showSuccess('Liste mise à jour avec succès')
      return list
    } catch (error) {
      // Fallback en mode hors ligne
      offlineStore.addToOfflineQueue({
        type: 'UPDATE_LIST',
        data: { listId, items },
      })
      offlineStore.saveOfflineData(listId, items)
      showError('Erreur lors de la mise à jour, sauvegardé pour synchronisation')
      throw error
    }
  }

  const syncOfflineData = async () => {
    if (!offlineStore.canSync) {
      showWarning('Synchronisation impossible pour le moment')
      return false
    }

    try {
      const success = await offlineStore.syncOfflineQueue(dataStore)
      if (success) {
        showSuccess('Toutes les données ont été synchronisées')
      } else {
        showWarning("Certaines données n'ont pas pu être synchronisées")
      }
      return success
    } catch (syncError) {
      showError('Erreur lors de la synchronisation')
      console.error('Sync error:', syncError)
      return false
    }
  }

  return {
    // Stores
    dataStore,
    offlineStore,

    // State
    profiles: dataStore.profiles,
    shoppingLists: dataStore.formattedShoppingLists,
    currentProfile: dataStore.currentProfile,
    loading: dataStore.loading,
    error: dataStore.error,
    isOnline: offlineStore.isOnline,
    hasOfflineActions: offlineStore.hasOfflineActions,
    syncing: offlineStore.syncing,

    // Getters
    sortedProfiles: dataStore.sortedProfiles,
    profileById: dataStore.profileById,
    shoppingListsByProfile: dataStore.shoppingListsByProfile,
    latestShoppingList: dataStore.latestShoppingList,

    // Data actions (direct)
    fetchProfiles: dataStore.fetchProfiles,
    getProfile: dataStore.getProfile,
    setCurrentProfile: dataStore.setCurrentProfile,
    fetchShoppingLists: dataStore.fetchShoppingLists,
    deleteShoppingList: dataStore.deleteShoppingList,
    getOrCreateDefaultList: dataStore.getOrCreateDefaultList,

    // Data actions (with offline support)
    createProfile: createProfileWithOffline,
    createShoppingList: createShoppingListWithOffline,
    updateShoppingList: updateShoppingListWithOffline,

    // Offline actions
    syncOfflineData,
    initOffline: offlineStore.init,
    addToOfflineQueue: offlineStore.addToOfflineQueue,
    saveOfflineData: offlineStore.saveOfflineData,
    getOfflineDataForList: offlineStore.getOfflineDataForList,

    // Cache management
    clearCache: dataStore.clearCache,
    isCacheValid: dataStore.isCacheValid,
  }
}
