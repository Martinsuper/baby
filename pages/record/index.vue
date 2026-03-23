<template>
  <div class="page">
    <!-- 胎动模式 -->
    <template v-if="appModeStore.isFeedingMode">
      <h2 class="page-title">记录喂奶</h2>

      <!-- 记录区域 -->
      <div class="record-area">
        <FeedingRecord @recorded="onFeedingRecorded" />
      </div>

      <!-- 今日统计 -->
      <div class="today-badge">
        <Icon name="droplet" :size="16" color="var(--primary)" />
        <span class="badge-text">今日</span>
        <span class="badge-count">{{ feedingStore.todayCount }}</span>
        <span class="badge-unit">次</span>
        <span class="badge-divider"></span>
        <span class="badge-count">{{ feedingStore.todayTotalAmount }}</span>
        <span class="badge-unit">ml</span>
      </div>

      <!-- 今日记录列表 -->
      <div class="today-records" v-if="feedingStore.todayCount > 0">
        <div class="records-header">
          <span class="records-title">今日记录</span>
        </div>
        <div class="records-list">
          <div
            class="record-item"
            v-for="feeding in feedingStore.sortedTodayFeedings"
            :key="feeding.id"
          >
            <span class="record-time">{{ formatTime(feeding.timestamp) }}</span>
            <span class="record-amount">{{ feeding.amount }}ml</span>
            <button class="delete-btn" @click="deleteFeeding(feeding.id)">删除</button>
          </div>
        </div>
      </div>
      <div class="empty-records" v-else>
        <span class="empty-text">暂无记录</span>
      </div>
    </template>

    <!-- 胎动模式 -->
    <template v-else>
      <h2 class="page-title">记录胎动</h2>

      <!-- 记录区域 -->
      <div class="record-area">
        <manual-record @recorded="onRecorded" />
      </div>

      <!-- 今日统计 -->
      <div class="today-badge">
        <Icon name="pointer" :size="16" color="var(--primary)" />
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
    </template>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useAppModeStore } from '@/store/appMode'
import { useMovementsStore } from '@/store/movements'
import { useFeedingStore } from '@/store/feeding'
import { useFeedingReminderStore } from '@/store/feedingReminder'
import { formatTimeWithSeconds, formatTime } from '@/utils/date'
import ManualRecord from '@/components/manual-record.vue'
import FeedingRecord from '@/components/feeding-record.vue'
import Icon from '@/components/icon.vue'

const appModeStore = useAppModeStore()
const movementsStore = useMovementsStore()
const feedingStore = useFeedingStore()
const feedingReminderStore = useFeedingReminderStore()

// 今日胎动记录按时间倒序排列
const sortedTodayMovements = computed(() => {
  return [...movementsStore.todayMovements].sort((a, b) => {
    return new Date(b.timestamp) - new Date(a.timestamp)
  })
})

onMounted(() => {
  appModeStore.loadMode()
  movementsStore.loadMovements()
  feedingStore.loadFeedings()
  feedingReminderStore.loadSettings()
})

const onRecorded = () => {
  // 记录后的回调
}

const onFeedingRecorded = (data) => {
  feedingStore.addFeeding(data)
  feedingReminderStore.clearDismissedTime()
}

const deleteMovement = (id) => {
  movementsStore.removeMovement(id)
}

const deleteFeeding = (id) => {
  feedingStore.removeFeeding(id)
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

.badge-divider {
  width: 1px;
  height: 16px;
  background-color: rgba(233, 30, 99, 0.3);
  margin: 0 4px;
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

.record-amount {
  font-size: 16px;
  font-weight: 600;
  color: var(--primary);
  margin-left: auto;
  margin-right: 12px;
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
