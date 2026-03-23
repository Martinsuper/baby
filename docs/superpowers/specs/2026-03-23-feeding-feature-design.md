# 婴儿喂奶统计功能设计文档

## 概述

在现有胎动记录应用基础上，新增婴儿喂奶统计功能，支持两种模式的切换。

## 需求摘要

- 支持胎动模式和喂奶模式切换
- 喂奶记录：时间 + 奶量（毫升）
- 提醒功能：基于上次喂奶时间，超过间隔后提醒
- 间隔时间用户可配置（1-6小时）
- 统计：今日次数、今日总奶量、日均奶量

## 数据模型

### 喂奶记录

```typescript
interface FeedingRecord {
  id: string
  timestamp: string      // ISO 时间
  amount: number         // 奶量（毫升）
}
```

### 喂奶提醒设置

```typescript
interface FeedingReminderSettings {
  isEnabled: boolean
  intervalHours: number  // 提醒间隔（小时），默认3，范围1-6
}
```

### 模式设置

```typescript
type AppMode = 'movement' | 'feeding'

interface AppSettings {
  currentMode: AppMode   // 当前模式，默认 'movement'
}
```

## 页面设计

### 设置页模式切换

在设置页添加"宝宝模式"切换开关：
- 胎动模式：显示孕期相关设置
- 喂奶模式：显示喂奶提醒设置

切换模式后，首页、记录页、统计页内容随之变化。

### 首页

**喂奶模式下显示：**
- 今日喂奶统计卡片：次数、总奶量
- 上次喂奶信息：时间、奶量
- 下次提醒倒计时（如启用提醒）

### 记录页

**喂奶模式下显示：**
- 时间选择器：选择喂奶时间（默认当前时间）
- 奶量输入：数字输入框（毫升）
- 确认记录按钮
- 今日记录列表

### 统计页

**喂奶模式下显示：**
- 时间范围选择器：近7天/近30天
- 汇总卡片：
  - 总次数
  - 今日总奶量
  - 日均奶量

## 提醒机制

### 触发逻辑

1. 记录喂奶后，计算下次提醒时间 = 当前时间 + intervalHours
2. 应用打开时，检查是否已过提醒时间
3. 若已超时且提醒启用，显示应用内弹窗提醒

### 提醒设置

- 开关：启用/禁用
- 间隔设置：1-6小时可调，默认3小时

### 提醒展示

应用内弹窗显示：
- 标题："该喂奶啦"
- 内容："距离上次喂奶已超过 X 小时"
- 上次喂奶时间和奶量

## 技术实现

### 新增文件

- `store/feeding.js` — 喂奶记录状态管理
- `store/appMode.js` — 应用模式状态管理
- `components/feeding-record.vue` — 喂奶记录输入组件
- `components/feeding-summary-card.vue` — 喂奶汇总卡片

### 修改文件

- `utils/db.js` — 新增喂奶记录和模式设置的存储方法
- `store/reminders.js` — 支持喂奶提醒逻辑
- `pages/settings/index.vue` — 新增模式切换
- `pages/index/index.vue` — 根据模式显示不同内容
- `pages/record/index.vue` — 根据模式显示不同内容
- `pages/statistics/index.vue` — 根据模式显示不同内容

### 存储键

```javascript
const STORAGE_KEYS = {
  // 现有
  PREGNANCY_PROFILE: 'baby_pregnancy_profile',
  FETAL_MOVEMENTS: 'baby_fetal_movements',
  REMINDER_SETTINGS: 'baby_reminder_settings',
  // 新增
  FEEDING_RECORDS: 'baby_feeding_records',
  FEEDING_REMINDER: 'baby_feeding_reminder',
  APP_MODE: 'baby_app_mode'
}
```

## 文件结构

```
store/
  index.js
  movements.js      # 现有
  pregnancy.js      # 现有
  reminders.js      # 修改：支持喂奶提醒
  feeding.js        # 新增
  appMode.js        # 新增

components/
  feeding-record.vue      # 新增
  feeding-summary-card.vue # 新增
  # ... 其他现有组件

pages/
  index/index.vue       # 修改：根据模式显示
  record/index.vue      # 修改：根据模式显示
  statistics/index.vue  # 修改：根据模式显示
  settings/index.vue    # 修改：新增模式切换
```