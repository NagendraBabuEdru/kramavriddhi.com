// Round 5 clips: walk (§8.4) and waddle-run (§8.5). ¾ view facing right, travelling right.
// Foot lock: every foot has a world x (W, relative to its standing spot). While it is planted, feet.dx = (W + c − x) / sx − c,
// so the drawn foot stays fixed on the ground whatever the body does (c = the rig's foot reference x, sx = the squash x-scale).
(function () {
  const M = window.MOTION, kf = M.kf, lerp = M.lerp, clamp = M.clamp;
  const C_REF = { near: 30, far: -20 };                  // rig: A.rex2._foot (30, 0) / _footF (−20, 0) in leg space
  const HEEL_LEN = { near: 54, far: 58 };                 // toe → heel, for heel-strike lift compensation
  const smooth = u => { u = clamp(u); return u * u * (3 - 2 * u); };
  const E1 = { browCurve: 0.3, lidUp: 1, lidLo: 0, pupil: 0.58, mouth: 'M1', corners: 0.3 };
  const E2 = { browLift: 0.3, browTilt: -0.1, browCurve: 0.5, lidUp: 1, lidLo: 0.3, pupil: 0.6, mouth: 'M2', open: 0.35, corners: 0.8, cheek: 0.5, blush: 0.3 };

  // a foot's state at frame f from its plan: a list of stances { s0, s1, W } (s1 = lift-off frame); swings fill the gaps.
  // sw = swing shape { lift: kf keys over the swing in 0…1, heelUp, strike }
  function footAt(plan, f, sw) {
    for (let i = 0; i < plan.length; i++) {
      const st = plan[i];
      if (f >= st.s0 && f <= st.s1) {   // planted (contact frames inclusive)
        let heel = 0, rot = 0;
        if (isFinite(st.s1)) heel = sw.heelUp * Math.pow(clamp((f - (st.s1 - sw.toeOff)) / sw.toeOff), 2);   // toe-off: the heel peels up
        if (isFinite(st.s0) && i > 0) rot = sw.strike * (1 - smooth((f - st.s0) / sw.flat));                // heel strike: toe comes down
        return { W: st.W, lift: 0, heel, rot, planted: true };
      }
      const nx = plan[i + 1];
      if (nx && f > st.s1 && f < nx.s0) {   // swinging from this stance to the next
        const L = st.s1, D = nx.s0 - L, u = (f - L) / D;
        const W = lerp(st.W, nx.W, sw.ease(u));
        const lift = kf(u * 100, sw.lift);
        const heel = sw.heelUp * (1 - smooth((f - L) / sw.heelDown));
        const rot = sw.strike * smooth((f - (nx.s0 - sw.pre)) / (sw.pre - 1));
        return { W, lift, heel, rot, planted: false };
      }
    }
    return { W: 0, lift: 0, heel: 0, rot: 0, planted: true };
  }
  // feet → rig values (dx cancels the travel for a locked foot)
  function rigFeet(Fn, Ff, x, sx) {
    const one = (F, k) => ({ dx: (F.W + C_REF[k] - x) / sx - C_REF[k], lift: F.lift + HEEL_LEN[k] * Math.sin(F.rot), rot: F.rot });
    return { feet: { near: one(Fn, 'near'), far: one(Ff, 'far') }, heels: [Fn.heel, Ff.heel], plant: [Fn.planted && 'near', Ff.planted && 'far'].filter(Boolean) };
  }

  /* =========================== WALK (§8.4) =========================== */
  // 14 f per step, stride 40. f0–8 stand + anticipation; step 1 (near, half step) lands f20; steps 2–5 are the two full cycles
  // (f34–90 = 56 f); step 6 (far) closes beside the near foot at f90; settle to f110.
  {
    const STEP = 14, STRIDE = 40, V = STRIDE / STEP, N = 110;
    const CON = [20, 34, 48, 62, 76, 90];                       // contact frames of steps 1…6
    const LIFT = n => CON[n - 1] - 12;                           // a foot lifts 2 f after the other foot's contact (12 f swing)
    const PLAN = {
      near: [{ s0: -Infinity, s1: LIFT(1), W: 0 }, { s0: CON[0], s1: LIFT(3), W: 20 }, { s0: CON[2], s1: LIFT(5), W: 100 }, { s0: CON[4], s1: Infinity, W: 180 }],
      far: [{ s0: -Infinity, s1: LIFT(2), W: 0 }, { s0: CON[1], s1: LIFT(4), W: 60 }, { s0: CON[3], s1: LIFT(6), W: 140 }, { s0: CON[5], s1: Infinity, W: 180 }],
    };
    const SW = { lift: [[0, 0], [17, 5.5, 'out'], [42, 9, 'out'], [75, 5.5, 'in'], [100, 0, 'in']], heelUp: 6, toeOff: 6, heelDown: 6, strike: 0.16, flat: 2, pre: 4, ease: u => M.ease.inout(u) };
    // body travel: still → uniform acceleration (f8–34) → 2.857 u/f → uniform deceleration (f76–92) → still at 180
    const A1 = V / 26, A2 = V / 16, X34 = 0.5 * A1 * 26 * 26, X76 = X34 + V * 42;
    const X = f => f <= 8 ? 0 : f <= 34 ? 0.5 * A1 * (f - 8) ** 2 : f <= 76 ? X34 + V * (f - 34) : f <= 92 ? X76 + V * (f - 76) - 0.5 * A2 * (f - 76) ** 2 : X76 + V * 16 - 0.5 * A2 * 256;
    // body bob (+ = down) and squash, per step: contact 0 → f2 down +4 (squash 0.03) → f7 passing −3 → f10 up −4 → contact
    const AMP = [0.6, 1, 1, 1, 1, 0.7];
    const BOBK = [[0, 0], [4, 1.2], [12, -1.6], [17, -2.4]], SQK = [[0, 0], [4, 0.012], [12, -0.004]];
    CON.forEach((c, i) => { const a = AMP[i]; BOBK.push([c, 0], [c + 2, 4 * a], [c + 7, -3 * a], [c + 10, -4 * a]); SQK.push([c, 0], [c + 2, 0.03 * a], [c + 7, 0], [c + 10, -0.01 * a]); });
    BOBK.length -= 2; SQK.length -= 2;                          // the last step ends in the settle instead of the up pose
    BOBK.push([97, -0.9], [103, 0.4], [110, 0]); SQK.push([97, -0.008], [103, 0.003], [110, 0]);
    const bob = g => kf(g, BOBK), squash = g => kf(g, SQK);
    // the step phase (odd = near contact) and the walking envelope for the swings
    const sPh = g => 1 + (g - CON[0]) / STEP;
    const env = g => smooth((g - 6) / 22) * (1 - smooth((g - 80) / 16));
    const legPh = g => -Math.cos(Math.PI * sPh(g));             // +1 when the near leg is forward (near contact), −1 when the far leg is
    const armN = g => 0.25 * env(g) * legPh(g);                 // near arm swings back (+) as the near leg goes forward
    const armF = g => -0.8 * armN(g - 2);                       // far arm: opposite, 2 f later, 80 %
    const tailD = g => -0.10 * env(g) * legPh(g);               // opposite the hips; tailSeg adds the lag (root ~3 f, tip ~7 f)
    const headY = g => 0.7 * bob(g - 2);                        // the head follows the body 2 f later at 70 %
    const nod = g => 0.006 * headY(g);
    const bend = g => 0.05 * env(g) + kf(g, [[0, 0], [5, 0.025], [10, 0]]);
    const BLINKS = [44, 99];                                  // two natural blinks over 3.7 s (§8.2 interval 60–180 f)
    M.clip('walk', { frames: N, ox: 700, at(t) {
      const f = t * M.FPS, x = X(f), q = squash(f), sx = 1 / (1 - q);
      const Fn = footAt(PLAN.near, f, SW), Ff = footAt(PLAN.far, f, SW), r = rigFeet(Fn, Ff, x, sx);
      const segs = M.tailSeg(tailD, f); segs[0] += tailD(f);   // absolute: segment i lags the driver 1.5 f × i
      const hat = M.hat(nod, headY, f), hatWob = clamp(hat.wob + 0.004 * (M.spring(headY, f, 3, 0.35) - headY(f)), -0.15, 0.15);
      const aN = M.arm(armN, f), aNf = M.arm(g => armN(g - 1), f) * 1.2, aF = M.arm(armF, f), aFf = M.arm(g => armF(g - 1), f) * 1.2;
      return { x, plant: r.plant, pose: {
        face: { ...E1, look: [0.25, 0], lidUp: M.blink(f, BLINKS) },
        squash: q, bob: bob(f) + 0.5 * Math.max(...r.heels), bend: bend(f), headTilt: nod(f), neckDrop: headY(f) - bob(f),
        feet: r.feet, heels: r.heels,
        arms: { near: [0.96 + aN, 0.26 + aNf], far: [1.15 + aF, 0.45 + aFf] },
        tail: { seg: segs }, hat: { wob: hatWob, dy: hat.dy },
      } };
    } });
    M.walkDebug = { X, PLAN, bob, tailD, armN, armF, headY, CON, V };
  }

  /* ======================== WADDLE-RUN (§8.5) ======================== */
  // 9 f per step, stride 46 (5.11 u/f); a foot is planted u0–6 of its step, then u7–8 is the 2 f flight (both feet up, body −6).
  // 2 cycles = 36 f, a seamless loop (springs are pre-rolled one loop so there is no start-up transient).
  {
    const STEP = 9, STRIDE = 46, V = STRIDE / STEP, N = 36, PRE = 36;
    const plan = k => {   // k = 0 near (even steps), 1 far (odd steps)
      const out = [];
      for (let n = -4 + k; n <= 8; n += 2) out.push({ s0: STEP * n, s1: STEP * n + 6, W: V * (STEP * n + 3) });   // planted mid-stance under the body
      return out;
    };
    const PLAN = { near: plan(0), far: plan(1) };
    const SW = { lift: [[0, 0], [8, 4, 'out'], [25, 12, 'out'], [50, 14], [75, 8, 'in'], [92, 3, 'in'], [100, 0, 'in']], heelUp: 6, toeOff: 4, heelDown: 6, strike: 0.10, flat: 2, pre: 3, ease: u => M.ease.inout(u) };
    const um = g => ((g % STEP) + STEP) % STEP;
    // body: contact 0 → u2 down +4 (squash 0.05) → u4.5 → u7 flight −6 (stretch) → u8 −5 → contact
    const bob = g => kf(um(g), [[0, 0], [2, 4, 'out'], [4.5, 0.5], [7, -6, 'out'], [8, -5, 'in'], [9, 0, 'in']]);
    const squash = g => kf(um(g), [[0, 0.02], [2, 0.05, 'out'], [4.5, 0], [7, -0.03], [8, -0.02], [9, 0.02, 'in']]);
    const flap = g => Math.sin(2 * Math.PI * (g - 7) / STEP + Math.PI / 2);   // −1 = arms up at the flight frame u7… +1 down at contact+2
    const armN = g => -0.55 * flap(g), armF = g => -0.55 * flap(g - 1);        // ±0.5 rad after the spring, near/far 1 f apart
    const tailD = g => 0.21 * Math.sin(2 * Math.PI * (g - 2) / STEP);          // straight back, bobbing ±0.15 (after the tail springs) with the steps
    const headY = g => bob(g - 1);                                             // the head lags 1 f
    const pre = fn => g => fn(g - PRE);
    const BLINKS = [14];
    M.clip('run', { frames: N, ox: 620, at(t) {
      const f = t * M.FPS, x = V * f, q = squash(f), sx = 1 / (1 - q);
      const Fn = footAt(PLAN.near, f, SW), Ff = footAt(PLAN.far, f, SW), r = rigFeet(Fn, Ff, x, sx);
      const segs = M.tailSeg(pre(tailD), f + PRE); segs[0] += tailD(f);
      const nodR = g => 0.004 * headY(g), hat = M.hat(pre(nodR), pre(headY), f + PRE);
      const hatWob = clamp(hat.wob + 0.003 * (M.spring(pre(headY), f + PRE, 3, 0.35) - headY(f)), -0.15, 0.15);
      const sp = fn => M.spring(pre(fn), f + PRE, 4, 0.6);
      const aN = sp(armN), aF = sp(armF), aNf = sp(g => armN(g - 1)), aFf = sp(g => armF(g - 1));
      return { x, plant: r.plant, pose: {
        face: { ...E2, look: [0.3, -0.05], lidUp: M.blink(f, BLINKS) },
        squash: q, bob: bob(f) + 0.5 * Math.max(...r.heels), bend: 0.12, headTilt: -0.05 + nodR(f), neckDrop: headY(f) - bob(f),
        feet: r.feet, heels: r.heels,
        arms: { near: [0.62 + aN, 0.05 + aNf * 0.8], far: [0.85 + aF, 0.2 + aFf * 0.8] },
        tail: { straight: true, seg: segs }, hat: { wob: hatWob, dy: hat.dy },
      } };
    } });
    M.runDebug = { PLAN, bob, V };
  }
})();
