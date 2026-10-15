// Rex, the baby T-Rex of "Rex Adventures" (round 2 design, after the owner's reference and the director's review):
// ¾ view facing right; a BIG round head (~45 % of his height) with a short rounded snout and a broad smile,
// TWO huge shiny eyes (2 highlight dots each), arched brows, a chubby pear body with a round belly patch,
// short thick legs with white claws, tiny arms, soft rounded bumps down the back, round spots, a short thick tail.
// All character fills are opaque. ART.rex(x, y, s, pose): foot point (x, y), ~250 units tall at s = 1.
// Pose: eye open|wide|happy|sad|closed|squeeze, brow (auto from eye, or 'up'|'sad'|'flat'), look [dx,dy],
// blink, mouth smile|grin|open|laugh|o|wail|sad|closed|sneeze, tears + tearT, headTilt, squash, lean, tail (wag phase),
// tailSwing (rad), step, arms, blush, flip, shellHat, shiver.
(function () {
  const A = window.ART;
  const rs = A.rnd;
  const O = { alpha: 1 };   // opaque

  A.rex = (x, y, s, pose = {}, seed = 21) => {
    const p = { eye: 'open', look: [0, 0], blink: 0, mouth: 'smile', tears: 0, tearT: 0, headTilt: 0, squash: 0, lean: 0, tail: 0, tailSwing: 0, step: 0,
      arms: 0, blush: 0, flip: false, shellHat: 0, shiver: 0, ...pose };
    const ctx = A.ctx();
    const SK = A.PAL.rex, DK = A.PAL.rexDark, BL = A.PAL.belly, SP = A.PAL.spot;
    ctx.save();
    ctx.translate(x + (p.shiver ? Math.sin(p.tearT * 80) * 2.5 : 0), y); ctx.scale(s * (p.flip ? -1 : 1), s); ctx.rotate(p.lean);
    ctx.scale(1 + p.squash * 0.6, 1 - p.squash);
    const st = Math.sin(p.step) * 9, lift = Math.max(0, Math.sin(p.step)) * 7, lift2 = Math.max(0, -Math.sin(p.step)) * 7;

    // tail: short and thick at the base, curling up at the tip
    ctx.save(); ctx.translate(-40, -58); ctx.rotate(p.tailSwing + Math.sin(p.tail) * 0.12);
    const tail = [[6, -22], [-30, -16], [-64, -10], [-90, -16], [-106, -34], [-102, -46], [-90, -34], [-62, -26], [-26, 10], [8, 18]];
    A.shape(tail, SK, { ...O, seed: seed + 1, gap: 6, hangle: -0.4 });
    for (let i = 0; i < 3; i++) A.fill(A.ellipsePts(-28 - i * 22, -12 - i * 2, 6 - i, 4.5 - i * 0.5, 9), SP, { ...O, seed: seed + 80 + i });
    ctx.restore();
    // far leg (behind the body)
    A.shape(A.blobPts(-26 - st * 0.3, -34, () => [27, 30], 22), DK, { ...O, seed: seed + 2, gap: 5 });
    A.shape([[-50 - st, -6 - lift2], [-12 - st, -8 - lift2], [-4 - st, 0 - lift2], [-10 - st, 4 - lift2], [-52 - st, 4 - lift2]], DK, { ...O, seed: seed + 3, shade: false });
    // body: chubby pear
    const body = A.blobPts(0, -78, a => { const lower = Math.sin(a) > 0; return [lower ? 56 : 46, lower ? 62 : 58]; }, 34);
    A.shape(body, SK, { ...O, seed: seed + 4, gap: 6 });
    // soft back bumps
    for (let i = 0; i < 5; i++) {
      const a = -1.95 - i * 0.24, bx = Math.cos(a) * 47, by = -84 + Math.sin(a) * 60;
      A.fill(A.ellipsePts(bx, by, 6, 5, 10), DK, { ...O, seed: seed + 30 + i });
      A.line(A.ellipsePts(bx, by, 6, 5, 10).slice(5, 10).concat(A.ellipsePts(bx, by, 6, 5, 10).slice(0, 2)), { w: 1.3, dark: 0.6, seed: seed + 30 + i, passes: 1 });
    }
    // round belly patch with soft curved lines
    const belly = A.blobPts(14, -66, () => [32, 44], 26);
    A.fill(belly, BL, { ...O, seed: seed + 5 });
    for (let i = 0; i < 4; i++) A.line([[-6, -92 + i * 16], [14, -88 + i * 16], [36, -92 + i * 16]], { w: 1.1, dark: 0.35, seed: seed + 40 + i, passes: 1 });
    A.line(belly, { closed: true, w: 1.3, dark: 0.5, seed: seed + 6, passes: 1 });
    // round spots on the back
    for (let i = 0; i < 7; i++) A.fill(A.ellipsePts(-38 + rs(seed, i) * 30, -118 + rs(seed, i + 9) * 74, 5 + rs(seed, i + 12) * 3, 4 + rs(seed, i + 18) * 2, 9), SP, { ...O, seed: seed + i });
    // near leg: short and thick, three white claws
    A.shape(A.blobPts(26 + st * 0.3, -30, () => [28, 30], 22), SK, { ...O, seed: seed + 7, gap: 5 });
    A.shape([[6 + st, -8 - lift], [48 + st, -8 - lift], [58 + st, 0 - lift], [50 + st, 5 - lift], [6 + st, 5 - lift]], SK, { ...O, seed: seed + 8, shade: false });
    for (let i = 0; i < 3; i++) A.shape([[36 + st + i * 8, 0 - lift], [44 + st + i * 8, 0 - lift], [42 + st + i * 8, 8 - lift]], '#ffffff', { ...O, seed: seed + 50 + i, shade: false, w: 1.1 });

    // head (big and round, short snout) — rotates around the neck
    ctx.save(); ctx.translate(14, -116); ctx.rotate(p.headTilt);
    const H = A.blobPts(4, -50, a => { const c = Math.cos(a), sn = Math.sin(a); const snout = Math.max(0, c) * (sn > -0.2 ? 1 : 0.5); return [62 + snout * 34, 56 + (sn > 0 ? 4 : 0) - snout * 10]; }, 40);
    A.shape(H, SK, { ...O, seed: seed + 12, gap: 6, hangle: -0.6 });
    // spots on the head top
    for (let i = 0; i < 6; i++) A.fill(A.ellipsePts(-34 + i * 11 + rs(seed, i + 30) * 4, -94 + Math.abs(i - 2.5) * 4 + rs(seed, i + 40) * 4, 5.5, 4, 9), SP, { ...O, seed: seed + 70 + i });
    // nostrils at the snout tip
    for (const nx of [82, 92]) { ctx.save(); ctx.fillStyle = 'rgba(40,36,32,0.85)'; ctx.beginPath(); ctx.ellipse(nx, -58, 2.6, 1.8, -0.3, 0, 7); ctx.fill(); ctx.restore(); }
    // mouth
    const M = p.mouth;
    if (M === 'o' || M === 'sneeze') {
      const r = M === 'o' ? 9 : 6, o = A.ellipsePts(66, -22, r, r * 1.1, 12);
      A.fill(o, '#5a2a26', { ...O, seed: seed + 13 }); A.line(o, { closed: true, w: 2.2, seed: seed + 15 });
    } else if (M === 'open' || M === 'laugh' || M === 'grin' || M === 'wail') {
      const d = { open: 18, laugh: 26, grin: 10, wail: 24 }[M];
      const wail = M === 'wail';
      // broad smile across the snout (corners up), or a soft round wail (wider at the bottom)
      const top = wail ? [[30, -24], [52, -30], [76, -30], [94, -24]] : [[12, -28], [44, -26], [76, -30], [100, -40]];
      const bot = wail ? [[92, -10 + d * 0.4], [74, -2 + d * 0.6], [50, -2 + d * 0.6], [32, -12 + d * 0.3]] : [[94, -30 + d * 0.3], [72, -18 + d * 0.8], [42, -14 + d * 0.8], [16, -22]];
      const m = [...top, ...bot];
      A.fill(m, A.PAL.mouth, { ...O, seed: seed + 13 });
      A.fill(wail ? [[48, -6 + d * 0.5], [76, -6 + d * 0.5], [70, -2 + d * 0.6], [54, -2 + d * 0.6]] : [[38, -18 + d * 0.6], [70, -20 + d * 0.65], [64, -16 + d * 0.75], [44, -14 + d * 0.72]], A.PAL.tongue, { ...O, seed: seed + 14 });
      if (!wail) for (let i = 0; i < 3; i++) { const tx = 34 + i * 22, ty = -26 - i * 2; A.fill(A.ellipsePts(tx, ty + 3, 4, 4.5, 10), '#ffffff', { ...O, seed: seed + 60 + i }); A.line(A.ellipsePts(tx, ty + 3, 4, 4.5, 10).slice(0, 6), { w: 1, seed: seed + 64 + i, passes: 1 }); }
      A.line(m, { closed: true, w: 2.6, seed: seed + 15 });
    } else {
      if (M === 'sad') {   // corners turned down: a clear frown
        A.line([[16, -18], [40, -28], [70, -30], [94, -22]], { w: 2.8, seed: seed + 16 });
      } else {
        const sm = M === 'smile' ? 10 : 0;
        A.line([[14, -26], [50, -26 + sm * 0.9], [84, -34 + sm * 0.2], [100, -42]], { w: 2.8, seed: seed + 16 });
        A.line([[14, -26], [8, -32]], { w: 1.8, seed: seed + 17 });
      }
    }
    // two big eyes in ¾ view: near eye (bigger) and far eye (near the snout bridge)
    const EYES = [[0, -62, 23], [46, -64, 18]];
    const kind = p.blink > 0.5 && p.eye !== 'happy' ? 'closed' : p.eye;
    EYES.forEach(([ex, ey, R0], k) => {
      const R = R0 * (kind === 'wide' ? 1.1 : 1);
      if (kind === 'happy') { A.line([[ex - R * 0.7, ey + 4], [ex, ey - R * 0.45], [ex + R * 0.7, ey + 4]], { w: 3.4, seed: seed + 19 + k }); }
      else if (kind === 'closed' || kind === 'squeeze') {
        const sq = kind === 'squeeze';
        A.line(sq ? [[ex - R * 0.7, ey - 4], [ex + R * 0.2, ey + 2], [ex - R * 0.4, ey + 6]] : [[ex - R * 0.75, ey + 2], [ex, ey + R * 0.35], [ex + R * 0.75, ey + 2]], { w: 3.2, seed: seed + 19 + k });
      } else {
        const eyeP = A.ellipsePts(ex, ey, R * 0.88, R, 22);
        A.fill(eyeP, '#ffffff', { ...O, seed: seed + 21 + k, jit: 0.6 });
        const lx = ex + 3 + p.look[0] * R * 0.3, ly = ey + 2 + p.look[1] * R * 0.3 + (kind === 'sad' ? 3 : 0);
        const pr = R * (kind === 'wide' ? 0.5 : 0.6);
        ctx.save();
        ctx.fillStyle = 'rgba(26,24,22,0.97)'; ctx.beginPath(); ctx.arc(lx, ly, pr, 0, 7); ctx.fill();
        ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(lx - pr * 0.32, ly - pr * 0.36, pr * (kind === 'sad' || p.tears ? 0.42 : 0.34), 0, 7); ctx.fill();
        ctx.beginPath(); ctx.arc(lx + pr * 0.36, ly + pr * 0.32, pr * 0.15, 0, 7); ctx.fill();
        if (p.delight) { ctx.beginPath(); ctx.arc(lx + pr * 0.4, ly - pr * 0.45, pr * 0.1, 0, 7); ctx.fill(); }
        ctx.restore();
        A.line(eyeP, { closed: true, w: 2.8, seed: seed + 22 + k });
      }
      // brows: high arched (curious / wide), "/ \" inner ends raised (sad / crying), soft for smiling
      const b = p.brow || (kind === 'sad' || kind === 'squeeze' || M === 'wail' ? 'sad' : kind === 'wide' || kind === 'open' ? 'up' : 'soft');
      const by = ey - R - 10;
      if (b === 'sad') A.line(k === 0 ? [[ex - R * 0.8, by + 6], [ex + R * 0.5, by - 6]] : [[ex - R * 0.5, by - 6], [ex + R * 0.8, by + 6]], { w: 3, seed: seed + 23 + k });
      else if (b === 'up') A.line([[ex - R * 0.7, by + 2], [ex, by - 7], [ex + R * 0.7, by + 2]], { w: 3, seed: seed + 23 + k });
      else A.line([[ex - R * 0.6, by + 3], [ex, by - 2], [ex + R * 0.6, by + 3]], { w: 2.6, seed: seed + 23 + k });
    });
    if (p.blush) for (const [cx, cy] of [[-6, -30], [60, -34]]) A.fill(A.ellipsePts(cx, cy, 11, 6, 10), '#f2a0a0', { alpha: 0.55 * p.blush, seed: seed + 25 });
    if (p.tears > 0) {
      for (let k = 0; k < 2; k++) {
        const ph = ((p.tearT || 0) * 0.85 + k * 0.5) % 1, tx = k ? 50 : 4, ty = -40 + ph * 50;
        ctx.save(); ctx.globalAlpha = p.tears * (1 - ph * 0.7);
        const d = [[tx, ty - 8], [tx + 6, ty + 2], [tx, ty + 7], [tx - 6, ty + 2]];
        A.fill(d, '#a9d6f5', { ...O, seed: seed + 26 + k }); A.line(d, { closed: true, w: 1.4, seed: seed + 28 + k, passes: 1 });
        ctx.restore();
      }
    }
    if (p.shellHat > 0) { ctx.save(); ctx.globalAlpha = p.shellHat; A.shell(-4 + (p.hatDx || 0), -104 + (p.hatDy || 0), 1.15, -0.2 + (p.hatRot || 0), seed + 90, true); ctx.restore(); }
    ctx.restore();   // head

    // tiny arms under the chin (drawn after the head so they stay visible)
    const aw = p.arms * Math.sin(p.step * 2 + 1) * 0.7;
    for (const [ax, ay, sc, sd] of [[18, -104, 0.85, 11], [44, -100, 1, 9]]) {
      ctx.save(); ctx.translate(ax, ay); ctx.rotate(0.45 - aw * (sd === 9 ? 1 : -0.6)); ctx.scale(sc, sc);
      A.shape([[0, 0], [14, 2], [24, 9], [22, 17], [12, 13], [0, 9]], SK, { ...O, seed: seed + sd, shade: false, w: 1.8 });
      A.shape([[20, 15], [27, 19], [20, 20]], '#ffffff', { ...O, seed: seed + sd + 1, shade: false, w: 1 });
      ctx.restore();
    }
    ctx.restore();
  };
  // world position between Rex's eyes (for effects and camera targets)
  A.rexEye = (x, y, s, pose = {}) => [x + (pose.flip ? -1 : 1) * (14 + 22) * s, y + (-116 - 62) * s];
  A.rexNose = (x, y, s, pose = {}) => [x + (pose.flip ? -1 : 1) * (14 + 90) * s, y + (-116 - 56) * s];
})();
