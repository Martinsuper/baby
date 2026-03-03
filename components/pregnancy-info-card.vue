<template>
  <div class="pregnancy-info-card card" v-if="profile">
    <!-- 头部信息 -->
    <div class="header">
      <div class="info">
        <span class="title">孕{{ pregnancyProgress.weeks }}周{{ pregnancyProgress.days }}天</span>
        <span class="subtitle">距离预产期还有 {{ daysRemaining }} 天</span>
      </div>
      <div class="baby-name" v-if="profile.babyName">
        <span>{{ profile.babyName }}</span>
      </div>
    </div>

    <!-- 进度条 -->
    <div class="progress-bar">
      <div class="progress-track">
        <div class="progress-fill" :style="{ width: progressPercentage * 100 + '%' }"></div>
      </div>
    </div>

    <!-- 孕期指示器 -->
    <div class="trimester-indicator">
      <div v-for="t in 3" :key="t" class="trimester-item" :class="{ active: t <= trimester }">
        <div class="trimester-dot" :class="{ filled: t <= trimester }"></div>
        <span class="trimester-label">孕{{ t }}</span>
      </div>
    </div>

    <!-- 宝宝发育信息 -->
    <div class="development-info" v-if="developmentInfo">
      <div class="development-row">
        <span class="development-label">宝宝大小</span>
        <span class="development-value">{{ developmentInfo.size }}</span>
      </div>
      <span class="development-description">{{ developmentInfo.description }}</span>
      <div class="milestones" v-if="developmentInfo.milestones.length">
        <div v-for="(milestone, index) in developmentInfo.milestones" :key="index" class="milestone-item">
          <span class="milestone-icon">✓</span>
          <span class="milestone-text">{{ milestone }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { usePregnancyStore } from '@/store/pregnancy'

const pregnancyStore = usePregnancyStore()

const profile = computed(() => pregnancyStore.profile)
const pregnancyProgress = computed(() => pregnancyStore.pregnancyProgress)
const daysRemaining = computed(() => pregnancyStore.daysRemaining)
const progressPercentage = computed(() => pregnancyStore.progressPercentage)
const trimester = computed(() => pregnancyStore.trimester)
const developmentInfo = computed(() => pregnancyStore.developmentInfo)
</script>

<style scoped>
.pregnancy-info-card {
  background-color: var(--card);
  border-radius: 16px;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.title {
  font-size: 24px;
  font-weight: bold;
  color: var(--text-primary);
}

.subtitle {
  font-size: 14px;
  color: var(--text-secondary);
}

.baby-name {
  background-color: rgba(233, 30, 99, 0.1);
  padding: 6px 14px;
  border-radius: 20px;
}

.baby-name text {
  font-size: 14px;
  font-weight: 500;
  color: var(--primary);
}

.progress-bar {
  margin-bottom: 16px;
}

.progress-track {
  height: 8px;
  background-color: rgba(252, 228, 236, 0.5);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: var(--primary);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.trimester-indicator {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
}

.trimester-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  flex: 1;
}

.trimester-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid var(--primary);
  background-color: transparent;
}

.trimester-dot.filled {
  background-color: var(--primary);
}

.trimester-label {
  font-size: 12px;
  color: var(--text-tertiary);
}

.trimester-item.active .trimester-label {
  color: var(--primary);
}

.development-info {
  background-color: var(--card-secondary);
  border-radius: 12px;
  padding: 16px;
}

.development-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.development-label {
  font-size: 14px;
  color: var(--text-secondary);
}

.development-value {
  font-size: 14px;
  font-weight: 600;
  color: var(--primary);
}

.development-description {
  font-size: 14px;
  color: var(--text-primary);
  margin-bottom: 12px;
}

.milestones {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.milestone-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.milestone-icon {
  font-size: 12px;
  color: var(--success);
}

.milestone-text {
  font-size: 12px;
  color: var(--text-secondary);
}
</style>