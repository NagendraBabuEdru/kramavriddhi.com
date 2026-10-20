// Rex v3b: after the owner's pencil reference ("REX ADVENTURES Episode 0" sketch), second pass.
// ¾-front view like the reference: body facing us with a wide ribbed belly, both legs in front with big clawed feet,
// head turned ¾ to the right (round cranium, long ROUNDED snout, one big bright eye under a bold brow, nostrils on top),
// a big U grin curling up into the cheek with little teeth and a tongue, rounded bump-spikes from the crown down the back
// and tail, blotchy spots, scale texture and soft pencil hatching.
// A.rex3(x, y, s, pose): foot point (x, y), about 285 units tall at s = 1.
(function () {
  const A = window.ART;
  const rot = (p, c, a) => { const dx = p[0] - c[0], dy = p[1] - c[1], co = Math.cos(a), si = Math.sin(a); return [c[0] + dx * co - dy * si, c[1] + dx * si + dy * co]; };
  const lerp = (a, b, u) => a + (b - a) * u;
  const ell = (x, y, rx, ry, n = 24, r = 0) => A.ellipsePts(x, y, rx, ry, n, r);
  const P = () => A.REX2;
  const O = { alpha: 1 };
  const pen = (pts, o = {}) => A.line(pts, { w: 2.3, dark: 0.82, jit: 1.8, passes: 3, ...o });
  function skin(pts, col, seed, o = {}) {
    A.shape(pts, col, { ...O, seed, gap: o.gap || 5, hdark: o.hdark ?? 0.24, deep: o.deep ?? true, line: false, hangle: o.hangle });
    if (o.line !== false) pen(o.outline || pts, { closed: !o.outline, seed, w: o.w || 2.4 });
  }
  function texture(pts, seed, n, scale = 1) {
    const ctx = A.ctx(); ctx.save(); A.trace(pts, true, 0, 1, 0); ctx.clip();
    const xs = pts.map(q => q[0]), ys = pts.map(q => q[1]), x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
    for (let i = 0; i < n; i++) { const x = lerp(x0, x1, A.rnd(seed, i)), y = lerp(y0, y1, A.rnd(seed + 1, i)), r = (2 + A.rnd(seed + 2, i) * 2.5) * scale;
      A.line([[x - r, y], [x - r * 0.4, y + r * 0.7], [x + r * 0.4, y + r * 0.7], [x + r, y]], { w: 1, dark: 0.28, jit: 0.4, passes: 1, seed: seed + i }); }
    ctx.restore();
  }
  function blotches(list, seed) { for (const [x, y, r] of list) { const b = A.blobPts(x, y, a => [r * (1 + 0.25 * Math.sin(a * 3 + x)), r * 0.8 * (1 + 0.2 * Math.cos(a * 2 + y))], 14);
    A.fill(b, P().spot, { ...O, seed: seed + x, jit: 0.8 }); A.line(b, { closed: true, w: 1, dark: 0.35, jit: 0.6, passes: 1, seed: seed + y }); } }
  function bumps(path, sizes, c, seed) {   // rounded bump-spikes standing out of a path, pointing away from centre c
    for (let i = 0; i < sizes.length; i++) {
      const u = sizes.length > 1 ? i / (sizes.length - 1) : 0, k = Math.min(path.length - 2, Math.floor(u * (path.length - 1))), f = u * (path.length - 1) - k;
      const p = [lerp(path[k][0], path[k + 1][0], f), lerp(path[k][1], path[k + 1][1], f)];
      let nx = p[0] - c[0], ny = p[1] - c[1]; const n = Math.hypot(nx, ny) || 1; nx /= n; ny /= n;
      const r = sizes[i], a0 = Math.atan2(ny, nx);
      const b = [...Array(9).keys()].map(j => { const a = a0 - 1.45 + j / 8 * 2.9, rr = j === 4 ? r * 1.25 : r; return [p[0] + Math.cos(a) * rr, p[1] + Math.sin(a) * rr]; });
      A.fill(b, P().shade, { ...O, seed: seed + i, jit: 0.6 }); pen(b, { seed: seed + i, w: 1.9, passes: 2 });
    }
  }
  function tube(pts, th, capR) {
    const up = [], dn = [];
    for (let i = 0; i < pts.length; i++) {
      const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)];
      let nx = -(b[1] - a[1]), ny = b[0] - a[0]; const n = Math.hypot(nx, ny) || 1; nx /= n; ny /= n;
      up.push([pts[i][0] + nx * th[i] / 2, pts[i][1] + ny * th[i] / 2]); dn.push([pts[i][0] - nx * th[i] / 2, pts[i][1] - ny * th[i] / 2]);
    }
    const tip = pts[pts.length - 1], pr = pts[pts.length - 2], a0 = Math.atan2(tip[1] - pr[1], tip[0] - pr[0]), cap = [];
    for (let k = 1; k < 6; k++) { const a = a0 + Math.PI / 2 - k / 6 * Math.PI; cap.push([tip[0] + Math.cos(a) * capR, tip[1] + Math.sin(a) * capR]); }
    return { poly: [...up, ...cap, ...dn.slice().reverse()], up, dn };
  }
  function claws(base, dir, n, len, seed, spread = 0.35) {   // big rounded toe claws pointing along dir
    for (let i = 0; i < n; i++) { const a = dir + (i - (n - 1) / 2) * spread, w = len * 0.55, off = (i - (n - 1) / 2) * w * 2.1, b = [base[0] + Math.cos(dir + 1.57) * off, base[1] + Math.sin(dir + 1.57) * off];
      const c = [[b[0] + Math.cos(a + 1.57) * w, b[1] + Math.sin(a + 1.57) * w], [b[0] + Math.cos(a) * len * 0.7 + Math.cos(a + 1.57) * w * 0.6, b[1] + Math.sin(a) * len * 0.7 + Math.sin(a + 1.57) * w * 0.6],
        [b[0] + Math.cos(a) * len, b[1] + Math.sin(a) * len], [b[0] + Math.cos(a) * len * 0.7 - Math.cos(a + 1.57) * w * 0.6, b[1] + Math.sin(a) * len * 0.7 - Math.sin(a + 1.57) * w * 0.6], [b[0] - Math.cos(a + 1.57) * w, b[1] - Math.sin(a + 1.57) * w]];
      A.fill(c, P().claw, { ...O, seed: seed + i, jit: 0 }); A.line(c, { closed: true, w: 1.6, dark: 0.8, jit: 0.3, passes: 1, seed: seed + i }); }
  }

  A.rex3 = (x, y, s, pose = {}) => {
    const ctx = A.ctx(), C = P();
    const p = { mouth: 'grin', open: null, eye: {}, brow: 0, headTilt: 0, bend: 0, squash: 0, arms: {}, legs: {}, tail: {}, hat: false, blush: 0, flip: false, t: 0, ...pose };
    const q = Math.max(-0.3, Math.min(0.3, p.squash));
    ctx.save(); ctx.translate(x, y);
    A.fill(ell(0, 2, 92, 10, 24), '#3a3328', { alpha: 0.18, jit: 0 });
    ctx.scale(s * (p.flip ? -1 : 1), s); ctx.scale(1 / (1 - q), 1 - q);
    const ln = p.legs.near || {}, lf = p.legs.far || {}, tu = p.tail.up || 0;

    // ---- tail: from behind the left hip, out to the left and curling UP
    const tc = [[-22, -60], [-74, -66], [-110, -88 - tu * 6], [-128, -124 - tu * 16], [-122, -162 - tu * 22], [-104, -184 - tu * 24]];
    const T = tube(tc, [72, 50, 36, 25, 16, 10], 5);
    bumps(T.up.slice(1), [12, 11, 10, 8, 6], [-70, -120], 300);
    skin(T.poly, C.rex, 11, { hangle: -0.6 });
    blotches([[-70, -70, 6], [-98, -84, 5.5], [-116, -112, 5], [-118, -146, 4]], 31);
    texture(T.poly, 12, 18, 0.9);

    // ---- far leg (screen left, behind): thigh + foot, heel lifted when stepping
    ctx.save(); ctx.translate(lf.dx || 0, -(lf.lift || 0));
    skin(ell(-30, -50, 30, 36, 26), C.shade, 21);
    ctx.save(); ctx.translate(-34, -8); ctx.rotate(-(lf.rot || 0));
    skin(ell(0, 0, 28, 12, 22), C.shade, 22, { deep: false });
    claws([12, 2], 1.25, 3, 8, 23, 0.12);
    ctx.restore(); ctx.restore();

    // ---- body: an upright pear facing us
    ctx.save(); ctx.translate(0, -40); ctx.rotate(p.bend); ctx.translate(0, 40);
    const body = A.blobPts(2, -100, a => { const lower = Math.sin(a) > 0; return [lower ? 60 : 46, 74]; }, 40);
    bumps([[-30, -166], [-44, -140], [-54, -112], [-60, -84]], [12, 13, 12, 11], [10, -100], 200);
    skin(body, C.rex, 41, { hangle: -0.75 });
    const belly = ell(14, -92, 32, 60, 30);
    ctx.save(); A.trace(body, true, 0, 1, 0); ctx.clip();
    A.fill(belly, C.belly, { ...O, seed: 42 });
    for (let k = 0; k < 7; k++) { const yy = -140 + k * 15, hw = Math.sqrt(Math.max(0, 1 - Math.pow((yy + 92) / 60, 2))) * 32 - 3; A.line([[14 - hw, yy - 1], [14, yy + 3], [14 + hw, yy - 1]], { w: 1.2, dark: 0.4, jit: 0.8, passes: 2, seed: 43 + k }); }
    blotches([[-30, -130, 6], [-38, -100, 5.5], [-34, -72, 6.5], [-16, -150, 5], [-44, -58, 4.5], [46, -120, 4], [48, -70, 4.5]], 51);
    ctx.restore();
    texture(body, 44, 26);
    pen(belly.slice(20).concat(belly.slice(0, 11)), { w: 1.6, dark: 0.55, seed: 45, passes: 2 });
    ctx.restore();

    // ---- near leg (screen right, in front): a chunky thigh and a big foot, claws toward us
    ctx.save(); ctx.translate(ln.dx || 0, -(ln.lift || 0));
    skin(ell(30, -46, 36, 40, 28), C.rex, 51);
    blotches([[22, -60, 5], [42, -40, 4]], 52); texture(ell(30, -46, 36, 40, 28), 53, 10);
    ctx.save(); ctx.translate(38, -8); ctx.rotate(-(ln.rot || 0));
    skin(A.blobPts(0, 0, a => [34, Math.sin(a) < 0 ? 15 : 10], 24), C.rex, 54, { deep: false });
    claws([16, 1], 1.25, 3, 9, 55, 0.12);
    ctx.restore(); ctx.restore();

    ctx.save(); ctx.translate(0, -40); ctx.rotate(p.bend); ctx.translate(0, 40);
    const arm = (sh, a, k, col, seed) => {
      const up = a[0], fo = a[1], e = [sh[0] + Math.cos(up) * 18 * k, sh[1] + Math.sin(up) * 18 * k], w = [e[0] + Math.cos(fo) * 14 * k, e[1] + Math.sin(fo) * 14 * k];
      skin(tube([sh, e, w], [14 * k, 11 * k, 10 * k], 5 * k).poly, col, seed, { deep: false, w: 2 });
      claws([w[0] + Math.cos(fo) * 3 * k, w[1] + Math.sin(fo) * 3 * k], fo, 3, 6 * k, seed + 5, 0.45);
    };
    arm([-10, -138], p.arms.far || [0.2, -0.9], 0.85, C.shade, 61);
    // ---- head: ¾ to the right; neck pivot (6,-162)
    ctx.save(); ctx.translate(6, -162); ctx.rotate(p.headTilt - p.bend * 0.5); ctx.translate(-6, 162);
    const UP = [[-44, -176], [-60, -208], [-56, -246], [-32, -270], [2, -280], [36, -272], [58, -258], [82, -256], [104, -250], [119, -238], [124, -222], [120, -208], [110, -201],
      [92, -199], [72, -197], [52, -195], [36, -196], [30, -180], [12, -166], [-18, -162]];
    bumps([[4, -280], [-26, -272], [-50, -252], [-60, -222], [-56, -192]], [12, 14, 14, 13, 12], [10, -222], 100);
    skin(UP, C.rex, 61, { outline: UP.slice(0, 14), hangle: -0.7, deep: false });
    ctx.save(); A.trace(UP, true, 0, 1, 0); ctx.clip();
    A.fill(ell(66, -228, 58, 28, 28), C.face, { alpha: 0.55, jit: 0 });
    blotches([[-24, -246, 7], [-42, -222, 6], [-4, -264, 5.5], [-30, -196, 5.5], [-46, -194, 4], [86, -246, 3.5], [98, -238, 3], [74, -244, 3]], 71);
    ctx.restore();
    texture(UP, 62, 22, 0.9);
    A.fill(ell(103, -248, 3.8, 2.4, 10, -0.4), C.pupil, { alpha: 0.85, jit: 0 }); A.fill(ell(114, -242, 3.3, 2.2, 10, -0.4), C.pupil, { alpha: 0.85, jit: 0 });
    // the lower jaw: a deep rounded U that hangs open for the grin
    const mouth = p.mouth, open = p.open ?? (mouth === 'grin' ? 0.75 : mouth === 'o' ? 0.4 : 0), ang = open * 0.85, H = [34, -194];
    const LIP = [[36, -196], [52, -196], [72, -198], [92, -200], [108, -202]];
    const JAWC = [[114, -196], [112, -180], [100, -166], [78, -158], [52, -158], [32, -166], [30, -182]];
    const J = q2 => rot(q2, H, ang);
    const jaw = [...LIP.map(J), ...JAWC.map(J)];
    if (open > 0.02) {
      const inner = [...LIP.slice().reverse(), ...LIP.map(J)];
      A.fill(inner, C.mouth, { ...O, seed: 70, jit: 0 }); A.fill(inner, '#2a1a18', { alpha: A.isColor() ? 0.12 : 0.4, jit: 0 });
      ctx.save(); A.trace(inner, true, 0, 1, 0); ctx.clip();
      A.fill(ell(...J([78, -190]), 28, 7 + open * 12, 20), C.tongue, { ...O, jit: 0 });
      if (mouth === 'grin') {
        for (let tx = 50; tx <= 104; tx += 9) { const ty = -197 - (tx - 50) * 0.1; const t = [[tx - 3.6, ty - 1], [tx + 3.6, ty - 1], [tx + 0.5, ty + 7]]; A.fill(t, C.claw, { ...O, jit: 0 }); A.line(t, { closed: true, w: 1, dark: 0.6, passes: 1, jit: 0.3 }); }
        for (let tx = 56; tx <= 100; tx += 10) { const b = J([tx, -198 - (tx - 50) * 0.08]); const t = [[b[0] - 3.2, b[1] + 1], [b[0] + 3.2, b[1] + 1], [b[0], b[1] - 6]]; A.fill(t, C.claw, { ...O, jit: 0 }); A.line(t, { closed: true, w: 1, dark: 0.6, passes: 1, jit: 0.3 }); }
      }
      ctx.restore();
    }
    skin(jaw, C.rex, 72, { outline: jaw.slice(0, LIP.length + 5), deep: false, hangle: -0.6 });
    ctx.save(); A.trace(jaw, true, 0, 1, 0); ctx.clip(); A.fill(ell(...J([80, -180]), 40, 14, 20), C.face, { alpha: 0.45, jit: 0 }); ctx.restore();
    if (open <= 0.02) {
      const sm = mouth === 'smile' ? 1 : mouth === 'sad' ? -1 : 0;
      pen([[36 - 6 * sm, -196 - 9 * sm], [40, -196 + (sm < 0 ? 4 : 0)], [56, -197], [80, -199], [108, -202]], { w: 2.4, seed: 73, passes: 2 });
    } else pen([[36, -194], [29, -204], [28, -213]], { w: 2.4, seed: 73, passes: 2 });   // grin corner curling up into the cheek
    if (p.blush) A.fill(ell(14, -198, 13, 7, 16), C.blush, { alpha: 0.55 * p.blush, jit: 0 });
    // the big eye under a bold brow
    const e = p.eye || {}, lid = e.lid ?? 1, lk = e.look || [0.4, -0.1], EX = 24, EY = -236;
    if (e.closed === 'happy') pen([[EX - 16, EY + 5], [EX - 8, EY - 7], [EX + 7, EY - 9], [EX + 17, EY + 2]], { w: 3.2, seed: 80 });
    else if (e.closed === 'down' || lid < 0.08) pen([[EX - 16, EY - 2], [EX, EY + 8], [EX + 16, EY - 2]], { w: 3.2, seed: 80 });
    else {
      const E = ell(EX, EY, 20, 23, 30);
      A.fill(E, C.eyeW, { ...O, jit: 0 });
      ctx.save(); A.trace(E, true, 0, 1, 0); ctx.clip();
      const px = EX + lk[0] * 7, py = EY + lk[1] * 7;
      A.fill(ell(px, py, 13, 14.5, 22), C.pupil, { ...O, jit: 0 });
      A.fill(ell(px - 4.5, py - 5.5, 5, 5, 12), C.eyeW, { ...O, jit: 0 }); A.fill(ell(px + 4.5, py + 4.5, 2, 2, 8), C.eyeW, { ...O, jit: 0 });
      if (lid < 1) A.fill([[EX - 26, EY - 32], [EX + 26, EY - 32], [EX + 26, EY - 23 + (1 - lid) * 46], [EX - 26, EY - 23 + (1 - lid) * 46]], C.rex, { ...O, jit: 0 });
      ctx.restore();
      pen(E, { closed: true, w: 2.6, seed: 81, passes: 2 });
      if (lid < 1) pen([[EX - 20, EY - 23 + (1 - lid) * 46], [EX + 20, EY - 23 + (1 - lid) * 46]], { w: 2.4, seed: 82, passes: 2 });
    }
    const bt = p.brow;
    pen([[EX - 24, EY - 26 - bt * 2 + (bt < 0 ? -bt * 6 : 0)], [EX - 8, EY - 37 - bt * 4], [EX + 8, EY - 38 - bt * 4 + (bt < 0 ? bt * 4 : 0)], [EX + 24, EY - 31 - bt * 3 + (bt < 0 ? bt * 8 : 0)]], { w: 4.2, seed: 83 });
    if (p.hat) { ctx.save(); ctx.translate(-8, -282); ctx.rotate(-0.3); ctx.scale(1.15, 1.15);
      const cap = [[-30, 8], [-26, -16], [-14, -28], [0, -32], [14, -28], [26, -16], [30, 8], [20, 0], [12, 9], [2, -1], [-8, 9], [-18, 0]];
      skin(cap, C.hat, 90, { deep: false }); A.fill(ell(-8, -16, 3.5, 2.5, 10), C.hatSpot, { ...O, jit: 0 }); A.fill(ell(8, -12, 3, 2.2, 10), C.hatSpot, { ...O, jit: 0 }); ctx.restore(); }
    ctx.restore();   // head
    arm([30, -136], p.arms.near || [0.1, -0.9], 1, C.rex, 65);
    ctx.restore();
    ctx.restore();
  };
})();
