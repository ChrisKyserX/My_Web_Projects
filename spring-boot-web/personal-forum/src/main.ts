/**
 * @FilePath: src/main.ts
 * @Author: chiwan
 * @Date: 2026-04-09
 * @Description: 应用入口文件，配置Vue3、Pinia、Router和Element Plus
 * @LastEditTime: 2026-04-10
 */

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'

import App from './App.vue'
import router from './router'
import './styles/index.css'

// [REF] 2026-04-10 chiwan: 简化应用初始化，用户信息获取移到路由守卫
const app = createApp(App)

// 注册所有Element Plus图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(createPinia())
app.use(router)
app.use(ElementPlus)
app.mount('#app')
