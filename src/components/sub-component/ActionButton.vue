<template>
  <button
    @click="$emit('click')"
    class="action-button"
    :class="[variant, { disabled: disabled }]"
    :disabled="disabled"
    type="button"
  >
    <component v-if="icon" :is="icon" class="button-icon" />
    <span v-if="$slots.default" class="button-text">
      <slot />
    </span>
  </button>
</template>

<script setup>
defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'danger', 'ghost'].includes(value),
  },
  icon: {
    type: [Object, String],
    default: null,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['click'])
</script>

<style scoped>
.action-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  backdrop-filter: blur(8px);
  border: 1px solid transparent;
  font-size: 0.875rem;
}

.action-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}

.action-button.primary {
  background: linear-gradient(135deg, #06b6d4, #0891b2);
  border-color: #06b6d4;
  color: white;
  box-shadow: 0 0 15px rgba(6, 182, 212, 0.3);
}

.action-button.primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #0891b2, #0e7490);
  transform: scale(1.05);
  box-shadow: 0 0 20px rgba(6, 182, 212, 0.5);
}

.action-button.secondary {
  background: rgba(31, 41, 55, 0.5);
  border-color: rgba(156, 163, 175, 0.5);
  color: #e5e7eb;
}

.action-button.secondary:hover:not(:disabled) {
  background: rgba(75, 85, 99, 0.7);
  border-color: rgba(6, 182, 212, 0.5);
  color: #06b6d4;
  transform: scale(1.05);
}

.action-button.danger {
  background: linear-gradient(135deg, #dc2626, #b91c1c);
  border-color: #dc2626;
  color: white;
  box-shadow: 0 0 15px rgba(220, 38, 38, 0.3);
}

.action-button.danger:hover:not(:disabled) {
  background: linear-gradient(135deg, #b91c1c, #991b1b);
  transform: scale(1.05);
  box-shadow: 0 0 20px rgba(220, 38, 38, 0.5);
}

.action-button.ghost {
  background: rgba(31, 41, 55, 0.5);
  border-color: rgba(156, 163, 175, 0.3);
  color: #e5e7eb;
}

.action-button.ghost:hover:not(:disabled) {
  background: rgba(239, 68, 68, 0.2);
  border-color: rgba(239, 68, 68, 0.5);
  color: #fca5a5;
  transform: scale(1.05);
  box-shadow: 0 0 10px rgba(239, 68, 68, 0.3);
}

.button-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.button-text {
  white-space: nowrap;
}

@media (max-width: 768px) {
  .action-button {
    padding: 0.375rem 0.75rem;
    font-size: 0.8rem;
  }

  .button-icon {
    width: 14px;
    height: 14px;
  }
}
</style>
