<template>
  <view class="today-summary-card card">
    <view class="header">
      <text class="title">今日胎动</text>
      <text class="date">{{ todayDate }}</text>
    </view>

    <view class="content">
      <view class="count-section">
        <text class="count">{{ movements.length }}</text>
        <text class="label">次胎动</text>
      </view>

      <view class="last-section" v-if="lastMovement">
        <view class="last-time">
          <text class="icon">🕐</text>
          <text class="time">{{ formatTime(lastMovement.timestamp) }}</text>
        </view>
        <text class="last-label">最近记录</text>
      </view>
      <view class="last-section" v-else>
        <text class="no-record">暂无记录</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue'
import { formatDate, formatTime as formatTimeUtil } from '@/utils/date'

const props = defineProps({
  movements: {
    type: Array,
    default: () => []
  }
})

const todayDate = computed(() => {
  return formatDate(new Date())
})

const lastMovement = computed(() => {
  if (props.movements.length === 0) return null
  return props.movements.reduce((latest, current) => {
    return new Date(current.timestamp) > new Date(latest.timestamp) ? current : latest
  })
})

const formatTime = (timestamp) => {
  return formatTimeUtil(timestamp)
}
</script>

<style scoped>
.today-summary-card {
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
  justify-content: space-between;
  align-items: center;
}

.count-section {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.count {
  font-size: 44px;
  font-weight: bold;
  font-family: 'SF Pro Rounded', -apple-system, sans-serif;
  color: var(--primary);
}

.label {
  font-size: 14px;
  color: var(--text-secondary);
}

.last-section {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
}

.last-time {
  display: flex;
  align-items: center;
  gap: 6px;
}

.icon {
  font-size: 12px;
}

.time {
  font-size: 14px;
  font-weight: 500;
  color: var(--primary);
}

.last-label {
  font-size: 12px;
  color: var(--text-tertiary);
}

.no-record {
  font-size: 14px;
  color: var(--text-tertiary);
}
</style>