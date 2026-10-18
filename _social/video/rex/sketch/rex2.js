// Rex v2: the baby T-Rex built to the design expert's REX_BIBLE.md (round 1: the ¾ front view).
// ART.rex2(x, y, s, pose): foot point (x, y); +x = facing direction (flip mirrors); y up is negative; ~250 units tall.
// Units, points and colours follow the Bible (§2–§6). The old ART.rex stays for Episodes 0–1.
// pose: { t, flip, light:[lx,ly] (screen, default upper-left), headTilt, lean, squash, air, shadow,
//         tail:{wag, phase, lift}, arms:{near:[up,fore], far:[up,fore]}, hat:{on, wob, dx, dy},
//         face:{ browLift, browTilt, browCurve (number or [near,far]), lidUp, lidLo, closed, pupil, look, cross, sparkle, wet,
//                mouth 'M0'..'M15', open, corners, width, side, wobble, teeth, tongue, cheek, blush, flare, wrinkle, tears, sweat } }
(function () {
  const A = window.ART;
  const C = {   // §3.1 palette (raw colours; the B&W pass turns them into greys of the same lightness)
    rex: '#a3d16e', shade: '#78ad57', spot: '#5f9a4c', face: '#bfe08f', belly: '#f7edcc', claw: '#fbf6e8', eyeW: '#ffffff',
    pupil: '#221e1c', blush: '#f7a1a6', mouth: '#b9525a', tongue: '#ee8f8f', tear: '#a9d6f5', hat: '#f5ecd6', hatSpot: '#c9a8d8',
    line: '42,39,36', skin: '#b4da82',
  };
  A.REX2 = C;
  const HC = [18, -166], NECK = [14, -116], HINGE = [14, 26];
  const HEAD = [[-60, 0], [-57, -20], [-48, -38], [-33, -51], [-14, -56], [6, -55], [24, -49], [38, -39], [50, -27], [62, -17], [72, -10], [79, 0],
    [81, 12], [78, 24], [70, 33], [56, 40], [38, 46], [18, 52], [-2, 54], [-22, 52], [-40, 44], [-52, 32], [-58, 16]];
  const rs = A.rnd;
  let ctx, S = 1, KEYB = 0, KEYF = 0, L = [-0.6, -0.8];   // L: light direction in local (unflipped) space

  /* ---------- drawing helpers: closed outlines (no gaps), clamped widths, boil on threes / sixes ---------- */
  const jit = (pts, j, seed, key) => j ? pts.map((p, i) => [p[0] + (rs(seed + key * 31, i) - 0.5) * j, p[1] + (rs(seed + key * 31 + 7, i) - 0.5) * j]) : pts;
  const wpx = w => { const px = Math.min(6, Math.max(1.6, w * S)); return px / S; };
  function path(pts, closed) { A.trace(pts, closed, 0, 1, 0); }
  function fill(pts, col, alpha = 1) { ctx.save(); path(pts, true); ctx.globalAlpha *= alpha; ctx.fillStyle = col; ctx.fill(); ctx.restore(); }
  function stroke(pts, o = {}) {
    const { closed = false, w = 3, dark = 0.9, j = 1.2, seed = 1, face = false, ghost = false } = o;
    const P = jit(pts, j, seed, face ? KEYF : KEYB);
    ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    path(P, closed); ctx.lineWidth = wpx(w); ctx.strokeStyle = `rgba(${C.line},${dark})`; ctx.stroke();
    if (ghost) { path(jit(pts, j * 1.6, seed + 3, KEYB), closed); ctx.lineWidth = wpx(w) * 0.55; ctx.strokeStyle = `rgba(${C.line},${dark * 0.35})`; ctx.stroke(); }
    ctx.restore();
  }
  // half-plane clip: the part of the bounding box farthest from the light (fraction f of its extent)
  function shadowClip(pts, f) {
    const d = [-L[0], -L[1]], n = Math.hypot(d[0], d[1]); d[0] /= n; d[1] /= n;
    const pr = pts.map(p => p[0] * d[0] + p[1] * d[1]), mx = Math.max(...pr), mn = Math.min(...pr), c = mx - (mx - mn) * f;
    const ox = d[0] * c, oy = d[1] * c, tx = -d[1], ty = d[0], R = 2000;
    ctx.beginPath(); ctx.moveTo(ox + tx * R, oy + ty * R); ctx.lineTo(ox - tx * R, oy - ty * R); ctx.lineTo(ox - tx * R + d[0] * R, oy - ty * R + d[1] * R); ctx.lineTo(ox + tx * R + d[0] * R, oy + ty * R + d[1] * R); ctx.closePath(); ctx.clip();
  }
  // the body part: fill, a hatched shadow band (≤ 35 %), outline 3.0 with a heavier 3.6 edge on the shadow side
  function part(pts, col, seed, o = {}) {
    fill(pts, col);
    if (o.hatch !== false) {
      ctx.save(); path(pts, true); ctx.clip(); shadowClip(pts, o.band ?? 0.35);
      A.hatch(pts, { gap: 6, dark: 0.2, w: 1.1, seed, angle: o.angle ?? -0.9 });
      ctx.restore();
    }
    if (o.line !== false) {
      stroke(pts, { closed: true, w: o.w ?? 3, seed, ghost: o.ghost });
      ctx.save(); path(pts, true); ctx.rect(-4000, -4000, 8000, 8000); shadowClip(pts, 0.45); stroke(pts, { closed: true, w: (o.w ?? 3) * 1.2, seed }); ctx.restore();
    }
  }
  const ell = (cx, cy, rx, ry, n = 24, rot = 0) => A.ellipsePts(cx, cy, rx, ry, n, rot);
  // soft-edged ellipse: solid to `solid` of the radius, fading to 0 at the edge
  function soft(cx, cy, rx, ry, col, alpha, solid = 0.55) {
    const m = col.match(/^#(..)(..)(..)$/), rgb = [1, 2, 3].map(i => parseInt(m[i], 16)).join(',');
    ctx.save(); ctx.translate(cx, cy); ctx.scale(1, ry / rx);
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, rx);
    g.addColorStop(0, `rgba(${rgb},${alpha})`); g.addColorStop(solid, `rgba(${rgb},${alpha})`); g.addColorStop(1, `rgba(${rgb},0)`);
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, rx, 0, Math.PI * 2); ctx.fill(); ctx.restore();
  }
  const rot = (p, c, a) => { const dx = p[0] - c[0], dy = p[1] - c[1], co = Math.cos(a), si = Math.sin(a); return [c[0] + dx * co - dy * si, c[1] + dx * si + dy * co]; };
  const lerp = (a, b, t) => a + (b - a) * t;
  const sidev = (v, i) => Array.isArray(v) ? v[i] : v;

  /* ---------- tail: 5 segments, each rotating relative to the previous (lag / follow-through) ---------- */
  function tail(p, base = [[-30, -40], [-62, -36], [-94, -36], [-118, -42], [-132, -52]], th = [44, 32, 22, 15], capR = 5.5) {
    th = [...th, 11];
    const tl = p.tail || {}, wag = tl.wag || 0, ph = tl.phase || 0, lift = tl.lift || 0;
    const pts = [base[0]]; let acc = 0;
    for (let i = 1; i < base.length; i++) {
      acc += (wag * Math.sin(ph - i * 0.7) * 0.09 + lift * 0.07) * i;
      const v = [base[i][0] - base[i - 1][0], base[i][1] - base[i - 1][1]], r = rot(v, [0, 0], -acc);
      pts.push([pts[i - 1][0] + r[0], pts[i - 1][1] + r[1]]);
    }
    const up = [], dn = [];
    for (let i = 0; i < pts.length; i++) {
      const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)];
      let nx = -(b[1] - a[1]), ny = b[0] - a[0]; const n = Math.hypot(nx, ny); nx /= n; ny /= n;
      const h = i === pts.length - 1 ? capR : th[i] / 2;
      up.push([pts[i][0] + nx * h, pts[i][1] + ny * h]); dn.push([pts[i][0] - nx * h, pts[i][1] - ny * h]);
    }
    const tip = pts[pts.length - 1], a0 = Math.atan2(tip[1] - pts[3][1], tip[0] - pts[3][0]), cap = [];
    for (let k = 1; k < 8; k++) { const a = a0 + Math.PI / 2 - k / 8 * Math.PI; cap.push([tip[0] + Math.cos(a) * capR, tip[1] + Math.sin(a) * capR]); }
    const poly = [[up[0][0] + 14, up[0][1] - 4], ...up.slice(1), ...cap, ...dn.slice(1).reverse(), [dn[0][0] + 14, dn[0][1] + 4]];
    part(poly, C.rex, 41);
    // spots along the top at 30 / 55 / 75 % of the length
    [[0.3, 6, 4.5], [0.55, 5, 4], [0.75, 4, 3]].forEach(([f, rx, ry], i) => {
      const q = f * (pts.length - 1), k = Math.min(pts.length - 2, Math.floor(q)), t = q - k;
      const cx = lerp(pts[k][0], pts[k + 1][0], t), cy = lerp(pts[k][1], pts[k + 1][1], t) - th[k] * 0.18;
      fill(ell(cx, cy, rx, ry, 12), C.spot);
    });
    return pts;
  }

  /* ---------- arms: 2 segments + mitten, parented to the body ---------- */
  function arm(sh, up, fore, k, col, seed) {
    const e = [sh[0] + Math.cos(up) * 15 * k, sh[1] + Math.sin(up) * 15 * k], w = [e[0] + Math.cos(fore) * 15 * k, e[1] + Math.sin(fore) * 15 * k];
    const seg = (a, b, t0, t1) => { const dx = b[0] - a[0], dy = b[1] - a[1], n = Math.hypot(dx, dy), nx = -dy / n, ny = dx / n;
      return [[a[0] + nx * t0 / 2, a[1] + ny * t0 / 2], [b[0] + nx * t1 / 2, b[1] + ny * t1 / 2], [b[0] - nx * t1 / 2, b[1] - ny * t1 / 2], [a[0] - nx * t0 / 2, a[1] - ny * t0 / 2]]; };
    const hand = ell(w[0] + Math.cos(fore) * 3 * k, w[1] + Math.sin(fore) * 3 * k, 6 * k, 5.5 * k, 14, fore);
    fill(seg(sh, e, 12 * k, 10 * k), col); fill(seg(e, w, 10 * k, 9 * k), col); fill(hand, col);
    stroke([[sh[0], sh[1] - 5 * k], [e[0] + Math.sin(up) * 5 * k, e[1] - Math.cos(up) * 5 * k], [w[0] + Math.sin(fore) * 4.5 * k, w[1] - Math.cos(fore) * 4.5 * k]], { w: 2.2, seed });
    stroke([[sh[0], sh[1] + 6 * k], [e[0] - Math.sin(up) * 5 * k, e[1] + Math.cos(up) * 5 * k], [w[0] - Math.sin(fore) * 4.5 * k, w[1] + Math.cos(fore) * 4.5 * k]], { w: 2.2, seed: seed + 1 });
    stroke(hand.slice(14 * 0).concat([hand[0]]), { w: 2.2, seed: seed + 2, closed: false });
    const hx = w[0] + Math.cos(fore) * 7 * k, hy = w[1] + Math.sin(fore) * 7 * k;
    for (const o of [-2, 2]) fill(ell(hx + Math.cos(fore + 1.57) * o * k, hy + Math.sin(fore + 1.57) * o * k, 1.6 * k, 2 * k, 8, fore), C.claw);
    return w;
  }

  /* ---------- eyes (lids clipped inside, highlights fixed to the light) ---------- */
  function eye(cx, cy, rx, ry, r0, f, i, flip, pkO) {
    const lidUp = Math.min(1.15, sidev(f.lidUp ?? 1, i)), lidLo = Math.min(0.45, sidev(f.lidLo ?? 0, i) + 0.3 * (f.cheek || 0)), closed = f.closed;
    const tilt = Math.max(-0.6, sidev(f.browTilt ?? 0, i)), th = tilt * 0.40 * (i === 0 ? -1 : 1), pk = pkO ?? (i === 1 ? 0.7 : 1);
    const ry2 = ry * (lidUp > 1 ? 1 + (lidUp - 1) * 0.67 : 1), cyy = cy - (ry2 - ry);
    if (closed || lidUp <= 0.02) {   // ∪ relaxed, ∩ happy, > < squeeze
      const w = rx * 0.95; let pts;
      if (closed === 'happy') pts = [[cx - w, cy + 4], [cx - w * 0.5, cy - 6], [cx, cy - 8], [cx + w * 0.5, cy - 6], [cx + w, cy + 4]];
      else if (closed === 'squeeze') { const s = i === 0 ? -1 : 1; pts = [[cx - w * s, cy - 8], [cx + w * 0.7 * s, cy], [cx - w * s, cy + 8]]; }
      else pts = [[cx - w, cy - 2], [cx - w * 0.5, cy + 6], [cx, cy + 8], [cx + w * 0.5, cy + 6], [cx + w, cy - 2]];
      stroke(pts, { w: 3.2, j: 0.6, seed: 300 + i, face: true });
      return;
    }
    const E = ell(cx, cyy, rx, ry2, 30, r0);
    if (lidLo > 0.15) { const ly0 = cyy + ry2 - lidLo * ry2; ctx.save(); ctx.beginPath(); ctx.rect(cx - rx - 10, cyy - ry2 - 10, 2 * rx + 20, ly0 - (cyy - ry2 - 10) + 1); ctx.clip(); fill(E, C.eyeW); ctx.restore(); }
    else fill(E, C.eyeW);
    ctx.save(); path(E, true); ctx.clip();
    // pupil + highlights
    const pr = (f.pupil ?? 0.58) * ry, look = f.look || [0.15, 0], cross = (f.cross || 0) * (i === 0 ? 1 : -1);
    const px = cx + (look[0] + cross * 0.8) * 0.32 * ry, py = cyy + look[1] * 0.32 * ry - (lidLo > 0.2 && lidUp >= 0.9 ? 0.15 * ry : 0);
    fill(ell(px, py, pr * pk, pr, 22), C.pupil);
    const hx = L[0] / Math.hypot(...L) * 0.5, hy = L[1] / Math.hypot(...L) * 0.5;   // toward the light
    fill(ell(px + hx * 0.7 * pr * pk, py + hy * 0.76 * pr, 0.36 * pr * pk * (f.wet ? 1.15 : 1), 0.36 * pr * (f.wet ? 1.15 : 1), 14), C.eyeW);
    fill(ell(px - hx * 0.76 * pr * pk, py - hy * 0.68 * pr, 0.16 * pr * pk, 0.16 * pr, 10), C.eyeW);
    for (let k = 0; k < Math.round(f.sparkle || 0) * 2; k++) fill(ell(px + Math.cos(k * 2.4) * 0.5 * pr, py + Math.sin(k * 2.4) * 0.5 * pr, 0.1 * pr, 0.1 * pr, 8), C.eyeW);
    if (f.wet) fill(ell(cx, cyy + ry2 * 0.82, rx * 0.9, ry2 * 0.16, 16), C.tear, 0.8 * f.wet);
    // upper lid (skin) and lower lid (smile squint)
    const top = cyy - ry2, lidY = top + (1 - Math.min(1, lidUp)) * 2 * ry2;
    // upper lid edge: an arc (sag 0.25 rx) tilted with the brow, inner end up for sad / worried
    const lidOn = lidUp < 1 || Math.abs(tilt) > 0.05;
    const edge = [-1, -0.5, 0, 0.5, 1].map(u => rot([cx + u * (rx + 1), lidY + 0.25 * rx * (1 - u * u) - (lidUp >= 1 ? 0.25 * rx : 0)], [cx, lidY], th));
    if (lidOn) fill([[edge[0][0] - 4, top - 40], [edge[4][0] + 4, top - 40], [edge[4][0] + 4, edge[4][1]], ...edge.slice().reverse(), [edge[0][0] - 4, edge[0][1]]], C.skin);
    if (lidLo > 0.15) { const ly = cyy + ry2 - lidLo * ry2 * 1.0; fill([[cx - rx - 4, cyy + ry2 + 10], [cx + rx + 4, cyy + ry2 + 10], [cx + rx + 4, ly + 4], [cx + rx * 0.5, ly], [cx, ly - 1.5], [cx - rx * 0.5, ly], [cx - rx - 4, ly + 4]], C.skin); }
    ctx.restore();
    const lowEdge = lidLo > 0.15 ? (() => { const ly = cyy + ry2 - lidLo * ry2 * 1.0; return [[cx - rx - 4, ly + 4], [cx - rx * 0.5, ly], [cx, ly - 1.5], [cx + rx * 0.5, ly], [cx + rx + 4, ly + 4]]; })() : null;
    if (lowEdge) {   // outline only above the lid edge, then the edge itself (clipped to the eye) at the eye-outline weight
      ctx.save(); ctx.beginPath(); ctx.moveTo(lowEdge[0][0], lowEdge[0][1]); for (const q of lowEdge.slice(1)) ctx.lineTo(q[0], q[1]);
      ctx.lineTo(cx + rx + 12, cyy - ry2 - 20); ctx.lineTo(cx - rx - 12, cyy - ry2 - 20); ctx.closePath(); ctx.clip();
      stroke(E, { closed: true, w: 2.6, j: 0.5, seed: 310 + i, face: true }); ctx.restore();
      ctx.save(); path(ell(cx, cyy, rx + 1.3, ry2 + 1.3, 30, r0), true); ctx.clip(); stroke(lowEdge, { w: 2.6, j: 0.3, seed: 330 + i, face: true }); ctx.restore();
    } else stroke(E, { closed: true, w: 2.6, j: 0.5, seed: 310 + i, face: true });
    if (lidOn) { ctx.save(); path(E, true); ctx.clip(); stroke(edge, { w: 2.6, j: 0.4, seed: 320 + i, face: true }); ctx.restore(); }
  }

  /* ---------- mouth (§6) with the jaw rig ---------- */
  const MOUTH = {   // v1.1 anchors: every mouth point >= 6 units from both eyes
    M0: { A: [22, 28], B: [44, 32], F: [70, 26], open: 0 },
    M1: { A: [22, 22], B: [44, 36], F: [70, 24], open: 0, tick: [20, 20] },
    M2: { A: [22, 22], B: [44, 36], F: [70, 24], open: 0.3, tick: [20, 20] },
    M3: { A: [22, 22], B: [44, 34], F: [68, 22], open: 0.2, teeth: 1, tick: [21, 19] },
    M4: { A: [22, 22], B: [44, 26], F: [66, 20], open: 0.9, teeth: 1, tongue: 0.5 },
    M5: { o: [44, 32, 6, 7], open: 0.15 },
    M6: { o: [42, 36, 11, 14], open: 0.5, tongue: 0.4 },
    M7: { A: [22, 32], B: [44, 28], F: [66, 28], open: 0, tick: [18, 36] },
  };
  function mouthLine(m, f) {
    const c = ((f.corners || 0) + 0.3 * (f.cheek || 0)) * 7, wd = f.width ?? 1, sd = (f.side || 0) * 10, mid = m.B[0];
    const sc = p => [mid + (p[0] - mid) * wd + sd, p[1]];
    const k = c / 7;   // corners: up raises the far end and deepens the middle; the near corner never rises above y 22
    return { A: sc([m.A[0], Math.max(22, m.A[1] + Math.max(0, -k) * 7)]), B: sc([m.B[0], m.B[1] + k * 4]), F: sc([m.F[0], m.F[1] - k * 7]), tick: m.tick && sc(m.tick) };
  }
  // the top of the head outline at x (for keeping brows inside)
  function topAt(poly, x) {
    let best = Infinity;
    for (let k = 0; k < poly.length; k++) { const a = poly[k], b = poly[(k + 1) % poly.length];
      if ((a[0] - x) * (b[0] - x) <= 0 && a[0] !== b[0]) { const y = a[1] + (b[1] - a[1]) * (x - a[0]) / (b[0] - a[0]); if (y < best) best = y; } }
    return best;
  }
  // head + jaw in head-local coordinates (HC at 0,0)
  function head(p, f) {
    const m = MOUTH[f.mouth || 'M1'] || MOUTH.M1, open = f.open ?? m.open, ang = open * 0.38;
    const ml = m.o ? null : mouthLine(m, f);
    if (ml && open > 0.001) ml.F = [Math.min(ml.F[0], 66), Math.max(ml.F[1], 24)];   // open: the far corner stays under the snout (no beak)
    if (ml && open > 0.5) ml.B = [ml.B[0], Math.min(ml.B[1], Math.max(ml.A[1], ml.F[1]) + 4)];   // flat upper lip for big opens
    const quad = (P, Q, R) => { const c = [2 * Q[0] - (P[0] + R[0]) / 2, 2 * Q[1] - (P[1] + R[1]) / 2]; return [0, 0.17, 0.33, 0.5, 0.67, 0.83, 1].map(u => [(1 - u) * (1 - u) * P[0] + 2 * u * (1 - u) * c[0] + u * u * R[0], (1 - u) * (1 - u) * P[1] + 2 * u * (1 - u) * c[1] + u * u * R[1]]); };
    const upper = ml ? quad(ml.A, ml.B, ml.F) : null;
    // the jaw rotates about the hinge and drops (soft D), the chin moving <= 14 units in all
    const isOpen = ang > 0.001 && !!upper;
    const jawT = q => { const r = rot(q, HINGE, ang * 0.7); return [r[0], r[1] + open * 8]; };
    let SIL = HEAD, lowLip = null;
    if (isOpen) {
      const sag = 3 + open * 8;
      lowLip = upper.map((q, k) => { const r = jawT(q), u = k / (upper.length - 1); return [r[0], r[1] + sag * Math.sin(u * Math.PI)]; });
      const F = ml.F, F2 = lowLip[lowLip.length - 1];
      // the jaw transform fades from full at x >= 18 to none at x <= -10, so the chin blends into the neck
      const jawW = q => { const w = Math.max(0, Math.min(1, (q[0] + 10) / 28)), r = jawT(q); return [lerp(q[0], r[0], w), lerp(q[1], r[1], w)]; };
      const chin = [[68, 34], [64, 41], [54, 46], [38, 49], [18, 52], [2, 54], [-10, 54]].map(jawW);
      // one path, always going down at the snout: skull -> (79,0) -> (81,12) -> (79,20) -> (74,25) -> far corner -> (mouth) -> round jaw -> neck
      SIL = [...HEAD.slice(0, 12), [81, 12], [79, 20], [74, 25], F, F2, ...chin, ...HEAD.slice(19)];
    }
    // 1) skin, shadow hatch (never in the face zone), face glow, spots
    fill(SIL, C.rex);
    ctx.save(); path(SIL, true); ctx.clip(); shadowClip(SIL, 0.3);
    ctx.beginPath(); ctx.rect(-500, -500, 1000, 1000); ctx.ellipse(22, 8, 60, 40, 0, 0, Math.PI * 2); ctx.clip('evenodd');
    A.hatch(SIL, { gap: 6, dark: 0.2, w: 1.1, seed: 51 }); ctx.restore();
    ctx.save(); path(SIL, true); ctx.clip();
    soft(22, 8, 56, 36, C.face, 0.6, 0.55);
    if (isOpen) soft(32, 40, 36, 18, C.face, 0.45);
    [[-46, -28, 7, 5], [-53, -8, 6, 4.5], [-48, 14, 5, 4]].forEach(([x, y, rx, ry]) => fill(ell(x, y, rx, ry, 12), C.spot));
    ctx.restore();
    // 2) the mouth
    if (isOpen) {
      const inner = [...upper, ...lowLip.slice().reverse()];
      fill(inner, C.mouth);
      ctx.save(); path(inner, true); ctx.clip();
      const tg = f.tongue ?? m.tongue ?? 0;
      if (tg > 0) { const lb = lowLip[3]; fill(ell(lb[0] - 2, lb[1] - 3, 16, 4 + 7 * tg, 18), C.tongue); }
      ctx.restore();
      if (f.teeth ?? m.teeth) for (const tx of [36, 50]) { const q = tx < ml.B[0] ? lerp(ml.A[1], ml.B[1], (tx - ml.A[0]) / (ml.B[0] - ml.A[0])) : lerp(ml.B[1], ml.F[1], (tx - ml.B[0]) / (ml.F[0] - ml.B[0]));
        const tooth = [[tx - 3, q - 1], [tx + 3, q - 1], [tx + 3, q + 3], [tx + 1.5, q + 5.2], [tx - 1.5, q + 5.2], [tx - 3, q + 3]]; fill(tooth, C.claw); stroke(tooth.slice(1, 5), { w: 1.0, dark: 0.35, j: 0, seed: 360 + tx, face: true }); }
      stroke(inner, { closed: true, w: 2.6, j: 0.4, seed: 371, face: true });
    } else if (m.o) {
      const [ox, oy, rx, ry] = m.o; fill(ell(ox, oy, rx, ry, 16), C.mouth); stroke(ell(ox, oy, rx, ry, 16), { closed: true, w: 2.6, j: 0.4, seed: 372, face: true });
    } else {
      stroke(upper, { w: 2.6, j: 0.4, seed: 373, face: true });
      if (ml.tick) stroke([ml.A, ml.tick], { w: 2.2, j: 0.2, seed: 374, face: true });
    }
    // the silhouette outline: one closed path, heavier on the shadow side
    stroke(SIL, { closed: true, w: 3, seed: 51, ghost: true });
    ctx.save(); shadowClip(SIL, 0.45); stroke(SIL, { closed: true, w: 3.6, seed: 51 }); ctx.restore();
    // 3) cheeks, blush, nostrils
    if (f.blush) { const ba = Math.min(1, 0.5 + 0.5 * f.blush); soft(-22, 30, 12, 7, C.blush, ba, 0.5); soft(60, 6, 7, 5, C.blush, ba, 0.5); }
    const fl = 1 + 0.6 * (f.flare || 0);
    fill(ell(64, -4, 2.6 * fl, 1.8 * fl, 10, -0.3), C.pupil, 0.85); fill(ell(74, -2, 2.0 * fl, 1.4 * fl, 10, -0.3), C.pupil, 0.85);
    // 4) eyes, then brows
    eye(-6, 2, 22, 26, 0, f, 0, p.flip); eye(38, 0, 15, 22, 0.08, f, 1, p.flip);
    [[-6, -32, 34, 1], [38, -30, 24, -1]].forEach(([bx, by, len, inner], i) => {
      const lift = sidev(f.browLift ?? 0, i), tilt = Math.max(-0.6, sidev(f.browTilt ?? 0, i)), curve = sidev(f.browCurve ?? 0.3, i);
      const dy = lift < 0 ? -lift * 6 : -lift * 10, arch = 3 + curve * 6;
      const ix = bx + inner * len / 2, ox = bx - inner * len / 2;
      let pts = [0, 0.25, 0.5, 0.75, 1].map(u => [lerp(ox, ix, u), by + dy + 2 - Math.sin(u * Math.PI) * arch - u * tilt * 12]);
      const push = Math.max(0, ...pts.map(q => topAt(HEAD, q[0]) + 6 - q[1]));   // lift limit
      if (push > 0) pts = pts.map(q => [q[0], q[1] + push]);
      stroke(pts, { w: 3, j: 0.4, seed: 380 + i, face: true });
    });
    if (f.wrinkle) for (const [x, y] of [[56, -14], [60, -8]]) stroke([[x - 3, y + 1], [x, y - 1.5], [x + 3, y + 1]], { w: 1.6, j: 0.2, seed: 390 + x, face: true });
    if (f.tears) { const tt = (p.t || 0) * 1.4 % 1; for (const q of [tt, (tt + 0.5) % 1]) { const tx = lerp(-16, -8, q), ty = lerp(26, 52, q); fill(ell(tx, ty, 3.5, 4.5, 10), C.tear, f.tears); } }
    if (f.sweat) fill(ell(-52, -30, 3.5, 5, 10), C.tear, f.sweat);
  }

  /* ===================== Turnaround (Bible §4, §12.2a): pose.yaw 0 | 45 (master) | 90 | 135 | 180 ===================== */
  // Bible v1.5 §4.1: side head = round forehead + short round muzzle
  const SIDE_HEAD = [[-60, 0], [-57, -20], [-48, -38], [-33, -51], [-14, -57], [6, -57], [26, -52], [44, -44], [56, -33], [63, -20],
    [68, -10], [78, -6], [87, 0], [90, 10], [88, 22], [80, 32], [66, 40], [48, 46], [28, 51], [8, 54], [-12, 54], [-32, 49], [-46, 40], [-56, 24], [-60, 12]];
  const CHEEK = [[46, -16], [56, -8], [65, 8], [62, 22], [52, 30], [44, 20]];
  // radius of an outline around HC at n angles (farthest crossing), so outlines of different views can be blended
  function polar(poly, n = 72) {
    const out = [];
    for (let k = 0; k < n; k++) {
      const a = k / n * Math.PI * 2, d = [Math.cos(a), Math.sin(a)]; let best = 0;
      for (let i = 0; i < poly.length; i++) {
        const P = poly[i], Q = poly[(i + 1) % poly.length], e = [Q[0] - P[0], Q[1] - P[1]], den = d[0] * e[1] - d[1] * e[0];
        if (Math.abs(den) < 1e-9) continue;
        const t = (P[0] * e[1] - P[1] * e[0]) / den, u = (P[0] * d[1] - P[1] * d[0]) / den;
        if (u >= 0 && u <= 1 && t > best) best = t;
      }
      out.push(best);
    }
    return out;
  }
  let RK = null;   // radii of the 5 key outlines: front, ¾ master, side, ¾ back (skull + cheek), back
  const YK = [0, 45, 90, 135, 180];
  function keyIdx(yaw) { const y = Math.max(0, Math.min(180, yaw)); const k = Math.min(3, Math.floor(y / 45)); return [k, (y - YK[k]) / 45]; }
  function outlineAt(yaw, inset = 0) {
    if (!RK) { const qb = polar(ell(0, 0, 60, 56, 72)), cb = polar(CHEEK); RK = [polar(ell(0, 0, 62, 56, 72)), polar(HEAD), polar(SIDE_HEAD), qb.map((r, k) => Math.max(r, cb[k])), polar(ell(0, 0, 62, 56, 72))]; }
    const [k, u] = keyIdx(yaw), n = RK[0].length;
    return RK[0].map((_, i) => { const a = i / n * Math.PI * 2, r = lerp(RK[k][i], RK[k + 1][i], u) - inset; return [Math.cos(a) * r, Math.sin(a) * r]; });
  }
  // value at yaw from 5 keys (0, 45, 90, 135, 180); arrays blend element-wise
  function K(yaw, keys) { const [k, u] = keyIdx(yaw), a = keys[k], b = keys[k + 1]; return Array.isArray(a) ? a.map((v, i) => lerp(v, b[i], u)) : lerp(a, b, u); }
  const li = (yaw, v0, v45, v90) => K(Math.min(90, yaw), [v0, v45, v90, v90, v90]);
  const lp = (yaw, p0, p45, p90) => K(Math.min(90, yaw), [p0, p45, p90, p90, p90]);
  const fade = (yaw, a, b) => Math.max(0, Math.min(1, (b - yaw) / (b - a)));   // 1 below a, 0 above b
  const clamp01 = v => Math.max(0, Math.min(1, v));
  // rightmost x of an outline at height y (for how much of the far eye still shows)
  function rightAt(poly, y) { let best = -Infinity; for (let k = 0; k < poly.length; k++) { const a = poly[k], b = poly[(k + 1) % poly.length];
    if ((a[1] - y) * (b[1] - y) <= 0 && a[1] !== b[1]) best = Math.max(best, a[0] + (b[0] - a[0]) * (y - a[1]) / (b[1] - a[1])); } return best; }
  let STATS = {};
  function hatAt(dx, dy, r, wob = 0) {
    ctx.save(); ctx.translate(dx, dy); ctx.rotate(r + Math.max(-0.15, Math.min(0.15, wob))); ctx.scale(1.05, 1.05);
    const cap = [[-30, 8], [-26, -16], [-14, -28], [0, -32], [14, -28], [26, -16], [30, 8], [20, 0], [12, 9], [2, -1], [-8, 9], [-18, 0]];
    fill(cap, C.hat); fill(ell(-10, -18, 3.5, 2.5, 10), C.hatSpot); fill(ell(8, -14, 3, 2.2, 10), C.hatSpot);
    ctx.save(); path(cap, true); ctx.clip(); shadowClip(cap, 0.3); A.hatch(cap, { gap: 6, dark: 0.12, seed: 120 }); ctx.restore();
    stroke(cap, { closed: true, w: 2.4, seed: 121 });
    ctx.restore();
    STATS.hatW = 60 * 1.05;
  }
  function skull(SIL, fz) {
    fill(SIL, C.rex);
    ctx.save(); path(SIL, true); ctx.clip(); shadowClip(SIL, 0.3);
    if (fz) { ctx.beginPath(); ctx.rect(-500, -500, 1000, 1000); ctx.ellipse(fz[0], fz[1], fz[2] + 4, fz[3] + 4, 0, 0, Math.PI * 2); ctx.clip('evenodd'); }
    A.hatch(SIL, { gap: 6, dark: 0.2, w: 1.1, seed: 51 }); ctx.restore();
  }
  function skullLine(SIL) { const j = SIL.length > 40 ? 0.5 : 1.2; stroke(SIL, { closed: true, w: 3, j, seed: 51, ghost: true }); ctx.save(); shadowClip(SIL, 0.45); stroke(SIL, { closed: true, w: 3.6, j, seed: 51 }); ctx.restore(); }
  // one head for any yaw 0…180, blended between the five §4 / §4.1 keys
  function headYaw(yaw, p, f) {
    const SIL = outlineAt(yaw), face = fade(yaw, 116, 122), INNER = outlineAt(yaw, 3);   // face pieces slide round the head and are gone by ~120°
    const fz = K(yaw, [[0, 14, 50, 36], [22, 8, 56, 36], [40, 8, 46, 34], [56, 8, 30, 30], [60, 8, 20, 20]]);
    skull(SIL, face > 0 ? fz : null);
    ctx.save(); path(SIL, true); ctx.clip();
    if (face > 0) soft(fz[0], fz[1], fz[2], fz[3], C.face, 0.6 * face, 0.55);
    const mz = fade(yaw, 0, 30);
    if (mz > 0) { soft(0, 26, 30, 20, C.face, 0.45 * mz); ctx.save(); ctx.globalAlpha *= mz; stroke(ell(0, 24, 30, 20, 40).slice(21, 40), { w: 1.4, dark: 0.35, j: 0.3, seed: 395, face: true }); ctx.restore(); }
    // head spots: the near three, then the far three appearing behind
    let spots = 0;
    const near = [[[-60, -30], [-46, -28], [-34, -36], [-20, -36], [-22, -34], 7, 5], [[-62, -8], [-53, -8], [-50, -16], [-34, -14], [-40, -14], 6, 4.5], [[-58, 14], [-48, 14], [-54, 6], [-30, 8], [-44, 8], 5, 4]];
    const far = [[[60, -30], [60, -30], [40, -42], [22, -40], [22, -34], 7, 5, 112, 135], [[62, -8], [62, -8], [56, -14], [52, -14], [40, -14], 6, 4.5, 140, 165], [[58, 14], [58, 14], [56, 8], [54, 8], [44, 8], 5, 4, 140, 165]];
    const sa = clamp01((yaw - 10) / 20);
    near.forEach(([a, b, c, d, e, rx, ry]) => { if (sa <= 0) return; const q = K(yaw, [a, b, c, d, e]); fill(ell(q[0], q[1], rx, ry, 12), C.spot, sa); spots++; });
    far.forEach(([a, b, c, d, e, rx, ry, y0, y1]) => { const al = clamp01((yaw - y0) / (y1 - y0)); if (al <= 0) return; const q = K(yaw, [a, b, c, d, e]); fill(ell(q[0], q[1], rx, ry, 12), C.spot, al); spots++; });
    STATS.spots = (STATS.spots || 0) + spots;
    if (face > 0) {
      ctx.save(); ctx.globalAlpha *= face; if (yaw > 90) { path(INNER, true); ctx.clip(); }
      const blush = f.blush || 0;
      if (blush) { const ba = Math.min(1, 0.5 + 0.5 * blush), b1 = lp(yaw, [-40, 16], [-22, 30], [34, 30]), b2 = lp(yaw, [40, 16], [60, 6], [70, 4]);
        soft(b1[0], b1[1], 12, 7, C.blush, ba, 0.5); soft(b2[0], b2[1], 7 * li(yaw, 1.7, 1, 0.5), 5, C.blush, ba * fade(yaw, 70, 80), 0.5); }
      const n1 = K(yaw, [[-6, 20], [64, -4], [85, -2], [130, -2], [130, -2]]), n2 = lp(yaw, [6, 20], [74, -2], [88, -2]);
      fill(ell(n1[0], n1[1], li(yaw, 2.2, 2.6, 2.4), li(yaw, 1.6, 1.8, 1.8), 10, li(yaw, 0.3, -0.3, -0.3)), C.pupil, 0.85);
      fill(ell(n2[0], n2[1], li(yaw, 2.2, 2.0, 1.2), li(yaw, 1.6, 1.4, 1.0), 10, -0.3), C.pupil, 0.85 * fade(yaw, 70, 80));
      // the mouth (line mouths in turned views): A – B – F, with the corner tick(s)
      const mA = K(yaw, [[-22, 32], [22, 22], [30, 24], [88, 24], [88, 24]]), mB = K(yaw, [[0, 40], [44, 36], [56, 33], [110, 33], [110, 33]]), mF = K(yaw, [[22, 32], [70, 24], [84, 25], [130, 25], [130, 25]]);
      const c = [2 * mB[0] - (mA[0] + mF[0]) / 2, 2 * mB[1] - (mA[1] + mF[1]) / 2];
      stroke([0, 0.17, 0.33, 0.5, 0.67, 0.83, 1].map(u => [(1 - u) * (1 - u) * mA[0] + 2 * u * (1 - u) * c[0] + u * u * mF[0], (1 - u) * (1 - u) * mA[1] + 2 * u * (1 - u) * c[1] + u * u * mF[1]]), { w: 2.6, j: 0.4, seed: 373, face: true });
      const tk = K(yaw, [[-2, -4], [-2, -2], [-3, -4], [-3, -4], [-3, -4]]);
      stroke([mA, [mA[0] + tk[0], mA[1] + tk[1]]], { w: 2.2, j: 0.2, seed: 374, face: true });
      const ft = fade(yaw, 10, 25); if (ft > 0) { ctx.save(); ctx.globalAlpha *= ft; stroke([mF, [mF[0] + 2, mF[1] - 4]], { w: 2.2, j: 0.2, seed: 375, face: true }); ctx.restore(); }
      ctx.restore();
    }
    ctx.restore();
    if (yaw >= 125 && yaw < 160) {   // ¾ back: the cheek bump's outline only where it sticks out of the skull
      ctx.save(); ctx.beginPath(); ctx.rect(-500, -500, 1000, 1000); ctx.ellipse(0, 0, K(yaw, [62, 62, 62, 60, 62]) - 1, 55, 0, 0, Math.PI * 2); ctx.clip('evenodd');
      skullLine(SIL); ctx.restore();
      ctx.save(); ctx.beginPath(); ctx.ellipse(0, 0, K(yaw, [62, 62, 62, 60, 62]) - 1, 55, 0, 0, Math.PI * 2); ctx.clip(); skullLine(ell(0, 0, K(yaw, [62, 62, 62, 60, 62]), 56, 72)); ctx.restore();
    } else skullLine(SIL);
    // eyes: the near eye always (to 115°); the far eye slides behind the snout bridge (65–80°), never squashed
    if (face > 0) {
      ctx.save(); ctx.globalAlpha *= face; path(yaw > 90 ? INNER : SIL, true); ctx.clip();
      const look = f.look || [li(yaw, 0, 0.15, 0.4), 0], ff = { ...f, look };
      const nE = K(yaw, [[-33, 0, 20, 26], [-6, 2, 22, 26], [26, 2, 15, 25], [84, 2, 15, 25], [84, 2, 15, 25]]);
      eye(nE[0], nE[1], nE[2], nE[3], 0, ff, 0, p.flip, li(yaw, 1, 1, 0.7));
      ctx.restore();
      STATS.eyeRy = nE[3];
      const fE = K(Math.min(90, yaw), [[33, 0, 20, 26], [38, 0, 15, 22], [68, -18, 12, 20], [68, -18, 12, 20], [68, -18, 12, 20]]);
      const inner = outlineAt(yaw, 3), vis = Math.min(2 * fE[2], rightAt(inner, fE[1]) - (fE[0] - fE[2])), fa = yaw < 60 ? 1 : clamp01((vis - 3) / 3);
      if (fa > 0 && yaw < 90) { ctx.save(); ctx.globalAlpha *= fa * face; path(inner, true); ctx.clip(); eye(fE[0], fE[1], fE[2], fE[3], li(yaw, 0, 0.08, 0.1), ff, 1, p.flip, li(yaw, 1, 0.7, 0.5)); ctx.restore(); }
      const brows = [[K(yaw, [-33, -6, 26, 84, 84]), -32, li(yaw, 34, 34, 22), 1, face], [li(yaw, 33, 38, 66), li(yaw, -32, -30, -46), li(yaw, 34, 24, 14), -1, (yaw < 60 ? 1 : fa) * fade(yaw, 70, 80)]];
      brows.forEach(([bx, by, len, innerDir, al], i) => {
        if (al <= 0) return;
        const lift = sidev(f.browLift ?? 0, i), tilt = Math.max(-0.6, sidev(f.browTilt ?? 0, i)), curve = sidev(f.browCurve ?? 0.3, i);
        const dy = lift < 0 ? -lift * 6 : -lift * 10, arch = 3 + curve * 6, ix = bx + innerDir * len / 2, ox = bx - innerDir * len / 2;
        let pts = [0, 0.25, 0.5, 0.75, 1].map(u => [lerp(ox, ix, u), by + dy + 2 - Math.sin(u * Math.PI) * arch - u * tilt * 12]);
        const push = Math.max(0, ...pts.map(q => topAt(SIL, q[0]) + 6 - q[1])); if (push > 0) pts = pts.map(q => [q[0], q[1] + push]);
        ctx.save(); path(yaw > 90 ? INNER : SIL, true); ctx.clip(); ctx.globalAlpha *= al; stroke(pts, { w: 3, j: 0.4, seed: 380 + i, face: true }); ctx.restore();
      });
    } else STATS.eyeRy = '—';
    const h = K(yaw, [[-8, -50, -0.12], [-16, -48, -0.28], [-20, -46, -0.35], [2, -50, -0.18], [8, -50, 0.12]]);
    if ((p.hat || {}).on !== false) hatAt(h[0], h[1], h[2], (p.hat || {}).wob);
    const xs = SIL.map(q => q[0]);
    STATS.skull = yaw < 22.5 || yaw >= 157.5 ? `width ${Math.round(Math.max(...xs) - Math.min(...xs))}` : yaw >= 67.5 && yaw < 112.5 ? `depth ${Math.round(rightAt(SIL, -20) + 60)} (at y −20)` : `width ${Math.round(Math.max(...xs) - Math.min(...xs))}`;
  }
  function bumpsOn(list, half) {
    list.forEach(([bx, by, r], i) => { const E = ell(bx, by, r, r * 0.75, 14); fill(E, C.shade); stroke(half ? E.slice(4, 12) : E, { w: 1.6, seed: 80 + i, closed: !half }); });
    STATS.bumps = (STATS.bumps || 0) + list.length;
  }
  function plates(cx, cy, rx, ry) { for (let k = 0; k < 3; k++) { const yy = cy - 30 + k * 22, hw = Math.sqrt(Math.max(0, 1 - Math.pow((yy - cy) / ry, 2))) * rx - 4; stroke([[cx - hw, yy], [cx, yy + 4], [cx + hw, yy]], { w: 1.4, dark: 0.3, j: 0.4, seed: 64 + k }); } }
  const pear = (cx, rxF, rxB, flatFront) => A.blobPts(cx, -74, a => { const s2 = Math.sin(a), k = Math.min(1, Math.max(0, (s2 + 0.3) / 0.6)), front = Math.cos(a) > 0;
    let rx = rxF === rxB ? lerp(44, 54, k) : (front ? rxF : rxB) * lerp(44 / 54, 1, k); if (flatFront && front && s2 > 0) rx -= 6 * Math.sin(2 * a); return [rx, s2 < 0 ? 58 : 60]; }, 40);
  function nubs(xs) { for (const cx of xs) { const nub = [[cx - 2.5, 0], [cx + 2.5, 0], [cx + 2.5, -4], [cx, -6], [cx - 2.5, -4]]; fill(nub, C.claw); stroke(nub, { closed: true, w: 1.4, j: 0.3, seed: 95 + Math.round(cx) }); } }
  // put the head centre at (hx, HC y), tilting about the neck
  function onHead(hx, p, fn) { ctx.save(); ctx.translate(hx, -116); ctx.rotate(p.headTilt); ctx.translate(0, HC[1] + 116); fn(); ctx.restore(); }
  function turn(p, f) {
    const yaw = p.yaw, ar = p.arms || {};
    STATS = { yaw };
    if (yaw < 22.5) {   // FRONT
      fill(ell(-58, -46, 10, 9, 16), C.rex); stroke(ell(-58, -46, 10, 9, 16), { closed: true, w: 3, seed: 40 });   // tail nub behind the left thigh
      const body = pear(0, 54, 54, false); part(body, C.rex, 63, { ghost: true });
      ctx.save(); path(body, true); ctx.clip(); const b = ell(0, -66, 34, 44, 28); fill(b, C.belly); plates(0, -66, 34, 44); stroke(b.slice(20).concat(b.slice(0, 9)), { w: 1.6, dark: 0.55, seed: 67 }); ctx.restore();
      for (const sx of [-1, 1]) { part(ell(30 * sx, -30, 26, 28, 24), C.rex, 90 + sx, { band: 0.4 }); part(ell(32 * sx, -7, 20, 7, 20), C.rex, 93 + sx, { hatch: false }); nubs([32 * sx - 7, 32 * sx, 32 * sx + 7]); }
      arm([40, -106], 1.28, 1.0, 1, C.rex, 100); arm([-40, -106], Math.PI - 1.28, Math.PI - 1.0, 1, C.rex, 104);
      STATS.bumps = 0; STATS.spots = 0;
      onHead(0, p, () => headYaw(yaw, p, f));
    } else if (yaw < 67.5) {
      return false;   // the ¾ master is drawn by the main function
    } else if (yaw < 112.5) {   // SIDE
      const fa = ar.far || [0.96, 0.26], na = ar.near || [0.96, 0.26];
      tail(p, [[-40, -40], [-76, -36], [-110, -38], [-134, -46], [-148, -56]]);
      part([[-38, 0], [22, 0], [24, -6], [18, -13], [-30, -13], [-40, -6]], C.shade, 62, { hatch: false });   // far foot: its heel shows behind the near one
      arm([22, -106], fa[0], fa[1], 0.85, C.shade, 70);
      const body = pear(-4, 46, 48, true); part(body, C.rex, 63, { ghost: true });
      ctx.save(); path(body, true); ctx.clip(); const b = ell(46, -66, 30, 42, 28); fill(b, C.belly); plates(36, -66, 20, 42); stroke(b.slice(9, 23), { w: 1.6, dark: 0.55, seed: 67 });
      [[-22, -110, 7, 5], [-26, -90, 6, 4.5], [-30, -66, 5, 4]].forEach(([x, y, rx, ry]) => fill(ell(x, y, rx, ry, 12), C.spot)); ctx.restore();
      const backX = y => -4 - 48 * Math.sqrt(Math.max(0, 1 - Math.pow((y + 74) / (y < -74 ? 58 : 60), 2)));
      bumpsOn([[-114, 7.5], [-100, 7], [-85, 6.5], [-70, 5.5], [-55, 5]].map(([y, r]) => [backX(y) + 3, y, r]), true);
      part(ell(4, -30, 28, 30, 24), C.rex, 90, { band: 0.4 });
      part([[-16, 0], [46, 0], [50, -5], [47, -10], [38, -14], [-12, -13], [-18, -6]], C.rex, 91, { hatch: false }); nubs([33, 40, 47]);
      arm([30, -104], na[0], na[1], 1, C.rex, 100);
      STATS.spots = 3 + 3;
      onHead(18, p, () => headYaw(90, p, f));
    } else {   // ¾ BACK and BACK: arms → body → legs → tail (nearest the camera) → head → hat
      const back = yaw >= 157.5;
      if (back) for (const sx of [-1, 1]) {   // forearm + hand coming out from behind the body (the body outline crosses it)
        const fa = [[40 * sx, -100], [48 * sx, -97], [55 * sx, -91], [51 * sx, -85], [44 * sx, -90], [38 * sx, -92]]; fill(fa, C.rex); stroke(fa.slice(0, 4), { w: 2.2, seed: 102 + sx });
        const h = ell(56 * sx, -88, 6, 5.5, 14); fill(h, C.rex); stroke(h, { closed: true, w: 2.2, seed: 101 + sx }); }
      else arm([30, -106], 0.55, 1.4, 0.8, C.rex, 100);
      const body = pear(0, 54, 54, false); part(body, C.rex, 63, { ghost: true });
      ctx.save(); path(body, true); ctx.clip();
      if (!back) { fill(ell(62, -80, 18, 30, 24), C.belly); [[-28, -104, 9, 6], [-34, -84, 8, 5.5], [-34, -62, 7, 5]].forEach(([x, y, rx, ry]) => fill(ell(x, y, rx, ry, 12), C.spot)); STATS.spots = 3; }
      else { [[-22, -110, 7, 5], [22, -110, 7, 5], [-30, -90, 6, 4.5], [30, -90, 6, 4.5], [-28, -66, 5, 4], [28, -66, 5, 4]].forEach(([x, y, rx, ry]) => fill(ell(x, y, rx, ry, 12), C.spot)); STATS.spots = 6; }
      ctx.restore();
      if (back) bumpsOn([[0, -122, 7.5], [0, -106, 7], [0, -90, 6.5], [0, -74, 5.5], [0, -58, 5]], false);
      else bumpsOn([0, 1, 2, 3, 4].map(i => [lerp(-14, -22, i / 4), lerp(-120, -56, i / 4), [7.5, 7, 6.5, 5.5, 5][i]]), false);
      if (back) for (const sx of [-1, 1]) { part(ell(30 * sx, -30, 26, 28, 24), C.rex, 90 + sx, { band: 0.4 }); part(ell(30 * sx, -6, 16, 6, 18), C.rex, 93 + sx, { hatch: false }); }
      else { part(ell(-26, -32, 24, 27, 22), C.shade, 61, { band: 0.4 }); part(ell(-26, -6, 14, 6, 18), C.shade, 62, { hatch: false }); part(ell(20, -30, 28, 30, 24), C.rex, 90, { band: 0.4 }); part(ell(22, -6, 16, 6, 18), C.rex, 93, { hatch: false }); }
      if (back) { tail(p, [[0, -44], [-12, -30], [-34, -22], [-56, -24], [-70, -36]], [40, 30, 20, 12], 6); const rt = ell(0, -44, 22, 18, 24); fill(rt, C.rex); stroke(rt.slice(12, 24).concat([rt[0]]), { w: 3, seed: 43 }); }
      else tail(p, [[-14, -44], [-40, -30], [-66, -26], [-86, -32], [-96, -44]], [36, 28, 20, 14], 6);
      onHead(back ? 0 : 6, p, () => headYaw(back ? 180 : 135, p, f));
    }
    return true;
  }

  A.rex2 = (x, y, s, pose = {}) => {
    ctx = A.ctx();
    const p = { t: 0, flip: false, headTilt: 0, lean: 0, squash: 0, air: 0, shadow: true, ...pose }, f = p.face || {};
    KEYB = Math.floor(p.t * 10) % 3; KEYF = Math.floor(p.t * 5) % 3;
    const Ls = p.light || [-0.6, -0.8]; L = [p.flip ? -Ls[0] : Ls[0], Ls[1]];
    ctx.save();
    ctx.translate(x, y);
    const m = ctx.getTransform(); S = Math.hypot(m.a, m.b) * s;
    // contact shadow (§3.4): under the feet, wider and lighter in the air
    if (p.shadow) { const h = p.air; ctx.save(); ctx.scale(s, s); fill(ell(2 * (p.flip ? -1 : 1), 0, 58 * (1 + h / 200), 8, 24), '#3a3328', 0.22 * Math.max(0, 1 - h / 150)); ctx.restore(); }
    ctx.translate(0, -p.air * s);
    ctx.scale(s * (p.flip ? -1 : 1), s); ctx.rotate(p.lean); ctx.scale(1 + p.squash * 0.6, 1 - p.squash);
    if (p.yaw != null && (p.yaw < 22.5 || p.yaw >= 67.5) && turn(p, f)) { A.rex2.stats = STATS; ctx.restore(); return; }
    STATS = { yaw: 45, skull: 'width 141 (¾)', eyeRy: 26, hatW: 63, bumps: 5, spots: 9 };
    A.rex2.stats = STATS;
    tail(p);
    // far leg
    part(ell(-22, -32, 24, 27, 22), C.shade, 61, { band: 0.4 });
    part([[-50, 0], [6, 0], [8, -6], [2, -12], [-44, -12], [-52, -6]], C.shade, 62, { hatch: false });
    // far arm (behind the body)
    const ar = p.arms || {}, fa = ar.far || [1.15, 0.45], na = ar.near || [0.96, 0.26];
    arm([24, -106], fa[0], fa[1], 0.85, C.shade, 70);
    // body: a pear, flatter in the front-lower quarter
    const body = A.blobPts(0, -74, a => { const s2 = Math.sin(a), k = Math.min(1, Math.max(0, (s2 + 0.3) / 0.6)); let rx = lerp(44, 54, k); const ry = s2 < 0 ? 58 : 60;
      if (Math.cos(a) > 0 && s2 > 0) rx -= 6 * Math.sin(2 * a); return [rx, ry]; }, 40);
    part(body, C.rex, 63, { ghost: true });
    // belly patch with 3 bowed plate lines
    const belly = ell(16, -66, 30, 42, 28);
    ctx.save(); path(body, true); ctx.clip(); fill(belly, C.belly);
    for (let k = 0; k < 3; k++) { const yy = -96 + k * 22, hw = Math.sqrt(Math.max(0, 1 - Math.pow((yy + 66) / 42, 2))) * 30 - 4; stroke([[16 - hw, yy], [16, yy + 4], [16 + hw, yy]], { w: 1.4, dark: 0.3, j: 0.4, seed: 64 + k }); }
    stroke(belly.slice(20).concat(belly.slice(0, 9)), { w: 1.6, dark: 0.55, seed: 67 });
    // body spots
    [[-22, -110, 7, 5], [-26, -90, 6, 4.5], [-30, -66, 5, 4]].forEach(([sx, sy, rx, ry]) => fill(ell(sx, sy, rx, ry, 12), C.spot));
    ctx.restore();
    // back bumps: on the back contour, outer half-outline only
    const headW = HEAD.map(q => rot([q[0] + HC[0], q[1] + HC[1]], NECK, p.headTilt));
    const dSeg = (q, a, b) => { const vx = b[0] - a[0], vy = b[1] - a[1], u = Math.max(0, Math.min(1, ((q[0] - a[0]) * vx + (q[1] - a[1]) * vy) / (vx * vx + vy * vy))); return Math.hypot(q[0] - a[0] - u * vx, q[1] - a[1] - u * vy); };
    [[-36, -114, 7.5], [-43, -100, 7], [-47, -85, 6.5], [-50, -70, 5.5], [-50, -55, 5]].forEach(([bx, by, r], i) => {
      const dh = Math.min(...headW.map((a, k) => dSeg([bx, by], a, headW[(k + 1) % headW.length])));
      if (dh - r < 4) return;   // too close to the head outline
      const E = ell(bx, by, r, r * 0.75, 14); fill(E, C.shade); stroke(E.slice(4, 12), { w: 1.6, seed: 80 + i });
    });
    // near leg: thigh + foot (sole exactly on y = 0) + 3 claw nubs
    part(ell(24, -30, 28, 30, 24), C.rex, 90, { band: 0.4 });
    const foot = [[2, 0], [54, 0], [58, -4], [56, -9], [48, -13], [40, -14], [20, -14], [4, -12], [0, -6]];
    part(foot, C.rex, 91, { hatch: false });
    for (const cx of [40, 47, 54]) { const nub = [[cx - 2.5, 0], [cx + 2.5, 0], [cx + 2.5, -4], [cx, -6], [cx - 2.5, -4]]; fill(nub, C.claw); stroke(nub, { closed: true, w: 1.4, j: 0.3, seed: 95 + cx }); }
    // near arm
    arm([36, -104], na[0], na[1], 1, C.rex, 100);
    // head on the neck pivot
    ctx.save(); ctx.translate(NECK[0], NECK[1]); ctx.rotate(p.headTilt); ctx.translate(HC[0] - NECK[0], HC[1] - NECK[1]);
    head(p, f);
    // hat: parented to the head, small spring wobble
    const hat = p.hat || {};
    if (hat.on !== false) {
      const wob = Math.max(-0.15, Math.min(0.15, hat.wob || 0));
      ctx.save(); ctx.translate(-16 + (hat.dx || 0), -48 + (hat.dy || 0)); ctx.rotate(-0.28 + wob); ctx.scale(1.05, 1.05);
      const cap = [[-30, 8], [-26, -16], [-14, -28], [0, -32], [14, -28], [26, -16], [30, 8], [20, 0], [12, 9], [2, -1], [-8, 9], [-18, 0]];
      fill(cap, C.hat); fill(ell(-10, -18, 3.5, 2.5, 10), C.hatSpot); fill(ell(8, -14, 3, 2.2, 10), C.hatSpot);
      ctx.save(); path(cap, true); ctx.clip(); shadowClip(cap, 0.3); A.hatch(cap, { gap: 6, dark: 0.12, seed: 120 }); ctx.restore();
      stroke(cap, { closed: true, w: 2.4, seed: 121 });
      ctx.restore();
    }
    ctx.restore();
    ctx.restore();
  };

  // measurements straight from the rig (for the guides readout)
  // just the head at any yaw 0…90 (head-turn strips): HC at (x, y)
  A.rex2.head = (x, y, s, pose = {}) => {
    ctx = A.ctx();
    const p = { t: 0, flip: false, headTilt: 0, ...pose }, f = p.face || {};
    KEYB = Math.floor(p.t * 10) % 3; KEYF = Math.floor(p.t * 5) % 3;
    const Ls = p.light || [-0.6, -0.8]; L = [p.flip ? -Ls[0] : Ls[0], Ls[1]];
    ctx.save(); ctx.translate(x, y); const m = ctx.getTransform(); S = Math.hypot(m.a, m.b) * s; ctx.scale(s * (p.flip ? -1 : 1), s);
    STATS = {}; headYaw(p.yaw ?? 45, p, f); ctx.restore();
  };
  A.rex2.geom = () => {
    const ys = HEAD.map(q => q[1] + HC[1]), xs = HEAD.map(q => q[0] + HC[0]);
    const top = Math.min(...ys), chin = Math.max(...ys);
    return { headTop: top, chin, headPct: (chin - top) / -top * 100, hatTop: HC[1] - 48 - 32 * 1.05, nearEye: [HC[0] - 6, HC[1] + 2], farEye: [HC[0] + 38, HC[1]],
      snoutTip: Math.max(...xs) - HC[0], headWidth: Math.max(...xs) - Math.min(...xs) };
  };
})();
