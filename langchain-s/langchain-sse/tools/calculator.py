"""
 * @FilePath: langchain-sse/tools/calculator.py
 * @Author: chiwan
 * @Date: 2026-04-14
 * @Description: LangChain计算器工具
 * @LastEditTime: 2026-04-14
"""

from langchain.tools import tool


@tool
def calculator(expression: str) -> str:
    """
    执行数学计算，支持 + - * / 和幂运算 **

    Args:
        expression: 数学表达式，例如 "2 + 3 * 4" 或 "10 / 2"

    Returns:
        计算结果或错误信息
    """
    try:
        # 安全评估：只允许数字和运算符
        allowed_chars = set("0123456789+-*/.() **")
        if not all(c in allowed_chars for c in expression.replace(" ", "")):
            return "错误: 表达式包含非法字符"

        result = eval(expression)
        return f"计算结果: {result}"
    except Exception as e:
        return f"计算错误: {str(e)}"


@tool
def power(base: float, exponent: float) -> str:
    """
    计算幂运算

    Args:
        base: 底数
        exponent: 指数

    Returns:
        幂运算结果
    """
    result = base ** exponent
    return f"{base}^{exponent} = {result}"
