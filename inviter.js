import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  logger,
  randomDelay,
  humanLikeClick,
  waitForElement,
  elementExists,
  getPageUrl,
  withTimeout,
  retry
} from './utils.js';
import config from './config.js';

// 启用stealth插件，防止被检测（仅用于新建浏览器）
puppeteer.use(StealthPlugin());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 达人邀约器类
export class TalentInviter {
  constructor(options = {}) {
    this.browser = null;
    this.page = null;
    this.invitedTalents = new Set();
    this.config = { ...config, ...options };
    this.startTime = Date.now();
  }

  // 初始化浏览器
  async init() {
    logger.info('正在启动浏览器...');

    this.browser = await puppeteer.launch({
      headless: this.config.browser.headless,
      slowMo: this.config.browser.slowMo,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-web-security',
        '--disable-features=IsolateOrigins,site-per-process',
        '--window-size=1920,1080'
      ],
      userDataDir: this.config.browser.userDataDir,
    });

    this.page = await this.browser.newPage();
    await this.page.setViewport({ width: 1920, height: 1080 });

    // 设置随机用户代理
    await this.page.setUserAgent(this.getRandomUserAgent());

    // 监听页面错误
    this.page.on('error', (error) => {
      logger.error(`页面错误: ${error.message}`);
    });

    // 监听超时
    this.startTime = Date.now();
    setInterval(() => this.checkTotalTimeout(), 60000); // 每分钟检查总超时

