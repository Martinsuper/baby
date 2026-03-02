// 孕期信息状态管理

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  getPregnancyProfile,
  savePregnancyProfile,
  deletePregnancyProfile
} from '@/utils/db'
import {
  calculatePregnancyWeeks,
  calculateDaysRemaining,
  calculateProgressPercentage,
  calculateTrimester,
  getBabyDevelopmentInfo
} from '@/utils/pregnancy'

export const usePregnancyStore = defineStore('pregnancy', () => {
  // 状态
  const profile = ref(null)

  // 计算属性
  const hasProfile = computed(() => !!profile.value)

  const pregnancyProgress = computed(() => {
    if (!profile.value) return { weeks: 0, days: 0 }
    return calculatePregnancyWeeks(profile.value.dueDate)
  })

  const daysRemaining = computed(() => {
    if (!profile.value) return 0
    return calculateDaysRemaining(profile.value.dueDate)
  })

  const progressPercentage = computed(() => {
    if (!profile.value) return 0
    return calculateProgressPercentage(profile.value.dueDate)
  })

  const trimester = computed(() => {
    if (!profile.value) return 1
    return calculateTrimester(profile.value.dueDate)
  })

  const developmentInfo = computed(() => {
    if (!profile.value) return null
    return getBabyDevelopmentInfo(pregnancyProgress.value.weeks)
  })

  // 方法
  function loadProfile() {
    profile.value = getPregnancyProfile()
  }

  function setProfile(data) {
    profile.value = savePregnancyProfile(data)
  }

  function updateProfile(data) {
    if (!profile.value) return
    profile.value = savePregnancyProfile({
      ...profile.value,
      ...data
    })
  }

  function removeProfile() {
    deletePregnancyProfile()
    profile.value = null
  }

  return {
    // 状态
    profile,
    // 计算属性
    hasProfile,
    pregnancyProgress,
    daysRemaining,
    progressPercentage,
    trimester,
    developmentInfo,
    // 方法
    loadProfile,
    setProfile,
    updateProfile,
    removeProfile
  }
})