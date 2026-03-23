<template>
  <div class="feeding-record">
    <div class="record-card card">
      <h3 class="card-title">记录喂奶</h3>

      <!-- 时间选择 -->
      <div class="field">
        <label class="field-label">喂奶时间</label>
        <input
          type="datetime-local"
          v-model="selectedTime"
          :max="maxTime"
          :min="minTime"
          class="time-input"
        />
      </div>

      <!-- 奶量输入 -->
      <div class="field">
        <label class="field-label">奶量 (毫升)</label>
        <div class="amount-input-wrapper">
          <input
            type="number"
            v-model.number="amount"
            min="1"
            max="500"
            placeholder="请输入奶量"
            class="amount-input"
          />
          <span class="unit">ml</span>
        </div>
        <span v-if="error" class="error-text">{{ error }}</span>
      </div>

      <!-- 快捷选择 -->
      <div class="quick-amounts">
        <button
          v-for="qty in [60, 90, 120, 150, 180]"
          :key="qty"
          class="quick-btn"
          :class="{ active: amount === qty }"
          @click="amount = qty"
        >
          {{ qty }}ml
        </button>
      </div>

      <!-- 确认按钮 -->
      <button class="confirm-btn" @click="handleConfirm" :disabled="!isValid">
        确认记录
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const emit = defineEmits(['recorded'])

const selectedTime = ref(formatDateTimeLocal(new Date()))
const amount = ref(null)
const error = ref('')

// 最大时间：当前时间
const maxTime = computed(() => formatDateTimeLocal(new Date()))

// 最小时间：7天前
const minTime = computed(() => {
  const d = new Date()
  d.setDate(d.getDate() - 7)
  return formatDateTimeLocal(d)
})

// 格式化为 datetime-local 格式
function formatDateTimeLocal(date) {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day}T${hours}:${minutes}`
}

// 验证
const isValid = computed(() => {
  if (!amount.value || amount.value < 1 || amount.value > 500) return false
  const selected = new Date(selectedTime.value)
  const now = new Date()
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  return selected <= now && selected >= sevenDaysAgo
})

function handleConfirm() {
  if (!isValid.value) {
    if (!amount.value || amount.value < 1 || amount.value > 500) {
      error.value = '请输入 1-500 之间的奶量'
      return
    }
    error.value = '请选择有效的时间'
    return
  }

  error.value = ''
  emit('recorded', {
    amount: amount.value,
    timestamp: new Date(selectedTime.value).toISOString()
  })

  // 重置
  amount.value = null
  selectedTime.value = formatDateTimeLocal(new Date())
}
</script>

<style scoped>
.feeding-record {
  width: 100%;
}

.record-card {
  padding: 20px;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 20px;
  text-align: center;
}

.field {
  margin-bottom: 16px;
}

.field-label {
  display: block;
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.time-input,
.amount-input {
  width: 100%;
  padding: 12px;
  border: 1px solid rgba(233, 30, 99, 0.2);
  border-radius: 10px;
  font-size: 16px;
  background-color: var(--card);
  color: var(--text-primary);
  box-sizing: border-box;
}

.time-input:focus,
.amount-input:focus {
  outline: none;
  border-color: var(--primary);
}

.amount-input-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.amount-input {
  flex: 1;
}

.unit {
  font-size: 14px;
  color: var(--text-secondary);
}

.error-text {
  font-size: 12px;
  color: var(--error);
  margin-top: 4px;
  display: block;
}

.quick-amounts {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.quick-btn {
  flex: 1;
  min-width: 60px;
  padding: 10px;
  border: 1px solid rgba(233, 30, 99, 0.3);
  border-radius: 8px;
  background-color: var(--card);
  color: var(--text-primary);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.quick-btn.active {
  background-color: var(--primary);
  color: white;
  border-color: var(--primary);
}

.confirm-btn {
  width: 100%;
  padding: 14px;
  background-color: var(--primary);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}

.confirm-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>