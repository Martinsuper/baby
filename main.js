import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHashHistory } from 'vue-router'
import App from './App.vue'

// 导入页面
import Home from './pages/index/index.vue'
import Record from './pages/record/index.vue'
import Statistics from './pages/statistics/index.vue'
import Diary from './pages/diary/index.vue'
import DiaryDetail from './pages/diary/detail.vue'
import DiaryEditor from './pages/diary/editor.vue'
import Settings from './pages/settings/index.vue'
import PregnancySetup from './pages/settings/pregnancy-setup.vue'
import ReminderSetup from './pages/settings/reminder-setup.vue'

// 路由配置
const routes = [
  { path: '/', component: Home },
  { path: '/record', component: Record },
  { path: '/statistics', component: Statistics },
  { path: '/diary', component: Diary },
  { path: '/diary/detail/:id', component: DiaryDetail },
  { path: '/diary/editor/:id?', component: DiaryEditor },
  { path: '/settings', component: Settings },
  { path: '/settings/pregnancy', component: PregnancySetup },
  { path: '/settings/reminder', component: ReminderSetup }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.mount('#app')