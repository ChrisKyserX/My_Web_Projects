<!--
 * @FilePath: src/views/CreatePostView.vue
 * @Author: chiwan
 * @Date: 2026-04-10
 * @Description: 发布帖子页面
 * @LastEditTime: 2026-04-10
-->

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const title = ref('')
const content = ref('')
const category = ref('')
const tags = ref('')

const categories = [
  { value: 'tech', label: '技术讨论' },
  { value: 'life', label: '生活闲聊' },
  { value: 'help', label: '问题求助' },
  { value: 'share', label: '资源分享' },
]

const handleSubmit = () => {
  // [ADD] 2026-04-10 chiwan: 实现帖子发布逻辑
  console.log('发布帖子:', { title, content, category, tags })
  router.push('/')
}
</script>

<template>
  <div class="create-post">
    <h1>发布新帖子</h1>
    <form @submit.prevent="handleSubmit" class="post-form">
      <div class="form-group">
        <label>标题</label>
        <input v-model="title" type="text" placeholder="请输入帖子标题" required>
      </div>

      <div class="form-group">
        <label>分类</label>
        <select v-model="category" required>
          <option value="">请选择分类</option>
          <option v-for="cat in categories" :key="cat.value" :value="cat.value">
            {{ cat.label }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label>标签</label>
        <input v-model="tags" type="text" placeholder="多个标签用逗号分隔">
      </div>

      <div class="form-group">
        <label>内容</label>
        <textarea v-model="content" rows="10" placeholder="请输入帖子内容" required></textarea>
      </div>

      <div class="form-actions">
        <button type="submit" class="btn-primary">发布</button>
        <button type="button" class="btn-secondary" @click="router.back()">取消</button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.create-post {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.post-form {
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
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #d0d0d0;
  border-radius: 4px;
  font-size: 14px;
}

.form-group textarea {
  resize: vertical;
  min-height: 200px;
}

.form-actions {
  display: flex;
  gap: 12px;
}

.btn-primary,
.btn-secondary {
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.btn-primary {
  background: #409eff;
  color: white;
}

.btn-primary:hover {
  background: #66b1ff;
}

.btn-secondary {
  background: #f0f0f0;
  color: #666;
}

.btn-secondary:hover {
  background: #e0e0e0;
}
</style>
