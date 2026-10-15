// Pencil-sketch drawing library for "Rex Adventures" (storybook episodes).
// Everything is drawn with Canvas2D from code: jittered graphite strokes, cross-hatching, paper grain,
// and (in colour mode) soft watercolour washes under the same lines. Pure functions of time and a seed,
// so every frame can be re-rendered exactly. Lines "boil" (re-jitter) a few times a second like hand animation.
(function () {
  const A = {};
  let ctx = null, COLOR = false, BOIL = 0;
  A.use = (c, opts = {}) => { ctx = c; COLOR = !!opts.color; };
  A.setBoil = t => { BOIL = Math.floor(t * 8) % 3; };   // 8 redraws a second, 3 variants
  A.isColor = () => COLOR;
  A.ctx = () => ctx;

  /* ---------- randomness (seeded) ---------- */
  const fract = v => v - Math.floor(v);
  const rnd = (seed, i = 0) => fract(Math.sin(seed * 12.9898 + i * 78.233 + BOIL * 37.719) * 43758.5453);
  const rndS = (seed, i = 0) => fract(Math.sin(seed * 12.9898 + i * 78.233) * 43758.5453);   // stable (no boil)
  A.rnd = rndS;

  /* ---------- palette ---------- */
  const PAL = {
    graphite: 'rgba(40,38,36,', paper: '#f4f1ea',
    // colour mode washes
    sky: '#cfe3ee', skyWarm: '#f6e2c4', cloud: '#ffffff', mountain: '#b9c7cf', cliff: '#c8b9a4', cliffDark: '#a89880',
    jungle: '#8fbf7a', jungleDark: '#5f9a5c', fern: '#79b064', palm: '#6fa35a', trunk: '#a0815e', ground: '#d9c49f',
    rock: '#b8ada0', rockDark: '#978b7d', water: '#9fd0e6', mud: '#c79f5f', leaf: '#7fb85f', leafDark: '#4f8f45',
    rex: '#8cc77d', rexDark: '#5f9c58', belly: '#f2e7c4', spot: '#5c8f55', eyeW: '#ffffff', mouth: '#c96a6a', tongue: '#e48c8c',
    egg: '#f3ead2', eggSpot: '#c7b48c', nest: '#b58e5f', nestDark: '#8a6a43',
  };
  A.PAL = PAL;
  // in black-and-white mode every wash becomes a light grey of similar value
  function wash(col) {
    if (COLOR) return col;
    const m = col.match(/^#(..)(..)(..)$/);
    if (!m) return col;
    const [r, g, b] = [1, 2, 3].map(i => parseInt(m[i], 16));
    const l = Math.round(0.3 * r + 0.59 * g + 0.11 * b);
    const v = Math.round(255 - (255 - l) * 0.42);   // lighter, pencil-shading feel
    return `rgb(${v},${v},${v - 2})`;
  }
  A.wash = wash;

  /* ---------- paper ---------- */
  let paperTile = null;
  A.paper = (W, H) => {
    if (!paperTile) {
      paperTile = document.createElement('canvas'); paperTile.width = 512; paperTile.height = 512;
      const p = paperTile.getContext('2d');
      p.fillStyle = PAL.paper; p.fillRect(0, 0, 512, 512);
      const img = p.getImageData(0, 0, 512, 512);
      for (let i = 0; i < img.data.length; i += 4) {
        const n = (rndS(3, i) - 0.5) * 18 + (rndS(9, (i >> 9)) - 0.5) * 6;
        img.data[i] += n; img.data[i + 1] += n; img.data[i + 2] += n - 1;
      }
      p.putImageData(img, 0, 0);
      p.strokeStyle = 'rgba(120,110,95,0.05)';
      for (let i = 0; i < 260; i++) { p.beginPath(); const x = rndS(4, i) * 512, y = rndS(5, i) * 512; p.moveTo(x, y); p.lineTo(x + 30 + rndS(6, i) * 60, y + (rndS(7, i) - 0.5) * 6); p.stroke(); }
    }
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = ctx.createPattern(paperTile, 'repeat'); ctx.fillRect(0, 0, W, H);
    ctx.restore();
  };

  /* ---------- geometry ---------- */
  A.ellipsePts = (cx, cy, rx, ry, n = 28, rot = 0, wob = 0, seed = 1) => {
    const pts = [];
    for (let i = 0; i < n; i++) {
      const a = i / n * Math.PI * 2, w = 1 + (wob ? (rndS(seed, i) - 0.5) * wob : 0);
      const x = Math.cos(a) * rx * w, y = Math.sin(a) * ry * w;
      pts.push([cx + x * Math.cos(rot) - y * Math.sin(rot), cy + x * Math.sin(rot) + y * Math.cos(rot)]);
    }
    return pts;
  };
  // blob from polar radius function r(angle)
  A.blobPts = (cx, cy, rf, n = 32) => Array.from({ length: n }, (_, i) => { const a = i / n * Math.PI * 2, r = rf(a); return [cx + Math.cos(a) * r[0], cy + Math.sin(a) * r[1]]; });

  function trace(pts, closed, jit, seed, pass) {
    // Catmull-Rom through jittered points
    const P = pts.map((p, i) => [p[0] + (rnd(seed + pass * 7, i) - 0.5) * jit, p[1] + (rnd(seed + pass * 7 + 3, i) - 0.5) * jit]);
    const n = P.length;
    ctx.beginPath();
    if (n < 2) return;
    ctx.moveTo(P[0][0], P[0][1]);
    const last = closed ? n : n - 1;
    for (let i = 0; i < last; i++) {
      const p0 = P[(i - 1 + n) % n], p1 = P[i], p2 = P[(i + 1) % n], p3 = P[(i + 2) % n];
      const a0 = closed || i > 0 ? p0 : p1, a3 = closed || i + 2 < n ? p3 : p2;
      ctx.bezierCurveTo(p1[0] + (p2[0] - a0[0]) / 6, p1[1] + (p2[1] - a0[1]) / 6, p2[0] - (a3[0] - p1[0]) / 6, p2[1] - (a3[1] - p1[1]) / 6, p2[0], p2[1]);
    }
    if (closed) ctx.closePath();
  }
  A.trace = trace;

  // graphite line: 2 passes; long strokes are split into pieces of varying weight with small breaks,
  // so they read as hand-drawn pencil rather than an even vector outline
  A.line = (pts, o = {}) => {
    const { closed = false, w = 2.2, dark = 0.85, jit = 1.6, seed = 1, passes = 2 } = o;
    ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const n = pts.length;
    const pieces = n >= 10 ? 3 + Math.floor(rndS(seed, 99) * 2) : 1;
    for (let k = 0; k < passes; k++) {
      if (pieces === 1) {
        trace(pts, closed, jit * (k ? 1.6 : 1), seed, k);
        ctx.lineWidth = w * (k ? 0.6 : 1); ctx.strokeStyle = PAL.graphite + (dark * (k ? 0.5 : 1)) + ')'; ctx.stroke();
        continue;
      }
      const all = closed ? pts.concat([pts[0]]) : pts, m = all.length;
      for (let q = 0; q < pieces; q++) {
        const i0 = Math.floor(q * (m - 1) / pieces), i1 = Math.floor((q + 1) * (m - 1) / pieces);
        const gap = k === 0 && rndS(seed, q + 7) < 0.35 ? 1 : 0;   // a small break now and then
        const seg = all.slice(i0, Math.max(i0 + 2, i1 + 1 - gap));
        trace(seg, false, jit * (k ? 1.6 : 1), seed + q * 3, k);
        const wv = 0.75 + rndS(seed, q + 30) * 0.65;
        ctx.lineWidth = w * wv * (k ? 0.6 : 1); ctx.strokeStyle = PAL.graphite + Math.min(1, dark * (0.85 + wv * 0.15) * (k ? 0.5 : 1)) + ')'; ctx.stroke();
      }
    }
    ctx.restore();
  };
  // watercolour / grey wash fill
  A.fill = (pts, col, o = {}) => {
    const { alpha = 0.9, seed = 1, jit = 2 } = o;
    ctx.save();
    trace(pts, true, jit, seed + 50, 0);
    ctx.globalAlpha = alpha; ctx.fillStyle = wash(col); ctx.fill();
    if (COLOR) {   // second, offset wash for a watercolour edge
      ctx.globalAlpha = alpha * 0.25; ctx.translate(1.5, 1.5); trace(pts, true, jit * 2, seed + 60, 0); ctx.fill();
    }
    ctx.restore();
  };
  // hatching inside a shape (clip): angle varies per object, strokes of random length, optional cross-hatch
  A.hatch = (pts, o = {}) => {
    const { angle = -0.9, gap = 7, dark = 0.35, w = 1.1, seed = 3, cross = false } = o;
    const ang0 = angle + (rndS(seed, 501) - 0.5) * 0.7, gp = gap * (0.85 + rndS(seed, 502) * 0.4);
    const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
    const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
    ctx.save();
    trace(pts, true, 0, seed, 0); ctx.clip();
    ctx.strokeStyle = PAL.graphite + dark + ')'; ctx.lineWidth = w; ctx.lineCap = 'round';
    const R = Math.hypot(x1 - x0, y1 - y0) / 2 + 4, cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
    for (const ang of cross ? [ang0, ang0 + 1.3] : [ang0]) {
      const dx = Math.cos(ang), dy = Math.sin(ang);
      for (let s2 = -R, i = 0; s2 < R; s2 += gp, i++) {
        const ox = -dy * s2, oy = dx * s2;
        // each hatch line is drawn as 1-2 dashes of random length
        let u = -R + rnd(seed, i) * R * 0.5;
        while (u < R) {
          const len = R * (0.4 + rnd(seed + 1, i + Math.round(u)) * 0.9), j = (rnd(seed, i) - 0.5) * 2;
          ctx.beginPath(); ctx.moveTo(cx + ox + dx * u + j, cy + oy + dy * u); ctx.lineTo(cx + ox + dx * Math.min(R, u + len), cy + oy + dy * Math.min(R, u + len) + j); ctx.stroke();
          u += len + R * 0.15 * rnd(seed + 2, i);
        }
      }
    }
    ctx.restore();
  };
  // shaded shape: wash + hatch on one side + outline
  A.shape = (pts, col, o = {}) => {
    A.fill(pts, col, o);
    if (o.shade !== false) {
      ctx.save();
      const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
      const x0 = Math.min(...xs), x1 = Math.max(...xs), y1 = Math.max(...ys), y0 = Math.min(...ys);
      // shade the lower-left part: clip to the shape, then to a band
      trace(pts, true, 0, 1, 0); ctx.clip();
      ctx.beginPath(); ctx.ellipse(x0 + (x1 - x0) * 0.25, y1, (x1 - x0) * 0.75, (y1 - y0) * 0.55, 0, 0, Math.PI * 2); ctx.clip();
      A.hatch(pts, { gap: o.gap || 6, dark: o.hdark ?? 0.28, seed: (o.seed || 1) + 9, angle: o.hangle ?? -0.85 });
      if (o.deep) { ctx.beginPath(); ctx.ellipse(x0 + (x1 - x0) * 0.15, y1, (x1 - x0) * 0.45, (y1 - y0) * 0.3, 0, 0, Math.PI * 2); ctx.clip(); A.hatch(pts, { gap: 5, dark: 0.32, seed: (o.seed || 1) + 19, angle: (o.hangle ?? -0.85) + 1.3 }); }
      ctx.restore();
    }
    if (o.line !== false) A.line(pts, { closed: true, w: o.w || 2.4, seed: o.seed || 1, dark: o.dark ?? 0.85, jit: o.jit ?? 1.4 });
  };

  // white rim highlight just inside the outline on the sun side (upper right): makes heroes pop, esp. in B&W
  A.rim = (pts, o = {}) => {
    const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
    const cx = (Math.min(...xs) + Math.max(...xs)) / 2, cy = (Math.min(...ys) + Math.max(...ys)) / 2;
    const arc = pts.filter(([x, y]) => (x - cx) * 0.6 - (y - cy) > 0).map(([x, y]) => [cx + (x - cx) * 0.9, cy + (y - cy) * 0.9]);
    if (arc.length > 2) { ctx.save(); ctx.globalAlpha = o.a ?? 0.85; ctx.lineWidth = o.w || 4; ctx.strokeStyle = '#ffffff'; ctx.lineCap = 'round'; trace(arc, false, 0.5, 9, 0); ctx.stroke(); ctx.restore(); }
  };

  /* ---------- nature ---------- */
  A.cloud = (x, y, s, seed) => {
    const pts = A.blobPts(x, y, a => { const b = 1 + 0.22 * Math.sin(a * 5 + seed) + 0.1 * Math.sin(a * 9 + seed * 2); return [110 * s * b, 34 * s * b * (Math.sin(a) > 0 ? 0.55 : 1)]; }, 40);
    A.fill(pts, PAL.cloud, { alpha: COLOR ? 0.85 : 0.5, seed });
    A.line(pts.slice(14, 40), { w: 1.4, dark: 0.45, seed });
  };
  A.mountains = (y, h, seed, col, dark = 0.5) => {
    const ridge = [];
    for (let i = 0; i <= 26; i++) {
      const x = -200 + i * 100, k = rndS(seed, i);
      ridge.push([x, y - h * (0.35 + 0.65 * Math.abs(Math.sin(i * 0.7 + seed))) * (0.6 + k * 0.4)]);
    }
    const pts = [[-200, y + 400], ...ridge, [2500, y + 400]];
    A.fill(pts, col, { alpha: COLOR ? 0.55 : 0.4, seed });
    // hatch just under the ridge line (light comes from the top)
    ctx.save(); trace(pts, true, 0, 1, 0); ctx.clip();
    const band = [...ridge, ...ridge.slice().reverse().map(([x, yy]) => [x, yy + 70])];
    A.hatch(band, { gap: 8, dark: dark * 0.3, angle: -1.1, seed: seed + 1 });
    ctx.restore();
    A.line(ridge, { w: 1.5, dark, seed });
  };
  // a band of round tree crowns (mid-ground jungle)
  A.canopy = (y, seed, col, dark = 0.6, t = 0) => {
    for (let i = 0; i < 22; i++) {
      const x = -120 + i * 105 + rndS(seed, i) * 40, r = 60 + rndS(seed, i + 30) * 40, cy = y - r * 0.4 + Math.sin(t * 0.7 + i) * 1.5;
      const pts = A.blobPts(x, cy, a => { const b = 1 + 0.12 * Math.sin(a * 6 + i); return [r * b, r * 0.8 * b]; }, 26);
      A.fill(pts, i % 2 ? col : PAL.jungleDark, { alpha: COLOR ? 0.9 : 0.75, seed: seed + i });
      A.hatch(pts, { gap: 7, dark: dark * 0.35, angle: -0.8, seed: seed + i + 40 });
      A.line(pts.slice(14, 26).concat(pts.slice(0, 4)), { w: 1.6, dark, seed: seed + i });
    }
    A.fill([[-200, y], [2200, y], [2200, y + 400], [-200, y + 400]], PAL.jungleDark, { alpha: COLOR ? 0.85 : 0.7, seed, jit: 0 });
  };
  A.palm = (x, y, h, seed, t = 0, sway = 1) => {
    const bend = Math.sin(t * 0.8 + seed) * 0.04 * sway;
    const top = [x + h * (0.18 + bend), y - h];
    const trunk = [[x - 6, y], [x + h * 0.06, y - h * 0.5], [top[0] - 4, top[1]], [top[0] + 4, top[1]], [x + h * 0.06 + 8, y - h * 0.5], [x + 8, y]];
    A.shape(trunk, PAL.trunk, { seed, w: 1.8, gap: 5 });
    for (let i = 0; i < 6; i++) {   // trunk rings
      const f = (i + 1) / 7, px = x + (top[0] - x) * f + 1, py = y - h * f;
      A.line([[px - 7, py], [px + 7, py - 2]], { w: 1.2, dark: 0.5, seed: seed + i });
    }
    for (let i = 0; i < 7; i++) {   // fronds
      const a = -Math.PI / 2 + (i - 3) * 0.55 + Math.sin(t * 1.3 + i + seed) * 0.05 * sway, len = h * (0.45 + rndS(seed, i) * 0.15);
      const tip = [top[0] + Math.cos(a) * len, top[1] + Math.sin(a) * len * 0.6 + len * 0.25];
      const mid = [top[0] + Math.cos(a) * len * 0.5, top[1] + Math.sin(a) * len * 0.45 - 10];
      const leaf = [top, [mid[0] - Math.sin(a) * 12, mid[1] - 6], tip, [mid[0] + Math.sin(a) * 12, mid[1] + 10]];
      A.fill(leaf, i % 2 ? PAL.palm : PAL.jungleDark, { alpha: 0.9, seed: seed + i });
      A.line([top, mid, tip], { w: 1.6, seed: seed + i, dark: 0.7 });
      for (let k = 1; k < 7; k++) {
        const f = k / 7, bx = top[0] + (tip[0] - top[0]) * f, by = top[1] + (tip[1] - top[1]) * f + Math.sin(f * Math.PI) * (mid[1] - (top[1] + tip[1]) / 2);
        A.line([[bx, by], [bx + Math.cos(a + 1.2) * 16, by + 14]], { w: 1, dark: 0.45, seed: seed + k, passes: 1 });
      }
    }
  };
  A.fern = (x, y, s, seed, t = 0, flip = 1, sway = 1) => {
    for (let i = 0; i < 5; i++) {
      const a = -Math.PI / 2 + (i - 2) * 0.42 * flip + Math.sin(t * 1.6 + seed + i) * 0.05 * sway, len = (70 + rndS(seed, i) * 50) * s;
      const tip = [x + Math.cos(a) * len, y + Math.sin(a) * len];
      const bow = [x + Math.cos(a) * len * 0.55 + 12 * flip, y + Math.sin(a) * len * 0.55 + 4];
      A.line([[x, y], bow, tip], { w: 1.6, dark: 0.75, seed: seed + i });
      for (let k = 1; k < 9; k++) {
        const f = k / 9, px = x + (tip[0] - x) * f + Math.sin(f * Math.PI) * 10 * flip, py = y + (tip[1] - y) * f;
        const l = (1 - f) * 22 * s + 6;
        for (const sd of [-1, 1]) {
          const leaf = [[px, py], [px + Math.cos(a + sd * 1.1) * l * 0.6, py + Math.sin(a + sd * 1.1) * l * 0.6 - 3], [px + Math.cos(a + sd * 0.9) * l, py + Math.sin(a + sd * 0.9) * l]];
          A.fill([[px, py], ...leaf.slice(1), [px + Math.cos(a + sd * 0.7) * l * 0.5, py + Math.sin(a + sd * 0.7) * l * 0.5 + 3]], k % 2 ? PAL.fern : PAL.jungleDark, { alpha: 0.85, seed: seed + k });
          A.line(leaf, { w: 1, dark: 0.55, seed: seed + k * 3 + sd, passes: 1 });
        }
      }
    }
  };
  A.rock = (x, y, w, h, seed, col = PAL.rock, o = {}) => {
    const pts = A.blobPts(x, y - h / 2, a => { const b = 1 + (rndS(seed, Math.round(a * 3)) - 0.5) * 0.22; const flat = Math.sin(a) > 0.2 ? 0.92 : 1; return [w / 2 * b, h / 2 * b * flat]; }, 22);
    A.shape(pts, col, { seed, gap: o.gap || 6, w: o.w || 2.2, ...o });
    if (o.cracks !== false) A.line([[x - w * 0.15, y - h * 0.75], [x - w * 0.05, y - h * 0.55], [x - w * 0.12, y - h * 0.38]], { w: 1.1, dark: 0.5, seed: seed + 5, passes: 1 });
    return pts;
  };
  A.leaf = (x, y, s, rot, seed, col = PAL.leaf, o = {}) => {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s * (o.curl ?? 1));
    const pts = [[0, 0], [30, -16], [70, -14], [100, 0], [70, 14], [30, 16]];
    A.fill(pts, col, { seed, alpha: 0.95 });
    A.line(pts, { closed: true, w: 2 / s, seed });
    A.line([[0, 0], [100, 0]], { w: 1.4 / s, seed: seed + 1, dark: 0.6 });
    for (let i = 1; i < 6; i++) { const px = i * 16; A.line([[px, 0], [px + 10, -10 + i * 0.5]], { w: 1 / s, dark: 0.45, seed: seed + i, passes: 1 }); A.line([[px, 0], [px + 10, 10 - i * 0.5]], { w: 1 / s, dark: 0.45, seed: seed + i + 9, passes: 1 }); }
    ctx.restore();
  };
  A.ground = (y, seed, W = 2200) => {
    const pts = [[-200, y]];
    for (let i = 0; i <= 24; i++) pts.push([-200 + i * 100, y + Math.sin(i * 0.9 + seed) * 8 + rndS(seed, i) * 6]);
    pts.push([2400, 1600], [-200, 1600]);
    A.fill(pts, PAL.ground, { seed, alpha: 0.95 });
    A.line(pts.slice(1, -2), { w: 2, seed, dark: 0.7 });
    for (let i = 0; i < 60; i++) {   // little pebbles and grass ticks
      const gx = -150 + rndS(seed + 2, i) * W, gy = y + 20 + rndS(seed + 3, i) * 300;
      if (i % 3) A.line([[gx, gy], [gx + 4, gy - 10]], { w: 1, dark: 0.4, seed: i, passes: 1 });
      else A.line(A.ellipsePts(gx, gy, 6, 3.5, 8), { closed: true, w: 1, dark: 0.45, seed: i, passes: 1 });
    }
  };
  A.waterfall = (x, y, w, h, t, seed) => {
    const pts = [[x, y], [x + w, y], [x + w * 1.08, y + h], [x - w * 0.08, y + h]];
    A.fill(pts, PAL.water, { alpha: COLOR ? 0.75 : 0.35, seed });
    ctx.save(); trace(pts, true, 0, 1, 0); ctx.clip();
    ctx.strokeStyle = PAL.graphite + '0.35)'; ctx.lineWidth = 1.2;
    for (let i = 0; i < 18; i++) {
      const lx = x + (i + 0.5) / 18 * w, off = ((t * 220 + rndS(seed, i) * h) % (h + 120)) - 120;
      ctx.beginPath(); ctx.moveTo(lx, y + off); ctx.lineTo(lx + 2, y + off + 60 + rndS(seed, i + 40) * 50); ctx.stroke();
    }
    ctx.restore();
    // mist at the bottom
    for (let i = 0; i < 9; i++) {
      const mx = x - 30 + i * (w + 60) / 8, my = y + h - 6 + Math.sin(t * 1.5 + i) * 5;
      A.fill(A.ellipsePts(mx, my, 34, 16, 12), '#ffffff', { alpha: COLOR ? 0.7 : 0.6, seed: seed + i });
    }
  };
  A.cliff = (x, y, w, h, seed, col = PAL.cliff) => {
    const pts = [[x, y + 40]];
    for (let i = 0; i <= 10; i++) pts.push([x + w * (i / 10) + (i === 0 ? 30 : i === 10 ? -30 : 0), y - h + 20 * Math.abs(i - 5) / 5 + Math.sin(i * 1.7 + seed) * 6 + rndS(seed, i) * 6]);
    pts.push([x + w, y + 40]);
    A.fill(pts, col, { alpha: 0.9, seed });
    A.hatch(pts, { gap: 8, dark: 0.22, angle: -1.25, seed: seed + 3 });
    for (let i = 0; i < 7; i++) {   // rock strata
      const sy = y - h * (0.15 + i * 0.12);
      A.line([[x + 10, sy + rndS(seed, i) * 10], [x + w * 0.5, sy - 8 + rndS(seed, i + 9) * 10], [x + w - 10, sy + 4]], { w: 1.1, dark: 0.3, seed: seed + i, passes: 1 });
    }
    A.line(pts.slice(1, -1), { w: 2, dark: 0.75, seed });
    return pts;
  };

  /* ---------- rain, drops, sparkles ---------- */
  A.rain = (W, H, t, amount, seed = 1, glow = false) => {
    ctx.save(); ctx.lineCap = 'round';
    const n = Math.floor(amount * 420);
    for (let i = 0; i < n; i++) {
      const sp = 900 + rndS(seed, i) * 500, x = (rndS(seed + 1, i) * (W + 300) + t * 120) % (W + 300) - 150, y = (rndS(seed + 2, i) * (H + 200) + t * sp) % (H + 200) - 100;
      const len = 18 + amount * 22;
      ctx.strokeStyle = glow ? `rgba(${COLOR ? '120,170,220' : '90,90,90'},0.55)` : (COLOR ? `rgba(70,95,130,${0.35 + amount * 0.3})` : PAL.graphite + (0.3 + amount * 0.3) + ')');
      ctx.lineWidth = 1.3 + amount * 1.2;
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - len * 0.15, y + len); ctx.stroke();
    }
    ctx.restore();
  };
  A.glowDrop = (x, y, r, a = 1) => {   // a twinkling raindrop: gold-white core, soft glow, a 4-point twinkle
    ctx.save(); ctx.globalAlpha = a;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r * 4.5);
    g.addColorStop(0, COLOR ? 'rgba(255,240,170,0.95)' : 'rgba(255,255,255,1)'); g.addColorStop(0.4, COLOR ? 'rgba(255,230,150,0.45)' : 'rgba(255,255,255,0.6)'); g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r * 4.5, 0, 7); ctx.fill();
    ctx.strokeStyle = COLOR ? 'rgba(255,235,160,0.9)' : 'rgba(255,255,255,0.95)'; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(x - r * 3, y); ctx.lineTo(x + r * 3, y); ctx.moveTo(x, y - r * 3); ctx.lineTo(x, y + r * 3); ctx.stroke();
    const pts = [[x, y - r * 1.6], [x + r, y + r * 0.3], [x, y + r], [x - r, y + r * 0.3]];
    A.fill(pts, COLOR ? '#fff6cf' : '#ffffff', { alpha: 1, seed: 3 });
    A.line(pts, { closed: true, w: 1.2, dark: 0.6, seed: 4, passes: 1 });
    ctx.fillStyle = 'rgba(255,255,255,0.95)'; ctx.beginPath(); ctx.arc(x - r * 0.3, y, r * 0.25, 0, 7); ctx.fill();
    ctx.restore();
  };
  A.sparkle = (x, y, r, a = 1) => {
    ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = PAL.graphite + '0.6)'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(x - r, y); ctx.lineTo(x + r, y); ctx.moveTo(x, y - r); ctx.lineTo(x, y + r); ctx.stroke();
    ctx.restore();
  };
  A.windLines = (W, H, t, strength, seed = 1) => {
    ctx.save(); ctx.lineCap = 'round';
    for (let i = 0; i < Math.round(6 + strength * 10); i++) {
      const y = rndS(seed, i) * H * 0.8 + 40, x = ((rndS(seed + 1, i) * (W + 600)) + t * (300 + strength * 500)) % (W + 600) - 300;
      ctx.strokeStyle = PAL.graphite + (0.15 + strength * 0.2) + ')'; ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.moveTo(x, y);
      ctx.bezierCurveTo(x + 60, y - 12, x + 120, y + 12, x + 180 + strength * 80, y - 4); ctx.stroke();
      if (i % 3 === 0) { ctx.beginPath(); ctx.arc(x + 200 + strength * 80, y - 14, 10, Math.PI * 0.5, Math.PI * 2.1); ctx.stroke(); }
    }
    ctx.restore();
  };

  /* ---------- eggs and nest ---------- */
  A.egg = (x, y, s, rot, seed, crack = 0, o = {}) => {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
    const pts = A.blobPts(0, -40, a => [30 * (Math.sin(a) > 0 ? 1.06 : 0.92), 40], 30);
    A.fill(pts, PAL.egg, { seed, alpha: 0.95 });
    A.hatch(pts, { gap: 6, dark: 0.18, seed: seed + 2, angle: -0.8 });
    for (let i = 0; i < 9; i++) A.fill(A.ellipsePts((rndS(seed, i) - 0.5) * 40, -40 + (rndS(seed, i + 9) - 0.5) * 55, 3.5, 2.6, 8), PAL.eggSpot, { alpha: 0.9, seed: seed + i });
    A.line(pts, { closed: true, w: 2.4 / s, seed });
    if (crack > 0) {   // a zig-zag crack that grows around the egg
      const cp = [];
      const n = Math.round(2 + crack * 8);
      for (let i = 0; i <= n; i++) cp.push([-28 + i * (56 / 8), -44 + (i % 2 ? -7 : 6)]);
      A.line(cp, { w: 2.2 / s, dark: 0.95, seed: seed + 7 });
      if (o.peek) { ctx.fillStyle = 'rgba(30,30,30,0.85)'; ctx.beginPath(); ctx.ellipse(6, -48, 9, 4, 0, 0, 7); ctx.fill(); }
    }
    ctx.restore();
  };
  A.shell = (x, y, s, rot, seed, top = false) => {   // half eggshell (bottom bowl or top cap)
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
    const pts = top
      ? [[-30, 0], [-26, -16], [-14, -28], [0, -32], [14, -28], [26, -16], [30, 0], [20, -6], [12, 2], [2, -6], [-8, 2], [-18, -6]]
      : [[-30, -30], [-20, -24], [-10, -32], [0, -24], [10, -32], [20, -24], [30, -30], [28, -10], [16, 2], [0, 5], [-16, 2], [-28, -10]];
    A.fill(pts, PAL.egg, { seed, alpha: 0.95 });
    for (let i = 0; i < 4; i++) A.fill(A.ellipsePts((rndS(seed, i) - 0.5) * 36, top ? -16 : -12, 3, 2, 8), PAL.eggSpot, { seed: seed + i });
    A.line(pts, { closed: true, w: 2.2 / s, seed });
    ctx.restore();
  };
  A.nest = (x, y, s, rot, seed) => {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
    const bowl = A.blobPts(0, -20, a => [120, Math.sin(a) > 0 ? 34 : 24], 34);
    A.fill(bowl, PAL.nest, { seed, alpha: 0.95 });
    A.hatch(bowl, { gap: 5, dark: 0.3, seed: seed + 1, angle: -0.4, cross: true });
    for (let i = 0; i < 28; i++) {   // twigs
      const a0 = rndS(seed, i) * Math.PI, r = 100 + rndS(seed, i + 30) * 26;
      const p0 = [Math.cos(a0) * r, -20 + Math.sin(a0) * 20 - 4], p1 = [p0[0] + (rndS(seed, i + 60) - 0.5) * 90, p0[1] + (rndS(seed, i + 90) - 0.5) * 18];
      A.line([p0, [(p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2 - 4], p1], { w: 1.8, dark: 0.7, seed: seed + i, passes: 1 });
    }
    A.line(bowl, { closed: true, w: 2.4, seed });
    ctx.restore();
  };

  /* ---------- text cards (storybook narration) ---------- */
  A.card = (W, H, te, en, a = 1, o = {}) => {
    if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a;
    const y = o.y ?? H * 0.5;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.font = `700 ${o.te || 58}px 'Nirmala UI', 'Noto Sans Telugu', sans-serif`;
    ctx.fillStyle = o.light ? '#fbf8f0' : '#2a2724';
    ctx.fillText(te, W / 2, y - (o.gap || 38));
    ctx.font = `${o.en || 52}px 'Patrick Hand', 'Segoe Print', cursive`;
    ctx.fillStyle = o.light ? 'rgba(251,248,240,0.85)' : '#5a554e';
    ctx.fillText(en, W / 2, y + (o.gap || 38));
    ctx.restore();
  };

  window.ART = A;
})();
