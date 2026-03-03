// 本地存储工具 - H5 使用 localStorage 模拟数据库操作
// UniApp H5 不支持 SQLite，使用 localStorage 作为替代方案

const STORAGE_KEYS = {
  PREGNANCY_PROFILE: 'baby_pregnancy_profile',
  FETAL_MOVEMENTS: 'baby_fetal_movements',
  REMINDER_SETTINGS: 'baby_reminder_settings'
}

/**
 * 生成唯一 ID
 */
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

/**
 * 获取数据
 */
function getData(key) {
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : null
  } catch (e) {
    console.error('Error reading from localStorage:', e)
    return null
  }
}

/**
 * 保存数据
 */
function setData(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data))
    return true
  } catch (e) {
    console.error('Error writing to localStorage:', e)
    return false
  }
}

// ============ 孕期信息 ============

export function getPregnancyProfile() {
  return getData(STORAGE_KEYS.PREGNANCY_PROFILE)
}

export function savePregnancyProfile(profile) {
  const existingProfile = getPregnancyProfile()
  const updatedProfile = {
    ...profile,
    id: existingProfile?.id || generateId(),
    lastModified: new Date().toISOString()
  }
  setData(STORAGE_KEYS.PREGNANCY_PROFILE, updatedProfile)
  return updatedProfile
}

export function deletePregnancyProfile() {
  localStorage.removeItem(STORAGE_KEYS.PREGNANCY_PROFILE)
}

// ============ 胎动记录 ============

export function getMovements() {
  return getData(STORAGE_KEYS.FETAL_MOVEMENTS) || []
}

export function saveMovement(movement) {
  const movements = getMovements()
  const newMovement = {
    ...movement,
    id: generateId(),
    timestamp: new Date().toISOString()
  }
  movements.push(newMovement)
  setData(STORAGE_KEYS.FETAL_MOVEMENTS, movements)
  return newMovement
}

export function deleteMovement(id) {
  const movements = getMovements()
  const filtered = movements.filter(m => m.id !== id)
  setData(STORAGE_KEYS.FETAL_MOVEMENTS, filtered)
}

export function clearMovements() {
  setData(STORAGE_KEYS.FETAL_MOVEMENTS, [])
}

// ============ 日记 ============

export function getDiaryEntries() {
  return getData(STORAGE_KEYS.DIARY_ENTRIES) || []
}

export function saveDiaryEntry(entry) {
  const entries = getDiaryEntries()
  const now = new Date().toISOString()

  if (entry.id) {
    // 更新现有条目
    const index = entries.findIndex(e => e.id === entry.id)
    if (index !== -1) {
      entries[index] = {
        ...entries[index],
        ...entry,
        lastModified: now
      }
      setData(STORAGE_KEYS.DIARY_ENTRIES, entries)
      return entries[index]
    }
  }

  // 创建新条目
  const newEntry = {
    ...entry,
    id: generateId(),
    createdAt: now,
    lastModified: now
  }
  entries.push(newEntry)
  setData(STORAGE_KEYS.DIARY_ENTRIES, entries)
  return newEntry
}

export function deleteDiaryEntry(id) {
  const entries = getDiaryEntries()
  const filtered = entries.filter(e => e.id !== id)
  setData(STORAGE_KEYS.DIARY_ENTRIES, filtered)
}

// ============ 提醒设置 ============

export function getReminderSettings() {
  const settings = getData(STORAGE_KEYS.REMINDER_SETTINGS)
  if (!settings) {
    // 返回默认设置
    return {
      id: generateId(),
      isEnabled: true,
      reminderTimes: [
        { id: generateId(), hour: 9, minute: 0 },
        { id: generateId(), hour: 15, minute: 0 },
        { id: generateId(), hour: 20, minute: 0 }
      ]
    }
  }
  return settings
}

export function saveReminderSettings(settings) {
  const updatedSettings = {
    ...settings,
    lastModified: new Date().toISOString()
  }
  setData(STORAGE_KEYS.REMINDER_SETTINGS, updatedSettings)
  return updatedSettings
}

export default {
  generateId,
  getPregnancyProfile,
  savePregnancyProfile,
  deletePregnancyProfile,
  getMovements,
  saveMovement,
  deleteMovement,
  clearMovements,
  getDiaryEntries,
  saveDiaryEntry,
  deleteDiaryEntry,
  getReminderSettings,
  saveReminderSettings
}