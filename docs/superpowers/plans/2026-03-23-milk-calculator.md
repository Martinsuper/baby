# 奶量计算器输入组件实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 创建底部弹出式奶量计算器组件，替代普通数字输入框，提升移动端输入体验。

**Architecture:** 新建 `MilkCalculator.vue` 组件实现计算器面板，修改 `feeding-record.vue` 集成计算器并管理历史记录。使用 localStorage 持久化历史记录。

**Tech Stack:** Vue 3 Composition API, CSS动画, localStorage

---

## 文件结构

| 文件 | 操作 | 职责 |
|------|------|------|
| `components/milk-calculator.vue` | 创建 | 计算器面板组件 |
| `components/feeding-record.vue` | 修改 | 集成计算器，管理历史记录 |

---

### Task 1: 创建 MilkCalculator 组件基础结构

**Files:**
- Create: `components/milk-calculator.vue`

- [ ] **Step 1: 创建组件文件和基础模板**

创建 `components/milk-calculator.vue`:

```vue
<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="visible" class="calculator-overlay" @click.self="handleClose">
        <Transition name="slide-up">
          <div v-if="visible" class="calculator-panel">
            <!-- 头部 -->
            <div class="calculator-header">
              <span class="title">输入奶量</span>
            </div>

            <!-- 显示区域 -->
            <div class="calculator-display">
              <span class="display-value">{{ displayValue }}</span>
              <span class="display-unit">ml</span>
            </div>

            <!-- 历史记录 -->
            <div v-if="history.length > 0" class="calculator-history">
              <button
                v-for="item in history"
                :key="item"
                class="history-item"
                @click="selectHistory(item)"
              >
                {{ item }}ml
              </button>
            </div>

            <!-- 数字键盘 -->
            <div class="calculator-keypad">
              <button
                v-for="key in keypadLayout"
                :key="key.label"
                class="key"
                :class="key.class"
                @click="handleKeyPress(key)"
              >
                {{ key.label }}
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  modelValue: {
    type: Number,
    default: null
  },
  history: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue', 'update:visible', 'confirm'])

// 键盘布局
const keypadLayout = [
  { label: '1', value: 1, class: 'number' },
  { label: '2', value: 2, class: 'number' },
  { label: '3', value: 3, class: 'number' },
  { label: '4', value: 4, class: 'number' },
  { label: '5', value: 5, class: 'number' },
  { label: '6', value: 6, class: 'number' },
  { label: '7', value: 7, class: 'number' },
  { label: '8', value: 8, class: 'number' },
  { label: '9', value: 9, class: 'number' },
  { label: '←', value: 'delete', class: 'action' },
  { label: '0', value: 0, class: 'number' },
  { label: '✓', value: 'confirm', class: 'confirm' }
]

// 显示值
const displayValue = computed(() => {
  return props.modelValue !== null ? props.modelValue : '0'
})

// 处理按键
function handleKeyPress(key) {
  if (key.value === 'delete') {
    handleDelete()
  } else if (key.value === 'confirm') {
    handleConfirm()
  } else {
    handleNumber(key.value)
  }
}

// 输入数字
function handleNumber(num) {
  const current = props.modelValue !== null ? String(props.modelValue) : ''

  // 首位为0时，直接替换
  if (current === '0' && num === 0) {
    return
  }
  if (current === '0' && num !== 0) {
    emit('update:modelValue', num)
    return
  }

  // 追加数字，限制最大500
  const newValue = parseInt(current + num, 10)
  emit('update:modelValue', Math.min(newValue, 500))
}

// 删除
function handleDelete() {
  if (props.modelValue === null) return

  const current = String(props.modelValue)
  if (current.length <= 1) {
    emit('update:modelValue', null)
  } else {
    emit('update:modelValue', parseInt(current.slice(0, -1), 10))
  }
}

// 确认
function handleConfirm() {
  if (props.modelValue === null || props.modelValue < 1) return
  emit('confirm', props.modelValue)
}

// 选择历史记录
function selectHistory(value) {
  emit('update:modelValue', value)
}

// 关闭
function handleClose() {
  emit('update:visible', false)
}
</script>

<style scoped>
.calculator-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1001;
  display: flex;
  align-items: flex-end;
}

.calculator-panel {
  width: 100%;
  background-color: white;
  border-radius: 24px 24px 0 0;
  padding: 20px;
  padding-bottom: calc(20px + env(safe-area-inset-bottom));
}

.calculator-header {
  text-align: center;
  margin-bottom: 20px;
}

.calculator-header .title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.calculator-display {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 4px;
  padding: 20px;
  margin-bottom: 16px;
}

.display-value {
  font-size: 48px;
  font-weight: 700;
  color: var(--text-primary);
}

.display-unit {
  font-size: 20px;
  color: var(--text-secondary);
}

.calculator-history {
  display: flex;
  gap: 8px;
  justify-content: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.history-item {
  padding: 8px 16px;
  background-color: var(--card-secondary);
  border: 1px solid rgba(233, 30, 99, 0.2);
  border-radius: 20px;
  font-size: 14px;
  color: var(--primary);
  cursor: pointer;
  transition: all 0.2s;
}

.history-item:active {
  background-color: var(--primary);
  color: white;
}

.calculator-keypad {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.key {
  height: 60px;
  border: none;
  border-radius: 12px;
  font-size: 24px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
}

.key.number {
  background-color: #f5f5f5;
  color: var(--text-primary);
}

.key.number:active {
  background-color: #e0e0e0;
}

.key.action {
  background-color: #f5f5f5;
  color: var(--text-secondary);
}

.key.action:active {
  background-color: #e0e0e0;
}

.key.confirm {
  background-color: var(--primary);
  color: white;
}

.key.confirm:active {
  background-color: var(--primary-dark);
}

/* 动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
}
</style>
```

