"""
 * @FilePath: langchain-sse/tools/datetime_tool.py
 * @Author: chiwan
 * @Date: 2026-04-14
 * @Description: LangChain日期时间工具
 * @LastEditTime: 2026-04-14
"""

from datetime import datetime, timedelta
from langchain.tools import tool


@tool
def get_current_time(format: str = "%Y-%m-%d %H:%M:%S") -> str:
    """
    获取当前日期时间

    Args:
        format: 日期格式，默认 "%Y-%m-%d %H:%M:%S"

    Returns:
        格式化后的当前时间字符串
    """
    now = datetime.now()
    return now.strftime(format)


@tool
def date_calculator(days: int, from_date: str = None) -> str:
    """
    日期计算 - 从指定日期加减天数

    Args:
        days: 天数（正数为未来，负数为过去）
        from_date: 起始日期，格式 "%Y-%m-%d"，不传则使用今天

    Returns:
        计算后的日期
    """
    if from_date:
        try:
            start = datetime.strptime(from_date, "%Y-%m-%d")
        except ValueError:
            return "错误: 日期格式应为 YYYY-MM-DD"
    else:
        start = datetime.now()

    result = start + timedelta(days=days)
    return f"{start.strftime('%Y-%m-%d')} + {days}天 = {result.strftime('%Y-%m-%d')}"


@tool
def days_between(date1: str, date2: str) -> str:
    """
    计算两个日期之间的天数差

    Args:
        date1: 第一个日期，格式 "YYYY-MM-DD"
        date2: 第二个日期，格式 "YYYY-MM-DD"

    Returns:
        天数差
    """
    try:
        d1 = datetime.strptime(date1, "%Y-%m-%d")
        d2 = datetime.strptime(date2, "%Y-%m-%d")
        diff = abs((d2 - d1).days)
        return f"{date1} 和 {date2} 相差 {diff} 天"
    except ValueError:
        return "错误: 日期格式应为 YYYY-MM-DD"
