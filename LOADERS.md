# 🔄 Système de Loaders

Ce projet inclut un système complet de loaders/spinners pour indiquer les états de chargement à l'utilisateur.

## 📦 Composants disponibles

### `LoaderSpinner.vue`

Composant principal de loader réutilisable avec plusieurs options :

```vue
<LoaderSpinner :show="isLoading" :message="loadingMessage" size="medium" :overlay="true" />
```

**Props :**

- `show` (Boolean) : Affiche/cache le loader
- `message` (String) : Message à afficher sous le spinner
- `size` (String) : Taille du spinner (small, medium, large)
- `overlay` (Boolean) : Si true, affiche un overlay plein écran

### `useLoading.js`

Composable pour centraliser tous les états de loading :

```js
import { useLoading } from '@/composables/useLoading.js'

const {
  isLoading, // État global
  isLoadingProfiles, // Chargement des profils
  isLoadingShoppingList, // Chargement de la liste
  isSyncing, // Synchronisation
  isAddingItem, // Ajout d'un item
  loadingMessage, // Message contextuel
} = useLoading()
```

## 🎯 États de loading disponibles

### États globaux

- **Chargement des profils** : Lors de `loadProfiles()`
- **Chargement des listes** : Lors de `loadShoppingList()`
- **Synchronisation** : Lors de la sync des données offline

### États granulaires

- **Ajout d'item** : Pendant `addItem()`
- **Mise à jour d'item** : Pendant `updateItem()`
- **Suppression d'item** : Pendant `deleteItem()`
- **Sauvegarde** : Pendant `saveShoppingList()`

## 🚀 Utilisation dans les composants

### Loader global (overlay)

```vue
<template>
  <div class="page">
    <LoaderSpinner :show="isLoading" :message="loadingMessage" />
    <!-- Contenu de la page -->
  </div>
</template>

<script setup>
import { useLoading } from '@/composables/useLoading.js'
import LoaderSpinner from '@/components/LoaderSpinner.vue'

const { isLoading, loadingMessage } = useLoading()
</script>
```

### Loader local (inline)

```vue
<template>
  <div class="container">
    <LoaderSpinner :show="isLoadingProfiles" :overlay="false" size="small" />
  </div>
</template>
```

### Loader sur bouton

```vue
<template>
  <button :disabled="isSubmitting" class="btn">
    <span v-if="isSubmitting" class="spinner"></span>
    {{ isSubmitting ? 'Chargement...' : 'Envoyer' }}
  </button>
</template>

<script setup>
import { ref } from 'vue'

const isSubmitting = ref(false)

const handleSubmit = async () => {
  isSubmitting.value = true
  try {
    // Action async
  } finally {
    isSubmitting.value = false
  }
}
</script>
```

## 🎨 Styles et animations

Le loader utilise :

- **Animation CSS** : Rotation fluide avec `@keyframes spin`
- **Backdrop-filter** : Effet de flou sur l'overlay
- **Multiple anneaux** : 4 anneaux colorés pour un effet visuel attrayant
- **Responsive** : Optimisé pour mobile et desktop

## 🔧 Configuration

### Couleurs personnalisées

Les couleurs sont définies dans `LoaderSpinner.vue` :

```css
.spinner-ring:nth-child(1) {
  border-top-color: #06b6d4;
} /* Cyan */
.spinner-ring:nth-child(2) {
  border-top-color: #8b5cf6;
} /* Purple */
.spinner-ring:nth-child(3) {
  border-top-color: #10b981;
} /* Green */
.spinner-ring:nth-child(4) {
  border-top-color: #f59e0b;
} /* Orange */
```

### Messages contextuels

Les messages sont automatiquement gérés dans `useLoading.js` selon l'action en cours.

## 🌟 Fonctionnalités avancées

### Support offline

Le système détecte automatiquement :

- **Mode hors ligne** : Affiche "Mode hors ligne activé"
- **Synchronisation** : Affiche "Synchronisation en cours..."
- **Reconnexion** : Affiche "Connexion rétablie"

### Prévention des actions multiples

Les loaders locaux empêchent :

- Les clics multiples sur les boutons
- Les soumissions simultanées de formulaires
- Les actions pendant une synchronisation

## 🚨 Bonnes pratiques

1. **Utilisez des loaders appropriés** :
   - Overlay pour les chargements de page
   - Inline pour les sections
   - Bouton pour les actions

2. **Messages clairs** :
   - "Chargement..." pour les données
   - "Sauvegarde..." pour les écritures
   - "Synchronisation..." pour l'offline

3. **Gestion des erreurs** :
   - Toujours utiliser try/finally
   - Désactiver les loaders en cas d'erreur
   - Afficher des messages d'erreur appropriés

4. **Performance** :
   - Éviter les loaders pour les actions < 200ms
   - Utiliser des squelettes pour les longues listes
   - Optimiser les animations sur mobile
