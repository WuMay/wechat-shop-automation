#!/usr/bin/env node

/**
 * 分析页面选择器脚本
 * 搜索可能的达人、按钮等元素
 */

import fs from 'fs';
import { logger } from './utils.js';

async function analyzePage() {
  logger.info('========================================');
  logger.info('分析页面选择器');
  logger.info('========================================\n');

  const htmlPath = './debug-page.html';

  // 检查文件是否存在
  if (!fs.existsSync(htmlPath)) {
    logger.error('未找到 debug-page.html 文件');
    logger.error('请先运行: node debug-page.js "URL"');
    process.exit(1);
  }

  logger.info('读取页面HTML...\n');

  const html = fs.readFileSync(htmlPath, 'utf-8');

  // 搜索关键词
  const keywords = {
    '达人': '达人相关元素',
    '邀约': '邀约相关元素',
    '邀请': '邀请相关元素',
    '详情': '详情相关元素',
    '带货': '带货相关元素',
    '粉丝': '粉丝相关元素',
    'finder': 'Finder相关元素',
    'talent': 'Talent相关元素',
  };

  logger.info('========================================');
  logger.info('搜索关键词');
  logger.info('========================================\n');

  for (const [keyword, description] of Object.entries(keywords)) {
    // 搜索包含关键词的class名
    const classRegex = new RegExp(`class="[^"]*${keyword}[^"]*"`, 'gi');
    const matches = html.match(classRegex);

    if (matches && matches.length > 0) {
      logger.info(`${keyword} (${description}):`);
      const uniqueClasses = [...new Set(matches)].slice(0, 5); // 最多显示5个
      uniqueClasses.forEach(cls => {
        logger.info(`  ${cls}`);
      });
      logger.info('');
    }
  }

  // 查找按钮相关的class
  logger.info('========================================');
  logger.info('查找按钮相关元素');
  logger.info('========================================\n');

  const buttonPatterns = [
    /class="[^"]*button[^"]*"/gi,
    /class="[^"]*btn[^"]*"/gi,
    /class="[^"]*clickable[^"]*"/gi,
  ];

  const buttonClasses = new Set();
  for (const pattern of buttonPatterns) {
    const matches = html.match(pattern);
    if (matches) {
      matches.forEach(m => buttonClasses.add(m));
    }
  }

  if (buttonClasses.size > 0) {
    logger.info(`找到 ${buttonClasses.size} 个按钮相关的class:\n`);
    Array.from(buttonClasses).slice(0, 10).forEach(cls => {
      logger.info(`  ${cls}`);
    });
    logger.info('');
  }

  // 查找列表项
  logger.info('========================================');
  logger.info('查找列表项元素');
  logger.info('========================================\n');

  const listPatterns = [
    /class="[^"]*list-item[^"]*"/gi,
    /class="[^"]*card[^"]*"/gi,
    /class="[^"]*item[^"]*"/gi,
  ];

  const listClasses = new Set();
  for (const pattern of listPatterns) {
    const matches = html.match(pattern);
    if (matches) {
      matches.forEach(m => listClasses.add(m));
    }
  }

  if (listClasses.size > 0) {
    logger.info(`找到 ${listClasses.size} 个列表项相关的class:\n`);
    Array.from(listClasses).slice(0, 15).forEach(cls => {
      logger.info(`  ${cls}`);
    });
    logger.info('');
  }

  // 查找data-xxx属性
  logger.info('========================================');
  logger.info('查找data-*属性');
  logger.info('========================================\n');

  const dataAttrPatterns = [
    /data-[a-z-]+="[^"]*"/gi,
  ];

  const dataAttrs = new Set();
  for (const pattern of dataAttrPatterns) {
    const matches = html.match(pattern);
    if (matches) {
      matches.forEach(m => {
        if (m.includes('talent') || m.includes('finder') || m.includes('达人') || m.includes('id')) {
          dataAttrs.add(m);
        }
      });
    }
  }

  if (dataAttrs.size > 0) {
    logger.info(`找到 ${dataAttrs.size} 个相关的data属性:\n`);
    Array.from(dataAttrs).slice(0, 20).forEach(attr => {
      logger.info(`  ${attr}`);
    });
    logger.info('');
  }

  // 提取所有class名（采样）
  logger.info('========================================');
  logger.info('所有class名采样（前100个）');
  logger.info('========================================\n');

  const allClassRegex = /class="([^"]+)"/g;
  const allClasses = new Set();
  let match;
  while ((match = allClassRegex.exec(html)) !== null) {
    match[1].split(/\s+/).forEach(cls => {
      if (cls.length > 2) {
        allClasses.add(cls);
      }
    });
  }

  const classList = Array.from(allClasses).slice(0, 100);
  classList.forEach((cls, i) => {
    logger.info(`  ${i + 1}. ${cls}`);
  });

  logger.info('\n========================================');
  logger.info('分析完成');
  logger.info('========================================');
  logger.info('\n建议操作:');
  logger.info('1. 根据上面的class名，找到达人列表项的class');
  logger.info('2. 找到详情按钮、邀约按钮的class');
  logger.info('3. 更新 config.js 中的 selectors 配置');
  logger.info('4. 也可以手动在 debug-page.html 中搜索关键词\n');

  // 保存结果到文件
  const resultPath = './selector-analysis.txt';
  const result = `
选择器分析结果
========================================
${new Date().toLocaleString('zh-CN')}

关键词搜索:
${JSON.stringify(keywords, null, 2)}

按钮相关class:
${Array.from(buttonClasses).slice(0, 20).join('\n')}

列表项相关class:
${Array.from(listClasses).slice(0, 30).join('\n')}

相关data属性:
${Array.from(dataAttrs).slice(0, 30).join('\n')}

所有class名（前100个）:
${classList.map((cls, i) => `${i + 1}. ${cls}`).join('\n')}
`;

  fs.writeFileSync(resultPath, result);
  logger.info(`分析结果已保存到: ${resultPath}\n`);
}

analyzePage().catch(error => {
  logger.error(`分析失败: ${error.message}`);
  process.exit(1);
});
