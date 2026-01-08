#!/usr/bin/env node

/**
 * 测试puppeteer连接到Edge
 */

import puppeteer from 'puppeteer';

async function testConnection() {
  console.log('========================================');
  console.log('测试puppeteer连接到Edge');
  console.log('========================================\n');

  try {
    console.log('1. 尝试连接到 http://localhost:9222');
    console.log('2. 使用puppeteer.connect()方法...\n');

    const browser = await puppeteer.connect({
      browserURL: 'http://localhost:9222',
      defaultViewport: null
    });

    console.log('✓ 连接成功！\n');

    // 获取浏览器版本
    const version = await browser.version();
    console.log(`浏览器版本: ${version}\n`);

    // 获取页面列表
    const pages = await browser.pages();
    console.log(`打开的标签页数量: ${pages.length}`);

    for (let i = 0; i < pages.length; i++) {
      const title = await pages[i].title();
      const url = pages[i].url();
      console.log(`  标签页${i + 1}: ${title} (${url})`);
    }

    console.log('\n✓ 测试完成！');

    // 断开连接
    await browser.disconnect();
    console.log('已断开连接\n');

    process.exit(0);

  } catch (error) {
    console.error('\n✗ 连接失败！');
    console.error(`错误信息: ${error.message}\n`);
    console.error('错误堆栈:');
    console.error(error.stack);
    process.exit(1);
  }
}

testConnection();
