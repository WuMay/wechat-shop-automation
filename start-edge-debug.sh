#!/bin/bash

echo "========================================"
echo "  启动Edge调试模式 (macOS/Linux)"
echo "========================================"
echo ""

# 设置用户数据目录
EDGE_DATA_DIR="$HOME/EdgeUserData"

# 创建目录
if [ ! -d "$EDGE_DATA_DIR" ]; then
    echo "创建用户数据目录: $EDGE_DATA_DIR"
    mkdir -p "$EDGE_DATA_DIR"
fi

# 检查Edge是否已安装
if command -v microsoft-edge &> /dev/null; then
    EDGE_CMD="microsoft-edge"
elif [ -d "/Applications/Microsoft Edge.app" ]; then
    EDGE_CMD="/Applications/Microsoft\ Edge.app/Contents/MacOS/Microsoft\ Edge"
else
    echo "错误: 未找到Edge浏览器"
    echo "请安装Microsoft Edge浏览器"
    exit 1
fi

echo "正在启动Edge调试模式..."
echo ""
echo "注意:"
echo "  - 调试端口: 9222"
echo "  - 用户数据目录: $EDGE_DATA_DIR"
echo "  - 请保持Edge浏览器打开"
echo ""

# 启动Edge调试模式
eval "$EDGE_CMD" --remote-debugging-port=9222 --user-data-dir="$EDGE_DATA_DIR" &

echo "Edge浏览器已启动"
echo ""
echo "下一步:"
echo "  1. 在Edge中登录微信小店"
echo "  2. 运行自动化脚本: node edge-start.js \"达人广场URL\""
echo ""
