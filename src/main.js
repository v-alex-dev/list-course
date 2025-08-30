import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './styles.css'

import App from './App.vue'
import router from './router'
import { useShoppingListStore } from './stores/shoppingList.js'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Initialiser le store pour la gestion hors ligne
const shoppingListStore = useShoppingListStore()
shoppingListStore.init()

app.mount('#app')
