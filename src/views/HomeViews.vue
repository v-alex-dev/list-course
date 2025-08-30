<script setup>
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useShoppingListStore } from '../stores/shoppingList.js'
import { useProfileStore } from '../stores/profiles.js'
import TagFilters from '../components/TagFilters.vue'
import ShoppingItem from '../components/ShoppingItem.vue'
import AddItemModal from '../components/AddItemModal.vue'
import FloatingActionButton from '../components/FloatingActionButton.vue'

const route = useRoute()
const router = useRouter()
const shoppingStore = useShoppingListStore()
const profileStore = useProfileStore()

const filteredItems = computed(() => shoppingStore.filteredItems)
const isModalOpen = computed(() => shoppingStore.isModalOpen)
const completedItemsCount = computed(() => shoppingStore.completedItemsCount)
const totalItemsCount = computed(() => shoppingStore.totalItemsCount)
const currentProfile = computed(() => profileStore.currentProfile)

// Utilisons les getters du shoppingStore
const uncompletedItemsByTag = computed(() => shoppingStore.uncompletedItemsByTag)
const completedItemsByTag = computed(() => shoppingStore.completedItemsByTag)

// Helper pour obtenir un tag par ID
const getTagById = (tagId) => shoppingStore.getTagById(tagId)

const clearCompleted = async () => {
  await shoppingStore.clearCompleted()
}

const goBackToProfiles = () => {
  profileStore.clearCurrentProfile()
  shoppingStore.reset()
  router.push({ name: 'profile-selection' })
}

// Charger le profil et sa liste de courses au montage du composant
onMounted(async () => {
  const profileId = parseInt(route.params.profileId)
  if (profileId) {
    try {
      // Charger le profil
      await profileStore.loadProfile(profileId)
      // Charger la liste de courses
      await shoppingStore.loadShoppingList(profileId)
    } catch (error) {
      console.error('Erreur lors du chargement:', error)
      router.push({ name: 'profile-selection' })
    }
  } else {
    // Pas de profil spécifié, rediriger vers la sélection
    router.push({ name: 'profile-selection' })
  }
})
</script>

<template>
  <div class="shopping-list-container">
    <div class="shopping-list-header">
      <div class="profile-info" v-if="currentProfile">
        <div class="profile-badge">
          <span class="profile-avatar">{{ currentProfile.avatar }}</span>
          <span class="profile-name">{{ currentProfile.name }}</span>
        </div>
        <div class="profile-actions">
          <button @click="goBackToProfiles" class="change-profile-btn">🔄 Changer</button>
        </div>
      </div>

      <h1 class="page-title">Ma Liste de Courses</h1>
      <div class="progress-info" v-if="totalItemsCount > 0">
        <span class="progress-text">
          {{ completedItemsCount }} / {{ totalItemsCount }} articles
        </span>
        <div class="progress-bar">
          <div
            class="progress-fill"
            :style="{ width: `${(completedItemsCount / totalItemsCount) * 100}%` }"
          ></div>
        </div>
      </div>
    </div>

    <div class="main-content">
      <!-- Filtres -->
      <TagFilters />

      <!-- Liste des articles à acheter groupés par tag -->
      <div v-if="Object.keys(uncompletedItemsByTag).length > 0" class="items-section">
        <h2 class="section-title">À acheter</h2>

        <!-- Groupe pour chaque tag -->
        <div
          v-for="(items, tagId) in uncompletedItemsByTag"
          :key="`uncompleted-${tagId}`"
          class="tag-group"
        >
          <div class="tag-header" v-if="getTagById(Number(tagId))">
            <span class="tag-icon">{{ getTagById(Number(tagId)).icon }}</span>
            <h3 class="tag-title">{{ getTagById(Number(tagId)).name }}</h3>
            <span class="tag-count">{{ items.length }}</span>
          </div>
          <div class="items-grid">
            <ShoppingItem v-for="item in items" :key="item.id" :item="item" />
          </div>
        </div>
      </div>

      <!-- Liste des articles terminés groupés par tag -->
      <div v-if="Object.keys(completedItemsByTag).length > 0" class="items-section">
        <div class="completed-header">
          <h2 class="section-title">Terminé</h2>
          <button @click="clearCompleted" class="clear-completed-btn">Tout supprimer</button>
        </div>

        <!-- Groupe pour chaque tag -->
        <div
          v-for="(items, tagId) in completedItemsByTag"
          :key="`completed-${tagId}`"
          class="tag-group"
        >
          <div class="tag-header" v-if="getTagById(Number(tagId))">
            <span class="tag-icon">{{ getTagById(Number(tagId)).icon }}</span>
            <h3 class="tag-title">{{ getTagById(Number(tagId)).name }}</h3>
            <span class="tag-count">{{ items.length }}</span>
          </div>
          <div class="items-grid">
            <ShoppingItem v-for="item in items" :key="item.id" :item="item" />
          </div>
        </div>
      </div>

      <!-- Message si aucun article -->
      <div v-if="filteredItems.length === 0" class="empty-state">
        <div class="empty-content">
          <div class="empty-icon">🛒</div>
          <h3 class="empty-title">Votre liste est vide</h3>
          <p class="empty-description">
            Commencez à ajouter des articles à votre liste de courses !
          </p>
        </div>
      </div>
    </div>

    <!-- Bouton flottant pour ajouter -->
    <FloatingActionButton />

    <!-- Modal d'ajout -->
    <AddItemModal :is-open="isModalOpen" @close="shoppingStore.closeModal" />
  </div>
