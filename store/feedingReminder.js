// 喂奶提醒状态管理

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getFeedingReminderSettings, saveFeedingReminderSettings } from '@/utils/db'

export const useFeedingReminderStore = defineStore('feedingReminder', () => {
  // 状态
  const settings = ref(null)
  const lastDismissedTime = ref(null) // 上次忽略提醒的时间

  // 计算属性
  const isEnabled = computed(() => settings.value?.isEnabled ?? true)
  const intervalHours = computed(() => settings.value?.intervalHours ?? 3)

  // 方法
  function loadSettings() {
    settings.value = getFeedingReminderSettings()
  }

  function updateSettings(data) {
    settings.value = saveFeedingReminderSettings({
      ...settings.value,
      ...data
    })
  }

  function toggleEnabled() {
    updateSettings({ isEnabled: !settings.value.isEnabled })
  }

  function setIntervalHours(hours) {
    if (hours >= 1 && hours <= 6) {
      updateSettings({ intervalHours: hours })
    }
  }

  // 检查是否需要提醒
  function shouldRemind(lastFeedingTime) {
    if (!isEnabled.value || !lastFeedingTime) return false

    const now = new Date()
    const lastFeeding = new Date(lastFeedingTime)
    const hoursSinceLastFeeding = (now - lastFeeding) / (1000 * 60 * 60)

    // 如果忽略了提醒，30分钟内不再提醒
    if (lastDismissedTime.value) {
      const minutesSinceDismissed = (now - new Date(lastDismissedTime.value)) / (1000 * 60)
      if (minutesSinceDismissed < 30) return false
    }

    return hoursSinceLastFeeding >= intervalHours.value
  }

  function dismissReminder() {
    lastDismissedTime.value = new Date().toISOString()
  }

  function clearDismissedTime() {
    lastDismissedTime.value = null
  }

  return {
    // 状态
    settings,
    lastDismissedTime,
    // 计算属性
    isEnabled,
    intervalHours,
    // 方法
    loadSettings,
    updateSettings,
    toggleEnabled,
    setIntervalHours,
    shouldRemind,
    dismissReminder,
    clearDismissedTime
  }
})
