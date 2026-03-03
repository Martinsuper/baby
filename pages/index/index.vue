<template>
  <div class="page">
    <!-- 自定义导航栏 -->
    <div class="nav-bar">
      <h1 class="nav-title">胎动记</h1>
    </div>

    <div class="content">
      <div class="container">
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
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePregnancyStore } from '@/store/pregnancy'
import { useMovementsStore } from '@/store/movements'
import { getRelativeString, formatTime as formatTimeUtil, formatDuration as formatDurationUtil } from '@/utils/date'
import PregnancyInfoCard from '@/components/pregnancy-info-card.vue'
import TodaySummaryCard from '@/components/today-summary-card.vue'
import Icon from '@/components/icon.vue'

const router = useRouter()
const pregnancyStore = usePregnancyStore()
const movementsStore = useMovementsStore()

onMounted(() => {
  pregnancyStore.loadProfile()
  movementsStore.loadMovements()
})

const goToPregnancySetup = () => {
  router.push('/settings/pregnancy')
}

const formatTime = (timestamp) => formatTimeUtil(timestamp)
const formatDuration = (seconds) => formatDurationUtil(seconds)
</script>

<style scoped>
.page {
  min-height: 100vh;
  background-color: var(--background);
}

.nav-bar {
  position: sticky;
  top: 0;
  background-color: var(--background);
  padding: 16px;
  z-index: 100;
}

.nav-title {
  font-size: 28px;
  font-weight: bold;
  color: var(--text-primary);
  margin: 0;
}

.container {
  padding: 0 16px 16px;
}

.empty-state-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  text-align: center;
  cursor: pointer;
}

.empty-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.empty-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.empty-subtitle {
  font-size: 14px;
  color: var(--text-secondary);
}

.action-btn {
  background-color: var(--primary);
  color: white;
  padding: 14px 32px;
  border-radius: 12px;
  border: none;
  font-weight: 600;
  cursor: pointer;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 16px;
}

.activity-list {
  display: flex;
  flex-direction: column;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
  border-bottom: 1px solid rgba(252, 228, 236, 0.5);
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

.activity-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.activity-type {
  font-size: 14px;
  color: var(--text-primary);
}

.activity-time {
  font-size: 12px;
  color: var(--text-secondary);
}

.activity-duration {
  background-color: rgba(252, 228, 236, 0.5);
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  color: var(--text-secondary);
}
</style>