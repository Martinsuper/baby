<template>
  <div class="chart-card card">
    <span class="title">周对比</span>

    <div class="chart-container" v-if="data.length > 0">
      <div class="week-bars">
        <div v-for="(item, index) in data" :key="index" class="week-column">
          <div class="bar-group">
            <div class="bar-wrapper">
              <div class="bar total" :style="{ height: getBarHeight(item.totalCount) + '%' }"></div>
            </div>
            <div class="bar-wrapper">
              <div class="bar avg" :style="{ height: getBarHeight(item.avgPerDay) + '%' }"></div>
            </div>
          </div>
          <span class="week-label">{{ item.weekLabel }}</span>
        </div>
      </div>

      <div class="legend">
        <div class="legend-item">
          <div class="legend-color total"></div>
          <span class="legend-text">总次数</span>
        </div>
        <div class="legend-item">
          <div class="legend-color avg"></div>
          <span class="legend-text">日均</span>
        </div>
      </div>
    </div>

    <div class="empty-state" v-else>
      <Icon name="calendar" :size="32" color="var(--text-tertiary)" />
      <span class="empty-text">暂无数据</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import Icon from '@/components/icon.vue'

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

.empty-text {
  font-size: 14px;
  color: var(--text-secondary);
}
</style>