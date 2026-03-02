<template>
  <view class="chart-card card">
    <text class="title">时段分布</text>

    <view class="chart-container" v-if="data.length > 0">
      <view class="time-bars">
        <view v-for="(item, index) in data" :key="index" class="time-row">
          <text class="period-label">{{ item.period.label }}</text>
          <view class="bar-container">
            <view class="bar-fill" :style="{ width: getBarWidth(item.count) + '%' }"></view>
          </view>
          <text class="count">{{ item.count }}</text>
        </view>
      </view>
    </view>

    <view class="empty-state" v-else>
      <text class="empty-icon">🕐</text>
      <text class="empty-text">暂无数据</text>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  }
})

const maxCount = computed(() => {
  if (props.data.length === 0) return 1
  return Math.max(...props.data.map(d => d.count), 1)
})

const getBarWidth = (count) => {
  return (count / maxCount.value) * 100
}
</script>

<style scoped>
.chart-card {
  background-color: var(--card);
  border-radius: 16px;
  padding: 20px;
}

.title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 16px;
}

.chart-container {
  min-height: 200px;
}

.time-bars {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.time-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.period-label {
  font-size: 12px;
  color: var(--text-secondary);
  width: 40px;
}

.bar-container {
  flex: 1;
  height: 20px;
  background-color: rgba(103, 232, 249, 0.2);
  border-radius: 4px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background-color: var(--primary);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.count {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-primary);
  width: 24px;
  text-align: right;
}

.empty-state {
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.empty-icon {
  font-size: 32px;
}

.empty-text {
  font-size: 14px;
  color: var(--text-secondary);
}
</style>