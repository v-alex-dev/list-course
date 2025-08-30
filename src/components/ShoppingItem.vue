<template>
  <div
    class="bg-slate-800/40 border border-slate-600/30 rounded-xl p-3 transition-all duration-200 shadow-sm hover:shadow-md hover:border-cyan-400/40 hover:-translate-y-0.5 flex items-center gap-3"
    :class="{
      'opacity-60 bg-slate-800/20 border-green-400/40': item.completed,
      'opacity-50 pointer-events-none': isLoading,
    }"
  >
    <div
      class="flex items-center gap-3 cursor-pointer flex-1 p-1 rounded-lg transition-all duration-150 hover:bg-cyan-500/10"
      @click="toggleCompleted"
    >
      <BaseCheckbox :checked="item.completed" @toggle="toggleCompleted" :disabled="isLoading" />

      <div class="flex-1">
        <div class="flex justify-between items-center mb-1">
          <h3
            class="text-base font-medium text-white m-0 transition-all flex items-center gap-2"
            :class="{ 'line-through text-slate-400': item.completed }"
          >
            {{ item.name }}
            <div v-if="isLoading" class="inline-flex">
              <div
                class="w-3 h-3 border border-cyan-400 border-t-transparent rounded-full animate-spin"
              ></div>
            </div>
          </h3>
          <span
            class="text-xs font-semibold text-cyan-400 bg-cyan-400/10 border border-cyan-400/30 px-2 py-1 rounded-lg ml-2"
          >
            {{ item.quantity }}x
          </span>
        </div>

        <div class="flex items-center">
          <TagBadge :tag="tag" />
        </div>
      </div>
    </div>

    <div class="flex items-center ml-2">
      <button
        @click="showDeleteConfirm"
        :disabled="isLoading"
        class="bg-slate-800/50 border border-slate-600/30 cursor-pointer p-2 rounded-lg text-slate-300 transition-all duration-200 hover:bg-red-500/20 hover:border-red-500/50 hover:text-red-400 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4">
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
  <ConfirmationModal
    :is-open="showConfirm"
    title="Supprimer l'article"
    :message="`Êtes-vous sûr de vouloir supprimer <strong>${item.name}</strong> de votre liste ?`"
    confirm-text="Supprimer"
    cancel-text="Annuler"
    confirm-type="delete"
    @close="hideDeleteConfirm"
    @confirm="confirmDelete"
  />
</template>

<script setup>
import { ref, computed } from 'vue'
import { useShoppingListStore } from '../stores/shoppingList.js'
import BaseCheckbox from './sub-component/BaseCheckbox.vue'
import TagBadge from './sub-component/TagBadge.vue'
import ConfirmationModal from './sub-component/ConfirmationModal.vue'

const shoppingStore = useShoppingListStore()

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
})

const showConfirm = ref(false)
const isLoading = ref(false)

const tag = computed(() => {
  return shoppingStore.getTagById(props.item.tagId)
})

const toggleCompleted = async () => {
  if (isLoading.value) return
  isLoading.value = true
  try {
    await shoppingStore.toggleItemCompleted(props.item.id)
  } finally {
    isLoading.value = false
  }
}

const showDeleteConfirm = () => {
  showConfirm.value = true
}

const hideDeleteConfirm = () => {
  showConfirm.value = false
}

const confirmDelete = async () => {
  if (isLoading.value) return
  isLoading.value = true
  try {
    await shoppingStore.deleteItem(props.item.id)
    hideDeleteConfirm()
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
/* Optimisation mobile */
@media (max-width: 768px) {
  .bg-slate-800\/40 {
    padding: 0.5rem !important;
    border-radius: 0.5rem !important;
    gap: 0.375rem !important;
  }

  h3 {
    font-size: 0.875rem !important;
  }

  span {
    font-size: 0.7rem !important;
    padding: 0.1rem 0.25rem !important;
    margin-left: 0.25rem !important;
  }

  button {
    padding: 0.25rem !important;
  }

  svg {
    width: 14px !important;
    height: 14px !important;
  }

  * {
    transition-duration: 0.1s !important;
  }
}
</style>
