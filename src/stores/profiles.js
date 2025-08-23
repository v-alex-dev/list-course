import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import profilesData from '../data/profiles.json'

export const useProfileStore = defineStore('profiles', () => {
  // State
  const profiles = ref(profilesData.profiles)
  const currentProfile = ref(null)

  // Getters
  const hasProfiles = computed(() => profiles.value.length > 0)

  // Actions
  async function loadProfile(profileId) {
    try {
      // Import dynamique du fichier JSON du profil
      const profileModule = await import(`../data/profiles/${profileId}.json`)
      currentProfile.value = {
        id: profileId,
        name: profiles.value.find((p) => p.id === profileId)?.name || profileId,
        avatar: profiles.value.find((p) => p.id === profileId)?.avatar || '👤',
        items: profileModule.default.items || [],
      }
      return currentProfile.value
    } catch (error) {
      console.error('Erreur lors du chargement du profil:', error)
      // Créer un nouveau profil vide si le fichier n'existe pas
      currentProfile.value = {
        id: profileId,
        name: profiles.value.find((p) => p.id === profileId)?.name || profileId,
        avatar: profiles.value.find((p) => p.id === profileId)?.avatar || '👤',
        items: [],
      }
      return currentProfile.value
    }
  }

  function createProfile(profileData) {
    const newProfile = {
      id: profileData.id || profileData.name.toLowerCase().replace(/\s+/g, '-'),
      name: profileData.name,
      avatar: profileData.avatar || '👤',
      createdAt: new Date().toISOString(),
    }

    profiles.value.push(newProfile)

    // Note: Dans un vrai projet, on sauvegarderait ça dans un backend
    // Ici on simule juste la création
    console.log('Nouveau profil créé:', newProfile)

    return newProfile
  }

  function clearCurrentProfile() {
    currentProfile.value = null
  }

  return {
    // State
    profiles,
    currentProfile,
    // Getters
    hasProfiles,
    // Actions
    loadProfile,
    createProfile,
    clearCurrentProfile,
  }
})
