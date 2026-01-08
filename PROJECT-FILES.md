# 📁 项目文件说明

## 项目目录结构

```
automation/
├── 📄 核心业务逻辑
│   ├── index.js                 # 主入口（独立Chrome模式）
│   ├── inviter.js               # 达人邀约业务逻辑
│   ├── config.js                # 配置文件（选择器、超时等）
│   └── utils.js                 # 工具函数（模拟真人、超时处理）
│
├── 📄 Edge连接模式（新增）
│   ├── edge-connector.js        # Edge连接器类
│   ├── edge-start.js            # Edge模式启动脚本
│   ├── demo-edge.js             # Edge连接演示
│   └── test-edge-connection.js  # Edge连接测试
│
├── 📄 启动脚本
│   ├── start.sh                 # Linux/macOS启动脚本（独立Chrome）
│   ├── start-edge-debug.bat     # Windows启动Edge调试模式
│   └── start-edge-debug.sh      # Linux/macOS启动Edge调试模式
│
├── 📄 演示和测试
│   ├── demo.js                  # 独立Chrome模式演示
│   └── test.js                  # 环境测试
│
├── 📄 文档
│   ├── README.md                # 完整项目文档
│   ├── QUICKSTART.md            # 独立Chrome模式快速开始
│   ├── EDGE-GUIDE.md            # Edge连接模式详细指南
│   ├── EDGE-QUICKSTART.md       # Edge连接模式快速开始
│   └── PROJECT-FILES.md         # 本文件（项目文件说明）
│
├── 📄 配置
│   ├── package.json             # 依赖配置
│   ├── .env.example             # 环境变量示例
│   └── .gitignore               # Git忽略配置
│
└── 📁 运行时生成（不需要手动创建）
    ├── node_modules/            # 依赖包
    ├── user-data/               # Chrome用户数据
    ├── invited-talents.json     # 已邀约达人记录
    ├── automation.log           # 运行日志
    └── EdgeUserData/            # Edge用户数据
```

## 文件功能说明

### 核心业务逻辑

#### `inviter.js` (14KB)
**达人邀约业务逻辑核心**

主要类：`TalentInviter`

关键方法：
- `init()` - 初始化浏览器（独立模式）
- `run(startUrl)` - 主运行流程（独立模式）
- `runFromCurrentPage(page, startUrl)` - 从现有页面运行（Edge模式）
- `processTalent(talentItem, talentId)` - 处理单个达人邀约
- `loadInvitedTalents()` - 加载已邀约记录
- `saveInvitedTalents()` - 保存已邀约记录
- `goToNextPage()` - 翻页处理

特点：
- 完整的业务流程实现
- 支持两种模式（独立Chrome + Edge连接）
- 断点续传功能
- 详细错误处理

---

#### `config.js` (2.2KB)
**配置文件**

主要配置：
```javascript
{
  browser: { ... },      // 浏览器配置
  timeout: { ... },      // 超时配置
  human: { ... },        // 模拟人类行为
  business: {
    selectors: { ... },  // 页面选择器（重要！）
    dataFile: ...,       // 数据文件路径
    maxRetries: ...      // 最大重试次数
  },
  logging: { ... }       // 日志配置
}
```

**重要**：使用前必须修改 `business.selectors` 中的选择器！

---

#### `utils.js` (4KB)
**工具函数**

主要函数：
- `randomDelay(min, max)` - 随机延迟
- `humanLikeMouseMove(page, element)` - 模拟真人鼠标移动（贝塞尔曲线）
- `humanLikeClick(page, selector)` - 模拟真人点击
- `waitForElement(page, selector, timeout)` - 等待元素出现
- `elementExists(page, selector)` - 检查元素是否存在
- `withTimeout(promise, timeoutMs)` - 超时包装器
- `retry(fn, maxRetries)` - 重试机制

---

### Edge连接模式（新增功能）

#### `edge-connector.js`
**Edge浏览器连接器**

主要类：`EdgeConnector`

关键方法：
- `connect()` - 连接到Edge浏览器（通过调试端口9222）
- `getOrCreatePage()` - 获取现有页面或创建新页面
- `newPage()` - 创建新页面
- `pages()` - 获取所有页面
- `disconnect()` - 断开连接（不关闭Edge）

**工作原理**：
- 使用Chrome DevTools Protocol连接
- 连接到调试模式的Edge浏览器
- 可以控制Edge执行各种操作

---

#### `edge-start.js` (2.1KB)
**Edge模式启动脚本**

使用方法：
```bash
node edge-start.js "达人广场URL"
```

功能：
1. 连接到Edge浏览器
2. 导航到达人广场
3. 开始自动化邀约流程

