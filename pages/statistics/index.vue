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

    <!-- 喂奶模式统计 -->
    <template v-if="appModeStore.isFeedingMode">
      <!-- 汇总卡片 -->
      <div class="summary-cards">
        <div class="summary-card">
          <div class="summary-icon" style="background-color: var(--primary)">
            <Icon name="droplet" :size="16" color="white" />
          </div>
          <span class="summary-value">{{ feedingStats.totalCount }}</span>
          <span class="summary-label">总次数</span>
        </div>

        <div class="summary-card">
          <div class="summary-icon" style="background-color: var(--accent)">
            <Icon name="calendar" :size="16" color="white" />
          </div>
          <span class="summary-value">{{ feedingStore.todayTotalAmount }}</span>
          <span class="summary-label">今日总量(ml)</span>
        </div>

        <div class="summary-card">
          <div class="summary-icon" style="background-color: var(--success)">
            <Icon name="trending" :size="16" color="white" />
          </div>
          <span class="summary-value">{{ feedingStats.dailyAverage }}</span>
          <span class="summary-label">日均(ml)</span>
        </div>
      </div>

      <!-- 每日喂奶趋势 -->
      <div class="card trend-card">
        <h3 class="card-title">每日奶量趋势</h3>
        <div class="trend-chart">
          <div class="chart-bar" v-for="day in feedingDailyData" :key="day.date">
            <div class="bar-fill" :style="{ height: getBarHeight(day.amount, feedingMaxDaily) }"></div>
            <span class="bar-label">{{ day.label }}</span>
            <span class="bar-value">{{ day.amount }}</span>
          </div>
        </div>
      </div>
    </template>

    <!-- 胎动模式统计 -->
    <template v-else>
      <!-- 汇总卡片 -->
      <div class="summary-cards">
        <div class="summary-card">
          <div class="summary-icon" style="background-color: var(--primary)">
            <Icon name="pointer" :size="16" color="white" />
          </div>
          <span class="summary-value">{{ filteredMovements.length }}</span>
          <span class="summary-label">总次数</span>
        </div>

        <div class="summary-card">
          <div class="summary-icon" style="background-color: var(--accent)">
            <Icon name="calendar" :size="16" color="white" />
          </div>
          <span class="summary-value">{{ averagePerDay }}</span>
          <span class="summary-label">日均</span>
        </div>

        <div class="summary-card">
          <div class="summary-icon" style="background-color: var(--success)">
            <Icon name="trending" :size="16" color="white" />
          </div>
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
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useMovementsStore } from '@/store/movements'
import { useAppModeStore } from '@/store/appMode'
import { useFeedingStore } from '@/store/feeding'
import { getTimePeriod } from '@/utils/date'
import DailyTrendChart from '@/components/daily-trend-chart.vue'
import TimeDistributionChart from '@/components/time-distribution-chart.vue'
import WeeklyComparisonChart from '@/components/weekly-comparison-chart.vue'
import Icon from '@/components/icon.vue'

const movementsStore = useMovementsStore()
const appModeStore = useAppModeStore()
const feedingStore = useFeedingStore()
const selectedPeriod = ref('week')

onMounted(() => {
  appModeStore.loadMode()
  movementsStore.loadMovements()
  feedingStore.loadFeedings()
})

// ========== 胎动模式 ==========
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

// ========== 喂奶模式 ==========
const feedingStats = computed(() => {
  const stats = feedingStore.getStats(selectedPeriod.value === 'week' ? 7 : 30)
  return {
    totalCount: stats.totalCount,
    dailyAverage: stats.avgPerDay > 0 ? stats.avgPerDay.toFixed(0) : '0'
  }
})

const feedingDailyData = computed(() => {
  const days = selectedPeriod.value === 'week' ? 7 : 30
  const result = []
  const now = new Date()

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
    date.setHours(0, 0, 0, 0)
    const nextDate = new Date(date.getTime() + 24 * 60 * 60 * 1000)

    const dayFeedings = feedingStore.feedings.filter(f => {
      const fDate = new Date(f.timestamp)
      return fDate >= date && fDate < nextDate
    })

    const amount = dayFeedings.reduce((sum, f) => sum + f.amount, 0)

    result.push({
      date: date.toISOString(),
      label: `${date.getMonth() + 1}/${date.getDate()}`,
      amount
    })
  }

  return result
})

const feedingMaxDaily = computed(() => {
  return Math.max(...feedingDailyData.value.map(d => d.amount), 1)
})

const getBarHeight = (amount, max) => {
  if (max === 0) return '0%'
  const percent = (amount / max) * 100
  return `${Math.max(percent, 0)}%`
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
  margin: 0 0 16px;
  text-align: center;
}

.period-picker {
  display: flex;
  background-color: rgba(252, 228, 236, 0.5);
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

.trend-card {
  padding: 16px;
  margin-bottom: 16px;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 16px;
}

.trend-chart {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  height: 120px;
  padding-top: 20px;
}

.chart-bar {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  position: relative;
}

.bar-fill {
  width: 100%;
  max-width: 40px;
  background-color: var(--primary);
  border-radius: 4px 4px 0 0;
  position: absolute;
  bottom: 24px;
  min-height: 4px;
}

.bar-label {
  position: absolute;
  bottom: 0;
  font-size: 10px;
  color: var(--text-secondary);
}

.bar-value {
  position: absolute;
  bottom: 28px;
  font-size: 10px;
  color: var(--text-primary);
  font-weight: 500;
}
</style>