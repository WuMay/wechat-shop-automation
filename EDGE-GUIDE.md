# Edge浏览器连接模式使用指南

## 概述

Edge连接模式允许脚本直接控制你现有的Edge浏览器，使用其登录状态和Cookie，并能实时看到自动化操作过程。

## 工作原理

```
┌─────────────────────────────────────────────────┐
│           Edge连接模式工作流程                   │
├─────────────────────────────────────────────────┤
│                                                 │
│  步骤1: 用调试模式启动Edge                        │
│  msedge.exe --remote-debugging-port=9222         │
│         ↓                                       │
│  步骤2: 在Edge中登录微信小店                      │
│         ↓                                       │
│  步骤3: 运行脚本连接Edge                          │
│  node edge-start.js "达人广场URL"                │
│         ↓                                       │
│  步骤4: 脚本控制Edge自动操作                     │
│  你能看到实时点击、跳转等操作                     │
│                                                 │
└─────────────────────────────────────────────────┘
```

## 详细使用步骤

### 步骤1: 用调试模式启动Edge浏览器

#### Windows系统

找到Edge浏览器的安装路径，通常为：
- `C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`
- `C:\Program Files\Microsoft\Edge\Application\msedge.exe`

**方法一：使用命令行启动**

```cmd
"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --remote-debugging-port=9222 --user-data-dir="C:\EdgeUserData"
```

**方法二：创建快捷方式**

1. 右键点击Edge浏览器快捷方式 → "属性"
2. 在"目标"字段末尾添加：
   ```
   --remote-debugging-port=9222 --user-data-dir="C:\EdgeUserData"
   ```
3. 点击"确定"
4. 以后双击这个快捷方式即可

**方法三：使用PowerShell启动**

```powershell
& "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --remote-debugging-port=9222 --user-data-dir="C:\EdgeUserData"
```

#### macOS系统

```bash
/Applications/Microsoft\ Edge.app/Contents/MacOS/Microsoft\ Edge --remote-debugging-port=9222 --user-data-dir="$HOME/EdgeUserData"
```

或创建启动脚本 `start-edge.sh`：

```bash
#!/bin/bash
/Applications/Microsoft\ Edge.app/Contents/MacOS/Microsoft\ Edge \
  --remote-debugging-port=9222 \
  --user-data-dir="$HOME/EdgeUserData" &
```

#### Linux系统

```bash
microsoft-edge --remote-debugging-port=9222 --user-data-dir="$HOME/EdgeUserData"
```

### 步骤2: 在Edge中登录微信小店

1. Edge启动后，访问微信小店
2. 使用你的账号登录
3. 确保登录成功
4. 不要关闭Edge浏览器

### 步骤3: 运行自动化脚本

```bash
cd automation
node edge-start.js "https://你的达人广场URL"
```

### 步骤4: 观察自动化操作

你会看到在Edge浏览器中：
- 自动导航到达人广场
- 自动点击"详情"按钮
- 自动点击"邀请带货"
- 自动完成整个邀约流程

所有操作都实时可见！

## 参数说明

### 调试模式启动参数

| 参数 | 说明 | 必需 |
|------|------|------|
| `--remote-debugging-port=9222` | 启用远程调试，监听9222端口 | ✅ 是 |
| `--user-data-dir=C:\\EdgeUserData` | 指定用户数据目录（避免使用默认配置文件） | ✅ 是 |

**注意**：
- `--user-data-dir` 参数很重要，可以避免影响你正常的Edge使用
- 可以使用任何目录路径，确保有写入权限
- 端口9222可以被自定义，但需要同时修改脚本中的配置

### 脚本运行参数

```bash
node edge-start.js [URL] [选项]
```

| 参数 | 说明 | 示例 |
|------|------|------|
| URL | 达人广场页面URL | `https://example.com/talent` |
| --help | 显示帮助信息 | `--help` |

## 验证连接

### 方法1: 检查调试端口是否可访问

```bash
# Windows
curl http://localhost:9222/json/version

# macOS/Linux
curl http://localhost:9222/json/version
```

如果返回JSON数据，说明Edge调试模式启动成功。

### 方法2: 运行测试脚本

```bash
node test-edge-connection.js
```

这个脚本会测试与Edge的连接状态。

## 常见问题

