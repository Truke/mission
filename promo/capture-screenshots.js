const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, 'ppt', 'images');
const url = 'https://glowing-travesseiro-b0630a.netlify.app/';

const shots = [
  { name: '02-hero.png', width: 1920, height: 840, clip: null, fullPage: false },
  { name: '03-form.png', width: 1280, height: 900, selector: '.form-card' },
  { name: '04-privacy.png', width: 1280, height: 720, selector: '#privacy' },
];

(async () => {
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch({ channel: 'chrome' }).catch(() => chromium.launch());
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(1500);

  await page.screenshot({ path: path.join(outDir, '02-hero.png'), fullPage: false });
  await page.locator('.form-card').screenshot({ path: path.join(outDir, '03-form.png') });
  await page.locator('#privacy').scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await page.locator('#privacy').screenshot({ path: path.join(outDir, '04-privacy.png') });

  await browser.close();
  console.log('Screenshots saved to', outDir);
})();
