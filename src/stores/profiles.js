import { defineStore } from 'pinia'
import { dataService } from '../services/dataService.js'

export const useProfileStore = defineStore('profiles', {
  state: () => ({
    profiles: [],
    currentProfile: null,
    currentShoppingList: null,
    items: [], // Les éléments de la liste de courses du profil actuel
    loading: false,
    error: null,
  }),

  getters: {
    hasProfiles: (state) => state.profiles.length > 0,

    // Getters pour la gestion des éléments
    filteredItems: (state) => {
      return state.items || []
    },

    completedItems: (state) => {
      return state.items.filter((item) => item.completed) || []
    },

    uncompletedItems: (state) => {
      return state.items.filter((item) => !item.completed) || []
    },

    totalItemsCount: (state) => state.items.length,

    completedItemsCount: (state) => {
      return state.items.filter((item) => item.completed).length
    },
  },

  actions: {
    // ===== GESTION DES PROFILS =====
    async loadProfiles() {
      this.loading = true
      this.error = null
      try {
        this.profiles = await dataService.getProfiles()
        console.log('✅ Profils chargés depuis Supabase:', this.profiles.length)
      } catch (error) {
        console.error('❌ Erreur lors du chargement des profils:', error)
        this.error = 'Erreur lors du chargement des profils'
        this.profiles = []
      } finally {
        this.loading = false
      }
    },

    async createProfile(profileData) {
      this.loading = true
      this.error = null
      try {
        const newProfile = await dataService.createProfile(profileData.name)
        this.profiles.push(newProfile)
        console.log('✅ Profil créé:', newProfile)
        return newProfile
      } catch (error) {
        console.error('❌ Erreur lors de la création du profil:', error)
        this.error = 'Erreur lors de la création du profil'
        throw error
      } finally {
        this.loading = false
      }
    },

    async loadProfile(profileId) {
      this.loading = true
      this.error = null
      try {
        // Charger le profil
        const profile = await dataService.getProfile(profileId)
        this.currentProfile = profile

        // Charger ou créer la liste de courses par défaut
        this.currentShoppingList = await dataService.getOrCreateDefaultList(profileId)
        this.items = this.currentShoppingList.items || []

        console.log(`✅ Profil ${profile.name} chargé avec ${this.items.length} éléments`)
        return profile
      } catch (error) {
        console.error('❌ Erreur lors du chargement du profil:', error)
        this.error = 'Erreur lors du chargement du profil'
        this.currentProfile = null
        this.currentShoppingList = null
        this.items = []
        throw error
      } finally {
        this.loading = false
      }
    },

    clearCurrentProfile() {
      this.currentProfile = null
      this.currentShoppingList = null
      this.items = []
    },

    // ===== GESTION DES ÉLÉMENTS DE LA LISTE =====
    async addItem(itemData) {
      if (!this.currentShoppingList) {
        throw new Error('Aucune liste de courses active')
      }

      const newItem = {
        id: Date.now(),
        name: itemData.name,
        quantity: itemData.quantity || 1,
        tagId: itemData.tagId,
        completed: false,
        createdAt: new Date().toISOString(),
      }

      // Ajouter à la liste locale
      this.items.push(newItem)

      // Sauvegarder dans Supabase
      try {
        await dataService.updateShoppingList(this.currentShoppingList.id, this.items)
        console.log('✅ Élément ajouté:', newItem.name)
      } catch (error) {
        // Annuler l'ajout local en cas d'erreur
        this.items.pop()
        console.error("❌ Erreur lors de l'ajout de l'élément:", error)
        this.error = "Erreur lors de l'ajout de l'élément"
        throw error
      }
    },

    async removeItem(itemId) {
      if (!this.currentShoppingList) return

      const index = this.items.findIndex((item) => item.id === itemId)
      if (index === -1) return

      // Sauvegarder l'élément pour le restaurer en cas d'erreur
      const removedItem = this.items[index]

      // Supprimer de la liste locale
      this.items.splice(index, 1)

      // Sauvegarder dans Supabase
      try {
        await dataService.updateShoppingList(this.currentShoppingList.id, this.items)
        console.log('✅ Élément supprimé:', removedItem.name)
      } catch (error) {
        // Restaurer l'élément en cas d'erreur
        this.items.splice(index, 0, removedItem)
        console.error("❌ Erreur lors de la suppression de l'élément:", error)
        this.error = "Erreur lors de la suppression de l'élément"
        throw error
      }
    },

    async toggleItemCompleted(itemId) {
      if (!this.currentShoppingList) return

      const item = this.items.find((item) => item.id === itemId)
      if (!item) return

      // Sauvegarder l'état précédent
      const previousCompleted = item.completed

      // Basculer l'état local
      item.completed = !item.completed

      // Sauvegarder dans Supabase
      try {
        await dataService.updateShoppingList(this.currentShoppingList.id, this.items)
        console.log(
          '✅ Statut mis à jour:',
          item.name,
          item.completed ? 'complété' : 'non complété',
        )
      } catch (error) {
        // Restaurer l'état précédent en cas d'erreur
        item.completed = previousCompleted
        console.error('❌ Erreur lors de la mise à jour du statut:', error)
        this.error = 'Erreur lors de la mise à jour du statut'
        throw error
      }
    },

    async clearItems() {
      if (!this.currentShoppingList) return

      // Sauvegarder les éléments pour les restaurer en cas d'erreur
      const previousItems = [...this.items]

      // Vider la liste locale
      this.items = []

      // Sauvegarder dans Supabase
      try {
        await dataService.updateShoppingList(this.currentShoppingList.id, this.items)
        console.log('✅ Liste vidée')
      } catch (error) {
        // Restaurer les éléments en cas d'erreur
        this.items = previousItems
        console.error('❌ Erreur lors du vidage de la liste:', error)
        this.error = 'Erreur lors du vidage de la liste'
        throw error
      }
    },

    async clearCompleted() {
      if (!this.currentShoppingList) return

      // Sauvegarder les éléments pour les restaurer en cas d'erreur
      const previousItems = [...this.items]

      // Filtrer les éléments locaux
      this.items = this.items.filter((item) => !item.completed)

      // Sauvegarder dans Supabase
      try {
        await dataService.updateShoppingList(this.currentShoppingList.id, this.items)
        console.log('✅ Éléments complétés supprimés')
      } catch (error) {
        // Restaurer les éléments en cas d'erreur
        this.items = previousItems
        console.error('❌ Erreur lors de la suppression des éléments complétés:', error)
        this.error = 'Erreur lors de la suppression des éléments complétés'
        throw error
      }
    },

    // ===== UTILITAIRES =====
    clearError() {
      this.error = null
    },
  },
})
