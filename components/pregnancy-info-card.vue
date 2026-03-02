<template>
  <view class="pregnancy-info-card card" v-if="profile">
    <!-- 头部信息 -->
    <view class="header">
      <view class="info">
        <text class="title">孕{{ pregnancyProgress.weeks }}周{{ pregnancyProgress.days }}天</text>
        <text class="subtitle">距离预产期还有 {{ daysRemaining }} 天</text>
      </view>
      <view class="baby-name" v-if="profile.babyName">
        <text>{{ profile.babyName }}</text>
      </view>
    </view>

    <!-- 进度条 -->
    <view class="progress-bar">
      <view class="progress-track">
        <view class="progress-fill" :style="{ width: progressPercentage * 100 + '%' }"></view>
      </view>
    </view>

    <!-- 孕期指示器 -->
    <view class="trimester-indicator">
      <view v-for="t in 3" :key="t" class="trimester-item" :class="{ active: t <= trimester }">
        <view class="trimester-dot" :class="{ filled: t <= trimester }"></view>
        <text class="trimester-label">孕{{ t }}</text>
      </view>
    </view>

    <!-- 宝宝发育信息 -->
    <view class="development-info" v-if="developmentInfo">
      <view class="development-row">
        <text class="development-label">宝宝大小</text>
        <text class="development-value">{{ developmentInfo.size }}</text>
      </view>
      <text class="development-description">{{ developmentInfo.description }}</text>
      <view class="milestones" v-if="developmentInfo.milestones.length">
        <view v-for="(milestone, index) in developmentInfo.milestones" :key="index" class="milestone-item">
          <text class="milestone-icon">✓</text>
          <text class="milestone-text">{{ milestone }}</text>
        </view>
      </view>
    </view>
  </view>
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
  background-color: rgba(8, 145, 178, 0.1);
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
  background-color: rgba(103, 232, 249, 0.3);
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