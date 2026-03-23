# 婴儿喂奶统计功能实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在现有胎动记录应用基础上新增喂奶统计功能，支持两种模式切换。

**Architecture:** 新增 feedings store 和 appMode store，复用现有页面结构，根据模式动态渲染不同内容。使用 localStorage 持久化数据。

**Tech Stack:** Vue 3, Pinia, Vue Router, localStorage, Lucide Icons

---

## Task 1: 数据层 — 存储方法

**Files:**
- Modify: `utils/db.js`

- [ ] **Step 1: 添加存储键和喂奶记录方法**

在 `utils/db.js` 中添加：

```javascript
// 在 STORAGE_KEYS 对象中添加
const STORAGE_KEYS = {
  PREGNANCY_PROFILE: 'baby_pregnancy_profile',
  FETAL_MOVEMENTS: 'baby_fetal_movements',
  REMINDER_SETTINGS: 'baby_reminder_settings',
  // 新增
  FEEDING_RECORDS: 'baby_feeding_records',
  FEEDING_REMINDER: 'baby_feeding_reminder',
  APP_MODE: 'baby_app_mode'
}

// 在文件末尾 export default 之前添加喂奶记录方法

// ============ 喂奶记录 ============

export function getFeedings() {
  return getData(STORAGE_KEYS.FEEDING_RECORDS) || []
}

export function saveFeeding(feeding) {
  const feedings = getFeedings()
  const newFeeding = {
    ...feeding,
    id: generateId(),
    timestamp: feeding.timestamp || new Date().toISOString()
  }
  feedings.push(newFeeding)
  setData(STORAGE_KEYS.FEEDING_RECORDS, feedings)
  return newFeeding
}

export function deleteFeeding(id) {
  const feedings = getFeedings()
  const filtered = feedings.filter(f => f.id !== id)
  setData(STORAGE_KEYS.FEEDING_RECORDS, filtered)
}

export function clearFeedings() {
  setData(STORAGE_KEYS.FEEDING_RECORDS, [])
}

// ============ 喂奶提醒设置 ============

export function getFeedingReminderSettings() {
  const settings = getData(STORAGE_KEYS.FEEDING_REMINDER)
  if (!settings) {
    return {
      id: generateId(),
      isEnabled: true,
      intervalHours: 3
    }
  }
  return settings
}

export function saveFeedingReminderSettings(settings) {
  const updatedSettings = {
    ...settings,
    lastModified: new Date().toISOString()
  }
  setData(STORAGE_KEYS.FEEDING_REMINDER, updatedSettings)
  return updatedSettings
}

// ============ 应用模式 ============

export function getAppMode() {
  return getData(STORAGE_KEYS.APP_MODE) || 'movement'
}

export function saveAppMode(mode) {
  setData(STORAGE_KEYS.APP_MODE, mode)
  return mode
}
```

更新 export default 对象：

```javascript
export default {
  generateId,
  // 现有...
  getPregnancyProfile,
  savePregnancyProfile,
  deletePregnancyProfile,
  getMovements,
  saveMovement,
  deleteMovement,
  clearMovements,
  getReminderSettings,
  saveReminderSettings,
  // 新增
  getFeedings,
  saveFeeding,
  deleteFeeding,
  clearFeedings,
  getFeedingReminderSettings,
  saveFeedingReminderSettings,
  getAppMode,
  saveAppMode
}
```

- [ ] **Step 2: 验证修改**

运行: `npm run dev`
预期: 应用正常启动，无报错

- [ ] **Step 3: 提交**

```bash
git add utils/db.js
git commit -m "feat(db): 添加喂奶记录和应用模式的存储方法"
```

---

## Task 2: 应用模式 Store

**Files:**
- Create: `store/appMode.js`

- [ ] **Step 1: 创建 appMode store**

```javascript
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
```

- [ ] **Step 2: 在 App.vue 中加载模式**

修改 `App.vue` 的 onMounted：

```javascript
import { useAppModeStore } from './store/appMode'

onMounted(() => {
  const appModeStore = useAppModeStore()
  appModeStore.loadMode()
  // ... 其他 store 初始化
})
```

- [ ] **Step 3: 提交**

```bash
git add store/appMode.js App.vue
git commit -m "feat(store): 添加应用模式状态管理"
```

