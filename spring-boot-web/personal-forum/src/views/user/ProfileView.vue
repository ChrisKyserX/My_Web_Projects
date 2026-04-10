<!--
 * @FilePath: src/views/user/ProfileView.vue
 * @Author: chiwan
 * @Date: 2026-04-10
 * @Description: 个人中心页面
 * @LastEditTime: 2026-04-11
-->

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Plus, Loading } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import { updateUser } from '@/api/user'
import type { UpdateUserParams } from '@/api/user'
// [ADD] 2026-04-11 chiwan: 引入OSS上传工具
import { uploadAvatar } from '@/utils/oss'

// [ADD] 2026-04-10 chiwan: 性别类型定义 0=女, 1=男, 2=保密
type SexType = 0 | 1 | 2 | undefined

const router = useRouter()
const userStore = useUserStore()

// [MODIFY] 2026-04-10 chiwan: 表单数据，sex改为数字类型
const form = reactive<{
  nickname: string
  email: string
  avatar: string
  sex: SexType
  birthday: string
}>({
  nickname: '',
  email: '',
  avatar: '',
  sex: undefined,
  birthday: ''
})

// [MODIFY] 2026-04-10 chiwan: 原始数据，sex改为数字类型
const originalForm = reactive<{
  nickname: string
  email: string
  avatar: string
  sex: SexType
  birthday: string
}>({
  nickname: '',
  email: '',
  avatar: '',
  sex: undefined,
  birthday: ''
})

const loading = ref(false)
// [ADD] 2026-04-11 chiwan: 头像上传状态
const avatarUploading = ref(false)

// [MODIFY] 2026-04-10 chiwan: 性别选项值改为数字 0=女, 1=男, 2=保密
const sexOptions = [
  { label: '女', value: 0 },
  { label: '男', value: 1 },
  { label: '保密', value: 2 }
]

// [ADD] 2026-04-10 chiwan: 初始化表单数据
const initForm = () => {
  const userInfo = userStore.userInfo
  if (userInfo) {
    form.nickname = userInfo.nickname || ''
    form.email = userInfo.email || ''
    form.avatar = userInfo.avatar || ''
    form.sex = userInfo.sex
    form.birthday = userInfo.birthday || ''

    // 保存原始值
    originalForm.nickname = userInfo.nickname || ''
    originalForm.email = userInfo.email || ''
    originalForm.avatar = userInfo.avatar || ''
    originalForm.sex = userInfo.sex
    originalForm.birthday = userInfo.birthday || ''
  }
}

// [MODIFY] 2026-04-10 chiwan: 获取被修改的字段，返回类型适配后端API
const getChangedFields = (): UpdateUserParams => {
  const changed: UpdateUserParams = {}

  if (form.nickname !== originalForm.nickname) {
    changed.nickname = form.nickname
  }
  if (form.email !== originalForm.email) {
    changed.email = form.email
  }
  if (form.avatar !== originalForm.avatar) {
    changed.avatar = form.avatar
  }
  if (form.sex !== originalForm.sex) {
    changed.sex = form.sex
  }
  if (form.birthday !== originalForm.birthday) {
    changed.birthday = form.birthday
  }

  return changed
}

// [ADD] 2026-04-10 chiwan: 处理保存
const handleSave = async () => {
  const changedFields = getChangedFields()

  // 如果没有修改任何字段
  if (Object.keys(changedFields).length === 0) {
    ElMessage.info('没有需要保存的修改')
    return
  }

  loading.value = true
  try {
    await updateUser({
      ...changedFields,
      userId: userStore.userInfo?.userId || undefined
    })

    // [ADD] 2026-04-10 chiwan: 更新本地用户信息
    if (userStore.userInfo) {
      Object.assign(userStore.userInfo, changedFields)
    }

    // 更新原始值
    Object.assign(originalForm, form)

    ElMessage.success('保存成功')
  } catch (error: any) {
    ElMessage.error(error.message || '保存失败')
  } finally {
    loading.value = false
  }
}

// [ADD] 2026-04-10 chiwan: 跳转到修改密码页面
const goToChangePassword = () => {
  router.push('/user/change-password')
}

// [ADD] 2026-04-11 chiwan: 处理头像上传
const handleAvatarChange = async (options: any) => {
  const file = options.file
  if (!file) return

  // 验证文件类型
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    ElMessage.error('仅支持 JPG、PNG、GIF、WEBP 格式的图片')
    return
  }

  // 验证文件大小 (最大2MB)
  const maxSize = 2 * 1024 * 1024
  if (file.size > maxSize) {
    ElMessage.error('图片大小不能超过 2MB')
    return
  }

  avatarUploading.value = true
  try {
    // 上传到OSS
    const avatarUrl = await uploadAvatar(file)
    // 更新表单中的头像地址
    form.avatar = avatarUrl
    ElMessage.success('头像上传成功')
  } catch (error: any) {
    ElMessage.error(error.message || '头像上传失败')
  } finally {
    avatarUploading.value = false
  }
}

