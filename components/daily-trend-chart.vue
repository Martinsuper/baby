<template>
  <view class="chart-card card">
    <text class="title">每日趋势</text>

    <view class="chart-container" v-if="data.length > 0">
      <!-- 简化的折线图展示 -->
      <view class="simple-chart">
        <view class="chart-bars">
          <view v-for="(item, index) in data" :key="index" class="bar-column">
            <view class="bar" :style="{ height: getBarHeight(item.count) + '%' }">
              <view class="bar-fill"></view>
            </view>
            <text class="bar-label">{{ formatDay(item.date) }}</text>
          </view>
        </view>
      </view>
    </view>

    <view class="empty-state" v-else>
      <text class="empty-icon">📊</text>
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
  if (props.data.length === 0) return 10
  return Math.max(...props.data.map(d => d.count), 10)
})

const getBarHeight = (count) => {
  return (count / maxCount.value) * 100
}

const formatDay = (dateStr) => {
  const date = new Date(dateStr)
  return `${date.getMonth() + 1}/${date.getDate()}`
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
  height: 200px;
}

.simple-chart {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.chart-bars {
  flex: 1;
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  gap: 8px;
}

.bar-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
}

.bar {
  width: 100%;
  max-width: 30px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.bar-fill {
  background-color: var(--primary);
  border-radius: 4px 4px 0 0;
  min-height: 4px;
}

.bar-label {
  font-size: 10px;
  color: var(--text-secondary);
  margin-top: 4px;
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