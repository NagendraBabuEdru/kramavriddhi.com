// Round 5 clips: small hop (§8.6), big jump (§8.6) and startle (§8.8), each with 10 f of calm idle before and after the action.
// Poses: P07 wind-up, P08 air, P09 land, P05 scared crouch (design_r4.js values). Follow-through via MOTION springs (§8.10).
(function () {
  const M = window.MOTION, kf = M.kf, lerp = M.lerp, clamp = M.clamp;
  const PRE = 10, POST = 10;
  const E1 = { browLift: 0, browTilt: 0, browCurve: 0.3, lidUp: 1, lidLo: 0, pupil: 0.58, look: [0.15, 0], mouth: 'M1', open: 0, corners: 0.3, cheek: 0, blush: 0, wobble: 0, sweat: 0 };
  const DEF = E1;
  const REST = { near: [0.96, 0.26], far: [1.15, 0.45] };
  // blend two faces: numbers and arrays lerp, discrete fields (mouth, closed) switch half-way
  const mixFace = (a, b, u) => {
    const o = {};
    for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) {
      const va = a[k] ?? DEF[k], vb = b[k] ?? DEF[k];
      if (typeof va === 'number' && typeof vb === 'number') o[k] = lerp(va, vb, u);
      else if (Array.isArray(va) && Array.isArray(vb)) o[k] = va.map((v, i) => lerp(v, vb[i], u));
      else o[k] = u < 0.5 ? a[k] : b[k];
    }
    return o;
  };
  const faceAt = (f, keys) => {
    if (f <= keys[0][0]) return { ...keys[0][1] };
    for (let i = 1; i < keys.length; i++) if (f <= keys[i][0]) { const [f0, a] = keys[i - 1], [f1, b] = keys[i]; return mixFace(a, b, M.ease.inout((f - f0) / (f1 - f0))); }
    return { ...keys[keys.length - 1][1] };
  };
  // arm targets [near up, near fore, far up, far fore] keyed in frames, through the 2 f lag spring
  const armsAt = (f, keys) => { const v = [0, 1, 2, 3].map(k => M.arm(g => kf(g, keys)[k], f)); return { near: [v[0], v[1]], far: [v[2], v[3]] }; };
  const A4 = (n, fa) => [...n, ...fa];
  const sway = g => Math.sin(g / 96 * Math.PI * 2) * 0.05;   // §8.1 idle tail sway, carried through the action
  const tailOf = (tgt, f, extra = {}) => ({ up: tgt(f), seg: M.tailSeg(g => tgt(g) + sway(g), f), ...extra });
  // hat (§8.10 spring, 3 Hz ζ 0.35) with a soft clamp (tanh) instead of a hard one, so it never sits pinned at the limit
  const soft = (v, m) => m * Math.tanh(v / m);
  const hatOf = (headRot, headY, f) => ({ wob: soft(M.spring(headRot, f, 3, 0.35) - headRot(f), 0.15), dy: soft(M.spring(headY, f, 3, 0.35) - headY(f), 3) });

  /* ---------- hop / big jump (§8.6) ---------- */
  function leap(name, T) {
    const tA = PRE + T.ant, tL = tA + T.air, tS = tL + T.land, tE = tS + T.settle, N = tE + POST;
    const airAt = g => g > tA && g < tL ? 4 * T.apex * ((g - tA) / T.air) * (1 - (g - tA) / T.air) : 0;   // parabola, apex at air-frame T.air / 2
    const xAt = g => T.travel * clamp((g - tA) / T.air);   // constant horizontal speed in the air → a parabolic arc
    const SQ = [[0, 0], [PRE, 0], [tA, T.sqA], [tA + 1, -T.stretch, 'lin'], [tA + T.air / 2, 0, 'out'], [tL - 1, -T.stretch * 0.4, 'in'], [tL, T.sqL, 'lin'], [tS, T.sqL * 0.9, 'lin'], [tS + Math.round(T.settle * 0.5), -T.over], [tE, 0]];
    const BEND = [[PRE, 0], [tA, T.bendA], [tA + 3, -0.02], [tL - 1, 0], [tL + 2, T.bendL, 'out'], [tE, 0]];
    const HEAD = [[PRE, 0], [tA, T.headA], [tA + 3, -0.05], [tL - 1, -0.04], [tL + 2, 0.1, 'out'], [tE + 2, 0]];
    const TUCK = [[tA, 0], [tA + 2, T.tuck, 'out'], [tL - 2, T.tuck], [tL, 0, 'in']];
    const TAIL = [[PRE, 0], [tA, -0.15 - T.tailX], [tA + 2, -0.3], [tL - 1, T.tailFall], [tL + 1, 0.2, 'out'], [tE + 4, 0]];
    const BACK = [2.3, 2.7], AIRN = T.armsAir[0], AIRF = T.armsAir[1];
    const ARMS = [[PRE - 2, A4(REST.near, REST.far)], [tA - 2, A4(BACK, BACK)], [tA + 1, A4(AIRN, AIRF)], [tL - 3, A4(AIRN, AIRF)], [tL - 1, A4([0.8, 0.6], [0.8, 0.6]), 'out'], [tE + 2, A4(REST.near, REST.far)]];   // keyed 2 f early (the arm spring lags 2 f)
    const ANT = { ...E1, browLift: 0.3, look: [0.3, -0.1], corners: 0.4 };
    const AIRF2 = { browLift: 0.3, browTilt: -0.1, browCurve: 0.5, lidUp: 1.05, lidLo: 0.3, pupil: 0.6, look: [0.2, 0], mouth: 'M2', open: 0.35, corners: 0.8, cheek: 0.5, blush: 0.3 };
    const LAND = { ...E1, closed: 'squeeze', mouth: 'M0', corners: 0.2, cheek: 0.3, blush: 0.2 };
    const END = { ...E1, corners: 0.5, cheek: 0.2, blush: 0.15, lidLo: 0.1 };
    const FACES = [[PRE, E1], [tA, ANT], [tA + 2, AIRF2], [tL - 1, AIRF2], [tL, LAND], [tS, LAND], [tS + 2, END], [N, END]];
    const CHEEK = [[tL, 0], [tL + 1, 0.7], [tL + 2, 0.1], [tL + 3, 0.45], [tL + 4, 0]];   // §8.10 cheek jiggle (via face.cheek → mouth corners)
    const sq = g => kf(g, SQ), bend = g => kf(g, BEND), tilt = g => kf(g, HEAD);
    M.clip(name, { frames: N, at(t) {
      const f = t * M.FPS, id = M.idle(f), air = airAt(f), fc = faceAt(f, FACES);
      fc.cheek = (fc.cheek || 0) + kf(f, CHEEK);
      if (!fc.closed) fc.look = fc.look && f > PRE && f < tE ? fc.look : id.look;
      const ar = armsAt(f, ARMS), tk = kf(f, TUCK), k = T.tuck ? tk / T.tuck : 0;
      // hat driver: the squash / neck motion in full, at 25 % (with 12 % of the jump height) (in free fall the hat travels with the head; a full-height drive pins the spring)
      const headRot = g => kf(g, HEAD) - 0.5 * kf(g, BEND), headY = g => 0.25 * (-0.12 * airAt(g) + 150 * kf(g, SQ)) + M.idle(g).neckDrop;
      const w = 1 - clamp((f - PRE + 1) / 2) + clamp((f - tE) / 3);   // idle breathing fades out for the action and back in after
      return { x: xAt(f), plant: air > 0 ? [] : ['near', 'far'], pose: {
        face: fc, squash: sq(f) + id.squash * w, air, bob: id.bob, neckDrop: id.neckDrop, bend: bend(f), headTilt: tilt(f), tuck: tk,
        feet: { near: { rot: -0.35 * k, lift: 2 * k }, far: { rot: -0.22 * k, dx: -3 * k } },
        arms: { near: [ar.near[0] + id.armD, ar.near[1] + id.armD], far: [ar.far[0] + id.armD * 0.8, ar.far[1] + id.armD * 0.8] },
        tail: tailOf(g => kf(g, TAIL), f), hat: hatOf(headRot, headY, f),
      } };
    } });
    M.clips[name].marks = { tA, tL, tS, tE, N };
  }
  leap('hop', { ant: 3, air: 8, land: 2, settle: 5, apex: 36, sqA: 0.12, stretch: 0.08, sqL: 0.15, over: 0.03, travel: 24, tuck: 6, bendA: 0.06, bendL: 0.04, headA: 0.1, tailX: 0, tailFall: -0.15,
    armsAir: [[-0.2, 0.0], [-0.3, -0.1]] });
  leap('jump', { ant: 5, air: 20, land: 3, settle: 8, apex: 90, sqA: 0.2, stretch: 0.12, sqL: 0.2, over: 0.04, travel: 70, tuck: 10, bendA: 0.12, bendL: 0.08, headA: 0.15, tailX: 0.1, tailFall: 0.05,
    armsAir: [[-0.35, -0.1], [-0.5, -0.25]] });

  /* ---------- startle (§8.8) → P05 scared crouch ---------- */
  {
    const a0 = PRE, N = PRE + 18 + POST, aE = a0 + 18;
    const E14 = { browLift: 1, browTilt: 0, browCurve: 0.3, lidUp: 1.15, lidLo: 0, pupil: 0.3, look: [0.4, 0], mouth: 'M6', open: 0.6, corners: 0 };
    const E13 = { browLift: 0.8, browTilt: 1, browCurve: 0.3, lidUp: 1.1, lidLo: 0, pupil: 0.32, look: [1, 0], mouth: 'M8', open: 0.12, corners: -0.6, wobble: 0.4, sweat: 1 };
    const FACES = [[a0, E1], [a0 + 1, E14], [a0 + 6, E14], [a0 + 14, E13]];
    const DEFT = [[-30, -40], [-62, -36], [-94, -36], [-118, -42], [-132, -52]], STR = [[-30, -40], [-62, -38], [-94, -36], [-120, -34], [-138, -32]];
    // f0 normal, f1 jolt (snap), f1–6 hold, f6–18 ease into P05; air falls back with gravity (ease-in) f6–9
    const AIR = [[a0, 0], [a0 + 1, 10, 'lin'], [a0 + 6, 9], [a0 + 9, 0, 'in']];
    const SQ = [[a0, 0], [a0 + 1, -0.12, 'lin'], [a0 + 6, -0.1], [a0 + 9, 0.05, 'in'], [a0 + 15, 0.165], [a0 + 18, 0.15]];
    const BEND = [[a0, 0], [a0 + 1, -0.06, 'lin'], [a0 + 6, -0.06], [a0 + 15, -0.16], [a0 + 18, -0.15]];
    const HEAD = [[a0, 0], [a0 + 1, -0.05, 'lin'], [a0 + 6, -0.05], [a0 + 16, 0.04]];
    const NECK = [[a0, 0], [a0 + 1, -3, 'lin'], [a0 + 6, -3], [a0 + 15, 8.5], [a0 + 18, 8]];
    const STIFF = A4([0.22, 0.18], [-0.12, -0.16]), P05 = A4([0.0, -0.9], [0.0, -0.9]);
    const ARMS = [[a0, A4(REST.near, REST.far)], [a0 + 1, STIFF, 'lin'], [a0 + 6, STIFF], [a0 + 15, P05], [N, P05]];
    const TAILUP = [[a0, 0], [a0 + 1, 0.15, 'lin'], [a0 + 6, 0.15], [a0 + 14, 0]];
    const STRAIGHT = [[a0, 0], [a0 + 1, 1, 'lin'], [a0 + 6, 1], [a0 + 12, 0]], WRAP = [[a0 + 6, 0], [a0 + 16, 1]];
    const HATPOP = g => g < a0 + 1 ? 0 : (() => { const tt = (g - a0 - 1) / M.FPS, w = 2 * Math.PI * 3, z = 0.35, wd = w * Math.sqrt(1 - z * z);   // released 8 up, 3 Hz ζ 0.35
      return -8 * Math.exp(-z * w * tt) * (Math.cos(wd * tt) + z * w / wd * Math.sin(wd * tt)); })();
    const vib = g => g >= a0 + 1 && g < a0 + 6 ? (Math.floor(g) % 2 ? 1 : -1) : 0;   // ±1 unit, every frame
    const trem = g => g >= aE - 2 ? (Math.floor(g) % 2 ? 0.5 : -0.5) * (Math.floor(g / 2) % 3 ? 1 : 0.4) : 0;   // P05 tremble in the hold: the body (bob), not the planted feet
    const BLINK = [a0 + 6];   // the surprise blink (§8.2), as the hold breaks
    M.clip('startle', { frames: N, at(t) {
      const f = t * M.FPS, id = M.idle(f), fc = faceAt(f, FACES), lid = M.blink(f, BLINK);
      fc.lidUp = (fc.lidUp ?? 1) * lid; if (f <= a0) fc.look = id.look;
      const calm = 1 - clamp((f - a0) / 1);   // breathing fades out at the jolt, then a shallow fast breath in the crouch
      const sc = Math.sin(f / 30 * Math.PI * 2) * clamp((f - aE + 4) / 4);
      const ar = f >= a0 + 1 && f < a0 + 6 ? { near: STIFF.slice(0, 2), far: STIFF.slice(2) } : armsAt(f, ARMS);   // stiff = no lag in the hold
      const st = kf(f, STRAIGHT), pts = DEFT.map((p, i) => [lerp(p[0], STR[i][0], st), lerp(p[1], STR[i][1], st)]);
      const tUp = g => kf(g, TAILUP);
      const headRot = g => kf(g, HEAD) - 0.5 * kf(g, BEND), headY = g => -kf(g, AIR) + 150 * kf(g, SQ) + kf(g, NECK);
      const hat = hatOf(headRot, headY, f);
      return { x: vib(f), plant: kf(f, AIR) > 0.01 ? [] : ['near', 'far'], pose: {
        face: fc, air: kf(f, AIR) + vib(f) * 0.5, squash: kf(f, SQ) + id.squash * calm + 0.01 * sc, bob: id.bob * calm + trem(f), neckDrop: kf(f, NECK) + id.neckDrop * calm,
        bend: kf(f, BEND), headTilt: kf(f, HEAD), spread: f >= a0 + 1 && f < a0 + 8,
        arms: { near: [ar.near[0] + id.armD * calm, ar.near[1]], far: [ar.far[0] + id.armD * calm * 0.8, ar.far[1]] },
        tail: { ...tailOf(tUp, f), points: pts, wrap: kf(f, WRAP) }, hat: { wob: hat.wob, dy: f >= a0 + 1 ? HATPOP(f) : hat.dy },
      } };
    } });
    M.clips.startle.marks = { jolt: a0 + 1, holdEnd: a0 + 6, crouch: aE, N };
  }
})();
