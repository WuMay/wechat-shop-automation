# GitHub上传指南

## 方法一：使用Git命令行上传（推荐）

### 1. 初始化Git仓库

```bash
cd automation
git init
```

### 2. 添加所有文件

```bash
git add .
```

### 3. 创建首次提交

```bash
git commit -m "feat: 微信小店达人广场自动化邀约脚本

功能特性:
- Edge浏览器连接模式（使用现有登录状态）
- 独立Chrome模式（完全自动化）
- 模拟真人操作（防检测）
- 断点续传功能
- 实时操作展示
"
```

### 4. 创建GitHub仓库

访问GitHub创建新仓库：
https://github.com/new

仓库名建议：`wechat-shop-automation`

### 5. 连接远程仓库并推送

```bash
# 添加远程仓库（替换为你的用户名）
git remote add origin https://YOUR_GITHUB_TOKEN@github.com/你的用户名/wechat-shop-automation.git

# 推送到GitHub
git branch -M main
git push -u origin main
```

### 6. 验证上传成功

访问你的GitHub仓库，确认所有文件都已上传。

---

## 方法二：使用GitHub Desktop（图形化界面）

1. 下载并安装GitHub Desktop
2. 选择 "Add an Existing Repository from your Hard Drive"
3. 选择 `automation` 文件夹
4. 点击 "Publish repository"
5. 填写仓库名和描述
6. 点击 "Publish repository"

---

## 文件说明

上传到GitHub的文件包括：

```
automation/
├── 核心代码
│   ├── index.js
│   ├── inviter.js
│   ├── config.js
│   └── utils.js
│
├── Edge连接模式
│   ├── edge-connector.js
│   ├── edge-start.js
│   ├── demo-edge.js
│   └── test-edge-connection.js
│
├── 启动脚本
│   ├── start.sh
│   ├── start-edge-debug.bat
│   └── start-edge-debug.sh
│
├── 文档
│   ├── README.md
│   ├── QUICKSTART.md
│   ├── EDGE-GUIDE.md
│   ├── EDGE-QUICKSTART.md
│   ├── PROJECT-FILES.md
│   └── GITHUB-UPLOAD.md
│
├── 演示和测试
│   ├── demo.js
│   └── test.js
│
└── 配置
    ├── package.json
    ├── .env.example
    └── .gitignore
```

---

## 上传后的使用

其他人可以这样使用：

```bash
# 克隆仓库
git clone https://github.com/你的用户名/wechat-shop-automation.git

# 进入目录
cd wechat-shop-automation

# 安装依赖
npm install

# 开始使用
node edge-start.js "达人广场URL"
```

---

## README.md 更新建议

建议在GitHub的README.md中添加：

```markdown
# 微信小店达人广场自动化邀约脚本

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## 快速开始

### Edge连接模式（推荐）

```bash
# Windows
双击 start-edge-debug.bat
node edge-start.js "达人广场URL"

# macOS/Linux
./start-edge-debug.sh
node edge-start.js "达人广场URL"
```

### 独立Chrome模式

```bash
npm install
node index.js "达人广场URL"
```

## 功能特性

- ✅ 使用Edge浏览器登录状态
- ✅ 实时展示操作过程
- ✅ 模拟真人操作（防检测）
- ✅ 断点续传功能
- ✅ 自动翻页处理

## 文档

- [完整文档](README.md)
- [Edge模式快速开始](EDGE-QUICKSTART.md)
- [Edge模式详细指南](EDGE-GUIDE.md)

## License

MIT
```

---

## 注意事项

⚠️ **重要**：

1. **不要上传敏感信息**
   - `invited-talents.json`（已邀约记录）已在 `.gitignore` 中
   - `automation.log`（日志文件）已在 `.gitignore` 中
   - `user-data/` 和 `EdgeUserData/` 已在 `.gitignore` 中

2. **更新.gitignore**
   确保以下文件不会被上传：
   ```
   node_modules/
   user-data/
   EdgeUserData/
   *.log
   invited-talents.json
   .env
   ```

3. **Token安全**
   - 你提供的token具有完整权限
   - 上传后建议在GitHub设置中删除此token
   - 生成新的有限权限token用于日常使用

---

## 验证上传

上传后，检查：

1. 所有代码文件都已上传 ✓
2. 文档文件完整 ✓
3. 没有敏感信息泄露 ✓
4. README.md在GitHub上正常显示 ✓

如果一切正常，分享仓库链接给需要的人使用！
