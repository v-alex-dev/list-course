<template>
  <span
    class="tag-badge"
    :style="{ backgroundColor: tag?.color }"
    :class="{ clickable: clickable }"
    @click="handleClick"
  >
    <span class="tag-icon">{{ tag?.icon }}</span>
    <span class="tag-name">{{ tag?.name }}</span>
    <span v-if="showCount && count > 0" class="tag-count">{{ count }}</span>
  </span>
</template>

<script setup>
const props = defineProps({
  tag: {
    type: Object,
    required: true,
  },
  count: {
    type: Number,
    default: 0,
  },
  showCount: {
    type: Boolean,
    default: false,
  },
  clickable: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['click'])

const handleClick = () => {
  if (props.clickable) {
    emit('click')
  }
}
</script>

<style scoped>
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
  transition: all 0.3s;
}

.tag-badge.clickable {
  cursor: pointer;
}

.tag-badge.clickable:hover {
  transform: scale(1.05);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}

.tag-icon {
  font-size: 0.75rem;
}

.tag-name {
  text-transform: capitalize;
}

.tag-count {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(4px);
  padding: 0.125rem 0.375rem;
  border-radius: 12px;
  font-size: 0.65rem;
  font-weight: 600;
  min-width: 16px;
  text-align: center;
}

@media (max-width: 768px) {
  .tag-badge {
    padding: 0.1rem 0.25rem;
    font-size: 0.65rem;
    gap: 0.125rem;
  }

  .tag-icon {
    font-size: 0.7rem;
  }

  .tag-count {
    font-size: 0.6rem;
    padding: 0.1rem 0.25rem;
  }
}
</style>