</template>

<style scoped>
.shopping-list-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
  padding: 1rem;
}

.shopping-list-header {
  text-align: center;
  margin-bottom: 2rem;
}

.profile-info {
  margin-bottom: 1rem;
}

.profile-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(31, 41, 55, 0.4);
  border-radius: 20px;
  padding: 0.5rem 1rem;
  border: 1px solid rgba(6, 182, 212, 0.3);
  box-shadow: 0 0 15px rgba(6, 182, 212, 0.2);
}

/* Backdrop-filter seulement sur desktop pour les performances */
@media (min-width: 769px) {
  .profile-badge {
    backdrop-filter: blur(16px);
  }
}

.profile-avatar {
  font-size: 1.5rem;
}

.profile-name {
  color: #f9fafb;
  font-weight: 500;
}

.profile-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
  justify-content: center;
}

.change-profile-btn {
  background: rgba(6, 182, 212, 0.2);
  border: 1px solid rgba(6, 182, 212, 0.3);
  color: #06b6d4;
  padding: 0.25rem 0.5rem;
  border-radius: 8px;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
}

.change-profile-btn:hover {
  background: rgba(6, 182, 212, 0.3);
  transform: scale(1.05);
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #f9fafb;
  margin: 0 0 1rem 0;
}

/* Text-shadow seulement sur desktop */
@media (min-width: 769px) {
  .page-title {
    text-shadow: 0 0 20px rgba(6, 182, 212, 0.5);
  }
}

.progress-info {
  display: inline-block;
  background: rgba(31, 41, 55, 0.4);
  border-radius: 20px;
  padding: 0.75rem 1.5rem;
  border: 1px solid rgba(6, 182, 212, 0.3);
  box-shadow: 0 0 15px rgba(6, 182, 212, 0.2);
}

/* Backdrop-filter seulement sur desktop */
@media (min-width: 769px) {
  .progress-info {
    backdrop-filter: blur(16px);
  }
}

.progress-text {
  color: #f9fafb;
  font-weight: 500;
  display: block;
  margin-bottom: 0.5rem;
}

.progress-bar {
  width: 200px;
  height: 6px;
  background: rgba(31, 41, 55, 0.5);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #06b6d4 0%, #8b5cf6 100%);
  border-radius: 3px;
  transition: width 0.3s ease;
}

