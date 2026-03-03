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

    <!-- 今日记录列表 -->
    <div class="today-records" v-if="movementsStore.todayCount > 0">
      <div class="records-header">
        <span class="records-title">今日记录</span>
      </div>
      <div class="records-list">
        <div
          class="record-item"
          v-for="movement in sortedTodayMovements"
          :key="movement.id"
        >
          <span class="record-time">{{ formatTimeWithSeconds(movement.timestamp) }}</span>
          <button class="delete-btn" @click="deleteMovement(movement.id)">删除</button>
        </div>
      </div>
    </div>
    <div class="empty-records" v-else>
      <span class="empty-text">暂无记录</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useMovementsStore } from '@/store/movements'
import { formatTimeWithSeconds } from '@/utils/date'
import SingleClickMode from '@/components/single-click-mode.vue'
import TimerMode from '@/components/timer-mode.vue'

const movementsStore = useMovementsStore()
const recordMode = ref('singleClick')

// 今日记录按时间倒序排列
const sortedTodayMovements = computed(() => {
  return [...movementsStore.todayMovements].sort((a, b) => {
    return new Date(b.timestamp) - new Date(a.timestamp)
  })
})

onMounted(() => {
  movementsStore.loadMovements()
})

const onRecorded = () => {
  // 记录后的回调
}

const deleteMovement = (id) => {
  movementsStore.removeMovement(id)
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

/* 今日记录列表 */
.today-records {
  margin-top: 16px;
  background-color: var(--card);
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.records-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(233, 30, 99, 0.1);
}

.records-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
}

.records-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 280px;
  overflow-y: auto;
}

.record-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  background: linear-gradient(135deg, rgba(252, 228, 236, 0.3) 0%, rgba(255, 255, 255, 0.5) 100%);
  border-radius: 12px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.record-item:active {
  transform: scale(0.98);
}

.record-time {
  font-size: 18px;
  font-weight: 500;
  font-family: 'SF Pro Rounded', -apple-system, monospace;
  color: var(--primary);
  letter-spacing: 0.5px;
}

.delete-btn {
  font-size: 12px;
  color: #f44336;
  background-color: rgba(244, 67, 54, 0.1);
  border: none;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 16px;
  transition: all 0.2s ease;
  font-weight: 500;
}

.delete-btn:active {
  background-color: rgba(244, 67, 54, 0.2);
}

.empty-records {
  margin-top: 16px;
  padding: 32px;
  text-align: center;
  background-color: var(--card);
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.empty-text {
  font-size: 14px;
  color: var(--text-tertiary);
}
</style>