特点：
- 使用Edge的登录状态
- 实时显示操作过程
- 不关闭Edge浏览器

---

#### `demo-edge.js`
**Edge连接模式演示**

展示：
- 如何连接到Edge
- 如何在Edge中创建新标签页
- 如何在Edge中执行自动化操作
- 实时演示整个过程

运行：
```bash
node demo-edge.js
```

---

#### `test-edge-connection.js`
**Edge连接测试脚本**

测试：
- 连接是否成功
- 浏览器版本和User-Agent
- 当前打开的页面
- 创建新页面
- 页面导航
- 断开连接

运行：
```bash
node test-edge-connection.js
```

---

### 启动脚本

#### `start-edge-debug.bat` (Windows)
**Windows启动Edge调试模式**

功能：
- 自动检测Edge安装路径
- 创建用户数据目录
- 启动调试模式的Edge

使用：双击运行

---

#### `start-edge-debug.sh` (Linux/macOS)
**Linux/macOS启动Edge调试模式**

功能：
- 检测Edge安装
- 创建用户数据目录
- 启动调试模式的Edge

使用：
```bash
./start-edge-debug.sh
```

---

### 文档

#### `README.md` (6.4KB)
**完整项目文档**

包含：
- 功能特性
- 安装步骤
- 使用方法
- 业务流程
- 配置说明
- 常见问题
- 技术栈

---

#### `EDGE-GUIDE.md` (9KB+)
**Edge连接模式详细指南**

包含：
- 工作原理
- 详细使用步骤（Windows/macOS/Linux）
- 参数说明
- 验证方法
- 常见问题
- 高级用法
- 安全建议
- 与独立模式的对比

---

#### `EDGE-QUICKSTART.md`
**Edge连接模式快速开始**

5分钟上手指南：
- Windows最简单方法
- macOS/Linux方法
- 故障排除
- 推荐工作流程

---

## 两种模式对比

### 独立Chrome模式 (`index.js`)
```
优点:
  + 自动启动浏览器
  + 无需手动配置
  + 适合生产环境

缺点:
  - 需要首次手动登录
  - 登录状态保存在独立目录

适用: 服务器环境、无人值守运行
```

### Edge连接模式 (`edge-start.js`) ⭐推荐
```
优点:
  + 使用现有Edge登录状态
  + 实时看到操作过程
  + 更难被检测
  + 无需处理登录逻辑

缺点:
  - 需要手动启动调试模式Edge
  - 不能无头运行

适用: 开发调试、小规模操作、需要实时监控
```

---

## 快速选择指南

### 选择Edge连接模式，如果：
- ✅ 你想在现有的Edge中运行
- ✅ 你想实时看到操作过程
- ✅ Edge中已经登录了微信小店
- ✅ 你是开发调试

### 选择独立Chrome模式，如果：
- ✅ 你想完全自动化（无需手动干预）
- ✅ 你想在服务器上运行
- ✅ 你想在后台运行（无头模式）
- ✅ 你是生产环境部署

---

## 使用流程

### Edge连接模式流程图

```
1. 启动Edge调试模式
   Windows: 双击 start-edge-debug.bat
   Linux:   ./start-edge-debug.sh
   ↓
2. 在Edge中登录微信小店
   ↓
3. 修改config.js中的选择器（重要！）
   ↓
4. 测试连接
   node test-edge-connection.js
   ↓
5. 运行演示（可选）
   node demo-edge.js
   ↓
6. 运行自动化
   node edge-start.js "达人广场URL"
   ↓
7. 观察Edge自动操作
```

---

## 关键文件索引

| 想要... | 使用文件 | 说明 |
|---------|---------|------|
| 快速开始（Edge） | `EDGE-QUICKSTART.md` | 5分钟上手 |
| 详细文档（Edge） | `EDGE-GUIDE.md` | 完整指南 |
| 快速开始（Chrome） | `QUICKSTART.md` | Chrome模式 |
| 完整文档 | `README.md` | 全部文档 |
| 修改配置 | `config.js` | 选择器、超时 |
| 运行自动化（Edge） | `edge-start.js` | Edge模式启动 |
| 运行自动化（Chrome） | `index.js` | Chrome模式启动 |
| 测试连接 | `test-edge-connection.js` | 测试Edge连接 |
| 查看演示 | `demo-edge.js` | Edge操作演示 |
| 启动Edge | `start-edge-debug.bat/sh` | 调试模式Edge |

---

## 下一步

1. 阅读 `EDGE-QUICKSTART.md` - 快速开始使用
2. 修改 `config.js` - 配置正确的选择器
3. 运行 `test-edge-connection.js` - 测试连接
4. 运行 `edge-start.js "URL"` - 开始自动化

祝使用愉快！ 🚀
