<!--
 * @FilePath: src/views/auth/LoginView.vue
 * @Author: chiwan
 * @Date: 2026-04-10
 * @Description: 登录页面
 * @LastEditTime: 2026-04-10
-->

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const form = ref({
  email: '',
  password: '',
  remember: false,
})

const handleLogin = async () => {
  // [ADD] 2026-04-10 chiwan: 实现登录逻辑
  await userStore.login(form.value.email, form.value.password)
  const redirect = route.query.redirect as string
  router.push(redirect || '/')
}
</script>

<template>
  <div class="login-view">
    <div class="login-box">
      <h1>登录</h1>
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label>邮箱</label>
          <input v-model="form.email" type="email" placeholder="请输入邮箱" required>
        </div>

        <div class="form-group">
          <label>密码</label>
          <input v-model="form.password" type="password" placeholder="请输入密码" required>
        </div>

        <div class="form-options">
          <label class="remember">
            <input v-model="form.remember" type="checkbox">
            <span>记住我</span>
          </label>
          <router-link to="/forgot-password">忘记密码?</router-link>
        </div>

        <button type="submit" class="btn-primary">登录</button>

        <p class="register-link">
          还没有账号? <router-link to="/register">立即注册</router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<style scoped>
.login-view {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
}

.login-box {
  width: 100%;
  max-width: 400px;
  padding: 40px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.login-box h1 {
  text-align: center;
  margin-bottom: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
}

.form-group input {
  width: 100%;
  padding: 12px;
  border: 1px solid #d0d0d0;
  border-radius: 4px;
  font-size: 14px;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.remember {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
}

.form-options a {
  color: #409eff;
  text-decoration: none;
}

.btn-primary {
  width: 100%;
  padding: 12px;
  background: #409eff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.btn-primary:hover {
  background: #66b1ff;
}

.register-link {
  text-align: center;
  margin-top: 20px;
  color: #666;
}

.register-link a {
  color: #409eff;
  text-decoration: none;
}
</style>