---

## Task 3: 喂奶记录 Store

**Files:**
- Create: `store/feeding.js`

- [ ] **Step 1: 创建 feeding store**

```javascript
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
```

- [ ] **Step 2: 提交**

```bash
git add store/feeding.js
git commit -m "feat(store): 添加喂奶记录状态管理"
```

---

## Task 4: 喂奶提醒 Store

**Files:**
- Create: `store/feedingReminder.js`

- [ ] **Step 1: 创建 feedingReminder store**

```javascript
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
```

- [ ] **Step 2: 提交**

```bash
git add store/feedingReminder.js
git commit -m "feat(store): 添加喂奶提醒状态管理"
```

---

## Task 5: 喂奶记录输入组件

**Files:**
- Create: `components/feeding-record.vue`

- [ ] **Step 1: 创建喂奶记录输入组件**

```vue
<template>
  <div class="feeding-record">
    <div class="record-card card">
      <h3 class="card-title">记录喂奶</h3>

      <!-- 时间选择 -->
      <div class="field">
        <label class="field-label">喂奶时间</label>
        <input
          type="datetime-local"
          v-model="selectedTime"
          :max="maxTime"
          :min="minTime"
          class="time-input"
        />
      </div>

      <!-- 奶量输入 -->
      <div class="field">
        <label class="field-label">奶量 (毫升)</label>
        <div class="amount-input-wrapper">
          <input
            type="number"
            v-model.number="amount"
            min="1"
            max="500"
            placeholder="请输入奶量"
            class="amount-input"
          />
          <span class="unit">ml</span>
        </div>
        <span v-if="error" class="error-text">{{ error }}</span>
      </div>

      <!-- 快捷选择 -->
      <div class="quick-amounts">
        <button
          v-for="qty in [60, 90, 120, 150, 180]"
          :key="qty"
          class="quick-btn"
          :class="{ active: amount === qty }"
          @click="amount = qty"
        >
          {{ qty }}ml
        </button>
      </div>

      <!-- 确认按钮 -->
      <button class="confirm-btn" @click="handleConfirm" :disabled="!isValid">
        确认记录
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const emit = defineEmits(['recorded'])

const selectedTime = ref(formatDateTimeLocal(new Date()))
const amount = ref(null)
const error = ref('')

// 最大时间：当前时间
const maxTime = computed(() => formatDateTimeLocal(new Date()))

// 最小时间：7天前
const minTime = computed(() => {
  const d = new Date()
  d.setDate(d.getDate() - 7)
  return formatDateTimeLocal(d)
})

// 格式化为 datetime-local 格式
function formatDateTimeLocal(date) {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day}T${hours}:${minutes}`
}

// 验证
const isValid = computed(() => {
  if (!amount.value || amount.value < 1 || amount.value > 500) return false
  const selected = new Date(selectedTime.value)
  const now = new Date()
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  return selected <= now && selected >= sevenDaysAgo
})

function handleConfirm() {
  if (!isValid.value) {
    if (amount.value < 1 || amount.value > 500) {
      error.value = '请输入 1-500 之间的奶量'
      return
    }
    error.value = '请选择有效的时间'
    return
  }

  error.value = ''
  emit('recorded', {
    amount: amount.value,
    timestamp: new Date(selectedTime.value).toISOString()
  })

  // 重置
  amount.value = null
  selectedTime.value = formatDateTimeLocal(new Date())
}
</script>

<style scoped>
.feeding-record {
  width: 100%;
}

.record-card {
  padding: 20px;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 20px;
  text-align: center;
}

.field {
  margin-bottom: 16px;
}