    logger.info('浏览器启动成功');
  }

  // 加载已邀约达人数据
  async loadInvitedTalents() {
    try {
      const dataPath = path.join(__dirname, this.config.business.dataFile);
      const data = await fs.readFile(dataPath, 'utf-8');
      const talents = JSON.parse(data);
      this.invitedTalents = new Set(talents);
      logger.info(`已加载 ${this.invitedTalents.size} 条已邀约达人记录`);
    } catch (error) {
      logger.info('未找到已邀约达人记录文件，将创建新文件');
      this.invitedTalents = new Set();
    }
  }

  // 保存已邀约达人数据
  async saveInvitedTalents() {
    try {
      const dataPath = path.join(__dirname, this.config.business.dataFile);
      const data = Array.from(this.invitedTalents);
      await fs.writeFile(dataPath, JSON.stringify(data, null, 2));
      logger.info(`已保存 ${data.length} 条已邀约达人记录`);
    } catch (error) {
      logger.error(`保存邀约记录失败: ${error.message}`);
    }
  }

  // 检查总超时
  checkTotalTimeout() {
    const elapsed = Date.now() - this.startTime;
    if (elapsed > this.config.timeout.total) {
      throw new Error(`总运行时间超时（${elapsed}ms）`);
    }
  }

  // 添加已邀约达人
  addInvitedTalent(talentId) {
    this.invitedTalents.add(talentId);
  }

  // 检查是否已邀约
  isInvited(talentId) {
    return this.invitedTalents.has(talentId);
  }

  // 导航到指定URL
  async navigateTo(url) {
    logger.info(`正在导航到: ${url}`);
    await withTimeout(
      this.page.goto(url, { waitUntil: 'networkidle2' }),
      this.config.timeout.pageLoad,
      '页面加载超时'
    );
    await randomDelay(2000, 4000);
  }

  // 关闭当前页面
  async closeCurrentPage() {
    try {
      await this.page.keyboard.down('Control');
      await this.page.keyboard.press('KeyW');
      await this.page.keyboard.up('Control');
      logger.info('已关闭当前页面');
      await randomDelay(1000, 2000);
    } catch (error) {
      logger.error(`关闭页面失败: ${error.message}`);
    }
  }

  // 处理单个达人邀约流程
  async processTalent(talentItem, talentId) {
    const selectors = this.config.business.selectors;

    try {
      logger.info(`开始处理达人: ${talentId}`);

      // 步骤1: 点击详情按钮
      if (!await this.clickDetailButton(talentItem)) {
        logger.warn(`达人 ${talentId}: 未找到详情按钮，跳过`);
        return false;
      }

      // 步骤2: 检查是否有邀请带货按钮
      const hasInviteButton = await elementExists(this.page, selectors.inviteButton);
      if (!hasInviteButton) {
        logger.info(`达人 ${talentId}: 未找到邀请带货按钮，关闭页面`);
        await this.closeCurrentPage();
        return false;
      }

      // 步骤3: 点击邀请带货按钮
      if (!await this.clickInviteButton()) {
        await this.closeCurrentPage();
        return false;
      }

      // 步骤4: 点击添加上次邀约商品
      if (!await this.clickAddProductButton()) {
        await this.closeCurrentPage();
        return false;
      }

      // 步骤5: 点击确认按钮
      if (!await this.clickConfirmButton()) {
        await this.closeCurrentPage();
        return false;
      }

      // 步骤6: 点击发送邀约
      if (!await this.clickSendInviteButton()) {
        await this.closeCurrentPage();
        return false;
      }

      // 步骤7: 在确认窗口点击确认
      if (!await this.clickConfirmDialog()) {
        await this.closeCurrentPage();
        return false;
      }

      // 步骤8: 关闭达人请求窗口
      await this.closeCurrentPage();

      // 记录已邀约
      this.addInvitedTalent(talentId);
      await this.saveInvitedTalents();

      logger.info(`达人 ${talentId}: 邀约成功`);
      return true;

    } catch (error) {
      logger.error(`达人 ${talentId}: 处理失败 - ${error.message}`);
      // 确保关闭当前页面
      await this.closeCurrentPage();
      return false;
    }
  }

  // 点击详情按钮
  async clickDetailButton(talentItem) {
    const selectors = this.config.business.selectors;

    try {
      // 在达人项中查找详情按钮
      const detailButton = await talentItem.$(selectors.detailButton);
      if (!detailButton) {
        return false;
      }

      await detailButton.click();
      logger.info('已点击详情按钮');

      // 等待新页面加载
      await randomDelay(2000, 4000);
      return true;
    } catch (error) {
      logger.error(`点击详情按钮失败: ${error.message}`);
      return false;
    }
  }

  // 点击邀请带货按钮
  async clickInviteButton() {
    const selectors = this.config.business.selectors;

    try {
      const exists = await elementExists(this.page, selectors.inviteButton);
      if (!exists) {
        logger.warn('未找到邀请带货按钮');
        return false;
      }

      await humanLikeClick(this.page, selectors.inviteButton);
      await randomDelay(2000, 3000);
      return true;
    } catch (error) {
      logger.error(`点击邀请带货按钮失败: ${error.message}`);
      return false;
    }
  }

  // 点击添加上次邀约商品
  async clickAddProductButton() {
    const selectors = this.config.business.selectors;

    try {
      const exists = await waitForElement(this.page, selectors.addProductButton, this.config.timeout.elementWait);
      if (!exists) {
        logger.warn('未找到添加商品按钮');
        return false;
      }

      await humanLikeClick(this.page, selectors.addProductButton);
      await randomDelay(1500, 2500);
      return true;
    } catch (error) {
      logger.error(`点击添加商品按钮失败: ${error.message}`);
      return false;
    }
  }

  // 点击确认按钮
  async clickConfirmButton() {
    const selectors = this.config.business.selectors;

    try {
      const exists = await waitForElement(this.page, selectors.confirmButton, this.config.timeout.elementWait);
      if (!exists) {
        logger.warn('未找到确认按钮');
        return false;
      }

      await humanLikeClick(this.page, selectors.confirmButton);
      await randomDelay(1500, 2500);
      return true;
    } catch (error) {
      logger.error(`点击确认按钮失败: ${error.message}`);
      return false;
    }
  }

  // 点击发送邀约
  async clickSendInviteButton() {
    const selectors = this.config.business.selectors;

    try {
      const exists = await waitForElement(this.page, selectors.sendInviteButton, this.config.timeout.elementWait);
      if (!exists) {
        logger.warn('未找到发送邀约按钮');
        return false;
      }

      await humanLikeClick(this.page, selectors.sendInviteButton);
      await randomDelay(1500, 2500);
      return true;
    } catch (error) {
      logger.error(`点击发送邀约按钮失败: ${error.message}`);
      return false;
    }
  }

  // 点击确认窗口
  async clickConfirmDialog() {
    const selectors = this.config.business.selectors;

    try {
      const exists = await waitForElement(this.page, selectors.confirmDialog, this.config.timeout.elementWait);
      if (!exists) {
        logger.warn('未找到确认窗口');
        return false;
      }

      await humanLikeClick(this.page, selectors.confirmDialog);
      await randomDelay(1000, 2000);
      return true;
    } catch (error) {
      logger.error(`点击确认窗口失败: ${error.message}`);
      return false;
    }
  }

  // 处理分页
  async goToNextPage() {
    const selectors = this.config.business.selectors;

    try {
      const exists = await elementExists(this.page, selectors.nextPageButton);
      if (!exists) {
        logger.info('没有下一页，处理完成');
        return false;
      }

      await humanLikeClick(this.page, selectors.nextPageButton);
      logger.info('已翻到下一页');
      await randomDelay(3000, 5000);
      return true;
    } catch (error) {
      logger.error(`翻页失败: ${error.message}`);
      return false;
    }
  }

  // 获取当前页面的达人列表
  async getTalentList() {
    const selectors = this.config.business.selectors;

    try {
      const talents = await this.page.$$(selectors.talentItem);
      logger.info(`当前页面找到 ${talents.length} 个达人`);
      return talents;
    } catch (error) {
      logger.error(`获取达人列表失败: ${error.message}`);
      return [];
    }
  }

  // 生成达人ID（可根据实际情况修改）
  async getTalentId(talentItem) {
    try {
      // 尝试获取data-id属性或其他唯一标识
      const id = await talentItem.evaluate(el => el.dataset.id || el.getAttribute('id'));
      if (id) return id;

      // 如果没有，使用元素在页面中的位置
      const index = await this.page.evaluate((element) => {
        const elements = Array.from(document.querySelectorAll('[class*="talent"], [class*="达人"]'));
        return elements.indexOf(element);
      }, talentItem);

      return `talent_${Date.now()}_${index}`;
    } catch (error) {
      return `talent_${Date.now()}_${Math.random()}`;
    }
  }

  // 从现有页面开始运行（连接到Edge时使用）
  async runFromCurrentPage(page, startUrl) {
    try {
      this.page = page; // 使用传入的page
      this.browser = await page.browser();
      await this.loadInvitedTalents();

      logger.info('开始处理达人列表...');

      let successCount = 0;
      let failCount = 0;
      let page = 1;

      while (true) {
        logger.info(`========== 开始处理第 ${page} 页 ==========`);

        const talents = await this.getTalentList();
        if (talents.length === 0) {
          logger.info('当前页面没有达人，可能已到最后一页');
          break;
        }

        let processedInPage = 0;

        for (const talent of talents) {
          try {
            const talentId = await this.getTalentId(talent);

            // 检查是否已邀约
            if (this.isInvited(talentId)) {
              logger.info(`达人 ${talentId} 已邀约，跳过`);
              continue;
            }

            // 处理邀约
            const success = await this.processTalent(talent, talentId);
            if (success) {
              successCount++;
            } else {
              failCount++;
            }

            processedInPage++;

            // 随机休息，模拟真人
            await randomDelay(3000, 6000);

          } catch (error) {
            logger.error(`处理达人时发生错误: ${error.message}`);
            failCount++;
          }
        }

        logger.info(`第 ${page} 页处理完成: 成功 ${successCount}, 失败 ${failCount}`);

        // 翻页
        const hasNextPage = await this.goToNextPage();
        if (!hasNextPage) {
          logger.info('已处理完所有页面');
          break;
        }

        page++;

        // 检查总超时
        this.checkTotalTimeout();
      }

      logger.info(`========== 任务完成 ==========`);
      logger.info(`总计: 成功 ${successCount}, 失败 ${failCount}, 处理页数 ${page}`);
      await this.saveInvitedTalents();

    } catch (error) {
      logger.error(`任务执行失败: ${error.message}`);
      throw error;
    } finally {
      // 不关闭浏览器，因为这是用户的Edge
      await this.saveInvitedTalents();
      logger.info('任务完成，Edge浏览器保持打开状态');
    }
  }

  // 主运行流程（用于独立启动）
  async run(startUrl) {
    try {
      await this.init();
      await this.loadInvitedTalents();
      await this.navigateTo(startUrl);

      let successCount = 0;
      let failCount = 0;
      let page = 1;

      while (true) {
        logger.info(`========== 开始处理第 ${page} 页 ==========`);

        const talents = await this.getTalentList();
        if (talents.length === 0) {
          logger.info('当前页面没有达人，可能已到最后一页');
          break;
        }

        let processedInPage = 0;

        for (const talent of talents) {
          try {
            const talentId = await this.getTalentId(talent);

            // 检查是否已邀约
            if (this.isInvited(talentId)) {
              logger.info(`达人 ${talentId} 已邀约，跳过`);
              continue;
            }

            // 处理邀约
            const success = await this.processTalent(talent, talentId);
            if (success) {
              successCount++;
            } else {
              failCount++;
            }

            processedInPage++;

            // 随机休息，模拟真人
            await randomDelay(3000, 6000);

          } catch (error) {
            logger.error(`处理达人时发生错误: ${error.message}`);
            failCount++;
          }
        }

        logger.info(`第 ${page} 页处理完成: 成功 ${successCount}, 失败 ${failCount}`);

        // 翻页
        const hasNextPage = await this.goToNextPage();
        if (!hasNextPage) {
          logger.info('已处理完所有页面');
          break;
        }

        page++;

        // 检查总超时
        this.checkTotalTimeout();
      }

      logger.info(`========== 任务完成 ==========`);
      logger.info(`总计: 成功 ${successCount}, 失败 ${failCount}, 处理页数 ${page}`);
      await this.saveInvitedTalents();

    } catch (error) {
      logger.error(`任务执行失败: ${error.message}`);
      throw error;
    } finally {
      await this.cleanup();
    }
  }

  // 清理资源
  async cleanup() {
    logger.info('正在清理资源...');
    if (this.browser) {
      await this.browser.close();
      logger.info('浏览器已关闭');
    }
  }

  getRandomUserAgent() {
    const userAgents = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    ];
    return userAgents[Math.floor(Math.random() * userAgents.length)];
  }
}
