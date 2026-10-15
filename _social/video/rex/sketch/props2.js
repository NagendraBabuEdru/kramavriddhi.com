// Round-2 props (after the director's review): replaces the first versions in art.js / props.js.
// Opaque hero objects with a white sun-side rim; pencil outlines; shadow-side-only hatching.
(function () {
  const A = window.ART, P = A.PAL;
  const rs = A.rnd;
  const C = () => A.ctx();
  const O = { alpha: 1 };

  /* ---- the egg: a smooth oval (narrower top), cream with soft speckles; crack = jagged zigzag clipped to the egg ---- */
  const eggPts = (s) => A.blobPts(0, -40 * s, a => [30 * s * (0.93 + 0.07 * Math.sin(a)), 40 * s], 40);
  A.egg = (x, y, s, rot, seed, crack = 0, o = {}) => {
    const ctx = C(); ctx.save(); ctx.translate(x, y);
    if (o.shadow !== false) { ctx.fillStyle = 'rgba(40,35,30,0.22)'; ctx.beginPath(); ctx.ellipse(0, 2, 28 * s, 6 * s, 0, 0, 7); ctx.fill(); }
    // rolls about its centre, so it never sinks into the ground
    ctx.translate(0, -40 * s); ctx.rotate(rot); ctx.translate(0, 40 * s);
    const pts = eggPts(s);
    A.fill(pts, P.egg, { ...O, seed, jit: 0.8 });
    ctx.save(); A.trace(pts, true, 0, 1, 0); ctx.clip();
    ctx.beginPath(); ctx.ellipse(-12 * s, -14 * s, 30 * s, 30 * s, 0, 0, 7); ctx.clip();
    A.hatch(pts, { gap: 5, dark: 0.2, seed: seed + 2, angle: -0.7 });
    ctx.restore();
    for (let i = 0; i < 8; i++) A.fill(A.ellipsePts((rs(seed, i) - 0.5) * 36 * s, -40 * s + (rs(seed, i + 9) - 0.5) * 52 * s, 3.2 * s, 2.4 * s, 8), A.isColor() ? '#c8b3d6' : '#b0a89a', { ...O, seed: seed + i });
    ctx.save(); ctx.fillStyle = 'rgba(255,255,255,0.75)'; ctx.beginPath(); ctx.ellipse(10 * s, -58 * s, 6 * s, 10 * s, 0.5, 0, 7); ctx.fill(); ctx.restore();   // soft shine
    A.line(pts, { closed: true, w: 2.6, seed, jit: 0.6 });
    if (crack > 0) {
      ctx.save(); A.trace(pts, true, 0, 1, 0); ctx.clip();
      // jagged zigzag, uneven segments, around the upper third
      const zz = [[-32, -52], [-22, -61], [-15, -49], [-4, -64], [4, -53], [16, -65], [24, -52], [34, -60]].map(([px, py]) => [px * s, py * s]);
      const n = crack >= 1 ? zz.length : 6;   // first crack: 5 jagged segments; second: all the way round
      A.line(zz.slice(0, n), { w: 3, dark: 1, seed: seed + 7, jit: 0.4, passes: 1 });
      if (crack >= 1) { ctx.fillStyle = 'rgba(30,28,26,0.85)'; ctx.beginPath(); ctx.moveTo(-4 * s, -63 * s); ctx.lineTo(4 * s, -54 * s); ctx.lineTo(9 * s, -61 * s); ctx.closePath(); ctx.fill(); }
      ctx.restore();
    }
    ctx.restore();
    return pts;
  };
  // the egg opening: the top lifted like a lid above the zigzag, a soft dark gap, two big eyes and a brow peeking
  A.eggPeek = (x, y, s, lid, t, seedEye = 0) => {
    const ctx = C(); ctx.save(); ctx.translate(x, y);
    const pts = eggPts(s);
    // bottom part (below the zigzag)
    const zz = [[-31, -52], [-22, -61], [-15, -49], [-4, -64], [4, -53], [16, -65], [24, -52], [31, -60]].map(([px, py]) => [px * s, py * s]);
    ctx.save(); ctx.beginPath(); ctx.moveTo(-60 * s, 10 * s); zz.forEach(p => ctx.lineTo(p[0], p[1])); ctx.lineTo(60 * s, 10 * s); ctx.closePath(); ctx.clip();
    ctx.fillStyle = 'rgba(40,35,30,0.22)'; ctx.beginPath(); ctx.ellipse(0, 2, 28 * s, 6 * s, 0, 0, 7); ctx.fill();
    A.fill(pts, P.egg, { ...O, seed: 41 }); A.line(pts, { closed: true, w: 2.6, seed: 41 });
    ctx.restore();
    // the gap: soft dark shading (not solid black), with Rex's brow and eyes
    if (lid > 2) {
      const gy = -58 * s, gh = lid * 0.9;
      if (t > 112) {
        const a = Math.min(1, (t - 112) / 0.3), blink = t > 113 && t < 113.17;
        const look = t < 113.5 ? [0, 0] : t < 114.1 ? [-1, 0] : t < 114.7 ? [1, 0] : [0, 0.3];
        ctx.save(); ctx.globalAlpha = a;
        // top of his head / brow just visible
        A.fill(A.ellipsePts(0, gy - gh * 0.3, 27 * s, gh * 0.55 + 4 * s, 20), P.rex, { ...O, seed: 44 });
        for (let i = 0; i < 4; i++) A.fill(A.ellipsePts(-12 * s + i * 8 * s, gy - gh * 0.62, 2.2 * s, 1.6 * s, 8), P.spot, { ...O, seed: 48 + i });
        for (const ex of [-11, 11]) {
          const R = 6.6 * s * (t > 114 ? 1.1 : 1), cx = ex * s, cy = gy - gh * 0.25;
          if (blink) { A.line([[cx - R, cy], [cx + R, cy]], { w: 2.4, seed: 45, passes: 1 }); continue; }
          ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.ellipse(cx, cy, R, R * 0.95, 0, 0, 7); ctx.fill();
          ctx.lineWidth = 1.8; ctx.strokeStyle = 'rgba(30,28,26,0.9)'; ctx.stroke();
          const px = cx + look[0] * R * 0.35, py = cy + look[1] * R * 0.3;
          ctx.fillStyle = '#1b1a18'; ctx.beginPath(); ctx.arc(px, py, R * 0.55, 0, 7); ctx.fill();
          ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(px - R * 0.2, py - R * 0.22, R * 0.2, 0, 7); ctx.fill(); ctx.beginPath(); ctx.arc(px + R * 0.2, py + R * 0.18, R * 0.09, 0, 7); ctx.fill();
          A.line([[cx - R * 0.7, cy - R * 1.3], [cx, cy - R * 1.75], [cx + R * 0.7, cy - R * 1.3]], { w: 1.8, seed: 46 + ex, passes: 1, dark: 0.7 });
        }
        ctx.restore();
      }
      // the lid (top piece), lifted
      ctx.save(); ctx.translate(0, -lid);
      ctx.save(); ctx.beginPath(); ctx.moveTo(-60 * s, -120 * s); zz.forEach(p => ctx.lineTo(p[0], p[1])); ctx.lineTo(60 * s, -120 * s); ctx.closePath(); ctx.clip();
      A.fill(pts, P.egg, { ...O, seed: 42 }); A.rim(pts, { w: 3 * s }); A.line(pts, { closed: true, w: 2.6, seed: 42 });
      ctx.restore();
      ctx.save(); A.trace(pts, true, 0, 1, 0); ctx.clip(); A.line(zz, { w: 2.4, seed: 47, jit: 0.3, passes: 1 }); ctx.restore();
      ctx.restore();
    }
    ctx.restore();
  };
  // half eggshells (unchanged look, opaque)
  A.shell = (x, y, s, rot, seed, top = false) => {
    const ctx = C(); ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
    const pts = top
      ? [[-30, 0], [-26, -16], [-14, -28], [0, -32], [14, -28], [26, -16], [30, 0], [20, -7], [12, 2], [2, -8], [-8, 2], [-18, -7]]
      : [[-30, -30], [-20, -22], [-10, -34], [0, -24], [10, -34], [20, -22], [30, -30], [28, -10], [16, 2], [0, 5], [-16, 2], [-28, -10]];
    A.fill(pts, P.egg, { ...O, seed });
    for (let i = 0; i < 4; i++) A.fill(A.ellipsePts((rs(seed, i) - 0.5) * 36, top ? -16 : -12, 3, 2, 8), A.isColor() ? '#c8b3d6' : '#b0a89a', { ...O, seed: seed + i });
    A.line(pts, { closed: true, w: 2.2 / s, seed });
    ctx.restore();
  };

  /* ---- the nest: a twig bowl drawn in two halves (back rim behind the eggs, front rim in front) ---- */
  A.nestBack = (x, y, s, rot, seed) => {
    const ctx = C(); ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
    const back = A.blobPts(0, -34, a => [104, Math.sin(a) < 0 ? 22 : 14], 30).filter(p => p[1] <= -30);
    A.fill(A.ellipsePts(0, -40, 104, 30, 30), P.nestDark, { ...O, seed });
    for (let i = 0; i < 14; i++) { const a = Math.PI + (i / 13) * Math.PI, r = 98; A.line([[Math.cos(a) * r, -34 + Math.sin(a) * 22], [Math.cos(a) * r + 30, -40 + Math.sin(a) * 18]], { w: 2, dark: 0.65, seed: seed + i, passes: 1 }); }
    void back; ctx.restore();
  };
  A.nestFront = (x, y, s, rot, seed) => {
    const ctx = C(); ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
    const front = []; for (let i = 0; i <= 20; i++) { const a = i / 20 * Math.PI; front.push([Math.cos(a) * 114, -34 + Math.sin(a) * 52]); }
    for (let i = 20; i >= 0; i--) { const a = i / 20 * Math.PI; front.push([Math.cos(a) * 102, -40 + Math.sin(a) * 8]); }
    A.fill(front, P.nest, { ...O, seed });
    A.hatch(front, { gap: 5, dark: 0.3, seed: seed + 1, angle: -0.3, cross: true });
    for (let i = 0; i < 22; i++) {   // twigs sticking out of the bowl
      const a = rs(seed, i) * Math.PI, r = 96 + rs(seed, i + 30) * 18;
      const p0 = [Math.cos(a) * r, -30 + Math.sin(a) * 30], p1 = [p0[0] + (rs(seed, i + 60) - 0.5) * 80, p0[1] + (rs(seed, i + 90) - 0.5) * 16 - 4];
      A.line([p0, [(p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2 - 3], p1], { w: 1.9, dark: 0.75, seed: seed + i, passes: 1 });
    }
    A.line(front, { closed: true, w: 2.4, seed });
    ctx.restore();
  };

  /* ---- heart-shaped falling leaf with midrib and a white rim ---- */
  A.heartLeaf = (x, y, s, rot, seed = 71, o = {}) => {
    const ctx = C(); ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s * (o.flat || 1));
    const pts = [[0, 0], [22, -26], [52, -38], [84, -30], [104, -12], [112, 0], [104, 12], [84, 30], [52, 38], [22, 26]];
    A.fill(pts, A.isColor() ? '#9bd36a' : '#cfcfcf', { ...O, seed });
    A.hatch(pts.slice(5).concat([[0, 0]]), { gap: 5, dark: 0.22, seed: seed + 3, angle: 0.5 });
    A.rim(pts, { w: 4 / s * 0.6 });
    A.line(pts, { closed: true, w: 2.6 / s, seed });
    A.line([[-14, 0], [0, 0], [112, 0]], { w: 2 / s, seed: seed + 1, dark: 0.75 });
    for (let i = 1; i < 6; i++) { const px = i * 18; A.line([[px, 0], [px + 14, -16 + i]], { w: 1.2 / s, dark: 0.5, seed: seed + i, passes: 1 }); A.line([[px, 0], [px + 14, 16 - i]], { w: 1.2 / s, dark: 0.5, seed: seed + i + 9, passes: 1 }); }
    ctx.restore();
  };

  /* ---- the big elephant-ear (taro) leaf: low and broad, growing at the foot of the slope ----
     Its base sits on the ground at (x, y); the blade curves up and over toward the LEFT (the slope),
     a soft wall the egg rolls into. bend rotates the blade (cushion / hug), raft = lying flat on water. */
  A.taro = (x, y, s, o = {}) => {
    const ctx = C(); const { bend = 0, raft = false, seed = 600 } = o;
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    if (raft) {
      const pts = A.blobPts(0, 0, a => [170 * (1 + 0.06 * Math.sin(a * 3)), Math.sin(a) > 0 ? 30 : 22], 34);
      A.fill(pts, P.leaf, { ...O, seed }); A.rim(pts, { w: 4 });
      A.line(pts, { closed: true, w: 3.4, seed });
      A.line([[-160, -2], [150, 0]], { w: 2, dark: 0.6, seed: seed + 1 });
      for (let i = -4; i <= 4; i++) A.line([[i * 34, 0], [i * 34 + 24, -18]], { w: 1.3, dark: 0.45, seed: seed + 10 + i, passes: 1 });
      ctx.restore(); return;
    }
    // two short stems from the ground
    A.line([[0, 0], [-6, -40], [-22, -84]], { w: 6, seed: seed + 2 });
    A.line([[14, 0], [18, -30], [10, -60]], { w: 4, seed: seed + 3 });
    ctx.translate(-22, -84); ctx.rotate(-0.25 + bend);
    // broad heart blade, tip pointing up-left, curving over
    const pts = [[0, 0], [60, -40], [70, -120], [40, -210], [-20, -270], [-90, -290], [-150, -250], [-160, -190], [-130, -120], [-80, -60], [-30, -10]];
    A.fill(pts, P.leaf, { ...O, seed: seed + 3 });
    ctx.save(); A.trace(pts, true, 0, 1, 0); ctx.clip(); ctx.beginPath(); ctx.ellipse(-120, -120, 90, 150, 0, 0, 7); ctx.clip(); A.hatch(pts, { gap: 6, dark: 0.26, seed: seed + 4, angle: -0.4 }); ctx.restore();
    A.rim(pts, { w: 4 });
    A.line(pts, { closed: true, w: 3, seed: seed + 5 });
    A.line([[0, 0], [-40, -120], [-100, -260]], { w: 2.2, dark: 0.75, seed: seed + 6 });
    for (let i = 1; i < 6; i++) { const t = i / 6, mx = -t * 95, my = -t * 255; A.line([[mx, my], [mx + 58 - t * 20, my - 26]], { w: 1.3, dark: 0.45, seed: seed + 10 + i, passes: 1 }); A.line([[mx, my], [mx - 52 + t * 6, my + 18]], { w: 1.3, dark: 0.45, seed: seed + 20 + i, passes: 1 }); }
    ctx.restore();
  };
  // the leaf's lower blade edge in world space (beetle walk path) for a taro at (x, y, s)
  A.taroEdge = (x, y, s, u) => { const bx = x - 22 * s, by = y - 84 * s, a = -0.25; const px = -30 + (-130 + 30) * u, py = -10 + (-120 + 10) * u; return [bx + (px * Math.cos(a) - py * Math.sin(a)) * s, by + (px * Math.sin(a) + py * Math.cos(a)) * s]; };

  /* ---- rocks: the balanced boulder (rotates about its centre when rolling) and round pebbles ---- */
  A.boulder = (cx, cy, r, rot, seed = 1000) => {
    const ctx = C(); ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot);
    const pts = A.blobPts(0, 0, a => { const b = 1 + 0.035 * Math.sin(a * 3 + 1) + 0.02 * Math.sin(a * 5); return [r * 1.04 * b, r * 0.94 * b]; }, 32);
    A.fill(pts, P.rock, { ...O, seed });
    ctx.save(); A.trace(pts, true, 0, 1, 0); ctx.clip(); ctx.rotate(-rot); ctx.beginPath(); ctx.ellipse(-r * 0.35, r * 0.45, r * 0.95, r * 0.75, 0, 0, 7); ctx.clip();
    A.hatch(pts, { gap: 6, dark: 0.3, seed: seed + 1, angle: -0.8, cross: false });
    ctx.beginPath(); ctx.ellipse(-r * 0.5, r * 0.7, r * 0.55, r * 0.35, 0, 0, 7); ctx.clip(); A.hatch(pts, { gap: 5, dark: 0.3, seed: seed + 2, angle: 0.5 });
    ctx.restore();
    ctx.save(); ctx.rotate(-rot); A.rim(pts.map(([px, py]) => [px * Math.cos(rot) - py * Math.sin(rot), px * Math.sin(rot) + py * Math.cos(rot)]), { w: 4 }); ctx.restore();
    A.line(pts, { closed: true, w: 3, seed, dark: 0.95 });
    ctx.restore();
    return pts;
  };
  A.pebble = (x, y, r, rot, seed) => {
    const ctx = C(); ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
    const pts = A.blobPts(0, 0, a => { const b = 1 + (rs(seed, Math.round(a * 3)) - 0.5) * 0.18; return [r * b, r * 0.85 * b]; }, 14);
    A.fill(pts, seed % 2 ? P.rock : P.rockDark, { ...O, seed });
    ctx.save(); ctx.fillStyle = 'rgba(40,36,32,0.18)'; ctx.beginPath(); ctx.ellipse(-r * 0.25, r * 0.35, r * 0.7, r * 0.45, 0, 0, 7); ctx.fill(); ctx.restore();
    A.line(pts, { closed: true, w: 2, seed, passes: 1 });
    ctx.restore();
  };

  /* ---- scenery ---- */
  // mountains that run off both edges; reveal: the ridge line is drawn by the pencil (0..1), fill fades in behind it
  A.mountains = (y, h, seed, col, dark = 0.5, reveal = 1) => {
    const ctx = C();
    const ridge = [];
    for (let i = 0; i <= 64; i++) { const x = -2200 + i * 130, k = rs(seed, i); ridge.push([x, y - h * (0.3 + 0.7 * Math.abs(Math.sin(i * 0.55 + seed))) * (0.6 + k * 0.4)]); }
    const fillA = Math.max(0, Math.min(1, (reveal - 0.25) / 0.75));
    if (fillA > 0) {
      ctx.save(); ctx.globalAlpha = fillA;
      const pts = [...ridge, [ridge[ridge.length - 1][0], y + 500], [ridge[0][0], y + 500]];
      ctx.save(); A.trace(pts, true, 0, 1, 0); ctx.clip();
      const g = ctx.createLinearGradient(0, y - h, 0, y + 200);
      g.addColorStop(0, A.wash(col)); g.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = g; ctx.globalAlpha = fillA * (A.isColor() ? 0.75 : 0.6); ctx.fillRect(-3000, y - h - 50, 12000, h + 800);
      ctx.globalAlpha = fillA;
      const band = [...ridge, ...ridge.slice().reverse().map(([x, yy]) => [x, yy + 60])];
      A.hatch(band, { gap: 8, dark: dark * 0.32, angle: -1.1, seed: seed + 1 });
      ctx.restore(); ctx.restore();
    }
    const n = Math.max(2, Math.round(ridge.length * Math.min(1, reveal * 1.4)));
    A.line(ridge.slice(0, n), { w: 2, dark, seed });
  };
  A.cliff = (x, y, w, h, seed, col = P.cliff, notch = null) => {
    const ctx = C();
    const top = [];
    for (let i = 0; i <= 12; i++) { let ty = y - h + 22 * Math.abs(i - 6) / 6 + rs(seed, i) * 14; if (notch && Math.abs(x + w * i / 12 - notch) < w / 14) ty += 26; top.push([x + w * (i / 12) + (i === 0 ? 40 : i === 12 ? -40 : 0), ty]); }
    const pts = [[x, y + 60], ...top, [x + w, y + 60]];
    A.fill(pts, col, { ...O, seed });
    ctx.save(); A.trace(pts, true, 0, 1, 0); ctx.clip();
    // shadow side (left) cross-hatch, a few vertical strata and cracks, ledges
    ctx.save(); ctx.beginPath(); ctx.rect(x - 10, y - h - 50, w * 0.42, h + 200); ctx.clip(); A.hatch(pts, { gap: 7, dark: 0.26, seed: seed + 3, angle: -1.3, cross: true }); ctx.restore();
    for (let i = 0; i < 8; i++) { const sx = x + w * (0.08 + i * 0.12) + rs(seed, i) * 20; A.line([[sx, y - h + 40 + rs(seed, i + 3) * 60], [sx + 8, y - h * 0.6], [sx - 4, y - h * 0.25], [sx + 6, y + 20]], { w: 1.3, dark: 0.35, seed: seed + i, passes: 1 }); }
    for (let i = 0; i < 3; i++) { const ly = y - h * (0.3 + i * 0.22), lx = x + w * (0.2 + rs(seed, i + 20) * 0.5); A.line([[lx, ly], [lx + 90, ly + 4]], { w: 2, dark: 0.6, seed: seed + 30 + i, passes: 1 }); }
    ctx.restore();
    A.line(top, { w: 2.4, dark: 0.85, seed });
    A.line([[x, y + 60], top[0]], { w: 2.2, seed: seed + 1 }); A.line([top[12], [x + w, y + 60]], { w: 2.2, seed: seed + 2 });
    return top;
  };
  // waterfall from a notch at (x, yTop): falls straight, widens a little, white streaks scroll down, foam puffs at the base
  A.waterfall = (x, yTop, w, h, t, seed) => {
    const ctx = C();
    const pts = [[x - w / 2, yTop], [x + w / 2, yTop], [x + w * 0.62, yTop + h], [x - w * 0.62, yTop + h]];
    if (!A.isColor()) { ctx.save(); ctx.fillStyle = 'rgba(60,55,50,0.28)'; ctx.beginPath(); ctx.moveTo(x - w * 0.9, yTop); ctx.lineTo(x + w * 0.9, yTop); ctx.lineTo(x + w * 1.0, yTop + h); ctx.lineTo(x - w * 1.0, yTop + h); ctx.fill(); ctx.restore(); }
    ctx.save(); ctx.fillStyle = A.isColor() ? '#cfe9f5' : '#ffffff'; ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.closePath(); ctx.fill(); ctx.restore();
    ctx.save(); A.trace(pts, true, 0, 1, 0); ctx.clip();
    ctx.strokeStyle = A.isColor() ? 'rgba(90,140,170,0.55)' : 'rgba(80,80,80,0.45)'; ctx.lineWidth = 2; ctx.lineCap = 'round';
    for (let i = 0; i < 16; i++) { const lx = x - w / 2 + (i + 0.5) / 16 * w, off = ((t * 300 + rs(seed, i) * h) % (h + 160)) - 160; ctx.beginPath(); ctx.moveTo(lx, yTop + off); ctx.lineTo(lx + (lx - x) * 0.05, yTop + off + 70 + rs(seed, i + 40) * 60); ctx.stroke(); }
    ctx.restore();
    A.line([[x - w / 2, yTop], [x - w * 0.62, yTop + h]], { w: 2, seed: seed + 1, passes: 1 }); A.line([[x + w / 2, yTop], [x + w * 0.62, yTop + h]], { w: 2, seed: seed + 2, passes: 1 });
    for (let i = 0; i < 4; i++) {   // foam puffs
      const fx = x - w * 0.7 + i * w * 0.48, fy = yTop + h + Math.sin(t * 2 + i) * 4;
      const pp = A.ellipsePts(fx, fy, w * 0.42, w * 0.24, 16, 0, 0.15, seed + i);
      A.fill(pp, '#ffffff', { ...O, seed: seed + i }); A.line(pp.slice(9, 16).concat(pp.slice(0, 2)), { w: 1.6, dark: 0.55, seed: seed + i + 5, passes: 1 });
    }
  };

  /* ---- soft sunbeam: blurred shaft on an offscreen layer, screen-blended, ending on (x, y) ---- */
  let beamCanvas = null;
  A.sunbeam = (x, y, a) => {
    if (a <= 0) return;
    const ctx = C(); const m = ctx.getTransform();
    if (!beamCanvas) { beamCanvas = document.createElement('canvas'); beamCanvas.width = 1920; beamCanvas.height = 1080; }
    const b = beamCanvas.getContext('2d'); b.setTransform(1, 0, 0, 1, 0, 0); b.clearRect(0, 0, 1920, 1080); b.setTransform(m);
    const g = b.createLinearGradient(x + 380, y - 950, x, y);
    const c = A.isColor() ? '255,226,150' : '255,255,255';
    g.addColorStop(0, `rgba(${c},0)`); g.addColorStop(0.75, `rgba(${c},0.9)`); g.addColorStop(1, `rgba(${c},0)`);
    b.fillStyle = g; b.beginPath(); b.moveTo(x + 300, y - 1000); b.lineTo(x + 520, y - 1000); b.lineTo(x + 70, y + 30); b.lineTo(x - 90, y + 30); b.closePath(); b.fill();
    const r = b.createRadialGradient(x, y - 30, 0, x, y - 30, 150); r.addColorStop(0, `rgba(${c},0.85)`); r.addColorStop(1, `rgba(${c},0)`);
    b.fillStyle = r; b.beginPath(); b.arc(x, y - 30, 150, 0, 7); b.fill();
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'screen'; ctx.globalAlpha = a * 0.6; ctx.filter = 'blur(28px)';
    ctx.drawImage(beamCanvas, 0, 0); ctx.restore();
  };

  /* ---- wooden plank sign: wavy grain, a knot, hatched ends; Telugu drawn plainly in dark graphite (correct shaping) ---- */
  A.plank = (x, y, w, h, text, o = {}) => {
    const ctx = C(); const { rot = 0, font = "400 64px 'Lilita One'", seed = 400, ropes = false, sub = null, subFont = null, sprig = 0, t = 0 } = o;
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
    if (ropes) { A.line([[-w * 0.3, -h / 2], [-w * 0.3, -h / 2 - 60]], { w: 2.4, seed: seed + 9 }); A.line([[w * 0.3, -h / 2], [w * 0.3, -h / 2 - 60]], { w: 2.4, seed: seed + 10 }); }
    const pts = [[-w / 2, -h / 2 + 4], [-w / 4, -h / 2 - 3], [w / 4, -h / 2 + 2], [w / 2 + 8, -h / 2 - 2], [w / 2, 0], [w / 2 + 6, h / 2], [0, h / 2 + 3], [-w / 2 - 6, h / 2 - 2], [-w / 2 + 4, 0]];
    A.fill(pts, '#dcc095', { ...O, seed });
    ctx.save(); A.trace(pts, true, 0, 1, 0); ctx.clip();
    for (let i = 0; i < 3; i++) {   // wavy grain
      const gy = -h / 2 + (i + 1) * h / 4 + (rs(seed, i) - 0.5) * 8, pp = [];
      for (let k = 0; k <= 10; k++) pp.push([-w / 2 + k * w / 10, gy + Math.sin(k * 0.9 + i * 2 + seed) * 5]);
      A.line(pp, { w: 1.2, dark: 0.35, seed: seed + i, passes: 1 });
    }
    const kx = /[\u0C00-\u0C7F]/.test(text) ? w * 0.42 : w * (rs(seed, 50) - 0.5) * 0.6, ky = (rs(seed, 51) - 0.5) * h * 0.3;
    A.line(A.ellipsePts(kx, ky, 14, 7, 12), { closed: true, w: 1.4, dark: 0.5, seed: seed + 20, passes: 1 }); A.line(A.ellipsePts(kx, ky, 7, 3.5, 10), { closed: true, w: 1.2, dark: 0.45, seed: seed + 21, passes: 1 });
    for (const ex of [-w / 2, w / 2 - 50]) { ctx.save(); ctx.beginPath(); ctx.rect(ex, -h, 50, h * 2); ctx.clip(); A.hatch(pts, { gap: 5, dark: 0.3, seed: seed + 30, angle: 1.1 }); ctx.restore(); }
    ctx.restore();
    A.line(pts, { closed: true, w: 3, seed: seed + 20 });
    for (const nx of [-w / 2 + 16, w / 2 - 16]) { ctx.fillStyle = 'rgba(40,36,30,0.85)'; ctx.beginPath(); ctx.arc(nx, -h / 2 + 14, 4, 0, 7); ctx.fill(); }
    if (sprig) {   // leaf sprig on the top-left corner, fluttering
      ctx.save(); ctx.translate(-w / 2 + 20, -h / 2 + 4); ctx.rotate(-2.2 + Math.sin(t * 6) * 0.12);
      A.heartLeaf(0, 0, 0.4, 0, 431); A.heartLeaf(0, 0, 0.32, 0.6, 432); ctx.restore();
    }
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    const ty = sub ? -h * 0.14 : 2;
    const telugu = /[ఀ-౿]/.test(text);
    ctx.font = font; ctx.lineJoin = 'round';
    if (telugu) { ctx.fillStyle = '#2b2622'; ctx.fillText(text, 0, ty); }
    else { ctx.lineWidth = 7; ctx.strokeStyle = 'rgba(40,36,30,0.95)'; ctx.strokeText(text, 0, ty); ctx.fillStyle = '#fbf6ea'; ctx.fillText(text, 0, ty); }
    if (sub) { ctx.font = subFont || "36px 'Patrick Hand'"; ctx.fillStyle = 'rgba(40,36,30,0.95)'; ctx.fillText(sub, 0, h * 0.27); }
    ctx.restore();
  };

  /* ---- tree with a tapered branch and twigs; flared base with roots into the ground ---- */
  A.tree = (x, y, s, seed = 700, t = 0, branchUp = 0) => {
    const ctx = C(); ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    const trunk = [[-70, 8], [-44, -30], [-32, -300], [-22, -620], [22, -620], [32, -300], [46, -30], [76, 8], [30, 0], [0, 10], [-30, 0]];
    A.fill(trunk, P.trunk, { ...O, seed });
    ctx.save(); A.trace(trunk, true, 0, 1, 0); ctx.clip(); ctx.beginPath(); ctx.rect(-80, -700, 50, 720); ctx.clip(); A.hatch(trunk, { gap: 5, dark: 0.32, seed: seed + 1, angle: -1.4 }); ctx.restore();
    A.line(trunk, { closed: true, w: 2.6, seed });
    for (let i = 0; i < 8; i++) A.line([[-18 + rs(seed, i) * 28, -60 - i * 68], [-8 + rs(seed, i + 9) * 28, -84 - i * 68]], { w: 1.3, dark: 0.45, seed: seed + i, passes: 1 });
    for (const [rx, rl] of [[-58, -1], [64, 1], [10, 0.2]]) A.line([[rx * 0.6, 0], [rx, 10], [rx + rl * 30, 20]], { w: 2.4, seed: seed + 40 + rx, passes: 1 });
    // tapered branch to the right, with two twigs; the leaf hangs from the tip
    const by = -480 - branchUp;
    const branch = [[12, -500], [100, -520 - branchUp * 0.4], [200, -512 - branchUp * 0.8], [262, by - 8], [264, by - 2], [200, -500 - branchUp * 0.8], [100, -494 - branchUp * 0.4], [16, -456]];
    A.fill(branch, P.trunk, { ...O, seed: seed + 2 }); A.line(branch, { closed: true, w: 2.2, seed: seed + 2 });
    A.line([[150, -508 - branchUp * 0.6], [178, -560 - branchUp * 0.6], [196, -572 - branchUp * 0.6]], { w: 2, seed: seed + 3, passes: 1 });
    A.line([[220, by + 8], [244, by + 40]], { w: 1.8, seed: seed + 4, passes: 1 });
    for (let i = 0; i < 6; i++) {   // crown
      const r = 120 + rs(seed, i + 20) * 60, cx = -60 + (i % 3) * 90 + rs(seed, i) * 30, cy = -700 - (i > 2 ? 110 : 0) + Math.sin(t * 0.8 + i) * 2;
      const pts = A.blobPts(cx, cy, a => { const b = 1 + 0.1 * Math.sin(a * 7 + i); return [r * b, r * 0.75 * b]; }, 28);
      A.fill(pts, i % 2 ? P.jungle : P.jungleDark, { ...O, seed: seed + i + 30 });
      ctx.save(); A.trace(pts, true, 0, 1, 0); ctx.clip(); ctx.beginPath(); ctx.rect(cx - r, cy, r * 2, r); ctx.clip(); A.hatch(pts, { gap: 7, dark: 0.28, seed: seed + i + 40 }); ctx.restore();
      A.line(pts, { closed: true, w: 2, seed: seed + i + 50, dark: 0.7 });
    }
    ctx.restore();
    return [x + 262 * s, y + by * s];
  };

  /* ---- wind-lines: curly S strokes with a curl at the head ---- */
  A.windLines = (W, H, t, strength, seed = 1, n0 = 4) => {
    const ctx = C(); ctx.save(); ctx.lineCap = 'round';
    const n = Math.round(n0 + strength * 4);
    for (let i = 0; i < n; i++) {
      const per = 2.5 - strength * 0.8, ph = ((t + rs(seed, i) * per) % per) / per;
      const y = 120 + rs(seed + 1, i) * H * 0.75, x = -300 + ph * (W + 600), L = 240 + strength * 180;
      ctx.globalAlpha = Math.sin(ph * Math.PI) * (0.55 + strength * 0.3);
      ctx.strokeStyle = A.isColor() ? 'rgba(120,170,150,0.9)' : 'rgba(80,80,80,0.9)'; ctx.lineWidth = 2.6;
      ctx.beginPath(); ctx.moveTo(x - L, y); ctx.bezierCurveTo(x - L * 0.65, y - 22, x - L * 0.35, y + 22, x, y);
      ctx.arc(x + 0, y - 16, 16, Math.PI * 0.5, Math.PI * 2.2, true); ctx.stroke();
    }
    ctx.restore();
  };
})();
