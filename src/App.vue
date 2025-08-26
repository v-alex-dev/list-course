<script setup>
import { RouterView } from 'vue-router'
import PwaInstall from './components/PwaInstall.vue'
</script>

<template>
  <PwaInstall />
  <main>
    <RouterView />
  </main>
</template>

<style scoped></style>