- [ ] **Step 2: 验证组件文件创建成功**

运行: `ls -la /Users/duanluyao/code/web/baby/components/milk-calculator.vue`
预期: 文件存在

---

### Task 2: 修改 feeding-record.vue 集成计算器

**Files:**
- Modify: `components/feeding-record.vue`

- [ ] **Step 1: 修改模板部分**

将 `components/feeding-record.vue` 的模板修改为:

```vue
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
```

- [ ] **Step 2: 修改脚本部分**

将 `<script setup>` 部分修改为:

```vue
<script setup>
import { ref, computed, watch } from 'vue'
import MilkCalculator from '@/components/milk-calculator.vue'
import Icon from '@/components/icon.vue'

const emit = defineEmits(['recorded'])

const selectedTime = ref(formatDateTimeLocal(new Date()))
const amount = ref(null)
const showCalculator = ref(false)

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
  selectedTime.value = formatDateTimeLocal(new Date())
}
</script>
```

- [ ] **Step 3: 修改样式部分**

将 `<style scoped>` 部分修改为:

```vue
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
```

- [ ] **Step 4: 提交代码**

```bash
git add components/milk-calculator.vue components/feeding-record.vue
git commit -m "$(cat <<'EOF'
feat: 添加奶量计算器输入组件

- 新增 MilkCalculator 底部弹出式计算器组件
- 数字键盘输入，支持删除和确认
- 历史记录快速选择（最近3条）
- 输入限制最大500ml
- 修改 feeding-record 集成计算器
- localStorage 持久化历史记录

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

---

### Task 3: 添加 Icon 组件的 calculator 图标

**Files:**
- Modify: `components/icon.vue`

- [ ] **Step 1: 导入 Calculator 图标**

在 `components/icon.vue` 的 import 语句中添加 `Calculator`:

```javascript
import {
  Home,
  Hand,
  // ... 其他图标
  Pointer,
  Droplet,
  Calculator
} from 'lucide-vue-next'
```

- [ ] **Step 2: 添加图标映射**

在 `iconMap` 对象中添加:

```javascript
const iconMap = {
  // ... 其他映射
  pointer: Pointer,
  droplet: Droplet,
  calculator: Calculator
}
```

- [ ] **Step 3: 提交代码**

```bash
git add components/icon.vue
git commit -m "$(cat <<'EOF'
feat(icon): 添加 calculator 图标

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

---

### Task 4: 验证功能

- [ ] **Step 1: 启动开发服务器**

运行: `cd /Users/duanluyao/code/web/baby && npm run dev`
预期: 服务器启动成功

- [ ] **Step 2: 手动测试功能**

在浏览器中测试:
1. 进入记录页面
2. 点击奶量输入区域，弹出计算器
3. 输入数字，验证显示正确
4. 测试删除功能
5. 测试确认功能
6. 验证历史记录保存和显示
7. 点击遮罩关闭计算器

- [ ] **Step 3: 构建验证**

运行: `cd /Users/duanluyao/code/web/baby && npm run build`
预期: 构建成功无错误