### 问题1: 连接失败 - "ECONNREFUSED 127.0.0.1:9222"

**原因**: Edge未以调试模式启动或端口被占用

**解决**:
1. 确认Edge启动命令包含 `--remote-debugging-port=9222`
2. 检查端口9222是否被其他程序占用：
   ```bash
   # Windows
   netstat -ano | findstr :9222

   # macOS/Linux
   lsof -i :9222
   ```
3. 如果被占用，使用其他端口：
   ```bash
   msedge.exe --remote-debugging-port=9223
   ```
   然后修改脚本中的 `debugUrl: 'http://localhost:9223'`

### 问题2: 脚本运行但看不到操作

**原因**: 可能打开了新的标签页，但不是当前可见的标签页

**解决**:
- 脚本操作时，Edge会自动切换到操作的标签页
- 保持Edge窗口在前台可见

### 问题3: 登录状态失效

**原因**: Cookie过期或被清除

**解决**:
1. 在Edge中重新登录微信小店
2. 确保使用 `--user-data-dir` 参数，Cookie会持久保存
3. 避免清除Edge的Cookie和数据

### 问题4: 操作失败 - "未找到元素"

**原因**: 页面结构变化或选择器不正确

**解决**:
1. 打开Edge开发者工具（F12）
2. 检查页面元素的实际class或id
3. 更新 `config.js` 中的选择器

### 问题5: Edge自动关闭或重启

**原因**: 用户数据目录损坏或权限问题

**解决**:
1. 删除指定的user-data-dir目录
2. 重新启动Edge
3. 确保目录有写入权限

## 高级用法

### 自定义调试端口

1. 启动Edge时使用自定义端口：
   ```bash
   msedge.exe --remote-debugging-port=9999
   ```

2. 修改 `edge-start.js` 中的配置：
   ```javascript
   const connector = new EdgeConnector({
     debugUrl: 'http://localhost:9999'
   });
   ```

### 连接到多个Edge实例

如果同时运行多个Edge实例，使用不同的端口：

```bash
# Edge实例1
msedge.exe --remote-debugging-port=9222 --user-data-dir="C:\\Edge1"

# Edge实例2
msedge.exe --remote-debugging-port=9223 --user-data-dir="C:\\Edge2"
```

### 查看所有打开的页面

```bash
curl http://localhost:9222/json
```

会返回所有打开的标签页信息。

## 优势和限制

### 优势 ✅

- ✅ 使用真实的浏览器，完全模拟真人操作
- ✅ 保留Edge的登录状态和Cookie
- ✅ 实时看到操作过程
- ✅ 不需要处理登录逻辑
- ✅ 更难被检测（因为是真实的Edge浏览器）

### 限制 ⚠️

- ⚠️ 需要手动启动调试模式的Edge
- ⚠️ 调试端口可能会被安全软件拦截
- ⚠️ 不能在无头模式下运行（必须显示浏览器）
- ⚠️ 同时只能一个脚本连接一个Edge实例

## 安全建议

1. **不要在公共网络暴露调试端口**：
   - 调试端口默认只监听本地（127.0.0.1）
   - 不要在防火墙中开放9222端口

2. **使用独立的用户数据目录**：
   - 避免与日常使用的Edge混在一起
   - 可以定期清理这个目录

3. **定期检查连接**：
   - 确保只有预期的脚本连接到Edge
   - 查看 `http://localhost:9222/json` 了解当前连接状态

## 对比：Edge连接模式 vs 独立Chrome模式

| 特性 | Edge连接模式 | 独立Chrome模式 |
|------|------------|--------------|
| 使用现有登录状态 | ✅ 是 | ❌ 否 |
| 实时看到操作 | ✅ 是 | ✅ 是（需配置） |
| 需要手动登录 | ✅ 首次需要 | ✅ 首次需要 |
| 启动方式 | 手动启动Edge | 脚本自动启动 |
| 反检测能力 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| 适用场景 | 开发调试、小规模 | 生产环境、大规模 |
| 配置复杂度 | 中 | 低 |

## 下一步

- 查看 `QUICKSTART.md` - 快速开始指南
- 查看 `README.md` - 完整文档
- 修改 `config.js` - 配置选择器
- 运行 `node edge-start.js "你的达人广场URL"` - 开始自动化！
