<!-- Composant de test pour vérifier la connexion Supabase -->
<template>
  <div class="p-4 bg-gray-100 rounded-lg">
    <h3 class="text-lg font-semibold mb-4">🔧 Test Supabase</h3>

    <!-- État de la connexion -->
    <div class="mb-4">
      <div v-if="loading" class="text-blue-600">⏳ Chargement...</div>
      <div v-else-if="error" class="text-red-600">❌ {{ error }}</div>
      <div v-else class="text-green-600">✅ Connexion OK</div>
    </div>

    <!-- Profils existants -->
    <div class="mb-4">
      <h4 class="font-medium mb-2">Profils ({{ profiles.length }})</h4>
      <div v-if="profiles.length === 0" class="text-gray-500 text-sm">Aucun profil trouvé</div>
      <div v-else class="space-y-2">
        <div
          v-for="profile in profiles"
          :key="profile.id"
          class="flex items-center justify-between bg-white p-2 rounded border"
        >
          <span>{{ profile.name }}</span>
          <button
            @click="selectProfile(profile.id)"
            class="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
          >
            Sélectionner
          </button>
        </div>
      </div>
    </div>

    <!-- Formulaire de création de profil -->
    <div class="mb-4">
      <h4 class="font-medium mb-2">Créer un profil</h4>
      <div class="flex gap-2">
        <input
          v-model="newProfileName"
          type="text"
          placeholder="Nom du profil"
          class="flex-1 px-3 py-2 border rounded"
        />
        <button
          @click="createNewProfile"
          :disabled="!newProfileName.trim() || loading"
          class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
        >
          Créer
        </button>
      </div>
    </div>

    <!-- Profil actuel -->
    <div v-if="currentProfile" class="mb-4">
      <h4 class="font-medium mb-2">Profil actuel</h4>
      <div class="bg-white p-3 rounded border">
        <p><strong>Nom:</strong> {{ currentProfile.name }}</p>
        <p><strong>ID:</strong> {{ currentProfile.id }}</p>
        <p><strong>Éléments:</strong> {{ items.length }}</p>
        <button
          @click="addTestItem"
          class="mt-2 px-3 py-1 bg-purple-500 text-white rounded text-sm hover:bg-purple-600"
        >
          Ajouter élément test
        </button>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex gap-2">
      <button
        @click="refreshProfiles"
        :disabled="loading"
        class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50"
      >
        Actualiser
      </button>
      <button
        @click="clearCurrentProfile"
        :disabled="!currentProfile"
        class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
      >
        Déselectionner
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useProfileStore } from '../stores/profiles.js'

const profileStore = useProfileStore()

// État local
const newProfileName = ref('')

// État du store
const loading = computed(() => profileStore.loading)
const error = computed(() => profileStore.error)
const profiles = computed(() => profileStore.profiles)
const currentProfile = computed(() => profileStore.currentProfile)
const items = computed(() => profileStore.items)

// Actions
const refreshProfiles = async () => {
  try {
    await profileStore.loadProfiles()
  } catch (err) {
    console.error('Erreur lors du rafraîchissement:', err)
  }
}

const createNewProfile = async () => {
  if (!newProfileName.value.trim()) return

  try {
    await profileStore.createProfile({ name: newProfileName.value.trim() })
    newProfileName.value = ''
  } catch (err) {
    console.error('Erreur lors de la création:', err)
  }
}

const selectProfile = async (profileId) => {
  try {
    await profileStore.loadProfile(profileId)
  } catch (err) {
    console.error('Erreur lors de la sélection:', err)
  }
}

const clearCurrentProfile = () => {
  profileStore.clearCurrentProfile()
}

const addTestItem = async () => {
  if (!currentProfile.value) return

  try {
    await profileStore.addItem({
      name: `Test item ${Date.now()}`,
      quantity: 1,
      tagId: 1,
    })
  } catch (err) {
    console.error("Erreur lors de l'ajout:", err)
  }
}

// Charger les profils au montage
onMounted(() => {
  refreshProfiles()
})
</script>
