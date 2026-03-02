// 孕期计算工具 - 迁移自 PregnancyProfile.swift

import { daysBetween } from './date'

/**
 * 计算孕周
 * @param {Date|string} dueDate - 预产期
 * @returns {{weeks: number, days: number}}
 */
export function calculatePregnancyWeeks(dueDate) {
  const today = new Date()
  const due = new Date(dueDate)
  const totalDays = daysBetween(today, due)

  // 孕期正常为 40 周 (280 天)
  const pregnancyDays = 280 - totalDays
  const weeks = Math.max(0, Math.floor(pregnancyDays / 7))
  const days = Math.max(0, pregnancyDays % 7)

  return { weeks, days }
}

/**
 * 计算距离预产期的天数
 * @param {Date|string} dueDate - 预产期
 * @returns {number}
 */
export function calculateDaysRemaining(dueDate) {
  return Math.max(0, daysBetween(new Date(), dueDate))
}

/**
 * 计算预产期进度百分比
 * @param {Date|string} dueDate - 预产期
 * @returns {number} 0-1 之间的数值
 */
export function calculateProgressPercentage(dueDate) {
  const totalDays = 280
  const daysRemaining = calculateDaysRemaining(dueDate)
  const daysPassed = totalDays - daysRemaining
  return Math.min(1, Math.max(0, daysPassed / totalDays))
}

/**
 * 获取当前孕期
 * @param {Date|string} dueDate - 预产期
 * @returns {number} 1, 2, 或 3
 */
export function calculateTrimester(dueDate) {
  const { weeks } = calculatePregnancyWeeks(dueDate)
  if (weeks < 13) return 1
  if (weeks < 27) return 2
  return 3
}

/**
 * 宝宝发育信息数据
 */
const babyDevelopmentData = {
  '0-4': {
    size: '罂粟籽',
    description: '胚胎正在发育',
    milestones: ['神经系统开始形成', '心脏开始跳动']
  },
  '5-8': {
    size: '覆盆子',
    description: '主要器官正在发育',
    milestones: ['面部特征开始显现', '手臂和腿部开始发育']
  },
  '9-12': {
    size: '柠檬',
    description: '进入胎儿期',
    milestones: ['可以听到心跳', '开始有动作']
  },
  '13-16': {
    size: '苹果',
    description: '进入孕中期',
    milestones: ['可能感受到胎动', '骨骼正在硬化']
  },
  '17-20': {
    size: '香蕉',
    description: '宝宝快速成长',
    milestones: ['听觉发育良好', '可以吞咽']
  },
  '21-24': {
    size: '玉米',
    description: '体重快速增长',
    milestones: ['眉毛和睫毛出现', '皮肤开始变得不透明']
  },
  '25-28': {
    size: '椰子',
    description: '进入孕晚期',
    milestones: ['眼睛可以睁开', '有规律的睡眠周期']
  },
  '29-32': {
    size: '南瓜',
    description: '肺部发育完善',
    milestones: ['头部开始下降', '胎动更频繁']
  },
  '33-36': {
    size: '哈密瓜',
    description: '准备出生',
    milestones: ['胎毛脱落', '指甲长到指尖']
  },
  '37-40': {
    size: '西瓜',
    description: '足月',
    milestones: ['器官发育完成', '准备与妈妈见面']
  }
}

/**
 * 获取宝宝发育信息
 * @param {number} weeks - 孕周
 * @returns {{size: string, description: string, milestones: string[]}}
 */
export function getBabyDevelopmentInfo(weeks) {
  for (const [range, info] of Object.entries(babyDevelopmentData)) {
    const [min, max] = range.split('-').map(Number)
    if (weeks >= min && weeks <= max) {
      return { week: weeks, ...info }
    }
  }
  return {
    week: weeks,
    size: '西瓜',
    description: '即将与宝宝见面',
    milestones: ['宝宝已经准备好了']
  }
}

/**
 * 格式化孕周显示
 * @param {{weeks: number, days: number}} progress
 * @returns {string}
 */
export function formatPregnancyProgress(progress) {
  return `孕${progress.weeks}周${progress.days}天`
}

export default {
  calculatePregnancyWeeks,
  calculateDaysRemaining,
  calculateProgressPercentage,
  calculateTrimester,
  getBabyDevelopmentInfo,
  formatPregnancyProgress
}