<template>
  <div class="quick-action-view card">
    <h3 class="title">快捷操作</h3>
    <div class="actions">
      <div v-for="(action, index) in actions" :key="index" class="action-item" @click="handleAction(action)">
        <div class="action-icon" :style="{ backgroundColor: action.color }">
          {{ action.icon }}
        </div>
        <span class="action-label">{{ action.label }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const actions = [
  {
    icon: '👆',
    label: '记录胎动',
    color: '#E91E63',
    page: '/record'
  },
  {
    icon: '📖',
    label: '写日记',
    color: '#EC407A',
    page: '/diary/editor'
  },
  {
    icon: '📊',
    label: '查看统计',
    color: '#81C784',
    page: '/statistics'
  }
]

const handleAction = (action) => {
  router.push(action.page)
}
</script>

<style scoped>
.quick-action-view {
  background-color: var(--card);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 16px;
}

.actions {
  display: flex;
  justify-content: space-between;
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  flex: 1;
  cursor: pointer;
}

.action-icon {
  width: 52px;
  height: 52px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.action-label {
  font-size: 12px;
  color: var(--text-primary);
}
</style>