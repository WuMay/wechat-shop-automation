#!/usr/bin/env node

/**
 * 调试脚本：查看页面结构和元素
 */

import puppeteer from 'puppeteer';
import http from 'http';
import { logger, randomDelay } from './utils.js';

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
用法: node debug-page.js "达人广场URL"

示例:
  node debug-page.js "https://store.weixin.qq.com/shop/findersquare/find"
    `);
    process.exit(0);
  }

  const startUrl = args[0];

  try {
    logger.info('========================================');
    logger.info('页面调试模式');
    logger.info('========================================\n');

    // 获取WebSocket URL
    const wsUrl = await getWebSocketDebuggerUrl(9222);
    logger.info(`✓ WebSocket URL: ${wsUrl}\n`);

    // 连接到浏览器
    const browser = await puppeteer.connect({
      browserWSEndpoint: wsUrl,
      defaultViewport: null
    });

    logger.info('✓ 已连接到Edge浏览器\n');

    // 获取或创建页面
    const pages = await browser.pages();
    let page = pages[0] || await browser.newPage();

    logger.info(`正在导航到: ${startUrl}`);
    await page.goto(startUrl, { waitUntil: 'networkidle2' });

    // 等待页面加载
    await randomDelay(5000, 8000);

    logger.info('\n========================================');
    logger.info('页面信息');
    logger.info('========================================');
    logger.info(`URL: ${page.url()}`);
    logger.info(`标题: ${await page.title()}`);

    // 截图
    const screenshotPath = './debug-screenshot.png';
    await page.screenshot({ path: screenshotPath, fullPage: true });
    logger.info(`\n已保存页面截图: ${screenshotPath}`);

    // 获取页面HTML
    const html = await page.content();
    const htmlPath = './debug-page.html';
    require('fs').writeFileSync(htmlPath, html);
    logger.info(`已保存页面HTML: ${htmlPath}`);

    // 查找可能的达人元素
    logger.info('\n========================================');
    logger.info('查找可能的达人元素');
    logger.info('========================================\n');

    const possibleSelectors = [
      '.talent-item',
      '[class*="talent"]',
      '[class*="达人"]',
      '[class*="finder"]',
      '[class*="card"]',
      '[class*="item"]',
      '[class*="list-item"]',
    ];

    for (const selector of possibleSelectors) {
      try {
        const elements = await page.$$(selector);
        if (elements.length > 0) {
          logger.info(`找到选择器 "${selector}": ${elements.length} 个元素`);

          // 获取前3个元素的文本内容
          for (let i = 0; i < Math.min(3, elements.length); i++) {
            const text = await elements[i].evaluate(el => el.textContent?.trim().substring(0, 50));
            const className = await elements[i].evaluate(el => el.className);
            logger.info(`  [${i}] class="${className}" - 文本: "${text}"`);
          }
        }
      } catch (error) {
        // 忽略错误
      }
    }

    // 列出所有class名（采样）
    logger.info('\n========================================');
    logger.info('页面元素class名采样');
    logger.info('========================================\n');

    const classNames = await page.evaluate(() => {
      const allElements = document.querySelectorAll('*');
      const classes = new Set();
      for (const el of allElements) {
        if (el.className && typeof el.className === 'string') {
          const classesList = el.className.split(/\s+/);
          classesList.forEach(cls => {
            if (cls && cls.length > 3) {
              classes.add(cls);
            }
          });
        }
        if (classes.size > 100) break; // 限制数量
      }
      return Array.from(classes).slice(0, 50);
    });

    logger.info('常见class名:');
    classNames.forEach((cls, i) => {
      logger.info(`  ${i + 1}. ${cls}`);
    });

    logger.info('\n========================================');
    logger.info('调试完成');
    logger.info('========================================');
    logger.info('\n提示:');
    logger.info('1. 查看 debug-screenshot.png 了解页面结构');
    logger.info('2. 查看 debug-page.html 搜索关键词');
    logger.info('3. 根据class名更新 config.js 中的选择器');
    logger.info('\nEdge浏览器保持打开状态，你可以手动查看...\n');

  } catch (error) {
    logger.error(`\n执行失败: ${error.message}`);
    if (error.stack) {
      logger.error('错误堆栈:');
      logger.error(error.stack);
    }
    process.exit(1);
  }
}

main();
