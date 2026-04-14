"""
 * @FilePath: langchain-sse/api/routes/health.py
 * @Author: chiwan
 * @Date: 2026-04-14
 * @Description: 健康检查API路由
 * @LastEditTime: 2026-04-14
"""

from fastapi import APIRouter

router = APIRouter()


@router.get("/health")
async def health():
    """健康检查端点"""
    return {"status": "ok"}
