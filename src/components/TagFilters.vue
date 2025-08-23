<template>
  <div class="tag-filters">
    <div class="filters-header">
      <h3 class="filters-title">Filtres</h3>
      <button v-if="selectedTags.length > 0" @click="clearFilters" class="clear-filters-btn">
        Tout effacer
      </button>
    </div>

    <div class="tags-container">
      <button
        v-for="tag in tags"
        :key="tag.id"
        @click="toggleTag(tag.id)"
        :class="['tag-filter', { active: selectedTags.includes(tag.id) }]"
        :style="{ '--tag-color': tag.color }"
      >
        <span class="tag-icon">{{ tag.icon }}</span>
        <span class="tag-name">{{ tag.name }}</span>
        <span v-if="getItemCount(tag.id) > 0" class="tag-count">
          {{ getItemCount(tag.id) }}
        </span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useShoppingListStore } from '../stores/counter.js'

const store = useShoppingListStore()

const tags = computed(() => store.tags)
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
.tag-filters {
  background: rgba(31, 41, 55, 0.4);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(156, 163, 175, 0.3);
  border-radius: 16px;
  padding: 1.25rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: all 0.3s;
}

.filters-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.filters-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #f9fafb;
  margin: 0;
  text-shadow: 0 0 8px rgba(6, 182, 212, 0.5);
}

.clear-filters-btn {
  background: rgba(31, 41, 55, 0.5);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(156, 163, 175, 0.3);
  color: #e5e7eb;
  font-size: 0.875rem;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  transition: all 0.3s;
}

.clear-filters-btn:hover {
  background: rgba(75, 85, 99, 0.7);
  border-color: rgba(6, 182, 212, 0.5);
  color: #06b6d4;
  transform: scale(1.05);
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag-filter {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: rgba(31, 41, 55, 0.5);
  backdrop-filter: blur(8px);
  border: 2px solid rgba(156, 163, 175, 0.3);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 0.875rem;
  font-weight: 500;
  color: #e5e7eb;
}

.tag-filter:hover {
  border-color: var(--tag-color);
  background: rgba(31, 41, 55, 0.7);
  transform: scale(1.05);
  box-shadow: 0 0 15px rgba(var(--tag-color), 0.3);
}

.tag-filter.active {
  background: linear-gradient(135deg, var(--tag-color), rgba(var(--tag-color), 0.7));
  border-color: var(--tag-color);
  color: white;
  box-shadow: 0 0 20px rgba(var(--tag-color), 0.5);
}

.tag-icon {
  font-size: 1rem;
}

.tag-name {
  text-transform: capitalize;
}

.tag-count {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(4px);
  padding: 0.125rem 0.375rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  min-width: 20px;
  text-align: center;
}

.tag-filter:not(.active) .tag-count {
  background: rgba(var(--tag-color), 0.2);
  border: 1px solid rgba(var(--tag-color), 0.3);
  color: var(--tag-color);
}

@media (max-width: 768px) {
  .tag-filters {
    padding: 1rem;
  }

  .tags-container {
    gap: 0.375rem;
  }

  .tag-filter {
    padding: 0.375rem 0.625rem;
    font-size: 0.8rem;
  }

  .tag-icon {
    font-size: 0.875rem;
  }
}
</style>