/* Box-shadow seulement sur desktop */
@media (min-width: 769px) {
  .progress-fill {
    box-shadow: 0 0 10px rgba(6, 182, 212, 0.5);
  }
}

.main-content {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.items-section {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Backdrop-filter seulement sur desktop */
@media (min-width: 769px) {
  .items-section {
    backdrop-filter: blur(10px);
  }
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #f9fafb;
  margin: 0 0 1rem 0;
}

/* Text-shadow seulement sur desktop */
@media (min-width: 769px) {
  .section-title {
    text-shadow: 0 0 10px rgba(6, 182, 212, 0.5);
  }
}

.completed-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.clear-completed-btn {
  background: rgba(220, 38, 38, 0.2);
  border: 1px solid rgba(220, 38, 38, 0.3);
  color: #fca5a5;
  padding: 0.5rem 1rem;
  border-radius: 12px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

/* Backdrop-filter et effets avancés seulement sur desktop */
@media (min-width: 769px) {
  .clear-completed-btn {
    backdrop-filter: blur(8px);
  }

  .clear-completed-btn:hover {
    background: rgba(220, 38, 38, 0.3);
    color: #f87171;
    transform: scale(1.05);
    box-shadow: 0 0 15px rgba(220, 38, 38, 0.3);
  }
}

.items-grid {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.tag-group {
  margin-bottom: 1.5rem;
}

.tag-group:last-child {
  margin-bottom: 0;
}

.tag-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  padding: 0.5rem 0;
}

.tag-icon {
  font-size: 1.25rem;
}

.tag-title {
  color: rgba(249, 250, 251, 0.9);
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
  text-transform: capitalize;
}

.tag-count {
  background: rgba(6, 182, 212, 0.2);
  color: #06b6d4;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  min-width: 1.5rem;
  text-align: center;
  border: 1px solid rgba(6, 182, 212, 0.3);
}

/* Text-shadow seulement sur desktop */
@media (min-width: 769px) {
  .tag-title {
    text-shadow: 0 0 8px rgba(6, 182, 212, 0.3);
  }
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
}

.empty-content {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  max-width: 400px;
  margin: 0 auto;
}

/* Backdrop-filter seulement sur desktop */
@media (min-width: 769px) {
  .empty-content {
    backdrop-filter: blur(10px);
  }
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #f9fafb;
  margin: 0 0 0.5rem 0;
}

/* Text-shadow seulement sur desktop */
@media (min-width: 769px) {
  .empty-title {
    text-shadow: 0 0 10px rgba(6, 182, 212, 0.5);
  }
}

.empty-description {
  color: rgba(249, 250, 251, 0.8);
  margin: 0;
  line-height: 1.5;
}

/* Optimisations mobile */
@media (max-width: 768px) {
  .shopping-list-container {
    padding: 0.5rem;
  }

  .page-title {
    font-size: 2rem;
  }

  .progress-info {
    padding: 0.5rem 1rem;
  }

  .progress-bar {
    width: 150px;
  }

  .items-section {
    padding: 0.75rem;
  }

  .items-grid {
    gap: 0.375rem;
  }

  .tag-group {
    margin-bottom: 1rem;
  }

  .tag-header {
    gap: 0.5rem;
    margin-bottom: 0.5rem;
  }

  .tag-icon {
    font-size: 1rem;
  }

  .tag-title {
    font-size: 0.875rem;
  }

  .tag-count {
    padding: 0.125rem 0.375rem;
    font-size: 0.625rem;
  }

  .main-content {
    gap: 1rem;
  }

  .completed-header {
    flex-direction: column;
    gap: 0.5rem;
    align-items: flex-start;
  }

  .empty-content {
    padding: 1.5rem;
  }

  /* Réduire les transitions sur mobile */
  * {
    transition-duration: 0.15s !important;
  }
}
</style>
