"""
 * @FilePath: langchain-sse/main.py
 * @Author: chiwan
 * @Date: 2026-04-14
 * @Description: 应用入口文件
 * @LastEditTime: 2026-04-14
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import settings, app_config
from api import router

# [REF] 2026-04-14 chiwan: 重构为模块化结构，拆分配置、路由、服务到各自模块

# 创建FastAPI应用实例
app = FastAPI(title=settings.APP_TITLE)

# 配置CORS（允许前端跨域调用）
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=settings.CORS_ALLOW_CREDENTIALS,
    allow_methods=settings.CORS_ALLOW_METHODS,
    allow_headers=settings.CORS_ALLOW_HEADERS,
)

# 注册API路由
app.include_router(router)

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host=settings.APP_HOST, port=settings.APP_PORT)
