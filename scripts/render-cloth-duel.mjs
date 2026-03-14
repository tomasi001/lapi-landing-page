import fs from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import puppeteer from 'puppeteer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const args = process.argv.slice(2);
const argMap = new Map();
for (let i = 0; i < args.length; i += 1) {
  const key = args[i];
  if (!key.startsWith('--')) continue;
  const value = args[i + 1];
  if (value && !value.startsWith('--')) { argMap.set(key, value); i += 1; }
  else argMap.set(key, 'true');
}

const width = Number(argMap.get('--width') ?? 1080);
const height = Number(argMap.get('--height') ?? 1920);
const fps = Number(argMap.get('--fps') ?? 30);
const duration = Number(argMap.get('--duration') ?? 55);
const outFile = path.resolve(rootDir, argMap.get('--out') ?? 'renders/cloth-duel.mp4');
const frameDir = path.resolve(rootDir, argMap.get('--frames') ?? '.render/cloth-duel-frames');
const port = Number(argMap.get('--port') ?? 8124);
const frameCount = Math.round(duration * fps);
const verifyOnly = argMap.get('--verify') === 'true';
const startFrame = Number(argMap.get('--start') ?? 0);

function contentType(filePath) {
  if (filePath.endsWith('.html')) return 'text/html; charset=utf-8';
  if (filePath.endsWith('.js') || filePath.endsWith('.mjs')) return 'text/javascript; charset=utf-8';
  if (filePath.endsWith('.css')) return 'text/css; charset=utf-8';
  if (filePath.endsWith('.json')) return 'application/json; charset=utf-8';
  if (filePath.endsWith('.svg')) return 'image/svg+xml';
  if (filePath.endsWith('.woff2')) return 'font/woff2';
  if (filePath.endsWith('.woff')) return 'font/woff';
  if (filePath.endsWith('.png')) return 'image/png';
  if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg')) return 'image/jpeg';
  return 'application/octet-stream';
}

async function startServer() {
  const server = http.createServer(async (req, res) => {
    const requestUrl = new URL(req.url, `http://127.0.0.1:${port}`);
    const requestedPath = requestUrl.pathname === '/' ? '/cloth-duel.html' : requestUrl.pathname;
    const safePath = path.normalize(requestedPath).replace(/^[/\\]+/, '').replace(/^(\.\.[/\\])+/, '');
    const filePath = path.join(rootDir, safePath);
    if (!filePath.startsWith(rootDir)) { res.writeHead(403); res.end('Forbidden'); return; }
    try {
      const data = await fs.readFile(filePath);
      res.writeHead(200, { 'Content-Type': contentType(filePath) });
      res.end(data);
    } catch { res.writeHead(404); res.end('Not found'); }
  });
  await new Promise((resolve) => server.listen(port, '127.0.0.1', resolve));
  return server;
}

async function ensureDirectories() {
  await fs.mkdir(path.dirname(outFile), { recursive: true });
  if (startFrame === 0) {
    await fs.rm(frameDir, { recursive: true, force: true });
  }
  await fs.mkdir(frameDir, { recursive: true });
}

function run(command, commandArgs, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, commandArgs, { cwd: rootDir, stdio: 'inherit', ...options });
    child.on('exit', (code) => code === 0 ? resolve() : reject(new Error(`${command} exited with code ${code}`)));
    child.on('error', reject);
  });
}

async function renderFrames() {
  const totalFrames = verifyOnly ? Math.min(frameCount, 30) : frameCount;

  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--enable-webgl',
      '--use-gl=angle',
      '--enable-gpu-rasterization',
      `--window-size=${width},${height}`,
    ],
  });

  const page = await browser.newPage();
  await page.setViewport({ width, height, deviceScaleFactor: 1 });

  // Listen for console errors
  page.on('console', (msg) => {
    if (msg.type() === 'error') console.error('PAGE ERROR:', msg.text());
  });
  page.on('pageerror', (err) => console.error('PAGE EXCEPTION:', err.message));

  for (let i = startFrame; i < totalFrames; i += 1) {
    const time = i / fps;
    const url = `http://127.0.0.1:${port}/cloth-duel.html?capture=1&t=${time.toFixed(4)}&w=${width}&h=${height}&frame=${i}`;
    const outputPath = path.join(frameDir, `frame-${String(i).padStart(5, '0')}.png`);
    const progress = `${i + 1}/${totalFrames}`;

    console.log(`Rendering frame ${progress} at t=${time.toFixed(2)}s`);

    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

    // Wait for the page to signal frame is ready
    try {
      await page.waitForFunction('window.__FRAME_READY__ === true', { timeout: 60000 });
    } catch (e) {
      console.warn(`Frame ${i} timed out waiting for render, taking screenshot anyway`);
    }

    // Small extra delay to ensure WebGL buffer is flushed
    await new Promise(r => setTimeout(r, 100));

    await page.screenshot({ path: outputPath, type: 'png' });
  }

  await browser.close();
  return totalFrames;
}

async function assembleVideo(totalFrames) {
  if (verifyOnly) return;
  await run('ffmpeg', [
    '-y',
    '-framerate', String(fps),
    '-i', path.join(frameDir, 'frame-%05d.png'),
    '-frames:v', String(totalFrames),
    '-c:v', 'libx264',
    '-pix_fmt', 'yuv420p',
    '-preset', 'slow',
    '-crf', '14',
    outFile,
  ]);
}

async function main() {
  let server;
  try {
    await ensureDirectories();
    server = await startServer();
    const totalFrames = await renderFrames();
    await assembleVideo(totalFrames);
    console.log(verifyOnly ? 'Verification frames complete.' : `Render complete: ${outFile}`);
  } finally {
    if (server) await new Promise((resolve) => server.close(resolve));
  }
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
