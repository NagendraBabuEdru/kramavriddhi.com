// Renders the Kramavriddhi YouTube Shorts to _social/videos/*.mp4 (1080x1920, 30 fps, H.264 yuv420p).
// Each frame of short.html is captured with headless Chrome (correct Telugu shaping), piped into
// ffmpeg, and muxed with a locally synthesized background track.
// Setup once:  cd _social/video && npm install
// Run:         node make_videos.js          (all)   or   node make_videos.js 2   (one Short)
// Stills only: node make_videos.js --stills [--t=1.5,12]   (writes sample frames to _social/videos/frames/)
const fs = require('fs'), path = require('path'), { spawn } = require('child_process');
const puppeteer = require('puppeteer-core');
const synth = require('./synth');

const FPS = 30, W = 1080, H = 1920;
const OUT = path.join(__dirname, '..', 'videos');
const BROWSERS = ['C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'];
const args = process.argv.slice(2), stills = args.includes('--stills');
const ids = args.filter(a => /^\d+$/.test(a));
const at = (args.find(a => a.startsWith('--t=')) || '').slice(4).split(',').filter(Boolean).map(Number); // e.g. --stills --t=11.5,15

// Load the scene list (shorts.js is a browser script) to read file names and durations
const SHORTS = new Function(fs.readFileSync(path.join(__dirname, 'shorts.js'), 'utf8') + '; return SHORTS;')();

// One browser per Short: background tabs of a shared browser do not paint, so they would stall.
async function render(id) {
  const browser = await puppeteer.launch({ executablePath: BROWSERS.find(b => fs.existsSync(b)), headless: true,
    args: ['--hide-scrollbars', '--force-color-profile=srgb', '--allow-file-access-from-files'] });
  try { await capture(browser, id); } finally { await browser.close(); }
}

async function capture(browser, id) {
  const s = SHORTS[id], page = await browser.newPage();
  await page.setViewport({ width: W, height: H, deviceScaleFactor: 1 });
  await page.goto('file:///' + path.join(__dirname, 'short.html').replace(/\\/g, '/') + `?id=${id}&capture`);
  await page.evaluate(() => window.READY);
  const shot = async t => { await page.evaluate(t => window.renderFrame(t), t); return page.screenshot({ type: 'jpeg', quality: 95 }); };

  if (stills) {
    fs.mkdirSync(path.join(OUT, 'frames'), { recursive: true });
    const times = s.scenes.map((sc, i) => (i + 1 < s.scenes.length ? s.scenes[i + 1].start : s.duration) - 0.6);
    for (const t of at.length ? at : [1.5, ...times]) fs.writeFileSync(path.join(OUT, 'frames', `${s.file}-${t.toFixed(1)}s.jpg`), await shot(t));
    await page.close(); return;
  }

  const wav = path.join(OUT, `${s.file}.wav`), mp4 = path.join(OUT, `${s.file}.mp4`);
  synth(wav, s.duration, s.music.root, s.music.seed);
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-c:v', 'mjpeg', '-framerate', String(FPS), '-i', '-',
    // High@4.1, BT.709, limited range, 48 kHz AAC: plays on phones, Windows, browsers and YouTube
    '-i', wav, '-map', '0:v', '-map', '1:a',
    '-vf', 'scale=in_range=full:out_range=tv:in_color_matrix=bt601:out_color_matrix=bt709,format=yuv420p',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-level:v', '4.1',
    '-x264-params', 'ref=4', '-g', '60', '-bf', '2',
    '-color_range', 'tv', '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709',
    '-r', String(FPS), '-c:a', 'aac', '-b:a', '160k', '-ar', '48000', '-shortest', '-movflags', '+faststart', mp4],
    { stdio: ['pipe', 'inherit', 'inherit'] });
  const done = new Promise((ok, fail) => ff.on('close', c => (c ? fail(new Error('ffmpeg exit ' + c)) : ok())));
  const frames = Math.round(s.duration * FPS);
  for (let f = 0; f < frames; f++) {
    const img = await shot(f / FPS);
    if (!ff.stdin.write(img)) await new Promise(r => ff.stdin.once('drain', r));
    if (f % 150 === 0) console.log(`${s.file}: frame ${f}/${frames}`);
  }
  ff.stdin.end(); await done; fs.unlinkSync(wav); await page.close();
  console.log('made', path.relative(process.cwd(), mp4));
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  await Promise.all((ids.length ? ids : Object.keys(SHORTS)).map(render));
})().catch(e => { console.error(e); process.exit(1); });
