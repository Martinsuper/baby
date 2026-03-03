<template>
  <div class="page">
    <h2 class="page-title">日记</h2>

    <!-- 空状态 -->
    <div class="empty-state" v-if="diaryStore.entries.length === 0">
      <span class="empty-icon">📖</span>
      <span class="empty-title">还没有日记</span>
      <span class="empty-subtitle">记录您的孕期心情和美好时刻</span>
      <button class="action-btn" @click="goToEditor">写第一篇日记</button>
    </div>

    <!-- 日记列表 -->
    <div class="entry-list" v-else>
      <div v-for="(entries, date) in groupedEntries" :key="date" class="date-group">
        <h3 class="group-header">{{ formatGroupHeader(date) }}</h3>
        <div class="entries">
          <div v-for="entry in entries" :key="entry.id" class="entry-item" @click="goToDetail(entry.id)">
            <div class="mood-indicator" :style="{ backgroundColor: getMoodColor(entry.mood) }">
              {{ getMoodIcon(entry.mood) }}
            </div>
            <div class="entry-info">
              <span class="entry-content">{{ entry.content || '无内容' }}</span>
              <span class="entry-time">{{ formatTime(entry.date) }}</span>
            </div>
            <span class="has-image" v-if="entry.imagePath">🖼️</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 添加按钮 -->
    <button class="add-btn" @click="goToEditor">+</button>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useDiaryStore } from '@/store/diary'
import { isToday, isYesterday, formatTime as formatTimeUtil, startOfDay } from '@/utils/date'

const router = useRouter()
const diaryStore = useDiaryStore()

onMounted(() => {
  diaryStore.loadEntries()
})

const groupedEntries = computed(() => {
  const groups = {}
  const sorted = [...diaryStore.entries].sort((a, b) => new Date(b.date) - new Date(a.date))

  sorted.forEach(entry => {
    const dateKey = startOfDay(entry.date).toISOString()
    if (!groups[dateKey]) {
      groups[dateKey] = []
    }
    groups[dateKey].push(entry)
  })

  return groups
})

const formatGroupHeader = (dateStr) => {
  if (isToday(dateStr)) return '今天'
  if (isYesterday(dateStr)) return '昨天'
  const date = new Date(dateStr)
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
}

const formatTime = (date) => formatTimeUtil(date)

const getMoodIcon = (mood) => {
  const icons = { great: '😊', good: '🙂', normal: '😐', bad: '😔', terrible: '😢' }
  return icons[mood] || '😐'
}

const getMoodColor = (mood) => {
  const colors = {
    great: 'rgba(129, 199, 132, 0.15)',
    good: 'rgba(165, 214, 167, 0.15)',
    normal: 'rgba(255, 224, 130, 0.15)',
    bad: 'rgba(255, 171, 145, 0.15)',
    terrible: 'rgba(239, 154, 154, 0.15)'
  }
  return colors[mood] || 'rgba(255, 224, 130, 0.15)'
}

const goToEditor = () => {
  router.push('/diary/editor')
}

const goToDetail = (id) => {
  router.push(`/diary/detail/${id}`)
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background-color: var(--background);
  padding: 16px;
  padding-top: 20px;
}

.page-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 16px;
  text-align: center;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
  padding-top: 100px;
}

.empty-icon {
  font-size: 56px;
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

.date-group {
  margin-bottom: 16px;
}

.group-header {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-secondary);
  margin: 0 0 8px;
}

.entries {
  background-color: var(--card);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.entry-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(252, 228, 236, 0.5);
  cursor: pointer;
}

.entry-item:last-child {
  border-bottom: none;
}

.mood-indicator {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.entry-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.entry-content {
  font-size: 14px;
  color: var(--text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.entry-time {
  font-size: 12px;
  color: var(--text-secondary);
}

.has-image {
  font-size: 14px;
}

.add-btn {
  position: fixed;
  right: 20px;
  bottom: 76px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background-color: var(--primary);
  border: none;
  font-size: 28px;
  color: white;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(233, 30, 99, 0.3);
  z-index: 100;
}
</style>