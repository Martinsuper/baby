<template>
  <div class="page">
    <h2 class="page-title">提醒设置</h2>

    <!-- 启用开关 -->
    <div class="section">
      <div class="toggle-item">
        <span class="toggle-label">启用每日提醒</span>
        <input type="checkbox" :checked="isEnabled" @change="toggleEnabled" class="toggle-switch" />
      </div>
    </div>

    <!-- 提醒时间列表 -->
    <div class="section" v-if="isEnabled">
      <h3 class="section-header">提醒时间</h3>
      <div class="list">
        <div v-for="time in reminderTimes" :key="time.id" class="list-item">
          <span class="time-value">{{ formatTime(time) }}</span>
          <input type="time" :value="`${String(time.hour).padStart(2, '0')}:${String(time.minute).padStart(2, '0')}`" @change="(e) => updateTime(time.id, e)" class="time-input" />
          <button class="delete-btn" @click="removeTime(time.id)">删除</button>
        </div>

        <div class="add-item" v-if="reminderTimes.length < 5" @click="addNewTime">
          <span class="add-icon">+</span>
          <span class="add-text">添加提醒时间</span>
        </div>
      </div>
      <span class="section-footer">最多设置5个提醒时间</span>
    </div>

    <!-- 说明 -->
    <div class="section">
      <div class="info-card">
        <span class="info-icon">ℹ️</span>
        <div class="info-content">
          <span class="info-title">提醒说明</span>
          <span class="info-text">系统会在设定的时间提醒您记录宝宝的胎动情况，帮助您更好地监测宝宝的健康状态。</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRemindersStore } from '@/store/reminders'

const remindersStore = useRemindersStore()

onMounted(() => {
  remindersStore.loadSettings()
})

const isEnabled = computed(() => remindersStore.isEnabled)
const reminderTimes = computed(() => remindersStore.reminderTimes)

const formatTime = (time) => remindersStore.formatTime(time)

const toggleEnabled = () => {
  remindersStore.toggleEnabled()
}

const updateTime = (id, e) => {
  const [hour, minute] = e.target.value.split(':').map(Number)
  remindersStore.updateReminderTime(id, hour, minute)
}

const removeTime = (id) => {
  remindersStore.removeReminderTime(id)
}

const addNewTime = () => {
  remindersStore.addReminderTime(9, 0)
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

.section-footer {
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: 8px;
  padding-left: 16px;
  display: block;
}

.toggle-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--card);
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.toggle-label {
  font-size: 16px;
  color: var(--text-primary);
}

.toggle-switch {
  width: 50px;
  height: 26px;
  appearance: none;
  background-color: #ccc;
  border-radius: 13px;
  position: relative;
  cursor: pointer;
}

.toggle-switch:checked {
  background-color: var(--primary);
}

.toggle-switch::before {
  content: '';
  position: absolute;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background-color: white;
  top: 2px;
  left: 2px;
  transition: transform 0.2s;
}

.toggle-switch:checked::before {
  transform: translateX(24px);
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
  gap: 12px;
}

.list-item:last-child {
  border-bottom: none;
}

.time-value {
  flex: 1;
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
}

.time-input {
  padding: 8px 12px;
  border: none;
  background-color: rgba(8, 145, 178, 0.1);
  border-radius: 6px;
  font-size: 14px;
  color: var(--primary);
}

.delete-btn {
  padding: 8px 12px;
  background-color: rgba(239, 68, 68, 0.1);
  border: none;
  border-radius: 6px;
  font-size: 14px;
  color: var(--error);
  cursor: pointer;
}

.add-item {
  display: flex;
  align-items: center;
  padding: 14px 16px;
  cursor: pointer;
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

.info-card {
  display: flex;
  background-color: var(--card);
  padding: 16px;
  border-radius: 12px;
  gap: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.info-icon {
  font-size: 20px;
}

.info-content {
  flex: 1;
}

.info-title {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.info-text {
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.5;
}
</style>