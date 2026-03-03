<template>
  <div class="page" v-if="entry">
    <h2 class="page-title">日记详情</h2>

    <!-- 日期和心情 -->
    <div class="header">
      <span class="date">{{ formatDate(entry.date) }}</span>
      <div class="mood">
        <span class="mood-icon">{{ getMoodIcon(entry.mood) }}</span>
        <span class="mood-label" :style="{ color: getMoodColor(entry.mood) }">{{ getMoodLabel(entry.mood) }}</span>
      </div>
    </div>

    <div class="divider"></div>

    <!-- 图片 -->
    <div class="image-container" v-if="entry.imagePath">
      <img :src="entry.imagePath" class="entry-image" />
    </div>

    <!-- 内容 -->
    <p class="content">{{ entry.content || '无内容' }}</p>

    <!-- 时间戳 -->
    <span class="timestamp">创建于 {{ formatDateTime(entry.createdAt) }}</span>

    <!-- 底部操作栏 -->
    <div class="actions">
      <button class="action-btn edit" @click="goToEditor">编辑</button>
      <button class="action-btn delete" @click="confirmDelete">删除</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDiaryStore } from '@/store/diary'
import { formatDate as formatDateUtil, formatDateTime } from '@/utils/date'

const route = useRoute()
const router = useRouter()
const diaryStore = useDiaryStore()

const entryId = ref('')
const entry = computed(() => diaryStore.getEntryById(entryId.value))

onMounted(() => {
  entryId.value = route.params.id
  diaryStore.loadEntries()
})

const formatDate = (date) => formatDateUtil(date)

const getMoodIcon = (mood) => {
  const icons = { great: '😊', good: '🙂', normal: '😐', bad: '😔', terrible: '😢' }
  return icons[mood] || '😐'
}

const getMoodLabel = (mood) => {
  const labels = { great: '很棒', good: '不错', normal: '一般', bad: '不太好', terrible: '很糟' }
  return labels[mood] || '一般'
}

const getMoodColor = (mood) => {
  const colors = {
    great: '#81C784',
    good: '#A5D6A7',
    normal: '#FFE082',
    bad: '#FFAB91',
    terrible: '#EF9A9A'
  }
  return colors[mood] || '#FFE082'
}

const goToEditor = () => {
  router.push(`/diary/editor/${entryId.value}`)
}

const confirmDelete = () => {
  if (confirm('确定要删除这篇日记吗？')) {
    diaryStore.removeEntry(entryId.value)
    router.back()
  }
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

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.date {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.mood {
  display: flex;
  align-items: center;
  gap: 8px;
}

.mood-icon {
  font-size: 24px;
}

.mood-label {
  font-size: 14px;
  font-weight: 500;
}

.divider {
  height: 1px;
  background-color: rgba(252, 228, 236, 0.5);
  margin: 16px 0;
}

.image-container {
  margin-bottom: 16px;
}

.entry-image {
  width: 100%;
  border-radius: 12px;
}

.content {
  font-size: 16px;
  color: var(--text-primary);
  line-height: 1.6;
  margin: 0;
}

.timestamp {
  display: block;
  margin-top: 24px;
  font-size: 12px;
  color: var(--text-tertiary);
}

.actions {
  display: flex;
  gap: 12px;
  margin-top: 32px;
}

.action-btn {
  flex: 1;
  padding: 14px;
  border-radius: 12px;
  border: none;
  font-weight: 600;
  cursor: pointer;
}

.action-btn.edit {
  background-color: var(--primary);
  color: white;
}

.action-btn.delete {
  background-color: rgba(239, 68, 68, 0.1);
  color: var(--error);
}
</style>