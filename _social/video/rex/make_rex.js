// Builds the Rex's Big Adventure promo videos from a recorded gameplay take (capture.js):
//   rex-short.mp4      1080x1920, 30 fps  (YouTube Short)
//   rex-trailer.mp4    1920x1080, 30 fps  (channel trailer / website)
//   rex-thumbnail.png  1280x720
// Usage: node make_rex.js [short|trailer|thumb ...] [--stills]   (default: all three)
// The take lives in _social/videos/rex/take/ (take.mkv + take.jsonl); the cut list and words are in edit.js.
const fs = require('fs'), path = require('path'), { spawn, execFileSync } = require('child_process');
const puppeteer = require('puppeteer-core');
const { music } = require('./music');
const EDIT = require('./edit');

const FPS = 30;
const OUT = path.join(__dirname, '..', '..', 'videos', 'rex');
const TAKE = process.env.REX_TAKE || path.join(OUT, 'take');
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const args = process.argv.slice(2), stills = args.includes('--stills');
const which = args.filter(a => !a.startsWith('--'));
const fileUrl = p => 'file:///' + p.replace(/\\/g, '/');

function run(cmd, a) { execFileSync(cmd, a, { stdio: ['ignore', 'inherit', 'inherit'] }); }

// One frame from the take as a PNG (for cards and the thumbnail)
function still(t, crop, out) {
  const vf = crop ? [`crop=${crop[2]}:${crop[3]}:${crop[0]}:${crop[1]}`] : [];
  run('ffmpeg', ['-y', '-loglevel', 'error', '-ss', String(t), '-i', path.join(TAKE, 'take.mkv'), '-frames:v', '1', ...(vf.length ? ['-vf', vf.join(',')] : []), out]);
  return out;
}

// Lay the timeline out: each segment gets start/end in output seconds.
function timeline(spec) {
  let t = 0;
  const segs = spec.segments.map(s => {
    const dur = s.src ? s.src[1] - s.src[0] : s.dur;
    const seg = { ...s, start: t, end: t + dur, kind: s.kind || 'clip' };
    t += dur;
    return seg;
  });
  return { segs, total: t };
}

// Game events inside the used clips, mapped to output time, for the sound effects.
function events(segs) {
  const rows = fs.readFileSync(path.join(TAKE, 'take.jsonl'), 'utf8').trim().split('\n').map(l => JSON.parse(l));
  const ev = [];
  for (const s of segs) {
    if (!s.src) { if (s.kind === 'end' || s.kind === 'title') ev.push({ t: s.start + 0.2, type: 'whoosh' }); continue; }
    const [a, b] = s.src;
    for (let i = 1; i < rows.length; i++) {
      const p = rows[i - 1], r = rows[i];
      if (r.t < a || r.t >= b || r.mode === undefined || p.mode === undefined) continue;
      const t = s.start + (r.t - a);
      if (r.jump) ev.push({ t, type: 'jump' });
      if (r.roar) ev.push({ t, type: 'roar' });
      if (r.level === p.level && r.coins > p.coins) ev.push({ t, type: 'coin' });
      if (r.herd > p.herd) ev.push({ t, type: 'rescue' });
      if (r.swim && !p.swim) ev.push({ t, type: 'splash' });
      if (r.level === p.level && r.hearts < p.hearts) ev.push({ t, type: 'hurt' });
      if (r.mode === 'levelUp' && p.mode !== 'levelUp') ev.push({ t, type: 'grow' });
      if (r.boss != null && p.boss != null && r.boss < p.boss) ev.push({ t, type: 'hit' });
      if (!r.climb && p.climb) ev.push({ t, type: 'climb' });
    }
    if (s.scene === 'who') ev.push({ t: s.start + 0.1, type: 'pop' });
  }
  return ev;
}

async function overlayPage(browser, cfg) {
  const page = await browser.newPage();
  await page.setViewport({ width: cfg.W, height: cfg.H, deviceScaleFactor: 1 });
  await page.goto(fileUrl(path.join(__dirname, 'overlay.html')));
  await page.evaluate(c => window.setup(c), cfg);
  return page;
}

