# 项目分析文档

> 生成时间：2026-04-24

## 一、项目概述

**项目名称**：langchain-s  
**项目类型**：基于 LangChain 的 SSE 流式对话系统  
**技术栈**：Python (FastAPI) + Vue 3 + LangChain

这是一个前后端分离的智能对话系统，后端使用 FastAPI 和 LangChain 框架构建支持 SSE（Server-Sent Events）流式输出的聊天服务，前端使用 Vue 3 实现实时流式对话界面。

---

## 二、项目结构

```
langchain-s/
├── langchain-sse/           # 后端服务
│   ├── main.py              # 应用入口
│   ├── requirements.txt     # Python 依赖
│   ├── config/              # 配置模块
│   │   ├── __init__.py
│   │   └── settings.py      # 环境变量与应用配置
│   ├── api/                 # API 路由模块
│   │   ├── __init__.py
│   │   └── routes/
│   │       ├── __init__.py
│   │       ├── chat.py      # 聊天接口
│   │       └── health.py    # 健康检查接口
│   ├── services/            # 服务层
│   │   ├── __init__.py
│   │   └── llm_service.py   # LLM 服务与 Agent 逻辑
│   ├── models/              # 数据模型
│   │   ├── __init__.py
│   │   └── schemas.py       # Pydantic 数据模型
│   └── tools/               # LangChain 工具包
│       ├── __init__.py
│       ├── utils.py         # 工具管理函数
│       ├── calculator.py    # 计算器工具
│       ├── search.py        # 搜索工具
│       ├── datetime_tool.py # 日期时间工具
│       ├── user_info.py     # Token 获取工具
│       ├── worksheet.py     # 工作表工具
│       ├── task.py          # 任务工具
│       └── save_task.py     # 工单保存工具
├── frontend/                # 前端应用
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       └── App.vue          # 主页面组件
└── mark.txt
```

---

## 三、技术栈详情

### 3.1 后端技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| FastAPI | 0.116.2 | Web 框架 |
| Uvicorn | 0.32.0 | ASGI 服务器 |
| LangChain | 1.2.14 | LLM 应用框架 |
| LangChain-Core | 1.2.26 | LangChain 核心 |
| LangChain-Community | 0.4.1 | LangChain 社区集成 |
| LangChain-OpenAI | 1.1.2 | OpenAI 兼容接口 |
| OpenAI SDK | 2.31.0 | OpenAI Python SDK |
| DashScope | 1.23.7 | 阿里云通义千问 SDK |
| python-dotenv | 1.0.0 | 环境变量管理 |

### 3.2 前端技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Vue | 3.3.8 | 前端框架 |
| Vite | 5.0.0 | 构建工具 |
| @vitejs/plugin-vue | 5.0.0 | Vue 插件 |

---

## 四、核心架构

### 4.1 后端架构

```
┌─────────────────────────────────────────────────────────────┐
│                        FastAPI 应用                          │
├─────────────────────────────────────────────────────────────┤
│  CORS Middleware                                              │
├─────────────────────────────────────────────────────────────┤
│                         API 路由                              │
│  ┌──────────────┐  ┌──────────────┐                         │
│  │ /chat/stream │  │ /chat/history│                         │
│  │ (SSE 流式)   │  │ /sessions    │                         │
│  └──────────────┘  └──────────────┘                         │
├─────────────────────────────────────────────────────────────┤
│                      LLM 服务层                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              AgentLLMService                          │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌───────────────┐ │  │
│  │  │ 短期记忆管理 │  │ 多轮工具调用 │  │ 流式输出生成  │ │  │
│  │  └─────────────┘  └─────────────┘  └───────────────┘ │  │
│  └───────────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                        工具集                                │
│  ┌─────────┐ ┌──────┐ ┌──────────┐ ┌─────────┐ ┌────────┐  │
│  │计算器   │ │搜索  │ │日期时间  │ │Token获取│ │工单相关│  │
│  └─────────┘ └──────┘ └──────────┘ └─────────┘ └────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### 4.2 对话流程

```
用户消息
  │
  ▼
┌─────────────────────┐
│  意图识别 (LLM)      │
└──────────┬──────────┘
           │
    ┌──────┴──────┐
    ▼             ▼
┌────────┐   ┌──────────┐
│直接回复│   │工具调用  │
└────────┘   └────┬─────┘
                  │
         ┌────────┴────────┐
         ▼                 ▼
    ┌────────┐        ┌────────┐
    │获取Token│   ┌────┴─────┐ │
    └────────┘   │获取工作表│ │
                 └────┬─────┘ │
                      ▼       │
                 ┌────────┐   │
                 │获取组件│   │
                 └────┬───┘   │
                      ▼       │
                 ┌────────┐   │
                 │保存工单│   │
                 └────────┘   │
                              │
                    多轮循环（最多10轮）
                              │
                              ▼
                    ┌────────────┐
                    │ SSE 流式输出│
                    └────────────┘
