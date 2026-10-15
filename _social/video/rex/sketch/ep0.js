// Episode 0, "Rex is Born" (180 s), round 2 after the director's review (director/review_ep0_round1.md).
// One jungle world for the whole episode (world units ≈ pixels at zoom 1). State table (kept consistent):
//   plateau ground y 1050 (x < 1350): tree (branch tip ≈ (912, 570)), balanced rock on a tiny pebble at x 1050;
//   pebble heap at the plateau edge (x 1290–1370); slope (1350,1050) → (2400,1520); valley floor y 1520.
//   nest on the slope at x 1600, slides to the root at x 2050 (84 s on: caught, tilted 20°);
//   big elephant-ear leaf grows at x 2620 on the floor; the egg rolls into it and rests at x 2545 (94.4 s on);
//   after hatching Rex sits at x 2430 (left of the leaf stem); the leaf from the tree lies flat at x 900.
(function () {
  const A = window.ART, F = window.FILM;
  const { kf, ease, clamp, lerp } = F;
  const GROUND = 1050, FLOOR = 1520, EDGE = 1350;
  const slopeY = x => x < EDGE ? GROUND : x > 2400 ? FLOOR : GROUND + (x - EDGE) * (FLOOR - GROUND) / (2400 - EDGE);
  const SLOPE_A = Math.atan2(FLOOR - GROUND, 2400 - EDGE);
  const LEAFX = 2620, EGG_STOP = 2572, REX_X = 2430, NEST0 = 1600, ROOT = 2050;

  /* ---------- the world ---------- */
  function world(T, o = {}) {
    const reveal = o.reveal ?? 1, wind = o.wind || 0;
    F.layer(0.15, () => {
      A.sun(2050, 660 - clamp((reveal - 0.55) / 0.3) * 40, 58, clamp((reveal - 0.55) / 0.2) * (1 - (o.sunHide || 0)));
      F.pop(clamp((reveal - 0.5) / 0.15), 0, () => { A.cloud(900, 380, 1.4, 1); A.cloud(2700, 330, 1.1, 4); });
      if (o.clouds) A.cloud(2900 - o.clouds * 850, 620, 1.9, 7);
    });
    F.layer(0.3, () => A.mountains(980, 340, 3, A.PAL.mountain, 0.5, clamp(reveal / 0.33)));
    F.layer(0.55, () => {
      F.pop(clamp((reveal - 0.3) / 0.15), 0, () => {
        A.cliff(-700, 1180, 900, 720, 5);
        A.cliff(2900, 1360, 1100, 860, 6, A.PAL.cliff, 3300);
        A.waterfall(3300, 560, 90, 780, T, 7);
      });
      F.pop(clamp((reveal - 0.45) / 0.15), 0, () => A.canopy(1290, 9, A.PAL.jungle, 0.45, T));
      F.pop(clamp((reveal - 0.62) / 0.15), 0, () => { A.palm(-120, 470, 300, 13, T, 1 + wind); A.palm(3050, 520, 320, 14, T, 1 + wind); A.palm(3600, 540, 280, 15, T, 1 + wind); A.palm(560, 1280, 420, 11, T, 1 + wind); });
      if (o.birds != null && o.birds > 0 && o.birds < 1) A.birds(600 + o.birds * 2200, 560 - o.birds * 80, 1.2, T);
    });
    F.pop(clamp((reveal - 0.45) / 0.15), 0, () => ground(T));
  }
  function ground(T) {
    const pts = [[-2400, GROUND], [EDGE - 60, GROUND], [EDGE - 10, GROUND + 4], [EDGE + 40, GROUND + 22]];
    for (let x = EDGE + 110; x <= 2400; x += 70) pts.push([x, slopeY(x) + Math.sin(x * 0.02) * 4]);
    pts.push([6000, FLOOR], [6000, 3000], [-2400, 3000]);
    A.fill(pts, A.PAL.ground, { alpha: 1, seed: 2 });
    A.hatch(pts, { gap: 10, dark: 0.1, angle: -0.5, seed: 4 });
    A.line(pts.slice(0, -2), { w: 2.6, seed: 2 });
    for (let i = 0; i < 90; i++) {
      const gx = -1500 + A.rnd(13, i) * 6500, gy = slopeY(gx) + 24 + A.rnd(14, i) * 700;
      if (i % 3) A.line([[gx, gy], [gx + 5, gy - 14]], { w: 1.2, dark: 0.4, seed: i, passes: 1 });
      else A.line(A.ellipsePts(gx, gy, 8, 4.5, 8), { closed: true, w: 1.2, dark: 0.45, seed: i, passes: 1 });
    }
    for (let i = 0; i < 40; i++) { const gx = -1400 + i * 150 + A.rnd(15, i) * 60; F.tuft(gx, slopeY(gx) + 4, 1, i); }
  }
  // foreground ferns only in the bottom corners, and only in wider shots (never over the action in close-ups)
  function foreground(T, wind = 0) {
    const z = F.cam().z;
    if (z > 2.2) return;
    const ctx = A.ctx(); ctx.save(); ctx.globalAlpha = Math.min(1, (2.2 - z) / 0.5);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    A.fern(60, F.H + 30, 1.5, 81, T, 1, 1 + wind * 3); A.fern(F.W - 60, F.H + 40, 1.6, 82, T, -1, 1 + wind * 3);
    ctx.restore();
  }

  /* ---------- the chain ---------- */
  const BRANCH = [912, 590];
  const RR = 92, RX = 1050, BASE_TOP = GROUND - 14;
  // boulder: pivots on the base pebble while tipping (to 65 s), then rolls about its centre along the ledge
  function boulder(T) {
    const tilt = T < 60.5 ? 0 : T < 61.7 ? kf(T, [[60.5, 0], [61.0, 0.2, 'out'], [61.35, 0.12], [61.7, 0.24]]) : T < 65 ? kf(T, [[61.7, 0.24], [65, 0.62, 'in']]) : 0.62;
    const c = [RX + Math.sin(tilt) * RR * 0.94, BASE_TOP - Math.cos(tilt) * RR * 0.94];
    if (T < 65) return { cx: c[0], cy: c[1], rot: tilt };
    const xStop = 1288 - RR, yOn = GROUND - RR * 0.94;   // right edge touches the heap at 68.0
    if (T < 68) { const p = (T - 65) / 3, x = lerp(c[0], xStop, ease.in(p) * 0.4 + p * 0.6); return { cx: x, cy: lerp(c[1], yOn, Math.min(1, p * 4)), rot: tilt + (x - c[0]) / RR }; }
    const back = Math.exp(-(T - 68) * 2.4) * Math.sin((T - 68) * 7) * 14;
    return { cx: xStop - back, cy: yOn, rot: tilt + (xStop - c[0] - back) / RR };
  }
  const basePebble = T => { if (T < 63) return [RX, GROUND - 7, 0]; const q = clamp((T - 63) / 0.9); return [RX - q * 80, GROUND - 7 - Math.sin(q * Math.PI) * 50, q * 8]; };
  // the leaf: hangs from the twig, snaps at 49, S-curve fall, lands seated on the rock top at 58.2, slides off and lies flat
  function leafState(T) {
    if (T < 49.2) { const fl = Math.sin(T * 18.8) * (T > 45 ? 0.16 * clamp((T - 45) / 3) : 0.03); return { x: BRANCH[0] - 18, y: BRANCH[1] + 12, rot: 1.25 + fl, s: 1.0, flat: 1 }; }
    const top = boulder(58.2), topY = top.cy - RR * 0.94 * 0.98;
    if (T < 58.2) {
      const p = (T - 49.2) / 9, e = ease.out(p);
      return { x: lerp(BRANCH[0] - 6, RX - 56, p) + Math.sin(p * Math.PI * 3) * 90 * (1 - p * 0.7), y: lerp(BRANCH[1] + 30, topY, e), rot: Math.sin(p * Math.PI * 3) * 0.45, s: 1.0, flat: 1 };
    }
    if (T < 62.5) { const b = boulder(T); return { x: b.cx - 56, y: b.cy - RR * 0.93 + (T < 58.4 ? 3 : 0), rot: b.rot, s: 1.0, flat: T < 58.4 ? 0.85 : 0.9 }; }
    const q = clamp((T - 62.5) / 1.8), b = boulder(62.5);
    return { x: lerp(b.cx - 56, 900, q), y: lerp(b.cy - RR * 0.93, GROUND - 4, q * q), rot: lerp(b.rot, -0.05, q), s: 1.0, flat: lerp(0.9, 0.35, q) };
  }
  // pebble heap: 8 round pebbles, bigger at the bottom, one balanced on top
  const HEAP = [[1302, 14], [1330, 13], [1356, 12], [1316, 11], [1342, 10], [1328, 9], [1290, 10], [1368, 9]].map(([x, r], i) => ({ x, r, y: GROUND - r - (i >= 3 && i < 5 ? 20 : i === 5 ? 38 : 0), seed: 1320 + i }));
  // each pebble: its own arc and resting place; pebbles 2 and 5 end in the nest (5 lands in an empty shell: "ding")
  const DEST = [1540, 1625, 1580, 1840, 2010, 1648, 2280, 1730];
  function nestState(T) {
    let x = NEST0 + (T > 71.0 ? 6 : 0);
    if (T > 79.5) x = NEST0 + 6 + ease.in(clamp((T - 79.5) / 4)) * (ROOT - NEST0 - 46);
    let tilt = SLOPE_A;
    if (T > 79.5) tilt = SLOPE_A + clamp((T - 79.5) / 4) * (0.35 - SLOPE_A);
    if (T > 83.5) tilt = 0.35 + Math.exp(-(T - 83.5) * 4) * Math.sin((T - 83.5) * 14) * 0.08;
    return { x, y: slopeY(x) + 8, tilt };
  }
  const inNest = (n, dx, dy) => [n.x + dx * Math.cos(n.tilt) - dy * Math.sin(n.tilt), n.y + dx * Math.sin(n.tilt) + dy * Math.cos(n.tilt)];
  function pebble(i, T) {
    const h = HEAP[i], t0 = 68.15 + [0, 0.2, 0.08, 0.32, 0.45, 0.12, 0.6, 0.26][i];
    if (T < 68) return [h.x, h.y, 0];
    if (T < t0) return [h.x + Math.sin(T * 60 + i) * 2, h.y, 0];
    const dur = 6.2 + i * 0.4, q = clamp((T - t0) / dur), x = lerp(h.x, DEST[i], q * (2 - q) * 0.6 + q * 0.4);
    const hop = Math.abs(Math.sin(q * Math.PI * 3)) * (70 - i * 4) * Math.pow(1 - q, 1.6);
    let y = slopeY(x) - h.r - hop;
    if (q >= 1 && (i === 5 || i === 2)) { const n = nestState(T); const [nx, ny] = inNest(n, i === 5 ? 50 : -30, i === 5 ? -40 : -36); return [nx, ny, 0]; }
    return [x, y, (x - h.x) / h.r];
  }
  function eggState(T) {
    const n = nestState(T);
    if (T < 84) { const [x, y] = inNest(n, 0, -22); return { x, y, rot: n.tilt * 0.5 }; }
    const [x0, y0] = inNest(nestState(84), 0, -22);
    if (T < 84.35) { const q = (T - 84) / 0.35; return { x: x0 + q * 80, y: y0 - Math.sin(q * Math.PI) * 50 + q * 36, rot: n.tilt + q * 1.2 }; }
    const xs = x0 + 80, p = clamp((T - 84.35) / (93 - 84.35)), e = ease.out(p);
    let x = lerp(xs, EGG_STOP, e), rot = n.tilt + 1.2 + e * 8 + Math.sin(e * 28) * 0.12;
    if (T >= 93) { const r = T - 93; x = EGG_STOP - Math.exp(-r * 3) * Math.sin(r * 8) * 10; rot = n.tilt + 9.2 + Math.exp(-r * 3) * Math.sin(r * 8) * 0.2; }
    let y = slopeY(x);
    if (T > 88.6 && T < 89.8) y -= Math.sin((T - 88.6) / 1.2 * Math.PI) * 26;
    return { x, y, rot: T > 94.4 ? 0 : rot % (Math.PI * 2) };
  }
  const ES = 1.1;   // egg scale (88 world units tall)

  function drawChain(T) {
    const ctx = A.ctx();
    A.tree(650, GROUND, 1, 700, T, T > 49 && T < 49.8 ? Math.exp(-(T - 49) * 6) * Math.sin((T - 49) * 30) * 10 : 0);
    A.line([[1990, slopeY(1990) - 2], [2020, slopeY(2020) - 22], [2060, slopeY(2060) - 18], [2090, slopeY(2090) - 2]], { w: 5, seed: 1200 });   // root
    A.line([[2280, slopeY(2280) - 4], [2330, slopeY(2330) - 12]], { w: 3, seed: 1201 });   // twig the egg hops over
    let bend = Math.sin(T * 1.3) * 0.012 * (1 + F.windAt(T) * 3);
    if (T > 93) bend += Math.exp(-(T - 93) * 3) * Math.sin((T - 93) * 7) * 0.12;
    if (T > 168) bend += 0.14 * clamp((T - 168) / 3);   // the leaf curls toward Rex like a hug
    // nest (back rim), empty shells, the egg, two pebbles, nest (front rim), the other pebbles
    const n = nestState(T);
    A.nestBack(n.x, n.y, 0.75, n.tilt, 31);
    ctx.save(); ctx.translate(n.x, n.y); ctx.rotate(n.tilt); A.shell(-52, -30, 0.95, -0.25, 51); A.shell(50, -30, 0.9, 0.2, 52); ctx.restore();
    const e = eggState(T);
    if (T < 84) A.egg(e.x, e.y, ES, e.rot, 41, 0, { shadow: false });
    for (const i of [2, 5]) { const [px, py, pr] = pebble(i, T); A.pebble(px, py, HEAP[i].r, pr, HEAP[i].seed); }
    A.nestFront(n.x, n.y, 0.75, n.tilt, 32);
    for (let i = 0; i < 8; i++) if (i !== 2 && i !== 5) { const [px, py, pr] = pebble(i, T); A.pebble(px, py, HEAP[i].r, pr, HEAP[i].seed); }
    // the egg out of the nest: rolling, resting against the leaf, cracking, peeking
    if (T >= 84 && T < 110.5) {
      const crack = T > 106.5 ? 1 : T > 103 ? 0.55 : 0;
      const wob = T > 100 && T < 100.4 ? Math.sin((T - 100) * 40) * 0.05 : T > 101.2 && T < 101.7 ? Math.sin((T - 101.2) * 40) * 0.09 : T > 108 && T < 108.5 ? Math.sin((T - 108) * 42) * 0.06 : 0;
      A.egg(e.x, e.y, ES, e.rot + wob, 41, crack);
      for (const [tc, dir] of [[103, -1], [106.5, 1]]) if (T > tc && T < tc + 1.2) { const q = (T - tc) / 1.2; A.shell(e.x + dir * (10 + q * 60), e.y - 70 - Math.sin(q * Math.PI) * 50 + q * 40, 0.18, q * 6, 54 + dir); }
    }
    if (T >= 110.5 && T < 118.6) {
      const lid = clamp((T - 110.5) / 0.4) * 22 - (T > 116.5 && T < 117.2 ? 11 * Math.sin((T - 116.5) / 0.7 * Math.PI) : 0);
      A.eggPeek(EGG_STOP, FLOOR, ES, lid, T);
    }
    if (T >= 118.6) A.shell(EGG_STOP, FLOOR + 2, 1.45, 0, 55);
    A.taro(LEAFX, FLOOR, 1.0, { bend });
    const bp = basePebble(T); A.pebble(bp[0], bp[1], 9, bp[2], 1300);
    const b = boulder(T); A.boulder(b.cx, b.cy, RR, b.rot, 1000);
    const L = leafState(T);
    if (T < 49.2) A.line([[BRANCH[0] - 30, BRANCH[1] - 4], [L.x, L.y]], { w: 2, seed: 1210, passes: 1 });
    A.heartLeaf(L.x, L.y, L.s, L.rot, 71, { flat: L.flat });
  }

  /* ---------- Rex after hatching ---------- */
  const REX_S = 0.62;
  function rexState(T) {
    const st = { x: REX_X, y: FLOOR - 4, s: REX_S, squash: Math.sin(T * 2.6) * 0.012, flip: false, lean: 0 };
    const p = { mouth: 'smile', eye: 'open', shellHat: 1, tail: T * 2.4, blink: F.blinkAt(T, 3.5), tearT: T };
    st.pose = p;
    if (T < 120.4) {   // pops up in the shell, then hops out to the left of the leaf
      const up = ease.back(clamp((T - 118.6) / 0.8));
      st.x = EGG_STOP; st.y = FLOOR + 22 + (1 - up) * 60;
      p.eye = 'wide'; p.mouth = 'o'; p.shellHat = 0; p.arms = 1; p.step = T * 8;
    }
    if (T >= 120.4 && T < 121) { st.x = EGG_STOP; st.y = FLOOR + 22; p.shellHat = 0; p.eye = 'wide'; p.mouth = 'o'; }
    if (T >= 121 && T < 122.4) { st.x = EGG_STOP; st.y = FLOOR + 22; p.look = [0, -1]; p.eye = 'wide'; p.mouth = 'o'; }
    if (T >= 122.4 && T < 123.4) { const q = (T - 122.4) / 1.0; st.x = lerp(EGG_STOP, REX_X, ease.inout(q)); st.y = FLOOR + 22 - 26 * q - Math.sin(q * Math.PI) * 60; st.flip = true; p.eye = 'wide'; p.mouth = 'smile'; p.step = T * 10; }
    if (T >= 123.4 && T < 124) { p.look = [0, -1]; p.eye = 'wide'; p.mouth = 'o'; if (T > 123.6) p.headTilt = Math.sin((T - 123.6) * 20) * 0.08; }
    if (T >= 124 && T < 126) { p.headTilt = -0.2; p.eye = 'wide'; p.mouth = 'smile'; p.look = [0.6, -0.2]; }
    if (T >= 126 && T < 130) { p.headTilt = -0.06 - Math.abs(Math.sin((T - 126) * 7.8)) * 0.07; p.look = [1, -0.3]; p.eye = 'open'; p.mouth = 'closed'; }
    if (T >= 130 && T < 131.2) { p.eye = 'squeeze'; p.brow = 'up'; p.headTilt = -0.26 * ease.in((T - 130) / 1.2); p.mouth = 'sneeze'; }
    if (T >= 131.2 && T < 131.5) { p.eye = 'squeeze'; p.headTilt = 0.18; p.mouth = 'open'; p.hatDy = -40; p.hatRot = 0.5; }
    if (T >= 131.5 && T < 132) { p.eye = 'wide'; p.mouth = 'o'; p.hatDy = -40 * (1 - (T - 131.5) / 0.5); p.hatRot = 0.5; }
    if (T >= 132 && T < 134) { p.eye = 'wide'; p.mouth = 'o'; p.hatRot = 0.35; }
    if (T >= 133.5 && T < 134) { p.eye = 'happy'; p.mouth = 'laugh'; }
    if (T >= 134) p.hatRot = 0.35;   // crooked the other way from now on
    if (T >= 134 && T < 137) { p.tail = T * 12; p.tailSwing = Math.sin(T * 5) * 0.2; p.look = [-1, 0.2]; p.eye = 'wide'; p.mouth = 'o'; if (T > 135) p.headTilt = 0.15; }
    if (T >= 137 && T < 139.5) {   // 4 flips over 2.5 s, each with an anticipation squash
      const k = Math.floor((T - 137) / 0.625), lt = (T - 137) % 0.625;
      st.flip = k % 2 === 1; p.look = [-1, 0]; p.eye = 'wide'; p.mouth = 'open';
      st.squash = lt < 0.1 ? 0.12 : lt < 0.2 ? -0.06 : 0; p.tail = T * 20; p.step = T * 14;
    }
    if (T >= 139.5 && T < 142) { st.squash = T < 139.8 ? 0.2 : 0.07; p.tailSwing = 0.9; p.eye = T > 140.5 ? 'happy' : 'wide'; p.mouth = T > 140.5 ? 'laugh' : 'o'; p.arms = T > 140.5 ? 1 : 0; p.step = T * 6; p.look = [0.2, 0.8]; }
    if (T >= 142 && T < 149) {
      const [bx, by] = beetlePos(T), [ex, ey] = A.rexEye(st.x, st.y, st.s);
      p.look = [clamp((bx - ex) / 80, -1, 1), clamp((by - ey) / 80, -1, 1)]; p.eye = 'wide'; p.brow = 'up'; p.mouth = 'o';
      p.headTilt = -0.2 + clamp((bx - ex) / 600, -0.1, 0.15);
      if (T > 146 && T < 147) { st.lean = 0.12; p.mouth = 'closed'; }
      if (T > 147 && T < 148.5) { const a = (T - 147) / 1.5 * Math.PI * 2; p.look = [Math.cos(a), Math.sin(a) - 0.4]; }
      if (T > 148.5) { p.eye = 'happy'; p.mouth = 'laugh'; }
    }
    if (T >= 149 && T < 158) {
      p.look = T < 151 ? [-1, -0.8] : T < 152 ? [-0.2, -1] : [Math.sin((T - 152) * 0.9), -0.4];
      p.headTilt = T < 152 ? -0.15 : 0; st.squash = T > 150.5 && T < 152 ? -0.06 : st.squash;
      p.eye = T > 157.5 ? 'sad' : 'wide'; p.mouth = T > 157.5 ? 'sad' : 'closed';
    }
    if (T >= 158 && T < 167) {
      p.eye = 'sad'; p.mouth = 'sad'; p.look = [0.3, 0.2]; p.tailSwing = T > 165 ? 0.9 : 0.3;
      p.shiver = (T > 162 && T < 162.8) || (T > 163.4 && T < 164.2) ? 1 : 0;
      p.hatDy = T > 163.5 ? 6 * clamp((T - 163.5) / 1) : 0;
    }
    if (T >= 167) {
      p.tailSwing = 0.9; p.hatDy = 6; p.tears = T > 168.5 ? 1 : 0;
      const sob = (T > 170 && T < 172) || (T > 173 && T < 174.4);
      p.eye = sob ? 'squeeze' : 'sad'; p.mouth = sob ? 'wail' : 'sad';
      p.headTilt = T > 170 && T < 172 ? -0.2 : T > 173 && T < 174.4 ? -0.12 : 0;
      if (T > 167.5 && T < 170) p.mouth = Math.floor(T * 16) % 2 ? 'sad' : 'closed';   // lip trembles
    }
    return st;
  }
  const beetlePos = T => { const u = lerp(0.9, 0.15, clamp((T - 142.5) / 3.5)); return A.taroEdge(LEAFX, FLOOR, 1.0, u); };
  function drawRex(T) {
    if (T < 118.6) return;
    const st = rexState(T);
    for (let i = 0; i < 4; i++) A.shell(EGG_STOP - 130 + i * 60 + (i > 1 ? 170 : 0), FLOOR + 2, 0.3, 4 + i, 57 + i);
    A.rex(st.x, st.y, st.s, { ...st.pose, squash: st.squash, flip: st.flip, lean: st.lean }, 21);
    if (T < 122.4) A.shell(EGG_STOP, FLOOR + 2, 1.45, 0, 55);   // he sits inside the bottom half
    if (T < 121) {   // the top piece spins up (motion trail) and lands on his head at 121.0
      for (let g = 3; g >= 0; g--) {
        const tq = T - g * 0.05, q = clamp((tq - 118.6) / 2.4);
        const hx = lerp(EGG_STOP, EGG_STOP + 10, q), hy = lerp(FLOOR - 70, FLOOR + 22 - 230 * REX_S, q) - Math.sin(q * Math.PI) * 200;
        const ctx = A.ctx(); ctx.save(); ctx.globalAlpha = g ? 0.2 : 1; A.shell(hx, hy, 0.62, q * 12.5, 53, true); ctx.restore();
      }
    }
    if (T > 131.2 && T < 132) { const [nx, ny] = A.rexNose(st.x, st.y, st.s); const q = (T - 131.2) / 0.8; for (let i = 0; i < 6; i++) A.fill(A.ellipsePts(nx + 20 + q * 50 + i * 6, ny - 10 + Math.sin(i * 2) * 14, 10 + q * 14, 8 + q * 10, 12), '#ffffff', { alpha: (1 - q) * 0.9, seed: 1220 + i }); }
    if (T > 142 && T < 149) {
      if (T < 147) { const [bx, by] = beetlePos(T); A.beetle(bx, by, 1.2, { t: T, walk: T < 146 ? T : 0, rot: 0.75 }); }
      else { const q = (T - 147) / 1.5, a = q * Math.PI * 2, [bx, by] = beetlePos(146); A.beetle(bx + Math.sin(a) * 90 + q * 260, by - (1 - Math.cos(a)) * 90 - q * 260, 1.2, { t: T, wings: 1, rot: -a }); }
    }
  }

  // shared with Episode 1: the same valley after the hatching
  F.valley = { world, ground, foreground, GROUND, FLOOR, LEAFX, HX: EGG_STOP, REX_X, EGG_STOP, slopeY,
    after(T) {
      const ctx = A.ctx();
      A.tree(650, GROUND, 1, 700, T, 0);
      A.line([[1990, slopeY(1990) - 2], [2020, slopeY(2020) - 22], [2060, slopeY(2060) - 18], [2090, slopeY(2090) - 2]], { w: 5, seed: 1200 });
      const n = nestState(200); A.nestBack(n.x, n.y, 0.75, n.tilt, 31);
      ctx.save(); ctx.translate(n.x, n.y); ctx.rotate(n.tilt); A.shell(-52, -30, 0.95, -0.25, 51); A.shell(50, -30, 0.9, 0.2, 52); ctx.restore();
      for (const i of [2, 5]) { const [px, py, pr] = pebble(i, 200); A.pebble(px, py, HEAP[i].r, pr, HEAP[i].seed); }
      A.nestFront(n.x, n.y, 0.75, n.tilt, 32);
      for (let i = 0; i < 8; i++) if (i !== 2 && i !== 5) { const [px, py, pr] = pebble(i, 200); A.pebble(px, py, HEAP[i].r, pr, HEAP[i].seed); }
      const b = boulder(200); A.boulder(b.cx, b.cy, RR, b.rot, 1000);
      const L = leafState(200); A.heartLeaf(L.x, L.y, L.s, L.rot, 71, { flat: L.flat });
      for (let i = 0; i < 4; i++) A.shell(EGG_STOP - 130 + i * 60 + (i > 1 ? 170 : 0), FLOOR + 2, 0.3, 4 + i, 57 + i);
    },
  };

  /* ---------- shot list ---------- */
  const TEXT = [
    ['మనుషులు రాకముందే, చాలా చాలా కాలం క్రితం...', 'Long, long ago, before there were any people...', 2.0, 8.4],
    ['ఈ ప్రపంచం అప్పటికే ఎంతో అందంగా ఉండేది.', 'the world was already very beautiful.', 9.6, 16.4],
    ['పచ్చని అడవి, ఎత్తైన కొండలు, పాటలు పాడే జలపాతం.', 'Green jungle, tall hills, and a singing waterfall.', 17.6, 24.4],
    ['ఇక్కడ ఏం జరుగుతుందో చూద్దామా?', 'Shall we see what happens here?', 25.4, 30.4],
  ];
  // [time, cx, cy, zoom, roll, easing-of-the-segment-ending-here]
  const CAM = [
    [0, 1800, 950, 0.56], [9, 1800, 950, 0.58, 0, 'inout'], [17, 1800, 950, 0.605, 0, 'lin'], [25, 2150, 920, 0.70, 0, 'inout'], [31, 2150, 980, 0.70, 0, 'inout'],
    [37, 2150, 980, 0.70],
    [37.01, 650, 820, 0.85], [45, 860, 640, 1.55, 0, 'inout'],                       // S06 breeze → medium on the branch
    [45.01, 900, 640, 2.1], [51, 900, 640, 2.18],                                     // S07 leaf on the twig
    [51.01, 905, 700, 1.9], [58.2, 1020, 905, 2.05, 0, 'inout'], [59, 1030, 915, 2.05],   // S08 tilt down with the leaf
    [59.01, 1060, 945, 3.3], [66, 1070, 955, 3.6, 0.017, 'in'],                        // S09 close-up, rock tipping
    [66.01, 1150, 960, 2.4], [67.5, 1260, 980, 2.4, 0, 'out'], [70, 1300, 990, 2.4], [72, 1450, 1050, 1.9, 0, 'inout'],   // S10 truck to the heap, follow the pebbles
    [72.01, 1610, 1110, 2.35], [74, 1610, 1110, 2.35], [77, 1615, 1110, 2.55, 0, 'out'], [79, 1615, 1110, 2.55],   // S11 nest
    [79.01, 1700, 1140, 1.05], [85, 2050, 1260, 1.05, 0, 'inout'], [87, 2050, 1260, 1.05],   // S12 nest slides (wide side view)
    [87.01, 2140, 1340, 2.6], [93, EGG_STOP, 1430, 3.0, 0, 'out'], [95, EGG_STOP, 1430, 3.0],   // S13 dolly with the egg, low
    [95.01, EGG_STOP + 20, 1450, 3.0], [102, EGG_STOP + 6, 1478, 4.8, 0, 'inout'],      // S14 hush, push in
    [102.01, EGG_STOP, 1478, 5.8], [110, EGG_STOP, 1478, 5.8],                          // S15 crack
    [110.01, EGG_STOP, 1462, 8.2], [118, EGG_STOP, 1462, 8.5, 0, 'inout'],               // S16 peek (ECU)
    [118.01, 2540, 1440, 3.0], [119.2, 2540, 1440, 3.0], [120.4, 2540, 1430, 2.8, 0, 'out'], [122.4, 2540, 1430, 2.8], [123.6, 2470, 1430, 2.8, 0, 'inout'], [126, 2470, 1430, 2.8],   // S17 pop
    [126.01, 2470, 1400, 4.2], [134, 2470, 1400, 4.2],                                  // S18 sneeze: head and shoulders
    [134.01, 2440, 1440, 3.0], [142, 2440, 1440, 3.0],                                  // S19 tail
    [142.01, 2500, 1405, 3.6], [149, 2500, 1405, 3.6],                                  // S20 beetle, low close-up
    [149.01, 2450, 1430, 3.0], [152, 2450, 1430, 3.0], [152.01, 1300, 1050, 0.9], [157, 2900, 1060, 0.9, 0, 'inout'], [157.01, 2465, 1405, 3.6], [158, 2465, 1405, 3.6],
    [158.01, 2500, 1330, 1.7], [167, 2520, 1320, 1.45, 0, 'inout'],                    // S22 cold wind
    [167.01, 2462, 1400, 4.2], [171, 2462, 1400, 4.2], [176, 2400, 1150, 0.85, 0, 'inout'], [180, 2400, 1150, 0.85],   // S23 cry
  ];
  // S13: the camera tracks the rolling egg, ground low in frame
  const camOverride = T => { if (T > 87 && T < 93) { const e = eggState(T); return { cx: e.x + 60, cy: e.y - 90 }; } return null; };

  F.episode(0, {
    duration: 180,
    camera: CAM, camOverride,
    wind: T => T < 37 ? (T > 25 ? 0.15 : 0) : T < 49.5 ? 0.45 : T < 58 ? 0.2 : T < 95 ? 0.08 : T < 158 ? 0.05 : T < 160 ? 0.3 : 0.8,
    cool: T => clamp((T - 152) / 15) * 0.9,
    warmth: T => T < 37 ? 0.6 : T < 95 ? 0.35 : T < 102 ? 0.35 + clamp((T - 98) / 2) * 0.4 : T < 152 ? 0.5 : 0.3,
    vignette: T => T > 95 && T < 118 ? 0.22 : T > 152 && T < 158 ? 0.2 : 0.08,
    bgBlur: T => T > 31 && T < 37 ? clamp((T - 31) / 0.4) * clamp((37 - T) / 0.4) : 0,
    boil: T => (T > 102 && T < 126) ? 15 : T > 158 ? 7.5 : 10,
    draw(T) {
      const reveal = clamp(T / 30);
      world(T, { reveal, wind: F.windAt(T), birds: (T - 22) / 3, sunHide: clamp((T - 158) / 2.5), clouds: T > 152 ? clamp((T - 152) / 8) : 0 });
      if (T > 25) { const ctx = A.ctx(); ctx.save(); ctx.globalAlpha = clamp((T - 25) / 2); drawChain(T); ctx.restore(); }
      drawRex(T);
      if (T > 95 && T < 118) A.sunbeam(EGG_STOP, FLOOR - 50, clamp((T - 98) / 2) * (1 - clamp((T - 116) / 2)));
      foreground(T, F.windAt(T));
    },
    overlay(T, W, H) {
      for (const [te, en, a, b] of TEXT) A.paperStrip(W / 2, 170, 1500, 170, te, en, F.fadeIn(T, a, b));
      F.titleSigns(T, 31, 37, 'EPISODE 0', 'రెక్స్ పుట్టాడు! · Rex is Born!');
      const w = F.windAt(T);
      if (w > 0.1) A.windLines(W, H, T, Math.min(1, w), 3, T > 158 ? 6 : 3);
      if (T > 160 && T < 176) F.tumbleLeaves(W, H, T, 160, 20);
      if (T > 128.8 && T < 131.3) { const q = (T - 128.8) / 2.5; F.pollen(W * 0.66 + q * 40 - q * q * 60, H * 0.36 - q * 30, T); }
      if (T >= 176) {
        F.paperFade(clamp((T - 176) / 0.6) * 0.5);
        A.plank(W / 2, H / 2 - 160, 900, 150, 'ఇంకా ఉంది...', { font: "700 70px 'Nirmala UI'", sub: 'To be continued...', subFont: "40px 'Patrick Hand'", rot: -0.02 + (1 - ease.back(clamp((T - 176.4) / 0.6))) * 0.3, sprig: 1, t: T });
        if (T > 177.5) A.paperStrip(W / 2, H / 2 + 50, 1100, 120, 'తరువాత: మెరిసే వాన చినుకులు', 'Next: the twinkling rain', clamp((T - 177.5) / 0.5), { te: 40, en: 34 });
      }
      F.fadeFromBlack(T, 0, 1);
    },
    cues: [
      ['paper', 0.5], ['pencil', 1.0, 5], ['pencil', 9.0, 4], ['pencil', 17.0, 2], ['falls', 17], ['birds', 22.5], ['breeze', 25, 6],
      ['thock', 31.5], ['creak', 32.0], ['sparkle', 33.0],
      ['breeze', 37, 8], ['rustle', 39], ['rustle', 41.5], ['rustle', 44], ['tik', 49.0], ['pluck', 49.0, 0],
      ['whoosh', 51.5], ['whoosh', 54], ['whoosh', 56.4], ['pat', 58.2],
      ['creak', 60.5], ['pluck', 60.5, 1], ['grind', 62.0, 3], ['plink', 63.1],
      ['tok', 68.0], ['pluck', 68.0, 2], ['pluck', 68.4, 3], ['pluck', 68.7, 4], ['pluck', 69.0, 5], ['rattle', 68.3, 3],
      ['tik', 74.2], ['pluck', 74.2, 3], ['tok', 75.2], ['ding', 76.4], ['creak', 77.5],
      ['pluck', 79.5, 4], ['slide', 79.5, 4], ['bump', 83.5], ['hop', 84.0],
      ['pluck', 87.0, 5], ['roll', 84.4, 8.6], ['tik', 89.0], ['fwump', 93.0], ['chime', 94.4], ['plip', 94.8],
      ['tok', 100.0], ['tok', 101.2], ['crack', 103.0], ['crack', 106.5], ['pluck', 106.5, 6], ['tap', 108.0], ['tap', 108.15], ['tap', 108.3],
      ['squeak', 114.5], ['pop', 118.6], ['tinkle', 119.4], ['tak', 121.0], ['squeak', 121.6], ['hop', 122.4], ['pat', 123.4],
      ['sniff', 126.3], ['sniff', 126.7], ['sniff', 127.1], ['ahh', 130.0, 1.2], ['tchoo', 131.2], ['tak', 132.0], ['giggle', 133.5],
      ['pat', 137.0], ['pat', 137.6], ['pat', 138.25], ['pat', 138.9], ['plop', 139.5], ['giggle', 140.6],
      ['ticks', 142.5, 3.5], ['buzz', 147.0, 1.5], ['giggle', 148.5],
      ['squeak', 151.0], ['squeak', 157.2], ['birds', 154],
      ['wind', 158, 22], ['brrr', 162.0], ['brrr', 163.4], ['whimper', 170.0, 2], ['sniffle', 172.3], ['whimper', 173.0, 1.4], ['sniffle', 174.6],
      ['scratch', 176.4], ['note', 177.0],
    ],
    music: [
      [1, 31, 'flute_open', 0.8], [31, 36.5, 'title', 1], [37, 95, 'tick', 0.55], [95, 110, 'heartbeat', 0.5], [102, 118, 'heartbeat_fast', 0.5],
      [110, 118, 'kalimba_curious', 0.6], [118, 126, 'joy_run', 0.9], [126, 149.5, 'kalimba_play', 0.7], [149.5, 167, 'flute_question', 0.6],
      [158, 176, 'pad_low', 0.4], [170, 176, 'cry_phrase', 0.7], [177, 180, 'end_note', 0.7],
    ],
  });
})();
