// Renders a Rex Adventures episode to MP4 (1920x1080, 30 fps, H.264 + AAC) into _social/videos/rex/adventures/.
// usage: node render.js <episode> <bw|color> [--audio-only] [--from=s --to=s]
// Frames are drawn by sketch.html (pure functions of time), screenshotted and piped into ffmpeg;
// the soundtrack is synthesized by score.js from the episode's music and cue lists.
const puppeteer = require('puppeteer-core');
const { spawn } = require('child_process');
const fs = require('fs'), path = require('path');
const { score } = require('./score');

const [ep, mode = 'color'] = process.argv.slice(2);
const audioOnly = process.argv.includes('--audio-only');
const argv = k => { const a = process.argv.find(x => x.startsWith(`--${k}=`)); return a ? +a.split('=')[1] : null; };
const OUT = path.join(__dirname, '..', '..', '..', 'videos', 'rex', 'adventures');
const NAMES = { 0: 'rex-adventures-ep0-rex-is-born', 1: 'rex-adventures-ep1-twinkling-rain' };
const FPS = 30;

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true,
    args: ['--allow-file-access-from-files', '--disable-gpu', '--hide-scrollbars', '--force-color-profile=srgb'] });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
    page.on('pageerror', e => console.log('pageerror', e.message));
    await page.goto('file:///' + path.join(__dirname, 'sketch.html').split(path.sep).join('/') + '?ep=' + ep);
    await page.evaluate(async () => { await Promise.all(["120px 'Lilita One'", "40px 'Patrick Hand'", "700 50px 'Nirmala UI'"].map(f => document.fonts.load(f))); await document.fonts.ready; });
    const info = await page.evaluate(() => window.EPISODE_INFO());
    const base = path.join(OUT, `${NAMES[ep]}-${mode}`);
    const wav = base + '.wav';
    score(wav, { duration: info.duration, music: info.music, cues: info.cues, seed: 3 + +ep });
    console.log('audio', wav);
    if (audioOnly) return;
    const from = argv('from') ?? 0, to = argv('to') ?? info.duration;
    const mp4 = base + (from || to !== info.duration ? `-${from}-${to}` : '') + '.mp4';
    const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-c:v', 'mjpeg', '-framerate', String(FPS), '-i', '-',
      '-ss', String(from), '-t', String(to - from), '-i', wav, '-map', '0:v', '-map', '1:a',
      '-vf', 'scale=in_range=full:out_range=tv:out_color_matrix=bt709,format=yuv420p',
      '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-profile:v', 'high', '-level:v', '4.1', '-g', '60', '-bf', '2',
      '-color_range', 'tv', '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709',
      '-r', String(FPS), '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-shortest', '-movflags', '+faststart', mp4], { stdio: ['pipe', 'inherit', 'inherit'] });
    const done = new Promise((ok, fail) => ff.on('close', c => (c ? fail(new Error('ffmpeg exit ' + c)) : ok())));
    const color = mode === 'color';
    const f0 = Math.round(from * FPS), f1 = Math.round(to * FPS);
    for (let f = f0; f < f1; f++) {
      await page.evaluate((t, color) => window.renderFrame(t, color), f / FPS, color);
      const img = await page.screenshot({ type: 'jpeg', quality: 92, optimizeForSpeed: true });
      if (!ff.stdin.write(img)) await new Promise(r => ff.stdin.once('drain', r));
      if (f % 300 === 0) console.log(`ep${ep} ${mode}: frame ${f}/${f1}`);
    }
    ff.stdin.end(); await done;
    console.log('made', mp4);
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exit(1); });
