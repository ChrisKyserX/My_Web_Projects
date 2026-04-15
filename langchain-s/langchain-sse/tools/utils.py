"""
 * @FilePath: langchain-sse/tools/utils.py
 * @Author: chiwan
 * @Date: 2026-04-14
 * @Description: 工具管理工具函数
 * @LastEditTime: 2026-04-14
"""

from typing import List
from langchain.tools import BaseTool


def get_all_tools() -> List[BaseTool]:
    """
    获取所有可用的LangChain工具列表
    用于绑定到LLM
    """
    # [ADD] 2026-04-14 chiwan: 集中导入并返回所有工具实例
    from .calculator import calculator, power
    from .search import knowledge_search, web_search_mock
    from .datetime_tool import get_current_time, date_calculator, days_between
    from .user_info import get_token, get_token_with_code
    from .task import get_task_columns_with_token
    from .worksheet import get_worksheet_list
    from .save_task import save_task

    return [
        calculator,
        power,
        knowledge_search,
        web_search_mock,
        get_current_time,
        date_calculator,
        days_between,
        get_token,
        get_token_with_code,
        get_task_columns_with_token,
        save_task,
        get_worksheet_list,
    ]


def get_tool_names() -> List[str]:
    """获取所有工具名称列表"""
    tools = get_all_tools()
    return [tool.name for tool in tools]


def find_tool_by_name(name: str) -> BaseTool:
    """通过名称查找工具"""
    tools = get_all_tools()
    for tool in tools:
        if tool.name == name:
            return tool
    raise ValueError(f"未找到工具: {name}")
