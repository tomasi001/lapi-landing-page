import puppeteer from 'puppeteer';
import { mkdir } from 'fs/promises';

const URL = 'http://localhost:3000/fork/3/';
const OUT = './renders/mobile-audit';
const VIEWPORT = { width: 390, height: 844, deviceScaleFactor: 2 };

await mkdir(OUT, { recursive: true });

const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();
await page.setViewport(VIEWPORT);
await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 30000 });

// Wait for fonts, Three.js, and animations to settle
await new Promise(r => setTimeout(r, 6000));

// Full page screenshot first
await page.screenshot({ path: `${OUT}/00-full-page.png`, fullPage: true });
console.log('Captured: full page');

// Capture viewport at specific scroll positions
const sections = [
  { name: '01-hero-top', scrollTo: 0 },
  { name: '02-hero-bottom', scrollTo: 600 },
  { name: '03-cloth-center', scrollTo: 1200 },
  { name: '04-statement', scrollTo: 2400 },
  { name: '05-tension', scrollTo: 3600 },
  { name: '06-midcta', scrollTo: 4800 },
  { name: '07-offering-top', scrollTo: 6000 },
  { name: '08-offering-cards', scrollTo: 6800 },
  { name: '09-proof', scrollTo: 7800 },
  { name: '10-footer', scrollTo: 8800 },
];

for (const s of sections) {
  await page.evaluate(y => window.scrollTo(0, y), s.scrollTo);
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: `${OUT}/${s.name}.png` });
  console.log(`Captured: ${s.name}`);
}

// Also grab nav states
await page.evaluate(() => window.scrollTo(0, 0));
await new Promise(r => setTimeout(r, 500));
await page.screenshot({ path: `${OUT}/11-nav-top.png`, clip: { x: 0, y: 0, width: 390, height: 120 } });

await browser.close();
console.log(`\nAll screenshots saved to ${OUT}/`);
