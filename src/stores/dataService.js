import { defineStore } from 'pinia'
import { supabase } from '../lib/supabase.js'

export const useDataStore = defineStore('dataService', {
  state: () => ({
    profiles: [],
    shoppingLists: [],
    currentProfile: null,
    loading: false,
    error: null,
    cache: {
      profiles: null,
      shoppingLists: {},
    },
  }),

  getters: {
    // Profiles getters
    sortedProfiles: (state) =>
      [...state.profiles].sort((a, b) => new Date(a.created_at) - new Date(b.created_at)),

    profileById: (state) => (id) => state.profiles.find((profile) => profile.id === id),

    // Shopping lists getters
    shoppingListsByProfile: (state) => (profileId) =>
      state.shoppingLists.filter((list) => list.profile_id === profileId),

    latestShoppingList: (state) => (profileId) => {
      const lists = state.shoppingLists
        .filter((list) => list.profile_id === profileId)
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      return lists[0] || null
    },

    // Formatted lists with parsed items
    formattedShoppingLists: (state) =>
      state.shoppingLists.map((list) => ({
        ...list,
        items: typeof list.items === 'string' ? JSON.parse(list.items) : list.items || [],
      })),
  },

  actions: {
    // ===== PROFILS =====
    async fetchProfiles() {
      this.loading = true
      this.error = null

      try {
        const { data, error } = await supabase
          .from('profile')
          .select('*')
          .order('created_at', { ascending: true })

        if (error) throw error

        this.profiles = data
        this.cache.profiles = Date.now()
        return data
      } catch (error) {
        console.error('Erreur lors de la récupération des profils:', error)
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async createProfile(name) {
      this.loading = true
      this.error = null

      try {
        const { data, error } = await supabase.from('profile').insert([{ name }]).select()

        if (error) throw error

        const newProfile = data[0]
        this.profiles.push(newProfile)
        return newProfile
      } catch (error) {
        console.error('Erreur lors de la création du profil:', error)
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async getProfile(id) {
      // Check cache first
      let profile = this.profileById(id)
      if (profile) return profile

      this.loading = true
      this.error = null

      try {
        const { data, error } = await supabase.from('profile').select('*').eq('id', id).single()

        if (error) throw error

        // Add to store if not already present
        if (!this.profileById(id)) {
          this.profiles.push(data)
        }

        return data
      } catch (error) {
        console.error('Erreur lors de la récupération du profil:', error)
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    setCurrentProfile(profile) {
      this.currentProfile = profile
    },

    // ===== LISTES DE COURSES =====
    async fetchShoppingLists(profileId) {
      this.loading = true
      this.error = null

      try {
        const { data, error } = await supabase
          .from('list-shopping')
          .select('*')
          .eq('profile_id', profileId)
          .order('created_at', { ascending: false })

        if (error) throw error

        // Update store with new data
        this.shoppingLists = this.shoppingLists.filter((list) => list.profile_id !== profileId)
        this.shoppingLists.push(...data)

        this.cache.shoppingLists[profileId] = Date.now()
        return data
      } catch (error) {
        console.error('Erreur lors de la récupération des listes:', error)
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async createShoppingList(profileId, items = []) {
      this.loading = true
      this.error = null

      try {
        const { data, error } = await supabase
          .from('list-shopping')
          .insert([
            {
              profile_id: profileId,
              items: JSON.stringify(items),
            },
          ])
          .select()

        if (error) throw error

        const newList = data[0]
        this.shoppingLists.unshift(newList)
        return newList
      } catch (error) {
        console.error('Erreur lors de la création de la liste:', error)
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateShoppingList(listId, items) {
      this.loading = true
      this.error = null

      try {
        const { data, error } = await supabase
          .from('list-shopping')
          .update({ items: JSON.stringify(items) })
          .eq('id', listId)
          .select()

        if (error) throw error

        // Update in store
        const index = this.shoppingLists.findIndex((list) => list.id === listId)
        if (index !== -1) {
          this.shoppingLists[index] = data[0]
        }

        return data[0]
      } catch (error) {
        console.error('Erreur lors de la mise à jour de la liste:', error)
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteShoppingList(listId) {
      this.loading = true
      this.error = null

      try {
        const { error } = await supabase.from('list-shopping').delete().eq('id', listId)

        if (error) throw error

        // Remove from store
        this.shoppingLists = this.shoppingLists.filter((list) => list.id !== listId)
      } catch (error) {
        console.error('Erreur lors de la suppression de la liste:', error)
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    // ===== UTILITAIRES =====
    async getOrCreateDefaultList(profileId) {
      const lists = this.shoppingListsByProfile(profileId)

      if (lists.length === 0) {
        // Créer une liste par défaut
        return await this.createShoppingList(profileId, [])
      }

      // Retourner la liste la plus récente
      return lists.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0]
    },

    // Cache management
    clearCache() {
      this.cache = {
        profiles: null,
        shoppingLists: {},
      }
    },

    isCacheValid(type, profileId = null) {
      const cacheTimeout = 5 * 60 * 1000 // 5 minutes
      const now = Date.now()

      if (type === 'profiles') {
        return this.cache.profiles && now - this.cache.profiles < cacheTimeout
      }

      if (type === 'shoppingLists' && profileId) {
        return (
          this.cache.shoppingLists[profileId] &&
          now - this.cache.shoppingLists[profileId] < cacheTimeout
        )
      }

      return false
    },
  },
})
