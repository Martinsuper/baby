<template>
  <div class="today-summary-card card">
    <div class="header">
      <span class="title">今日胎动</span>
      <span class="date">{{ todayDate }}</span>
    </div>

    <div class="content">
      <div class="count-section">
        <span class="count">{{ movements.length }}</span>
        <span class="label">次胎动</span>
      </div>

      <div class="last-section" v-if="lastMovement">
        <div class="last-time">
          <Icon name="clock" :size="12" color="var(--primary)" />
          <span class="time">{{ formatTime(lastMovement.timestamp) }}</span>
        </div>
        <span class="last-label">最近记录</span>
      </div>
      <div class="last-section" v-else>
        <span class="no-record">暂无记录</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { formatDate, formatTime as formatTimeUtil } from '@/utils/date'
import Icon from '@/components/icon.vue'

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