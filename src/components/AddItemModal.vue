<template>
  <div v-if="isOpen" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2 class="modal-title">Ajouter un article</h2>
        <button @click="closeModal" class="close-button">
          <span>×</span>
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="modal-form">
        <div class="form-group">
          <label for="itemName">Nom de l'article</label>
          <input
            id="itemName"
            v-model="form.name"
            type="text"
            placeholder="Ex: Pommes de terre"
            required
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label for="quantity">Quantité</label>
          <input
            id="quantity"
            v-model.number="form.quantity"
            type="number"
            min="1"
            placeholder="1"
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label>Catégorie</label>
          <div class="tags-grid">
            <button
              v-for="tag in tags"
              :key="tag.id"
              type="button"
              @click="selectTag(tag.id)"
              :class="['tag-button', { active: form.tagId === tag.id }]"
              :style="{ '--tag-color': tag.color }"
            >
              <span class="tag-icon">{{ tag.icon }}</span>
              <span class="tag-name">{{ tag.name }}</span>
            </button>
          </div>
        </div>

        <div class="modal-actions">
          <button type="button" @click="closeModal" class="btn-cancel">Annuler</button>
          <button type="submit" :disabled="!canSubmit" class="btn-submit">Ajouter</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useShoppingListStore } from '../stores/shoppingList.js'

const shoppingStore = useShoppingListStore()

defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close'])

const form = ref({
  name: '',
  quantity: 1,
  tagId: null,
})

const tags = computed(() => shoppingStore.tags)

const canSubmit = computed(() => {
  return form.value.name.trim() && form.value.tagId
})

const selectTag = (tagId) => {
  form.value.tagId = tagId
}

const handleSubmit = async () => {
  if (canSubmit.value) {
    await shoppingStore.addItem({
      name: form.value.name.trim(),
      quantity: form.value.quantity,
      tagId: form.value.tagId,
    })

    // Reset form
    form.value = {
      name: '',
      quantity: 1,
      tagId: null,
    }

    closeModal()
  }
}

const closeModal = () => {
  emit('close')
  shoppingStore.closeModal()
}
</script>

<style scoped>
.modal-overlay {
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
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: linear-gradient(135deg, rgba(6, 182, 212, 0.1), rgba(168, 85, 247, 0.1));
  backdrop-filter: blur(16px);
  border: 1px solid rgba(6, 182, 212, 0.2);
  border-radius: 16px;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
  transition: all 0.3s;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 1.5rem 1rem;
  border-bottom: 1px solid rgba(156, 163, 175, 0.3);
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #f9fafb;
  margin: 0;
  text-shadow: 0 0 10px rgba(6, 182, 212, 0.5);
}

.close-button {
  background: rgba(31, 41, 55, 0.5);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(156, 163, 175, 0.3);
  font-size: 2rem;
  color: #e5e7eb;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s;
}

.close-button:hover {
  background: rgba(239, 68, 68, 0.2);
  border-color: rgba(239, 68, 68, 0.5);
  color: #fca5a5;
  transform: scale(1.1);
}

.modal-form {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #d1d5db;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
}

.tags-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.tag-button {
  background: rgba(31, 41, 55, 0.5);
  backdrop-filter: blur(8px);
  border: 2px solid rgba(156, 163, 175, 0.3);
  border-radius: 12px;
  padding: 0.75rem;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  color: #e5e7eb;
}

.tag-button:hover {
  border-color: var(--tag-color);
  background: rgba(31, 41, 55, 0.7);
  transform: scale(1.05);
  box-shadow: 0 0 15px rgba(var(--tag-color), 0.3);
}

.tag-button.active {
  border-color: var(--tag-color);
  background: linear-gradient(135deg, var(--tag-color), rgba(var(--tag-color), 0.7));
  color: white;
  box-shadow: 0 0 20px rgba(var(--tag-color), 0.5);
}

.tag-icon {
  font-size: 1.5rem;
}

.tag-name {
  font-size: 0.875rem;
  font-weight: 500;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
}

.btn-cancel,
.btn-submit {
  padding: 0.75rem 1.5rem;
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

.btn-submit {
  background: linear-gradient(135deg, #06b6d4, #8b5cf6);
  border: 1px solid #06b6d4;
  color: white;
  box-shadow: 0 0 15px rgba(6, 182, 212, 0.3);
}

.btn-submit:hover:not(:disabled) {
  background: linear-gradient(135deg, #0891b2, #7c3aed);
  transform: scale(1.05);
  box-shadow: 0 0 20px rgba(6, 182, 212, 0.5);
}

.btn-submit:disabled {
  background: rgba(156, 163, 175, 0.5);
  border-color: rgba(156, 163, 175, 0.5);
  cursor: not-allowed;
  box-shadow: none;
}

@media (max-width: 768px) {
  .modal-content {
    margin: 1rem;
    border-radius: 12px;
  }

  .tags-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .modal-actions {
    flex-direction: column;
  }
}
</style>
