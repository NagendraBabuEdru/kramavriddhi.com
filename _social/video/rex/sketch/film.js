// Film framework for the Rex Adventures episodes: keyframed camera with parallax layers, line boil,
// light grading (warm dawn → cool blue-grey), vignette, the "drawing appears" reveal, title signs and
// screen-space particles. Episodes register with FILM.episode(n, def); sketch.html?ep=n renders one.
// window.renderFrame(t, color) draws frame t; window.EPISODE_INFO() returns duration, cues and music.
(function () {
  const A = window.ART;
  const W = 1920, H = 1080, C0 = [1700, 950];
  const canvas = document.getElementById('c'), ctx = canvas.getContext('2d');
  const tmp = document.createElement('canvas'); tmp.width = W; tmp.height = H; const tctx = tmp.getContext('2d');
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const lerp = (a, b, p) => a + (b - a) * p;
  const ease = {
    lin: p => p, in: p => p * p * p, out: p => 1 - Math.pow(1 - p, 3),
    inout: p => p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2,
    back: p => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2); },
  };
  // keyframes: [[t, v, easing?], ...]; v may be a number or an array
  function kf(t, keys) {
    if (t <= keys[0][0]) return keys[0][1];
    for (let i = 1; i < keys.length; i++) {
      const [t1, v1, e] = keys[i];
      if (t <= t1) {
        const [t0, v0] = keys[i - 1], p = (ease[e || 'inout'])((t - t0) / (t1 - t0));
        return Array.isArray(v0) ? v0.map((x, j) => lerp(x, v1[j], p)) : lerp(v0, v1, p);
      }
    }
    return keys[keys.length - 1][1];
  }
  const F = { kf, ease, clamp, lerp, W, H };
  window.FILM = F;
  const EPS = {};
  let hatchTile = null;
  let cur = null, cam = { cx: C0[0], cy: C0[1], z: 0.56, roll: 0 }, T = 0;

  F.episode = (n, def) => { EPS[n] = def; };
  F.windAt = t => (cur && cur.wind ? cur.wind(t) : 0);
  F.blinkAt = (t, period = 3.5) => { const k = Math.floor(t / period), s = A.rnd(77, k) * period * 0.6; const lt = t - k * period - s; return lt > 0 && lt < 0.17 ? 1 : 0; };
  F.fadeIn = (t, a, b, d = 0.6) => clamp((t - a) / d) * clamp((b + d - t) / d);
  F.smooth = p => p * p * (3 - 2 * p);

  function camAt(t) {
    const K = cur.camera;
    let i = 0;
    while (i < K.length - 1 && K[i + 1][0] <= t) i++;
    const a = K[i], b = K[i + 1];
    if (!b) return { cx: a[1], cy: a[2], z: a[3], roll: a[4] || 0 };
    const p = (ease[b[5] || 'lin'])(clamp((t - a[0]) / (b[0] - a[0])));
    // a tiny hand-held paper drift so nothing is ever perfectly frozen
    const dx = Math.sin(t * 1.3) * 0.3 + Math.sin(t * 0.7) * 0.2, dy = Math.cos(t * 1.1) * 0.3;
    return { cx: lerp(a[1], b[1], p) + dx, cy: lerp(a[2], b[2], p) + dy, z: lerp(a[3], b[3], p), roll: lerp(a[4] || 0, b[4] || 0, p) };
  }
  // parallax layer: f = 1 is the main world plane; < 1 further away, > 1 in front
  F.layer = (f, fn) => {
    ctx.save();
    const z = f > 1 ? cam.z * (1 + (f - 1) * 0.25) : Math.pow(cam.z, f) * Math.pow(0.56, 1 - f) / Math.pow(0.56, 0);   // far layers zoom less
    const ox = cam.cx * f + C0[0] * (1 - f), oy = cam.cy * f + C0[1] * (1 - f);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.translate(W / 2, H / 2); ctx.rotate(cam.roll); ctx.scale(z, z); ctx.translate(-ox, -oy);
    fn();
    ctx.restore();
  };
  // the drawing "appears": clip from x0 to x0 + k*(x1-x0)
  F.drawIn = (k, x0, x1, fn) => {
    if (k <= 0) return;
    if (k >= 1) return fn();
    ctx.save(); ctx.beginPath(); ctx.rect(x0, -5000, (x1 - x0) * k, 12000); ctx.clip(); fn(); ctx.restore();
  };
  // visible world range of a parallax layer for the current camera (for drawing repeating scenery)
  F.vis = f => {
    const z = f > 1 ? cam.z * (1 + (f - 1) * 0.25) : Math.pow(cam.z, f) * Math.pow(0.56, 1 - f);
    const ox = cam.cx * f + C0[0] * (1 - f), oy = cam.cy * f + C0[1] * (1 - f);
    return { x0: ox - W / 2 / z, x1: ox + W / 2 / z, y0: oy - H / 2 / z, y1: oy + H / 2 / z };
  };
  F.cam = () => cam;
  F.pop = (k, _, fn) => { if (k <= 0) return; ctx.save(); ctx.globalAlpha *= k; fn(); ctx.restore(); };
  F.tuft = (x, y, s, seed) => { for (let i = 0; i < 4; i++) A.line([[x + i * 5 * s, y], [x + (i * 5 - 4 + A.rnd(seed, i) * 8) * s, y - (12 + A.rnd(seed, i + 4) * 10) * s]], { w: 1.4, dark: 0.55, seed: seed * 7 + i, passes: 1 }); };
  // two big front-facing eyes peeking through the crack in the egg
  F.peekEyes = (x, y, s, t) => {
    const look = t < 113.5 ? [0, 0] : t < 114.1 ? [-1, 0] : t < 114.7 ? [1, 0] : [0, -0.6];
    const a = clamp((t - 112) / 0.3), blink = t > 113 && t < 113.17;
    for (const ex of [-9, 9]) {
      ctx.save(); ctx.globalAlpha = a;
      const R = 7.5 * s * (t > 114 ? 1.1 : 1);
      if (blink) { A.line([[x + ex * s - R, y], [x + ex * s + R, y]], { w: 2, seed: 5, passes: 1 }); ctx.restore(); continue; }
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.ellipse(x + ex * s, y, R, R * 0.8, 0, 0, 7); ctx.fill();
      ctx.fillStyle = '#1b1a18'; ctx.beginPath(); ctx.arc(x + ex * s + look[0] * R * 0.35, y + look[1] * R * 0.3, R * 0.55, 0, 7); ctx.fill();
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(x + ex * s + look[0] * R * 0.35 - R * 0.2, y + look[1] * R * 0.3 - R * 0.22, R * 0.2, 0, 7); ctx.fill();
      ctx.restore();
    }
  };
  // a soft diagonal sunbeam onto (x, y), world space
  F.sunbeam = (x, y, a) => {
    if (a <= 0) return;
    ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.globalAlpha = a * 0.55;
    const g = ctx.createLinearGradient(x + 400, y - 900, x, y);
    g.addColorStop(0, 'rgba(255,240,190,0)'); g.addColorStop(1, A.isColor() ? 'rgba(255,226,150,0.9)' : 'rgba(255,255,255,0.9)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x + 300, y - 1000); ctx.lineTo(x + 560, y - 1000); ctx.lineTo(x + 90, y + 40); ctx.lineTo(x - 110, y + 40); ctx.closePath(); ctx.fill();
    const r = ctx.createRadialGradient(x, y - 20, 0, x, y - 20, 160);
    r.addColorStop(0, A.isColor() ? 'rgba(255,220,140,0.8)' : 'rgba(255,255,255,0.8)'); r.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = r; ctx.beginPath(); ctx.arc(x, y - 20, 160, 0, 7); ctx.fill();
    ctx.restore();
  };
  // REX ADVENTURES title signs: main plank drops in at t0, episode plank swings in, subtitle slides, all lift out
  F.titleSigns = (t, t0, t1, ep, subtitle) => {
    if (t < t0 || t > t1) return;
    const out = clamp((t - (t1 - 0.8)) / 0.8), lift = ease.in(out) * -900;
    const drop = 1 - ease.back(clamp((t - t0) / 0.7));
    A.plank(W / 2, 330 + drop * -700 + lift, 1100, 230, 'REX ADVENTURES', { font: "400 120px 'Lilita One'", rot: -0.02, seed: 410, sprig: 1, t });
    if (t > t0 + 1) {
      const sw = Math.exp(-(t - t0 - 1) * 2.2) * Math.sin((t - t0 - 1) * 5) * 0.35;
      A.plank(W / 2, 545 + lift, 480, 110, ep, { font: "400 70px 'Lilita One'", rot: sw, ropes: true, seed: 420 });
    }
    if (t > t0 + 2) {
      const sl = 1 - ease.out(clamp((t - t0 - 2) / 0.6));
      A.plank(W / 2 + sl * 1400, 700 + lift, 900, 110, subtitle, { font: "700 52px 'Nirmala UI'", rot: 0.015, seed: 430 });
    }
  };
  F.tumbleLeaves = (Wd, Hd, t, t0, n) => {
    for (let i = 0; i < n; i++) {
      const sp = 500 + A.rnd(20, i) * 400, start = t0 + A.rnd(21, i) * 12;
      const lt = t - start; if (lt < 0) continue;
      const x = Wd + 100 - lt * sp, y = 200 + A.rnd(22, i) * 700 + Math.sin(lt * 3 + i) * 40;
      if (x < -150) continue;
      A.leaf(x, y, 0.35 + A.rnd(23, i) * 0.2, lt * 4 + i, 1400 + i, i % 2 ? A.PAL.leaf : A.PAL.leafDark);
    }
  };
  F.pollen = (x, y, t) => { for (let i = 0; i < 5; i++) { ctx.save(); ctx.fillStyle = 'rgba(60,55,45,0.6)'; ctx.beginPath(); ctx.arc(x + Math.sin(t * 3 + i * 2) * 20 + i * 8, y + Math.cos(t * 2 + i) * 10, 3, 0, 7); ctx.fill(); ctx.restore(); } };
  F.paperFade = a => { ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = A.PAL.paper; ctx.fillRect(0, 0, W, H); ctx.restore(); };
  F.fadeFromBlack = (t, t0, d) => { const a = 1 - clamp((t - t0) / d); if (a > 0) { ctx.save(); ctx.fillStyle = `rgba(0,0,0,${a})`; ctx.fillRect(0, 0, W, H); ctx.restore(); } };

  function grade(t, color) {
    const warmth = cur.warmth ? cur.warmth(t) : 0, cool = cur.cool ? cur.cool(t) : 0, vig = cur.vignette ? cur.vignette(t) : 0.08;
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    if (warmth > 0 && color) { ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = `rgba(255,232,200,${warmth * 0.55})`; ctx.fillRect(0, 0, W, H); }
    if (cool > 0) {
      if (color) { tctx.filter = `saturate(${1 - 0.6 * cool})`; tctx.drawImage(canvas, 0, 0); tctx.filter = 'none'; ctx.globalCompositeOperation = 'copy'; ctx.drawImage(tmp, 0, 0); }
      ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = color ? `rgba(170,185,215,${cool * 0.55})` : `rgba(180,180,180,${cool * 0.5})`; ctx.fillRect(0, 0, W, H);
    }
    ctx.globalCompositeOperation = 'source-over';
    if (cool > 0.05) {   // the cold gets "drawn in": a cross-hatch layer over everything
      if (!hatchTile) {
        hatchTile = document.createElement('canvas'); hatchTile.width = 256; hatchTile.height = 256;
        const h = hatchTile.getContext('2d'); h.strokeStyle = 'rgba(40,38,36,0.5)'; h.lineWidth = 1.2;
        for (let i = -256; i < 512; i += 9) { h.beginPath(); h.moveTo(i, 0); h.lineTo(i + 140, 256); h.stroke(); }
        for (let i = -256; i < 512; i += 13) { h.beginPath(); h.moveTo(i + 160, 0); h.lineTo(i, 256); h.stroke(); }
      }
      tctx.setTransform(1, 0, 0, 1, 0, 0); tctx.clearRect(0, 0, W, H); tctx.globalCompositeOperation = 'source-over';
      tctx.fillStyle = tctx.createPattern(hatchTile, 'repeat'); tctx.fillRect(0, 0, W, H);
      const m = tctx.createRadialGradient(W / 2, H * 0.62, H * 0.35, W / 2, H * 0.62, H * 1.0); m.addColorStop(0, 'rgba(0,0,0,0)'); m.addColorStop(1, 'rgba(0,0,0,1)');
      tctx.globalCompositeOperation = 'destination-in'; tctx.fillStyle = m; tctx.fillRect(0, 0, W, H);
      const v = tctx.createLinearGradient(0, 0, 0, H); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(0.55, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,1)');
      tctx.fillStyle = v; tctx.fillRect(0, 0, W, H); tctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = cool * (color ? 0.3 : 0.5); ctx.drawImage(tmp, 0, 0); ctx.globalAlpha = 1;
    }
    const g = ctx.createRadialGradient(W / 2, H / 2, H * 0.45, W / 2, H / 2, H * 1.05);
    g.addColorStop(0, 'rgba(40,35,30,0)'); g.addColorStop(1, `rgba(40,35,30,${vig + cool * 0.15})`);
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    ctx.restore();
  }

  window.renderFrame = (t, color) => {
    T = t;
    A.use(ctx, { color });
    A.setBoil(t * (cur.boil ? cur.boil(t) / 8 : 1));
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; ctx.filter = 'none';
    A.paper(W, H);
    cam = camAt(t);
    const ov = cur.camOverride && cur.camOverride(t); if (ov) cam = { ...cam, ...ov };
    F.layer(1, () => cur.draw(t));
    grade(t, color);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    const bb = cur.bgBlur ? cur.bgBlur(t) : 0;   // soften and lighten the picture under the title signs
    if (bb > 0) { tctx.filter = `blur(${(4 * bb).toFixed(1)}px)`; tctx.drawImage(canvas, 0, 0); tctx.filter = 'none'; ctx.drawImage(tmp, 0, 0); F.paperFade(0.3 * bb); }
    cur.overlay && cur.overlay(t, W, H);
    if (!color) {   // the black-and-white version is pure graphite: no colour anywhere
      tctx.filter = 'grayscale(1) contrast(1.04)'; tctx.drawImage(canvas, 0, 0); tctx.filter = 'none';
      ctx.globalCompositeOperation = 'copy'; ctx.drawImage(tmp, 0, 0); ctx.globalCompositeOperation = 'source-over';
    }
  };
  window.EPISODE_INFO = () => ({ duration: cur.duration, cues: cur.cues, music: cur.music });
  window.FILM_SELECT = n => { cur = EPS[n]; return !!cur; };
  // pick the episode from the URL once all scripts have loaded
  window.addEventListener('load', () => { const n = new URLSearchParams(location.search).get('ep'); if (n != null) window.FILM_SELECT(n); });
})();
