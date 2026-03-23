<template>
  <div class="page">
    <h2 class="page-title">我的</h2>

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
            <button class="mode-btn" :class="{ active: appModeStore.isMovementMode }" @click="appModeStore.setMode('movement')">胎动</button>
            <button class="mode-btn" :class="{ active: appModeStore.isFeedingMode }" @click="appModeStore.setMode('feeding')">喂奶</button>
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
            <button v-for="h in [1, 2, 3, 4, 5, 6]" :key="h" class="interval-btn" :class="{ active: feedingReminderStore.intervalHours === h }" @click="feedingReminderStore.setIntervalHours(h)">{{ h }}小时</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 孕期信息 -->
    <div class="section" v-if="appModeStore.isMovementMode">
      <h3 class="section-header">孕期信息</h3>
      <div class="list">
        <div class="list-item" v-if="pregnancyStore.hasProfile" @click="goToPregnancySetup">
          <div class="avatar">
            <img v-if="pregnancyStore.profile?.avatarPath" :src="pregnancyStore.profile.avatarPath" />
            <Icon v-else name="user" :size="24" color="white" />
          </div>
          <div class="info">
            <span class="name">{{ pregnancyStore.profile?.babyName || '宝宝' }}</span>
            <span class="weeks">孕{{ pregnancyStore.pregnancyProgress.weeks }}周{{ pregnancyStore.pregnancyProgress.days }}天</span>
          </div>
          <span class="arrow">›</span>
        </div>
        <div class="list-item" v-else @click="goToPregnancySetup">
          <span class="add-icon">+</span>
          <span class="add-text">设置孕期信息</span>
        </div>
      </div>
    </div>

    <!-- 提醒设置 -->
    <div class="section">
      <h3 class="section-header">提醒</h3>
      <div class="list">
        <div class="list-item" @click="goToReminderSetup">
          <div class="reminder-icon" :class="{ enabled: remindersStore.isEnabled }">
            <Icon name="bell" :size="16" :color="remindersStore.isEnabled ? 'white' : 'var(--text-secondary)'" />
          </div>
          <div class="info">
            <span class="name">每日提醒</span>
            <span class="times">{{ remindersStore.isEnabled ? `${remindersStore.reminderTimes.length} 个提醒时间` : '已关闭' }}</span>
          </div>
          <span class="arrow">›</span>
        </div>
      </div>
    </div>

    <!-- 关于 -->
    <div class="section">
      <h3 class="section-header">关于</h3>
      <div class="list">
        <div class="list-item">
          <span class="label">版本</span>
          <span class="value">1.0.0</span>
        </div>
        <div class="list-item" @click="openFeedback">
          <span class="label">反馈建议</span>
          <span class="arrow">›</span>
        </div>
        <div class="list-item" @click="openPrivacy">
          <span class="label">隐私政策</span>
          <span class="arrow">›</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePregnancyStore } from '@/store/pregnancy'
import { useRemindersStore } from '@/store/reminders'
import { useAppModeStore } from '@/store/appMode'
import { useFeedingReminderStore } from '@/store/feedingReminder'
import Icon from '@/components/icon.vue'

const router = useRouter()
const pregnancyStore = usePregnancyStore()
const remindersStore = useRemindersStore()
const appModeStore = useAppModeStore()
const feedingReminderStore = useFeedingReminderStore()

onMounted(() => {
  appModeStore.loadMode()
  pregnancyStore.loadProfile()
  remindersStore.loadSettings()
  feedingReminderStore.loadSettings()
})

const goToPregnancySetup = () => {
  router.push('/settings/pregnancy')
}

const goToReminderSetup = () => {
  router.push('/settings/reminder')
}

const openFeedback = () => {
  alert('功能开发中')
}

const openPrivacy = () => {
  alert('功能开发中')
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background-color: var(--background);
  padding: 16px;
}

.page-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 16px;
  text-align: center;
}

.section {
  margin-bottom: 24px;
}

.section-header {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0 0 8px;
  padding-left: 16px;
}

.list {
  background-color: var(--card);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.list-item {
  display: flex;
  align-items: center;
  padding: 14px 16px;
  border-bottom: 1px solid rgba(252, 228, 236, 0.5);
  cursor: pointer;
}

.list-item:last-child {
  border-bottom: none;
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  margin-right: 12px;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar span {
  font-size: 24px;
}

.info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.name {
  font-size: 16px;
  font-weight: 500;
  color: var(--text-primary);
}

.weeks, .times {
  font-size: 14px;
  color: var(--text-secondary);
}

.arrow {
  font-size: 20px;
  color: var(--text-tertiary);
}

.add-icon {
  font-size: 24px;
  color: var(--primary);
  margin-right: 12px;
}

.add-text {
  font-size: 16px;
  font-weight: 500;
  color: var(--primary);
}

.reminder-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  font-size: 16px;
}

.reminder-icon.enabled {
  background-color: var(--primary);
}

.label {
  flex: 1;
  font-size: 16px;
  color: var(--text-primary);
}

.value {
  font-size: 16px;
  color: var(--text-secondary);
}

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
</style>