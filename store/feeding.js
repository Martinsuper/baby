// 喂奶记录状态管理

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getFeedings, saveFeeding, deleteFeeding, clearFeedings } from '@/utils/db'
import { isToday, startOfDay } from '@/utils/date'

export const useFeedingStore = defineStore('feeding', () => {
  // 状态
  const feedings = ref([])

  // 计算属性
  const todayFeedings = computed(() => {
    return feedings.value.filter(f => isToday(f.timestamp))
  })

  const todayCount = computed(() => todayFeedings.value.length)

  const todayTotalAmount = computed(() => {
    return todayFeedings.value.reduce((sum, f) => sum + (f.amount || 0), 0)
  })

  const lastFeeding = computed(() => {
    if (feedings.value.length === 0) return null
    return [...feedings.value]
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0]
  })

  const sortedTodayFeedings = computed(() => {
    return [...todayFeedings.value].sort((a, b) => {
      return new Date(b.timestamp) - new Date(a.timestamp)
    })
  })

  // 方法
  function loadFeedings() {
    feedings.value = getFeedings()
  }

  function addFeeding(data) {
    const feeding = saveFeeding({
      amount: data.amount,
      timestamp: data.timestamp || new Date().toISOString()
    })
    feedings.value.push(feeding)
    return feeding
  }

  function removeFeeding(id) {
    deleteFeeding(id)
    feedings.value = feedings.value.filter(f => f.id !== id)
  }

  function clearAll() {
    clearFeedings()
    feedings.value = []
  }

  // 获取指定日期范围内的记录
  function getFeedingsInRange(startDate, endDate) {
    const start = new Date(startDate)
    const end = new Date(endDate)
    return feedings.value.filter(f => {
      const date = new Date(f.timestamp)
      return date >= start && date <= end
    })
  }

  // 获取统计数据
  function getStats(days = 7) {
    const now = new Date()
    const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000)
    startDate.setHours(0, 0, 0, 0)

    const filtered = feedings.value.filter(f => {
      return new Date(f.timestamp) >= startDate
    })

    const totalAmount = filtered.reduce((sum, f) => sum + (f.amount || 0), 0)
    const daysWithRecords = new Set(
      filtered.map(f => startOfDay(f.timestamp).toDateString())
    ).size

    return {
      totalCount: filtered.length,
      totalAmount,
      avgPerDay: daysWithRecords > 0 ? Math.round(totalAmount / daysWithRecords) : 0
    }
  }

  return {
    // 状态
    feedings,
    // 计算属性
    todayFeedings,
    todayCount,
    todayTotalAmount,
    lastFeeding,
    sortedTodayFeedings,
    // 方法
    loadFeedings,
    addFeeding,
    removeFeeding,
    clearAll,
    getFeedingsInRange,
    getStats
  }
})
