python版本安装
百度镜像：https://www.python.org/ftp/python
https://www.python.org/ftp/python/3.12.8/python-3.12.8-amd64.exe


构建虚拟环境以运行python


如果 conda 没安装，去安装
推荐安装 Miniconda（轻量级）：访问：https://docs.conda.io/en/latest/miniconda.html

下载对应系统的安装包

安装时勾选 "Add conda to PATH"（Windows 用户注意）

初始化 默认base环境
conda init

安装agent_env虚拟环境 python版本3.12
conda create -n agent_env python=3.12

激活agent_env虚拟环境
conda activate agent_env

关闭环境
conda deactivate

================================================
卸载指定虚拟环境
conda remove -n agent_env --all

查看所有按照的虚拟环境
conda env list

退出当前环境	conda deactivate
完全退出所有环境	conda deactivate（执行两次）
禁止自动激活 base	conda config --set auto_activate_base false
恢复自动激活 base	conda config --set auto_activate_base true
手动激活 base	conda activate base
手动激活其他环境	conda activate 环境名
================================================


安装langchain
pip install "langchain-community==0.3.27"  