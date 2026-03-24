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

      <!-- 奶量输入 - 点击弹出计算器 -->
      <div class="field">
        <label class="field-label">奶量 (毫升)</label>
        <div class="amount-trigger" @click="showCalculator = true">
          <span class="amount-value" :class="{ placeholder: !amount }">
            {{ amount || '请输入奶量' }}
          </span>
          <span v-if="amount" class="unit">ml</span>
          <Icon name="calculator" :size="20" class="trigger-icon" />
        </div>
      </div>

      <!-- 确认按钮 -->
      <button class="confirm-btn" @click="handleConfirm" :disabled="!isValid">
        确认记录
      </button>
    </div>

    <!-- 计算器组件 -->
    <MilkCalculator
      v-model="amount"
      v-model:visible="showCalculator"
      :history="amountHistory"
      @confirm="handleCalculatorConfirm"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import MilkCalculator from '@/components/milk-calculator.vue'
import Icon from '@/components/icon.vue'

const emit = defineEmits(['recorded'])

const selectedTime = ref(formatDateTimeLocal(new Date()))
const amount = ref(null)
const showCalculator = ref(false)

// 刷新时间为当前时间
function refreshTime() {
  selectedTime.value = formatDateTimeLocal(new Date())
}

// 每次组件挂载时刷新时间
onMounted(() => {
  refreshTime()
})

// 历史记录 - 从 localStorage 加载
const amountHistory = ref([])

// 初始化历史记录
function loadHistory() {
  try {
    const saved = localStorage.getItem('milkAmountHistory')
    if (saved) {
      amountHistory.value = JSON.parse(saved)
    }
  } catch (e) {
    console.error('Failed to load milk amount history:', e)
  }
}

// 保存历史记录
function saveHistory(value) {
  if (!value || value < 1) return

  // 移除重复值，添加到头部
  const filtered = amountHistory.value.filter(v => v !== value)
  const newHistory = [value, ...filtered].slice(0, 3)
  amountHistory.value = newHistory

  try {
    localStorage.setItem('milkAmountHistory', JSON.stringify(newHistory))
  } catch (e) {
    console.error('Failed to save milk amount history:', e)
  }
}

// 页面加载时读取历史记录
loadHistory()

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

// 计算器确认
function handleCalculatorConfirm(value) {
  showCalculator.value = false
}

// 表单确认
function handleConfirm() {
  if (!isValid.value) return

  // 保存历史记录
  saveHistory(amount.value)

  emit('recorded', {
    amount: amount.value,
    timestamp: new Date(selectedTime.value).toISOString()
  })

  // 重置
  amount.value = null
  refreshTime()
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

.time-input {
  width: 100%;
  padding: 12px;
  border: 1px solid rgba(233, 30, 99, 0.2);
  border-radius: 10px;
  font-size: 16px;
  background-color: var(--card);
  color: var(--text-primary);
  box-sizing: border-box;
}

.time-input:focus {
  outline: none;
  border-color: var(--primary);
}

/* 奶量触发器样式 */
.amount-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  border: 1px solid rgba(233, 30, 99, 0.2);
  border-radius: 10px;
  background-color: var(--card);
  cursor: pointer;
  transition: all 0.2s;
}

.amount-trigger:active {
  background-color: var(--card-secondary);
}

.amount-value {
  font-size: 16px;
  color: var(--text-primary);
}

.amount-value.placeholder {
  color: #999;
}

.unit {
  font-size: 14px;
  color: var(--text-secondary);
  margin-left: 4px;
}

.trigger-icon {
  color: var(--text-secondary);
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
  margin-top: 8px;
}

.confirm-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
