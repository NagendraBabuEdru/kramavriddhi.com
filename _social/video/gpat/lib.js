// Shared helpers for driving the live GPAT Prep app at phone size with headless Chrome.
const fs = require('fs'), path = require('path'), puppeteer = require('puppeteer-core');
const URL = 'https://kramavriddhi.com/apps/gpat/';
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function open({ dpr = 2, width = 390, height = 844 } = {}) {
  const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true, args: ['--hide-scrollbars', '--force-color-profile=srgb'] });
  const page = await browser.newPage();
  await page.setViewport({ width, height, deviceScaleFactor: dpr, isMobile: true, hasTouch: true });
  page.on('pageerror', e => console.log('PAGE ERROR', e.message));
  await page.goto(URL, { waitUntil: 'networkidle0' });
  return { browser, page };
}
// Click the first element (button/link/label) whose text contains `text`
async function click(page, text, sel = 'button, a, label, [role=button]') {
  const ok = await page.evaluate((text, sel) => {
    const el = [...document.querySelectorAll(sel)].find(e => e.textContent.trim().includes(text) && e.offsetParent !== null);
    if (el) { el.scrollIntoView({ block: 'center' }); el.click(); return true; } return false;
  }, text, sel);
  if (!ok) throw new Error('not found: ' + text);
  await sleep(700);
}
async function profile(page, name = 'Priya', { quiet = true } = {}) {
  await page.type('input', name);
  await page.click('button[type=submit]'); await sleep(1200);
  await click(page, 'I understand'); await sleep(1200);
  // Chilaka reads its settings once at start, so reload after turning the pop-ups off
  if (quiet) { await page.evaluate(() => localStorage.setItem('gpat-prep-buddy-v1', JSON.stringify({ seen: [], quiet: true })));
    await page.reload({ waitUntil: 'networkidle0' }); await sleep(1000); }
}
async function go(page, hash) {
  await page.evaluate(h => { location.hash = h; }, hash); await sleep(2500);
}
const text = page => page.evaluate(() => (document.querySelector('main') || document.body).innerText);
module.exports = { open, click, profile, go, text, sleep, URL };
