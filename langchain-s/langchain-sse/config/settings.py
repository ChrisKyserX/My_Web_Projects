"""
 * @FilePath: langchain-sse/config/settings.py
 * @Author: chiwan
 * @Date: 2026-04-14
 * @Description: 应用配置和环境变量管理
 * @LastEditTime: 2026-04-14
"""

import os
from typing import List

from dotenv import load_dotenv

# 加载环境变量
# load_dotenv()


class Settings:
    """应用配置类"""

    # API密钥
    DASHSCOPE_API_KEY: str = os.getenv("DASHSCOPE_API_KEY", "")

    # CORS配置
    CORS_ORIGINS: List[str] = ["*"]
    CORS_ALLOW_CREDENTIALS: bool = True
    CORS_ALLOW_METHODS: List[str] = ["*"]
    CORS_ALLOW_HEADERS: List[str] = ["*"]

    # 应用配置
    APP_TITLE: str = "LangChain SSE Demo"
    APP_HOST: str = "0.0.0.0"
    APP_PORT: int = 8000

    # LLM配置
    LLM_BASE_URL: str = "https://dashscope.aliyuncs.com/compatible-mode/v1"
    LLM_MODEL: str = "qwen3.6-plus"

    def __init__(self):
        # 打印API密钥用于调试
        print(f"DASHSCOPE_API_KEY: {self.DASHSCOPE_API_KEY}")


class AppConfig:
    """应用运行配置"""

    # LangChain可用性
    LANGCHAIN_AVAILABLE: bool = False

    def __init__(self):
        self._check_langchain()

    def _check_langchain(self):
        """检查LangChain是否可用"""
        try:
            from langchain_openai import ChatOpenAI
            from langchain_core.messages import HumanMessage

            self.LANGCHAIN_AVAILABLE = True
        except ImportError:
            self.LANGCHAIN_AVAILABLE = False
            print("警告: LangChain-Community集成未安装，将使用模拟流式响应")


# 全局配置实例
settings = Settings()
app_config = AppConfig()
