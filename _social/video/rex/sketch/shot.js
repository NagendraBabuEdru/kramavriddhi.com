// Renders single frames of sketch.html to PNG/JPG (for model sheets and director reviews).
// usage: node shot.js <out-prefix> <t1,t2,...> [bw|color|both] [episode]
const puppeteer = require('puppeteer-core'), path = require('path');
const [out, times = '0', mode = 'both', ep = ''] = process.argv.slice(2);
(async () => {
  const b = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--allow-file-access-from-files', '--disable-gpu'] });
  const p = await b.newPage(); await p.setViewport({ width: 1920, height: 1080 });
  p.on('pageerror', e => console.log('pageerror', e.message));
  await p.goto('file:///' + path.join(__dirname, 'sketch.html').split(path.sep).join('/') + (ep ? '?ep=' + ep : ''));
  await p.evaluate(async () => { await Promise.all(["120px 'Lilita One'", "40px 'Patrick Hand'", "700 50px 'Nirmala UI'"].map(f => document.fonts.load(f))); await document.fonts.ready; });
  for (const t of times.split(',').map(Number)) for (const color of mode === 'both' ? [false, true] : [mode === 'color']) {
    await p.evaluate((t, color) => window.renderFrame(t, color), t, color);
    const f = `${out}-${t.toFixed(1)}-${color ? 'color' : 'bw'}.jpg`;
    await p.screenshot({ path: f, type: 'jpeg', quality: 88 });
    console.log(f);
  }
  await b.close();
})();