```

---

## 五、核心功能模块

### 5.1 LLM 服务 (`llm_service.py`)

**核心类**：`AgentLLMService`

**主要功能**：
- 初始化 LangChain ChatOpenAI 模型，连接通义千问 API
- 管理多会话短期记忆（基于 `session_id` 隔离）
- 支持多轮工具调用（最多 10 轮）
- 流式输出生成（模拟流式和真实流式）
- 自动工具选择与执行

**关键方法**：
| 方法 | 功能 |
|------|------|
| `chat_with_memory` | 带记忆的对话，支持多轮工具调用 |
| `build_messages` | 构建包含历史消息的消息集 |
| `execute_tools` | 执行 LangChain 工具 |
| `generate_stream` | 生成 SSE 流式数据 |
| `clear_session` | 清除会话历史 |

### 5.2 工具集 (`tools/`)

| 工具模块 | 功能 |
|----------|------|
| `calculator.py` | 基础计算器和幂运算 |
| `search.py` | 知识库搜索和网页搜索（模拟） |
| `datetime_tool.py` | 获取当前时间、日期计算、日期间隔 |
| `user_info.py` | 获取访问 Token |
| `worksheet.py` | 获取工作表列表 |
| `task.py` | 获取任务列信息 |
| `save_task.py` | 保存工单 |

### 5.3 API 路由 (`api/routes/`)

| 端点 | 方法 | 功能 |
|------|------|------|
| `/chat/stream` | POST | SSE 流式聊天（支持 `session_id` 参数） |
| `/chat/history` | GET | 获取会话历史记录 |
| `/chat/history` | DELETE | 清除会话历史 |
| `/chat/sessions` | GET | 获取所有会话列表 |
| `/health` | GET | 健康检查 |

### 5.4 前端应用 (`frontend/`)

**技术**：Vue 3 (Composition API) + Vite

**功能**：
- 聊天消息展示（用户/助手消息区分样式）
- SSE 流式实时显示
- Ctrl+Enter 快捷发送
- 请求中止支持
- 响应式布局

---

## 六、配置说明

### 6.1 环境变量

| 变量 | 默认值 | 说明 |
|------|--------|------|
| `DASHSCOPE_API_KEY` | 空字符串 | 通义千问 API 密钥 |

### 6.2 默认配置

| 配置项 | 值 |
|--------|-----|
| 应用标题 | LangChain SSE Demo |
| 监听地址 | 0.0.0.0 |
| 监听端口 | 8000 |
| LLM 模型 | qwen3.6-plus |
| LLM 接口地址 | https://dashscope.aliyuncs.com/compatible-mode/v1 |
| CORS | 允许所有来源 |

---

## 七、启动方式

### 7.1 后端启动

```bash
cd langchain-sse

# 安装依赖
pip install -r requirements.txt

# 运行（需配置 DASHSCOPE_API_KEY 环境变量）
python main.py
```

### 7.2 前端启动

```bash
cd frontend

# 安装依赖
npm install

# 开发模式
npm run dev
```

---

## 八、数据流说明

### 8.1 SSE 消息格式

**请求体** (`ChatRequest`):
```json
{
  "message": "用户发送的消息内容"
}
```

**响应流** (SSE events):
```
data: {"token": "回复内容片段"}

data: {"token": "下一条片段"}

data: {"done": true, "session_id": "default", "tool_rounds": 2}
```

**错误响应**:
```
data: {"error": "错误信息"}
```

### 8.2 会话记忆存储

- 存储方式：内存字典 (`_session_histories: Dict[str, ChatMessageHistory]`)
- 隔离维度：按 `session_id` 隔离
- 保留消息数：最近 10 条历史消息参与上下文构建
- 生命周期：进程级别，重启后丢失

---

## 九、关键设计特点

1. **ReAct Agent 模式**：LLM 自动判断是否需要调用工具，支持多轮工具调用链
2. **短期记忆**：基于 session_id 的会话隔离，保留上下文连续性
3. **流式输出**：SSE 协议实现实时逐字输出体验
4. **工具扩展性**：工具模块化设计，易于新增工具
5. **降级方案**：LLM 不可用时自动切换模拟模式
6. **前后端分离**：独立部署，通过 API 通信

---

## 十、注意事项

1. **API 密钥配置**：需设置 `DASHSCOPE_API_KEY` 环境变量才能使用真实 LLM
2. **记忆存储限制**：当前使用内存存储，生产环境建议改用 Redis 等持久化方案
3. **CORS 配置**：当前允许所有来源，生产环境应限制具体域名
4. **工具调用轮次**：最大 10 轮，防止无限循环
5. **依赖版本**：LangChain 版本较新 (1.2.14)，部分 API 可能有 breaking changes
6. **前端硬编码地址**：前端调用后端地址硬编码为 `http://localhost:8000`，部署时需修改
