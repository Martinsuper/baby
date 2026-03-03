<template>
  <div class="chart-card card">
    <span class="title">时段分布</span>

    <div class="chart-container" v-if="data.length > 0">
      <div class="time-bars">
        <div v-for="(item, index) in data" :key="index" class="time-row">
          <span class="period-label">{{ item.period.label }}</span>
          <div class="bar-container">
            <div class="bar-fill" :style="{ width: getBarWidth(item.count) + '%' }"></div>
          </div>
          <span class="count">{{ item.count }}</span>
        </div>
      </div>
    </div>

    <div class="empty-state" v-else>
      <Icon name="clock" :size="32" color="var(--text-tertiary)" />
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
  background-color: rgba(252, 228, 236, 0.5);
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

.empty-text {
  font-size: 14px;
  color: var(--text-secondary);
}
</style>