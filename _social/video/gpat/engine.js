// Frame-exact animation engine for the GPAT Prep reels (same approach as _social/video/engine.js):
// every frame is computed from the time t alone (window.renderFrame(t)), so headless capture is exact.
// Open reel.html?id=mock-en in a browser to preview in real time.
(function () {
  const params = new URLSearchParams(location.search);
  const reel = REELS[params.get('id') || Object.keys(REELS)[0]];
  const META = window.META || {};
  const DURATION = reel.duration, K = 616 / 780; // app screenshots are 780 px wide, the phone screen is 616 px
  const LOGO = `<svg viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#ffffff"/><path d="M7 24h6v-5h6v-5h6V8" stroke="#0f766e" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const lerp = (a, b, p) => a + (b - a) * p;
  const ease = {
    out: p => 1 - Math.pow(1 - p, 3),
    inout: p => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2),
    back: p => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2); },
  };
  const $ = s => document.querySelector(s);
  if (reel.lang === 'te') document.body.classList.add('te');
  document.documentElement.lang = reel.lang;

  // ---- Text scenes
  const scenes = reel.scenes.map((s, i) => {
    const el = document.createElement('section');
    el.className = 'scene ' + (s.cls || (s.phone ? 'top' : 'full'));
    el.innerHTML = s.html.replace(/\{PARROT\}/g, PARROT).replace(/\{LOGO\}/g, LOGO);
    $('#scenes').appendChild(el);
    const end = i + 1 < reel.scenes.length ? reel.scenes[i + 1].start : DURATION;
    return { ...s, end, el, items: [...el.querySelectorAll('[data-in]')], last: i === reel.scenes.length - 1 };
  });
  $('#brand .logo').innerHTML = LOGO;
  $('#tag').textContent = reel.tag;

  // ---- Phone layers (one per screen), tap rings and callouts
  const screen = $('#screen'), phone = $('#phone');
  const layers = reel.screens.map(s => {
    const el = document.createElement('div'); el.className = 'layer';
    el.innerHTML = `<img src="cap/${s.img}.jpg">`; screen.appendChild(el);
    return { ...s, el };
  });
  const taps = (reel.taps || []).map(tp => {
    const el = document.createElement('div'); el.className = 'tapring'; screen.appendChild(el);
    const [x, y] = tp.xy || (META[tp.img] && META[tp.img].tap) || [390, 800];
    el.style.left = x * K + 'px'; el.style.top = y * K + 'px';
    return { ...tp, el };
  });
  const callouts = (reel.callouts || []).map(c => {
    const el = document.createElement('div'); el.className = 'callout'; el.innerHTML = c.html;
    el.style.left = c.x + 'px'; el.style.top = c.y + 'px'; if (c.style) el.style.cssText += c.style;
    $('#stage').appendChild(el); return { ...c, el };
  });

  const dots = [];
  for (let i = 0; i < 14; i++) {
    const d = document.createElement('i'), r = (Math.sin(i * 91.7) + 1) / 2, r2 = (Math.sin(i * 37.3 + 1) + 1) / 2;
    dots.push({ el: d, x: 40 + r * 1000, size: 10 + r2 * 24, speed: 40 + r * 60, off: r2 * 1920 });
    $('#dots').appendChild(d);
  }
  const steps = $('#steps path'); steps.setAttribute('stroke-dasharray', '60');

  // ---- Effects for one text element at scene-local time lt
  function apply(el, lt) {
    const d = el.dataset, tin = +d.in, dur = +(d.dur || (d.fx === 'count' ? 1.2 : 0.6));
    const raw = clamp((lt - tin) / dur);
    let p = ease.out(raw), op = 1, tf = '';
    switch (d.fx || 'up') {
      case 'up': op = p; tf = `translateY(${lerp(60, 0, p)}px)`; break;
      case 'fade': op = p; break;
      case 'left': op = p; tf = `translateX(${lerp(-120, 0, p)}px)`; break;
      case 'pop': op = clamp(raw * 3); tf = `scale(${lerp(0.4, 1, ease.back(raw))})`; break;
      case 'stamp': op = clamp(raw * 4); tf = `rotate(-6deg) scale(${lerp(2.4, 1, ease.back(raw))})`; break;
      case 'count': {
        op = clamp(raw * 4); tf = `scale(${lerp(0.7, 1, ease.back(clamp(raw * 1.6)))})`;
        el.textContent = (d.prefix || '') + Math.round(+d.count * ease.out(raw)).toLocaleString('en-IN') + (d.suffix || '');
        break;
      }
    }
    if (d.pulse !== undefined && raw >= 1) tf += ` scale(${1 + 0.035 * Math.sin((lt - tin - dur) * Math.PI * 2 / 1.4)})`;
    if (d.out !== undefined) op *= 1 - ease.out(clamp((lt - +d.out) / 0.35));
    el.style.opacity = op; el.style.transform = tf;
  }

  // Phone visibility: 1 inside scenes with phone:true, sliding in/out over 0.5 s at scene changes
  function phoneShown(t) {
    let v = scenes[0].phone ? 1 : 0;
    for (let i = 1; i < scenes.length; i++) v = lerp(v, scenes[i].phone ? 1 : 0, ease.inout(clamp((t - (scenes[i].start - 0.25)) / 0.5)));
    return v;
  }

  window.renderFrame = function (t) {
    for (const s of scenes) {
      const lt = t - s.start, vis = t >= s.start - 0.01 && (t < s.end || s.last);
      s.el.style.display = vis ? 'flex' : 'none';
      if (!vis) continue;
      const inP = ease.out(clamp(lt / 0.4)), outP = s.last ? 0 : ease.inout(clamp((t - (s.end - 0.3)) / 0.3));
      s.el.style.opacity = inP * (1 - outP);
      s.el.style.transform = `translateY(${lerp(30, 0, inP) - 30 * outP}px)`;
      for (const el of s.items) apply(el, lt);
    }
    // Phone: slide up from below, and a gentle float
    const ph = phoneShown(t);
    phone.style.opacity = ph;
    phone.style.transform = `translateY(${lerp(500, 0, ease.out(ph)) + 6 * Math.sin(t * 1.3)}px)`;
    // Screens: the latest one whose time has come, crossfading over 0.3 s; optional pan and zoom
    let cur = -1; layers.forEach((l, i) => { if (t >= l.at) cur = i; });
    layers.forEach((l, i) => {
      const fade = clamp((t - l.at) / 0.3);
      const nextAt = i + 1 < layers.length ? layers[i + 1].at : Infinity;
      l.el.style.opacity = i === cur || (i === cur - 1 && t < layers[cur].at + 0.3) ? (i === cur ? fade : 1) : 0;
      l.el.style.zIndex = i === cur ? 2 : 1;
      if (t < l.at - 0.01 || t > nextAt + 0.4) return;
      const [p0, p1] = l.pan || [l.at, l.at];
      const y = lerp(l.y0 || 0, l.y1 === undefined ? (l.y0 || 0) : l.y1, ease.inout(clamp((t - p0) / Math.max(0.01, p1 - p0))));
      let s = 1, fx = 0, fy = 0;
      if (l.zoom) { const z = l.zoom, zp = ease.inout(clamp((t - z.at) / (z.dur || 0.8))); s = lerp(1, z.s, zp); fx = z.x * K; fy = z.y * K; }
      l.el.style.transform = `translate(${fx}px, ${fy}px) scale(${s}) translate(${-fx}px, ${-fy - y * K}px)`;
    });
    for (const tp of taps) {
      const raw = clamp((t - tp.at) / 0.7);
      tp.el.style.opacity = raw > 0 && raw < 1 ? Math.sin(Math.PI * raw) : 0;
      tp.el.style.transform = `scale(${lerp(0.4, 1.3, raw)})`;
    }
    for (const c of callouts) {
      const raw = clamp((t - c.at) / 0.5), out = c.out ? ease.out(clamp((t - c.out) / 0.3)) : 0;
      c.el.style.opacity = clamp(raw * 3) * (1 - out) * ph;
      c.el.style.transform = `scale(${lerp(0.5, 1, ease.back(raw))}) rotate(${c.rot || 0}deg)`;
    }
    steps.parentNode.style.transform = `translate(${-60 * Math.sin(t / 9)}px, ${-t * 6}px)`;
    steps.setAttribute('stroke-dashoffset', String(-t * 3));
    for (const d of dots) {
      const y = 1920 - ((d.off + t * d.speed) % 2100);
      d.el.style.cssText = `left:${d.x + 20 * Math.sin(t + d.off)}px;top:${y}px;width:${d.size}px;height:${d.size}px`;
    }
    $('#progress i').style.width = (100 * t / DURATION).toFixed(3) + '%';
  };

  window.DURATION = DURATION;
  window.renderFrame(0);
  const imgs = [...document.images].map(im => im.complete ? Promise.resolve() : new Promise(r => { im.onload = im.onerror = r; }));
  window.READY = Promise.all([document.fonts.ready, ...imgs]).then(() => true);
  if (!params.has('capture')) {
    const t0 = performance.now();
    const loop = () => { window.renderFrame(((performance.now() - t0) / 1000) % DURATION); requestAnimationFrame(loop); };
    requestAnimationFrame(loop);
  }
})();
