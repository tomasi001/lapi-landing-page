import fs from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const args = process.argv.slice(2);
const argMap = new Map();
for (let i = 0; i < args.length; i += 1) {
  const key = args[i];
  if (!key.startsWith('--')) {
    continue;
  }
  const value = args[i + 1];
  if (value && !value.startsWith('--')) {
    argMap.set(key, value);
    i += 1;
  } else {
    argMap.set(key, 'true');
  }
}

const width = Number(argMap.get('--width') ?? 1080);
const height = Number(argMap.get('--height') ?? 1920);
const fps = Number(argMap.get('--fps') ?? 30);
const duration = Number(argMap.get('--duration') ?? 55);
const outFile = path.resolve(rootDir, argMap.get('--out') ?? 'renders/dice-launch.mp4');
const frameDir = path.resolve(rootDir, argMap.get('--frames') ?? '.render/dice-launch-frames');
const port = Number(argMap.get('--port') ?? 8123);
const frameCount = Math.round(duration * fps);
const chromePath = argMap.get('--chrome') ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const verifyOnly = argMap.get('--verify') === 'true';
const framesOnly = argMap.get('--frames-only') === 'true';
let chromeUserDataDir;

function run(command, commandArgs, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, commandArgs, {
      cwd: rootDir,
      stdio: 'inherit',
      ...options,
    });
    child.on('exit', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`${command} exited with code ${code}`));
      }
    });
    child.on('error', reject);
  });
}

async function fileSizeOrNull(filePath) {
  try {
    const stats = await fs.stat(filePath);
    return stats.size;
  } catch {
    return null;
  }
}

async function waitForFile(filePath, timeoutMs = 30000) {
  const start = Date.now();
  let lastSize = null;
  let stableCount = 0;
  while (Date.now() - start < timeoutMs) {
    const size = await fileSizeOrNull(filePath);
    if (size && size > 0) {
      if (size === lastSize) {
        stableCount += 1;
        if (stableCount >= 2) {
          return;
        }
      } else {
        stableCount = 0;
        lastSize = size;
      }
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(`Timed out waiting for screenshot: ${filePath}`);
}

async function renderWithChrome(outputPath, url) {
  const child = spawn(chromePath, [
    '--headless=new',
    '--hide-scrollbars',
    '--mute-audio',
    '--disable-extensions',
    '--disable-sync',
    '--disable-background-networking',
    '--disable-component-update',
    '--use-angle=swiftshader',
    '--enable-webgl',
    '--enable-unsafe-swiftshader',
    '--ignore-gpu-blocklist',
    '--no-first-run',
    '--no-default-browser-check',
    '--run-all-compositor-stages-before-draw',
    '--virtual-time-budget=3500',
    '--default-background-color=000000',
    '--force-device-scale-factor=1',
    `--user-data-dir=${chromeUserDataDir}`,
    `--window-size=${width},${height}`,
    `--screenshot=${outputPath}`,
    url,
  ], {
    cwd: rootDir,
    detached: true,
    stdio: 'ignore',
  });

  try {
    await waitForFile(outputPath);
  } finally {
    try {
      process.kill(-child.pid, 'SIGKILL');
    } catch {
      try {
        child.kill('SIGKILL');
      } catch {
        // Ignore cleanup failures if the process already exited.
      }
    }
  }
}

function contentType(filePath) {
  if (filePath.endsWith('.html')) return 'text/html; charset=utf-8';
  if (filePath.endsWith('.js') || filePath.endsWith('.mjs')) return 'text/javascript; charset=utf-8';
  if (filePath.endsWith('.css')) return 'text/css; charset=utf-8';
  if (filePath.endsWith('.json')) return 'application/json; charset=utf-8';
  if (filePath.endsWith('.svg')) return 'image/svg+xml';
  if (filePath.endsWith('.woff2')) return 'font/woff2';
  if (filePath.endsWith('.woff')) return 'font/woff';
  if (filePath.endsWith('.ttf')) return 'font/ttf';
  if (filePath.endsWith('.png')) return 'image/png';
  if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg')) return 'image/jpeg';
  return 'application/octet-stream';
}

async function startServer() {
  const server = http.createServer(async (req, res) => {
    const requestUrl = new URL(req.url, `http://127.0.0.1:${port}`);
    const requestedPath = requestUrl.pathname === '/'
      ? '/dice-launch.html'
      : requestUrl.pathname;
    const safePath = path
      .normalize(requestedPath)
      .replace(/^[/\\]+/, '')
      .replace(/^(\.\.[/\\])+/, '');
    const filePath = path.join(rootDir, safePath);
    if (!filePath.startsWith(rootDir)) {
      res.writeHead(403);
      res.end('Forbidden');
      return;
    }
    try {
      const data = await fs.readFile(filePath);
      res.writeHead(200, { 'Content-Type': contentType(filePath) });
      res.end(data);
    } catch {
      res.writeHead(404);
      res.end('Not found');
    }
  });

  await new Promise((resolve) => server.listen(port, '127.0.0.1', resolve));
  return server;
}

async function ensureDirectories() {
  await fs.mkdir(path.dirname(outFile), { recursive: true });
  await fs.rm(frameDir, { recursive: true, force: true });
  await fs.mkdir(frameDir, { recursive: true });
  chromeUserDataDir = await fs.mkdtemp('/tmp/codex-chrome-render-');
}

async function renderFrame(frameIndex, totalFrames) {
  const time = frameIndex / fps;
  const url = `http://127.0.0.1:${port}/dice-launch.html?capture=1&t=${time.toFixed(4)}&w=${width}&h=${height}&frame=${frameIndex}`;
  const outputPath = path.join(frameDir, `frame-${String(frameIndex).padStart(5, '0')}.png`);
  const progress = `${frameIndex + 1}/${totalFrames}`;
  console.log(`Rendering frame ${progress} at t=${time.toFixed(2)}s`);

  await renderWithChrome(outputPath, url);
}

async function renderFrames() {
  const totalFrames = verifyOnly ? Math.min(frameCount, 18) : frameCount;
  for (let i = 0; i < totalFrames; i += 1) {
    await renderFrame(i, totalFrames);
  }
  return totalFrames;
}

async function assembleVideo(totalFrames) {
  if (verifyOnly || framesOnly) return;
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
    if (verifyOnly) {
      console.log('Verification frames complete.');
    } else if (framesOnly) {
      console.log(`Frame export complete: ${frameDir}`);
    } else {
      console.log(`Render complete: ${outFile}`);
    }
  } finally {
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
    if (chromeUserDataDir) {
      await fs.rm(chromeUserDataDir, { recursive: true, force: true });
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
