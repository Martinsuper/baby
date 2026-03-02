// 日记状态管理

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getDiaryEntries, saveDiaryEntry, deleteDiaryEntry } from '@/utils/db'
import { formatDate, isToday, isYesterday, startOfDay } from '@/utils/date'
import { themeColors } from '@/utils/theme'

// 心情类型定义
export const moodTypes = [
  { value: 'great', label: '很棒', icon: '😊', color: themeColors.moodGreat },
  { value: 'good', label: '不错', icon: '🙂', color: themeColors.moodGood },
  { value: 'normal', label: '一般', icon: '😐', color: themeColors.moodNormal },
  { value: 'bad', label: '不太好', icon: '😔', color: themeColors.moodBad },
  { value: 'terrible', label: '很糟', icon: '😢', color: themeColors.moodTerrible }
]

export const useDiaryStore = defineStore('diary', () => {
  // 状态
  const entries = ref([])

  // 计算属性
  const sortedEntries = computed(() => {
    return [...entries.value].sort((a, b) => {
      const dateA = new Date(a.date)
      const dateB = new Date(b.date)
      return dateB - dateA
    })
  })

  const recentEntries = computed(() => {
    return sortedEntries.value.slice(0, 10)
  })

  // 按日期分组
  const groupedByDate = computed(() => {
    const groups = {}
    entries.value.forEach(entry => {
      const dateKey = startOfDay(entry.date).toISOString()
      if (!groups[dateKey]) {
        groups[dateKey] = []
      }
      groups[dateKey].push(entry)
    })
    return groups
  })

  // 方法
  function loadEntries() {
    entries.value = getDiaryEntries()
  }

  function addEntry(data) {
    const entry = saveDiaryEntry({
      ...data,
      date: data.date || new Date().toISOString(),
      mood: data.mood || 'normal',
      content: data.content || ''
    })
    entries.value.push(entry)
    return entry
  }

  function updateEntry(id, data) {
    const index = entries.value.findIndex(e => e.id === id)
    if (index !== -1) {
      const updated = saveDiaryEntry({
        ...entries.value[index],
        ...data
      })
      entries.value[index] = updated
      return updated
    }
    return null
  }

  function removeEntry(id) {
    deleteDiaryEntry(id)
    entries.value = entries.value.filter(e => e.id !== id)
  }

  function getEntryById(id) {
    return entries.value.find(e => e.id === id)
  }

  function getMoodInfo(moodValue) {
    return moodTypes.find(m => m.value === moodValue) || moodTypes[2]
  }

  return {
    // 状态
    entries,
    // 计算属性
    sortedEntries,
    recentEntries,
    groupedByDate,
    // 方法
    loadEntries,
    addEntry,
    updateEntry,
    removeEntry,
    getEntryById,
    getMoodInfo
  }
})