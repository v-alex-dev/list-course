<template>
  <div
    class="bg-slate-800/40 border border-slate-600/30 rounded-2xl p-5 shadow-sm transition-all duration-200"
  >
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-semibold text-white m-0">Filtres</h3>
      <button
        v-if="selectedTags.length > 0"
        @click="clearFilters"
        class="bg-slate-800/50 border border-slate-600/30 text-slate-300 text-sm cursor-pointer px-3 py-1 rounded-xl transition-all duration-200 hover:bg-slate-700/70 hover:border-cyan-500/50 hover:text-cyan-400 hover:scale-105"
      >
        Tout effacer
      </button>
    </div>

    <div class="flex flex-wrap gap-2">
      <button
        v-for="tag in availableTagsWithItems"
        :key="tag.id"
        @click="toggleTag(tag.id)"
        class="flex items-center gap-2 px-3 py-2 bg-slate-800/50 border-2 border-slate-600/30 rounded-2xl cursor-pointer transition-all duration-200 text-sm font-medium text-slate-300 hover:border-cyan-400 hover:bg-slate-800/70 hover:scale-105"
        :class="{
          'bg-cyan-500 border-cyan-400 text-white': selectedTags.includes(tag.id),
        }"
        :style="
          selectedTags.includes(tag.id)
            ? { backgroundColor: tag.color, borderColor: tag.color }
            : {}
        "
      >
        <span class="text-base">{{ tag.icon }}</span>
        <span class="capitalize">{{ tag.name }}</span>
        <span
          v-if="getItemCount(tag.id) > 0"
          class="bg-white/20 px-2 py-1 rounded-xl text-xs font-semibold min-w-5 text-center"
          :class="{ 'bg-white/30': selectedTags.includes(tag.id) }"
        >
          {{ getItemCount(tag.id) }}
        </span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useShoppingListStore } from '../stores/shoppingList.js'

const store = useShoppingListStore()

const availableTagsWithItems = computed(() => store.availableTagsWithItems)
const selectedTags = computed(() => store.selectedTags)
const items = computed(() => store.items)

const getItemCount = (tagId) => {
  return items.value.filter((item) => item.tagId === tagId && !item.completed).length
}

const toggleTag = (tagId) => {
  store.toggleTagFilter(tagId)
}

const clearFilters = () => {
  store.clearFilters()
}
</script>

<style scoped>
/* Optimisation mobile */
@media (max-width: 768px) {
  .bg-slate-800\/40 {
    padding: 1rem !important;
  }

  .gap-2 {
    gap: 0.375rem !important;
  }

  button {
    padding: 0.375rem 0.625rem !important;
    font-size: 0.8rem !important;
    transition-duration: 0.15s !important;
  }

  .text-base {
    font-size: 0.875rem !important;
  }
}
</style>
