#!/bin/bash

# 快速启动脚本

echo "=========================================="
echo "微信小店达人广场自动邀约脚本"
echo "=========================================="
echo ""

# 检查是否传入了URL
if [ -z "$1" ]; then
    echo "使用方法:"
    echo "  ./start.sh \"达人广场URL\""
    echo ""
    echo "示例:"
    echo "  ./start.sh \"https://example.com/talent-square\""
    echo ""
    echo "无头模式（不显示浏览器）:"
    echo "  HEADLESS=true ./start.sh \"https://example.com/talent-square\""
    echo ""
    exit 1
fi

# 检查Node.js是否安装
if ! command -v node &> /dev/null; then
    echo "错误: 未检测到Node.js，请先安装Node.js"
    exit 1
fi

# 检查依赖是否安装
if [ ! -d "node_modules" ]; then
    echo "正在安装依赖..."
    npm install
    echo ""
fi

# 运行脚本
echo "启动中..."
echo "目标URL: $1"
echo ""

node index.js "$1"
