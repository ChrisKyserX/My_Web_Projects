<!--
 * @FilePath: src/views/user/SettingsView.vue
 * @Author: chiwan
 * @Date: 2026-04-10
 * @Description: 账号设置页面
 * @LastEditTime: 2026-04-10
-->

<script setup lang="ts">
import { ref } from 'vue'

const passwordForm = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const handleChangePassword = () => {
  // [ADD] 2026-04-10 chiwan: 实现修改密码逻辑
  console.log('修改密码:', passwordForm.value)
}
</script>

<template>
  <div class="settings-view">
    <h1>账号设置</h1>

    <section class="settings-section">
      <h2>修改密码</h2>
      <form @submit.prevent="handleChangePassword" class="settings-form">
        <div class="form-group">
          <label>当前密码</label>
          <input v-model="passwordForm.oldPassword" type="password" required>
        </div>

        <div class="form-group">
          <label>新密码</label>
          <input v-model="passwordForm.newPassword" type="password" required>
        </div>

        <div class="form-group">
          <label>确认新密码</label>
          <input v-model="passwordForm.confirmPassword" type="password" required>
        </div>

        <button type="submit" class="btn-primary">修改密码</button>
      </form>
    </section>
  </div>
</template>

<style scoped>
.settings-view {
  padding: 20px;
}

.settings-section {
  max-width: 500px;
  margin-top: 24px;
  padding: 24px;
  background: #f5f5f5;
  border-radius: 8px;
}

.settings-section h2 {
  margin-top: 0;
  margin-bottom: 20px;
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
  padding: 12px 24px;
  background: #409eff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-primary:hover {
  background: #66b1ff;
}
</style>
