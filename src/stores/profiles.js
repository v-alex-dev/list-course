import { defineStore } from 'pinia'
import { dataService } from '../services/dataService.js'

export const useProfileStore = defineStore('profiles', {
  state: () => ({
    profiles: [],
    currentProfile: null,
    loading: false,
    error: null,
  }),

  getters: {
    hasProfiles: (state) => state.profiles.length > 0,

    getProfileById: (state) => (id) => {
      return state.profiles.find((profile) => profile.id === parseInt(id))
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
        const profile = await dataService.getProfile(profileId)
        this.currentProfile = profile
        console.log(`✅ Profil ${profile.name} chargé`)
        return profile
      } catch (error) {
        console.error('❌ Erreur lors du chargement du profil:', error)
        this.error = 'Profil non trouvé'
        this.currentProfile = null
        throw error
      } finally {
        this.loading = false
      }
    },

    clearCurrentProfile() {
      this.currentProfile = null
    },

    // ===== VALIDATION =====
    async validateProfileExists(profileId) {
      try {
        const profile = await dataService.getProfile(profileId)
        return !!profile
      } catch {
        return false
      }
    },

    clearError() {
      this.error = null
    },
  },
})
