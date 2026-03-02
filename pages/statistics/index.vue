<template>
  <div class="page">
    <h2 class="page-title">统计分析</h2>

    <!-- 时间范围选择器 -->
    <div class="period-picker">
      <div class="picker-item" :class="{ active: selectedPeriod === 'week' }" @click="selectedPeriod = 'week'">
        近7天
      </div>
      <div class="picker-item" :class="{ active: selectedPeriod === 'month' }" @click="selectedPeriod = 'month'">
        近30天
      </div>
    </div>

    <!-- 汇总卡片 -->
    <div class="summary-cards">
      <div class="summary-card">
        <div class="summary-icon" style="background-color: var(--primary)">👆</div>
        <span class="summary-value">{{ filteredMovements.length }}</span>
        <span class="summary-label">总次数</span>
      </div>

      <div class="summary-card">
        <div class="summary-icon" style="background-color: var(--accent)">📅</div>
        <span class="summary-value">{{ averagePerDay }}</span>
        <span class="summary-label">日均</span>
      </div>

      <div class="summary-card">
        <div class="summary-icon" style="background-color: var(--success)">⬆️</div>
        <span class="summary-value">{{ maxDailyCount }}</span>
        <span class="summary-label">最高</span>
      </div>
    </div>

    <!-- 每日趋势图 -->
    <daily-trend-chart :data="dailyData" />

    <!-- 时段分布图 -->
    <time-distribution-chart :data="timeDistributionData" />

    <!-- 周对比图 -->
    <weekly-comparison-chart v-if="selectedPeriod === 'month'" :data="weeklyData" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useMovementsStore } from '@/store/movements'
import { getTimePeriod } from '@/utils/date'
import DailyTrendChart from '@/components/daily-trend-chart.vue'
import TimeDistributionChart from '@/components/time-distribution-chart.vue'
import WeeklyComparisonChart from '@/components/weekly-comparison-chart.vue'

const movementsStore = useMovementsStore()
const selectedPeriod = ref('week')

onMounted(() => {
  movementsStore.loadMovements()
})

const filteredMovements = computed(() => {
  const now = new Date()
  const days = selectedPeriod.value === 'week' ? 7 : 30
  const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000)

  return movementsStore.movements.filter(m => {
    return new Date(m.timestamp) >= startDate
  })
})

const averagePerDay = computed(() => {
  const days = new Set(
    filteredMovements.value.map(m =>
      new Date(m.timestamp).toDateString()
    )
  ).size
  return days > 0 ? (filteredMovements.value.length / days).toFixed(1) : '0.0'
})

const maxDailyCount = computed(() => {
  const dailyCounts = {}
  filteredMovements.value.forEach(m => {
    const day = new Date(m.timestamp).toDateString()
    dailyCounts[day] = (dailyCounts[day] || 0) + 1
  })
  return Math.max(...Object.values(dailyCounts), 0)
})

const dailyData = computed(() => {
  const days = selectedPeriod.value === 'week' ? 7 : 30
  const result = []
  const now = new Date()

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
    date.setHours(0, 0, 0, 0)
    const nextDate = new Date(date.getTime() + 24 * 60 * 60 * 1000)

    const count = filteredMovements.value.filter(m => {
      const mDate = new Date(m.timestamp)
      return mDate >= date && mDate < nextDate
    }).length

    result.push({
      date: date.toISOString(),
      count
    })
  }

  return result
})

const timeDistributionData = computed(() => {
  const periods = ['morning', 'noon', 'afternoon', 'evening', 'night']
  const periodLabels = {
    morning: '早上',
    noon: '中午',
    afternoon: '下午',
    evening: '晚上',
    night: '深夜'
  }

  return periods.map(period => {
    const count = filteredMovements.value.filter(m => {
      return getTimePeriod(m.timestamp).value === period
    }).length

    return {
      period: { value: period, label: periodLabels[period] },
      count
    }
  })
})

const weeklyData = computed(() => {
  const result = []
  const now = new Date()

  for (let i = 3; i >= 0; i--) {
    const weekStart = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000)
    const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000)

    const weekMovements = movementsStore.movements.filter(m => {
      const date = new Date(m.timestamp)
      return date >= weekStart && date < weekEnd
    })

    const daysWithMovements = new Set(
      weekMovements.map(m => new Date(m.timestamp).toDateString())
    ).size

    result.push({
      weekLabel: `第${4 - i}周`,
      totalCount: weekMovements.length,
      avgPerDay: daysWithMovements > 0 ? weekMovements.length / daysWithMovements : 0
    })
  }

  return result
})
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
  margin: 0 0 16px;
  text-align: center;
}

.period-picker {
  display: flex;
  background-color: rgba(103, 232, 249, 0.2);
  border-radius: 8px;
  padding: 4px;
  margin-bottom: 16px;
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

.summary-cards {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.summary-card {
  flex: 1;
  background-color: var(--card);
  border-radius: 14px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.summary-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: white;
}

.summary-value {
  font-size: 24px;
  font-weight: bold;
  color: var(--text-primary);
}

.summary-label {
  font-size: 12px;
  color: var(--text-secondary);
}
</style>