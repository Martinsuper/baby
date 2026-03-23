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

## 边界情况处理

### 模式切换行为

- **数据保留**：切换模式时，两种模式的数据各自保留，互不影响
- **提醒暂停**：切换到胎动模式时，喂奶提醒自动暂停；切换回来后恢复
- **提醒重算**：切换回喂奶模式时，根据最后一次喂奶时间重新计算是否需要提醒

### 空状态展示

- **首页无记录**：显示引导文案"还没有喂奶记录，开始记录第一次喂奶吧"
- **记录页无记录**：显示"暂无记录"
- **统计页无记录**：所有数值显示为 0
- **上次喂奶信息**：无记录时显示"—"

### 输入验证

- **奶量范围**：1-500 毫升，超出范围显示错误提示
- **禁止 0 和负数**：奶量必须大于 0
- **时间限制**：只能选择当前时间或过去的时间，不能选择未来时间
- **可补记**：允许记录过去几天的时间（最多 7 天前）

### 记录管理

- **删除功能**：支持删除记录（长按或滑动删除）
- **编辑功能**：暂不支持编辑，可删除后重新记录
- **删除后提醒重算**：删除记录后，基于最新的喂奶记录重新计算提醒时间

### 提醒边界情况

- **首次使用**：无喂奶记录时，不触发提醒，显示引导文案
- **弹窗中记录喂奶**：记录后自动关闭提醒弹窗
- **忽略提醒**：用户关闭弹窗后，每 30 分钟再次提醒（直到用户记录喂奶）
- **应用关闭期间**：不使用后台提醒，仅在应用打开时检查并提醒

### 统计计算规则

- **日均奶量**：所选时间范围内的总奶量 ÷ 有记录的天数（不包括无记录的日期）
- **今日总奶量**：始终显示今日数据，与时间范围选择器无关
- **时间范围选择器**：影响"总次数"和"日均奶量"的计算范围

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
- 两个按钮："稍后提醒"（30分钟后）和"记录喂奶"

### 提醒持久化策略

- 不在 localStorage 存储提醒时间
- 每次应用打开时，根据最后一次喂奶记录实时计算是否需要提醒
- 计算公式：当前时间 - 最后喂奶时间 > intervalHours

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