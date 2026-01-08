@echo off
chcp 65001 >nul
echo ========================================
echo   启动Edge调试模式
echo ========================================
echo.

REM 检查Edge是否已安装
if not exist "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" (
    if not exist "%ProgramFiles%\Microsoft\Edge\Application\msedge.exe" (
        echo 错误: 未找到Edge浏览器安装路径
        echo 请手动修改此文件中的Edge路径
        pause
        exit /b 1
    )
)

REM 设置用户数据目录
set EDGE_DATA_DIR=%USERPROFILE%\EdgeUserData

REM 创建目录
if not exist "%EDGE_DATA_DIR%" (
    echo 创建用户数据目录: %EDGE_DATA_DIR%
    mkdir "%EDGE_DATA_DIR%"
)

REM 启动Edge调试模式
echo 正在启动Edge调试模式...
echo.
echo 注意:
echo   - 调试端口: 9222
echo   - 用户数据目录: %EDGE_DATA_DIR%
echo   - 请保持Edge浏览器打开
echo   - 不要关闭此命令行窗口
echo.

if exist "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" (
    start "" "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" --remote-debugging-port=9222 --user-data-dir="%EDGE_DATA_DIR%"
) else (
    start "" "%ProgramFiles%\Microsoft\Edge\Application\msedge.exe" --remote-debugging-port=9222 --user-data-dir="%EDGE_DATA_DIR%"
)

echo Edge浏览器已启动
echo.
echo 下一步:
echo   1. 在Edge中登录微信小店
echo   2. 运行自动化脚本: node edge-start.js "达人广场URL"
echo.
pause
