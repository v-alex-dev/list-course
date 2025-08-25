import { defineStore } from 'pinia'
import { dataService } from '../services/dataService.js'
import tagsData from '../data/tags.json'

export const useShoppingListStore = defineStore('shoppingList', {
  state: () => ({
    currentList: null,
    items: [],
    tags: tagsData.tags,
    selectedTags: [],
    isModalOpen: false,
    loading: false,
    error: null,
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
  },

  actions: {
    // ===== GESTION DE LA LISTE COURANTE =====
    async loadShoppingList(profileId) {
      this.loading = true
      this.error = null
      try {
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

        console.log('✅ Liste de courses chargée:', this.currentList.id)
      } catch (error) {
        console.error('❌ Erreur lors du chargement de la liste:', error)
        this.error = 'Erreur lors du chargement de la liste de courses'
        this.items = []
        this.currentList = null
      } finally {
        this.loading = false
      }
    },

    async saveShoppingList() {
      if (!this.currentList) return

      this.loading = true
      this.error = null
      try {
        const updatedList = await dataService.updateShoppingList(this.currentList.id, this.items)
        this.currentList = updatedList
        console.log('✅ Liste sauvegardée avec succès')
      } catch (error) {
        console.error('❌ Erreur lors de la sauvegarde:', error)
        this.error = 'Erreur lors de la sauvegarde'
      } finally {
        this.loading = false
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
      }

      this.items.push(item)
      await this.saveShoppingList()
    },

    async updateItem(itemId, updates) {
      const index = this.items.findIndex((item) => item.id === itemId)
      if (index !== -1) {
        this.items[index] = { ...this.items[index], ...updates }
        await this.saveShoppingList()
      }
    },

    async toggleItemCompleted(itemId) {
      const item = this.items.find((item) => item.id === itemId)
      if (item) {
        item.completed = !item.completed
        await this.saveShoppingList()
      }
    },

    async deleteItem(itemId) {
      this.items = this.items.filter((item) => item.id !== itemId)
      await this.saveShoppingList()
    },

    async clearCompleted() {
      this.items = this.items.filter((item) => !item.completed)
      await this.saveShoppingList()
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
    },
  },
})
