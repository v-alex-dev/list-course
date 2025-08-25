<template>
  <div v-if="isOpen" class="confirm-overlay" @click="$emit('close')">
    <div class="confirm-modal" @click.stop>
      <div class="confirm-header">
        <h3>{{ title }}</h3>
      </div>
      <div class="confirm-content">
        <p v-html="message"></p>
      </div>
      <div class="confirm-actions">
        <button @click="$emit('close')" class="btn-cancel">{{ cancelText }}</button>
        <button @click="$emit('confirm')" class="btn-confirm" :class="confirmType">
          {{ confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  confirmText: {
    type: String,
    default: 'Confirmer',
  },
  cancelText: {
    type: String,
    default: 'Annuler',
  },
  confirmType: {
    type: String,
    default: 'delete', // 'delete', 'primary', 'secondary'
    validator: (value) => ['delete', 'primary', 'secondary'].includes(value),
  },
})

defineEmits(['close', 'confirm'])
</script>

<style scoped>
.confirm-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
  padding: 1rem;
}

.confirm-modal {
  background: linear-gradient(135deg, rgba(6, 182, 212, 0.1), rgba(168, 85, 247, 0.1));
  backdrop-filter: blur(16px);
  border: 1px solid rgba(6, 182, 212, 0.2);
  border-radius: 16px;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
}

.confirm-header {
  padding: 1.5rem 1.5rem 1rem;
  border-bottom: 1px solid rgba(156, 163, 175, 0.3);
}

.confirm-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #f9fafb;
  text-shadow: 0 0 10px rgba(6, 182, 212, 0.5);
}

.confirm-content {
  padding: 1.5rem;
}

.confirm-content p {
  margin: 0;
  color: #d1d5db;
  line-height: 1.5;
}

.confirm-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding: 1rem 1.5rem 1.5rem;
}

.btn-cancel,
.btn-confirm {
  padding: 0.5rem 1rem;
  border-radius: 25px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  backdrop-filter: blur(8px);
}

.btn-cancel {
  background: rgba(31, 41, 55, 0.5);
  border: 1px solid rgba(156, 163, 175, 0.5);
  color: #e5e7eb;
}

.btn-cancel:hover {
  background: rgba(75, 85, 99, 0.7);
  transform: scale(1.05);
}

.btn-confirm.delete {
  background: linear-gradient(135deg, #dc2626, #b91c1c);
  border: 1px solid #dc2626;
  color: white;
  box-shadow: 0 0 15px rgba(220, 38, 38, 0.3);
}

.btn-confirm.delete:hover {
  background: linear-gradient(135deg, #b91c1c, #991b1b);
  transform: scale(1.05);
  box-shadow: 0 0 20px rgba(220, 38, 38, 0.5);
}

.btn-confirm.primary {
  background: linear-gradient(135deg, #06b6d4, #0891b2);
  border: 1px solid #06b6d4;
  color: white;
  box-shadow: 0 0 15px rgba(6, 182, 212, 0.3);
}

.btn-confirm.primary:hover {
  background: linear-gradient(135deg, #0891b2, #0e7490);
  transform: scale(1.05);
  box-shadow: 0 0 20px rgba(6, 182, 212, 0.5);
}

.btn-confirm.secondary {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  border: 1px solid #8b5cf6;
  color: white;
  box-shadow: 0 0 15px rgba(139, 92, 246, 0.3);
}

.btn-confirm.secondary:hover {
  background: linear-gradient(135deg, #7c3aed, #6d28d9);
  transform: scale(1.05);
  box-shadow: 0 0 20px rgba(139, 92, 246, 0.5);
}

@media (max-width: 768px) {
  .confirm-actions {
    flex-direction: column;
  }
}
</style>
