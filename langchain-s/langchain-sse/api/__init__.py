"""
 * @FilePath: langchain-sse/api/__init__.py
 * @Author: chiwan
 * @Date: 2026-04-14
 * @Description: API模块
 * @LastEditTime: 2026-04-14
"""

from fastapi import APIRouter

from .routes import chat, health

# 创建主路由
router = APIRouter()

# 注册子路由
router.include_router(chat.router, prefix="/chat", tags=["chat"])
router.include_router(health.router, prefix="", tags=["health"])

__all__ = ["router"]
