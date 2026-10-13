// Renders the Rex story videos into _social/videos/rex/stories/.
// Each frame: set the story time, let the puppet theatre (the game's own painters, recording build
// served at localhost:8790, opened with ?story) draw it, draw the HTML overlay (speech bubbles in
// Telugu + English, captions, comic effects), screenshot, and pipe into ffmpeg with synthesized audio.
// Usage: node make_stories.js [episodeId ...] [--stills] [--from=sec]    (ids are in episodes.js)
const puppeteer = require('puppeteer-core');
const { spawn } = require('child_process');
const fs = require('fs'), path = require('path');
const { music } = require('../music');

const URL = 'http://localhost:8790/games/rex-adventure/?story';
const OUT = path.join(__dirname, '..', '..', '..', 'videos', 'rex', 'stories');
const FPS = 30;
const args = process.argv.slice(2), stills = args.includes('--stills');
const ids = args.filter(a => !a.startsWith('--'));
const EPISODES = Object.entries(require('./episodes_list')).filter(([, m]) => !m.dev).map(([k]) => k);

async function render(id) {
  const meta = require('./episodes_list')[id];
  const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true,
    args: ['--hide-scrollbars', '--force-color-profile=srgb', '--mute-audio'] });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: meta.W, height: meta.H, deviceScaleFactor: 1 });
    await page.evaluateOnNewDocument(fs.readFileSync(path.join(__dirname, '..', 'inpage.js'), 'utf8'));
    page.on('console', m => { if (m.type() === 'error') console.log('page:', m.text().slice(0, 300)); });
    page.on('pageerror', e => console.log('pageerror:', e.message));
    await page.goto(URL);
    const pump = async n => { for (let i = 0; i < n; i++) { await page.evaluate(() => window.__step(1000 / 60)); await new Promise(r => setTimeout(r, 4)); } };
    for (let i = 0; i < 400 && !(await page.evaluate(() => !!window.storyReady)); i++) await pump(5);
    await page.addScriptTag({ path: path.join(__dirname, 'engine.js') });
    await page.addScriptTag({ path: path.join(__dirname, 'episodes.js') });
    await page.addScriptTag({ path: path.join(__dirname, 'classic.js') });
    const info = await page.evaluate((id, W, H) => {
      const s = window.EPISODES[id]({ W, H });
      window.storyUse(s);
      return { duration: s.duration, endDur: s.endDur || 0, cues: s.cues, mutes: s.mutes || [], seed: s.seed || 5, musicVol: s.musicVol ?? 0.8, drums: s.drums };
    }, id, meta.W, meta.H);
    await page.evaluate(() => document.fonts.ready);
    await pump(30);
    let stalled = 0;
    const frame = async T => {
      // the theatre must draw every frame; if WebGL is lost the picture would silently go blank
      const drew = await page.evaluate(async (T, fps) => {
        const before = window.__drawn || 0;
        window.__T = T; window.__step(1000 / fps); await window.renderOverlay(T);
        return (window.__drawn || 0) > before;
      }, T, FPS);
      stalled = drew ? 0 : stalled + 1;
      if (stalled > 5) throw new Error(`the game art stopped drawing at ${T.toFixed(2)} s (render one video at a time)`);
      await page.evaluate(() => new Promise(r => setTimeout(r, 0)));
      return page.screenshot({ type: 'jpeg', quality: 93, optimizeForSpeed: true });
    };
    fs.mkdirSync(OUT, { recursive: true });
    const thumbAt = args.find(a => a.startsWith('--thumb='));
    if (thumbAt) {   // one story frame + a big title, scaled to a 1280x720 YouTube thumbnail
      await page.evaluate(() => { window.__noFxText = true; });
      await frame(+thumbAt.slice(8));
      await page.evaluate(meta => {
        const d = document.createElement('div');
        d.style.cssText = 'position:fixed;inset:0;z-index:200;pointer-events:none';
        d.innerHTML = `<div style="position:absolute;inset:0;background:linear-gradient(270deg,rgba(11,79,74,.95) 0%,rgba(11,79,74,.85) 30%,rgba(11,79,74,0) 52%)"></div>
          <div style="position:absolute;right:60px;top:110px;width:760px;text-align:left">
            <div style="display:flex;align-items:center;gap:16px;color:#fff;font:700 40px 'Segoe UI'"><span style="width:64px;height:64px;display:block"><svg viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#f7f7f4"/><path d="M7 24h6v-5h6v-5h6V8" stroke="#0f766e" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg></span>Kramavriddhi</div>
            <div style="margin-top:40px;font:700 100px 'Nirmala UI';color:#fff;line-height:1.3;white-space:nowrap;text-shadow:0 8px 0 rgba(0,0,0,.3)">${meta.te}</div>
            <div style="font:400 118px 'Lilita One';color:#f5b83d;line-height:1;-webkit-text-stroke:3px #3a2408;text-shadow:0 8px 0 #3a2408">${meta.en}</div>
            <div style="margin-top:44px;display:inline-block;background:#fff;color:#0b4f4a;font:400 60px 'Lilita One';border-radius:999px;padding:8px 40px">${meta.pill}</div></div>`;
        document.body.appendChild(d);
      }, { te: 'రెక్స్ పెద్ద రోజు', en: "Rex's Big Day", pill: 'FULL EPISODE ▶' });
      await page.evaluate(() => document.fonts.ready);
      const png = path.join(OUT, `${id}-thumb-full.png`);
      await page.screenshot({ path: png, type: 'png' });
      const out = path.join(OUT, meta.file.replace('.mp4', '-thumbnail.png'));
      require('child_process').execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', png, '-vf', 'scale=1280:720:flags=lanczos', out]);
      fs.unlinkSync(png);
      console.log('made', out);
      return;
    }
    if (stills) {
      const dir = path.join(OUT, 'frames'); fs.mkdirSync(dir, { recursive: true });
      for (const f of fs.readdirSync(dir)) if (f.startsWith(id + '-') && f.endsWith('.jpg')) fs.unlinkSync(path.join(dir, f));   // old previews of this episode
      const at = (args.find(a => a.startsWith('--t=')) || '').slice(4).split(',').filter(Boolean).map(Number);
      const times = at.length ? at : Array.from({ length: Math.ceil(info.duration / 2) }, (_, i) => i * 2 + 1);
      for (const T of times) fs.writeFileSync(path.join(dir, `${id}-${String(T.toFixed(1)).padStart(5, '0')}.jpg`), await frame(T));
      console.log(id, 'stills', times.length);
      return;
    }
    const wav = path.join(OUT, `${id}.wav`), mp4 = path.join(OUT, meta.file);
    music(wav, info.duration, { events: info.cues, mutes: info.mutes, endAt: info.duration - info.endDur + 0.3, seed: info.seed, musicVol: info.musicVol, drums: info.drums });
    const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-c:v', 'mjpeg', '-framerate', String(FPS), '-i', '-', '-i', wav,
      '-map', '0:v', '-map', '1:a', '-vf', 'scale=in_range=full:out_range=tv:out_color_matrix=bt709,format=yuv420p',
      '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-profile:v', 'high', '-level:v', meta.H > 1080 || meta.W > 1920 ? '4.2' : '4.1', '-g', '60', '-bf', '2',
      '-color_range', 'tv', '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709',
      '-r', String(FPS), '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-shortest', '-movflags', '+faststart', mp4], { stdio: ['pipe', 'inherit', 'inherit'] });
    const done = new Promise((ok, fail) => ff.on('close', c => (c ? fail(new Error('ffmpeg exit ' + c)) : ok())));
    const frames = Math.round(info.duration * FPS);
    for (let f = 0; f < frames; f++) {
      const img = await frame(f / FPS);
      if (!ff.stdin.write(img)) await new Promise(r => ff.stdin.once('drain', r));
      if (f % 300 === 0) console.log(`${id}: frame ${f}/${frames}`);
    }
    ff.stdin.end(); await done; fs.unlinkSync(wav);
    console.log('made', mp4);
  } finally { await browser.close(); }
}

(async () => {
  for (const id of ids.length ? ids : EPISODES) await render(id);
})().catch(e => { console.error(e); process.exit(1); });
