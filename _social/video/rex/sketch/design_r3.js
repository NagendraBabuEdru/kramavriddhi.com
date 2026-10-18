// Round 3 design sheets: mouth chart, 24 expressions (heads + bodies), front-view faces, face-kit min / mid / max.
(function () {
  const A = window.ART, F = window.FILM;
  const MODE = () => new URLSearchParams(location.search).get('mode') || 'normal';
  const base = { duration: 1, camera: [[0, 960, 540, 1]], wind: () => 0 };
  function label(txt, x, y, size = 26, col = '#3a3530') { const ctx = A.ctx(); ctx.save(); ctx.font = `${size}px 'Patrick Hand'`; ctx.fillStyle = col; ctx.textAlign = 'center'; ctx.fillText(txt, x, y); ctx.restore(); }
  function rex(x, y, s, pose) { const ctx = A.ctx(); ctx.save(); if (MODE() === 'silhouette') ctx.filter = 'brightness(0)'; A.rex2(x, y, s, pose); ctx.restore(); }
  // a Rex framed so its head centre lands at (cx, cy), clipped to a window
  function headCell(cx, cy, w, h, s, pose, name) {
    const ctx = A.ctx(); ctx.save(); ctx.beginPath(); ctx.rect(cx - w / 2, cy - h / 2, w, h - 30); ctx.clip();
    const yaw = pose.yaw ?? 45, hcx = yaw < 22.5 ? 0 : 18;
    rex(cx - hcx * s, cy + 166 * s, s, { shadow: false, ...pose });
    ctx.restore(); if (name) label(name, cx, cy + h / 2 - 6, Math.round(Math.min(26, 14 + s * 6)));
  }
  // §5.1 expressions (Bible v1.3 numbers) with the head / body cue that shows in a head-and-shoulders crop
  const E = {
    E1: ['neutral', { browCurve: 0.3, lidUp: 1, lidLo: 0, pupil: 0.58, look: [0.15, 0], mouth: 'M1', corners: 0.3 }, {}],
    E2: ['happy', { browLift: 0.3, browTilt: -0.1, browCurve: 0.5, lidUp: 1, lidLo: 0.3, pupil: 0.6, mouth: 'M2', open: 0.35, corners: 0.8, cheek: 0.5, blush: 0.3 }, { headTilt: -0.05, tail: { wag: 1, phase: 1 } }],
    E3: ['big laugh', { browLift: 0.6, browCurve: 0.6, closed: 'happy', mouth: 'M4', open: 0.9, corners: 1, tongue: 0.6, teeth: 1, cheek: 1, blush: 0.6 }, { headTilt: -0.2, squash: 0.05, arms: { near: [1.6, 2.6], far: [1.6, 2.6] } }],
    E4: ['giggle', { browLift: 0.2, browTilt: 0.3, browCurve: 0.4, closed: 'happy', mouth: 'M2', open: 0.25, corners: 1, side: 0.2, cheek: 0.8, blush: 0.8 }, { headTilt: 0.15, arms: { near: [0.2, -1.2] } }],
    E5: ['surprised', { browLift: 1, browCurve: 0.8, lidUp: 1.15, lidLo: 0, pupil: 0.45, mouth: 'M5', open: 0.4 }, { headTilt: -0.1 }],
    E6: ['wonder', { browLift: 0.8, browTilt: 0.2, browCurve: 0.6, lidUp: 1.1, lidLo: 0.15, pupil: 0.7, sparkle: 2, look: [0.1, -0.8], mouth: 'M6', open: 0.55, corners: 0.3, blush: 0.3 }, { headTilt: -0.15, arms: { near: [0.4, -0.3] } }],
    E7: ['curious', { browLift: [0.9, -0.1], browCurve: [0.6, 0.3], lidUp: 1, lidLo: 0.1, pupil: 0.6, look: [1, 0.2], mouth: 'M0', side: 0.3, width: 0.8, flare: 0.3 }, { headTilt: 0.18, lean: 0.08 }],
    E8: ['confused', { browLift: [0.8, -0.4], browTilt: [0.4, -0.3], lidUp: [1, 0.85], pupil: 0.55, look: [0.5, -0.6], mouth: 'M8', open: 0.05, corners: -0.2, wobble: 0.3, side: -0.3 }, { headTilt: 0.25, arms: { near: [0.6, -1.5] } }],
    E9: ['shy', { browLift: 0.2, browTilt: 0.6, browCurve: 0.3, lidUp: 0.75, lidLo: 0.3, pupil: 0.6, look: [-0.5, 0.6], mouth: 'M1', corners: 0.4, width: 0.7, blush: 1 }, { headTilt: 0.15, arms: { near: [1.2, 0.2], far: [1.2, 0.3] } }],
    E10: ['sad', { browLift: -0.2, browTilt: 1, browCurve: 0, lidUp: 0.8, lidLo: 0, pupil: 0.62, look: [0, 0.5], wet: 0.3, mouth: 'M7', corners: -1 }, { headTilt: 0.2, tail: { lift: -1.2 }, arms: { near: [1.45, 1.55], far: [1.45, 1.55] } }],
    E11: ['about to cry', { browLift: -0.1, browTilt: 1, lidUp: 0.85, lidLo: 0.35, pupil: 0.66, wet: 1, mouth: 'M8', open: 0.1, corners: -0.8, wobble: 0.8, blush: 0.3, flare: 0.5 }, { headTilt: 0.1 }],
    E12: ['crying / wail', { browLift: -0.3, browTilt: 1, closed: 'squeeze', mouth: 'M9', open: 0.9, corners: -1, tears: 1, stream: 1 }, { headTilt: -0.15, arms: { near: [0.6, 0.9], far: [0.6, 0.9] }, tail: { lift: -0.8 } }],
    E13: ['scared', { browLift: 0.8, browTilt: 1, lidUp: 1.1, lidLo: 0, pupil: 0.32, look: [1, 0], mouth: 'M8', open: 0.12, corners: -0.6, wobble: 0.4, sweat: 1 }, { squash: 0.1, lean: -0.1, arms: { near: [1.3, -0.6], far: [1.3, -0.6] }, tail: { lift: -1.5 } }],
    E14: ['startled', { browLift: 1, lidUp: 1.15, lidLo: 0, pupil: 0.3, mouth: 'M6', open: 0.6 }, { squash: -0.06, headTilt: -0.05 }],
    E15: ['sleepy', { browLift: -0.2, browTilt: 0.2, browCurve: 0, lidUp: 0.4, lidLo: 0.1, pupil: 0.55, look: [0, 0.6], mouth: 'M0', corners: 0.1 }, { headTilt: 0.12 }],
    E16: ['yawn', { browLift: 0.4, browTilt: 0.3, closed: 'squeeze', mouth: 'M10', open: 1, tears: 0.3 }, { headTilt: -0.25 }],
    E17: ['sneeze (wind-up)', { browLift: 0.8, browTilt: 0.3, lidUp: 0.2, cross: 0.6, mouth: 'M12', wrinkle: 1, flare: 1 }, { headTilt: -0.12 }],
    E18: ['determined', { browLift: -0.4, browTilt: -0.5, browCurve: 0, lidUp: 0.85, lidLo: 0.2, pupil: 0.6, look: [1, 0], mouth: 'M0', corners: 0.2, width: 0.8 }, { lean: 0.06 }],
    E19: ['proud', { browLift: 0.5, browTilt: -0.1, browCurve: 0.5, closed: 'happy', mouth: 'M1', corners: 1, side: 0.2, cheek: 0.4, blush: 0.3 }, { headTilt: -0.15 }],
    E20: ['yuck', { browLift: [-0.4, 0.2], browTilt: [-0.3, 0], lidUp: 0.7, lidLo: 0.4, pupil: 0.5, look: [-1, 0], mouth: 'M11', open: 0.3, corners: -0.6, side: -0.3, wrinkle: 1 }, { headTilt: -0.1, lean: -0.05 }],
    E21: ['mischievous', { browLift: [0.5, -0.3], browTilt: [0, -0.4], browCurve: [0.2, 0.3], lidUp: 0.7, lidLo: 0.3, pupil: 0.55, look: [0.8, 0], mouth: 'M13', corners: 0.8, side: 0.5, blush: 0.2 }, {}],
    E22: ['cold', { browLift: -0.1, browTilt: 0.6, lidUp: 0.8, lidLo: 0.2, pupil: 0.55, mouth: 'M14', open: 0.1, cold: 0.6, breath: 1 }, { squash: 0.06, shiverTicks: true, arms: { near: [1.3, -0.6], far: [1.3, -0.6] }, tail: { lift: -1.6 } }],
    E23: ['love', { browLift: 0.5, browTilt: 0.4, browCurve: 0.5, lidUp: 1, lidLo: 0.35, pupil: 0.72, sparkle: 2, mouth: 'M1', corners: 0.8, blush: 0.9 }, { headTilt: 0.15, arms: { near: [0.9, -1.4], far: [0.9, -1.4] } }],
    E24: ['cute roar', { browLift: -0.2, browTilt: -0.3, lidUp: 0.9, lidLo: 0.3, pupil: 0.55, mouth: 'M15', open: 0.8, corners: 0.4, teeth: 1, blush: 0.4 }, { arms: { near: [-0.6, -1.0], far: [-0.6, -1.0] }, squash: -0.06, tail: { lift: 1 } }],
  };
  window.REX_EXPR = E;
  F.episode('r3mouths', { ...base, draw() {
    const names = ['closed', 'smile', 'open smile', 'grin', 'laugh', 'small o', 'big O', 'frown', 'wobbly frown', 'wail', 'yawn', 'yuck', 'pucker', 'smirk', 'eee / chatter', 'cute roar'];
    names.forEach((n, i) => { const col = i % 6, row = Math.floor(i / 6); headCell(160 + col * 320, 185 + row * 360, 320, 360, 1.75, { face: { mouth: 'M' + i, lidUp: 1, lidLo: 0, browCurve: 0.3 } }, `M${i} ${n}`); });
  } });
  F.episode('r3heads', { ...base, draw() {
    Object.entries(E).forEach(([k, [n, f, b]], i) => { const col = i % 6, row = Math.floor(i / 6);
      headCell(160 + col * 320, 135 + row * 270, 320, 270, 1.15, { face: f, headTilt: b.headTilt || 0, t: 0.1 }, `${k} ${n}`); });
  } });
  F.episode('r3front', { ...base, draw() {
    ['E1', 'E2', 'E3', 'E10', 'E13'].forEach((k, i) => { const [n, f, b] = E[k]; headCell(192 + i * 384, 470, 384, 620, 2.2, { yaw: 0, face: f, headTilt: (b.headTilt || 0) * 0.5 }, `${k} ${n} (front)`); label(`eyeGap ${(A.rex2.stats || {}).eyeGap}`, 192 + i * 384, 820, 24, '#c62828'); });
  } });
  F.episode('r3body', { ...base, draw() {
    const ctx = A.ctx(); ctx.save(); ctx.strokeStyle = 'rgba(42,39,36,0.5)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(40, 880); ctx.lineTo(1880, 880); ctx.stroke(); ctx.restore();
    ['E2', 'E3', 'E10', 'E12', 'E13', 'E22'].forEach((k, i) => { const [n, f, b] = E[k]; rex(185 + i * 315, 880, 1.25, { face: f, ...b, t: 0.1 }); label(`${k} ${n}`, 185 + i * 315, 960, 28); });
  } });
  // face kit: each control at its minimum, middle and maximum (other controls neutral)
  const N = { browCurve: 0.3, lidUp: 1, lidLo: 0, pupil: 0.58, look: [0.15, 0], mouth: 'M1', corners: 0.3 };
  const KIT = [
    ['browLift', [-1, 0, 1]], ['browTilt', [-0.6, 0, 1]], ['browCurve', [-1, 0, 1]], ['lidUp', [0.2, 0.6, 1.15]], ['lidLo', [0, 0.25, 0.45]],
    ['closed', ['down', 'happy', 'squeeze']], ['pupil', [0.3, 0.58, 0.72]], ['look', [[-1, 0.3], [0, 0], [1, -0.8]]], ['cross', [0, 0.5, 1]], ['sparkle', [0, 1, 2]],
    ['wet', [0, 0.5, 1]], ['open (M4)', [0.1, 0.5, 1], { mouth: 'M4', closed: 'happy' }], ['corners', [-1, 0, 1]], ['width', [0.7, 1, 1.3]], ['side', [-1, 0, 1]],
    ['wobble (M8)', [0, 0.5, 1], { mouth: 'M8' }], ['teeth (M3)', [0, 1, 1], { mouth: 'M3' }], ['tongue (M2)', [0, 0.5, 1], { mouth: 'M2', open: 0.4 }], ['cheek', [0, 0.5, 1]], ['blush', [0, 0.5, 1]],
    ['flare', [0, 0.5, 1]], ['wrinkle', [0, 0.5, 1]], ['tears', [0, 0.5, 1], { browTilt: 1, lidUp: 0.8, mouth: 'M7' }], ['stream (M9)', [0, 0.5, 1], { closed: 'squeeze', mouth: 'M9' }], ['sweat', [0, 0.5, 1]],
  ];
  const kit = (from, to) => ({ ...base, draw() {
    KIT.slice(from, to).forEach(([ctl, vals, extra], i) => {
      const key = ctl.split(' ')[0], row = Math.floor(i / 3), cg = i % 3;
      vals.forEach((v, k) => { const cx = 115 + cg * 640 + k * 205, cy = 105 + row * 215;
        headCell(cx, cy, 205, 215, 0.95, { face: { ...N, ...(extra || {}), [key]: v }, t: 0.1 }, k === 1 ? ctl : (Array.isArray(v) ? `[${v}]` : `${v}`)); });
    });
  } });
  F.episode('r3b120', { ...base, draw() {   // single heads at Short size (~120 px tall)
    ['E2', 'E3', 'E10', 'E13', 'E15', 'E17', 'E22'].forEach((k, i) => { const [n, f, b] = E[k]; headCell(90 + i * 135, 470, 135, 170, 0.8, { face: f, headTilt: b.headTilt || 0, t: 0.1 }, k); });
  } });
  F.episode('r3kit1', kit(0, 15)); F.episode('r3kit2', kit(15, 25));
})();
