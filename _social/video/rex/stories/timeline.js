// Prints each episode's length (and the long episode's chapter start times) without rendering.
// usage: node timeline.js
const fs = require('fs'), path = require('path');
global.window = {}; global.document = {};
for (const f of ['engine.js', 'episodes.js', 'classic.js']) new Function('window', 'document', fs.readFileSync(path.join(__dirname, f), 'utf8'))(global.window, global.document);
const list = require('./episodes_list');
const mmss = t => `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(Math.floor(t % 60)).padStart(2, '0')}`;
for (const [id, m] of Object.entries(list)) {
  if (m.dev) continue;
  const S = window.EPISODES[id]({ W: m.W, H: m.H });
  console.log(id.padEnd(7), mmss(S.duration), S.duration.toFixed(1) + ' s', S.chapters ? 'chapters: ' + S.chapters.map(mmss).join(' ') : '');
}