onMounted(() => {
  initForm()
})
</script>

<template>
  <div class="profile-view">
    <h1>个人中心</h1>

    <form @submit.prevent="handleSave" class="profile-form">
      <!-- [MODIFY] 2026-04-11 chiwan: 使用Element Plus Upload组件实现头像上传 -->
      <div class="form-group">
        <label>头像</label>
        <div class="avatar-section">
          <el-upload
            class="avatar-uploader"
            action="#"
            :auto-upload="true"
            :show-file-list="false"
            :http-request="handleAvatarChange"
            accept="image/jpeg,image/png,image/gif,image/webp"
          >
            <img
              v-if="form.avatar"
              :src="form.avatar"
              alt="头像"
              class="avatar-preview"
            />
            <div v-else class="avatar-uploader-icon">
              <el-icon><Plus /></el-icon>
              <span>点击上传</span>
            </div>
            <div v-if="avatarUploading" class="avatar-uploading-mask">
              <el-icon class="is-loading"><Loading /></el-icon>
              <span>上传中...</span>
            </div>
          </el-upload>
          <div class="avatar-tips">
            <p>支持 JPG、PNG、GIF、WEBP 格式</p>
            <p>图片大小不超过 2MB</p>
          </div>
        </div>
      </div>

      <!-- 昵称 -->
      <div class="form-group">
        <label>昵称</label>
        <input
          v-model="form.nickname"
          type="text"
          placeholder="请输入昵称"
          maxlength="20"
        />
      </div>

      <!-- 邮箱 -->
      <div class="form-group">
        <label>邮箱</label>
        <input
          v-model="form.email"
          type="email"
          placeholder="请输入邮箱"
        />
      </div>

      <!-- 性别 -->
      <div class="form-group">
        <label>性别</label>
        <div class="radio-group">
          <label
            v-for="option in sexOptions"
            :key="option.value"
            class="radio-label"
          >
            <input
              type="radio"
              :value="option.value"
              v-model="form.sex"
            />
            <span>{{ option.label }}</span>
          </label>
        </div>
      </div>

      <!-- [MODIFY] 2026-04-10 chiwan: 使用 Element Plus 日期时间选择器 -->
      <div class="form-group">
        <label>生日</label>
        <el-date-picker
          v-model="form.birthday"
          type="datetime"
          placeholder="选择日期时间"
          format="YYYY-MM-DD HH:mm:ss"
          value-format="YYYY-MM-DD HH:mm:ss"
          style="width: 100%"
        />
      </div>

      <!-- 保存按钮 -->
      <div class="form-actions">
        <button
          type="submit"
          class="btn-primary"
          :disabled="loading"
        >
          {{ loading ? '保存中...' : '保存修改' }}
        </button>

        <!-- [ADD] 2026-04-10 chiwan: 修改密码入口 -->
        <button
          type="button"
          class="btn-secondary"
          @click="goToChangePassword"
        >
          修改密码
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.profile-view {
  padding: 20px;
  max-width: 600px;
}

.profile-view h1 {
  margin-bottom: 24px;
  font-size: 24px;
  color: #333;
}

.profile-form {
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

.form-group input[type="text"],
.form-group input[type="email"],
.form-group input[type="date"] {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.3s;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: #409eff;
}

.form-group input::placeholder {
  color: #c0c4cc;
}

/* 头像区域 */
.avatar-section {
  display: flex;
  align-items: center;
  gap: 16px;
}

.avatar-preview {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e4e7ed;
  display: block;
}

/* [ADD] 2026-04-11 chiwan: 头像上传组件样式 */
.avatar-uploader {
  position: relative;
  display: inline-block;
  cursor: pointer;
}

.avatar-uploader :deep(.el-upload) {
  border: 1px dashed #d9d9d9;
  border-radius: 50%;
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
  transition: border-color 0.3s;
}

.avatar-uploader :deep(.el-upload:hover) {
  border-color: #409eff;
}

.avatar-uploader-icon {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #8c939d;
  font-size: 12px;
}

.avatar-uploader-icon .el-icon {
  font-size: 20px;
  margin-bottom: 4px;
}

.avatar-uploading-mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #409eff;
  font-size: 12px;
}

.avatar-uploading-mask .el-icon {
  font-size: 20px;
  margin-bottom: 4px;
}

.avatar-tips {
  margin-left: 16px;
  font-size: 12px;
  color: #909399;
  line-height: 1.6;
}

/* 单选按钮组 */
.radio-group {
  display: flex;
  gap: 20px;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  font-weight: normal;
}

.radio-label input[type="radio"] {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.radio-label span {
  font-size: 14px;
  color: #606266;
}

/* 按钮组 */
.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #e4e7ed;
}

.btn-primary {
  padding: 10px 24px;
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
  padding: 10px 24px;
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
