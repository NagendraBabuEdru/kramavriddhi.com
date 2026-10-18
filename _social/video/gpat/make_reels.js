// Renders the GPAT Prep reels to _social/videos/gpat/*.mp4 (1080x1920, 30 fps, H.264 yuv420p + AAC).
// Same pipeline as the scheme Shorts (_social/video/make_videos.js): each frame of reel.html is captured
// with headless Chrome (Telugu shapes correctly), piped into ffmpeg, and muxed with a synthesized track.
// Uses puppeteer-core from _social/video/node_modules and the music generator _social/video/synth.js.
// Steps: node capture.js   (records the live app into cap/)   then
//        node make_reels.js               (all reels)
//        node make_reels.js mock-en       (one reel)
//        node make_reels.js --stills [--t=2,9.5] [ids]  (sample frames to _social/videos/gpat/frames/)
const fs = require('fs'), path = require('path'), { spawn } = require('child_process');
const puppeteer = require('puppeteer-core');
const synth = require('../synth');

const FPS = 30, W = 1080, H = 1920;
const OUT = path.join(__dirname, '..', '..', 'videos', 'gpat');
const BROWSERS = ['C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'];
const args = process.argv.slice(2), stills = args.includes('--stills');
const at = (args.find(a => a.startsWith('--t=')) || '').slice(4).split(',').filter(Boolean).map(Number);
const REELS = new Function(fs.readFileSync(path.join(__dirname, 'reels.js'), 'utf8') + '; return REELS;')();
const ids = args.filter(a => REELS[a]);

// The page reads tap points from cap/meta.js (a plain script, since file:// pages cannot fetch JSON)
const meta = path.join(__dirname, 'cap', 'meta.json');
fs.writeFileSync(path.join(__dirname, 'cap', 'meta.js'), 'window.META = ' + fs.readFileSync(meta, 'utf8') + ';\n');

async function render(id) {
  const browser = await puppeteer.launch({ executablePath: BROWSERS.find(b => fs.existsSync(b)), headless: true,
    args: ['--hide-scrollbars', '--force-color-profile=srgb', '--allow-file-access-from-files'] });
  try { await capture(browser, id); } finally { await browser.close(); }
}

async function capture(browser, id) {
  const r = REELS[id], page = await browser.newPage();
  await page.setViewport({ width: W, height: H, deviceScaleFactor: 1 });
  await page.goto('file:///' + path.join(__dirname, 'reel.html').replace(/\\/g, '/') + `?id=${id}&capture`);
  await page.evaluate(() => window.READY);
  const shot = async t => { await page.evaluate(t => window.renderFrame(t), t); return page.screenshot({ type: 'jpeg', quality: 95 }); };

  if (stills) {
    fs.mkdirSync(path.join(OUT, 'frames'), { recursive: true });
    const times = r.scenes.map((sc, i) => (i + 1 < r.scenes.length ? r.scenes[i + 1].start : r.duration) - 0.4);
    for (const t of at.length ? at : times) fs.writeFileSync(path.join(OUT, 'frames', `${r.file}-${t.toFixed(1)}s.jpg`), await shot(t));
    return;
  }

  const wav = path.join(OUT, `${r.file}.wav`), mp4 = path.join(OUT, `${r.file}.mp4`);
  synth(wav, r.duration, r.music.root, r.music.seed);
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-c:v', 'mjpeg', '-framerate', String(FPS), '-i', '-',
    '-i', wav, '-map', '0:v', '-map', '1:a',
    '-vf', 'scale=in_range=full:out_range=tv:in_color_matrix=bt601:out_color_matrix=bt709,format=yuv420p',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-level:v', '4.1',
    '-x264-params', 'ref=4', '-g', '60', '-bf', '2',
    '-color_range', 'tv', '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709',
    '-r', String(FPS), '-c:a', 'aac', '-b:a', '160k', '-ar', '48000', '-shortest', '-movflags', '+faststart', mp4],
    { stdio: ['pipe', 'inherit', 'inherit'] });
  const done = new Promise((ok, fail) => ff.on('close', c => (c ? fail(new Error('ffmpeg exit ' + c)) : ok())));
  const frames = Math.round(r.duration * FPS);
  for (let f = 0; f < frames; f++) {
    const img = await shot(f / FPS);
    if (!ff.stdin.write(img)) await new Promise(res => ff.stdin.once('drain', res));
    if (f % 150 === 0) console.log(`${r.file}: frame ${f}/${frames}`);
  }
  ff.stdin.end(); await done; fs.unlinkSync(wav);
  console.log('made', path.relative(process.cwd(), mp4));
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  await Promise.all((ids.length ? ids : Object.keys(REELS)).map(render));
})().catch(e => { console.error(e); process.exit(1); });