.field-label {
  display: block;
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.time-input,
.amount-input {
  width: 100%;
  padding: 12px;
  border: 1px solid rgba(233, 30, 99, 0.2);
  border-radius: 10px;
  font-size: 16px;
  background-color: var(--card);
  color: var(--text-primary);
  box-sizing: border-box;
}

.time-input:focus,
.amount-input:focus {
  outline: none;
  border-color: var(--primary);
}

.amount-input-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.amount-input {
  flex: 1;
}

.unit {
  font-size: 14px;
  color: var(--text-secondary);
}

.error-text {
  font-size: 12px;
  color: var(--error);
  margin-top: 4px;
  display: block;
}

.quick-amounts {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.quick-btn {
  flex: 1;
  min-width: 60px;
  padding: 10px;
  border: 1px solid rgba(233, 30, 99, 0.3);
  border-radius: 8px;
  background-color: var(--card);
  color: var(--text-primary);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.quick-btn.active {
  background-color: var(--primary);
  color: white;
  border-color: var(--primary);
}

.confirm-btn {
  width: 100%;
  padding: 14px;
  background-color: var(--primary);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}

.confirm-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
```

- [ ] **Step 2: 提交**

```bash
git add components/feeding-record.vue
git commit -m "feat(components): 添加喂奶记录输入组件"
```

---

## Task 6: 喂奶汇总卡片组件

**Files:**
- Create: `components/feeding-summary-card.vue`

- [ ] **Step 1: 创建喂奶汇总卡片组件**

```vue
<template>
  <div class="feeding-summary-card card">
    <div class="summary-header">
      <Icon name="milk" :size="20" color="var(--primary)" />
      <span class="summary-title">今日喂奶</span>
    </div>

    <div class="summary-stats">
      <div class="stat-item">
        <span class="stat-value">{{ todayCount }}</span>
        <span class="stat-label">次数</span>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-item">
        <span class="stat-value">{{ todayTotalAmount }}</span>
        <span class="stat-label">总量(ml)</span>
      </div>
    </div>

    <!-- 上次喂奶 -->
    <div class="last-feeding" v-if="lastFeeding">
      <span class="last-label">上次喂奶</span>
      <span class="last-time">{{ formatTime(lastFeeding.timestamp) }}</span>
      <span class="last-amount">{{ lastFeeding.amount }}ml</span>
    </div>
    <div class="last-feeding empty" v-else>
      <span class="empty-text">还没有喂奶记录</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useFeedingStore } from '@/store/feeding'
import { formatTime as formatTimeUtil } from '@/utils/date'
import Icon from '@/components/icon.vue'

const feedingStore = useFeedingStore()

const todayCount = computed(() => feedingStore.todayCount)
const todayTotalAmount = computed(() => feedingStore.todayTotalAmount)
const lastFeeding = computed(() => feedingStore.lastFeeding)

const formatTime = (timestamp) => formatTimeUtil(timestamp)
</script>

<style scoped>
.feeding-summary-card {
  padding: 20px;
}

.summary-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.summary-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.summary-stats {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  margin-bottom: 16px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.stat-value {
  font-size: 32px;
  font-weight: bold;
  color: var(--primary);
}

.stat-label {
  font-size: 14px;
  color: var(--text-secondary);
}

.stat-divider {
  width: 1px;
  height: 40px;
  background-color: rgba(233, 30, 99, 0.2);
}

.last-feeding {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  background-color: rgba(252, 228, 236, 0.3);
  border-radius: 10px;
}

.last-feeding.empty {
  justify-content: center;
}

.last-label {
  font-size: 14px;
  color: var(--text-secondary);
}

.last-time {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.last-amount {
  font-size: 14px;
  color: var(--primary);
  font-weight: 500;
}

.empty-text {
  font-size: 14px;
  color: var(--text-tertiary);
}
</style>
```

- [ ] **Step 2: 提交**

```bash
git add components/feeding-summary-card.vue
git commit -m "feat(components): 添加喂奶汇总卡片组件"
```

---

## Task 7: 提醒弹窗组件

**Files:**
- Create: `components/feeding-reminder-modal.vue`

- [ ] **Step 1: 创建提醒弹窗组件**

```vue
<template>
  <div class="modal-overlay" v-if="visible" @click.self="handleDismiss">
    <div class="modal-content">
      <div class="modal-icon">
        <Icon name="bell" :size="32" color="var(--primary)" />
      </div>
      <h3 class="modal-title">该喂奶啦</h3>
      <p class="modal-desc">距离上次喂奶已超过 {{ hoursSinceLastFeeding }} 小时</p>

      <div class="last-info" v-if="lastFeeding">
        <span class="last-label">上次喂奶</span>
        <span class="last-detail">{{ formatTime(lastFeeding.timestamp) }} · {{ lastFeeding.amount }}ml</span>
      </div>

      <div class="modal-actions">
        <button class="btn-secondary" @click="handleDismiss">稍后提醒</button>
        <button class="btn-primary" @click="handleRecord">记录喂奶</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { formatTime as formatTimeUtil } from '@/utils/date'
import Icon from '@/components/icon.vue'

const props = defineProps({
  visible: Boolean,
  lastFeeding: Object,
  intervalHours: Number
})

const emit = defineEmits(['dismiss', 'record'])

const hoursSinceLastFeeding = computed(() => {
  if (!props.lastFeeding) return props.intervalHours || 3
  const now = new Date()
  const last = new Date(props.lastFeeding.timestamp)
  return Math.floor((now - last) / (1000 * 60 * 60))
})

const formatTime = (timestamp) => formatTimeUtil(timestamp)

function handleDismiss() {
  emit('dismiss')
}

function handleRecord() {
  emit('record')
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
}

.modal-content {
  background-color: var(--card);
  border-radius: 20px;
  padding: 32px 24px;
  width: 100%;
  max-width: 320px;
  text-align: center;
}

.modal-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background-color: rgba(233, 30, 99, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
}

.modal-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 8px;
}

.modal-desc {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0 0 20px;
}

.last-info {
  background-color: rgba(252, 228, 236, 0.3);
  border-radius: 10px;
  padding: 12px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.last-label {
  font-size: 12px;
  color: var(--text-secondary);
}

.last-detail {
  font-size: 16px;
  font-weight: 500;
  color: var(--text-primary);
}

.modal-actions {
  display: flex;
  gap: 12px;
}

.btn-secondary {
  flex: 1;
  padding: 12px;
  border: 1px solid rgba(233, 30, 99, 0.3);
  border-radius: 10px;
  background-color: var(--card);
  color: var(--text-primary);
  font-size: 14px;
  cursor: pointer;
}

.btn-primary {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 10px;
  background-color: var(--primary);
  color: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}
</style>
```

- [ ] **Step 2: 提交**

```bash
git add components/feeding-reminder-modal.vue
git commit -m "feat(components): 添加喂奶提醒弹窗组件"
```

---

## Task 8: 修改设置页 — 添加模式切换和喂奶提醒设置

**Files:**
- Modify: `pages/settings/index.vue`

- [ ] **Step 1: 添加模式切换开关和喂奶提醒设置**

在 `<template>` 中，在"孕期信息"section 之前添加：

```vue
<!-- 模式切换 -->
<div class="section">
  <h3 class="section-header">模式切换</h3>
  <div class="list">
    <div class="list-item mode-item">
      <div class="mode-info">
        <span class="mode-label">当前模式</span>
        <span class="mode-value">{{ appModeStore.isFeedingMode ? '喂奶模式' : '胎动模式' }}</span>
      </div>
      <div class="mode-switch">
        <button
          class="mode-btn"
          :class="{ active: appModeStore.isMovementMode }"
          @click="appModeStore.setMode('movement')"
        >
          胎动
        </button>
        <button
          class="mode-btn"
          :class="{ active: appModeStore.isFeedingMode }"
          @click="appModeStore.setMode('feeding')"
        >
          喂奶
        </button>
      </div>
    </div>
  </div>
</div>

<!-- 喂奶提醒设置（仅在喂奶模式下显示） -->
<div class="section" v-if="appModeStore.isFeedingMode">
  <h3 class="section-header">喂奶提醒</h3>
  <div class="list">
    <div class="list-item">
      <span class="label">启用提醒</span>
      <div class="toggle-switch" :class="{ active: feedingReminderStore.isEnabled }" @click="feedingReminderStore.toggleEnabled">
        <div class="toggle-thumb"></div>
      </div>
    </div>
    <div class="list-item" v-if="feedingReminderStore.isEnabled">
      <span class="label">提醒间隔</span>
      <div class="interval-selector">
        <button
          v-for="h in [1, 2, 3, 4, 5, 6]"
          :key="h"
          class="interval-btn"
          :class="{ active: feedingReminderStore.intervalHours === h }"
          @click="feedingReminderStore.setIntervalHours(h)"
        >
          {{ h }}小时
        </button>
      </div>
    </div>
  </div>
</div>
```

在 `<script setup>` 中添加：

```javascript
import { useAppModeStore } from '@/store/appMode'
import { useFeedingReminderStore } from '@/store/feedingReminder'

const appModeStore = useAppModeStore()
const feedingReminderStore = useFeedingReminderStore()

onMounted(() => {
  appModeStore.loadMode()
  feedingReminderStore.loadSettings()
  // ... 其他初始化
})
```

在 `<style scoped>` 中添加：

```css
.mode-item {
  justify-content: space-between;
}

.mode-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.mode-label {
  font-size: 16px;
  color: var(--text-primary);
}

.mode-value {
  font-size: 14px;
  color: var(--text-secondary);
}

.mode-switch {
  display: flex;
  background-color: rgba(252, 228, 236, 0.5);
  border-radius: 8px;
  padding: 4px;
}

.mode-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  background-color: transparent;
  color: var(--text-secondary);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.mode-btn.active {
  background-color: var(--primary);
  color: white;
}

.toggle-switch {
  width: 48px;
  height: 28px;
  border-radius: 14px;
  background-color: #ccc;
  padding: 2px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.toggle-switch.active {
  background-color: var(--primary);
}

.toggle-thumb {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: white;
  transition: transform 0.2s;
}

.toggle-switch.active .toggle-thumb {
  transform: translateX(20px);
}

.interval-selector {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.interval-btn {
  padding: 6px 12px;
  border: 1px solid rgba(233, 30, 99, 0.3);
  border-radius: 6px;
  background-color: var(--card);
  color: var(--text-primary);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.interval-btn.active {
  background-color: var(--primary);
  color: white;
  border-color: var(--primary);
}
```

- [ ] **Step 2: 提交**

```bash
git add pages/settings/index.vue
git commit -m "feat(settings): 添加模式切换和喂奶提醒设置"
```

---

## Task 9: 修改首页 — 根据模式显示

**Files:**
- Modify: `pages/index/index.vue`

- [ ] **Step 1: 根据模式显示不同内容**

修改 `<template>`：

```vue
<template>
  <div class="page">
    <!-- 自定义导航栏 -->
    <div class="nav-bar">
      <h1 class="nav-title">{{ appModeStore.isFeedingMode ? '喂奶记' : '胎动记' }}</h1>
    </div>

    <div class="content">
      <div class="container">
        <!-- 喂奶模式 -->
        <template v-if="appModeStore.isFeedingMode">
          <!-- 喂奶汇总卡片 -->
          <feeding-summary-card />

          <!-- 空状态 -->
          <div class="empty-state-card card" v-if="feedingStore.todayCount === 0">
            <Icon name="milk" :size="44" color="var(--primary)" />
            <div class="empty-info">
              <span class="empty-title">还没有喂奶记录</span>
              <span class="empty-subtitle">开始记录第一次喂奶吧</span>
            </div>
            <button class="action-btn" @click="goToRecord">开始记录</button>
          </div>

          <!-- 最近喂奶记录 -->
          <div class="recent-activity card" v-if="feedingStore.sortedTodayFeedings.length > 0">
            <h3 class="section-title">今日记录</h3>
            <div class="activity-list">
              <div v-for="feeding in feedingStore.sortedTodayFeedings.slice(0, 5)" :key="feeding.id" class="activity-item">
                <div class="activity-icon">
                  <Icon name="milk" :size="16" color="white" />
                </div>
                <div class="activity-info">
                  <span class="activity-amount">{{ feeding.amount }}ml</span>
                  <span class="activity-time">{{ formatTime(feeding.timestamp) }}</span>
                </div>
              </div>
            </div>
          </div>
        </template>

        <!-- 胎动模式（原有内容） -->
        <template v-else>
          <!-- 孕期信息卡片 -->
          <pregnancy-info-card v-if="pregnancyStore.hasProfile" />

          <!-- 空状态卡片 -->
          <div class="empty-state-card card" v-else @click="goToPregnancySetup">
            <Icon name="heart" :size="44" color="var(--primary)" />
            <div class="empty-info">
              <span class="empty-title">设置孕期信息</span>
              <span class="empty-subtitle">记录您的预产期，开始跟踪宝宝成长</span>
            </div>
            <button class="action-btn">立即设置</button>
          </div>

          <!-- 今日统计 -->
          <today-summary-card :movements="movementsStore.todayMovements" />

          <!-- 最近记录 -->
          <div class="recent-activity card" v-if="movementsStore.recentMovements.length > 0">
            <h3 class="section-title">最近记录</h3>
            <div class="activity-list">
              <div v-for="movement in movementsStore.recentMovements" :key="movement.id" class="activity-item">
                <div class="activity-icon">
                  <Icon :name="movement.sessionType === 'singleClick' ? 'pointer' : 'timer'" :size="16" color="white" />
                </div>
                <div class="activity-info">
                  <span class="activity-type">{{ movement.sessionType === 'singleClick' ? '单次记录' : '计时记录' }}</span>
                  <span class="activity-time">{{ getRelativeString(movement.timestamp) }} {{ formatTime(movement.timestamp) }}</span>
                </div>
                <div class="activity-duration" v-if="movement.duration">
                  {{ formatDuration(movement.duration) }}
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>

    <!-- 提醒弹窗 -->
    <feeding-reminder-modal
      :visible="showReminder"
      :last-feeding="feedingStore.lastFeeding"
      :interval-hours="feedingReminderStore.intervalHours"
      @dismiss="handleDismissReminder"
      @record="handleRecordFromReminder"
    />
  </div>
</template>
```

修改 `<script setup>`：

```javascript
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { usePregnancyStore } from '@/store/pregnancy'
import { useMovementsStore } from '@/store/movements'
import { useFeedingStore } from '@/store/feeding'
import { useAppModeStore } from '@/store/appMode'
import { useFeedingReminderStore } from '@/store/feedingReminder'
import { getRelativeString, formatTime as formatTimeUtil, formatDuration as formatDurationUtil } from '@/utils/date'
import PregnancyInfoCard from '@/components/pregnancy-info-card.vue'
import TodaySummaryCard from '@/components/today-summary-card.vue'
import FeedingSummaryCard from '@/components/feeding-summary-card.vue'
import FeedingReminderModal from '@/components/feeding-reminder-modal.vue'
import Icon from '@/components/icon.vue'

const router = useRouter()
const pregnancyStore = usePregnancyStore()
const movementsStore = useMovementsStore()
const feedingStore = useFeedingStore()
const appModeStore = useAppModeStore()
const feedingReminderStore = useFeedingReminderStore()

const showReminder = ref(false)

onMounted(() => {
  appModeStore.loadMode()
  pregnancyStore.loadProfile()
  movementsStore.loadMovements()
  feedingStore.loadFeedings()
  feedingReminderStore.loadSettings()

  // 检查是否需要提醒
  checkReminder()
})

// 监听模式切换，重新检查提醒
watch(() => appModeStore.currentMode, () => {
  checkReminder()
})

function checkReminder() {
  if (appModeStore.isFeedingMode && feedingReminderStore.isEnabled) {
    const lastFeeding = feedingStore.lastFeeding
    if (lastFeeding && feedingReminderStore.shouldRemind(lastFeeding.timestamp)) {
      showReminder.value = true
    }
  }
}

function handleDismissReminder() {
  showReminder.value = false
  feedingReminderStore.dismissReminder()
}

function handleRecordFromReminder() {
  showReminder.value = false
  feedingReminderStore.clearDismissedTime()
  router.push('/record')
}

const goToPregnancySetup = () => {
  router.push('/settings/pregnancy')
}

const goToRecord = () => {
  router.push('/record')
}

const formatTime = (timestamp) => formatTimeUtil(timestamp)
const formatDuration = (seconds) => formatDurationUtil(seconds)
```

添加样式：

```css
.activity-amount {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
}
```

- [ ] **Step 2: 提交**

```bash
git add pages/index/index.vue
git commit -m "feat(home): 根据模式显示不同内容，添加喂奶提醒"
```

---

## Task 10: 修改记录页 — 根据模式显示

**Files:**
- Modify: `pages/record/index.vue`

- [ ] **Step 1: 根据模式显示不同内容**

修改 `<template>`：

```vue
<template>
  <div class="page">
    <h2 class="page-title">{{ appModeStore.isFeedingMode ? '记录喂奶' : '记录胎动' }}</h2>

    <!-- 喂奶模式 -->
    <template v-if="appModeStore.isFeedingMode">
      <div class="record-area">
        <feeding-record @recorded="onFeedingRecorded" />
      </div>

      <div class="today-badge">
        <Icon name="milk" :size="16" color="var(--primary)" />
        <span class="badge-text">今日已记录</span>
        <span class="badge-count">{{ feedingStore.todayCount }}</span>
        <span class="badge-unit">次</span>
        <span class="badge-divider"></span>
        <span class="badge-text">总量</span>
        <span class="badge-count">{{ feedingStore.todayTotalAmount }}</span>
        <span class="badge-unit">ml</span>
      </div>

      <div class="today-records" v-if="feedingStore.todayCount > 0">
        <div class="records-header">
          <span class="records-title">今日记录</span>
        </div>
        <div class="records-list">
          <div
            class="record-item"
            v-for="feeding in feedingStore.sortedTodayFeedings"
            :key="feeding.id"
          >
            <span class="record-time">{{ formatTimeWithSeconds(feeding.timestamp) }}</span>
            <span class="record-amount">{{ feeding.amount }}ml</span>
            <button class="delete-btn" @click="deleteFeeding(feeding.id)">删除</button>
          </div>
        </div>
      </div>
      <div class="empty-records" v-else>
        <span class="empty-text">暂无记录</span>
      </div>
    </template>

    <!-- 胎动模式（原有内容） -->
    <template v-else>
      <div class="record-area">
        <manual-record @recorded="onRecorded" />
      </div>

      <div class="today-badge">
        <Icon name="pointer" :size="16" color="var(--primary)" />
        <span class="badge-text">今日已记录</span>
        <span class="badge-count">{{ movementsStore.todayCount }}</span>
        <span class="badge-unit">次</span>
      </div>

      <div class="today-records" v-if="movementsStore.todayCount > 0">
        <div class="records-header">
          <span class="records-title">今日记录</span>
        </div>
        <div class="records-list">
          <div
            class="record-item"
            v-for="movement in sortedTodayMovements"
            :key="movement.id"
          >
            <span class="record-time">{{ formatTimeWithSeconds(movement.timestamp) }}</span>
            <button class="delete-btn" @click="deleteMovement(movement.id)">删除</button>
          </div>
        </div>
      </div>
      <div class="empty-records" v-else>
        <span class="empty-text">暂无记录</span>
      </div>
    </template>
  </div>
</template>
```

修改 `<script setup>`：

```javascript
import { computed, onMounted } from 'vue'
import { useMovementsStore } from '@/store/movements'
import { useFeedingStore } from '@/store/feeding'
import { useAppModeStore } from '@/store/appMode'
import { useFeedingReminderStore } from '@/store/feedingReminder'
import { formatTimeWithSeconds } from '@/utils/date'
import ManualRecord from '@/components/manual-record.vue'
import FeedingRecord from '@/components/feeding-record.vue'
import Icon from '@/components/icon.vue'

const movementsStore = useMovementsStore()
const feedingStore = useFeedingStore()
const appModeStore = useAppModeStore()
const feedingReminderStore = useFeedingReminderStore()

const sortedTodayMovements = computed(() => {
  return [...movementsStore.todayMovements].sort((a, b) => {
    return new Date(b.timestamp) - new Date(a.timestamp)
  })
})

onMounted(() => {
  appModeStore.loadMode()
  movementsStore.loadMovements()
  feedingStore.loadFeedings()
  feedingReminderStore.loadSettings()
})

const onRecorded = () => {}

const onFeedingRecorded = () => {
  feedingReminderStore.clearDismissedTime()
}

const deleteMovement = (id) => {
  movementsStore.removeMovement(id)
}

const deleteFeeding = (id) => {
  feedingStore.removeFeeding(id)
}
```

添加样式：

```css
.record-amount {
  font-size: 14px;
  font-weight: 500;
  color: var(--primary);
}

.badge-divider {
  width: 1px;
  height: 16px;
  background-color: rgba(233, 30, 99, 0.3);
  margin: 0 8px;
}
```

- [ ] **Step 2: 提交**

```bash
git add pages/record/index.vue
git commit -m "feat(record): 根据模式显示不同内容"
```

---

## Task 11: 修改统计页 — 根据模式显示

**Files:**
- Modify: `pages/statistics/index.vue`

- [ ] **Step 1: 根据模式显示不同内容**

修改 `<template>`：

```vue
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

    <!-- 喂奶模式 -->
    <template v-if="appModeStore.isFeedingMode">
      <div class="summary-cards">
        <div class="summary-card">
          <div class="summary-icon" style="background-color: var(--primary)">
            <Icon name="milk" :size="16" color="white" />
          </div>
          <span class="summary-value">{{ feedingStats.totalCount }}</span>
          <span class="summary-label">总次数</span>
        </div>

        <div class="summary-card">
          <div class="summary-icon" style="background-color: var(--accent)">
            <Icon name="droplet" :size="16" color="white" />
          </div>
          <span class="summary-value">{{ feedingStore.todayTotalAmount }}</span>
          <span class="summary-label">今日总量(ml)</span>
        </div>

        <div class="summary-card">
          <div class="summary-icon" style="background-color: var(--success)">
            <Icon name="trending" :size="16" color="white" />
          </div>
          <span class="summary-value">{{ feedingStats.avgPerDay }}</span>
          <span class="summary-label">日均(ml)</span>
        </div>
      </div>
    </template>

    <!-- 胎动模式（原有内容） -->
    <template v-else>
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
```

修改 `<script setup>`：

```javascript
import { ref, computed, onMounted } from 'vue'
import { useMovementsStore } from '@/store/movements'
import { useFeedingStore } from '@/store/feeding'
import { useAppModeStore } from '@/store/appMode'
import { getTimePeriod } from '@/utils/date'
import DailyTrendChart from '@/components/daily-trend-chart.vue'
import TimeDistributionChart from '@/components/time-distribution-chart.vue'
import WeeklyComparisonChart from '@/components/weekly-comparison-chart.vue'
import Icon from '@/components/icon.vue'

const movementsStore = useMovementsStore()
const feedingStore = useFeedingStore()
const appModeStore = useAppModeStore()
const selectedPeriod = ref('week')

onMounted(() => {
  appModeStore.loadMode()
  movementsStore.loadMovements()
  feedingStore.loadFeedings()
})

// 喂奶统计
const feedingStats = computed(() => {
  const days = selectedPeriod.value === 'week' ? 7 : 30
  return feedingStore.getStats(days)
})

// 胎动统计（原有逻辑保持不变）
const filteredMovements = computed(() => {
  const now = new Date()
  const days = selectedPeriod.value === 'week' ? 7 : 30
  const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000)

  return movementsStore.movements.filter(m => {
    return new Date(m.timestamp) >= startDate
  })
})

// ... 其他计算属性保持不变
```

- [ ] **Step 2: 提交**

```bash
git add pages/statistics/index.vue
git commit -m "feat(statistics): 根据模式显示不同内容"
```

---

## Task 12: 添加图标支持

**Files:**
- Modify: `components/icon.vue`

- [ ] **Step 1: 添加喂奶相关图标**

查看现有 icon.vue 文件，添加 milk 和 droplet 图标支持。如果使用 lucide-vue-next，添加导入：

```javascript
import { Baby, Droplet, Bell } from 'lucide-vue-next'

// 在图标映射中添加
const iconMap = {
  // 现有图标...
  milk: Baby,
  droplet: Droplet,
  bell: Bell
}
```

- [ ] **Step 2: 提交**

```bash
git add components/icon.vue
git commit -m "feat(icon): 添加喂奶相关图标"
```

---

## Task 13: 最终验证

- [ ] **Step 1: 运行应用**

```bash
npm run dev
```

- [ ] **Step 2: 测试功能清单**

1. 模式切换：设置页切换胎动/喂奶模式
2. 喂奶记录：记录页添加喂奶记录
3. 首页显示：喂奶模式下显示汇总卡片
4. 统计显示：统计页显示喂奶数据
5. 提醒功能：超过间隔时间显示提醒弹窗
6. 数据持久化：刷新页面后数据保留

- [ ] **Step 3: 最终提交**

```bash
git add -A
git commit -m "feat: 完成婴儿喂奶统计功能"
```