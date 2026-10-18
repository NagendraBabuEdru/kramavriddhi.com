// Renders design sheets to PNG: node dshot.js <outdir> <sheet> <name> [modes: color,bw,guides,silhouette]
const puppeteer = require('puppeteer-core'), path = require('path');
const [out, sheet, name, modes = 'color,bw,guides,silhouette'] = process.argv.slice(2);
(async () => {
  const b = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--allow-file-access-from-files'] });
  const p = await b.newPage(); await p.setViewport({ width: 1920, height: 1080 });
  p.on('pageerror', e => console.log('pageerror', e.message));
  for (const m of modes.split(',')) {
    const mode = m === 'guides' || m === 'silhouette' ? m : 'normal';
    await p.goto('file:///' + path.join(__dirname, 'sketch.html').split(path.sep).join('/') + `?ep=${sheet}&mode=${mode}`);
    await p.evaluate(async () => { await Promise.all(["120px 'Lilita One'", "40px 'Patrick Hand'", "700 50px 'Nirmala UI'"].map(f => document.fonts.load(f))); await document.fonts.ready; });
    await p.evaluate(c => window.renderFrame(0, c), m !== 'bw');
    const f = path.join(out, `${name}-${m}.png`); await p.screenshot({ path: f }); console.log(f);
  }
  await b.close();
})();
