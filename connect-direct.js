#!/usr/bin/env node

/**
 * 直接使用WebSocket URL连接到Edge（绕过所有网络请求）
 */

import puppeteer from 'puppeteer';
import { TalentInviter } from './inviter.js';
import { logger } from './utils.js';
import config from './config.js';

async function main() {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.log(`
用法: node connect-direct.js "WebSocket URL" "达人广场URL"

步骤:
1. 运行以下命令获取WebSocket URL:
   curl http://localhost:9222/json/version

2. 复制 webSocketDebuggerUrl 的值，例如:
   ws://localhost:9222/devtools/browser/91dec492-cb3f-4719-ba18-a84bcbc76a14

3. 运行本脚本:
   node connect-direct.js "ws://localhost:9222/devtools/browser/..." "https://store.weixin.qq.com/shop/findersquare/find"
    `);
    process.exit(0);
  }

  const wsUrl = args[0];
  const startUrl = args[1];

  try {
    logger.info('========================================');
    logger.info('使用WebSocket直接连接到Edge浏览器...');
    logger.info('========================================\n');

    logger.info(`WebSocket URL: ${wsUrl}`);
    logger.info(`目标URL: ${startUrl}\n`);

    // 直接使用WebSocket连接
    const browser = await puppeteer.connect({
      browserWSEndpoint: wsUrl,
      defaultViewport: null
    });

    logger.info('✓ 已连接到Edge浏览器\n');

    // 获取版本信息
    const version = await browser.version();
    logger.info(`浏览器版本: ${version}`);

    // 获取页面
    const pages = await browser.pages();
    logger.info(`当前标签页数量: ${pages.length}\n`);

    // 导航到目标页面
    let page;
    if (pages.length > 0) {
      page = pages[0];
      logger.info('使用现有标签页');
    } else {
      page = await browser.newPage();
      await page.setViewport({ width: 1920, height: 1080 });
      logger.info('创建新标签页');
    }

    logger.info(`正在导航到: ${startUrl}`);
    await page.goto(startUrl, { waitUntil: 'networkidle2' });

    logger.info('\n========================================');
    logger.info('开始自动化操作...');
    logger.info('========================================\n');

    // 创建邀约器并运行
    const inviter = new TalentInviter(config);
    await inviter.runFromCurrentPage(page, startUrl);

    logger.info('\n脚本执行完成！');

  } catch (error) {
    logger.error(`\n执行失败: ${error.message}`);
    logger.error('\n请检查：');
    logger.error('1. WebSocket URL是否正确？');
    logger.error('2. Edge是否以调试模式启动？');
    logger.error('3. 9222端口是否可用？');
    logger.error('4. Edge中是否已登录微信小店？\n');

    if (error.stack) {
      logger.error('错误堆栈:');
      logger.error(error.stack);
    }

    process.exit(1);
  }
}

main();
