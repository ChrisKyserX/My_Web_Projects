/**
 * @FilePath: src/types/index.ts
 * @Author: chiwan
 * @Date: 2026-04-09
 * @Description: 全局类型定义
 * @LastEditTime: 2026-04-09
 */

// 用户类型
export interface User {
  id: number
  username: string
  nickname: string
  avatar: string
  email: string
  bio: string
  role: 'user' | 'admin' | 'moderator'
  createdAt: string
  updatedAt: string
  postCount: number
  commentCount: number
  reputation: number
}

// 帖子类型
export interface Post {
  id: number
  title: string
  content: string
  summary: string
  author: User
  category: Category
  tags: Tag[]
  viewCount: number
  commentCount: number
  likeCount: number
  isPinned: boolean
  isEssence: boolean
  createdAt: string
  updatedAt: string
}

// 分类类型
export interface Category {
  id: number
  name: string
  icon: string
  description: string
  postCount: number
  color: string
}

// 标签类型
export interface Tag {
  id: number
  name: string
  postCount: number
}

// 评论类型
export interface Comment {
  id: number
  content: string
  author: User
  postId: number
  parentId?: number
  replies?: Comment[]
  likeCount: number
  createdAt: string
}

// API响应类型
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

// 分页类型
export interface Pagination {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

// 分页响应类型
export interface PaginatedResponse<T> extends ApiResponse {
  data: {
    list: T[]
    pagination: Pagination
  }
}

// 登录表单
export interface LoginForm {
  username: string
  password: string
  remember?: boolean
}

// 注册表单
export interface RegisterForm {
  username: string
  password: string
  confirmPassword: string
  email: string
  nickname: string
}

// 用户信息表单
export interface UserProfileForm {
  nickname: string
  bio: string
  email: string
  avatar: string
}

// 修改密码表单
export interface PasswordForm {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}