async function makeVideo(browser, name) {
  const spec = EDIT[name], { W, H } = spec;
  const { segs, total } = timeline(spec);
  const tmp = path.join(OUT, 'tmp'); fs.mkdirSync(tmp, { recursive: true });
  const images = {};
  for (const [k, v] of Object.entries(spec.images || {})) images[k] = fileUrl(still(v.t, v.crop, path.join(tmp, `${name}-${k}.png`)));
  const cfg = { format: name, W, H, panel: spec.panel, segments: segs, images };
  console.log(`${name}: ${segs.length} segments, ${total.toFixed(2)} s`);

  // 1) gameplay base: each clip trimmed, cropped and placed; cards are plain black (the overlay covers them)
  const base = path.join(tmp, `${name}-base.mp4`);
  const parts = [], labels = [];
  segs.forEach((s, i) => {
    const d = (s.end - s.start).toFixed(4);
    if (s.src) {
      const [cx, cy, cw, ch] = s.crop || [0, 0, 1920, 1080];
      const P = spec.panel || { x: 0, y: 0, w: W, h: H };
      parts.push(`[0:v]trim=start=${s.src[0]}:end=${s.src[1]},setpts=PTS-STARTPTS,crop=${cw}:${ch}:${cx}:${cy},scale=${P.w}:${P.h}:flags=lanczos,` +
        `pad=${W}:${H}:${P.x}:${P.y}:black,setsar=1,fps=${FPS}[v${i}]`);
    } else {
      parts.push(`color=c=black:s=${W}x${H}:r=${FPS}:d=${d},setsar=1[v${i}]`);
    }
    labels.push(`[v${i}]`);
  });
  const fc = parts.join(';') + `;${labels.join('')}concat=n=${segs.length}:v=1:a=0[out]`;
  if (!stills) run('ffmpeg', ['-y', '-loglevel', 'error', '-i', path.join(TAKE, 'take.mkv'), '-filter_complex', fc, '-map', '[out]',
    '-c:v', 'libx264', '-preset', 'fast', '-crf', '10', '-pix_fmt', 'yuv420p', base]);

  const page = await overlayPage(browser, cfg);
  const shot = async t => { await page.evaluate(t => window.renderFrame(t), t); return page.screenshot({ type: 'png', omitBackground: true }); };

  if (stills) {   // composite sample frames (one per segment) for checking
    const dir = path.join(OUT, 'frames'); fs.mkdirSync(dir, { recursive: true });
    for (const s of segs) {
      const t = Math.min(s.end - 0.05, s.start + Math.min(1.6, (s.end - s.start) * 0.6));
      const png = path.join(tmp, 'ov.png'); fs.writeFileSync(png, await shot(t));
      const out = path.join(dir, `${name}-${t.toFixed(1)}s.jpg`);
      if (s.src) {
        const [cx, cy, cw, ch] = s.crop || [0, 0, 1920, 1080], P = spec.panel || { x: 0, y: 0, w: W, h: H };
        run('ffmpeg', ['-y', '-loglevel', 'error', '-ss', String(s.src[0] + (t - s.start)), '-i', path.join(TAKE, 'take.mkv'), '-i', png, '-frames:v', '1', '-filter_complex',
          `[0:v]crop=${cw}:${ch}:${cx}:${cy},scale=${P.w}:${P.h},pad=${W}:${H}:${P.x}:${P.y}:black[b];[b][1:v]overlay`, '-q:v', '3', out]);
      } else run('ffmpeg', ['-y', '-loglevel', 'error', '-i', png, '-q:v', '3', out]);
    }
    await page.close(); return;
  }

  // 2) music + effects
  const wav = path.join(tmp, `${name}.wav`);
  const endCard = segs.find(s => s.kind === 'end');
  music(wav, total, { events: events(segs), endAt: endCard ? endCard.start + 0.3 : total - 2, seed: spec.seed || 7 });

  // 3) overlay frames (PNG with alpha) piped into ffmpeg on top of the base, plus audio
  const mp4 = path.join(OUT, spec.file);
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-i', base, '-f', 'image2pipe', '-c:v', 'png', '-framerate', String(FPS), '-i', '-', '-i', wav,
    '-filter_complex', '[0:v][1:v]overlay=format=auto,scale=out_color_matrix=bt709:out_range=tv,format=yuv420p[v]', '-map', '[v]', '-map', '2:a',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '17', '-profile:v', 'high', '-level:v', spec.level || '4.1', '-g', '60', '-bf', '2',
    '-color_range', 'tv', '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709',
    '-r', String(FPS), '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-shortest', '-movflags', '+faststart', mp4], { stdio: ['pipe', 'inherit', 'inherit'] });
  const done = new Promise((ok, fail) => ff.on('close', c => (c ? fail(new Error('ffmpeg exit ' + c)) : ok())));
  const frames = Math.round(total * FPS);
  for (let f = 0; f < frames; f++) {
    const img = await shot(f / FPS);
    if (!ff.stdin.write(img)) await new Promise(r => ff.stdin.once('drain', r));
    if (f % 150 === 0) console.log(`${name}: overlay frame ${f}/${frames}`);
  }
  ff.stdin.end(); await done; await page.close();
  console.log('made', mp4);
}

async function makeThumb(browser) {
  const spec = EDIT.thumb, tmp = path.join(OUT, 'tmp'); fs.mkdirSync(tmp, { recursive: true });
  const images = { thumbBg: fileUrl(still(spec.bg.t, spec.bg.crop, path.join(tmp, 'thumb-bg.png'))) };
  const page = await overlayPage(browser, { format: 'thumb', W: 1280, H: 720, images });
  await page.evaluate(() => window.renderFrame(0));
  await page.screenshot({ path: path.join(OUT, 'rex-thumbnail.png'), type: 'png' });
  await page.close();
  console.log('made', path.join(OUT, 'rex-thumbnail.png'));
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: true,
    args: ['--hide-scrollbars', '--force-color-profile=srgb', '--allow-file-access-from-files'] });
  try {
    const list = which.length ? which : ['short', 'trailer', 'thumb'];
    for (const w of list) w === 'thumb' ? await makeThumb(browser) : await makeVideo(browser, w);
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exit(1); });
