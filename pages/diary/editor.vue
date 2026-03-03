<template>
  <div class="page">
    <h2 class="page-title">{{ isEdit ? '编辑日记' : '写日记' }}</h2>

    <!-- 日期选择 -->
    <div class="form-section">
      <label class="section-label">日期</label>
      <input type="date" v-model="selectedDate" class="date-input" />
    </div>

    <!-- 心情选择 -->
    <div class="form-section">
      <label class="section-label">今天的心情</label>
      <div class="mood-selector">
        <mood-button
          v-for="mood in moods"
          :key="mood.value"
          :mood="mood"
          :isSelected="selectedMood === mood.value"
          @select="selectedMood = mood.value"
        />
      </div>
    </div>

    <!-- 图片选择 -->
    <div class="form-section">
      <label class="section-label">添加照片</label>
      <div class="image-preview" v-if="selectedImagePath">
        <img :src="selectedImagePath" class="preview-image" />
        <button class="remove-btn" @click="selectedImagePath = ''">✕</button>
      </div>
      <div class="image-picker" v-else @click="chooseImage">
        <span class="picker-icon">🖼️</span>
        <span class="picker-text">选择照片</span>
      </div>
    </div>

    <!-- 内容编辑 -->
    <div class="form-section">
      <label class="section-label">日记内容</label>
      <textarea
        v-model="content"
        class="content-input"
        placeholder="记录今天的心情和感受..."
      ></textarea>
    </div>

    <!-- 保存按钮 -->
    <button class="save-btn" @click="saveEntry">保存</button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDiaryStore, moodTypes } from '@/store/diary'

const route = useRoute()
const router = useRouter()
const diaryStore = useDiaryStore()

const entryId = ref('')
const selectedDate = ref(new Date().toISOString().split('T')[0])
const selectedMood = ref('normal')
const selectedImagePath = ref('')
const content = ref('')

const moods = moodTypes
const isEdit = computed(() => !!entryId.value)

onMounted(() => {
  if (route.params.id) {
    entryId.value = route.params.id
    loadEntry()
  }
})

const loadEntry = () => {
  const entry = diaryStore.getEntryById(entryId.value)
  if (entry) {
    selectedDate.value = new Date(entry.date).toISOString().split('T')[0]
    selectedMood.value = entry.mood
    selectedImagePath.value = entry.imagePath || ''
    content.value = entry.content || ''
  }
}

const chooseImage = () => {
  // 创建隐藏的文件输入
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.onchange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        selectedImagePath.value = e.target.result
      }
      reader.readAsDataURL(file)
    }
  }
  input.click()
}

const saveEntry = () => {
  if (!content.value && !selectedImagePath.value) {
    alert('请输入内容或添加图片')
    return
  }

  const data = {
    date: new Date(selectedDate.value).toISOString(),
    mood: selectedMood.value,
    content: content.value,
    imagePath: selectedImagePath.value
  }

  if (entryId.value) {
    diaryStore.updateEntry(entryId.value, data)
  } else {
    diaryStore.addEntry(data)
  }

  alert('保存成功')
  router.back()
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background-color: var(--card);
  padding: 16px;
}

.page-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 24px;
  text-align: center;
}

.form-section {
  margin-bottom: 24px;
}

.section-label {
  display: block;
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.date-input {
  width: 100%;
  padding: 12px;
  background-color: var(--card-secondary);
  border: none;
  border-radius: 8px;
  font-size: 16px;
  color: var(--text-primary);
}

.mood-selector {
  display: flex;
  gap: 12px;
}

.image-preview {
  position: relative;
  width: 100%;
  height: 180px;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
}

.remove-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.5);
  border: none;
  color: white;
  font-size: 14px;
  cursor: pointer;
}

.image-picker {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 20px;
  background-color: rgba(233, 30, 99, 0.1);
  border-radius: 12px;
  cursor: pointer;
}

.picker-icon {
  font-size: 20px;
}

.picker-text {
  font-size: 14px;
  color: var(--primary);
}

.content-input {
  width: 100%;
  min-height: 180px;
  padding: 12px;
  background-color: var(--card-secondary);
  border: none;
  border-radius: 12px;
  font-size: 16px;
  color: var(--text-primary);
  resize: vertical;
  font-family: inherit;
}

.save-btn {
  width: 100%;
  background-color: var(--primary);
  color: white;
  padding: 14px;
  border-radius: 12px;
  border: none;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
}
</style>