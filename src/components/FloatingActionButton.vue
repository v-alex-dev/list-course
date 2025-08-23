<template>
  <button @click="openModal" class="fab">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  </button>
</template>

<script setup>
import { useShoppingListStore } from '../stores/counter.js'

const store = useShoppingListStore()

const openModal = () => {
  store.openModal()
}
</script>

<style scoped>
.fab {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #06b6d4, #8b5cf6);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(6, 182, 212, 0.3);
  border-radius: 50%;
  color: white;
  cursor: pointer;
  box-shadow: 0 8px 25px rgba(6, 182, 212, 0.4);
  transition: all 0.3s;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
}

.fab:hover {
  background: linear-gradient(135deg, #0891b2, #7c3aed);
  box-shadow: 0 12px 35px rgba(6, 182, 212, 0.6);
  transform: translateY(-4px) scale(1.1);
  border-color: rgba(6, 182, 212, 0.6);
}

.fab:active {
  transform: translateY(-2px) scale(1.05);
}

.fab svg {
  width: 24px;
  height: 24px;
  filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.5));
}

@media (max-width: 768px) {
  .fab {
    bottom: 1.5rem;
    right: 1.5rem;
    width: 52px;
    height: 52px;
  }

  .fab svg {
    width: 22px;
    height: 22px;
  }
}
</style>
