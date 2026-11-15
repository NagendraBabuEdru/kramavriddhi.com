/* Append new cards to units in tracks.js without touching existing IDs.
   Usage: node merge_cards.js <tracks.js> <additions.js> */
const fs = require('fs');
const path = process.argv[2], header = fs.readFileSync(path, 'utf8').split('window.KV_TRACKS')[0];
global.window = {};
require(path);
const T = window.KV_TRACKS, ADD = require(require('path').resolve(process.argv[3]));
const before = new Map();
T.tracks.forEach(t => t.units.forEach(u => u.cards.forEach(c => before.set(c.id, JSON.stringify(c)))));
let added = 0;
Object.keys(ADD).forEach(uid => {
  let unit = null, track = null;
  T.tracks.forEach(t => t.units.forEach(u => { if (u.id === uid) { unit = u; track = t; } }));
  if (!unit) throw new Error('no unit ' + uid);
  let last = unit.cards.reduce((m, c) => Math.max(m, +c.id.split('.').pop()), 0);
  ADD[uid].forEach(c => {
    const card = Object.assign({ t: c.t, topic: track.topic }, c);
    card.id = uid + '.' + (++last);
    unit.cards.push(card); added++;
  });
});
/* safety: every old card is unchanged */
T.tracks.forEach(t => t.units.forEach(u => u.cards.forEach(c => { if (before.has(c.id) && before.get(c.id) !== JSON.stringify(c)) throw new Error('changed ' + c.id); })));
before.forEach((v, id) => { let found = false; T.tracks.forEach(t => t.units.forEach(u => u.cards.forEach(c => { if (c.id === id) found = true; }))); if (!found) throw new Error('lost ' + id); });
let s = header + 'window.KV_TRACKS = {\n  goal: ' + T.goal + ',\n  levels: ' + JSON.stringify(T.levels) + ',\n  tracks: [\n';
s += T.tracks.map(tr => '    { id: ' + JSON.stringify(tr.id) + ', name: ' + JSON.stringify(tr.name) + ', topic: ' + JSON.stringify(tr.topic) + ', blurb: ' + JSON.stringify(tr.blurb) + ', units: [\n' +
  tr.units.map(u => '      { id: ' + JSON.stringify(u.id) + ', level: ' + JSON.stringify(u.level) + ', n: ' + u.n + ', title: ' + JSON.stringify(u.title) + ', cards: [' +
    (u.cards.length ? '\n' + u.cards.map(c => '        ' + JSON.stringify(c)).join(',\n') + '\n      ' : '') + '] }').join(',\n') + '\n    ] }').join(',\n') + '\n  ]\n};\n';
fs.writeFileSync(path, s);
let total = 0, liveU = 0; T.tracks.forEach(t => t.units.forEach(u => { total += u.cards.length; if (u.cards.length) liveU++; }));
console.log('added', added, '| total cards', total, '| live units', liveU, '| old cards unchanged:', before.size);
