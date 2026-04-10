<!--
 * @FilePath: src/views/user/ChangePasswordView.vue
 * @Author: chiwan
 * @Date: 2026-04-10
 * @Description: 修改密码页面
 * @LastEditTime: 2026-04-10
-->

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { changePassword } from '@/api/user'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

// [MODIFY] 2026-04-11 chiwan: 表单数据，原密码改为password适配接口
const form = reactive({
  password: '',
  newPassword: '',
  confirmPassword: ''
})

const loading = ref(false)
const showPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

// [ADD] 2026-04-10 chiwan: 表单验证
const validateForm = (): boolean => {
  if (!form.password) {
    ElMessage.warning('请输入原密码')
    return false
  }
  if (!form.newPassword) {
    ElMessage.warning('请输入新密码')
    return false
  }
  if (form.newPassword.length < 6) {
    ElMessage.warning('新密码长度不能少于6位')
    return false
  }
  if (form.newPassword === form.password) {
    ElMessage.warning('新密码不能与原密码相同')
    return false
  }
  if (!form.confirmPassword) {
    ElMessage.warning('请确认新密码')
    return false
  }
  if (form.newPassword !== form.confirmPassword) {
    ElMessage.warning('两次输入的新密码不一致')
    return false
  }
  return true
}

// [MODIFY] 2026-04-11 chiwan: 处理提交，适配新的接口参数格式
const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  loading.value = true
  try {
    await changePassword({
      userId: userStore.userInfo?.userId,
      password: form.password,
      newPassword: form.newPassword
    })

    ElMessage.success('密码修改成功，请重新登录')

    // [ADD] 2026-04-10 chiwan: 延迟跳转，让用户看到成功提示
    setTimeout(() => {
      router.push('/login')
    }, 1500)
  } catch (error: any) {
    ElMessage.error(error.message || '密码修改失败')
  } finally {
    loading.value = false
  }
}

// [ADD] 2026-04-10 chiwan: 返回个人中心
const goBack = () => {
  router.back()
}
</script>

<template>
  <div class="change-password-view">
    <div class="header">
      <button type="button" class="btn-back" @click="goBack">
        ← 返回
      </button>
      <h1>修改密码</h1>
    </div>

    <form @submit.prevent="handleSubmit" class="password-form">
      <!-- [MODIFY] 2026-04-11 chiwan: 原密码字段名改为password -->
      <div class="form-group">
        <label>原密码</label>
        <div class="input-wrapper">
          <input
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="请输入原密码"
          />
          <button
            type="button"
            class="toggle-password"
            @click="showPassword = !showPassword"
          >
            {{ showPassword ? '🙈' : '👁️' }}
          </button>
        </div>
      </div>

      <!-- 新密码 -->
      <div class="form-group">
        <label>新密码</label>
        <div class="input-wrapper">
          <input
            v-model="form.newPassword"
            :type="showNewPassword ? 'text' : 'password'"
            placeholder="请输入新密码（至少6位）"
          />
          <button
            type="button"
            class="toggle-password"
            @click="showNewPassword = !showNewPassword"
          >
            {{ showNewPassword ? '🙈' : '👁️' }}
          </button>
        </div>
      </div>

      <!-- 确认新密码 -->
      <div class="form-group">
        <label>确认新密码</label>
        <div class="input-wrapper">
          <input
            v-model="form.confirmPassword"
            :type="showConfirmPassword ? 'text' : 'password'"
            placeholder="请再次输入新密码"
          />
          <button
            type="button"
            class="toggle-password"
            @click="showConfirmPassword = !showConfirmPassword"
          >
            {{ showConfirmPassword ? '🙈' : '👁️' }}
          </button>
        </div>
      </div>

      <!-- 提示信息 -->
      <div class="tips">
        <p>密码要求：</p>
        <ul>
          <li>长度至少6位</li>
          <li>新密码不能与原密码相同</li>
          <li>两次输入的新密码必须一致</li>
        </ul>
      </div>

      <!-- 提交按钮 -->
      <div class="form-actions">
        <button
          type="submit"
          class="btn-primary"
          :disabled="loading"
        >
          {{ loading ? '提交中...' : '确认修改' }}
        </button>
        <button
          type="button"
          class="btn-secondary"
          @click="goBack"
        >
          取消
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.change-password-view {
  padding: 20px;
  max-width: 500px;
}

.header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.header h1 {
  font-size: 24px;
  color: #333;
  margin: 0;
}

.btn-back {
  padding: 6px 12px;
  background: #f5f7fa;
  color: #606266;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.btn-back:hover {
  background: #e4e7ed;
  color: #409eff;
}

.password-form {
  background: #fff;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
  font-size: 14px;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-wrapper input {
  width: 100%;
  padding: 10px 40px 10px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.3s;
  box-sizing: border-box;
}

.input-wrapper input:focus {
  outline: none;
  border-color: #409eff;
}

.input-wrapper input::placeholder {
  color: #c0c4cc;
}

.toggle-password {
  position: absolute;
  right: 10px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  padding: 4px;
  opacity: 0.6;
  transition: opacity 0.3s;
}

.toggle-password:hover {
  opacity: 1;
}

.tips {
  background: #f5f7fa;
  padding: 12px 16px;
  border-radius: 4px;
  margin-bottom: 20px;
}

.tips p {
  margin: 0 0 8px 0;
  font-size: 13px;
  color: #606266;
  font-weight: 500;
}

.tips ul {
  margin: 0;
  padding-left: 20px;
}

.tips li {
  font-size: 12px;
  color: #909399;
  margin-bottom: 4px;
}

.form-actions {
  display: flex;
  gap: 12px;
}

.btn-primary {
  flex: 1;
  padding: 12px 24px;
  background: #409eff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s;
}

.btn-primary:hover:not(:disabled) {
  background: #66b1ff;
}

.btn-primary:disabled {
  background: #a0cfff;
  cursor: not-allowed;
}

.btn-secondary {
  padding: 12px 24px;
  background: #fff;
  color: #606266;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.btn-secondary:hover {
  color: #409eff;
  border-color: #409eff;
}
</style>
