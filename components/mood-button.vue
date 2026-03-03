<template>
  <view class="mood-button" :class="{ selected: isSelected }" @click="$emit('select')">
    <text class="mood-icon">{{ mood.icon }}</text>
    <text class="mood-label" :style="{ color: isSelected ? mood.color : 'var(--text-secondary)' }">{{ mood.label }}</text>
  </view>
</template>

<script setup>
defineProps({
  mood: {
    type: Object,
    required: true
  },
  isSelected: {
    type: Boolean,
    default: false
  }
})

defineEmits(['select'])
</script>

<style scoped>
.mood-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 10px 0;
  border-radius: 10px;
  flex: 1;
  background-color: transparent;
  border: 2px solid transparent;
  transition: all 0.2s ease;
}

.mood-button.selected {
  background-color: rgba(233, 30, 99, 0.1);
  border-color: var(--primary);
}

.mood-icon {
  font-size: 20px;
}

.mood-label {
  font-size: 10px;
}
</style>