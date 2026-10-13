// Records real gameplay of Rex's Big Adventure at 1920x1080, 30 fps, frame-exact.
//
// Needs the *recording build* of the game (the normal game plus lib/demo_hook.dart, which only
// exposes window.rexState / window.rexCmd for the autopilot) served at
//   http://localhost:8790/games/rex-adventure/
// See README.md in this folder for how that build is made.
//
// Usage: node capture.js <outDir> [maxMinutes]
//   writes <outDir>/take.mkv (H.264, crf 14; Matroska stays readable even if recording is stopped early) and <outDir>/take.jsonl (one line of game state per frame)
const puppeteer = require('puppeteer-core');
const { spawn } = require('child_process');
const fs = require('fs'), path = require('path');

const OUT = process.argv[2] || path.join(__dirname, 'take');
const MAX_MIN = +(process.argv[3] || 10);
const URL = 'http://localhost:8790/games/rex-adventure/';
const W = 1920, H = 1080, FPS = 30, SUB = 2;   // two 1/60 s game steps per captured frame

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true,
    args: ['--hide-scrollbars', '--mute-audio'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: W, height: H });
  await page.evaluateOnNewDocument(fs.readFileSync(path.join(__dirname, 'inpage.js'), 'utf8'));
  await page.goto(URL);
  const cdp = await page.createCDPSession();

  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-c:v', 'mjpeg', '-framerate', String(FPS), '-i', '-',
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '14', '-pix_fmt', 'yuv420p', path.join(OUT, 'take.mkv')],
    { stdio: ['pipe', 'inherit', 'inherit'] });
  const log = fs.createWriteStream(path.join(OUT, 'take.jsonl'));

  let frame = 0, last = null;
  const step = () => page.evaluate(n => { let r = null; for (let i = 0; i < n; i++) { const s = window.__step(1000 / 60); if (s) { r = r ? { ...s, jump: s.jump || r.jump, roar: s.roar || r.roar } : s; } } return r; }, SUB);
  const settle = () => page.evaluate(() => new Promise(r => setTimeout(r, 0)));
  async function shot(scene) {
    const st = await step();
    await settle();
    const { data } = await cdp.send('Page.captureScreenshot', { format: 'jpeg', quality: 93, optimizeForSpeed: true });
    const buf = Buffer.from(data, 'base64');
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    last = st || last;
    log.write(JSON.stringify({ f: frame, t: +(frame / FPS).toFixed(3), scene, ...(st || {}) }) + '\n');
    frame++;
    if (frame % 300 === 0) console.log(`frame ${frame} (${(frame / FPS).toFixed(0)} s)`, scene, JSON.stringify(st));
    return st;
  }
  const hold = async (sec, scene) => { for (let i = 0; i < Math.round(sec * FPS); i++) await shot(scene); };
  const click = async (x, y, scene) => { await page.mouse.move(x, y); await page.mouse.down(); await shot(scene); await page.mouse.up(); await shot(scene); };

  // Let the game load (fonts, CanvasKit) before recording.
  for (let i = 0; i < 6 * 60; i++) { await page.evaluate(() => window.__step(1000 / 60)); await new Promise(r => setTimeout(r, 3)); }

  // --- Who's playing? Type a name and pick a dino buddy
  await hold(1.0, 'who');
  await click(960, 380, 'who');
  for (const ch of 'Rex Fan') { await page.keyboard.type(ch); await hold(0.17, 'who'); }
  await hold(0.6, 'who');
  for (const x of [700, 963, 1489, 433]) { await click(x, 655, 'who'); await hold(0.55, 'who'); }
  await hold(0.4, 'who');
  await click(1440, 818, 'who');
  await hold(1.6, 'books');
  await click(340, 500, 'books');
  await hold(2.6, 'title');
  await click(620, 820, 'title');

  // --- Play: the autopilot takes over until the valley is safe (or time runs out)
  await page.evaluate(() => { window.__ap.on = true; });
  const maxFrames = frame + MAX_MIN * 60 * FPS;
  let winAt = null;
  while (frame < maxFrames) {
    const st = await shot('play');
    if (st && st.mode === 'win' && winAt == null) winAt = frame;
    if (winAt != null && frame - winAt > 6 * FPS) break;
  }
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));
  log.end();
  console.log('done', frame, 'frames', last && JSON.stringify(last));
  await browser.close();
})();
