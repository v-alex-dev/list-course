<template>
  <div class="checkbox-container">
    <button
      @click="$emit('toggle')"
      class="checkbox-button"
      :class="{ checked: checked }"
      type="button"
    >
      <div class="checkbox" :class="{ checked: checked }">
        <svg v-if="checked" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
          <polyline points="20,6 9,17 4,12"></polyline>
        </svg>
      </div>
    </button>
  </div>
</template>

<script setup>
defineProps({
  checked: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['toggle'])
</script>

<style scoped>
.checkbox-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.checkbox-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.checkbox {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(156, 163, 175, 0.5);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  background: rgba(31, 41, 55, 0.5);
  backdrop-filter: blur(8px);
}

.checkbox.checked {
  background: linear-gradient(135deg, #10b981, #059669);
  border-color: #10b981;
  color: white;
  box-shadow: 0 0 15px rgba(16, 185, 129, 0.5);
}

.checkbox svg {
  width: 12px;
  height: 12px;
}

@media (max-width: 768px) {
  .checkbox {
    width: 16px;
    height: 16px;
  }

  .checkbox svg {
    width: 10px;
    height: 10px;
  }
}
</style>
