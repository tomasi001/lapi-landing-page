import puppeteer from 'puppeteer';
import { mkdir } from 'fs/promises';

const URL = 'http://localhost:3000/fork/3/?audit';
const OUT = './renders/mobile-audit';

await mkdir(OUT, { recursive: true });

const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
await new Promise(r => setTimeout(r, 4000));

const info = await page.evaluate(() => ({
  maxScroll: document.documentElement.scrollHeight - window.innerHeight,
  pinTop: document.querySelector('.canvas-pin-wrapper').getBoundingClientRect().top + window.scrollY,
}));
const { maxScroll, pinTop } = info;
const pinRange = maxScroll - pinTop;

function scrubPx(pct) {
  return Math.min(Math.round(pinTop + pct * pinRange), maxScroll);
}

async function scrollTo(px) {
  const step = 150;
  let y = await page.evaluate(() => window.scrollY);
  while (y < px) {
    y = Math.min(y + step, px);
    await page.evaluate(yy => { window.scrollTo(0, yy); window.ScrollTrigger.update(); }, y);
    await new Promise(r => setTimeout(r, 20));
  }
  await new Promise(r => setTimeout(r, 1500));
}

const shots = [
  { name: '01-cloth-center',     scrub: 0.10 },
  { name: '02-stmt-visible',     scrub: 0.24 },
  { name: '03-cloth-wipes-in',   scrub: 0.33 },  // cloth re-entering from right
  { name: '04-cloth-at-center',  scrub: 0.355 },  // cloth centered (scroll stop moment)
  { name: '05-cloth-wipes-left', scrub: 0.37 },  // cloth exiting left
  { name: '06-tens-visible',     scrub: 0.42 },  // tension text revealed
  { name: '07-tens-centered',    scrub: 0.46 },
  { name: '08-midcta',           scrub: 0.56 },
  { name: '09-offering',         scrub: 0.68 },
];

await page.evaluate(() => window.scrollTo(0, 0));
await new Promise(r => setTimeout(r, 500));

for (const s of shots) {
  const px = scrubPx(s.scrub);
  await scrollTo(px);
  await page.screenshot({ path: `${OUT}/${s.name}.png` });
  const actual = await page.evaluate(() => Math.round(window.scrollY));
  console.log(`${s.name}: ${actual}px (scrub ${(s.scrub*100)}%)`);
}

await browser.close();
console.log(`\nDone → ${OUT}/`);
