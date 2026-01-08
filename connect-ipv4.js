#!/usr/bin/env node

/**
 * 使用IPv4地址连接到Edge（解决IPv6问题）
 */

import puppeteer from 'puppeteer';
import http from 'http';
import { TalentInviter } from './inviter.js';
import { logger, randomDelay } from './utils.js';
import config from './config.js';

/**
 * 使用http模块获取WebSocket Debugger URL（强制IPv4）
 */
function getWebSocketDebuggerUrl(debugPort = 9222) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: '127.0.0.1',  // 强制使用IPv4
      port: debugPort,
      path: '/json/version',
      method: 'GET'
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          // 将WebSocket URL中的localhost替换为127.0.0.1
          let wsUrl = json.webSocketDebuggerUrl;
          wsUrl = wsUrl.replace(/localhost/g, '127.0.0.1');
          resolve(wsUrl);
        } catch (error) {
          reject(new Error(`解析JSON失败: ${error.message}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(new Error(`获取WebSocket URL失败: ${error.message}`));
    });

    req.end();
  });
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(`
用法: node connect-ipv4.js "达人广场URL"

示例:
  node connect-ipv4.js "https://store.weixin.qq.com/shop/findersquare/find"
    `);
    process.exit(0);
  }

  const startUrl = args[0];

  try {
    logger.info('========================================');
    logger.info('通过IPv4连接到Edge浏览器...');
    logger.info('========================================\n');

    // 获取WebSocket Debugger URL
    logger.info('正在获取WebSocket Debugger URL（IPv4）...');
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

    // 等待页面完全加载
    logger.info('等待页面加载完成...');
    await randomDelay(3000, 5000);

    // 添加调试信息
    logger.info('当前页面URL:', page.url());
    logger.info('当前页面标题:', await page.title());

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

    if (error.stack) {
      logger.error('错误堆栈:');
      logger.error(error.stack);
    }

    process.exit(1);
  }
}

main();
