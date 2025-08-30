<template>
  <div v-if="show" class="loader-overlay" :class="{ 'overlay-full': overlay }">
    <div class="loader-container">
      <div class="loader-spinner" :class="sizeClass">
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
      </div>
      <p v-if="message" class="loader-message">{{ message }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  message: {
    type: String,
    default: '',
  },
  size: {
    type: String,
    default: 'medium', // small, medium, large
    validator: (value) => ['small', 'medium', 'large'].includes(value),
  },
  overlay: {
    type: Boolean,
    default: true,
  },
})

const sizeClass = computed(() => `spinner-${props.size}`)
</script>

<style scoped>
.loader-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  transition: all 0.3s ease;
}

.loader-overlay:not(.overlay-full) {
  position: absolute;
  border-radius: 16px;
}

.loader-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.loader-spinner {
  position: relative;
  display: inline-block;
}

.spinner-small {
  width: 32px;
  height: 32px;
}

.spinner-medium {
  width: 48px;
  height: 48px;
}

.spinner-large {
  width: 64px;
  height: 64px;
}

.spinner-ring {
  box-sizing: border-box;
  display: block;
  position: absolute;
  border: 3px solid transparent;
  border-top: 3px solid #06b6d4;
  border-radius: 50%;
  animation: spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
}

.spinner-small .spinner-ring {
  width: 32px;
  height: 32px;
  border-width: 2px;
  border-top-width: 2px;
}

.spinner-medium .spinner-ring {
  width: 48px;
  height: 48px;
  border-width: 3px;
  border-top-width: 3px;
}

.spinner-large .spinner-ring {
  width: 64px;
  height: 64px;
  border-width: 4px;
  border-top-width: 4px;
}

.spinner-ring:nth-child(1) {
  animation-delay: -0.45s;
  border-top-color: #06b6d4;
}

.spinner-ring:nth-child(2) {
  animation-delay: -0.3s;
  border-top-color: #8b5cf6;
}

.spinner-ring:nth-child(3) {
  animation-delay: -0.15s;
  border-top-color: #10b981;
}

.spinner-ring:nth-child(4) {
  border-top-color: #f59e0b;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loader-message {
  color: #f9fafb;
  font-size: 0.875rem;
  font-weight: 500;
  margin: 0;
  text-align: center;
  text-shadow: 0 0 10px rgba(6, 182, 212, 0.5);
}

/* Variante pour loader inline (sans overlay) */
.loader-overlay:not(.overlay-full) {
  position: relative;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 2rem;
  min-height: 120px;
}

/* Optimisations mobile */
@media (max-width: 768px) {
  .loader-overlay {
    backdrop-filter: blur(2px);
  }

  .loader-message {
    font-size: 0.75rem;
  }
}
</style>
