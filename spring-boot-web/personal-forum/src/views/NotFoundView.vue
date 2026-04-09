<!--
 * @FilePath: src/views/NotFoundView.vue
 * @Author: chiwan
 * @Date: 2026-04-10
 * @Description: 404 页面未找到
 * @LastEditTime: 2026-04-10
-->

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div class="not-found">
    <div class="not-found-content">
      <h1>404</h1>
      <p>页面未找到</p>
      <button class="btn-primary" @click="router.push('/')">返回首页</button>
    </div>
  </div>
</template>

<style scoped>
.not-found {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
}

.not-found-content {
  text-align: center;
}

.not-found-content h1 {
  font-size: 120px;
  color: #409eff;
  margin: 0;
}

.not-found-content p {
  font-size: 24px;
  color: #666;
  margin: 16px 0 32px;
}

.btn-primary {
  padding: 12px 32px;
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
</style>
