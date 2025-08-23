import { defineStore } from 'pinia'
import tagsData from '../data/tags.json'
import { useProfileStore } from './profiles.js'

export const useShoppingListStore = defineStore('shoppingList', {
  state: () => ({
    items: [],
    tags: tagsData.tags,
    selectedTags: [],
    isModalOpen: false,
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
    loadProfileItems(profileItems) {
      this.items = profileItems || []
    },

    saveToProfileFile() {
      const profileStore = useProfileStore()
      if (profileStore.currentProfile) {
        profileStore.updateProfileItems(profileStore.currentProfile.id, this.items)
      }
    },

    addItem(itemData) {
      const newItem = {
        id: Date.now(),
        name: itemData.name,
        quantity: itemData.quantity || 1,
        tagId: itemData.tagId,
        completed: false,
        createdAt: new Date().toISOString(),
      }

      this.items.push(newItem)
      this.saveToProfileFile()
    },

    removeItem(itemId) {
      const index = this.items.findIndex((item) => item.id === itemId)
      if (index > -1) {
        this.items.splice(index, 1)
        this.saveToProfileFile()
      }
    },

    toggleItemCompleted(itemId) {
      const item = this.items.find((item) => item.id === itemId)
      if (item) {
        item.completed = !item.completed
        this.saveToProfileFile()
      }
    },

    updateItem(itemId, updatedData) {
      const index = this.items.findIndex((item) => item.id === itemId)
      if (index > -1) {
        this.items[index] = { ...this.items[index], ...updatedData }
        this.saveToProfileFile()
      }
    },

    clearCompleted() {
      this.items = this.items.filter((item) => !item.completed)
      this.saveToProfileFile()
    },

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

    openModal() {
      this.isModalOpen = true
    },

    closeModal() {
      this.isModalOpen = false
    },
  },
})
