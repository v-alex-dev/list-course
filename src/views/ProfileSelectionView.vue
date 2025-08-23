<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProfileStore } from '../stores/profiles.js'

const router = useRouter()
const profileStore = useProfileStore()

const showCreateForm = ref(false)
const newProfileForm = ref({
  name: '',
  avatar: '👤',
})

const availableAvatars = ['👩‍🦰', '👨‍🦱', '👩‍🦳', '👨‍🦲', '👩‍🦱', '👨‍🦰', '👧', '👦', '👤', '🧑‍💼', '👩‍💻', '👨‍💻']

const profiles = computed(() => profileStore.profiles)

const selectProfile = async (profileId) => {
  try {
    await profileStore.loadProfile(profileId)
    router.push({ name: 'shopping-list', params: { profileId } })
  } catch (error) {
    console.error('Erreur lors de la sélection du profil:', error)
  }
}

const createProfile = async () => {
  if (!newProfileForm.value.name.trim()) return

  try {
    const newProfile = await profileStore.createProfile({
      name: newProfileForm.value.name.trim(),
      avatar: newProfileForm.value.avatar,
    })

    // Reset form
    newProfileForm.value = { name: '', avatar: '👤' }
    showCreateForm.value = false

    // Aller directement sur le nouveau profil
    await selectProfile(newProfile.id)
  } catch (error) {
    console.error('Erreur lors de la création du profil:', error)
    // Optionnel : afficher un message d'erreur à l'utilisateur
  }
}

const selectAvatar = (avatar) => {
  newProfileForm.value.avatar = avatar
}

// Charger les profils au montage du composant
onMounted(async () => {
  try {
    await profileStore.loadProfiles()
  } catch (error) {
    console.error('Erreur lors du chargement des profils:', error)
  }
})
</script>

<template>
  <div class="profile-selection-container">
    <div class="profile-selection-content">
      <div class="header">
        <h1 class="title">Choisissez votre profil</h1>
        <p class="subtitle">Sélectionnez un profil existant ou créez-en un nouveau</p>
      </div>

      <!-- Liste des profils existants -->
      <div class="profiles-grid" v-if="profiles.length > 0">
        <div
          v-for="profile in profiles"
          :key="profile.id"
          @click="selectProfile(profile.id)"
          class="profile-card"
        >
          <div class="profile-avatar">{{ profile.avatar }}</div>
          <div class="profile-name">{{ profile.name }}</div>
        </div>
      </div>

      <!-- Bouton pour créer un nouveau profil -->
      <div class="create-section">
        <button v-if="!showCreateForm" @click="showCreateForm = true" class="create-profile-btn">
          ➕ Créer un nouveau profil
        </button>

        <!-- Formulaire de création -->
        <div v-if="showCreateForm" class="create-form">
          <h3 class="form-title">Nouveau profil</h3>

          <div class="form-group">
            <label class="form-label">Nom du profil</label>
            <input
              v-model="newProfileForm.name"
              type="text"
              placeholder="Entrez le nom..."
              class="form-input"
              @keyup.enter="createProfile"
            />
          </div>

          <div class="form-group">
            <label class="form-label">Choisir un avatar</label>
            <div class="avatars-grid">
              <div
                v-for="avatar in availableAvatars"
                :key="avatar"
                @click="selectAvatar(avatar)"
                class="avatar-option"
                :class="{ active: newProfileForm.avatar === avatar }"
              >
                {{ avatar }}
              </div>
            </div>
          </div>

          <div class="form-actions">
            <button @click="showCreateForm = false" class="cancel-btn">Annuler</button>
            <button
              @click="createProfile"
              :disabled="!newProfileForm.name.trim()"
              class="create-btn"
            >
              Créer
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-selection-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.profile-selection-content {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(16px);
  border-radius: 24px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 30px rgba(6, 182, 212, 0.2);
  max-width: 600px;
  width: 100%;
}

.header {
  text-align: center;
  margin-bottom: 2rem;
}

.title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #f9fafb;
  margin: 0 0 0.5rem 0;
  text-shadow: 0 0 20px rgba(6, 182, 212, 0.5);
}

.subtitle {
  color: rgba(249, 250, 251, 0.8);
  margin: 0;
  font-size: 1.125rem;
}

.profiles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.profile-card {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(8px);
  border-radius: 16px;
  padding: 1.5rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.profile-card:hover {
  background: rgba(255, 255, 255, 0.12);
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(6, 182, 212, 0.3);
}

.profile-avatar {
  font-size: 3rem;
  margin-bottom: 0.5rem;
}

.profile-name {
  color: #f9fafb;
  font-weight: 600;
  font-size: 1.125rem;
}

.create-section {
  text-align: center;
}

.create-profile-btn {
  background: rgba(6, 182, 212, 0.2);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(6, 182, 212, 0.3);
  color: #06b6d4;
  padding: 1rem 2rem;
  border-radius: 16px;
  font-size: 1.125rem;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 500;
}

.create-profile-btn:hover {
  background: rgba(6, 182, 212, 0.3);
  transform: scale(1.05);
  box-shadow: 0 0 20px rgba(6, 182, 212, 0.3);
}

.create-form {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 1.5rem;
  text-align: left;
}

.form-title {
  color: #f9fafb;
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
  text-align: center;
}

.form-group {
  margin-bottom: 1rem;
}

.form-label {
  display: block;
  color: rgba(249, 250, 251, 0.9);
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.form-input {
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 0.75rem;
  color: #f9fafb;
  font-size: 1rem;
  outline: none;
  transition: all 0.3s;
}

.form-input:focus {
  border-color: #06b6d4;
  box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.2);
}

.form-input::placeholder {
  color: rgba(249, 250, 251, 0.5);
}

.avatars-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.avatar-option {
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid transparent;
  border-radius: 12px;
  padding: 0.75rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 1.5rem;
}

.avatar-option:hover {
  background: rgba(255, 255, 255, 0.15);
}

.avatar-option.active {
  border-color: #06b6d4;
  background: rgba(6, 182, 212, 0.2);
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.cancel-btn {
  flex: 1;
  background: rgba(220, 38, 38, 0.2);
  border: 1px solid rgba(220, 38, 38, 0.3);
  color: #fca5a5;
  padding: 0.75rem;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
}

.cancel-btn:hover {
  background: rgba(220, 38, 38, 0.3);
}

.create-btn {
  flex: 2;
  background: rgba(34, 197, 94, 0.2);
  border: 1px solid rgba(34, 197, 94, 0.3);
  color: #22c55e;
  padding: 0.75rem;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 500;
}

.create-btn:hover:not(:disabled) {
  background: rgba(34, 197, 94, 0.3);
  transform: scale(1.02);
}

.create-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .profile-selection-content {
    padding: 1rem;
  }

  .title {
    font-size: 2rem;
  }

  .profiles-grid {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  }

  .avatars-grid {
    grid-template-columns: repeat(4, 1fr);
  }

  .form-actions {
    flex-direction: column;
  }
}
</style>
