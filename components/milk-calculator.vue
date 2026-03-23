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
                v-for="(item, index) in history"
                :key="'history-' + index"
                type="button"
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
                type="button"
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
