#!/usr/bin/env node

/**
 * 浏览器元素检查脚本
 * 直接从Edge浏览器中提取达人列表结构
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
      hostname: '127.0.0.1',
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
  try {
    logger.info('========================================');
    logger.info('浏览器元素检查模式');
    logger.info('========================================\n');

    // 连接到浏览器
    const wsUrl = await getWebSocketDebuggerUrl(9222);
    logger.info(`✓ WebSocket URL: ${wsUrl}\n`);

    const browser = await puppeteer.connect({
      browserWSEndpoint: wsUrl,
      defaultViewport: null
    });

    logger.info('✓ 已连接到Edge浏览器\n');

    // 获取当前页面
    const pages = await browser.pages();
    const page = pages[0];

    logger.info('当前页面:', await page.title());
    logger.info('页面URL:', page.url());
    logger.info('');

    // 查找达人列表
    logger.info('========================================');
    logger.info('查找达人列表结构');
    logger.info('========================================\n');

    // 方法1：查找包含关键词的元素
    const keywords = ['达人', '邀约', '邀请', '粉丝', 'finder'];

    for (const keyword of keywords) {
      logger.info(`搜索包含 "${keyword}" 的元素:`);

      const elements = await page.evaluate((kw) => {
        const results = [];
        const allElements = document.querySelectorAll('*');

        for (const el of allElements) {
          const text = el.textContent?.trim();
          const className = el.className;
          const id = el.id;

          if (text && text.includes(kw) && text.length < 100) {
            results.push({
              tag: el.tagName,
              class: className,
              id: id,
              text: text.substring(0, 50),
              hasChildren: el.children.length > 0
            });

            if (results.length >= 5) break;
          }
        }
        return results;
      }, keyword);

      if (elements.length > 0) {
        elements.forEach((el, i) => {
          logger.info(`  [${i + 1}] <${el.tag}>`);
          if (el.class) logger.info(`      class="${el.class}"`);
          if (el.id) logger.info(`      id="${el.id}"`);
          logger.info(`      text="${el.text}"`);
        });
        logger.info('');
      } else {
        logger.info(`  未找到包含 "${keyword}" 的元素\n`);
      }
    }

    // 方法2：查找可能的列表容器
    logger.info('========================================');
    logger.info('查找可能的列表容器');
    logger.info('========================================\n');

    const containers = await page.evaluate(() => {
      const results = [];

      // 查找包含多个子元素的容器
      const allElements = document.querySelectorAll('*');

      for (const el of allElements) {
        const children = el.children;

        // 如果容器有5-50个子元素，可能是列表
        if (children.length >= 5 && children.length <= 50) {
          const className = el.className;

          // 排除导航栏等
          if (!className.includes('header') && !className.includes('nav')) {
            results.push({
              tag: el.tagName,
              class: className,
              id: el.id,
              childCount: children.length,
              sampleChildClass: children[0]?.className || ''
            });

            if (results.length >= 10) break;
          }
        }
      }

      return results;
    });

    logger.info(`找到 ${containers.length} 个可能的列表容器:\n`);

    containers.forEach((c, i) => {
      logger.info(`容器 ${i + 1}:`);
      logger.info(`  标签: <${c.tag}>`);
      if (c.class) logger.info(`  class="${c.class}"`);
      if (c.id) logger.info(`  id="${c.id}"`);
      logger.info(`  子元素数量: ${c.childCount}`);
      if (c.sampleChildClass) logger.info(`  子元素class示例: "${c.sampleChildClass}"`);
      logger.info('');
    });

    // 方法3：查找按钮
    logger.info('========================================');
    logger.info('查找按钮元素');
    logger.info('========================================\n');

    const buttons = await page.evaluate(() => {
      const results = [];

      // 查找所有button和可点击元素
      const buttons = document.querySelectorAll('button, [role="button"], .btn, [class*="btn"], [class*="button"]');

      for (const btn of buttons) {
        const text = btn.textContent?.trim();

        if (text && (text.includes('详情') || text.includes('邀约') || text.includes('邀请') || text.includes('发送'))) {
          results.push({
            tag: btn.tagName,
            class: btn.className,
            id: btn.id,
            text: text.substring(0, 30)
          });

          if (results.length >= 10) break;
        }
      }

      return results;
    });

    logger.info(`找到 ${buttons.length} 个相关按钮:\n`);

    buttons.forEach((btn, i) => {
      logger.info(`按钮 ${i + 1}:`);
      logger.info(`  <${btn.tag}>`);
      if (btn.class) logger.info(`  class="${btn.class}"`);
      if (btn.id) logger.info(`  id="${btn.id}"`);
      logger.info(`  text="${btn.text}"`);
      logger.info('');
    });

    logger.info('========================================');
    logger.info('检查完成');
    logger.info('========================================\n');
    logger.info('提示:');
    logger.info('1. 根据上面的信息，找到达人列表项的class或id');
    logger.info('2. 找到详情、邀约按钮的class或id');
    logger.info('3. 手动更新 config.js 中的 selectors');
    logger.info('4. 也可以在Edge浏览器中右键元素选择"检查"来查看\n');

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
