<template>
  <view class="modal-overlay" v-if="visible" @click="handleDismiss">
    <view class="modal-content" @click.stop>
      <view class="modal-header">
        <Icon name="bell" :size="48" color="var(--primary)" />
      </view>
      <view class="modal-body">
        <text class="modal-title">该喂奶啦</text>
        <text class="modal-description">距离上次喂奶已超过 {{ intervalHours }} 小时</text>
        <view class="last-feeding-info" v-if="lastFeeding">
          <text class="info-label">上次喂奶</text>
          <text class="info-value">{{ formatTime(lastFeeding.time) }} {{ lastFeeding.amount }}ml</text>
        </view>
      </view>
      <view class="modal-footer">
        <button class="btn-secondary" @click="handleDismiss">稍后提醒</button>
        <button class="btn-primary" @click="handleRecord">记录喂奶</button>
      </view>
    </view>
  </view>
</template>

<script setup>
import Icon from '@/components/icon.vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  lastFeeding: {
    type: Object,
    default: null
  },
  intervalHours: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['dismiss', 'record'])

const handleDismiss = () => {
  emit('dismiss')
}

const handleRecord = () => {
  emit('record')
}

const formatTime = (time) => {
  if (!time) return '-'
  const date = new Date(time)
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.modal-content {
  background-color: var(--card);
  border-radius: 20px;
  padding: 32px 24px;
  width: 80%;
  max-width: 320px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
}

.modal-header {
  margin-bottom: 16px;
}

.modal-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
}

.modal-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
}

.modal-description {
  font-size: 14px;
  color: var(--text-secondary);
}

.last-feeding-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  margin-top: 16px;
  padding: 12px 16px;
  background-color: var(--secondary);
  border-radius: 12px;
  width: 100%;
}

.info-label {
  font-size: 12px;
  color: var(--text-tertiary);
}

.info-value {
  font-size: 14px;
  color: var(--text-primary);
  font-weight: 500;
}

.modal-footer {
  display: flex;
  gap: 12px;
  width: 100%;
}

.btn-secondary,
.btn-primary {
  flex: 1;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-secondary {
  background-color: var(--secondary);
  color: var(--text-primary);
}

.btn-secondary:active {
  background-color: var(--primary-light);
}

.btn-primary {
  background-color: var(--primary);
  color: white;
}

.btn-primary:active {
  background-color: var(--primary-dark);
}
</style>
