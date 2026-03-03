<template>
  <div class="page">
    <h2 class="page-title">记录胎动</h2>

    <!-- 模式选择器 -->
    <div class="mode-picker">
      <div class="picker-item" :class="{ active: recordMode === 'singleClick' }" @click="recordMode = 'singleClick'">
        单次点击
      </div>
      <div class="picker-item" :class="{ active: recordMode === 'timer' }" @click="recordMode = 'timer'">
        计时模式
      </div>
    </div>

    <!-- 记录区域 -->
    <div class="record-area">
      <single-click-mode v-if="recordMode === 'singleClick'" @recorded="onRecorded" />
      <timer-mode v-else @recorded="onRecorded" />
    </div>

    <!-- 今日统计 -->
    <div class="today-badge">
      <span class="badge-icon">👆</span>
      <span class="badge-text">今日已记录</span>
      <span class="badge-count">{{ movementsStore.todayCount }}</span>
      <span class="badge-unit">次</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useMovementsStore } from '@/store/movements'
import SingleClickMode from '@/components/single-click-mode.vue'
import TimerMode from '@/components/timer-mode.vue'

const movementsStore = useMovementsStore()
const recordMode = ref('singleClick')

onMounted(() => {
  movementsStore.loadMovements()
})

const onRecorded = () => {
  // 记录后的回调
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background-color: var(--background);
  padding: 16px;
  padding-top: 20px;
}

.page-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 24px;
  text-align: center;
}

.mode-picker {
  display: flex;
  background-color: rgba(252, 228, 236, 0.5);
  border-radius: 8px;
  padding: 4px;
  margin-bottom: 24px;
}

.picker-item {
  flex: 1;
  text-align: center;
  padding: 10px 0;
  border-radius: 6px;
  transition: all 0.2s ease;
  font-size: 14px;
  color: var(--text-secondary);
  cursor: pointer;
}

.picker-item.active {
  background-color: var(--primary);
  color: white;
  font-weight: 500;
}

.record-area {
  display: flex;
  justify-content: center;
}

.today-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background-color: var(--card);
  padding: 12px 20px;
  border-radius: 12px;
  margin-top: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.badge-icon {
  font-size: 16px;
}

.badge-text {
  font-size: 14px;
  color: var(--text-secondary);
}

.badge-count {
  font-size: 16px;
  font-weight: 600;
  color: var(--primary);
}

.badge-unit {
  font-size: 14px;
  color: var(--text-secondary);
}
</style>