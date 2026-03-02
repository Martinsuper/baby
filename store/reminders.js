// 提醒设置状态管理

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getReminderSettings, saveReminderSettings } from '@/utils/db'

export const useRemindersStore = defineStore('reminders', () => {
  // 状态
  const settings = ref(null)

  // 计算属性
  const isEnabled = computed(() => settings.value?.isEnabled ?? true)

  const reminderTimes = computed(() => settings.value?.reminderTimes ?? [])

  const hasSettings = computed(() => !!settings.value)

  // 方法
  function loadSettings() {
    settings.value = getReminderSettings()
  }

  function updateSettings(data) {
    settings.value = saveReminderSettings({
      ...settings.value,
      ...data
    })
  }

  function toggleEnabled() {
    updateSettings({ isEnabled: !settings.value.isEnabled })
  }

  function addReminderTime(hour, minute) {
    if (reminderTimes.value.length >= 5) return false

    const newTime = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      hour,
      minute
    }

    updateSettings({
      reminderTimes: [...reminderTimes.value, newTime]
    })

    return true
  }

  function updateReminderTime(id, hour, minute) {
    const times = reminderTimes.value.map(t => {
      if (t.id === id) {
        return { ...t, hour, minute }
      }
      return t
    })

    updateSettings({ reminderTimes: times })
  }

  function removeReminderTime(id) {
    const times = reminderTimes.value.filter(t => t.id !== id)
    updateSettings({ reminderTimes: times })
  }

  function formatTime(time) {
    return `${String(time.hour).padStart(2, '0')}:${String(time.minute).padStart(2, '0')}`
  }

  return {
    // 状态
    settings,
    // 计算属性
    isEnabled,
    reminderTimes,
    hasSettings,
    // 方法
    loadSettings,
    updateSettings,
    toggleEnabled,
    addReminderTime,
    updateReminderTime,
    removeReminderTime,
    formatTime
  }
})