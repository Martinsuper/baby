// 主题颜色定义 - 迁移自 Color+Theme.swift

export const themeColors = {
  // 主色调 (Cyan Theme - 清新干净)
  primary: '#0891B2',
  primaryLight: '#22D3EE',
  primaryDark: '#0E7490',

  // 次要颜色
  secondary: '#67E8F9',
  accent: '#06B6D4',

  // 背景颜色 (柔和干净)
  background: '#F0FDFA',
  card: '#FFFFFF',
  cardSecondary: '#ECFEFF',

  // 文字颜色 (高对比度)
  textPrimary: '#164E63',
  textSecondary: '#0E7490',
  textTertiary: '#67E8F9',

  // 状态颜色
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',

  // 心情颜色
  moodGreat: '#10B981',
  moodGood: '#34D399',
  moodNormal: '#FBBF24',
  moodBad: '#FB923C',
  moodTerrible: '#F87171'
}

// 渐变配置
export const gradients = {
  primary: {
    colors: ['#0891B2', '#22D3EE'],
    direction: 'to right'
  }
}

export default themeColors