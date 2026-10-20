// Round 5 clips: sneeze (Bible §8.9, 48 f) and shake-dry (§8.7, 30 f), each with 10 f of idle before and after.
// Particles (sneeze spray, shake droplets) are drawn in world space via fx(T); their launch points come from a copy of the
// rig's head / body / tail transforms (rex2.js) so they leave the nose, the head edge, the back and the tail tip exactly.
(function () {
  const M = window.MOTION, A = window.ART, kf = M.kf, FPS = M.FPS, clamp = M.clamp;
  const X = k => window.REX_EXPR[k][1];
  const E1 = { browCurve: 0.3, lidUp: 1, lidLo: 0, pupil: 0.58, mouth: 'M1', corners: 0.3 };
  const PRE = 10, POST = 10;

  /* ---------- rig geometry (mirrors rex2.js: squash → bodyT (bob, bend about the hip) → neck → head) ---------- */
  const HC = [18, -166], NECK = [14, -116];
  const rot = (p, a, c = [0, 0]) => { const dx = p[0] - c[0], dy = p[1] - c[1], co = Math.cos(a), si = Math.sin(a); return [c[0] + dx * co - dy * si, c[1] + dx * si + dy * co]; };
  const sq = p => { const q = clamp(p.squash || 0, -0.4, 0.4); return [1 / (1 - q), 1 - q, q]; };
  const bodyOut = (p, b) => { const [sx, sy] = sq(p), r = rot(b, (p.bend || 0) + (p.lean || 0), [0, -40]); return [r[0] * sx, (r[1] + (p.bob || 0)) * sy - (p.air || 0)]; };
  // a point in HC-relative head units → code units (foot point origin, y up negative)
  const headPt = (p, h) => {
    const [sx, sy, q] = sq(p), qh = q * 0.4, bend = (p.bend || 0) + (p.lean || 0);
    let v = [(h[0] + HC[0] - NECK[0]) * (1 / (1 - qh)) / sx, (h[1] + HC[1] - NECK[1]) * (1 - qh) / sy];
    v = rot(v, (p.headTilt || 0) - bend * 0.5);
    return bodyOut(p, [v[0] + NECK[0], v[1] + NECK[1] + (p.neckDrop || 0)]);
  };
  // the tail tip (the default 5-point base, with tail.up / tail.seg), as rex2.js tail()
  const TBASE = [[-30, -40], [-62, -36], [-94, -36], [-118, -42], [-132, -52]];
  const tailTip = p => {
    const tl = p.tail || {}, lift = (tl.lift || 0) + (tl.up || 0) / 0.7, pts = [TBASE[0]]; let acc = 0;
    for (let i = 1; i < 5; i++) { acc += lift * 0.07 * i + ((tl.seg || [])[i - 1] || 0); const v = rot([TBASE[i][0] - TBASE[i - 1][0], TBASE[i][1] - TBASE[i - 1][1]], acc); pts.push([pts[i - 1][0] + v[0], pts[i - 1][1] + v[1]]); }
    const [sx, sy] = sq(p), t = pts[4]; return [t[0] * sx, (t[1] + (p.bob || 0)) * sy - (p.air || 0)];
  };
  // MOTION.tailSeg gives each segment's lag relative to the driver; add the driver itself as the root rotation
  const tailFT = (drv, F) => { const sg = M.tailSeg(drv, F); sg[0] += drv(F); return sg; };
  // a faster follow-through for the shake (MOTION.tailSeg's 2.6 Hz spring smooths away a 5 Hz swing): segment i follows
  // the driver lagging 1.5 f × i through a 6 Hz, ζ 0.5 spring (~16 % overshoot); returns per-segment angles for tail.seg
  const tailFast = (drv, F) => { const cum = [1, 2, 3, 4].map(i => M.spring(g => drv(g - 1.5 * i), F, 6, 0.5)); return cum.map((v, i) => v - (i ? cum[i - 1] : 0)); };
  const add = (a, b) => a.map((v, i) => v + b[i]);
  const drop = (x, y, rx, ry, ang, alpha, seed, col = '#a9d6f5') => {   // one water drop (fill + thin pencil edge)
    const c = A.ctx(), D = A.ellipsePts(x, y, rx, ry, 10, ang);
    A.fill(D, col, { alpha, jit: 0, seed }); c.save(); c.globalAlpha = alpha; A.line(D, { closed: true, w: 1.2, passes: 1, jit: 0, seed: seed + 10 }); c.restore();
  };

  /* ====================== SNEEZE (48 f) ====================== */
  // core frame c = F − PRE. Inhales at c 0, 8, 16 (3 f each, ease-out, then a 5 f hitch-hold); freeze 24–28; release 28–30;
  // recover 30–42; surprised double blink at 42 and 46; the second blink's close becomes the E4 giggle's ∩ eyes at 48.
  const SN = 48, SN_N = PRE + SN + POST;
  const INH = (v1, v2, v3, end = v3) => [[0, 0], [3, v1, 'out'], [8, v1 * 0.95], [11, v2, 'out'], [16, v2 * 0.97], [19, v3, 'out'], [24, end]];
  const snCore = (F) => {
    const c = F - PRE;
    const headTilt = kf(c, [...INH(-0.06, -0.12, -0.18), [28, -0.2], [29, 0.1, 'in'], [30, 0.3, 'out'], [33, 0.24], [37, -0.04], [41, 0.02], [44, 0], [49, 0.15], [58, 0.13]]);
    const bend = kf(c, [...INH(-0.02, -0.04, -0.06), [28, -0.07], [30, 0.12, 'out'], [34, 0.08], [38, -0.02], [42, 0], [49, 0.03]]);
    const squash = kf(c, [...INH(-0.02, -0.04, -0.06), [28, -0.065], [29, 0.04, 'in'], [30, 0.12, 'out'], [32, 0.01], [33, 0.08, 'in'], [36, -0.03], [40, 0.01], [43, 0]]);
    const air = kf(c, [[29, 0], [31, 4, 'out'], [33, 0, 'in']]);
    const x = kf(c, [[29, 0], [33, -6, 'out']]);
    const neckDrop = kf(c, [...INH(-1, -2, -3), [28, -3], [30, 3, 'out'], [34, 1], [38, 0], [49, 2]]);
    const tailD = kf(c, [...INH(0.07, 0.14, 0.2), [28, 0.22], [30, -0.2, 'out'], [34, 0.06], [38, 0], [49, 0.08]]);
    return { c, headTilt, bend, squash, air, x, neckDrop, tailD };
  };
  const snFace = (c) => {
    const BL = M.blink(c, [42, 46]);
    if (c < 0) return { ...E1, lidUp: M.blink(c + PRE, []) };
    if (c < 24) {   // wind-up (E17): brows 0.5 → 0.8, lids step 1 → 0.6 → 0.4 → 0.2, cross 0.6, flare +0.33 per inhale, M12
      return { browLift: kf(c, INH(0.5, 0.65, 0.8)), browTilt: kf(c, [[0, 0], [3, 0.3]]), browCurve: 0.3, lidUp: kf(c, [[0, 1], [3, 0.6, 'out'], [8, 0.6], [11, 0.4, 'out'], [16, 0.4], [19, 0.2, 'out']]), lidLo: 0,
        pupil: 0.58, cross: kf(c, [[0, 0], [4, 0.6]]), mouth: 'M12', open: kf(c, [[0, 0], [6, 0.2]]), corners: 0, wrinkle: kf(c, [[0, 0], [19, 1, 'lin']]), flare: kf(c, INH(0.33, 0.66, 1)) };
    }
    if (c < 28) return { browLift: 0.8, browTilt: 0.3, closed: 'squeeze', mouth: 'M12', open: 0.2, wrinkle: 1, flare: 1 };   // freeze
    if (c < 34) return { browLift: -0.2, browTilt: 0.3, closed: 'squeeze', mouth: 'M6', open: kf(c, [[28, 0.3], [30, 0.8, 'out'], [33, 0.6]]), wrinkle: kf(c, [[30, 1], [34, 0.3]]), flare: kf(c, [[28, 1], [30, 0.7], [34, 0.2]]) };   // ACHOO
    if (c < 48) {   // surprised (E5-ish) with the double blink
      const E5 = X('E5');
      return { ...E5, browLift: kf(c, [[34, 0.6], [36, 1, 'out']]), lidUp: Math.min(kf(c, [[34, 0.5], [36, 1.15, 'out']]), BL * 1.15), pupil: 0.45, look: [0.1, 0], open: kf(c, [[34, 0.6], [38, 0.4]]), flare: kf(c, [[34, 0.2], [40, 0]]) };
    }
    return { ...X('E4') };   // giggle
  };
  const snPose = (F) => {
    const k = snCore(F), id = M.idle(F), c = k.c;
    const armDrv = g => { const cc = g - PRE; return kf(cc, [[0, 0], [19, -0.25], [28, -0.28], [30, 0.5, 'out'], [36, 0.1], [42, 0], [48, -0.3]]); };
    const foreDrv = g => { const cc = g - PRE; return kf(cc, [[0, 0], [19, -0.15], [28, -0.15], [30, 0.4, 'out'], [38, 0], [42, 0], [49, -1.46]]); };
    const aU = M.arm(armDrv, F), aF = M.arm(foreDrv, F);
    const tailDrv = g => snCore(g).tailD + Math.sin(g / 96 * Math.PI * 2) * 0.05;
    const headRot = g => { const q = snCore(g); return q.headTilt - q.bend * 0.5; };
    const headY = g => snCore(g).neckDrop + M.idle(g).neckDrop;
    const hat = M.hat(headRot, headY, F);
    const jump = kf(c, [[28, 0], [30, -6, 'out'], [33, -0.5, 'in'], [35, -1.4, 'out'], [37, 0, 'in'], [39, 0.4], [41, 0]]);   // the hat pops 6 up and bounces
    const giggle = c >= 48 ? Math.sin((c - 48) / 5 * Math.PI * 2) * 0.012 : 0;   // shoulders bounce with the giggle
    return {
      x: k.x, plant: c >= 29 && c < 33 ? [] : ['near', 'far'],
      pose: { face: { ...snFace(c), ...(c < 24 || c >= 34 ? { look: snFace(c).look || id.look } : {}) },
        squash: k.squash + id.squash + giggle, bob: id.bob, air: k.air, bend: k.bend, headTilt: k.headTilt, neckDrop: k.neckDrop + id.neckDrop,
        arms: { near: [0.96 + id.armD + aU, 0.26 + id.armD + aF], far: [1.15 + id.armD * 0.8 + aU * 0.8, 0.45 + id.armD * 0.8 + aF * 0.4] },
        tail: { seg: tailFT(tailDrv, F) }, hat: { wob: hat.wob, dy: hat.dy + jump, dx: kf(c, [[28, 0], [30, -3, 'out'], [36, 0]]) } },
    };
  };
  // spray: 12 particles from the nostrils at c 29.3–30.2, a ±20° cone along the snout, flying with drag and fading over 12–18 f
  const SPRAY = [...Array(12).keys()].map(k => {
    const f0 = PRE + 29.3 + k * 0.08, r = A.rnd(71, k), r2 = A.rnd(73, k), F0 = f0;
    const p = snPose(F0).pose, x0 = snPose(F0).x, nose = headPt(p, [76 + r2 * 4, -2 + (r - 0.5) * 4]);
    const dir = (p.headTilt - p.bend * 0.5) + ((((k * 5) % 12) / 11) * 2 - 1) * (20 * Math.PI / 180);   // angles shuffled against the speeds
    return { f0, x: x0 + nose[0], y: nose[1], dir, v: 320 + [3, 9, 0, 6, 11, 1, 7, 4, 10, 2, 8, 5][k] / 11 * 700 + r * 60, life: 9 + Math.floor(r2 * 7), size: 1.6 + r * 2.4, seed: 400 + k };
  });
  M.clip('sneeze', { frames: SN_N, at(t) {
    const F = t * FPS, r = snPose(F);
    return { ...r, fx(T, s) {
      for (const P of SPRAY) {
        const age = (F - P.f0) / FPS; if (age < 0 || age * FPS > P.life) continue;
        const kd = 4, d = P.v * (1 - Math.exp(-kd * age)) / kd, vx = Math.cos(P.dir), vy = Math.sin(P.dir);
        const px = P.x + vx * d, py = P.y + vy * d + 0.5 * 500 * age * age, u = age * FPS / P.life;
        const [cx, cy] = T(px, py), sp = P.v * Math.exp(-kd * age), st = 1 + Math.min(1.6, sp / 400);
        drop(cx, cy, P.size * s * st * (1 + u * 0.5), P.size * s * (1 + u * 0.5), P.dir, 0.95 * (1 - u * u), P.seed, '#cfe7f5');
      }
    } };
  } });

  /* ====================== SHAKE-DRY (30 f) ====================== */
  // core g = F − PRE. Anticipation 0–3 (crouch 0.06, squeeze); head 3–12 (3 decaying swings); body 8–20 (bend ±0.12, alternating
  // squash); tail 14–26 (±0.5); settle 26–30, a blink, then E2. Overlap: head → body → tail.
  const SH = 30, SH_N = PRE + SH + POST;
  const HEADK = [[3, 0], [5, 0.35], [8, -0.29], [11, 0.2], [13, -0.04], [15, 0]];
  const YAWK = [[3, 45], [5, 70], [8, 24], [11, 62], [13, 45]];
  const BENDK = [[8, 0], [10, 0.12], [13, -0.11], [16, 0.08], [19, -0.04], [21, 0]];
  const TAILK = [[10, 0], [13, 0.5], [16, -0.45], [19, 0.32], [22, -0.15], [24, 0]];   // the driver; the tip follows 6 f later
  const TAILC = [[9, 0], [12, 0.15], [22, 0.12], [28, 0]];   // the swing centre rides up a little so the low lobe clears the ground
  const shCore = (F) => {
    const g = F - PRE;
    const crouch = kf(g, [[0, 0], [3, 0.06, 'out'], [9, 0.05], [20, 0], [27, -0.025], [31, 0]]);
    const alt = kf(g, [[8, 0], [10, 0.04], [13, -0.04], [16, 0.03], [19, -0.015], [21, 0]]);   // alternating squash with the body swings
    return { g, headTilt: kf(g, HEADK), yaw: kf(g, YAWK), bend: kf(g, BENDK), squash: crouch + alt, tailD: kf(g, TAILK) + kf(g, TAILC), neckDrop: kf(g, [[0, 0], [3, 3], [12, 2], [20, 0]]) };
  };
  const shFace = (g) => {
    if (g < 0) return { ...E1, browTilt: 0.35, corners: 0, mouth: 'M1', lidUp: 1 };   // dripping, mildly glum
    if (g < 2) return { ...E1, browTilt: 0.35, corners: 0, lidUp: kf(g, [[0, 1], [2, 0.2]]) };
    if (g < 26) return { browLift: -0.2, browTilt: 0.3, closed: 'squeeze', mouth: 'M14', open: 0.1, wrinkle: 0.5 };
    const E2 = X('E2'), BL = M.blink(g, [29]);
    const open = kf(g, [[26, 0], [28, 1, 'out']]);
    return { ...E2, lidUp: Math.min(open, BL), lidLo: 0.3 * open, cheek: kf(g, [[26, 0], [30, 0.5]]), blush: kf(g, [[26, 0], [32, 0.3]]), open: kf(g, [[26, 0.1], [30, 0.35]]) };
  };
  const shPose = (F) => {
    const k = shCore(F), id = M.idle(F), g = k.g;
    const armDrv = h => -3 * shCore(h).bend - 0.6 * shCore(h).headTilt * 0.5;
    const aU = M.arm(armDrv, F), aF = M.arm(h => armDrv(h - 1), F);
    const tailDrv = h => shCore(h).tailD + 0.4 * shCore(h).bend + Math.sin(h / 96 * Math.PI * 2) * 0.05;
    const headRot = h => { const q = shCore(h); return q.headTilt - q.bend * 0.5; };
    const hat = M.hat(headRot, h => shCore(h).neckDrop + M.idle(h).neckDrop, F);
    const tailE2 = g >= 28 ? Math.sin((g - 28) / 15 * Math.PI * 2) * 0.12 * clamp((g - 28) / 6) : 0;   // E2: a happy 2 Hz wag
    return {
      x: 0, plant: ['near', 'far'],
      pose: { face: { ...shFace(g), look: shFace(g).look || id.look },
        squash: k.squash + id.squash, bob: id.bob, bend: k.bend, headTilt: k.headTilt + (g >= 28 ? kf(g, [[28, 0], [33, -0.05]]) : 0), headYaw: k.yaw === 45 ? undefined : k.yaw, neckDrop: k.neckDrop + id.neckDrop,
        arms: { near: [0.96 + id.armD + aU, 0.26 + id.armD + aU * 0.6], far: [1.15 + id.armD * 0.8 + aF, 0.45 + id.armD * 0.8 + aF * 0.6] },
        tail: { seg: tailFast(h => tailDrv(h) + (h - PRE >= 28 ? Math.sin((h - PRE - 28) / 15 * Math.PI * 2) * 0.12 * clamp((h - PRE - 28) / 6) : 0), F) }, hat },
    };
  };
  // droplets: at the 4 strongest reversals (head at g5 and g8, body at g13, tail at g18), thrown on the tangent of the swing
  // that just ended, from the part's outer edge; velocity = the mean edge velocity over that half swing; gravity 1200 units/s².
  const EDGE = {
    head: [[[-50, -30], [-20, -54], [60, -24], [78, 14]], (p, e) => headPt(p, e)],
    body: [[[-46, -110], [-50, -84], [44, -116]], (p, e) => bodyOut(p, e)],
    tail: [[[0, 0], [0, 0], [0, 0]], (p) => tailTip(p)],
  };
  const tipY = F => tailTip(shPose(F).pose)[1];
  const tailRev = (() => { let best = 18, bs = 0; for (let g = 15; g <= 27; g++) { const F = PRE + g, a = tipY(F - 1), b = tipY(F), c = tipY(F + 1);
    if ((b - a) * (c - b) <= 0 && Math.abs(b - tipY(F - 3)) > bs) { bs = Math.abs(b - tipY(F - 3)); best = g; } } return best; })();   // the tip's strongest reversal
  const REV = [['head', 5, 4, 3], ['head', 8, 3, 2], ['body', 13, 3, 3], ['tail', tailRev, 3, 3]];
  const DROPS = [];
  REV.forEach(([part, gr, n, back], ri) => {
    const F1 = PRE + gr, F0 = F1 - back, [edges, fn] = EDGE[part];
    for (let k = 0; k < n; k++) {
      const e = edges[k % edges.length], r = A.rnd(91 + ri, k), r2 = A.rnd(97 + ri, k);
      const P1 = fn(shPose(F1).pose, e), P0 = fn(shPose(F0).pose, e), dt = back / FPS;
      let vx = (P1[0] - P0[0]) / dt, vy = (P1[1] - P0[1]) / dt;
      const a = Math.atan2(vy, vx) + (r - 0.5) * 0.5, sp = Math.hypot(vx, vy) * (0.75 + r2 * 0.4) * (part === 'body' ? 2.5 : 1);   // the back swings slowly about the hip; its drops are flung harder
      vx = Math.cos(a) * sp; vy = Math.max(-250, Math.sin(a) * sp);   // steep upward throws are capped so every drop lands inside the clip
      const jx = part === 'tail' ? (r - 0.5) * 8 : 0, jy = part === 'tail' ? (r2 - 0.5) * 8 : 0;
      DROPS.push({ f0: F1 + k * 0.25, x: P1[0] + jx, y: P1[1] + jy, vx, vy, size: 3 + (k % 3), seed: 500 + ri * 10 + k });
    }
  });
  // wet speculars on the head and back before the shake; they go as the drops fly
  const SPEC = [['head', [-30, -40]], ['head', [10, -48]], ['head', [-48, 4]], ['body', [-40, -100]], ['body', [-44, -70]], ['body', [30, -124]]];
  M.clip('shake', { frames: SH_N, at(t) {
    const F = t * FPS, r = shPose(F), g = F - PRE;
    return { ...r, fx(T, s) {
      const al = kf(g, [[3, 1], [12, 0]]);
      if (al > 0) SPEC.forEach(([part, e], i) => { const P = part === 'head' ? headPt(r.pose, e) : bodyOut(r.pose, e), [cx, cy] = T(P[0], P[1]);
        A.fill(A.ellipsePts(cx, cy, 3.2 * s, 2 * s, 10, -0.5), '#ffffff', { alpha: 0.85 * al, jit: 0, seed: 600 + i }); });
      for (const D of DROPS) {
        const a = (F - D.f0) / FPS; if (a < 0) continue;
        let px = D.x + D.vx * a, py = D.y + D.vy * a + 0.5 * 1200 * a * a;
        if (py >= 0) {   // hit the ground: a small splat for 5 f
          const tg = (-D.vy - Math.sqrt(D.vy * D.vy - 2 * 1200 * D.y)) / 1200;   // positive root of y + vy t + 600 t² = 0
          const tl = Math.max(0, (-D.vy + Math.sqrt(Math.max(0, D.vy * D.vy - 2 * 1200 * D.y))) / 1200), age = (a - tl) * FPS;
          if (age > 5) continue; const [cx, cy] = T(D.x + D.vx * tl, 0);
          drop(cx, cy - 1, (D.size + 2 + age) * s, 1.4 * s, 0, 0.8 * (1 - age / 5), D.seed); continue;
        }
        const vx = D.vx, vy = D.vy + 1200 * a, sp = Math.hypot(vx, vy), [cx, cy] = T(px, py);
        drop(cx, cy, D.size * s * (1 + Math.min(0.8, sp / 900)), D.size * s * 0.85, Math.atan2(vy, vx), 1, D.seed);
      }
    } };
  } });
  window.REX_FX = { tailRev, SPRAY, DROPS, headPt, tailTip, bodyOut, snPose, shPose };
})();
