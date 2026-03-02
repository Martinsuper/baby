<template>
  <view class="timer-mode">
    <text class="hint">计时模式：开始计时后记录胎动次数</text>

    <!-- 计时器显示 -->
    <view class="timer-display">
      <text class="timer-text" :class="{ active: isRunning }">{{ formatTime(elapsedTime) }}</text>

      <view class="stats" v-if="isRunning">
        <view class="stat-item">
          <text class="stat-value">{{ movementCount }}</text>
          <text class="stat-label">次胎动</text>
        </view>
        <view class="stat-item">
          <text class="stat-value">{{ avgPerMinute }}</text>
          <text class="stat-label">次/分钟</text>
        </view>
      </view>
    </view>

    <!-- 控制按钮 -->
    <view class="controls">
      <!-- 记录按钮 -->
      <view class="control-btn" :class="{ disabled: !isRunning }" @click="recordMovement">
        <text class="btn-icon">+</text>
        <text class="btn-label">记录</text>
      </view>

      <!-- 开始/停止按钮 -->
      <view class="control-btn main" :class="{ stop: isRunning }" @click="toggleTimer">
        <text class="btn-icon">{{ isRunning ? '⏹' : '▶' }}</text>
      </view>

      <!-- 重置按钮 -->
      <view class="control-btn" :class="{ disabled: isRunning || elapsedTime === 0 }" @click="resetTimer">
        <text class="btn-icon">↻</text>
        <text class="btn-label">重置</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'
import { useMovementsStore } from '@/store/movements'

const emit = defineEmits(['recorded'])

const movementsStore = useMovementsStore()

const isRunning = ref(false)
const elapsedTime = ref(0)
const movementCount = ref(0)
let timer = null
let startTime = null

const avgPerMinute = computed(() => {
  if (elapsedTime.value === 0) return '0.0'
  return (movementCount.value / (elapsedTime.value / 60)).toFixed(1)
})

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  const tenths = Math.floor((seconds % 1) * 10)
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${tenths}`
}

const toggleTimer = () => {
  if (isRunning.value) {
    stopTimer()
  } else {
    startTimer()
  }
}

const startTimer = () => {
  isRunning.value = true
  startTime = Date.now() - (elapsedTime.value * 1000)
  timer = setInterval(() => {
    elapsedTime.value = (Date.now() - startTime) / 1000
  }, 100)
}

const stopTimer = () => {
  isRunning.value = false
  if (timer) {
    clearInterval(timer)
    timer = null
  }

  // 保存记录
  if (elapsedTime.value > 0) {
    movementsStore.addMovement({
      sessionType: 'timer',
      duration: elapsedTime.value
    })
    emit('recorded')
  }
}

const recordMovement = () => {
  if (!isRunning.value) return
  movementCount.value++
}

const resetTimer = () => {
  if (isRunning.value) return
  elapsedTime.value = 0
  movementCount.value = 0
  startTime = null
}

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>

<style scoped>
.timer-mode {
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

.timer-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.timer-text {
  font-size: 56px;
  font-weight: 300;
  font-family: 'SF Mono', 'Menlo', monospace;
  color: var(--text-secondary);
}

.timer-text.active {
  color: var(--primary);
}

.stats {
  display: flex;
  gap: 32px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: var(--primary);
}

.stat-label {
  font-size: 12px;
  color: var(--text-secondary);
}

.controls {
  display: flex;
  align-items: center;
  gap: 20px;
}

.control-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background-color: rgba(128, 128, 128, 0.3);
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.control-btn.main {
  width: 76px;
  height: 76px;
  background-color: var(--primary);
}

.control-btn.main.stop {
  background-color: var(--error);
}

.control-btn.disabled {
  opacity: 0.5;
  pointer-events: none;
}

.control-btn .btn-icon {
  font-size: 20px;
}

.control-btn .btn-label {
  font-size: 10px;
  margin-top: 2px;
}
</style>