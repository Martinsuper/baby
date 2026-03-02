<script setup>
import { onMounted } from 'vue'
import { usePregnancyStore } from './store/pregnancy'
import { useMovementsStore } from './store/movements'
import { useDiaryStore } from './store/diary'
import { useRemindersStore } from './store/reminders'
import Icon from './components/icon.vue'

onMounted(() => {
  console.log('App mounted')
  // 初始化数据
  const pregnancyStore = usePregnancyStore()
  const movementsStore = useMovementsStore()
  const diaryStore = useDiaryStore()
  const remindersStore = useRemindersStore()

  // 从本地存储加载数据
  pregnancyStore.loadProfile()
  movementsStore.loadMovements()
  diaryStore.loadEntries()
  remindersStore.loadSettings()
})
</script>

<template>
  <div class="app">
    <nav class="tab-bar">
      <router-link to="/" class="tab-item" active-class="active">
        <Icon name="home" :size="20" />
        <span class="label">首页</span>
      </router-link>
      <router-link to="/record" class="tab-item" active-class="active">
        <Icon name="hand" :size="20" />
        <span class="label">记录</span>
      </router-link>
      <router-link to="/statistics" class="tab-item" active-class="active">
        <Icon name="chart" :size="20" />
        <span class="label">统计</span>
      </router-link>
      <router-link to="/diary" class="tab-item" active-class="active">
        <Icon name="book" :size="20" />
        <span class="label">日记</span>
      </router-link>
      <router-link to="/settings" class="tab-item" active-class="active">
        <Icon name="user" :size="20" />
        <span class="label">我的</span>
      </router-link>
    </nav>
    <main class="content">
      <router-view />
    </main>
  </div>
</template>

<style>
/* 全局样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  background-color: #F0FDFA;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

#app {
  min-height: 100vh;
  background-color: #F0FDFA;
}

/* 主题变量 */
:root {
  --primary: #0891B2;
  --primary-light: #22D3EE;
  --primary-dark: #0E7490;
  --secondary: #67E8F9;
  --accent: #06B6D4;
  --background: #F0FDFA;
  --card: #FFFFFF;
  --card-secondary: #ECFEFF;
  --text-primary: #164E63;
  --text-secondary: #0E7490;
  --text-tertiary: #67E8F9;
  --success: #10B981;
  --warning: #F59E0B;
  --error: #EF4444;
}

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.content {
  flex: 1;
  padding-bottom: 60px;
}

/* Tab Bar */
.tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 56px;
  background-color: white;
  display: flex;
  border-top: 1px solid #eee;
  z-index: 1000;
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  text-decoration: none;
  color: #67E8F9;
  transition: color 0.2s;
}

.tab-item.active {
  color: #0891B2;
}

.tab-item .icon {
  font-size: 20px;
}

.tab-item .label {
  font-size: 12px;
}

/* 通用卡片样式 */
.card {
  background-color: var(--card);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

/* 通用按钮样式 */
.btn-primary {
  background-color: var(--primary);
  color: white;
  border-radius: 12px;
  padding: 14px 32px;
  font-weight: 600;
  text-align: center;
  border: none;
  cursor: pointer;
}
</style>