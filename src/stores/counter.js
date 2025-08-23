import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import tagsData from '../data/tags.json'
import { useProfileStore } from './profiles.js'

export const useShoppingListStore = defineStore('shoppingList', () => {
  // State
  const items = ref([])
  const tags = ref(tagsData.tags)
  const selectedTags = ref([])
  const isModalOpen = ref(false)
  const profileStore = useProfileStore()

  // Getters
  const filteredItems = computed(() => {
    if (selectedTags.value.length === 0) {
      return items.value
    }
    return items.value.filter((item) => selectedTags.value.includes(item.tagId))
  })

  const getTagById = computed(() => (id) => {
    return tags.value.find((tag) => tag.id === id)
  })

  const completedItemsCount = computed(() => {
    return items.value.filter((item) => item.completed).length
  })

  const totalItemsCount = computed(() => items.value.length)

  // Actions
  function loadProfileItems(profileItems) {
    items.value = profileItems || []
  }

  function addItem(itemData) {
    const newItem = {
      id: Date.now(),
      name: itemData.name,
      quantity: itemData.quantity || 1,
      tagId: itemData.tagId,
      completed: false,
      createdAt: new Date().toISOString(),
    }

    items.value.push(newItem)
    saveToLocalStorage()
  }

  function removeItem(itemId) {
    const index = items.value.findIndex((item) => item.id === itemId)
    if (index > -1) {
      items.value.splice(index, 1)
      saveToLocalStorage()
    }
  }

  function toggleItemCompleted(itemId) {
    const item = items.value.find((item) => item.id === itemId)
    if (item) {
      item.completed = !item.completed
      saveToLocalStorage()
    }
  }

  function updateItem(itemId, updatedData) {
    const index = items.value.findIndex((item) => item.id === itemId)
    if (index > -1) {
      items.value[index] = { ...items.value[index], ...updatedData }
      saveToLocalStorage()
    }
  }

  function clearCompleted() {
    items.value = items.value.filter((item) => !item.completed)
    saveToLocalStorage()
  }

  function toggleTagFilter(tagId) {
    const index = selectedTags.value.indexOf(tagId)
    if (index > -1) {
      selectedTags.value.splice(index, 1)
    } else {
      selectedTags.value.push(tagId)
    }
  }

  function clearFilters() {
    selectedTags.value = []
  }

  function openModal() {
    isModalOpen.value = true
  }

  function closeModal() {
    isModalOpen.value = false
  }

  function saveToLocalStorage() {
    // On ne sauvegarde plus dans localStorage
    // TODO: Implémenter la sauvegarde dans les fichiers JSON
    console.log('Items à sauvegarder:', items.value)
  }

  return {
    // State
    items,
    tags,
    selectedTags,
    isModalOpen,
    // Getters
    filteredItems,
    getTagById,
    completedItemsCount,
    totalItemsCount,
    // Actions
    loadProfileItems,
    addItem,
    removeItem,
    toggleItemCompleted,
    updateItem,
    clearCompleted,
    toggleTagFilter,
    clearFilters,
    openModal,
    closeModal,
  }
})
