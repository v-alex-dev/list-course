<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <header>
    <nav class="flex justify-center space-x-8">
      <RouterLink to="/" class="link-neon">Accueil</RouterLink>
      <RouterLink to="/demo-styles" class="link-neon-pink">Démo Styles</RouterLink>
    </nav>
  </header>
</template>
