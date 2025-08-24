import { createRouter, createWebHistory } from 'vue-router'
import ProfileSelectionView from '@/views/ProfileSelectionView.vue'
import HomeViews from '@/views/HomeViews.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import { useProfileStore } from '@/stores/profiles.js'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'profile-selection',
      component: ProfileSelectionView,
    },
    {
      path: '/profile/:profileId',
      name: 'shopping-list',
      component: HomeViews,
      beforeEnter: async (to, from, next) => {
        // Validation du profileId avec Supabase
        const profileId = parseInt(to.params.profileId)
        const profileStore = useProfileStore()

        try {
          const isValid = await profileStore.validateProfileExists(profileId)
          if (isValid) {
            next()
          } else {
            console.warn(`Profil ${profileId} non trouvé, redirection vers 404`)
            next('/404')
          }
        } catch (error) {
          console.error('Erreur lors de la validation du profil:', error)
          next('/404')
        }
      },
    },
    {
      path: '/404',
      name: 'not-found',
      component: NotFoundView,
    },
    {
      // Catch-all route - doit être en dernier
      path: '/:pathMatch(.*)*',
      redirect: '/404',
    },
  ],
})

// Navigation guard globale pour les erreurs
router.onError((error) => {
  console.error('Erreur de navigation:', error)
  router.push('/404')
})

export default router
