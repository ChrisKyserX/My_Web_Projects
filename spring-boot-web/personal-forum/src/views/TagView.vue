<!--
 * @FilePath: src/views/TagView.vue
 * @Author: chiwan
 * @Date: 2026-04-10
 * @Description: 标签页面
 * @LastEditTime: 2026-04-10
-->

<script setup lang="ts">
import { ref } from 'vue'

const tags = ref([
  { id: 1, name: 'Vue', count: 45 },
  { id: 2, name: 'JavaScript', count: 67 },
  { id: 3, name: 'TypeScript', count: 32 },
  { id: 4, name: 'Node.js', count: 28 },
  { id: 5, name: 'CSS', count: 19 },
  { id: 6, name: 'HTML', count: 15 },
])
</script>

<template>
  <div class="tag-view">
    <h1>标签</h1>
    <div class="tag-cloud">
      <span v-for="tag in tags" :key="tag.id" class="tag-item">
        {{ tag.name }} ({{ tag.count }})
      </span>
    </div>
  </div>
</template>

<style scoped>
.tag-view {
  padding: 20px;
}

.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 20px;
}

.tag-item {
  padding: 8px 16px;
  background: #f0f0f0;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s;
}

.tag-item:hover {
  background: #409eff;
  color: white;
}
</style>
