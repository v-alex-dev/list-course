import { computed } from 'vue'
import { useShoppingListStore } from '../stores/shoppingList.js'
import { useProfileStore } from '../stores/profiles.js'

export function useLoading() {
  const shoppingStore = useShoppingListStore()
  const profileStore = useProfileStore()

  // État de loading global
  const isLoading = computed(() => {
    return shoppingStore.loading || profileStore.loading || shoppingStore.pendingSync
  })

  // États spécifiques
  const isLoadingProfiles = computed(() => profileStore.loading)
  const isLoadingShoppingList = computed(() => shoppingStore.loading)
  const isSyncing = computed(() => shoppingStore.pendingSync)

  // États granulaires
  const isAddingItem = computed(() => shoppingStore.loadingStates.addingItem)
  const isUpdatingItem = computed(() => shoppingStore.loadingStates.updatingItem)
  const isDeletingItem = computed(() => shoppingStore.loadingStates.deletingItem)
  const isSaving = computed(() => shoppingStore.loadingStates.saving)

  // Messages de loading contextuels
  const loadingMessage = computed(() => {
    if (profileStore.loading) return 'Chargement des profils...'
    if (shoppingStore.loading) return 'Chargement de la liste...'
    if (shoppingStore.pendingSync) return 'Synchronisation en cours...'
    if (isAddingItem.value) return 'Ajout en cours...'
    if (isSaving.value) return 'Sauvegarde...'
    return ''
  })

  return {
    isLoading,
    isLoadingProfiles,
    isLoadingShoppingList,
    isSyncing,
    isAddingItem,
    isUpdatingItem,
    isDeletingItem,
    isSaving,
    loadingMessage,
  }
}
