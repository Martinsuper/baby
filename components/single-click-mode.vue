<template>
  <view class="single-click-mode">
    <text class="hint">点击按钮记录一次胎动</text>

    <view class="button-container">
      <!-- 外圈动画 -->
      <view class="pulse-ring" :class="{ animate: isAnimating }"></view>

      <!-- 主按钮 -->
      <button class="main-button" :class="{ pressed: isPressed }" @click="recordMovement">
        <Icon name="baby" :size="44" color="white" />
      </button>
    </view>

    <!-- 确认反馈 -->
    <view class="confirmation" v-if="showConfirmation">
      <Icon name="check" :size="16" :color="'var(--success)'" />
      <text class="confirmation-text">已记录</text>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { useMovementsStore } from '@/store/movements'
import Icon from '@/components/icon.vue'

const emit = defineEmits(['recorded'])

const movementsStore = useMovementsStore()

const isPressed = ref(false)
const isAnimating = ref(true)
const showConfirmation = ref(false)

const recordMovement = () => {
  console.log('recordMovement called')

  try {
    // 记录胎动
    const result = movementsStore.addMovement({
      sessionType: 'singleClick'
    })
    console.log('addMovement result:', result)
    console.log('todayCount:', movementsStore.todayCount)

    // 显示确认
    showConfirmation.value = true
    setTimeout(() => {
      showConfirmation.value = false
    }, 1500)

    emit('recorded')
  } catch (err) {
    console.error('recordMovement error:', err)
  }
}
</script>

<style scoped>
.single-click-mode {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  padding: 24px 0;
}

.hint {
  font-size: 14px;
  color: var(--text-secondary);
}

.button-container {
  position: relative;
  width: 170px;
  height: 170px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pulse-ring {
  position: absolute;
  width: 170px;
  height: 170px;
  border-radius: 50%;
  border: 3px solid rgba(8, 145, 178, 0.2);
  pointer-events: none;
}

.pulse-ring.animate {
  animation: pulse 1.2s ease-out infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(1.15);
    opacity: 0;
  }
}

.main-button {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background-color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.15s ease;
  cursor: pointer;
  position: relative;
  z-index: 1;
  border: none;
  padding: 0;
}

.main-button.pressed {
  transform: scale(0.92);
}

.confirmation {
  display: flex;
  align-items: center;
  gap: 8px;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.confirmation-text {
  font-size: 14px;
  font-weight: 500;
  color: var(--success);
}
</style>