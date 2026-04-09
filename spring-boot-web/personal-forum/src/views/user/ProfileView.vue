<!--
 * @FilePath: src/views/user/ProfileView.vue
 * @Author: chiwan
 * @Date: 2026-04-10
 * @Description: 个人中心页面
 * @LastEditTime: 2026-04-10
-->

<script setup lang="ts">
import { ref } from 'vue'

const user = ref({
  name: '当前用户',
  email: 'user@example.com',
  bio: '这个人很懒，什么都没有写...',
})

const handleSave = () => {
  // [ADD] 2026-04-10 chiwan: 实现保存用户信息逻辑
  console.log('保存用户信息:', user.value)
}
</script>

<template>
  <div class="profile-view">
    <h1>个人中心</h1>
    <form @submit.prevent="handleSave" class="profile-form">
      <div class="form-group">
        <label>昵称</label>
        <input v-model="user.name" type="text">
      </div>

      <div class="form-group">
        <label>邮箱</label>
        <input v-model="user.email" type="email" disabled>
      </div>

      <div class="form-group">
        <label>简介</label>
        <textarea v-model="user.bio" rows="4"></textarea>
      </div>

      <button type="submit" class="btn-primary">保存修改</button>
    </form>
  </div>
</template>

<style scoped>
.profile-view {
  padding: 20px;
}

.profile-form {
  max-width: 500px;
  margin-top: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #d0d0d0;
  border-radius: 4px;
  font-size: 14px;
}

.form-group input:disabled {
  background: #f5f5f5;
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
