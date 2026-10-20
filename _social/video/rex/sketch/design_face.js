// Face-layout comparison (owner feedback: "eyes and mouth alignment looks awkward"): A = current, B and C = tidier layouts.
(function () {
  const A = window.ART, F = window.FILM;
  const base = { duration: 1, camera: [[0, 960, 540, 1]], wind: () => 0 };
  const label = (txt, x, y, size = 26) => { const c = A.ctx(); c.save(); c.font = `${size}px 'Patrick Hand'`; c.fillStyle = '#3a3530'; c.textAlign = 'center'; c.fillText(txt, x, y); c.restore(); };
  const V = {
    A: {},
    // B: eyes a matched pair on one line, a small smile centred under the snout bridge, level brows, nostrils on the snout tip
    B: { nearEye: [-8, 0, 21, 25], farEye: [31, -1, 17, 24, 0.05], browN: [-8, -33, 30], browF: [32, -33, 24], nose1: [67, 0], nose2: [76, 2],
      mouth: { cx: 30, k: 0.6, dy: 4 }, blushN: [-24, 26], blushF: [56, 22] },
    // C: like B with the mouth a touch further forward and closer to the nose (more "snout" smile)
    C: { nearEye: [-8, 0, 21, 25], farEye: [31, -1, 17, 24, 0.05], browN: [-8, -33, 30], browF: [32, -33, 24], nose1: [68, 2], nose2: [77, 4],
      mouth: { cx: 38, k: 0.72, dy: 3 }, blushN: [-24, 26], blushF: [60, 20] },
  };
  window.REX_FACE_VARIANTS = V;
  const use = k => { A.REX_FACE = { ...JSON.parse(JSON.stringify(A.REX_FACE0)), ...V[k] }; };
  F.episode('facecmp', { ...base, draw() {
    const E = window.REX_EXPR, rows = ['E1', 'E2', 'E10'], c = A.ctx();
    ['A', 'B', 'C'].forEach((k, col) => {
      use(k);
      const cx = 330 + col * 630;
      label(k === 'A' ? 'A (now)' : k, cx, 40, 34);
      rows.forEach((e, r) => {
        const s = 1.7, cy = 190 + r * 335; c.save(); c.beginPath(); c.rect(cx - 300, cy - 150, 400, 320); c.clip();
        A.rex2(cx - 110 - 18 * s, cy + 166 * s, s, { face: E[e][1], headTilt: (E[e][2].headTilt || 0), t: 0.1, shadow: false }); c.restore();
        if (col === 0) label(`${e} ${E[e][0]}`, 70, cy + 6, 22);
      });
      // full body, small (as in a video)
      c.save(); A.rex2(cx + 215, 640, 0.75, { face: E.E1[1], t: 0.1 }); c.restore();
    });
    use('A');
  } });
})();
