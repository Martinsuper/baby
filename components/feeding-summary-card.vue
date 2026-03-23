<template>
  <div class="feeding-summary-card card">
    <div class="header">
      <div class="title-section">
        <Icon name="milk" :size="18" color="var(--primary)" />
        <span class="title">今日喂奶</span>
      </div>
      <span class="date">{{ todayDate }}</span>
    </div>

    <div class="content">
      <div class="stats-row">
        <div class="stat-item">
          <span class="stat-value">{{ feedingStore.todayCount }}</span>
          <span class="stat-label">次</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">{{ feedingStore.todayTotalAmount }}</span>
          <span class="stat-label">ml</span>
        </div>
      </div>

      <div class="last-section" v-if="feedingStore.lastFeeding">
        <div class="last-info">
          <Icon name="clock" :size="12" color="var(--primary)" />
          <span class="time">{{ formatTime(feedingStore.lastFeeding.timestamp) }}</span>
          <span class="amount">{{ feedingStore.lastFeeding.amount }}ml</span>
        </div>
        <span class="last-label">上次喂奶</span>
      </div>
      <div class="last-section" v-else>
        <span class="no-record">还没有喂奶记录</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useFeedingStore } from '@/store/feeding'
import { formatDate, formatTime as formatTimeUtil } from '@/utils/date'
import Icon from '@/components/icon.vue'

const feedingStore = useFeedingStore()

const todayDate = computed(() => {
  return formatDate(new Date())
})

const formatTime = (timestamp) => {
  return formatTimeUtil(timestamp)
}
</script>

<style scoped>
.feeding-summary-card {
  background-color: var(--card);
  border-radius: 16px;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.title-section {
  display: flex;
  align-items: center;
  gap: 8px;
}

.title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.date {
  font-size: 12px;
  color: var(--text-secondary);
}

.content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.stats-row {
  display: flex;
  gap: 32px;
}

.stat-item {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.stat-value {
  font-size: 44px;
  font-weight: bold;
  font-family: 'SF Pro Rounded', -apple-system, sans-serif;
  color: var(--primary);
}

.stat-label {
  font-size: 14px;
  color: var(--text-secondary);
}

.last-section {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-top: 12px;
  border-top: 1px solid var(--border);
}

.last-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.time {
  font-size: 14px;
  font-weight: 500;
  color: var(--primary);
}

.amount {
  font-size: 14px;
  color: var(--text-primary);
}

.last-label {
  font-size: 12px;
  color: var(--text-tertiary);
}

.no-record {
  font-size: 14px;
  color: var(--text-tertiary);
  text-align: center;
  padding: 8px 0;
}
</style>
