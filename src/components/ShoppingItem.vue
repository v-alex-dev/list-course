<template>
  <div class="shopping-item" :class="{ completed: item.completed }">
    <div class="item-content" @click="toggleCompleted">
      <div class="checkbox-container">
        <div class="checkbox" :class="{ checked: item.completed }">
          <svg
            v-if="item.completed"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="3"
          >
            <polyline points="20,6 9,17 4,12"></polyline>
          </svg>
        </div>
      </div>

      <div class="item-details">
        <div class="item-header">
          <h3 class="item-name">{{ item.name }}</h3>
          <span class="item-quantity">{{ item.quantity }}x</span>
        </div>

        <div class="item-tag">
          <span class="tag-badge" :style="{ backgroundColor: tag?.color }">
            <span class="tag-icon">{{ tag?.icon }}</span>
            <span class="tag-name">{{ tag?.name }}</span>
          </span>
        </div>
      </div>
    </div>

    <div class="item-actions">
      <button @click="showDeleteConfirm" class="delete-button">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="3,6 5,6 21,6"></polyline>
          <path
            d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"
          ></path>
          <line x1="10" y1="11" x2="10" y2="17"></line>
          <line x1="14" y1="11" x2="14" y2="17"></line>
        </svg>
      </button>
    </div>
  </div>

  <!-- Delete Confirmation Modal -->
  <div v-if="showConfirm" class="confirm-overlay" @click="hideDeleteConfirm">
    <div class="confirm-modal" @click.stop>
      <div class="confirm-header">
        <h3>Supprimer l'article</h3>
      </div>
      <div class="confirm-content">
        <p>
          Êtes-vous sûr de vouloir supprimer <strong>{{ item.name }}</strong> de votre liste ?
        </p>
      </div>
      <div class="confirm-actions">
        <button @click="hideDeleteConfirm" class="btn-cancel">Annuler</button>
        <button @click="confirmDelete" class="btn-delete">Supprimer</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useShoppingListStore } from '../stores/shoppingList.js'

const shoppingStore = useShoppingListStore()

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
})

const showConfirm = ref(false)

const tag = computed(() => {
  return shoppingStore.getTagById(props.item.tagId)
})

const toggleCompleted = async () => {
  await shoppingStore.toggleItemCompleted(props.item.id)
}

const showDeleteConfirm = () => {
  showConfirm.value = true
}

const hideDeleteConfirm = () => {
  showConfirm.value = false
}

const confirmDelete = async () => {
  await shoppingStore.deleteItem(props.item.id)
  hideDeleteConfirm()
}
</script>

<style scoped>
.shopping-item {
  background: rgba(31, 41, 55, 0.4);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(156, 163, 175, 0.3);
  border-radius: 12px;
  padding: 0.75rem;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.shopping-item:hover {
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  border-color: rgba(6, 182, 212, 0.4);
  transform: translateY(-1px);
}

.shopping-item.completed {
  opacity: 0.6;
  background: rgba(31, 41, 55, 0.2);
  border-color: rgba(34, 197, 94, 0.4);
}

.item-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  flex: 1;
  user-select: none;
  padding: 0.25rem;
  border-radius: 8px;
  transition: all 0.2s;
}

.item-content:hover {
  background: rgba(6, 182, 212, 0.1);
}

.checkbox-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.checkbox-container {
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

.item-details {
  flex: 1;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.25rem;
}

.item-name {
  font-size: 1rem;
  font-weight: 500;
  color: #f9fafb;
  margin: 0;
  text-decoration: none;
}

.completed .item-name {
  text-decoration: line-through;
  color: #9ca3af;
}

.item-quantity {
  font-size: 0.75rem;
  font-weight: 600;
  color: #06b6d4;
  background: rgba(6, 182, 212, 0.1);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(6, 182, 212, 0.3);
  padding: 0.125rem 0.375rem;
  border-radius: 8px;
  margin-left: 0.375rem;
}

.item-tag {
  display: flex;
  align-items: center;
}

.tag-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.125rem 0.375rem;
  border-radius: 8px;
  font-size: 0.7rem;
  font-weight: 500;
  color: white;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
}

.tag-icon {
  font-size: 0.75rem;
}

.tag-name {
  text-transform: capitalize;
}

.item-actions {
  display: flex;
  align-items: center;
  margin-left: 0.375rem;
}

.delete-button {
  background: rgba(31, 41, 55, 0.5);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(156, 163, 175, 0.3);
  cursor: pointer;
  padding: 0.375rem;
  border-radius: 8px;
  color: #e5e7eb;
  transition: all 0.3s;
}

.delete-button:hover {
  background: rgba(239, 68, 68, 0.2);
  border-color: rgba(239, 68, 68, 0.5);
  color: #fca5a5;
  transform: scale(1.05);
  box-shadow: 0 0 10px rgba(239, 68, 68, 0.3);
}

.delete-button svg {
  width: 16px;
  height: 16px;
}

/* Confirmation Modal */
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
.btn-delete {
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

.btn-delete {
  background: linear-gradient(135deg, #dc2626, #b91c1c);
  border: 1px solid #dc2626;
  color: white;
  box-shadow: 0 0 15px rgba(220, 38, 38, 0.3);
}

.btn-delete:hover {
  background: linear-gradient(135deg, #b91c1c, #991b1b);
  transform: scale(1.05);
  box-shadow: 0 0 20px rgba(220, 38, 38, 0.5);
}

@media (max-width: 768px) {
  .shopping-item {
    padding: 0.5rem;
    border-radius: 8px;
    gap: 0.375rem;
  }

  .item-content {
    gap: 0.375rem;
    padding: 0.125rem;
  }

  .checkbox {
    width: 16px;
    height: 16px;
  }

  .checkbox svg {
    width: 10px;
    height: 10px;
  }

  .item-name {
    font-size: 0.875rem;
  }

  .item-quantity {
    font-size: 0.7rem;
    padding: 0.1rem 0.25rem;
    margin-left: 0.25rem;
  }

  .tag-badge {
    padding: 0.1rem 0.25rem;
    font-size: 0.65rem;
    gap: 0.125rem;
  }

  .tag-icon {
    font-size: 0.7rem;
  }

  .item-header {
    margin-bottom: 0.125rem;
  }

  .item-actions {
    margin-left: 0.25rem;
  }

  .delete-button {
    padding: 0.25rem;
  }

  .delete-button svg {
    width: 14px;
    height: 14px;
  }

  .confirm-actions {
    flex-direction: column;
  }
}
</style>
