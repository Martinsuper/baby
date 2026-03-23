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
          <feeding-summary-card
            :count="feedingStore.todayCount"
            :total-amount="feedingStore.todayTotalAmount"
            :last-feeding="feedingStore.lastFeeding"
          />

          <!-- 今日喂奶记录 -->
          <div class="recent-activity card" v-if="feedingStore.sortedTodayFeedings.length > 0">
            <h3 class="section-title">今日记录</h3>
            <div class="activity-list">
              <div v-for="feeding in feedingStore.sortedTodayFeedings" :key="feeding.id" class="activity-item">
                <div class="activity-icon">
                  <Icon name="droplet" :size="16" color="white" />
                </div>
                <div class="activity-info">
                  <span class="activity-type">{{ feeding.amount }}ml</span>
                  <span class="activity-time">{{ formatTime(feeding.timestamp) }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 空状态 -->
          <div class="empty-state-card card" v-if="feedingStore.todayCount === 0">
            <Icon name="droplet" :size="44" color="var(--primary)" />
            <div class="empty-info">
              <span class="empty-title">还没有喂奶记录</span>
              <span class="empty-subtitle">开始记录第一次喂奶吧</span>
            </div>
          </div>
        </template>

        <!-- 胎动模式 -->
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

    <!-- 喂奶提醒弹窗 -->
    <feeding-reminder-modal
      :visible="showReminderModal"
      :last-feeding="feedingStore.lastFeeding"
      :interval-hours="feedingReminderStore.intervalHours"
      @dismiss="handleDismissReminder"
      @record="handleRecordFromReminder"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePregnancyStore } from '@/store/pregnancy'
import { useMovementsStore } from '@/store/movements'
import { useAppModeStore } from '@/store/appMode'
import { useFeedingStore } from '@/store/feeding'
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
const appModeStore = useAppModeStore()
const feedingStore = useFeedingStore()
const feedingReminderStore = useFeedingReminderStore()

const showReminderModal = ref(false)
let reminderCheckInterval = null

onMounted(() => {
  // 加载数据
  appModeStore.loadMode()
  pregnancyStore.loadProfile()
  movementsStore.loadMovements()
  feedingStore.loadFeedings()
  feedingReminderStore.loadSettings()

  // 检查是否需要提醒
  checkReminder()

  // 定时检查提醒（每分钟）
  reminderCheckInterval = setInterval(checkReminder, 60000)
})

onUnmounted(() => {
  if (reminderCheckInterval) {
    clearInterval(reminderCheckInterval)
  }
})

const checkReminder = () => {
  if (appModeStore.isFeedingMode && feedingReminderStore.shouldRemind) {
    showReminderModal.value = true
  }
}

const handleDismissReminder = () => {
  feedingReminderStore.dismissReminder()
  showReminderModal.value = false
}

const handleRecordFromReminder = () => {
  showReminderModal.value = false
  router.push('/record')
}

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