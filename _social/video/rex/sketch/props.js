// Extra props for the Rex Adventures episodes (same pencil style as art.js):
// beetle, wooden plank signs, big taro leaf, jungle tree with a branch, mushroom, puddle, river water,
// waterfall mist, rainbow, sun, distant birds, torn-paper narration strip, ripple rings.
(function () {
  const A = window.ART, P = A.PAL;
  const rs = A.rnd;
  const C = () => A.ctx();

  A.beetle = (x, y, s, o = {}) => {
    const ctx = C(); const { t = 0, walk = 0, wings = 0, flip = false, rot = 0 } = o;
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s * (flip ? -1 : 1), s);
    // legs (2-frame walk cycle)
    const ph = Math.floor(walk * 8) % 2 ? 1 : -1;
    for (let i = 0; i < 3; i++) {
      const lx = -10 + i * 10;
      A.line([[lx, -6], [lx - 6 + ph * 3 * (i % 2 ? 1 : -1), 4]], { w: 2, seed: 300 + i, passes: 1 });
    }
    if (wings > 0) {   // wing cases open, little blurred wings
      for (const sd of [-1, 1]) {
        ctx.save(); ctx.rotate(-wings * 0.9 * (sd > 0 ? 1 : 0.6));
        A.fill(A.ellipsePts(-4, -18, 14, 6 + Math.sin(t * 60) * 3, 12), '#ffffff', { alpha: 0.6, seed: 310 });
        ctx.restore();
      }
    }
    const shell = A.ellipsePts(0, -10, 16, 11, 18);
    A.fill(shell, A.isColor() ? '#3f6fa8' : '#6a6a6a', { seed: 320 });
    A.line([[0, -21], [0, 0]], { w: 1.2, seed: 321, passes: 1 });
    ctx.save(); ctx.globalAlpha = 0.85; ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.ellipse(-6, -15, 4, 2.5, -0.5, 0, 7); ctx.fill(); ctx.restore();
    A.line(shell, { closed: true, w: 2, seed: 322 });
    A.fill(A.ellipsePts(16, -8, 7, 6, 10), A.isColor() ? '#2c4b73' : '#4a4a4a', { seed: 323 });
    A.line(A.ellipsePts(16, -8, 7, 6, 10), { closed: true, w: 1.8, seed: 324, passes: 1 });
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(19, -10, 2.2, 0, 7); ctx.fill();
    ctx.fillStyle = '#111'; ctx.beginPath(); ctx.arc(19.6, -10, 1.1, 0, 7); ctx.fill();
    const aw = Math.sin(t * 6) * 3;
    A.line([[20, -13], [26, -22 + aw], [31, -24 + aw]], { w: 1.2, seed: 325, passes: 1 });
    A.line([[18, -13], [21, -23 - aw], [25, -27 - aw]], { w: 1.2, seed: 326, passes: 1 });
    ctx.restore();
  };

  // wooden plank sign with text; text may be Telugu (Nirmala UI) or English (chunky)
  A.plank = (x, y, w, h, text, o = {}) => {
    const ctx = C(); const { rot = 0, font = "400 64px 'Lilita One'", seed = 400, ropes = false, sub = null, subFont = null } = o;
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
    if (ropes) { A.line([[-w * 0.3, -h / 2], [-w * 0.3, -h / 2 - 60]], { w: 2, seed: seed + 9 }); A.line([[w * 0.3, -h / 2], [w * 0.3, -h / 2 - 60]], { w: 2, seed: seed + 10 }); }
    const pts = [[-w / 2, -h / 2 + 4], [-w / 4, -h / 2 - 3], [w / 4, -h / 2 + 2], [w / 2 + 8, -h / 2 - 2], [w / 2, 0], [w / 2 + 6, h / 2], [0, h / 2 + 3], [-w / 2 - 6, h / 2 - 2], [-w / 2 + 4, 0]];
    A.fill(pts, '#d8b98c', { seed, alpha: 1 });
    for (let i = 0; i < 6; i++) {   // wood grain
      const gy = -h / 2 + (i + 0.6) * h / 6.2;
      A.line([[-w / 2 + 10, gy], [-w * 0.1, gy + (rs(seed, i) - 0.5) * 6], [w / 2 - 10, gy + (rs(seed, i + 9) - 0.5) * 4]], { w: 1, dark: 0.35, seed: seed + i, passes: 1 });
    }
    A.line(pts, { closed: true, w: 3, seed: seed + 20 });
    for (const nx of [-w / 2 + 16, w / 2 - 16]) { ctx.fillStyle = 'rgba(40,36,30,0.85)'; ctx.beginPath(); ctx.arc(nx, -h / 2 + 14, 4, 0, 7); ctx.fill(); }
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    const ty = sub ? -h * 0.14 : 2;
    ctx.font = font; ctx.lineJoin = 'round';
    ctx.lineWidth = 7; ctx.strokeStyle = 'rgba(40,36,30,0.95)'; ctx.strokeText(text, 0, ty);
    ctx.fillStyle = '#fbf6ea'; ctx.fillText(text, 0, ty);
    if (sub) { ctx.font = subFont || "36px 'Patrick Hand'"; ctx.fillStyle = 'rgba(40,36,30,0.95)'; ctx.fillText(sub, 0, h * 0.27); }
    ctx.restore();
  };

  // torn-paper strip for narration lines (Telugu first, English below)
  A.paperStrip = (cx, cy, w, h, te, en, a = 1, o = {}) => {
    if (a <= 0) return;
    const ctx = C(); ctx.save(); ctx.globalAlpha = a;
    const pts = [];
    for (let i = 0; i <= 16; i++) pts.push([cx - w / 2 + i * w / 16, cy - h / 2 + (rs(500, i) - 0.5) * 8]);
    for (let i = 16; i >= 0; i--) pts.push([cx - w / 2 + i * w / 16, cy + h / 2 + (rs(501, i) - 0.5) * 8]);
    A.fill(pts, '#fbf8f0', { seed: 502, alpha: 0.96, jit: 0 });
    A.line(pts, { closed: true, w: 1.4, dark: 0.45, seed: 503, passes: 1 });
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.font = `700 ${o.te || 56}px 'Nirmala UI', 'Noto Sans Telugu', sans-serif`; ctx.fillStyle = '#2b2824';
    ctx.fillText(te, cx, cy - h * 0.18);
    ctx.font = `${o.en || 46}px 'Patrick Hand', cursive`; ctx.fillStyle = '#5e574e';
    ctx.fillText(en, cx, cy + h * 0.24);
    ctx.restore();
  };

  // big elephant-ear (taro) leaf; bend rotates it from the base; raft = lying flat
  A.taro = (x, y, s, o = {}) => {
    const ctx = C(); const { bend = 0, raft = false, seed = 600, curl = 0 } = o;
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    if (raft) {
      const pts = A.blobPts(0, 0, a => [170 * (1 + 0.05 * Math.sin(a * 3)), 34], 30);
      A.fill(pts, P.leaf, { seed, alpha: 1 });
      A.line(pts, { closed: true, w: 3.4, seed });
      A.line([[-160, 0], [160, 0]], { w: 2, dark: 0.6, seed: seed + 1 });
      for (let i = -4; i <= 4; i++) A.line([[i * 34, 0], [i * 34 + 20, -22]], { w: 1.3, dark: 0.45, seed: seed + 10 + i, passes: 1 });
      ctx.restore(); return;
    }
    A.line([[0, 0], [-10, -80], [-6 + bend * 40, -170]], { w: 6, seed: seed + 2 });   // stem
    ctx.translate(-6 + bend * 40, -170); ctx.rotate(-0.4 + bend + curl);
    const pts = [[0, 0], [-60, -40], [-80, -140], [-30, -250], [20, -300], [40, -230], [70, -120], [50, -30]];
    A.fill(pts, P.leaf, { seed: seed + 3, alpha: 0.98 });
    A.hatch(pts, { gap: 7, dark: 0.22, seed: seed + 4, angle: -0.5 });
    A.line(pts, { closed: true, w: 3, seed: seed + 5 });
    A.line([[0, 0], [10, -150], [20, -296]], { w: 2, dark: 0.7, seed: seed + 6 });
    for (let i = 1; i < 7; i++) {
      const vy = -i * 40;
      A.line([[6 + i * 1.5, vy], [-40 + i * 2, vy - 30]], { w: 1.3, dark: 0.45, seed: seed + 10 + i, passes: 1 });
      A.line([[6 + i * 1.5, vy], [50 - i * 2, vy - 26]], { w: 1.3, dark: 0.45, seed: seed + 20 + i, passes: 1 });
    }
    ctx.restore();
  };

  // jungle tree with a long branch (the leaf hangs from its tip)
  A.tree = (x, y, s, seed = 700, t = 0, branchUp = 0) => {
    const ctx = C(); ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    const trunk = [[-40, 0], [-30, -300], [-20, -620], [20, -620], [30, -300], [44, 0]];
    A.shape(trunk, P.trunk, { seed, gap: 6 });
    for (let i = 0; i < 9; i++) A.line([[-24 + rs(seed, i) * 30, -40 - i * 64], [-10 + rs(seed, i + 9) * 30, -60 - i * 64]], { w: 1.2, dark: 0.45, seed: seed + i, passes: 1 });
    const by = -480 - branchUp;
    const branch = [[10, -470], [140, -500 - branchUp * 0.5], [260, by - 10], [262, by + 2], [140, -486 - branchUp * 0.5], [14, -450]];
    A.shape(branch, P.trunk, { seed: seed + 1, shade: false });
    for (let i = 0; i < 6; i++) {   // crown
      const r = 120 + rs(seed, i + 20) * 60, cx = -60 + (i % 3) * 90 + rs(seed, i) * 30, cy = -700 - (i > 2 ? 110 : 0) + Math.sin(t * 0.8 + i) * 2;
      const pts = A.blobPts(cx, cy, a => { const b = 1 + 0.1 * Math.sin(a * 7 + i); return [r * b, r * 0.75 * b]; }, 28);
      A.fill(pts, i % 2 ? P.jungle : P.jungleDark, { seed: seed + i + 30, alpha: 0.95 });
      A.hatch(pts, { gap: 7, dark: 0.25, seed: seed + i + 40 });
      A.line(pts, { closed: true, w: 2, seed: seed + i + 50, dark: 0.7 });
    }
    ctx.restore();
    return [x + 262 * s, y + by * s];   // branch tip in world space
  };

  A.mushroom = (x, y, s, seed = 800) => {
    const ctx = C(); ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    A.shape([[-14, 0], [-10, -60], [10, -60], [16, 0]], '#efe4cf', { seed, shade: false });
    const cap = [[-80, -50], [-60, -100], [0, -124], [60, -100], [80, -50], [0, -58]];
    A.fill(cap, A.isColor() ? '#d9826b' : '#9a9a9a', { seed: seed + 1 });
    A.hatch(cap, { gap: 6, dark: 0.2, seed: seed + 2 });
    for (let i = 0; i < 5; i++) A.fill(A.ellipsePts(-50 + i * 25, -86 - Math.sin(i / 4 * Math.PI) * 18, 8, 5, 10), '#fbf6ea', { seed: seed + 10 + i });
    A.line(cap, { closed: true, w: 2.6, seed: seed + 3 });
    ctx.restore();
  };

  A.puddle = (x, y, rx, ry, seed = 900) => {
    const pts = A.ellipsePts(x, y, rx, ry, 30, 0, 0.12, seed);
    A.fill(pts, A.PAL.water, { alpha: A.isColor() ? 0.8 : 0.5, seed });
    A.line(pts, { closed: true, w: 2, seed: seed + 1, dark: 0.6 });
    return pts;
  };
  A.ripples = (x, y, t0, t, n = 3, rmax = 70) => {
    const ctx = C();
    for (let i = 0; i < n; i++) {
      const q = (t - t0 - i * 0.35) / 1.2;
      if (q <= 0 || q >= 1) continue;
      ctx.save(); ctx.globalAlpha = 1 - q;
      A.line(A.ellipsePts(x, y, q * rmax, q * rmax * 0.32, 22), { closed: true, w: 1.6, seed: 910 + i, passes: 1, dark: 0.6 });
      ctx.restore();
    }
  };

  // a band of moving water between yTop and yBot; level animates, waves scroll with t
  A.water = (x0, x1, yTop, yBot, t, o = {}) => {
    const ctx = C(); const { amp = 10, speed = 120, foam = true, seed = 950, color = A.PAL.mud } = o;
    const pts = [];
    for (let x = x0; x <= x1 + 40; x += 40) pts.push([x, yTop + Math.sin((x - t * speed) * 0.012) * amp + Math.sin((x + t * speed * 0.6) * 0.03) * amp * 0.3]);
    const body = [...pts, [x1 + 40, yBot], [x0, yBot]];
    A.fill(body, color, { alpha: A.isColor() ? 0.92 : 0.55, seed, jit: 0 });
    ctx.save(); A.trace(body, true, 0, 1, 0); ctx.clip();
    ctx.strokeStyle = A.PAL.graphite + '0.35)'; ctx.lineWidth = 1.5;
    for (let i = 0; i < 40; i++) {   // flow lines
      const ly = yTop + 20 + rs(seed, i) * (yBot - yTop), lx = ((rs(seed + 1, i) * (x1 - x0 + 400) + t * speed * (0.8 + rs(seed, i + 40) * 0.6)) % (x1 - x0 + 400)) + x0 - 200;
      ctx.beginPath(); ctx.moveTo(lx, ly); ctx.bezierCurveTo(lx + 40, ly - 6, lx + 80, ly + 6, lx + 120, ly); ctx.stroke();
    }
    ctx.restore();
    A.line(pts, { w: 2.4, seed: seed + 2 });
    if (foam) for (let i = 0; i < pts.length; i += 2) {
      const [fx, fy] = pts[i];
      A.line([[fx - 10, fy - 2], [fx - 4, fy - 8], [fx + 4, fy - 4], [fx + 10, fy - 9]], { w: 1.4, dark: 0.5, seed: seed + 10 + i, passes: 1 });
    }
    return pts;
  };
  A.waterY = (x, yTop, t, o = {}) => { const { amp = 10, speed = 120 } = o; return yTop + Math.sin((x - t * speed) * 0.012) * amp + Math.sin((x + t * speed * 0.6) * 0.03) * amp * 0.3; };

  A.mist = (x, y, s, t, a = 1) => {
    const ctx = C(); ctx.save(); ctx.globalAlpha = a;
    for (let i = 0; i < 14; i++) {
      const mx = x + (rs(970, i) - 0.5) * 900 * s + Math.sin(t * 0.3 + i) * 20, my = y + (rs(971, i) - 0.5) * 260 * s - Math.abs(Math.sin(t * 0.2 + i)) * 20;
      const r = (120 + rs(972, i) * 120) * s * (1 + 0.05 * Math.sin(t * 0.4 + i));
      const g = ctx.createRadialGradient(mx, my, 0, mx, my, r);
      g.addColorStop(0, 'rgba(255,255,255,0.95)'); g.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(mx, my, r, 0, 7); ctx.fill();
    }
    ctx.restore();
  };
  A.rainbow = (x, y, r, a = 1) => {
    if (!A.isColor() || a <= 0) return;
    const ctx = C(); ctx.save(); ctx.globalAlpha = a * 0.45; ctx.lineWidth = 16;
    ['#f3a3a3', '#f6cf98', '#f4ef9c', '#a8e0a8', '#a3c8f0', '#c5a8ec'].forEach((c, i) => { ctx.strokeStyle = c; ctx.beginPath(); ctx.arc(x, y, r - i * 15, Math.PI * 1.08, Math.PI * 1.92); ctx.stroke(); });
    ctx.restore();
  };
  A.sun = (x, y, r, a = 1, fadeDisc = false) => {   // fadeDisc: the disc fades too (Episode 0 keeps its old look)
    if (fadeDisc && a <= 0.01) return;
    const ctx = C(); ctx.save(); ctx.globalAlpha = a;
    const g = ctx.createRadialGradient(x, y, r * 0.6, x, y, r * 2.6);
    g.addColorStop(0, A.isColor() ? 'rgba(255,236,170,0.8)' : 'rgba(255,255,255,0.9)'); g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r * 2.6, 0, 7); ctx.fill();
    A.fill(A.ellipsePts(x, y, r, r, 28), A.isColor() ? '#ffe9a8' : '#ffffff', { seed: 980, alpha: fadeDisc ? a : 1 });
    if (!fadeDisc || a > 0.5) A.line(A.ellipsePts(x, y, r, r, 28), { closed: true, w: 1.6, dark: 0.4, seed: 981, passes: 1 });
    ctx.restore();
  };
  A.birds = (x, y, s, t) => {
    for (let i = 0; i < 3; i++) {
      const bx = x + i * 40 * s, by = y + (i % 2) * 18 * s, f = Math.sin(t * 9 + i) * 6 * s;
      A.line([[bx - 12 * s, by - f], [bx, by], [bx + 12 * s, by - f]], { w: 1.6, seed: 990 + i, passes: 1 });
    }
  };
  // the big balanced rock on a tiny pebble; tilt in radians around the contact point
  A.balancedRock = (x, y, r, tilt, seed = 1000) => {
    const ctx = C(); ctx.save(); ctx.translate(x, y); ctx.rotate(tilt);
    const pts = A.blobPts(0, -r, a => { const b = 1 + (rs(seed, Math.round(a * 4)) - 0.5) * 0.12; return [r * 1.05 * b, r * 0.92 * b]; }, 26);
    A.shape(pts, P.rock, { seed, gap: 6 });
    A.line([[-r * 0.3, -r * 1.4], [-r * 0.1, -r * 1.1], [-r * 0.25, -r * 0.8]], { w: 1.3, dark: 0.5, seed: seed + 3, passes: 1 });
    ctx.restore();
  };
})();
