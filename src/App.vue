<script setup>
import { RouterView } from 'vue-router'
import PwaInstall from './components/PwaInstall.vue'
import ConnectionStatus from './components/ConnectionStatus.vue'
import ToastContainer from './components/ToastContainer.vue'
</script>

<template>
  <PwaInstall />
  <ConnectionStatus />
  <ToastContainer />
  <main>
    <RouterView />
  </main>
</template>

<style scoped></style>
