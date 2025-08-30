<script setup>
import { RouterView } from 'vue-router'
import PwaInstall from './components/PwaInstall.vue'
import ConnectionStatus from './components/ConnectionStatus.vue'
import ToastContainer from './components/ToastContainer.vue'
import DebugPanel from './components/DebugPanel.vue'
</script>

<template>
  <PwaInstall />
  <ConnectionStatus />
  <ToastContainer />
  <DebugPanel />
  <main>
    <RouterView />
  </main>
</template>

<style scoped></style>
