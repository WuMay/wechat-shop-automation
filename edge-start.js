#!/usr/bin/env node

/**
 * Edge浏览器连接模式启动脚本
 * 连接到你已打开的Edge浏览器，使用其登录状态
 */

import { EdgeConnector } from './edge-connector.js';
import { TalentInviter } from './inviter.js';
import { logger } from './utils.js';
import config from './config.js';

function showInstructions() {
  console.log(`
========================================
  Edge浏览器连接模式
========================================

使用步骤：

1. 用调试模式启动Edge浏览器：

   Windows:
   "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe" --remote-debugging-port=9222 --user-data-dir="C:\\EdgeUserData"

   macOS:
   /Applications/Microsoft\\ Edge.app/Contents/MacOS/Microsoft\\ Edge --remote-debugging-port=9222

   Linux:
   microsoft-edge --remote-debugging-port=9222

2. 在Edge中登录微信小店账号

3. 运行本脚本：
   node edge-start.js "达人广场URL"

4. 你会在Edge中看到自动化操作过程

注意：
- 首次启动Edge时，使用上面的命令
- 不要关闭Edge调试窗口
- 确保9222端口没有被占用

========================================
  `);
}

async function main() {
  const args = process.argv.slice(2);

  // 显示帮助
  if (args.includes('--help') || args.includes('-h') || args.length === 0) {
    showInstructions();
    process.exit(0);
  }

  const startUrl = args[0];

  try {
    logger.info('========================================');
    logger.info('连接到Edge浏览器...');
    logger.info('========================================\n');

    // 创建Edge连接器
    const connector = new EdgeConnector({
      debugUrl: 'http://localhost:9222'
    });

    // 连接到Edge
    await connector.connect();
    logger.info('✓ 已连接到Edge浏览器\n');

    // 获取现有页面或创建新页面
    const page = await connector.getOrCreatePage();
    logger.info('✓ 已准备就绪\n');

    // 导航到目标页面
    logger.info(`正在导航到: ${startUrl}`);
    await page.goto(startUrl, { waitUntil: 'networkidle2' });

    logger.info('\n========================================');
    logger.info('开始自动化操作...');
    logger.info('========================================\n');

    // 创建邀约器并运行（使用连接的page）
    const inviter = new TalentInviter(config);
    inviter.page = page; // 使用Edge的page

    await inviter.runFromCurrentPage(page, startUrl);

    logger.info('\n脚本执行完成！');

  } catch (error) {
    logger.error(`\n执行失败: ${error.message}`);
    logger.error('\n请检查：');
    logger.error('1. Edge是否以调试模式启动？');
    logger.error('2. 9222端口是否可用？');
    logger.error('3. Edge中是否已登录微信小店？\n');
    process.exit(1);
  }
}

main();
