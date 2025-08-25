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
const uncompletedItems = computed(() => shoppingStore.uncompletedItems)
const completedItems = computed(() => shoppingStore.completedItems)

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
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
    <div class="text-center mb-8">
      <div v-if="currentProfile" class="mb-4">
        <div class="inline-flex items-center gap-2 bg-slate-800/50 backdrop-blur-sm border border-slate-600/30 rounded-2xl px-4 py-2">
          <span class="text-2xl">{{ currentProfile.avatar }}</span>
          <span class="text-white font-medium">{{ currentProfile.name }}</span>
        </div>
        <div class="mt-2">
          <button @click="goBackToProfiles" class="bg-cyan-500/20 border border-cyan-400/30 text-cyan-400 px-4 py-1 rounded-lg text-sm hover:bg-cyan-500/30 transition-colors">
            🔄 Changer
          </button>
        </div>
      </div>

      <h1 class="text-4xl md:text-5xl font-bold text-white mb-4">Ma Liste de Courses</h1>
      
      <div v-if="totalItemsCount > 0" class="inline-block bg-slate-800/50 backdrop-blur-sm border border-cyan-400/30 rounded-2xl px-6 py-3">
        <span class="text-white font-medium block mb-2">
          {{ completedItemsCount }} / {{ totalItemsCount }} articles
        </span>
        <div class="w-48 h-2 bg-slate-700/50 rounded-full overflow-hidden">
          <div
            class="h-full bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full transition-all duration-300"
            :style="{ width: `${(completedItemsCount / totalItemsCount) * 100}%` }"
          ></div>
        </div>
      </div>
    </div>

    <div class="max-w-4xl mx-auto space-y-6">
      <!-- Filtres -->
      <TagFilters />

      <!-- Liste des articles à acheter -->
      <div v-if="uncompletedItems.length > 0" class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
        <h2 class="text-xl font-semibold text-white mb-4">À acheter</h2>
        <div class="space-y-3">
          <ShoppingItem v-for="item in uncompletedItems" :key="item.id" :item="item" />
        </div>
      </div>

      <!-- Liste des articles terminés -->
      <div v-if="completedItems.length > 0" class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold text-white">Terminé</h2>
          <button @click="clearCompleted" class="bg-red-500/20 border border-red-400/30 text-red-400 px-4 py-2 rounded-xl text-sm hover:bg-red-500/30 transition-colors">
            Tout supprimer
          </button>
        </div>
        <div class="space-y-3">
          <ShoppingItem v-for="item in completedItems" :key="item.id" :item="item" />
        </div>
      </div>

      <!-- Message si aucun article -->
      <div v-if="filteredItems.length === 0" class="text-center py-16">
        <div class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 max-w-md mx-auto">
          <div class="text-6xl mb-4">🛒</div>
          <h3 class="text-2xl font-semibold text-white mb-2">Votre liste est vide</h3>
          <p class="text-slate-300 leading-relaxed">
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
/* Optimisation mobile - Réduction des transitions */
@media (max-width: 768px) {
  * {
    transition-duration: 0.15s !important;
  }
}
</style>
