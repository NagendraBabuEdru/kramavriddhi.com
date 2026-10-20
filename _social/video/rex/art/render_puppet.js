// Renders puppet.html to an mp4: node render_puppet.js <out.mp4> <seconds> [still-times,comma]
const puppeteer = require('puppeteer-core'), path = require('path'), { spawn } = require('child_process');
const [out, secs = '6', stills = ''] = process.argv.slice(2);
(async () => {
  const b = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--allow-file-access-from-files', '--disable-gpu'] });
  const p = await b.newPage(); await p.setViewport({ width: 1920, height: 1080 });
  p.on('pageerror', e => console.log('pageerror', e.message));
  await p.goto('file:///' + path.join(__dirname, process.env.PAGE || 'puppet.html').split(path.sep).join('/'));
  await p.evaluate(() => window.ready);
  for (const t of stills.split(',').filter(Boolean)) { await p.evaluate(t => window.renderFrame(t), +t); await p.screenshot({ path: out.replace('.mp4', `-${t}.png`) }); }
  if (+secs > 0) {
    const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-c:v', 'mjpeg', '-framerate', '30', '-i', '-', '-vf', 'format=yuv420p', '-c:v', 'libx264', '-crf', '18', '-movflags', '+faststart', out], { stdio: ['pipe', 'inherit', 'inherit'] });
    const done = new Promise(r => ff.on('close', r));
    for (let f = 0; f < +secs * 30; f++) { await p.evaluate(t => window.renderFrame(t), f / 30); const img = await p.screenshot({ type: 'jpeg', quality: 92 }); if (!ff.stdin.write(img)) await new Promise(r => ff.stdin.once('drain', r)); }
    ff.stdin.end(); await done; console.log(out);
  }
  await b.close();
})();
