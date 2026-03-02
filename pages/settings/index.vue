<template>
  <div class="page">
    <h2 class="page-title">我的</h2>

    <!-- 孕期信息 -->
    <div class="section">
      <h3 class="section-header">孕期信息</h3>
      <div class="list">
        <div class="list-item" v-if="pregnancyStore.hasProfile" @click="goToPregnancySetup">
          <div class="avatar">
            <img v-if="pregnancyStore.profile?.avatarPath" :src="pregnancyStore.profile.avatarPath" />
            <span v-else>👤</span>
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
            🔔
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

const router = useRouter()
const pregnancyStore = usePregnancyStore()
const remindersStore = useRemindersStore()

onMounted(() => {
  pregnancyStore.loadProfile()
  remindersStore.loadSettings()
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
  border-bottom: 1px solid rgba(103, 232, 249, 0.2);
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
</style>