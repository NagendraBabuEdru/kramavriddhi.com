// Joins chunk renders of an episode (made with render.js --from/--to) into one MP4 with the full soundtrack.
// usage: node join.js <episode> <bw|color> <t0,t1,t2,...>   e.g.  node join.js 1 color 0,115,230
const { execFileSync } = require('child_process');
const fs = require('fs'), path = require('path');
const [ep, mode, cuts] = process.argv.slice(2);
const OUT = path.join(__dirname, '..', '..', '..', 'videos', 'rex', 'adventures');
const NAMES = { 0: 'rex-adventures-ep0-rex-is-born', 1: 'rex-adventures-ep1-twinkling-rain' };
const base = path.join(OUT, `${NAMES[ep]}-${mode}`);
const t = cuts.split(',').map(Number);
const parts = t.slice(0, -1).map((a, i) => `${base}-${a}-${t[i + 1]}.mp4`);
for (const p of parts) if (!fs.existsSync(p)) throw new Error('missing ' + p);
const list = base + '-parts.txt';
fs.writeFileSync(list, parts.map(p => `file '${p.split(path.sep).join('/')}'`).join('\n'));
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', list, '-i', base + '.wav',
  '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-shortest', '-movflags', '+faststart', base + '.mp4'], { stdio: 'inherit' });
for (const p of parts) fs.unlinkSync(p);
fs.unlinkSync(list);
console.log('joined', base + '.mp4');
