<template>
  <div class="page">
    <h2 class="page-title">{{ isEdit ? '编辑孕期信息' : '设置孕期信息' }}</h2>

    <!-- 头像选择 -->
    <div class="avatar-section">
      <div class="avatar" @click="chooseAvatar">
        <img v-if="avatarPath" :src="avatarPath" />
        <div class="avatar-placeholder" v-else>
          <span class="camera-icon">📷</span>
          <span class="avatar-hint">添加头像</span>
        </div>
      </div>
    </div>

    <!-- 表单 -->
    <div class="form">
      <!-- 宝宝昵称 -->
      <div class="form-item">
        <label class="label">宝宝昵称</label>
        <input v-model="babyName" placeholder="给宝宝起个昵称" class="input" />
      </div>

      <!-- 预产期 -->
      <div class="form-item">
        <label class="label">预产期</label>
        <input type="date" v-model="dueDate" :min="minDate" class="input" />
      </div>

      <!-- 计算信息 -->
      <div class="calculated-info">
        <div class="info-row">
          <span class="info-label">当前孕周</span>
          <span class="info-value">孕{{ pregnancyProgress.weeks }}周{{ pregnancyProgress.days }}天</span>
        </div>
        <div class="info-row">
          <span class="info-label">距离预产期</span>
          <span class="info-value">{{ daysRemaining }} 天</span>
        </div>
      </div>
    </div>

    <!-- 保存按钮 -->
    <button class="save-btn" @click="saveProfile">保存</button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePregnancyStore } from '@/store/pregnancy'
import { calculatePregnancyWeeks, calculateDaysRemaining } from '@/utils/pregnancy'

const router = useRouter()
const pregnancyStore = usePregnancyStore()

const babyName = ref('')
const dueDate = ref('')
const avatarPath = ref('')

const minDate = computed(() => {
  const today = new Date()
  return today.toISOString().split('T')[0]
})

const isEdit = computed(() => pregnancyStore.hasProfile)

const pregnancyProgress = computed(() => {
  if (!dueDate.value) return { weeks: 0, days: 0 }
  return calculatePregnancyWeeks(dueDate.value)
})

const daysRemaining = computed(() => {
  if (!dueDate.value) return 0
  return calculateDaysRemaining(dueDate.value)
})

onMounted(() => {
  // 默认预产期为100天后
  const defaultDue = new Date()
  defaultDue.setDate(defaultDue.getDate() + 100)
  dueDate.value = defaultDue.toISOString().split('T')[0]

  // 如果有现有数据则加载
  if (pregnancyStore.hasProfile) {
    const profile = pregnancyStore.profile
    babyName.value = profile.babyName || ''
    dueDate.value = new Date(profile.dueDate).toISOString().split('T')[0]
    avatarPath.value = profile.avatarPath || ''
  }
})

const chooseAvatar = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.onchange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        avatarPath.value = e.target.result
      }
      reader.readAsDataURL(file)
    }
  }
  input.click()
}

const saveProfile = () => {
  pregnancyStore.setProfile({
    babyName: babyName.value || null,
    dueDate: new Date(dueDate.value).toISOString(),
    avatarPath: avatarPath.value || null
  })

  alert('保存成功')
  router.back()
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
  margin: 0 0 24px;
  text-align: center;
}

.avatar-section {
  display: flex;
  justify-content: center;
  margin-bottom: 28px;
}

.avatar {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  background-color: var(--primary);
  overflow: hidden;
  cursor: pointer;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.camera-icon {
  font-size: 24px;
}

.avatar-hint {
  font-size: 12px;
  color: white;
}

.form {
  background-color: var(--card);
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.form-item {
  margin-bottom: 20px;
}

.form-item:last-child {
  margin-bottom: 0;
}

.label {
  display: block;
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.input {
  width: 100%;
  padding: 12px;
  background-color: var(--card-secondary);
  border: none;
  border-radius: 8px;
  font-size: 16px;
  color: var(--text-primary);
}

.calculated-info {
  background-color: var(--card-secondary);
  border-radius: 12px;
  padding: 16px;
  margin-top: 14px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
}

.info-label {
  font-size: 14px;
  color: var(--text-secondary);
}

.info-value {
  font-size: 16px;
  font-weight: 600;
  color: var(--primary);
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
  margin-top: 24px;
}
</style>