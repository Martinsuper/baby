// 胎动记录状态管理

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getMovements, saveMovement, deleteMovement, clearMovements } from '@/utils/db'
import { isToday, startOfDay, formatTime, getTimePeriod } from '@/utils/date'

export const useMovementsStore = defineStore('movements', () => {
  // 状态
  const movements = ref([])

  // 计算属性
  const todayMovements = computed(() => {
    return movements.value.filter(m => isToday(m.timestamp))
  })

  const todayCount = computed(() => todayMovements.value.length)

  const recentMovements = computed(() => {
    return [...movements.value]
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 5)
  })

  const lastMovement = computed(() => {
    if (todayMovements.value.length === 0) return null
    return todayMovements.value.reduce((latest, current) => {
      return new Date(current.timestamp) > new Date(latest.timestamp) ? current : latest
    })
  })

  // 按日期分组
  const groupedByDate = computed(() => {
    const groups = {}
    movements.value.forEach(m => {
      const dateKey = startOfDay(m.timestamp).toISOString()
      if (!groups[dateKey]) {
        groups[dateKey] = []
      }
      groups[dateKey].push(m)
    })
    return groups
  })

  // 按时段分组
  const groupedByTimePeriod = computed(() => {
    const groups = {
      morning: [],
      noon: [],
      afternoon: [],
      evening: [],
      night: []
    }
    movements.value.forEach(m => {
      const period = getTimePeriod(m.timestamp)
      groups[period.value].push(m)
    })
    return groups
  })

  // 方法
  function loadMovements() {
    movements.value = getMovements()
  }

  function addMovement(data = {}) {
    const movement = saveMovement({
      ...data,
      sessionType: data.sessionType || 'singleClick'
    })
    movements.value.push(movement)
    return movement
  }

  function removeMovement(id) {
    deleteMovement(id)
    movements.value = movements.value.filter(m => m.id !== id)
  }

  function clearAll() {
    clearMovements()
    movements.value = []
  }

  // 获取指定日期范围内的记录
  function getMovementsInRange(startDate, endDate) {
    const start = new Date(startDate)
    const end = new Date(endDate)
    return movements.value.filter(m => {
      const date = new Date(m.timestamp)
      return date >= start && date <= end
    })
  }

  // 获取每日统计数据
  function getDailyStats(days = 7) {
    const stats = []
    const today = new Date()

    for (let i = 0; i < days; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      date.setHours(0, 0, 0, 0)

      const nextDate = new Date(date)
      nextDate.setDate(nextDate.getDate() + 1)

      const dayMovements = movements.value.filter(m => {
        const mDate = new Date(m.timestamp)
        return mDate >= date && mDate < nextDate
      })

      stats.push({
        date: date.toISOString(),
        count: dayMovements.length
      })
    }

    return stats.reverse()
  }

  return {
    // 状态
    movements,
    // 计算属性
    todayMovements,
    todayCount,
    recentMovements,
    lastMovement,
    groupedByDate,
    groupedByTimePeriod,
    // 方法
    loadMovements,
    addMovement,
    removeMovement,
    clearAll,
    getMovementsInRange,
    getDailyStats
  }
})