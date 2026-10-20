// Renders a round 5 motion clip: the mp4 (Rex at s = 1.6, 30 fps, no audio) + the frame strip pages + the guides strip + the arc paths.
// usage: node dclip.js <outdir> <clip-name> [what: clip,strip,guides,paths]
const puppeteer = require('puppeteer-core'), path = require('path'), { spawn } = require('child_process');
const [out, name, what = 'clip,strip,guides,paths'] = process.argv.slice(2);
const FPS = 30;
(async () => {
  const b = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--allow-file-access-from-files', '--disable-gpu', '--force-color-profile=srgb'] });
  const p = await b.newPage(); await p.setViewport({ width: 1920, height: 1080 });
  p.on('pageerror', e => console.log('pageerror', e.message));
  const go = async q => { await p.goto('file:///' + path.join(__dirname, 'sketch.html').split(path.sep).join('/') + q);
    await p.evaluate(async () => { await Promise.all(["40px 'Patrick Hand'"].map(f => document.fonts.load(f))); await document.fonts.ready; }); };
  const W = what.split(',');
  await go(`?ep=r5:${name}`);
  const N = await p.evaluate(n => window.MOTION.clips[n].frames, name);
  if (W.includes('clip')) {
    const mp4 = path.join(out, `r5-${name}.mp4`);
    const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-c:v', 'mjpeg', '-framerate', String(FPS), '-i', '-',
      '-vf', 'scale=in_range=full:out_range=tv:out_color_matrix=bt709,format=yuv420p', '-c:v', 'libx264', '-crf', '18', '-r', String(FPS), '-movflags', '+faststart', mp4], { stdio: ['pipe', 'inherit', 'inherit'] });
    const done = new Promise((ok, no) => ff.on('close', c => c ? no(new Error('ffmpeg ' + c)) : ok()));
    for (let f = 0; f <= N; f++) { await p.evaluate(t => window.renderFrame(t, true), f / FPS); const img = await p.screenshot({ type: 'jpeg', quality: 92 }); if (!ff.stdin.write(img)) await new Promise(r => ff.stdin.once('drain', r)); }
    ff.stdin.end(); await done; console.log(mp4);
  }
  const pages = Math.ceil((Math.floor(N / 2) + 1) / 36);
  for (const [k, mode] of [['strip', 'normal'], ['guides', 'guides']]) if (W.includes(k)) for (let pg = 0; pg < pages; pg++) {
    await go(`?ep=r5:${name}:strip&mode=${mode}&page=${pg}`); await p.evaluate(() => window.renderFrame(0, true));
    const f = path.join(out, `r5-${name}-${k === 'guides' ? 'guides' : 'strip'}${pages > 1 ? '-p' + (pg + 1) : ''}.png`); await p.screenshot({ path: f }); console.log(f);
  }
  if (W.includes('paths')) { await go(`?ep=r5:${name}:paths`); await p.evaluate(() => window.renderFrame(0, true)); const f = path.join(out, `r5-${name}-paths.png`); await p.screenshot({ path: f }); console.log(f); }
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });
