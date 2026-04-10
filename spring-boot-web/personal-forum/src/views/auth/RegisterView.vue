<!--
 * @FilePath: src/views/auth/RegisterView.vue
 * @Author: chiwan
 * @Date: 2026-04-10
 * @Description: 注册页面
 * @LastEditTime: 2026-04-10
-->
<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { registerUser } from '@/api/user'

const router = useRouter()

const form = ref({
  account: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const errorMsg = ref('')

const handleRegister = async () => {
  // [ADD] 2026-04-10 chiwan: 实现注册逻辑
  errorMsg.value = ''

  if (form.value.password !== form.value.confirmPassword) {
    errorMsg.value = '两次输入的密码不一致'
    return
  }

  try {
    await registerUser({
      account: form.value.account,
      password: form.value.password,
      email: form.value.email || undefined,
    })
    router.push('/login')
  } catch (error: any) {
    console.log('error',error);
    
    errorMsg.value = error.message || '注册失败'
  }
}
</script>

<template>
  <div class="register-view">
    <div class="register-box">
      <h1>注册</h1>
      <form @submit.prevent="handleRegister" class="register-form">
        <div class="form-group">
          <label>账号 <span class="required">*</span></label>
          <input v-model="form.account" type="text" placeholder="请输入账号" required>
        </div>

        <div class="form-group">
          <label>邮箱</label>
          <input v-model="form.email" type="email" placeholder="请输入邮箱（选填）">
        </div>

        <div class="form-group">
          <label>密码 <span class="required">*</span></label>
          <input v-model="form.password" type="password" placeholder="请输入密码" required>
        </div>

        <div class="form-group">
          <label>确认密码 <span class="required">*</span></label>
          <input v-model="form.confirmPassword" type="password" placeholder="请再次输入密码" required>
        </div>

        <p v-if="errorMsg" class="error-msg">{{ errorMsg }}</p>

        <button type="submit" class="btn-primary">注册</button>

        <p class="login-link">
          已有账号? <router-link to="/login">立即登录</router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<style scoped>
.register-view {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
}

.register-box {
  width: 100%;
  max-width: 400px;
  padding: 40px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.register-box h1 {
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

.login-link {
  text-align: center;
  margin-top: 20px;
  color: #666;
}

.login-link a {
  color: #409eff;
  text-decoration: none;
}

.required {
  color: #f56c6c;
}

.error-msg {
  color: #f56c6c;
  text-align: center;
  margin-bottom: 16px;
  font-size: 14px;
}
</style>
