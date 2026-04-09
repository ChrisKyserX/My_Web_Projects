<!--
 * @FilePath: src/views/auth/ForgotPasswordView.vue
 * @Author: chiwan
 * @Date: 2026-04-10
 * @Description: 忘记密码页面
 * @LastEditTime: 2026-04-10
-->

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const email = ref('')
const submitted = ref(false)

const handleSubmit = () => {
  // [ADD] 2026-04-10 chiwan: 实现发送重置密码邮件逻辑
  console.log('发送重置密码邮件到:', email.value)
  submitted.value = true
}
</script>

<template>
  <div class="forgot-password-view">
    <div class="forgot-box">
      <h1>忘记密码</h1>

      <div v-if="!submitted" class="form-container">
        <p class="description">请输入您的邮箱，我们将发送重置密码链接给您。</p>
        <form @submit.prevent="handleSubmit" class="forgot-form">
          <div class="form-group">
            <input v-model="email" type="email" placeholder="请输入邮箱" required>
          </div>

          <button type="submit" class="btn-primary">发送重置链接</button>

          <p class="back-link">
            <router-link to="/login">返回登录</router-link>
          </p>
        </form>
      </div>

      <div v-else class="success-message">
        <p>重置密码链接已发送到您的邮箱，请查收。</p>
        <button class="btn-primary" @click="router.push('/login')">返回登录</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.forgot-password-view {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
}

.forgot-box {
  width: 100%;
  max-width: 400px;
  padding: 40px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.forgot-box h1 {
  text-align: center;
  margin-bottom: 24px;
}

.description {
  text-align: center;
  color: #666;
  margin-bottom: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group input {
  width: 100%;
  padding: 12px;
  border: 1px solid #d0d0d0;
  border-radius: 4px;
  font-size: 14px;
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

.back-link {
  text-align: center;
  margin-top: 20px;
}

.back-link a {
  color: #409eff;
  text-decoration: none;
}

.success-message {
  text-align: center;
}

.success-message p {
  color: #67c23a;
  margin-bottom: 24px;
}
</style>
