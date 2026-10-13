// Injected into the game page before it loads (see capture.js).
// 1) Virtual time: requestAnimationFrame callbacks only run when the recorder calls __step(ms),
//    so every captured frame is exactly 1/30 s of game time, however slow the screenshots are.
// 2) Autopilot: reads the runner's state through the recording build's hook (window.rexState)
//    and presses the same buttons a player would: jump, hold jump to climb, roar, continue.
(() => {
  let vt = null, nextId = 1;
  const queue = new Map();
  window.requestAnimationFrame = cb => { const id = nextId++; queue.set(id, cb); return id; };
  window.cancelAnimationFrame = id => { queue.delete(id); };

  const G = 462, WATER = G + 16;        // ground line and water surface (stage px, 960x540)
  const ap = { on: false, holdUntil: 0, dialogDoneAt: null, lastLine: '', levelUpAt: null, jumps: 0, roars: 0,
               readPause: 1.0, levelUpPause: 2.5, overAt: null };
  window.__ap = ap;
  const cmd = c => window.rexCmd && window.rexCmd(c);

  function autopilot(now) {
    if (!ap.on || !window.rexState) return null;
    const s = JSON.parse(window.rexState());
    if (!s) return null;
    const r = s.rex, k = r.k, sec = now / 1000;
    const ev = { jump: false, roar: false };

    if (s.mode === 'levelUp') {
      if (s.growT >= 1) {
        if (ap.levelUpAt == null) ap.levelUpAt = sec;
        if (sec - ap.levelUpAt > ap.levelUpPause) { ap.levelUpAt = null; cmd('continue'); }
      }
      return { s, ev };
    }
    if (s.mode === 'over') {
      if (ap.overAt == null) ap.overAt = sec;
      if (sec - ap.overAt > 1.5) { ap.overAt = null; cmd('level:' + s.level); }
      return { s, ev };
    }
    if (s.mode !== 'play') return { s, ev };

    if (s.inDialog) {
      const key = s.speaker + '|' + s.dialogFull;
      if (key !== ap.lastLine) { ap.lastLine = key; ap.dialogDoneAt = null; }
      if (s.dialogText.length >= s.dialogFull.length) {
        if (ap.dialogDoneAt == null) ap.dialogDoneAt = sec;
        if (sec - ap.dialogDoneAt > ap.readPause) { cmd('next'); ap.dialogDoneAt = null; }
      }
      return { s, ev };
    }
    ap.lastLine = '';

    const speed = [300, 345, 365, 375][s.level] * (r.swim ? 0.72 : 1);
    const right = r.x + 44 * k, foot = r.x + 10 * k;
    const ttc = (gap, extra = 0) => gap / (speed + extra);
    const jump = () => { cmd('jump'); ap.holdUntil = sec + 0.5; ev.jump = true; ap.jumps++; };

    if (r.climb) { cmd('jump'); return { s, ev }; }   // hold jump to climb the vines faster
    if (sec > ap.holdUntil && r.vy > -50) cmd('release');

    const range = 220 + 90 * k;
    // Roar at raptors (stage 3+) and at Gnash when he is close
    if (s.roarUnlocked && r.roarCd <= 0) {
      // roar() hits things whose x is within rex.x + range + 30; raptors close in at ~500 px/s
      const raptor = s.ents.find(e => e.type === 'raptor' && e.x > r.x && e.x - r.x < range + 10);
      const boss = s.boss && !s.boss.dead && s.boss.x - r.x < range + 25;
      if (raptor || boss) { cmd('roar'); ev.roar = true; ap.roars++; return { s, ev }; }
    }

    const grounded = r.onGround || r.swim;
    let want = false, dbl = false, danger = false, coinJump = false;
    for (const e of s.ents) {
      const gap = e.l - right;
      if (['rock', 'bush', 'log', 'lava', 'raptor', 'fish'].includes(e.type)) {
        const extra = e.type === 'log' ? 70 : e.type === 'raptor' ? 150 : e.type === 'lava' ? 130 : 0;
        const t = ttc(gap, extra);
        if (e.type === 'fish') { if (r.swim && gap > -10 && gap < 70) want = true; continue; }
        if (t > -0.05 && t < 0.13) want = true;
        if (t >= 0.13 && t < 1.0) danger = true;
        // coming down onto a hazard: use Tiko's double jump
        if (!grounded && r.vy > 0 && r.jumps < 2 && s.herd.includes('tiko') && t > -0.15 && t < 0.3 && r.y > G - 120) dbl = true;
      }
      if (e.type === 'friend' && e.y < G - 100) {          // Pip flies: jump up to reach her
        const t = ttc(gap);
        if (t > 0.28 && t < 0.36) want = true;
      }
      if (e.type === 'coin' && e.y < G - 110 && e.y > G - 240) {
        const t = ttc(e.x - 13 - right);
        if (t > 0.24 && t < 0.3) coinJump = true;
      }
    }
    for (const tr of s.terrain) {
      for (const h of tr.holes) {
        const hx = tr.x + h * 30;
        const t = ttc(hx - foot);
        if (t > 0 && t < 0.09 && (tr.holes.includes(h - 1) ? false : true)) want = true;
      }
      if (tr.type === 'cliff' && tr.top > G - 120 && r.y > tr.top + 2) { // low ledge: hop up
        const t = ttc(tr.x - right);
        if (t > 0 && t < 0.2) want = true;
      }
    }
    if (coinJump && !danger) want = true;
    if (want && grounded) jump();
    else if (dbl) { cmd('jump'); ap.holdUntil = sec + 0.4; ev.jump = true; }
    return { s, ev };
  }

  // Advance game time by ms; returns a small summary for the recorder's log.
  window.__step = ms => {
    if (vt == null) vt = performance.now();
    vt += ms;
    let out = null;
    try { out = autopilot(vt); } catch (e) { out = { err: String(e) }; }
    const cbs = [...queue.values()]; queue.clear();
    for (const cb of cbs) { try { cb(vt); } catch (e) { console.error(e); } }
    if (!out || !out.s) return out && out.err ? { err: out.err } : null;
    const s = out.s;
    return { mode: s.mode, level: s.level, coins: s.coins, goal: s.goal, hearts: s.hearts, herd: s.herd.length,
             raptors: s.raptors, dialog: s.inDialog ? s.speaker : '', line: s.inDialog ? s.dialogFull.slice(0, 40) : '',
             swim: s.rex.swim, climb: s.rex.climb, carried: s.rex.carried, k: +s.rex.k.toFixed(2),
             jump: out.ev.jump, roar: out.ev.roar, boss: s.boss ? s.boss.hp : null };
  };
})();
