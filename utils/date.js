// 日期处理工具 - 迁移自 Date+Extensions.swift

/**
 * 格式化日期为中文格式
 * @param {Date|string} date
 * @returns {string}
 */
export function formatDate(date) {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = d.getMonth() + 1
  const day = d.getDate()
  return `${year}年${month}月${day}日`
}

/**
 * 格式化时间为短格式
 * @param {Date|string} date
 * @returns {string}
 */
export function formatTime(date) {
  const d = new Date(date)
  const hours = d.getHours().toString().padStart(2, '0')
  const minutes = d.getMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
}

/**
 * 格式化时间（含秒）
 * @param {Date|string} date
 * @returns {string}
 */
export function formatTimeWithSeconds(date) {
  const d = new Date(date)
  const hours = d.getHours().toString().padStart(2, '0')
  const minutes = d.getMinutes().toString().padStart(2, '0')
  const seconds = d.getSeconds().toString().padStart(2, '0')
  return `${hours}:${minutes}:${seconds}`
}

/**
 * 格式化日期时间
 * @param {Date|string} date
 * @returns {string}
 */
export function formatDateTime(date) {
  return `${formatDate(date)} ${formatTime(date)}`
}

/**
 * 获取小时
 * @param {Date|string} date
 * @returns {number}
 */
export function getHour(date) {
  return new Date(date).getHours()
}

/**
 * 获取分钟
 * @param {Date|string} date
 * @returns {number}
 */
export function getMinute(date) {
  return new Date(date).getMinutes()
}

/**
 * 获取一天的起始时间
 * @param {Date|string} date
 * @returns {Date}
 */
export function startOfDay(date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

/**
 * 获取一天的结束时间
 * @param {Date|string} date
 * @returns {Date}
 */
export function endOfDay(date) {
  const d = new Date(date)
  d.setHours(23, 59, 59, 999)
  return d
}

/**
 * 判断是否是今天
 * @param {Date|string} date
 * @returns {boolean}
 */
export function isToday(date) {
  const d = new Date(date)
  const today = new Date()
  return d.getFullYear() === today.getFullYear() &&
         d.getMonth() === today.getMonth() &&
         d.getDate() === today.getDate()
}

/**
 * 判断是否是昨天
 * @param {Date|string} date
 * @returns {boolean}
 */
export function isYesterday(date) {
  const d = new Date(date)
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  return d.getFullYear() === yesterday.getFullYear() &&
         d.getMonth() === yesterday.getMonth() &&
         d.getDate() === yesterday.getDate()
}

/**
 * 判断是否是本周
 * @param {Date|string} date
 * @returns {boolean}
 */
export function isThisWeek(date) {
  const d = new Date(date)
  const today = new Date()
  const startOfWeek = new Date(today)
  startOfWeek.setDate(today.getDate() - today.getDay())
  startOfWeek.setHours(0, 0, 0, 0)
  const endOfWeek = new Date(startOfWeek)
  endOfWeek.setDate(startOfWeek.getDate() + 7)
  return d >= startOfWeek && d < endOfWeek
}

/**
 * 获取时段
 * @param {Date|string} date
 * @returns {{value: string, label: string, icon: string}}
 */
export function getTimePeriod(date) {
  const hour = getHour(date)
  if (hour >= 6 && hour < 12) {
    return { value: 'morning', label: '早上', icon: '🌅' }
  } else if (hour >= 12 && hour < 14) {
    return { value: 'noon', label: '中午', icon: '☀️' }
  } else if (hour >= 14 && hour < 18) {
    return { value: 'afternoon', label: '下午', icon: '🌤️' }
  } else if (hour >= 18 && hour < 22) {
    return { value: 'evening', label: '晚上', icon: '🌇' }
  } else {
    return { value: 'night', label: '深夜', icon: '🌙' }
  }
}

/**
 * 计算两个日期之间的天数
 * @param {Date|string} date1
 * @param {Date|string} date2
 * @returns {number}
 */
export function daysBetween(date1, date2) {
  const d1 = new Date(date1)
  const d2 = new Date(date2)
  const diffTime = Math.abs(d2 - d1)
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

/**
 * 获取相对时间描述
 * @param {Date|string} date
 * @returns {string}
 */
export function getRelativeString(date) {
  if (isToday(date)) {
    return '今天'
  } else if (isYesterday(date)) {
    return '昨天'
  } else if (isThisWeek(date)) {
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    return weekdays[new Date(date).getDay()]
  } else {
    return formatDate(date)
  }
}

/**
 * 格式化持续时间
 * @param {number} seconds - 秒数
 * @returns {string}
 */
export function formatDuration(seconds) {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export default {
  formatDate,
  formatTime,
  formatTimeWithSeconds,
  formatDateTime,
  getHour,
  getMinute,
  startOfDay,
  endOfDay,
  isToday,
  isYesterday,
  isThisWeek,
  getTimePeriod,
  daysBetween,
  getRelativeString,
  formatDuration
}