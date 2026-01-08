# 快速开始指南

## 第一步：安装依赖

```bash
cd automation
npm install
```

## 第二步：环境测试

运行测试脚本验证环境配置：

```bash
node test.js
```

如果看到"所有测试通过！"，说明环境配置正常。

## 第三步：配置选择器

打开 `config.js` 文件，找到 `business.selectors` 部分，根据实际页面修改选择器。

**如何找到正确的选择器？**

1. 打开微信小店达人广场页面
2. 按F12打开开发者工具
3. 点击元素选择器（Ctrl+Shift+C）
4. 点击页面上的按钮
5. 在Elements面板中找到对应的class或id
6. 更新config.js中的选择器

**示例**：
```javascript
// 原配置
detailButton: '.detail-btn, [class*="detail"], [class*="详情"]',

// 如果实际按钮的class是 ".btn-detail"，改为：
detailButton: '.btn-detail',
```

## 第四步：运行脚本

### 方式一：显示浏览器（推荐首次使用）

```bash
node index.js "https://你的达人广场URL"
```

或使用启动脚本：
```bash
./start.sh "https://你的达人广场URL"
```

### 方式二：无头模式（后台运行）

```bash
HEADLESS=true node index.js "https://你的达人广场URL"
```

## 第五步：首次登录

1. 首次运行时，浏览器会打开
2. 手动登录你的微信小店账号
3. 登录成功后，脚本会自动开始工作
4. 登录状态会保存到 `user-data` 目录，下次无需再登录

## 监控运行状态

### 查看实时日志

```bash
tail -f automation.log
```

### 查看已邀约记录

```bash
cat invited-talents.json
```

## 常见问题快速解决

### 问题1: 找不到按钮

**原因**: 选择器不正确

**解决**: 使用F12检查页面元素，更新config.js中的选择器

### 问题2: 登录失效

**原因**: 用户数据过期

**解决**: 删除 `user-data` 目录，重新运行并登录

### 问题3: 页面加载超时

**原因**: 网络慢或超时设置过短

**解决**: 在config.js中增加 `timeout.pageLoad` 的值

### 问题4: 邀约失败

**原因**: 页面结构变化或流程错误

**解决**:
1. 检查日志 `automation.log` 找到具体错误
2. 使用显示模式运行，观察实际操作过程
3. 根据实际情况调整代码或选择器

## 最佳实践

1. **测试先行**: 先用小规模数据测试，确认无误后再大规模使用
2. **适度使用**: 避免短时间内大量操作，可能触发反爬机制
3. **定期备份**: 备份 `invited-talents.json` 文件
4. **监控日志**: 定期查看日志，及时发现异常
5. **更新选择器**: 页面更新后，及时更新选择器

## 获取帮助

查看完整文档：`README.md`

查看API文档：
- `config.js` - 配置说明
- `utils.js` - 工具函数
- `inviter.js` - 核心业务逻辑
