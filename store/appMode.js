// 应用模式状态管理

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getAppMode, saveAppMode } from '@/utils/db'

export const useAppModeStore = defineStore('appMode', () => {
  // 状态
  const currentMode = ref('movement')

  // 计算属性
  const isMovementMode = computed(() => currentMode.value === 'movement')
  const isFeedingMode = computed(() => currentMode.value === 'feeding')

  // 方法
  function loadMode() {
    currentMode.value = getAppMode()
  }

  function setMode(mode) {
    currentMode.value = mode
    saveAppMode(mode)
  }

  function toggleMode() {
    const newMode = currentMode.value === 'movement' ? 'feeding' : 'movement'
    setMode(newMode)
  }

  return {
    // 状态
    currentMode,
    // 计算属性
    isMovementMode,
    isFeedingMode,
    // 方法
    loadMode,
    setMode,
    toggleMode
  }
})
