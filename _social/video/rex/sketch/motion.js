// Rex motion kit (round 5): reusable timing helpers, follow-through springs, blinks, and the clip/strip/paths sheets.
// Everything is a pure function of time t (seconds), so any frame renders the same on its own (springs integrate from frame 0).
// A clip:  MOTION.clip(name, { frames, at(t) -> { x, pose, fx?(T) } })
//   x     : Rex's world x in code units (travel); pose: the A.rex2 pose; fx(T): extra drawing (drops, spray), T maps code units to canvas.
// It registers three sheets: 'r5:<name>' (the clip, Rex at s = 1.6), 'r5:<name>:strip' (every 2nd frame; ?page=N), 'r5:<name>:paths' (arcs).
(function () {
  const A = window.ART, F = window.FILM, FPS = 30;
  const M = {};
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, u) => a + (b - a) * u;
  M.FPS = FPS; M.clamp = clamp; M.lerp = lerp;
  M.ease = { inout: u => u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2, out: u => 1 - (1 - u) * (1 - u), in: u => u * u, lin: u => u };
  // keyframes in FRAMES: [[f, v, ease?], ...] → value at frame f (numbers or arrays)
  M.kf = (f, keys) => {
    if (f <= keys[0][0]) return keys[0][1];
    for (let i = 1; i < keys.length; i++) {
      const [f1, v1, e] = keys[i], [f0, v0] = keys[i - 1];
      if (f <= f1) { const u = (M.ease[e || 'inout'])((f - f0) / (f1 - f0)); return Array.isArray(v0) ? v0.map((a, k) => lerp(a, v1[k], u)) : lerp(v0, v1, u); }
    }
    return keys[keys.length - 1][1];
  };
  // a damped spring following target(frame); natural frequency hz, damping ratio zeta. Integrated per frame from 0 (deterministic).
  M.spring = (target, f, hz = 3, zeta = 0.35, sub = 4) => {
    const w = 2 * Math.PI * hz, dt = 1 / FPS / sub; let x = target(0), v = 0;
    const n = Math.round(f * sub);
    for (let i = 1; i <= n; i++) { const g = target(i / sub); const a = w * w * (g - x) - 2 * zeta * w * v; v += a * dt; x += v * dt; }
    return x;
  };
  // §8.10 follow-through
  // tail: segment i follows the driver lagging 1.5 f × i, through a spring with ~15 % overshoot.
  // NOTE: returns per-segment offsets RELATIVE to the driver; add driver(f) to seg[0] (or use tail.up) for the absolute swing.
  M.tailSeg = (driver, f) => [1, 2, 3, 4].map(i => M.spring(g => driver(g - 1.5 * i), f, 2.6, 0.5) - (i > 1 ? M.spring(g => driver(g - 1.5 * (i - 1)), f, 2.6, 0.5) : driver(f)));
  // hat: 3 Hz, ζ 0.35 spring driven by the head's motion (rad and units), clamped ±0.15 rad / ±3 units
  M.hat = (headRot, headY, f) => ({ wob: clamp(M.spring(headRot, f, 3, 0.35) - headRot(f), -0.15, 0.15), dy: clamp(M.spring(headY, f, 3, 0.35) - headY(f), -3, 3) });
  // arms: 2 f lag with a 10 % overshoot spring
  M.arm = (driver, f) => M.spring(g => driver(g - 2), f, 3.2, 0.6);
  // §8.2 blinks: random interval 60–180 f, 20 % doubles. Returns the lid factor (1 open … 0 shut) at frame f.
  const BL = [1, 0.4, 0, 0.5, 1];
  M.blinkTimes = (seed, frames, extra = []) => {
    const out = [...extra]; let f = 20 + Math.floor(A.rnd(seed, 0) * 40);
    for (let k = 1; f < frames; k++) { out.push(f); if (A.rnd(seed, k * 7) < 0.2) out.push(f + 8); f += 60 + Math.floor(A.rnd(seed, k) * 120); }
    return out.sort((a, b) => a - b);
  };
  M.blink = (f, times) => { let v = 1; for (const b of times) { const d = Math.floor(f - b); if (d >= 0 && d < BL.length) v = Math.min(v, BL[d]); } return v; };
  // §8.1 idle breathing: returns pose pieces to merge (squash, bob, head lag, tail sway, arm sway, eye drift)
  M.idle = (f, seed = 3) => {
    const br = Math.sin(f / 72 * Math.PI * 2), brH = Math.sin((f - 4) / 72 * Math.PI * 2), brA = Math.sin((f - 6) / 72 * Math.PI * 2);
    const sway = g => Math.sin(g / 96 * Math.PI * 2) * 0.05;
    const drift = Math.floor(f / 75), lk = [0.15 + (A.rnd(seed, drift) - 0.5) * 0.16, (A.rnd(seed + 1, drift) - 0.5) * 0.16];
    const ts = M.tailSeg(sway, f); ts[0] += sway(f);   // tailSeg gives lags relative to the driver: add the driver at the root
    return { squash: -0.012 * br, bob: -0.6 * br, neckDrop: -1.2 * brH, armD: 0.04 * brA, tailSeg: ts, look: lk };
  };

  /* ---------- sheets ---------- */
  const MODE = () => new URLSearchParams(location.search).get('mode') || 'normal';
  const PAGE = () => +(new URLSearchParams(location.search).get('page') || 0);
  const base = { camera: [[0, 960, 540, 1]], wind: () => 0 };
  const label = (txt, x, y, size = 22, col = '#3a3530', al = 'center') => { const c = A.ctx(); c.save(); c.font = `${size}px 'Patrick Hand'`; c.fillStyle = col; c.textAlign = al; c.fillText(txt, x, y); c.restore(); };
  const groundLine = (x0, x1, y) => { const c = A.ctx(); c.save(); c.strokeStyle = 'rgba(42,39,36,0.5)'; c.lineWidth = 1.6; c.beginPath(); c.moveTo(x0, y); c.lineTo(x1, y); c.stroke(); c.restore(); };
  const CLIPS = {};
  M.clips = CLIPS;
  M.clip = (name, def) => {
    CLIPS[name] = def;
    const N = def.frames;
    const place = (t, ox, gy, s, x0) => { const r = def.at(t); A.rex2(ox + (r.x - x0) * s, gy, s, { t, ...r.pose }); if (r.fx) r.fx((x, y) => [ox + (x - x0) * s, gy + y * s], s, t); return A.rex2.stats || {}; };
    // the clip (for video): Rex at s = 1.6; travel shows against a fixed ground with tick marks every 40 units
    F.episode(`r5:${name}`, { ...base, duration: N / FPS, draw(t) {
      const s = 1.6, gy = 900, x0 = def.at(0).x, ox = def.ox ?? 760;
      groundLine(40, 1880, gy);
      const c = A.ctx(); c.save(); c.strokeStyle = 'rgba(42,39,36,0.35)'; c.lineWidth = 1.2; for (let k = -40; k < 60; k++) { const gx = ox + k * 40 * s; if (gx > 40 && gx < 1880) { c.beginPath(); c.moveTo(gx, gy); c.lineTo(gx, gy + 10); c.stroke(); } } c.restore();
      place(t, ox, gy, s, x0);
      label(`${name}   f ${Math.round(t * FPS)} / ${N}`, 60, 60, 30, '#3a3530', 'left');
    } });
    // the strip: every 2nd frame, 6 × 6 cells per page, Rex at s = 0.45; foot-lock ticks at each planted foot
    F.episode(`r5:${name}:strip`, { ...base, duration: 1, draw() {
      const s = 0.45, cw = 320, ch = 172, cells = [], x0 = def.at(0).x;
      for (let f = 0; f <= N; f += 2) cells.push(f);
      const pg = cells.slice(PAGE() * 36, PAGE() * 36 + 36);
      pg.forEach((f, k) => {
        const col = k % 6, row = Math.floor(k / 6), cx = col * cw, gy = row * ch + 150;
        groundLine(cx + 8, cx + cw - 8, gy);
        const st = place(f / FPS, cx + 110, gy, s, x0);
        const r = def.at(f / FPS), plant = r.plant || [];
        const c = A.ctx(); c.save(); c.lineWidth = 2.5;
        for (const [which, col2] of [['near', '#c62828'], ['far', '#1565c0']]) if (plant.includes(which) && st.feet && st.feet[which]) { c.strokeStyle = col2; c.beginPath(); c.moveTo(st.feet[which].x, gy + 2); c.lineTo(st.feet[which].x, gy + 14); c.stroke(); }
        c.restore();
        label(`f${f}${MODE() === 'guides' ? `  area ${st.area}` : ''}`, cx + cw / 2, gy + 20, 16);
      });
      if (cells.length > 36) label(`page ${PAGE() + 1} / ${Math.ceil(cells.length / 36)}`, 1880, 1070, 18, '#3a3530', 'right');
    } });
    // arcs: Rex at the first and last frames (faint), with the head-top, hat-centre and tail-tip paths over every frame
    F.episode(`r5:${name}:paths`, { ...base, duration: 1, draw() {
      const s = 1.6, gy = 900, x0 = def.at(0).x, ox = def.ox ?? 760, c = A.ctx(), P = { head: [], hat: [], tail: [] };
      groundLine(40, 1880, gy);
      for (let f = 0; f <= N; f++) {
        c.save(); c.beginPath(); c.rect(0, 0, 0, 0); c.clip(); const st = place(f / FPS, ox, gy, s, x0); c.restore();
        for (const k in P) if (st.track && st.track[k]) P[k].push([st.track[k].x, st.track[k].y, f]);
      }
      for (const f of [0, Math.round(N / 2), N]) { c.save(); c.globalAlpha = f === 0 ? 0.25 : f === N ? 0.55 : 0.15; place(f / FPS, ox, gy, s, x0); c.restore(); }
      const COL = { head: '#c62828', hat: '#ef8f00', tail: '#1565c0' };
      for (const k in P) { c.save(); c.strokeStyle = COL[k]; c.fillStyle = COL[k]; c.lineWidth = 2; c.beginPath(); P[k].forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.stroke();
        P[k].forEach(([x, y, f]) => { c.beginPath(); c.arc(x, y, 2.5, 0, 7); c.fill(); if (f % 4 === 0) { c.font = "13px 'Patrick Hand'"; c.fillText(f, x + 4, y - 4); } }); c.restore(); }
      label(`${name}: head top (red), hat centre (orange), tail tip (blue); numbers = frames`, 60, 60, 28, '#3a3530', 'left');
    } });
  };
  window.MOTION = M;
})();
