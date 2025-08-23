import { createRouter, createWebHistory } from 'vue-router'
import ProfileSelectionView from '@/views/ProfileSelectionView.vue'
import HomeViews from '@/views/HomeViews.vue'
import DemoStylesView from '@/views/DemoStylesView.vue'

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
    },
    {
      path: '/demo-styles',
      name: 'demo-styles',
      component: DemoStylesView,
    },
  ],
})

export default router
