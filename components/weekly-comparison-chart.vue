<template>
  <view class="chart-card card">
    <text class="title">周对比</text>

    <view class="chart-container" v-if="data.length > 0">
      <view class="week-bars">
        <view v-for="(item, index) in data" :key="index" class="week-column">
          <view class="bar-group">
            <view class="bar-wrapper">
              <view class="bar total" :style="{ height: getBarHeight(item.totalCount) + '%' }"></view>
            </view>
            <view class="bar-wrapper">
              <view class="bar avg" :style="{ height: getBarHeight(item.avgPerDay) + '%' }"></view>
            </view>
          </view>
          <text class="week-label">{{ item.weekLabel }}</text>
        </view>
      </view>

      <view class="legend">
        <view class="legend-item">
          <view class="legend-color total"></view>
          <text class="legend-text">总次数</text>
        </view>
        <view class="legend-item">
          <view class="legend-color avg"></view>
          <text class="legend-text">日均</text>
        </view>
      </view>
    </view>

    <view class="empty-state" v-else>
      <text class="empty-icon">📅</text>
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

const maxValue = computed(() => {
  if (props.data.length === 0) return 10
  const totals = props.data.map(d => Math.max(d.totalCount, d.avgPerDay))
  return Math.max(...totals, 10)
})

const getBarHeight = (value) => {
  return (value / maxValue.value) * 100
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

.week-bars {
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  height: 160px;
  margin-bottom: 16px;
}

.week-column {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.bar-group {
  display: flex;
  align-items: flex-end;
  gap: 4px;
  height: 120px;
}

.bar-wrapper {
  width: 16px;
  height: 100%;
  display: flex;
  align-items: flex-end;
}

.bar {
  width: 100%;
  border-radius: 4px 4px 0 0;
  min-height: 4px;
}

.bar.total {
  background-color: var(--primary);
}

.bar.avg {
  background-color: var(--accent);
}

.week-label {
  font-size: 10px;
  color: var(--text-secondary);
}

.legend {
  display: flex;
  justify-content: center;
  gap: 24px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}

.legend-color.total {
  background-color: var(--primary);
}

.legend-color.avg {
  background-color: var(--accent);
}

.legend-text {
  font-size: 12px;
  color: var(--text-secondary);
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