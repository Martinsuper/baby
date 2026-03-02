// Pinia store 入口文件

import { createPinia } from 'pinia'

const pinia = createPinia()

export default pinia

export * from './pregnancy'
export * from './movements'
export * from './diary'
export * from './reminders'