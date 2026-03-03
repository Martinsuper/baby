<template>
  <view class="manual-record">
    <text class="hint">点击按钮记录胎动</text>

    <!-- 记录按钮 -->
    <view class="record-btn" :class="{ pressed: isPressed }" @click="recordMovement" @mousedown="isPressed = true" @mouseup="isPressed = false" @touchstart="isPressed = true" @touchend="isPressed = false">
      <text class="btn-icon">👆</text>
      <text class="btn-label">记录</text>
    </view>

    <!-- 反馈动画 -->
    <view class="feedback" v-if="showFeedback">
      <text class="feedback-text">+1</text>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { useMovementsStore } from '@/store/movements'

const emit = defineEmits(['recorded'])

const movementsStore = useMovementsStore()

const isPressed = ref(false)
const showFeedback = ref(false)

const recordMovement = () => {
  // 添加记录
  movementsStore.addMovement({
    sessionType: 'singleClick'
  })

  // 显示反馈动画
  showFeedback.value = true
  setTimeout(() => {
    showFeedback.value = false
  }, 500)

  emit('recorded')
}
</script>

<style scoped>
.manual-record {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  padding: 24px 0;
  position: relative;
}

.hint {
  font-size: 14px;
  color: var(--text-secondary);
}

.record-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 140px;
  height: 140px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary) 0%, #EC407A 100%);
  box-shadow: 0 8px 24px rgba(233, 30, 99, 0.3);
  cursor: pointer;
  transition: all 0.15s ease;
}

.record-btn:active,
.record-btn.pressed {
  transform: scale(0.95);
  box-shadow: 0 4px 12px rgba(233, 30, 99, 0.3);
}

.record-btn .btn-icon {
  font-size: 40px;
}

.record-btn .btn-label {
  font-size: 14px;
  color: white;
  font-weight: 600;
  margin-top: 4px;
}

.feedback {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  animation: floatUp 0.5s ease-out forwards;
}

.feedback-text {
  font-size: 32px;
  font-weight: bold;
  color: var(--primary);
}

@keyframes floatUp {
  0% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -150%) scale(1.5);
  }
}
</style>