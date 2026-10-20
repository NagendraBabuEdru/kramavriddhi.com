// Round 4 design sheets: the 20 key poses (§7), in colour and as silhouettes (labelled, and shuffled without labels).
(function () {
  const A = window.ART, F = window.FILM;
  const MODE = () => new URLSearchParams(location.search).get('mode') || 'normal';
  const base = { duration: 1, camera: [[0, 960, 540, 1]], wind: () => 0 };
  const label = (txt, x, y, size = 24) => { const ctx = A.ctx(); ctx.save(); ctx.font = `${size}px 'Patrick Hand'`; ctx.fillStyle = '#3a3530'; ctx.textAlign = 'center'; ctx.fillText(txt, x, y); ctx.restore(); };
  const E = () => window.REX_EXPR;
  const N = { browCurve: 0.3, lidUp: 1, lidLo: 0, mouth: 'M1', corners: 0.3 };
  const face = k => E()[k][1];
  // P01–P20 (§7 numbers). Arms are [upper, fore] in radians from the facing direction (+ = down).
  const P = [
    ['P01 neutral stand', { face: N }],
    ['P02 curious lean', { face: face('E7'), bend: 0.14, headYaw: 55, headTilt: 0.18, arms: { near: [0.4, -0.2] }, tail: { up: 0.25 } }],
    ['P03 excited', { face: { ...face('E2'), mouth: 'M4', open: 0.6 }, squash: -0.06, bend: -0.04, heels: [6, 0], headTilt: -0.1, arms: { near: [-0.35, -0.1], far: [-0.5, -0.25] }, tail: { points: [[-30, -40], [-50, -70], [-60, -105], [-66, -140], [-70, -170]], wagArcs: true } }],
    ['P04 sad slump', { contactLbl: true, face: face('E10'), headTilt: 0.35, bend: 0.12, squash: 0.05, neckDrop: 4, tail: { up: -0.55, straight: true }, arms: { near: [1.35, 1.5], far: [1.35, 1.5] } }],
    ['P05 scared crouch', { contactLbl: true, face: face('E13'), squash: 0.15, bend: -0.15, neckDrop: 8, arms: { near: [0.0, -0.9], far: [0.0, -0.9] }, tail: { wrap: 1 } }],
    ['P06 proud', { contactLbl: true, face: face('E19'), bend: -0.14, headTilt: -0.25, belly: 8, stance: 6, arms: { near: [1.85, 2.1], far: [1.85, 2.1] }, tail: { up: 0.35, straight: true } }],
    ['P07 hop wind-up', { contactLbl: true, face: { ...N, browLift: 0.3 }, squash: 0.18, bend: 0.12, headTilt: 0.15, tail: { up: -0.25 }, arms: { near: [2.3, 2.7], far: [2.3, 2.7] } }],
    ['P08 hop air', { face: face('E2'), squash: -0.10, air: 34, tuck: 10, arms: { near: [-0.35, -0.1], far: [-0.5, -0.25] }, tail: { up: -0.3 } }],
    ['P09 land', { face: { ...N, closed: 'squeeze', mouth: 'M0' }, squash: 0.18, arms: { near: [0.8, 0.6], far: [0.8, 0.6] }, tail: { up: 0.2 } }],
    ['P10 sit', { face: face('E1'), sit: 1, arms: { near: [1.1, 0.5], far: [1.1, 0.6] } }],
    ['P11 sleep curl', { face: { ...N, blush: 0.3 }, curl: true }],
    ['P12 peek', { face: { ...N, browLift: 0.5, lidUp: 1.1, pupil: 0.62, look: [0.6, 0], mouth: 'M0' }, peek: true }],
    ['P13 reach up', { face: { ...face('E6'), look: [0, -1] }, yaw: 0, squash: -0.08, headTilt: -0.15, arms: { near: [-0.5, -0.95], far: [-0.5, -0.95] } }],
    ['P14 balance', { face: { ...N, browTilt: 0.4, lidUp: 1.05, mouth: 'M8', open: 0.05, wobble: 0.4 }, bend: -0.12, stance: 16, heels: [0, 8], arms: { near: [-0.05, -0.05], far: [Math.PI + 0.25, Math.PI + 0.25] }, tail: { up: 0.35 } }],
    ['P15 hug-self (cold)', { contactLbl: true, face: face('E22'), squash: 0.06, headTilt: 0.1, shiverTicks: true, arms: { near: [1.4, -1.9], far: [1.3, -0.4] }, tail: { wrap: 1 } }],
    ['P16 look up (wonder)', { face: { ...face('E6'), mouth: 'M6', open: 0.5 }, headTilt: -0.45, bend: -0.12, arms: { near: [-0.3, -0.35], far: [-0.3, -0.35] }, tail: { up: -0.15 } }],
    ['P17 shake-dry key', { face: { ...N, closed: 'squeeze', mouth: 'M14', open: 0.1 }, headYaw: 85, bend: 0.12, arms: { near: [0.9, 1.6], far: [0.9, 1.6] }, tail: { points: [[-30, -40], [-62, -22], [-94, -20], [-118, -28], [-132, -40]] }, droplets: true }],
    ['P18 wave', { face: face('E2'), yaw: 0, headTilt: 0.1, arms: { near: [-0.45, -1.0], far: [1.28, 1.0] }, t: 0.25 }],
    ['P19 hand to mouth', { face: face('E4'), headTilt: 0.2, headYaw: 55, handFront: true, arms: { near: [-0.6, -0.55] }, tail: { up: 0.2 } }],
    ['P20 cute roar', { face: { ...face('E24'), open: 0.9 }, bend: 0.10, stance: 14, spread: true, arms: { near: [-0.35, -0.1], far: [-0.5, -0.25] }, tail: { straight: true } }],
  ];
  window.REX_POSES = P;
  function drawPose(i, cx, gy, s, named) {
    const ctx = A.ctx(), [n, pose] = P[i], sil = MODE() === 'silhouette';
    ctx.save(); if (sil) ctx.filter = 'brightness(0)';
    if (pose.peek) {   // only the head above the eyes and two hands over the edge of a rock
      const edge = gy - 50 * s;
      ctx.save(); ctx.beginPath(); ctx.rect(cx - 200 * s, gy - 330 * s, 400 * s, 330 * s); ctx.clip();
      A.rex2(cx - 10 * s, edge + 156 * s, s, { face: pose.face, shadow: false });
      ctx.restore();
      ctx.filter = 'none';
      const rock = [[cx - 150 * s, gy], [cx - 140 * s, edge + 6 * s], [cx - 60 * s, edge - 4 * s], [cx + 60 * s, edge - 2 * s], [cx + 140 * s, edge + 8 * s], [cx + 150 * s, gy]];
      A.fill(rock, A.PAL.rock, { alpha: 1, seed: 7 }); A.line(rock, { w: 2.4, seed: 8 });
      if (sil) ctx.filter = 'brightness(0)';
      for (const hx of [cx + 4 * s, cx + 40 * s]) { const H = A.ellipsePts(hx, edge - 2 * s, 8 * s, 6.5 * s, 16); A.fill(H, A.REX2.rex, { alpha: 1, jit: 0, seed: 9 }); A.line(H, { closed: true, w: 2, seed: 10, passes: 1 });
        for (const o of [-3, 3]) A.fill(A.ellipsePts(hx + o * s, edge - 8 * s, 1.6 * s, 2 * s, 8), A.REX2.claw, { alpha: 1, jit: 0 }); }
    } else {
      A.rex2(cx, gy, s, { t: 0.1, ...pose });
      if (pose.droplets) for (let k = 0; k < 10; k++) {   // shake-dry: a ring of drops flying off along tangents
        const a = k / 10 * Math.PI * 2, R = k % 2 ? 120 : 100, ox = k < 7 ? 20 : -90, oy = k < 7 ? -165 : -40;
        const D = A.ellipsePts(cx + (ox + Math.cos(a) * R) * s, gy + (oy + Math.sin(a) * R * 0.8) * s, (3 + k % 3) * s, (4 + k % 3) * s, 10, a);
        A.fill(D, '#a9d6f5', { alpha: 1, jit: 0, seed: 200 + k }); A.line(D, { closed: true, w: 1.2, passes: 1, seed: 210 + k });
      }
    }
    ctx.restore();
    if (named) label(n, cx, gy + 38, 22);
    if (named && MODE() === 'guides') { const st = A.rex2.stats || {}, ctx2 = A.ctx();
      ctx2.save(); ctx2.fillStyle = 'rgba(244,241,234,0.92)'; ctx2.fillRect(cx - 170, gy + 14, 340, 70); ctx2.restore(); label(n, cx, gy + 38, 22);
      label(`handClear ${pose.peek || pose.curl ? 'contact' : pose.contactLbl ? 'contact/behind' : st.handClear}`, cx, gy + 58, 19);
      label(`tailTipY ${pose.peek ? '—' : st.tailTipY ?? '—'}`, cx, gy + 78, 19); }
  }
  const grid = (order, named) => ({ ...base, draw() {
    const ctx = A.ctx(); ctx.save(); ctx.strokeStyle = 'rgba(42,39,36,0.35)'; ctx.lineWidth = 1.5;
    for (let r = 0; r < 4; r++) { ctx.beginPath(); ctx.moveTo(20, 232 + r * 270); ctx.lineTo(1900, 232 + r * 270); ctx.stroke(); }
    ctx.restore();
    order.forEach((pi, k) => { const col = k % 5, row = Math.floor(k / 5); drawPose(pi, 192 + col * 384, 232 + row * 270, 0.8, named); });
    if (!named) order.forEach((pi, k) => label(String.fromCharCode(65 + k), 60 + (k % 5) * 384, 60 + Math.floor(k / 5) * 270, 30));
  } });
  F.episode('r5pair', { ...base, draw() {   // C4: P01 neutral vs P16 look up
    const c = A.ctx(); c.save(); c.strokeStyle = 'rgba(42,39,36,0.4)'; c.lineWidth = 2; c.beginPath(); c.moveTo(60, 860); c.lineTo(1860, 860); c.stroke(); c.restore();
    [[0, 560], [15, 1360]].forEach(([pi, x]) => { drawPose(pi, x, 860, 1.6, false); label(P[pi][0] + (MODE() === 'guides' ? `   handClear ${(A.rex2.stats || {}).handClear}` : ''), x, 930, 30); });
  } });
  F.episode('r4poses', grid([...Array(20).keys()], true));
  F.episode('r4shuffled', grid([9, 16, 0, 19, 5, 12, 2, 14, 7, 3, 17, 11, 8, 1, 18, 6, 15, 10, 4, 13], false));
})();
