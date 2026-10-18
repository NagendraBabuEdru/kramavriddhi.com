// Design sheets for the Rex design expert's review rounds (sketch.html?ep=<sheet>&mode=<normal|guides|silhouette>).
(function () {
  const A = window.ART, F = window.FILM;
  const MODE = () => new URLSearchParams(location.search).get('mode') || 'normal';
  const GUIDES = [['H hat top', -248], ['T head top', -222], ['E eye line', -164], ['S chin', -112], ['B belly', -66], ['K knee', -30], ['G ground', 0]];
  function ground(y) { const ctx = A.ctx(); ctx.save(); ctx.strokeStyle = 'rgba(42,39,36,0.5)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(60, y); ctx.lineTo(1860, y); ctx.stroke(); ctx.restore(); }
  function label(txt, x, y, size = 30, col = '#3a3530', align = 'center') { const ctx = A.ctx(); ctx.save(); ctx.font = `${size}px 'Patrick Hand'`; ctx.fillStyle = col; ctx.textAlign = align; ctx.fillText(txt, x, y); ctx.restore(); }
  // draw one Rex, honouring the sheet mode (silhouette = solid black, no shadow)
  function rex(x, y, s, pose) {
    const ctx = A.ctx(), sil = MODE() === 'silhouette';
    ctx.save(); if (sil) ctx.filter = 'brightness(0)';
    A.rex2(x, y, s, sil ? { ...pose, shadow: false } : pose);
    ctx.restore();
  }
  function guides(x, y, s, x0, x1) {
    const ctx = A.ctx();
    ctx.save(); ctx.strokeStyle = 'rgba(220,40,40,0.75)'; ctx.lineWidth = 1.5; ctx.setLineDash([10, 6]);
    for (const [n, gy] of GUIDES) { ctx.beginPath(); ctx.moveTo(x0, y + gy * s); ctx.lineTo(x1, y + gy * s); ctx.stroke(); label(`${n} (${gy})`, x1 + 8, y + gy * s + 8, 24, '#c62828', 'left'); }
    ctx.restore();
    const g = A.rex2.geom(), r = v => v.toFixed(1);
    const lines = ['rig readout (code units, s = 1):', `head top ${r(g.headTop)}   chin ${r(g.chin)}   hat top ${r(g.hatTop)}`, `head height ${r(g.chin - g.headTop)} = ${r(g.headPct)} % of ${r(-g.headTop)}`,
      `near eye centre (${g.nearEye.map(r).join(', ')})   far eye (${g.farEye.map(r).join(', ')})`, `snout tip x +${r(g.snoutTip)} from HC   head width ${r(g.headWidth)}`];
    lines.forEach((t, i) => label(t, 70, 70 + i * 34, 28, '#c62828', 'left'));
  }
  const base = { duration: 1, camera: [[0, 960, 540, 1]], wind: () => 0 };
  const E1 = { face: { browCurve: 0.3, lidUp: 1, lidLo: 0, pupil: 0.58, look: [0.15, 0], mouth: 'M1', corners: 0.3 } };

  F.episode('r1model', { ...base, draw() {
    ground(900); rex(900, 900, 2.2, E1);
    if (MODE() === 'guides') guides(900, 900, 2.2, 520, 1500);
    if (MODE() !== 'guides') label('Rex v2 · ¾ front · neutral (E1)', 960, 1010, 34);
  } });
  F.episode('r1mouth', { ...base, draw() {
    ground(860);
    const set = [['M0 closed', { mouth: 'M0' }], ['M1 smile', { mouth: 'M1', corners: 0.3 }], ['M4 laugh', { mouth: 'M4', corners: 1, closed: 'happy', cheek: 1, blush: 0.6 }], ['M5 small o', { mouth: 'M5', lidUp: 1.1 }], ['M7 frown', { mouth: 'M7', browTilt: 1, lidUp: 0.85 }]];
    set.forEach(([n, f], i) => { rex(250 + i * 355, 860, 1.6, { face: { pupil: 0.58, look: [0.15, 0], ...f } }); label(n, 250 + i * 355 + 40, 960, 32); });
  } });
  const FACES = [
    ['E1 neutral', { browCurve: 0.3, lidUp: 1, lidLo: 0, pupil: 0.58, look: [0.15, 0], mouth: 'M1', corners: 0.3 }],
    ['E2 happy (M2)', { browLift: 0.3, browTilt: -0.1, browCurve: 0.5, lidUp: 1, lidLo: 0.3, pupil: 0.6, mouth: 'M2', open: 0.35, corners: 0.8, cheek: 0.5, blush: 0.3 }],
    ['E3 big laugh (M4)', { browLift: 0.6, browCurve: 0.6, closed: 'happy', mouth: 'M4', open: 0.9, corners: 1, tongue: 0.6, teeth: 1, cheek: 1, blush: 0.6 }],
    ['E10 sad (M7)', { browLift: -0.2, browTilt: 1, browCurve: 0, lidUp: 0.8, lidLo: 0, pupil: 0.62, look: [0, 0.5], wet: 0.3, mouth: 'M7', corners: -1 }],
    ['E5 surprised (M5)', { browLift: 1, browCurve: 0.8, lidUp: 1.15, lidLo: 0, pupil: 0.45, mouth: 'M5', open: 0.4 }],
    ['E4 giggle', { browLift: 0.2, browTilt: 0.3, browCurve: 0.4, closed: 'happy', mouth: 'M2', open: 0.25, corners: 1, side: 0.2, cheek: 0.8, blush: 0.8 }],
    ['E19 proud', { browLift: 0.5, browTilt: -0.1, browCurve: 0.5, closed: 'happy', mouth: 'M1', corners: 1, side: 0.2, cheek: 0.4, blush: 0.3 }],
  ];
  F.episode('r1bface', { ...base, draw() {
    const ctx = A.ctx(), s = 2.9;
    FACES.forEach(([n, f], i) => {
      const row = i < 4 ? 0 : 1, col = row ? i - 4 : i, cx = row ? 480 + col * 480 : 240 + col * 480, cy = row ? 790 : 255;
      ctx.save(); ctx.beginPath(); ctx.rect(cx - 235, cy - 240, 470, 450); ctx.clip();
      rex(cx - 18 * s, cy + 166 * s + 20, s, { face: f });
      ctx.restore(); label(n, cx, cy + 238, 28);
    });
  } });
  F.episode('r1flip', { ...base, draw() {
    ground(880);
    rex(620, 880, 2.0, { ...E1, flip: false }); rex(1320, 880, 2.0, { ...E1, flip: true });
    label('facing right', 640, 990, 32); label('facing left (light stays upper-left)', 1300, 990, 32);
    label('key light ↖', 120, 80, 32, '#a07a2a', 'left');
  } });
  // round 2: turnaround (5 views) and head-turn strip
  const VIEWS = [[0, 'front 0°', 0], [45, '¾ front 45°', 0], [90, 'side 90°', 20], [135, '¾ back 135°', 0], [180, 'back 180°', 0]];
  const BODYX = { 0: 0, 45: 0, 90: -4, 135: 0, 180: 0 };
  F.episode('r2turn', { ...base, draw() {
    const s = 1.4, G = 900; ground(G);
    if (MODE() === 'guides') { const ctx = A.ctx(); ctx.save(); ctx.strokeStyle = 'rgba(220,40,40,0.6)'; ctx.lineWidth = 1.2; ctx.setLineDash([8, 6]);
      for (const [n, gy] of GUIDES) { ctx.beginPath(); ctx.moveTo(20, G + gy * s); ctx.lineTo(1900, G + gy * s); ctx.stroke(); label(n.split(' ')[0], 30, G + gy * s - 4, 20, '#c62828', 'left'); } ctx.restore(); }
    VIEWS.forEach(([yaw, name, dx], i) => {
      const cx = 192 + i * 384 + dx;
      rex(cx - BODYX[yaw] * s, G, s, { yaw, face: { browCurve: 0.3, lidUp: 1, lidLo: 0, mouth: 'M1', corners: 0.3 } });
      label(name, cx, 980, 30);
      if (MODE() === 'guides') { const st = A.rex2.stats || {};
        [`skull ${st.skull}`, `eye ry ${st.eyeRy}`, `hat width ${st.hatW}`, `bumps ${st.bumps}  spots ${st.spots}`].forEach((t, k) => label(t, cx, 1012 + k * 20, 18, '#c62828')); }
    });
  } });
  const strip = y0 => ({ ...base, draw() {
    const s = 1.6;
    for (let i = 0; i < 9; i++) { const yaw = y0 + i * 11.25, row = i < 5 ? 0 : 1, col = row ? i - 5 : i, cx = row ? 384 + col * 384 : 192 + col * 384, cy = row ? 800 : 300;
      A.rex2.head(cx - 10, cy, s, { yaw, face: { browCurve: 0.3, lidUp: 1, lidLo: 0, mouth: 'M1', corners: 0.3 } }); label(`yaw ${yaw}°`, cx, cy + 150, 28); }
  } });
  F.episode('r2strip', strip(0)); F.episode('r2bstrip', strip(90));
})();
