// Episode 1, "The Twinkling Rain" (230 s), after the director's shot list.
// 0–158 s in the same valley as Episode 0 (Rex by the big taro leaf, the eggshell cradle, puddle, mushroom);
// 158–222 s on the river: a world strip at x >= 20000 (raft at the camera centre, scenery repeats with parallax).
(function () {
  const A = window.ART, F = window.FILM;
  const { kf, ease, clamp, lerp } = F;
  const V = F.valley, FLOOR = V.FLOOR, HX = V.HX, LEAFX = V.LEAFX;
  const PUD = [2830, FLOOR + 14], MUSH = 3040, RX0 = V.REX_X;
  const RIVER_X = 20000, RIVER_Y = 1600, DEPTH = 150, STEP = 90;

  /* ---------- rain: slow glowing drops + ordinary streaks (screen space) ---------- */
  const glowCount = T => T < 50 ? 0 : T < 57 ? lerp(15, 40, (T - 51) / 6) : T < 90 ? 40 : T < 108 ? lerp(40, 4, (T - 90) / 18) : T < 160 ? 3 : T < 192 ? 10 : T < 200 ? lerp(10, 5, (T - 192) / 8) : T < 204 ? 5 : 0;
  const streaks = T => T < 90 ? 0 : T < 100 ? (T - 90) / 10 * 0.12 : T < 108 ? lerp(0.12, 0.75, (T - 100) / 8) : T < 140 ? 0.75 + (T > 120 && T < 130 ? 0.2 : 0) : T < 158 ? 0.55 : T < 192 ? 0.35 : T < 200 ? lerp(0.35, 0, (T - 192) / 8) : 0;
  function glowRain(W, H, T, n) {
    for (let i = 0; i < Math.round(n); i++) {
      const sp = 110 + A.rnd(31, i) * 60, ph = A.rnd(32, i) * 30;
      const y = ((T + ph) * sp) % (H + 200) - 100, x = (A.rnd(33, i) * W + Math.sin(T * 0.7 + i) * 30) % W;
      A.glowDrop(x, y, 4 + A.rnd(34, i) * 3, 0.85);
      if (i % 4 === 0) A.sparkle(x + 10, y - 8, 6, 0.5 + 0.5 * Math.sin(T * 6 + i));
    }
  }

  /* ---------- Rex in the valley ---------- */
  function rexAt(T) {
    const st = { x: RX0, y: FLOOR - 4, s: 0.62, flip: false, squash: Math.sin(T * 2.6) * 0.01, lean: 0, dy: 0 };
    const p = { mouth: 'sad', eye: 'sad', shellHat: 1, tail: 4.2, blink: F.blinkAt(T, 3.5) };
    st.pose = p;
    const sn = t0 => T > t0 && T < t0 + 0.6 ? Math.sin((T - t0) / 0.6 * Math.PI) * 0.03 : 0;
    if (T < 26) { st.squash -= sn(14.5) + sn(17) + sn(19.5) + sn(23); p.headTilt = 0.12; p.tears = T < 20 ? 0.6 : 0; p.tearT = T; if (T > 18 && T < 19) p.arms = 1, p.step = T * 4; }
    if (T >= 26 && T < 30) { p.headTilt = kf(T, [[27.6, 0.12], [28.2, -0.05, 'out']]); p.eye = T > 28.2 ? 'wide' : 'sad'; p.look = [1, -0.2]; p.mouth = 'closed'; }
    if (T >= 30 && T < 40) { p.eye = 'wide'; p.look = [1, 0]; p.mouth = 'o'; p.tears = T < 37.5 ? 0.4 : 0; p.headTilt = T > 38 ? kf(T, [[38, 0], [39.5, 0.1]]) : 0; st.lean = T > 38 ? kf(T, [[38, 0], [39.5, 0.08]]) : 0; }
    if (T >= 40 && T < 50) {
      p.eye = 'wide'; p.mouth = 'closed'; p.look = T < 42.5 ? [1, 0.2] : T < 44.5 ? [0.6, 1] : T < 45.5 ? [0.3, -1] : [-0.6, 0.6];
      if (T > 45.5 && T < 45.9) p.eye = 'closed';
      if (T > 47.5) { p.eye = 'happy'; p.mouth = 'laugh'; }
      if (T > 48.5) { p.eye = 'wide'; p.mouth = 'o'; p.look = [0.2, -1]; p.headTilt = -0.15; }
    }
    if (T >= 50 && T < 60) { p.eye = 'wide'; p.look = [0.2, -1]; p.headTilt = -0.2; p.mouth = 'o';
      for (const g of [53, 55.5, 57]) if (T > g && T < g + 1) { p.eye = 'happy'; p.mouth = 'laugh'; st.dy = -Math.sin((T - g) * Math.PI) * 6; } }
    if (T >= 60 && T < 72) {
      p.tail = T * 3; p.mouth = 'o'; p.eye = 'wide'; p.look = [0.4, -1]; p.headTilt = -0.15;
      if (T > 60.5 && T < 61.5) { p.arms = 1; p.step = T * 8; }
      if (T > 61.5 && T < 63) { p.look = [0.5, 0.8]; p.headTilt = 0.15; p.mouth = 'closed'; }
      if (T > 63 && T < 63.5) st.dy = -Math.sin((T - 63) / 0.5 * Math.PI) * 30;
      if (T > 66 && T < 68) { p.mouth = 'open'; st.lean = Math.sin((T - 66) * Math.PI) * 0.06; }
      if (T > 68 && T < 70) { p.mouth = 'closed'; p.eye = 'happy'; p.blush = 1; }
      if (T > 70) { p.mouth = 'laugh'; p.eye = 'happy'; }
      st.x = T < 60.8 ? lerp(RX0, 2700, clamp((T - 60) / 0.8)) : 2700 + (T > 63 ? 30 : 0); if (T < 60.8) p.step = T * 12;
    }
    if (T >= 72 && T < 82) {   // leaning over the puddle (he stands left of it, looking down-right)
      st.x = PUD[0] - 120; p.eye = 'wide'; p.look = [0.6, 0.9]; p.mouth = 'smile'; p.tail = T * 2;
      st.lean = 0.25; p.headTilt = T < 73.5 ? 0.3 : T < 75 ? 0.45 : T < 76.5 ? 0.18 : 0.3;
      if (T > 76.5 && T < 78) { p.mouth = 'laugh'; p.eye = 'happy'; }
      if (T > 79.5 && T < 80.5) { st.lean = 0.4; p.headTilt = 0.5; }
    }
    if (T >= 82 && T < 90) {
      p.mouth = 'smile'; p.eye = 'wide'; p.tail = T * 3;
      st.x = kf(T, [[82, PUD[0] - 120], [83, PUD[0] - 180], [84, PUD[0] - 180], [84.6, PUD[0] - 10, 'in']]);
      if (T > 83 && T < 84) st.squash = 0.05 * Math.sin((T - 83) * 21);
      if (T > 84 && T < 84.6) st.dy = -Math.sin((T - 84) / 0.6 * Math.PI) * 70;
      if (T > 84.6) { st.squash = T < 85 ? 0.2 : 0.1; p.eye = 'happy'; p.mouth = 'laugh'; p.tail = 4 + Math.sin(T * 9) * 1.5; }
    }
    if (T >= 90 && T < 100) {   // by the mushroom with a small leaf umbrella in his mouth
      st.x = MUSH - 160; st.flip = false; p.mouth = 'closed'; p.eye = 'wide'; p.look = [1, 0.3]; p.tail = T * 2;
      if (T > 93 && T < 94) { p.arms = 1; p.step = T * 8; }
      if (T > 96 && T < 97.5) p.look = [1, 0];
      if (T > 97.5 && T < 97.7) p.eye = 'closed';
      if (T > 98.5) { p.eye = 'happy'; p.mouth = 'smile'; }
    }
    if (T >= 100 && T < 158) {
      st.x = T < 107 ? MUSH - 160 : T < 109 ? lerp(MUSH - 160, RX0 + 30, (T - 107) / 2) : RX0 + 30;
      st.flip = T >= 107 && T < 109; p.mouth = 'smile'; p.eye = 'wide'; p.tail = 4.2; p.look = [0.2, -0.6];
      if (T > 107 && T < 109) { p.step = T * 12; p.tail = T * 6; }
      if (T > 112 && T < 115) { p.headTilt = Math.abs(Math.sin((T - 112) * Math.PI * 1.33)) * -0.08; p.look = [0, -1]; }
      if (T > 115 && T < 117) { p.eye = 'wide'; p.look = [0, -1]; if (T > 115.8) st.x += Math.min(1, (T - 115.8) / 0.3) * 18; }
      if (T > 117) st.x += 18;
      if (T > 117.5 && T < 130) { p.eye = 'closed'; p.mouth = 'smile'; }
      if (T >= 130 && T < 140) { p.eye = 'wide'; p.look = [0.5, 0.9]; p.headTilt = 0.15; p.step = T > 133.5 && T < 136 ? T * 10 : 0;
        if (T > 136) { const a = (T - 136) * 1.5; p.look = [Math.cos(a), Math.sin(a) * 0.6]; p.eye = 'happy'; p.mouth = 'laugh'; } }
      if (T >= 140 && T < 147) { p.eye = 'wide'; p.mouth = 'o'; p.look = [-1, 0.1]; p.headTilt = 0.05; if (T > 145) st.lean = -0.06; }
      if (T >= 147 && T < 150) { p.eye = 'wide'; p.mouth = 'o'; p.look = [-1, 0]; if (T > 148.5) st.dy = -10; }
      if (T >= 150 && T < 158) { p.eye = 'wide'; p.mouth = 'o'; p.arms = T < 154 ? 1 : 0; p.step = T * 6; if (T > 157) p.headTilt = -0.12; }
    }
    return st;
  }
  function drawValleyRex(T) {
    const st = rexAt(T);
    // the reflection in the puddle (S09): only his head, upside down, right under his real head
    if (T >= 72 && T < 82) {
      const ctx = A.ctx(), pts = A.ellipsePts(PUD[0], PUD[1], 150, 46, 30);
      const lean = st.lean || 0, hx = st.x + 60 * st.s + lean * 120 * st.s, hy = st.y - 140 * st.s;
      ctx.save(); A.trace(pts, true, 0, 1, 0); ctx.clip();
      const rip = (T > 78 ? Math.sin((T - 78) * 10) * Math.exp(-(T - 78) * 1.5) : 0) + (T > 79.5 ? Math.sin((T - 79.5) * 11) * Math.exp(-(T - 79.5) * 1.5) : 0);
      ctx.globalAlpha = 0.6; ctx.translate(hx + rip * 8, PUD[1] - 4); ctx.scale(1, -1); ctx.translate(-hx, -hy);
      A.rex(st.x, st.y, st.s, { ...st.pose, squash: st.squash, lean: st.lean, flip: st.flip }, 21);
      ctx.restore();
    }
    // leaf umbrella held in his mouth (S11)
    const umb = T >= 94.5 && T < 107;
    A.rex(st.x, st.y + st.dy, st.s, { ...st.pose, squash: st.squash, lean: st.lean, flip: st.flip }, 21);
    if (umb) {
      const dir = st.flip ? -1 : 1, mx = st.x + dir * 100 * st.s, my = st.y - 140 * st.s + st.dy;
      const droop = T > 98.5 ? 0.6 : 0;
      A.line([[mx, my], [mx - dir * 10, my - 60]], { w: 2.4, seed: 1500 });
      A.leaf(mx - dir * 10, my - 60, 0.75, (dir > 0 ? Math.PI : 0) - 0.15 * dir + droop * dir, 1501, A.PAL.leaf);
    }
    return st;
  }

  // a body of moving water under the surface points pts (opaque, so nothing shows through)
  function waterBody(pts, yTop, T, flow = 300) {
    const ctx = A.ctx(), x0 = pts[0][0], x1 = pts[pts.length - 1][0], body = [...pts, [x1, yTop + 2400], [x0, yTop + 2400]];
    ctx.save(); A.trace(body, true, 0, 1, 0); ctx.clip();
    const g = ctx.createLinearGradient(0, yTop - 40, 0, yTop + 520);
    g.addColorStop(0, A.isColor() ? '#f1ddb0' : '#f7f7f4'); g.addColorStop(1, A.isColor() ? '#d3b077' : '#deded9');
    ctx.fillStyle = g; ctx.fillRect(x0 - 10, yTop - 300, x1 - x0 + 20, 3000);
    ctx.strokeStyle = 'rgba(255,255,255,0.9)'; ctx.lineWidth = 3; ctx.lineCap = 'round';
    const W = x1 - x0 + 400;
    for (let i = 0; i < 70; i++) { const ly = yTop + 30 + (i % 14) * 32 + Math.sin(i) * 6, lx = x0 - 200 + ((i * 197 + T * (flow + (i % 5) * 40)) % W); ctx.beginPath(); ctx.moveTo(lx, ly); ctx.bezierCurveTo(lx + 40, ly - 7, lx + 80, ly + 7, lx + 130, ly); ctx.stroke(); }
    ctx.strokeStyle = A.PAL.graphite + '0.35)'; ctx.lineWidth = 1.4;
    for (let i = 0; i < 34; i++) { const ly = yTop + 50 + (i % 11) * 42, lx = x0 - 200 + ((i * 263 + T * flow * 0.85) % W); ctx.beginPath(); ctx.moveTo(lx, ly); ctx.lineTo(lx + 90, ly + 3); ctx.stroke(); }
    ctx.restore();
    A.line(pts, { w: 2.6, seed: 971 });
    for (let i = 0; i < pts.length; i++) { const [fx, fy] = pts[i]; A.fill(A.ellipsePts(fx, fy + 2, 22, 7, 10), '#ffffff', { alpha: 0.95, seed: 972 + i }); A.line([[fx - 16, fy - 1], [fx - 6, fy - 7], [fx + 6, fy - 3], [fx + 16, fy - 8]], { w: 1.3, dark: 0.45, seed: 972 + (i % 40), passes: 1 }); }
  }
  // a translucent lip of water in front of a floating thing, so it sits IN the water
  function waterLip(x, y, hw, T) {
    const ctx = A.ctx(), top = [], bot = [];
    for (let k = -hw; k <= hw; k += 20) { const e = 1 - Math.pow(k / hw, 2); top.push([x + k, y + Math.sin((x + k) * 0.03 - T * 5) * 3 * e]); bot.push([x + k, y + 4 + 18 * e]); }
    ctx.save(); ctx.globalAlpha = 0.7;
    A.fill([...top, ...bot.reverse()], A.isColor() ? '#e9d09e' : '#efefeb', { seed: 986, jit: 0, alpha: 0.7 });
    ctx.restore();
    for (let k = -hw + 30; k < hw; k += 46) A.fill(A.ellipsePts(x + k, y + 1 + Math.sin(T * 4 + k) * 2, 16, 5, 10), '#ffffff', { alpha: 0.95, seed: 988 });
  }

  // valley water: the stream rising (S14–S17); a rolling wave hump from the left (S16)
  const level = T => T < 122 ? 0 : T < 132 ? (T - 122) / 10 * 62 : T < 150.5 ? 62 + (T - 132) * 0.5 : T < 152 ? 71 + ease.out((T - 150.5) / 1.5) * 150 : 221;
  const hump = (x, T) => T > 141 && T < 152 ? 90 * Math.exp(-Math.pow((x - (1400 + (T - 141) * 180)) / 220, 2)) : 0;
  const vTop = T => FLOOR + 36 - level(T);
  const vSurf = (x, T) => A.waterY(x, vTop(T), T, { amp: 6 + level(T) * 0.05, speed: 160 }) - hump(x, T);
  function valleyWater(T) {
    const lv = level(T);
    if (lv <= 0) return;
    const pts = [];
    for (let x = 400; x <= 4600; x += 40) pts.push([x, vSurf(x, T)]);
    waterBody(pts, vTop(T), T, 200);
    if (T > 141 && T < 152) {   // spray on the wave crest
      const cx = 1400 + (T - 141) * 180;
      for (let k = 0; k < 9; k++) A.fill(A.ellipsePts(cx - 120 + k * 30, vSurf(cx - 120 + k * 30, T) - 6 - Math.abs(Math.sin(T * 6 + k)) * 14, 18, 9, 10), '#ffffff', { alpha: 0.95, seed: 1590 + k });
    }
    // things floating on the water
    for (let i = 0; i < 10; i++) {
      const x = 1300 + ((T * (90 + i * 9) + i * 300) % 2600);
      A.leaf(x, vSurf(x, T) + 6, 0.3, Math.sin(T + i) * 0.4, 1600 + i, i % 2 ? A.PAL.leaf : A.PAL.leafDark);
    }
    if (T > 141 && T < 152) {   // the beetle riding a twig on the wave
      const bx = 1400 + (T - 141) * 180 - 60, by = vSurf(bx, T);
      A.line([[bx - 40, by - 4], [bx + 40, by - 8]], { w: 4, seed: 1610 });
      A.beetle(bx, by - 10, 1.1, { t: T, walk: 0 });
    }
  }

  /* ---------- the river (S18–S23) ---------- */
  const raftX = T => RIVER_X + (T - 158) * 260;
  // the raft's real x: slows to a glide over the step (184–188), then rides on
  const rx = T => T < 184 ? raftX(T) : T < 188 ? raftX(184) + (T - 184) * 75 : raftX(184) + 300 + (T - 188) * 260;
  const SX = raftX(184) + 150;                       // the lip of the rock step
  const stepAt = x => x > SX ? STEP : 0;
  const surf = (x, T, d = 0) => A.waterY(x, RIVER_Y + d, T, { amp: T > 197 ? 8 : 12, speed: 220 }) + (d ? stepAt(x) : 0);
  function river(T) {
    const ctx = A.ctx();
    // sky and repeated scenery with parallax; clouds keep the sun hidden until 197
    F.layer(0.15, () => { const v = F.vis(0.15); A.sun(v.x0 + (v.x1 - v.x0) * 0.75, v.y0 + 260, 60, T > 197 ? clamp((T - 197) / 3) : 0, true);
      for (let k = Math.floor(v.x0 / 1400); k * 1400 < v.x1; k++) A.cloud(k * 1400 + 300, v.y0 + 220 + (k % 2) * 80, 1.2, k); });
    F.layer(0.3, () => { const v = F.vis(0.3); for (let k = Math.floor((v.x0 + 200) / 2600) - 1; k * 2600 < v.x1 + 200; k++) { ctx.save(); ctx.translate(k * 2600, 0); A.mountains(1250, 330, 3 + (k % 3), A.PAL.mountain, 0.45); ctx.restore(); } });
    F.layer(0.55, () => { const v = F.vis(0.55); for (let k = Math.floor((v.x0 + 200) / 2300) - 1; k * 2300 < v.x1 + 200; k++) { ctx.save(); ctx.translate(k * 2300, 0); A.canopy(1480, 9 + (k % 4), A.PAL.jungle, 0.5, T); A.palm(600, 1500, 420, 11 + k, T, 1.4); A.palm(1700, 1500, 380, 12 + k, T, 1.4); ctx.restore(); } });
    // far bank: a thin strip of grass and ferns behind the river
    F.layer(1, () => {
      const v = F.vis(1), b = [[v.x0 - 50, RIVER_Y - 60], [v.x1 + 50, RIVER_Y - 60], [v.x1 + 50, RIVER_Y + 20], [v.x0 - 50, RIVER_Y + 20]];
      A.fill(b, A.PAL.jungle, { seed: 2, jit: 0, alpha: 1 });
      A.hatch(b, { gap: 7, dark: 0.25, seed: 5, angle: -1.2 });
      A.line([[v.x0 - 50, RIVER_Y - 60], [v.x1 + 50, RIVER_Y - 60]], { w: 2, seed: 3 });
      for (let x = Math.floor(v.x0 / 260) * 260; x < v.x1; x += 260) { A.fern(x, RIVER_Y - 56, 0.8, 900 + (x / 260) % 7, T); F.tuft(x + 130, RIVER_Y - 58, 1, (x / 260) % 13); }
    });
  }
  function riverBack(T) {
    F.layer(1, () => {
      const v = F.vis(1), pts = [];
      for (let x = v.x0 - 80; x <= v.x1 + 80; x += 40) pts.push([x, surf(x, T)]);
      waterBody(pts, RIVER_Y, T, 300);
      for (let i = 0; i < 8; i++) { const x = v.x0 + ((i * 410 + T * 140) % (v.x1 - v.x0 + 200)) - 100; A.leaf(x, surf(x, T, 40 + (i % 3) * 60) , 0.28, Math.sin(T + i) * 0.3, 1620 + i, i % 2 ? A.PAL.leaf : A.PAL.leafDark); }
      // the rock step (S20): a ledge of flat rocks running across the river, foam tumbling over it
      if (SX > v.x0 - 400 && SX < v.x1 + 400) {
        for (let k = 0; k < 4; k++) {
          const q = k / 3, lx = SX - 60 + q * 120, ly = RIVER_Y + 24 + q * (DEPTH + STEP - 30);
          A.rock(lx, ly, 150 + q * 60, 16 + q * 8, 1751 + k, A.PAL.rock, { cracks: false });
          for (let j = 0; j < 3; j++) A.fill(A.ellipsePts(lx + 40 + j * 22, ly + 6 + Math.sin(T * 6 + k + j) * 4, 20 + q * 8, 9, 10), '#ffffff', { alpha: 0.95, seed: 1760 + k * 3 + j });
        }
      }
    });
  }
  function raft(T) {
    // raft position: in the river, DEPTH below the far foam line; whirlpool loops 170–178.5; glide over the step 184–188
    let x = rx(T), dyx = 0, scale = 1, behind = false;
    const RCX = raftX(175);
    if (T > 170 && T < 178.5) {   // circle round the rock (side view: ellipse with depth)
      const a = (T - 170) / 4.25 * Math.PI * 2;
      x = RCX - Math.cos(a) * 240; dyx = Math.sin(a) * 40; scale = 1 - Math.sin(a) * 0.12; behind = Math.sin(a) < 0;
      x = lerp(x, raftX(T), clamp((T - 177.5)));
    }
    let y = A.waterY(x, RIVER_Y + DEPTH, T, { amp: 10, speed: 220 }) + dyx;
    let air = 0, hatLift = 0;
    if (T > 184 && T < 188) {
      const q = (T - 184) / 4;
      y += STEP * ease.inout(clamp((q - 0.2) / 0.65));
      air = Math.sin(clamp((q - 0.15) / 0.75) * Math.PI) * 26; hatLift = Math.sin(clamp((q - 0.15) / 0.75) * Math.PI) * 40;
    } else if (T >= 188) y += STEP + (T < 188.6 ? Math.sin((T - 188) / 0.6 * Math.PI) * 10 : 0);
    if (T > 165 && T < 167) y -= Math.sin((T - 165) / 2 * Math.PI) * 20;
    const rock = Math.sin(T * 3.9) * 0.1, spin = T > 160 && T < 163 ? (T - 160) / 3 * Math.PI * 2 : 0;
    const ctx = A.ctx();
    const theRock = () => { if (T > 166 && T < 182) A.rock(RCX, RIVER_Y + DEPTH + 14, 120, 80, 1700, A.PAL.rockDark); };
    if (!behind) theRock();
    A.ripples(x, y + 6, Math.floor(T * 0.8) / 0.8, T, 2, 260);
    ctx.save(); ctx.translate(x, y); ctx.scale(scale * Math.cos(spin) || 0.05, scale); ctx.rotate(rock);
    A.taro(0, 0, 0.8, { raft: true });
    ctx.restore();
    // Rex and the beetle on the raft
    const p = { shellHat: hatLift > 1 ? 0 : 1, tail: T * 4, blink: F.blinkAt(T, 3), eye: 'wide', mouth: 'smile', look: [0.6, 0.1] };
    let flip = Math.cos(spin) < 0;
    if (T < 160) { p.mouth = 'o'; p.look = [-0.5, 0.6]; }
    if (T > 162 && T < 162.3) flip = !flip;
    if (T > 163 && T < 165) { p.arms = 1; p.step = T * 10; }
    if (T > 165 && T < 166) { p.mouth = 'o'; p.eye = 'wide'; }
    if (T > 166 && T < 170) { p.mouth = 'laugh'; p.eye = 'happy'; }
    if (T > 170 && T < 180) { p.look = [1, 0.2]; if (T > 175) { p.mouth = 'laugh'; p.eye = 'happy'; } }
    if (T > 184 && T < 188) { p.mouth = 'open'; p.eye = 'wide'; p.look = [0, -0.5]; p.arms = 1; }
    if (T > 188 && T < 192) { p.mouth = 'laugh'; p.eye = 'happy'; }
    let standY = 0, shake = 0;
    if (T > 199 && T < 202) { standY = -8; if (T > 199.6 && T < 200.2) shake = Math.sin(T * 90) * 5; }
    if (T > 202 && T < 204) { p.eye = 'happy'; p.mouth = 'smile'; }
    if (T >= 204) { p.look = T > 206 ? [1, -0.1] : [0.3, 0]; p.eye = 'wide'; p.mouth = T > 209 ? 'o' : 'smile'; }
    const rs = 0.62 * scale, top = y - 18 * scale;
    A.rex(x - 30 + shake, top - air + standY, rs, { ...p, flip, squash: 0.06, lean: rock * 0.5 }, 21);
    if (hatLift > 1) A.shell(x - 30 + (flip ? -11 : 11), top - air - 120 * rs - hatLift - 30, 0.55, 0.2, 53, true);
    // beetle: on its twig until 173, then on the raft; on Rex's hat from 204
    if (T > 173 && T < 204) { const hop = T < 173.5 ? Math.sin((T - 173) / 0.5 * Math.PI) * 30 : 0; A.beetle(x + 60, top + 4 - air * 1.2 - hop, 1.0, { t: T, flip: T > 175 && T < 176 }); }
    else if (T >= 204) A.beetle(x - 30 + 10, top - 205 * rs - 4, 0.8, { t: T, rot: T > 211.5 ? 0.3 : 0 });
    else if (T > 170) { const a = (T - 170) / 4.25 * Math.PI * 2 + 1.2, bx = RCX - Math.cos(a) * 300, by = A.waterY(bx, RIVER_Y + DEPTH - 40, T, { amp: 10, speed: 220 }); A.line([[bx - 30, by + 8], [bx + 30, by + 4]], { w: 4, seed: 1630 }); A.beetle(bx, by, 1.0, { t: T }); waterLip(bx, by + 8, 50, T); }
    // spray when he shakes dry
    if (T > 199.6 && T < 200.8) { const q = (T - 199.6) / 1.2; for (let i = 0; i < 20; i++) { const a = i / 20 * Math.PI * 2; A.glowDrop(x - 30 + Math.cos(a) * 140 * q, top - 72 + Math.sin(a) * 90 * q, 3, 1 - q); } }
    // the splash when the raft lands below the step
    if (T > 187.6 && T < 189) { const q = (T - 187.6) / 1.4; for (let i = 0; i < 16; i++) { const a = -Math.PI * (0.08 + 0.84 * i / 15); A.fill(A.ellipsePts(x + Math.cos(a) * 220 * q, y + Math.sin(a) * 120 * q + q * q * 80, 10 * (1 - q) + 3, 6, 8), '#ffffff', { alpha: 0.95 * (1 - q), seed: 1780 + i }); } }
    // the water in front of the raft's lower edge
    waterLip(x, y + 6, 210 * scale, T);
    for (let k = 0; k < 6; k++) A.fill(A.ellipsePts(x - 150 * scale + k * 60 * scale, y + 6 + Math.sin(T * 4 + k) * 3, 18, 6, 10), '#ffffff', { alpha: 0.9, seed: 1770 + k });
    if (behind) theRock();
  }

  /* ---------- shots ---------- */
  const CAM = [
    [0, 2400, 1150, 0.85], [8, 2450, 1150, 0.9, 0, 'inout'],
    [8.01, 1800, 950, 0.62], [14, 1800, 950, 0.62],
    [14.01, 2450, 1400, 2.4], [22, 2450, 1405, 2.8, 0, 'inout'],
    [22.01, 2470, 1390, 2.8], [27, 2470, 1390, 2.8], [30, 2480, 1380, 3.3, 0, 'inout'],
    [30.01, 2490, 1385, 5.2], [40, 2490, 1385, 5.2],
    [40.01, 2470, 1410, 3.8], [50, 2470, 1410, 3.8],
    [50.01, 2540, 1360, 1.8], [54, 2540, 1240, 1.4, 0, 'inout'], [58, 2540, 1360, 1.8, 0, 'inout'], [60, 2600, 1380, 1.9],
    [60.01, 2760, 1400, 2.5], [72, 2780, 1400, 2.5],
    [72.01, 2780, 1440, 2.8], [80, 2800, 1470, 3.3, 0, 'inout'], [82, 2800, 1470, 3.3],
    [82.01, 2780, 1420, 2.2], [90, 2780, 1420, 2.2],
    [90.01, 2950, 1410, 2.5], [96, 2950, 1410, 2.5], [100, 2960, 1420, 2.8, 0, 'inout'],
    [100.01, 2700, 1300, 1.1], [110, 2550, 1150, 0.88, 0, 'inout'],
    [110.01, 2470, 1380, 2.4], [120, 2470, 1380, 2.5],
    [120.01, 1900, 1100, 0.62], [130, 1650, 1000, 0.62, 0, 'inout'],
    [130.01, 2470, 1480, 2.8], [136, 2470, 1480, 2.8], [137.5, 2470, 1400, 2.8, 0, 'inout'], [140, 2470, 1400, 2.8],
    [140.01, 2300, 1350, 1.0], [146, 1900, 1350, 1.1, 0, 'inout'], [150, 2450, 1380, 1.5, 0, 'inout'],
    [150.01, 2500, 1330, 2.0], [152, 2500, 1220, 2.0, 0, 'out'], [157.99, 2560, 1220, 2.0, 0, 'inout'],
    [158, raftX(158), 1650, 2.1], [170, raftX(170), 1650, 2.1, 0, 'lin'],
    [170.01, raftX(175), 1640, 1.5], [180, raftX(175) + 300, 1640, 1.5, 0, 'inout'],
    [180.01, rx(181.5), 1690, 1.6], [184, rx(184), 1690, 1.6, 0, 'lin'], [188, rx(188), 1740, 1.6, 0, 'inout'], [192, rx(192), 1760, 1.6, 0, 'inout'],
    [192.01, rx(192), 1740, 1.4], [204, rx(204), 1740, 1.55, 0, 'lin'],
    [204.01, rx(204) - 30, 1745, 3.2], [208, rx(208) - 30, 1745, 3.2, 0, 'lin'], [214, rx(214) - 30, 1745, 4.2, 0, 'lin'],
    [214.01, rx(214) + 300, 1680, 1.6], [222, rx(222) + 200, 1600, 1.15, 0, 'inout'], [230, rx(222) + 200, 1600, 1.15],
  ];

  F.episode(1, {
    duration: 230,
    camera: CAM,
    wind: T => T < 14 ? 0.4 : T < 26 ? 0.2 : T < 100 ? 0.05 : T < 158 ? 0.25 : 0.05,
    cool: T => T < 30 ? 0.75 : T < 60 ? lerp(0.75, 0.35, (T - 30) / 30) : T < 100 ? 0.35 : T < 120 ? lerp(0.35, 0.7, (T - 100) / 20) : T < 150 ? 0.7 : T < 192 ? lerp(0.7, 0.3, (T - 150) / 42) : T < 204 ? lerp(0.3, 0, (T - 192) / 12) : 0,
    warmth: T => T > 197 ? clamp((T - 197) / 4) * 0.6 : 0.15,
    vignette: T => T > 120 && T < 140 ? 0.22 : 0.1,
    boil: T => T > 158 && T < 192 ? 15 : T < 26 ? 7.5 : 10,
    draw(T) {
      if (T < 158) {
        V.world(T, { reveal: 1, wind: F.windAt(T), clouds: 1, sunHide: T < 50 ? 1 : 0.6 });
        V.after(T);
        A.shell(V.EGG_STOP, FLOOR + 2, 1.45, 0, 55);   // the eggshell cradle
        if (T >= 72 && T < 100) A.puddle(PUD[0], PUD[1], 150, 46);
        if (T >= 78 && T < 82) { A.ripples(PUD[0] + 30, PUD[1], 78, T); A.ripples(PUD[0] + 70, PUD[1], 79.5, T); }
        if (T >= 84.6 && T < 86) { const q = (T - 84.6) / 1.4; for (let i = 0; i < 25; i++) { const a = -Math.PI * (0.1 + 0.8 * i / 24); A.glowDrop(PUD[0] + Math.cos(a) * 160 * q, PUD[1] - 20 + Math.sin(a) * 160 * q + q * q * 120, 3, 1 - q); } }
        if (T >= 90 && T < 108) { A.mushroom(MUSH, FLOOR, 1.1); if (T < 100) A.beetle(MUSH - 6, FLOOR - 4, 1.1, { t: T, flip: T > 96 }); }
        // the big taro leaf: standing until the wave lifts it at 150.5, then a raft
        if (T < 150.5) A.taro(LEAFX, FLOOR, 1.0, { bend: Math.sin(T * 1.3) * 0.02 + (T > 32 && T < 33 ? Math.sin((T - 32) * 20) * 0.02 : 0) });
        // the first glowing drop (S04–S06): falls slowly, rests on the leaf, rolls off at 42.5
        const BEAD = A.taroEdge(LEAFX, FLOOR, 1.0, 0.55);
        if (T > 26 && T < 27) A.glowDrop(BEAD[0], lerp(1000, BEAD[1], ease.in(T - 26)), 7);
        if (T >= 27 && T < 42.5) { const wob = T > 32 && T < 32.6 ? 1 + Math.sin((T - 32) * 30) * 0.06 : 1; A.glowDrop(BEAD[0], BEAD[1], 7 * wob); A.sparkle(BEAD[0] + 12, BEAD[1] - 12, 9, 0.6 + 0.4 * Math.sin(T * 5)); }
        if (T >= 42.5 && T < 44) A.glowDrop(BEAD[0] - (T - 42.5) * 30, BEAD[1] + (T - 42.5) * (T - 42.5) * 160, 6);
        if (T > 44.5 && T < 45.5) { const nose = A.rexNose(RX0, FLOOR - 4, 0.62); A.glowDrop(nose[0], lerp(1150, nose[1], T - 44.5), 6); }
        if (T > 45.5 && T < 46.5) { const nose = A.rexNose(RX0, FLOOR - 4, 0.62), q = T - 45.5; for (let i = 0; i < 5; i++) A.sparkle(nose[0] + Math.cos(i * 1.3) * 40 * q, nose[1] + Math.sin(i * 1.3) * 40 * q, 6, 1 - q); }
        // the drop he catches on his tongue (S08)
        if (T > 66 && T < 68) A.glowDrop(2790, lerp(1000, FLOOR - 90, (T - 66) / 2), 6);
        if (T > 60.5 && T < 61.5) A.glowDrop(2810, lerp(1100, FLOOR - 4, T - 60.5), 6);
        if (T > 113 && T < 115) A.glowDrop(RX0 + 30, lerp(1250, FLOOR - 130, (T - 113) / 2), 4);
        if (T < 150.5) { drawValleyRex(T); valleyWater(T); }
        else {   // the raft lifting off with Rex on it: water behind, raft and Rex, then a lip of water in front
          valleyWater(T);
          const bob = Math.sin(T * 5.2) * 6, drift = T > 154.5 ? (T - 154.5) * 30 : 0, rxv = RX0 + 60 + drift;
          const ry = vSurf(rxv, T) + 14 + bob;
          const ctx = A.ctx(); ctx.save(); ctx.translate(rxv, ry); ctx.rotate(T > 154.5 ? Math.min(0.5, (T - 154.5) * 0.15) * 0.3 : 0);
          A.taro(0, 0, 0.62, { raft: true }); ctx.restore();
          const st = rexAt(T);
          A.rex(rxv - 30, ry - 14, 0.5, { ...st.pose, squash: 0.06 }, 21);
          waterLip(rxv, ry + 12, 160, T);
        }
        // curtains of water pouring off the leaf (S13)
        if (T > 108 && T < 150) { const ctx = A.ctx(); ctx.save(); ctx.strokeStyle = A.PAL.graphite + '0.35)'; ctx.lineWidth = 1.5; for (let k = 0; k < 3; k++) { const lx = 2380 + k * 60; for (let i = 0; i < 6; i++) { const y0 = 1100 + k * 40 + ((T * 400 + i * 50) % 300); ctx.beginPath(); ctx.moveTo(lx + i * 3, y0); ctx.lineTo(lx + i * 3 + 2, y0 + 40); ctx.stroke(); } } ctx.restore(); }
        V.foreground(T, F.windAt(T));
      } else {
        river(T);
        riverBack(T);
        if (T > 210) F.layer(1, () => { const mx = rx(222) + 500; A.mist(mx, 1250, 3.0, T, clamp((T - 210) / 5) * 0.9); A.mist(mx + 300, 1550, 2.6, T + 3, clamp((T - 212) / 5) * 0.8); A.rainbow(mx, 1350, 900, clamp((T - 214) / 4)); });
        raft(T);
      }
    },
    overlay(T, W, H) {
      F.paperFade(0);
      if (T < 8.4) {
        A.paperStrip(W / 2, 170, 1500, 170, 'చిన్ని రెక్స్ పుట్టాడు... కానీ అమ్మ కనిపించలేదు.', 'Little Rex was born... but he could not find his mother.', F.fadeIn(T, 0.8, 4.2));
        A.paperStrip(W / 2, 170, 1500, 170, 'చల్లని గాలిలో, ఒంటరిగా, మెల్లగా ఏడ్చాడు.', 'Alone in the cold wind, he cried softly.', F.fadeIn(T, 4.4, 7.6));
      }
      F.titleSigns(T, 8, 14, 'EPISODE 1', 'మెరిసే వాన · The Twinkling Rain');
      if (T > 11.3 && T < 13) A.glowDrop(W / 2 + 300, lerp(-20, H + 20, (T - 11.3) / 1.7), 9);
      const s = streaks(T);
      if (s > 0) A.rain(W, H, T, s, 5);
      const g = glowCount(T);
      if (g > 0 && !(T > 22 && T < 50)) glowRain(W, H, T, g);
      if (T > 14 && T < 30 && F.windAt(T) > 0.1) A.windLines(W, H, T, F.windAt(T), 3);
      if (T >= 222) {
        F.paperFade(clamp((T - 222) / 1));
        A.plank(W / 2, 330 - (1 - ease.back(clamp((T - 223) / 0.7))) * 700, 1200, 170, 'రెక్స్ ఎక్కడికి వెళ్తాడు?', { font: "700 70px 'Nirmala UI'", sub: 'Where will Rex go?', subFont: "44px 'Patrick Hand'", rot: -0.02 });
        if (T > 225.5) { const sw = Math.exp(-(T - 225.5) * 2.2) * Math.sin((T - 225.5) * 5) * 0.3; A.plank(W / 2, 600, 1300, 140, 'రెక్స్ అడ్వెంచర్స్ – ఎపిసోడ్ 2 త్వరలో!', { font: "700 50px 'Nirmala UI'", sub: 'Rex Adventures – Episode 2 coming soon!', subFont: "36px 'Patrick Hand'", rot: sw, ropes: true }); }
        if (T > 225.6) { const ctx = A.ctx(); ctx.save(); ctx.globalAlpha = clamp((T - 225.6) / 0.4); ctx.font = "44px 'Patrick Hand'"; ctx.textAlign = 'center'; ctx.fillStyle = '#4a453e'; ctx.fillText('youtube.com/@kramavriddhi', W / 2, 800); ctx.restore(); }
        if (T > 227 && T < 229) A.glowDrop(W / 2 + 520, lerp(-20, H, (T - 227) / 2), 9);
        if (T > 229.4) F.paperFade(clamp((T - 229.4) / 0.6));
      }
      F.fadeFromBlack(T, 0, 0.8);
    },
    cues: [
      ['wind', 0, 14], ['sniffle', 5.0], ['thock', 8.5], ['creak', 9.0], ['plink', 11.5],
      ['wind', 14, 12], ['sniffle', 14.5], ['sniffle', 17.0], ['sniffle', 19.5], ['thunder', 20.0], ['sniffle', 23],
      ['plink', 27.0], ['sparkle', 27.2], ['sparkle', 32.0], ['sniff', 39.5], ['sniff', 40.5], ['sniff', 41.2],
      ['plink', 45.5], ['squeak', 45.6], ['giggle', 47.5],
      ['plink', 51.5], ['plink', 52.4], ['tinkle', 53.0], ['giggle', 53.0], ['plink', 54.2], ['giggle', 55.5], ['tinkle', 55.5], ['plink', 56.3], ['giggle', 57.0],
      ['wah', 61.5], ['hop', 63.0], ['tinkle', 63.5], ['gulp', 68.0], ['laugh', 70.0],
      ['blup', 72.6], ['giggle', 76.8], ['blup', 78.0], ['blup', 79.5],
      ['pat', 82.3], ['pat', 82.7], ['hop', 84.0], ['splash', 84.6], ['laugh', 86.6], ['splash', 87.4], ['splash', 88.6],
      ['rain', 90, [20, 0.03]], ['chirr', 96.5], ['giggle', 99],
      ['rain', 100, [58, 0.12]], ['thunder', 104], ['pat', 107.2], ['pat', 107.6], ['pat', 108.0], ['pat', 108.4],
      ['tinkle', 115.0], ['hum', 118.0], ['falls', 120],
      ['water', 124, [34, 0.06]], ['splash', 133.6], ['splash', 134.4], ['giggle', 136.5],
      ['water', 140, [18, 0.12]], ['whoosh', 141], ['shloop', 150.5], ['tik', 151.5], ['squeak', 148.5],
      ['water', 158, [46, 0.12]], ['whee', 162.0], ['laugh', 166.0], ['chirr', 173.0], ['tok', 173.0], ['giggle', 175.0],
      ['whoosh', 184.0], ['whee', 184.2], ['splash', 188.0], ['laugh', 188.6], ['rain', 158, [40, 0.06]],
      ['birds', 196], ['birds', 199], ['shake', 199.6], ['giggle', 202.5],
      ['roar', 204.5, [18, 0.14]], ['birds', 207],
      ['thock', 223.4], ['creak', 225.5], ['plink', 227.5],
    ],
    music: [
      [0, 8, 'cry_phrase', 0.5], [8, 14, 'title', 0.8], [14, 26, 'pad_low', 0.5], [27, 50, 'drop_theme', 0.8],
      [50, 56, 'drop_theme', 0.9], [56, 72, 'dance', 0.8], [72, 82, 'drop_theme', 0.6], [82, 103, 'dance', 0.8],
      [103, 120, 'rain_drums', 0.7], [120, 150, 'build', 0.8], [154.5, 184, 'ride', 0.9], [184, 188, 'hold', 1],
      [188, 192, 'ride', 0.9], [192, 204, 'calm', 0.8], [204, 214, 'wonder', 0.8], [214, 222, 'bright_chord', 1], [223, 230, 'end_sting', 0.9],
    ],
  });
})();
