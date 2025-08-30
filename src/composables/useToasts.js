import { useToastStore } from '../stores/toast.js'

/**
 * Composable pour utiliser le système de toasts
 * Fournit une interface simple pour afficher des notifications
 */
export function useToasts() {
  const toastStore = useToastStore()

  return {
    // Accès direct aux toasts et getters
    toasts: toastStore.toasts,
    activeToasts: toastStore.activeToasts,
    hasErrorToasts: toastStore.hasErrorToasts,
    hasSuccessToasts: toastStore.hasSuccessToasts,

    // Méthodes principales
    show: toastStore.show,
    hide: toastStore.hide,
    remove: toastStore.remove,
    clear: toastStore.clear,

    // Méthodes de convenance
    success: toastStore.success,
    error: toastStore.error,
    warning: toastStore.warning,
    info: toastStore.info,
    sync: toastStore.sync,

    // Notifications spécifiques PWA
    dataSaved: toastStore.dataSaved,
    dataSync: toastStore.dataSync,
    dataSynced: toastStore.dataSynced,
    offlineMode: toastStore.offlineMode,
    onlineMode: toastStore.onlineMode,
    syncError: toastStore.syncError,
    itemAdded: toastStore.itemAdded,
    itemRemoved: toastStore.itemRemoved,
    itemCompleted: toastStore.itemCompleted,
  }
}
