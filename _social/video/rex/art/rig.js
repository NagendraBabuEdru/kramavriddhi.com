// Rex cut-out rig from the owner's artwork (rex_front.png, 1536 × 1024, front view).
// Parts: tail (3 chained segments), two shins+feet, body, two arms, head (with a stretchable lower face = jaw, two moving
// irises, and drawn eyelids). Each part is cut with a soft polygon mask; erased areas stay transparent so lower layers show.
// Physics: damped springs for the head (lags the body), the tail chain (follow-through), arms, jaw and iris look.
// API: REX.build(img) once; REX.draw(ctx, pose) where pose = {
//   x, y (canvas foot point), s (scale), lift (hop height px, image units), squash (+ = squash, − = stretch), lean (rad, about the feet),
//   head: { tilt, dx, dy }, look: [x, y] (−1…1), lid: 1 open … 0 shut, jaw: 0 (as drawn) … 1 (wide open), −0.3 (a bit closed),
//   tail: [a1, a2, a3] (segment rotations), arms: { L, R } (rad, + = down/out), legs: { L: { lift, rot }, R: { lift, rot } }, shadow }
(function () {
  const POLY = {
    head: [[700, 60], [770, 8], [832, 36], [900, 36], [962, 66], [1012, 150], [1004, 222], [1024, 282], [1038, 342], [1022, 412], [962, 452], [900, 482], [850, 502], [780, 514], [700, 502], [640, 474], [580, 444], [538, 392], [518, 320], [528, 250], [548, 200], [560, 150], [600, 100], [652, 68]],
    tail: [[422, 392], [404, 398], [386, 440], [350, 492], [334, 562], [350, 642], [396, 702], [458, 754], [520, 794], [566, 772], [598, 712], [608, 650], [600, 584], [562, 588], [520, 596], [470, 578], [432, 540], [422, 496], [428, 456], [438, 420]],
    tail3: [[415, 403], [386, 440], [350, 492], [334, 562], [444, 564], [432, 520], [420, 470], [414, 440]],
    tail2: [[334, 556], [350, 642], [396, 702], [422, 730], [494, 612], [470, 596], [448, 574], [446, 556]],
    tail1: [[416, 720], [458, 754], [520, 794], [566, 772], [598, 712], [608, 650], [598, 598], [562, 612], [520, 622], [492, 606]],
    armL: [[680, 596], [746, 590], [766, 640], [760, 714], [722, 720], [694, 696], [680, 640]],
    armR: [[846, 600], [910, 590], [946, 640], [944, 710], [904, 718], [866, 696], [846, 640]],
    legL: [[540, 826], [684, 832], [692, 905], [698, 994], [642, 1018], [560, 1020], [440, 1004], [428, 948], [480, 900], [530, 886]],
    legR: [[828, 832], [956, 826], [970, 876], [1030, 900], [1076, 930], [1090, 990], [1000, 1014], [900, 1014], [822, 994], [816, 930], [828, 880]],
  };
  const PIV = { head: [780, 512], tail1: [596, 660], tail2: [458, 668], tail3: [388, 560], armL: [722, 606], armR: [882, 606], legL: [612, 846], legR: [896, 846] };
  const EYE = [{ c: [642, 208], rx: 50, ry: 70, iris: [657, 220], r: 41 }, { c: [903, 182], rx: 50, ry: 62, iris: [890, 191], r: 41 }];
  const LIDS = [[645, 211, 54, 64], [903, 176, 52, 63]];
  const JAW_Y = 330, TAIL_ROOT = [640, 700];   // the lower face (below the upper teeth) stretches for the jaw
  const mk = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
  const poly = (c, pts) => { c.beginPath(); pts.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.closePath(); };
  let IMG = null, L = null;
  function mask(pts, blur, grow) { const m = mk(1536, 1024), c = m.getContext('2d'); c.filter = `blur(${blur}px)`; c.fillStyle = c.strokeStyle = '#000'; c.lineJoin = 'round'; c.lineWidth = grow * 2; poly(c, pts); c.fill(); if (grow) c.stroke(); return m; }
  function cut(pts, grow = 3) { const l = mk(1536, 1024), c = l.getContext('2d'); c.drawImage(IMG, 0, 0); c.globalCompositeOperation = 'destination-in'; c.drawImage(mask(pts, 2, grow), 0, 0); return l; }
  function maskTint(pts, grow, col) { const m = mk(1536, 1024), c = m.getContext('2d'); c.filter = 'blur(2px)'; c.fillStyle = c.strokeStyle = col; c.lineJoin = 'round'; c.lineWidth = grow * 2; poly(c, pts); c.fill(); c.stroke(); return m; }
  function cleanFeet(layer) {
    const c = layer.getContext('2d'), x0 = 420, y0 = 880, w = 680, h = 144, d = c.getImageData(x0, y0, w, h), px = d.data;
    const lum = i => px[i + 3] < 40 ? 255 : 0.3 * px[i] + 0.59 * px[i + 1] + 0.11 * px[i + 2];
    const seen = new Uint8Array(w * h), st = [];
    for (let x = 0; x < w; x++) for (const y of [h - 1]) st.push(y * w + x);
    for (let y = 0; y < h; y++) { st.push(y * w); st.push(y * w + w - 1); }
    for (let i = 0; i < w * h; i++) if (px[i * 4 + 3] < 40) st.push(i);
    while (st.length) { const q = st.pop(); if (seen[q]) continue; const i = q * 4; if (lum(i) < 95) continue; seen[q] = 1;
      const x = q % w, y = (q / w) | 0; if (x > 0) st.push(q - 1); if (x < w - 1) st.push(q + 1); if (y > 0) st.push(q - w); if (y < h - 1) st.push(q + w); }
    for (let q = 0; q < w * h; q++) if (seen[q]) px[q * 4 + 3] = 0;
    // remove small leftover scribble islands below the claws (keep the big foot)
    c.putImageData(d, x0, y0);
  }
  function build(img) {
    IMG = img; L = {};
    const GROW = { head: 4, tail: 9, armL: 5, armR: 5, legL: 6, legR: 6 };
    for (const k of ['tail', 'armL', 'armR', 'legL', 'legR']) L[k] = cut(POLY[k], GROW[k]);
    for (const k of ['legL', 'legR']) cleanFeet(L[k]);
    // head: cut, then lift out the irises (their place is filled with eye-white) as separate layers
    const h = cut(POLY.head, GROW.head), hc = h.getContext('2d');
    L.iris = EYE.map(e => { const l = mk(1536, 1024), c = l.getContext('2d'); c.save(); c.beginPath(); c.arc(e.iris[0], e.iris[1], e.r, 0, Math.PI * 2); c.clip(); c.drawImage(IMG, 0, 0); c.restore(); return l; });
    for (const e of EYE) { hc.save(); hc.beginPath(); hc.ellipse(e.c[0], e.c[1], e.rx - 5, e.ry - 5, 0, 0, Math.PI * 2); hc.clip(); hc.beginPath(); hc.arc(e.iris[0], e.iris[1], e.r + 1.5, 0, Math.PI * 2); hc.fillStyle = '#fdfdfb'; hc.fill(); hc.restore(); }
    L.head = h;
    // body: everything else; the ground scribbles below the feet line are removed (we draw our own shadow)
    const b = mk(1536, 1024), bc = b.getContext('2d'); bc.drawImage(IMG, 0, 0); bc.globalCompositeOperation = 'destination-out';
    for (const k of ['head', 'tail', 'armL', 'armR', 'legL', 'legR']) bc.drawImage(mask(POLY[k], 1.5, GROW[k] + 1), 0, 0);   // erase exactly what the part took (no ghost copy left behind)
    bc.globalCompositeOperation = 'source-over';   // holes under the arms: the belly's soft tone (no white slivers when they move)
    for (const k of ['armL', 'armR']) { bc.save(); bc.globalCompositeOperation = 'destination-over'; bc.drawImage(maskTint(POLY[k], GROW[k] + 1, '#ebe9e4'), 0, 0); bc.restore(); }
    bc.globalCompositeOperation = 'destination-out';
    bc.fillRect(0, 900, 1536, 124); bc.fillRect(0, 0, 330, 1024); bc.fillRect(1090, 0, 446, 1024);
    L.body = b;
  }
  const rotAt = (c, [px, py], a) => { c.translate(px, py); c.rotate(a); c.translate(-px, -py); };
  function lids(c, lid) {
    if (lid >= 0.99) return;
    for (const [ex, ey, rx, ry] of LIDS) {
      const R = [rx + 9, ry + 9], top = ey - R[1], shut = ey + ry * 0.25, edge = top + (1 - lid) * (shut - top);
      c.save(); c.beginPath(); c.ellipse(ex, ey, R[0], R[1], 0, 0, Math.PI * 2); c.clip();
      c.fillStyle = '#fbfaf7'; c.beginPath(); c.moveTo(ex - R[0], top - 4); c.lineTo(ex + R[0], top - 4); c.lineTo(ex + R[0], edge); c.quadraticCurveTo(ex, edge + ry * 0.45 * (1 - lid), ex - R[0], edge); c.closePath(); c.fill();
      if (lid < 0.05) c.fillRect(ex - R[0], edge - 2, 2 * R[0], R[1] * 2);
      c.strokeStyle = 'rgba(40,38,36,0.16)'; c.lineWidth = 1.1;
      for (let k = 0; k < 26; k++) { const x = ex - R[0] + ((k * 37) % (2 * R[0])), y = top + 6 + ((k * 53) % Math.max(8, edge - top - 4)); if (y < edge - 3) { c.beginPath(); c.arc(x, y, 5 + (k % 3), 0.2, Math.PI - 0.2); c.stroke(); } }
      const g = c.createLinearGradient(0, top, 0, top + R[1]); g.addColorStop(0, 'rgba(60,55,50,0.22)'); g.addColorStop(1, 'rgba(60,55,50,0)'); c.fillStyle = g; c.fillRect(ex - R[0], top - 4, 2 * R[0], Math.max(0, edge - top + 4));
      c.restore();
      c.save(); c.strokeStyle = '#2a2724'; c.lineCap = 'round'; c.lineWidth = 6;
      if (lid < 0.05) { c.beginPath(); c.moveTo(ex - rx * 0.85, shut - 8); c.quadraticCurveTo(ex, shut + ry * 0.35, ex + rx * 0.85, shut - 8); c.stroke();
        c.lineWidth = 2; c.strokeStyle = 'rgba(42,39,36,0.45)'; c.beginPath(); c.moveTo(ex - rx * 0.7, ey - ry * 0.45); c.quadraticCurveTo(ex, ey - ry * 0.75, ex + rx * 0.7, ey - ry * 0.45); c.stroke(); }
      else { c.beginPath(); c.moveTo(ex - R[0] * 0.92, edge); c.quadraticCurveTo(ex, edge + ry * 0.45 * (1 - lid), ex + R[0] * 0.92, edge); c.stroke(); }
      c.restore();
    }
  }
  function head(c, p) {
    const jaw = Math.max(-0.3, Math.min(1, p.jaw || 0)), k = 1 + jaw * 0.16;   // the lower face stretches down (mouth opens wider)
    c.drawImage(L.head, 0, 0, 1536, JAW_Y, 0, 0, 1536, JAW_Y);
    c.drawImage(L.head, 0, JAW_Y, 1536, 1024 - JAW_Y, 0, JAW_Y, 1536, (1024 - JAW_Y) * k);
    const lk = p.look || [0, 0];
    EYE.forEach((e, i) => { c.save(); c.beginPath(); c.ellipse(e.c[0], e.c[1], e.rx - 3, e.ry - 3, 0, 0, Math.PI * 2); c.clip(); c.drawImage(L.iris[i], lk[0] * 12, lk[1] * 14); c.restore(); });
    lids(c, p.lid ?? 1);
  }
  function draw(c, p) {
    const s = p.s || 1, sq = Math.max(-0.25, Math.min(0.3, p.squash || 0)), lift = p.lift || 0, lean = p.lean || 0;
    const FX = 768, FY = 985;   // foot centre in image units
    // contact shadow (stays on the ground; smaller and lighter as he rises)
    c.save(); c.translate(p.x, p.y); c.scale(s, s);
    if (p.shadow !== false) { const k = Math.max(0.35, 1 - lift / 400); c.save(); c.globalAlpha = 0.28 * k; c.fillStyle = '#5a5248'; c.filter = 'blur(10px)'; c.beginPath(); c.ellipse(0, 4, 300 * (0.6 + 0.4 * k), 30 * k, 0, 0, Math.PI * 2); c.fill(); c.restore(); }
    c.translate(-FX, -FY - lift);
    rotAt(c, [FX, FY], lean);
    // squash about the feet: wider and shorter (volume kept)
    c.translate(FX, FY); c.scale(1 / (1 - sq), 1 - sq); c.translate(-FX, -FY);
    // tail chain (behind)
    const ta = p.tail || [0, 0, 0];
    // the tail bends smoothly: thin rings around its root, each rotated by the chain angle at that distance
    const [rx0, ry0] = TAIL_ROOT, RMAX = 400, BAND = 5;
    const angAt = r => { const u = r / RMAX; return ta[0] * Math.max(0, Math.min(1, (u - 0.38) / 0.22)) + ta[1] * Math.max(0, Math.min(1, (u - 0.3) / 0.35)) + ta[2] * Math.max(0, Math.min(1, (u - 0.6) / 0.4)); };
    for (let r = 0; r < RMAX; r += BAND) {
      c.save(); c.beginPath(); c.arc(rx0, ry0, r + BAND + 0.8, 0, Math.PI * 2); if (r > 0) c.arc(rx0, ry0, r, 0, Math.PI * 2, true); c.clip();
      rotAt(c, TAIL_ROOT, angAt(r + BAND / 2)); c.drawImage(L.tail, 0, 0); c.restore();
    }
    // legs (under the body so the thighs cover the knees)
    for (const side of ['L', 'R']) { const lg = (p.legs || {})[side] || {}; c.save(); c.translate(0, -(lg.lift || 0)); rotAt(c, PIV['leg' + side], lg.rot || 0); c.drawImage(L['leg' + side], 0, 0); c.restore(); }
    c.drawImage(L.body, 0, 0);
    // arms
    const ar = p.arms || {};
    for (const side of ['L', 'R']) { c.save(); rotAt(c, PIV['arm' + side], (side === 'L' ? 1 : -1) * (ar[side] || 0)); c.drawImage(L['arm' + side], 0, 0); c.restore(); }
    // head: on the neck, it keeps 40 % of the body squash and adds its own tilt / offset
    const hd = p.head || {};
    c.save(); c.translate(hd.dx || 0, hd.dy || 0); rotAt(c, PIV.head, hd.tilt || 0);
    c.translate(PIV.head[0], PIV.head[1]); c.scale((1 - sq) / (1 - 0.4 * sq), (1 - 0.4 * sq) / (1 - sq)); c.translate(-PIV.head[0], -PIV.head[1]);
    head(c, p);
    c.restore();
    c.restore();
  }
  // --- physics: a damped spring that follows target(t) (seconds), integrated from 0 at 120 Hz (deterministic) ---
  function spring(target, t, hz = 3, zeta = 0.4) {
    const w = 2 * Math.PI * hz, dt = 1 / 120; let x = target(0), v = 0;
    for (let i = 1, n = Math.round(t * 120); i <= n; i++) { const g = target(i * dt); v += (w * w * (g - x) - 2 * zeta * w * v) * dt; x += v * dt; }
    return x;
  }
  window.REX = { build, draw, spring, POLY, PIV };
})();
