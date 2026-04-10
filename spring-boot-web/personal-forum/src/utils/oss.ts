/**
 * @FilePath: src/utils/oss.ts
 * @Author: chiwan
 * @Date: 2026-04-11
 * @Description: 阿里云OSS上传工具
 * @LastEditTime: 2026-04-11
 */

import OSS from 'ali-oss'
import {
  VITE_OSS_REGION,
  VITE_OSS_BUCKET,
  VITE_OSS_ACCESS_KEY_ID,
  VITE_OSS_ACCESS_KEY_SECRET,
  VITE_OSS_UPLOAD_DIR
} from '../../oss.js'

// 创建OSS客户端实例
const createOSSClient = () => {
  return new OSS({
    region: VITE_OSS_REGION,
    bucket: VITE_OSS_BUCKET,
    accessKeyId: VITE_OSS_ACCESS_KEY_ID,
    accessKeySecret: VITE_OSS_ACCESS_KEY_SECRET,
    secure: true // 使用HTTPS
  })
}

/**
 * 上传文件到OSS
 * @param file - 要上传的文件对象
 * @param dir - 上传目录，默认为头像目录
 * @returns Promise<string> - 返回上传后的文件URL
 */
export const uploadToOSS = async (
  file: File,
  dir: string = `${VITE_OSS_UPLOAD_DIR}avatars/`
): Promise<string> => {
  const client = createOSSClient()

  // 生成唯一文件名: 时间戳_随机数_原始文件名
  const timestamp = Date.now()
  const random = Math.floor(Math.random() * 10000)
  const extension = file.name.split('.').pop() || 'png'
  const fileName = `${dir}${timestamp}_${random}.${extension}`

  try {
    const result = await client.put(fileName, file)
    // 返回文件的完整URL
    return result.url
  } catch (error) {
    console.error('OSS上传失败:', error)
    throw new Error('头像上传失败，请稍后重试')
  }
}

/**
 * 上传头像专用方法
 * @param file - 头像文件
 * @returns Promise<string> - 返回头像URL
 */
export const uploadAvatar = async (file: File): Promise<string> => {
  // 验证文件类型
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    throw new Error('仅支持 JPG、PNG、GIF、WEBP 格式的图片')
  }

  // 验证文件大小 (最大2MB)
  const maxSize = 2 * 1024 * 1024
  if (file.size > maxSize) {
    throw new Error('图片大小不能超过 2MB')
  }

  return uploadToOSS(file, `${VITE_OSS_UPLOAD_DIR}avatars/`)
}

export default {
  uploadToOSS,
  uploadAvatar
}
