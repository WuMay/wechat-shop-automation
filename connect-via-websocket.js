#!/usr/bin/env node

/**
 * 使用WebSocket直接连接到Edge的启动脚本
 */

import puppeteer from 'puppeteer';
import { TalentInviter } from './inviter.js';
import { logger } from './utils.js';
import config from './config.js';

/**
 * 从调试端口获取WebSocket Debugger URL
 */
async function getWebSocketDebuggerUrl(debugPort = 9222) {
  // Node.js 18+ 内置fetch
  const response = await fetch(`http://localhost:${debugPort}/json/version`);
  const data = await response.json();
  return data.webSocketDebuggerUrl;
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(`
用法: node connect-via-websocket.js "达人广场URL"

示例:
  node connect-via-websocket.js "https://store.weixin.qq.com/shop/findersquare/find"
    `);
    process.exit(0);
  }

  const startUrl = args[0];

  try {
    logger.info('========================================');
    logger.info('通过WebSocket连接到Edge浏览器...');
    logger.info('========================================\n');

    // 获取WebSocket Debugger URL
    logger.info('正在获取WebSocket Debugger URL...');
    const wsUrl = await getWebSocketDebuggerUrl(9222);
    logger.info(`✓ WebSocket URL: ${wsUrl}\n`);

    // 使用WebSocket连接
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
    logger.error('1. Edge是否以调试模式启动？');
    logger.error('2. 9222端口是否可用？');
    logger.error('3. Edge中是否已登录微信小店？\n');
    logger.error('\n尝试运行测试脚本:');
    logger.error('  node test-puppeteer-connect.js');
    process.exit(1);
  }
}

main();
