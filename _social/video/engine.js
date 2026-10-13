// Deterministic animation engine for the Kramavriddhi Shorts.
// Every frame is computed from the time t alone (window.renderFrame(t)), so headless
// capture is frame-exact. Open short.html?id=1 in a browser to preview in real time.
(function () {
  const params = new URLSearchParams(location.search);
  const short = SHORTS[params.get('id') || '1'];
  const DURATION = short.duration;
  const LOGO = (rect, stroke) => `<svg viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="${rect}"/><path d="M7 24h6v-5h6v-5h6V8" stroke="${stroke}" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const lerp = (a, b, p) => a + (b - a) * p;
  const ease = {
    out: p => 1 - Math.pow(1 - p, 3),
    inout: p => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2),
    back: p => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2); },
  };
  const mix = (c1, c2, p) => {
    const a = c1.match(/\w\w/g).map(h => parseInt(h, 16)), b = c2.match(/\w\w/g).map(h => parseInt(h, 16));
    return 'rgb(' + a.map((v, i) => Math.round(lerp(v, b[i], p))).join(',') + ')';
  };

  // ---- Build the DOM
  const $ = s => document.querySelector(s);
  const scenesEl = $('#scenes');
  const scenes = short.scenes.map((s, i) => {
    const el = document.createElement('section');
    el.className = 'scene' + (s.dark ? ' dark' : '') + (s.cls ? ' ' + s.cls : '');
    el.innerHTML = s.html.replace(/\{LOGO\}/g, LOGO('#0f766e', 'white'));
    scenesEl.appendChild(el);
    const end = i + 1 < short.scenes.length ? short.scenes[i + 1].start : DURATION;
    return { ...s, end, el, items: [...el.querySelectorAll('[data-in]')], last: i === short.scenes.length - 1 };
  });
  $('#bg').innerHTML = '<div style="position:absolute;inset:0;background:#f7f7f4"></div>' +
    '<div id="bgDark" style="position:absolute;inset:0;background:linear-gradient(160deg,#0b4f4a,#0f766e 70%)"></div>';
  const bgDark = $('#bgDark'), steps = $('#steps path'), logo = $('#brand .logo'), brand = $('#brand'), tag = $('#tag');
  tag.textContent = short.tag; tag.style.background = short.tagColor;
  if (!short.tag) tag.style.display = 'none';
  const dots = [];
  for (let i = 0; i < 16; i++) {
    const d = document.createElement('i');
    const r = (Math.sin(i * 91.7) + 1) / 2, r2 = (Math.sin(i * 37.3 + 1) + 1) / 2;
    dots.push({ el: d, x: 40 + r * 1000, size: 10 + r2 * 26, speed: 40 + r * 70, off: r2 * 1920 });
    $('#dots').appendChild(d);
  }
  steps.setAttribute('stroke-dasharray', '60');

  // ---- Effects for one element at scene-local time lt
  function apply(el, lt) {
    const d = el.dataset, tin = +d.in, dur = +(d.dur || (d.fx === 'count' ? 1.2 : 0.6));
    const raw = clamp((lt - tin) / dur);
    let p = ease.out(raw), op = 1, tf = '';
    switch (d.fx || 'up') {
      case 'up': op = p; tf = `translateY(${lerp(70, 0, p)}px)`; break;
      case 'fade': op = p; break;
      case 'left': op = p; tf = `translateX(${lerp(-120, 0, p)}px)`; break;
      case 'right': op = p; tf = `translateX(${lerp(120, 0, p)}px)`; break;
      case 'pop': op = clamp(raw * 3); tf = `scale(${lerp(0.4, 1, ease.back(raw))})`; break;
      case 'stamp': op = clamp(raw * 4); tf = `rotate(-10deg) scale(${lerp(2.6, 1, ease.back(raw))})`; break;
      case 'strike': el.style.setProperty('--p', p); return;
      case 'count': {
        op = clamp(raw * 4); tf = `scale(${lerp(0.7, 1, ease.back(clamp(raw * 1.6)))})`;
        const n = Math.round(+d.count * ease.out(raw));
        el.textContent = (d.prefix || '') + n.toLocaleString('en-IN') + (d.suffix || '');
        break;
      }
      case 'tap': op = raw > 0 && raw < 1 ? Math.sin(Math.PI * raw) : 0; tf = `scale(${lerp(0.4, 1.3, raw)})`; break;
      case 'move': op = 1; tf = `translateY(${lerp(+d.y0, +d.y1, ease.inout(raw))}px)`; break;
      case 'ring': el.style.strokeDashoffset = String(lerp(+d.len, 0, ease.inout(raw))); return;
    }
    if (d.pulse !== undefined && raw >= 1) tf += ` scale(${1 + 0.035 * Math.sin((lt - tin - dur) * Math.PI * 2 / 1.4)})`;
    if (d.out !== undefined) op *= 1 - ease.out(clamp((lt - +d.out) / 0.35));
    el.style.opacity = op; el.style.transform = tf;
  }

  // Darkness of the background at time t (crossfades over 0.5 s around scene changes)
  function darkness(t) {
    let v = scenes[0].dark ? 1 : 0;
    for (let i = 1; i < scenes.length; i++) {
      const p = ease.inout(clamp((t - (scenes[i].start - 0.25)) / 0.5));
      v = lerp(v, scenes[i].dark ? 1 : 0, p);
    }
    return v;
  }

  window.renderFrame = function (t) {
    for (const s of scenes) {
      const lt = t - s.start;
      const vis = t >= s.start - 0.01 && (t < s.end || s.last);
      s.el.style.display = vis ? 'flex' : 'none';
      if (!vis) continue;
      const inP = ease.out(clamp(lt / 0.4));
      const outP = s.last ? 0 : ease.inout(clamp((t - (s.end - 0.35)) / 0.35));
      s.el.style.opacity = inP * (1 - outP);
      s.el.style.transform = `translateY(${lerp(40, 0, inP) - 50 * outP}px)`;
      for (const el of s.items) apply(el, lt);
      if (s.onFrame) s.onFrame(lt, s.el);
    }
    const dk = darkness(t);
    bgDark.style.opacity = dk;
    brand.style.color = mix('14201e', 'ffffff', dk);
    logo.innerHTML = LOGO(mix('0f766e', 'ffffff', dk), mix('ffffff', '0f766e', dk));
    steps.setAttribute('stroke', dk > 0.5 ? 'rgba(255,255,255,.07)' : 'rgba(15,118,110,.07)');
    steps.parentNode.style.transform = `translate(${-60 * Math.sin(t / 9)}px, ${-t * 6}px)`;
    steps.setAttribute('stroke-dashoffset', String(-t * 3));
    for (const d of dots) {
      const y = 1920 - ((d.off + t * d.speed) % 2100);
      d.el.style.cssText = `left:${d.x + 20 * Math.sin(t + d.off)}px;top:${y}px;width:${d.size}px;height:${d.size}px;` +
        `background:${dk > 0.5 ? 'rgba(245,184,61,.22)' : 'rgba(15,118,110,.10)'}`;
    }
    $('#progress i').style.width = (100 * t / DURATION).toFixed(3) + '%';
  };

  window.DURATION = DURATION;
  window.renderFrame(0);
  window.READY = document.fonts.ready.then(() => true);
  if (!params.has('capture')) {
    const t0 = performance.now();
    const loop = () => { window.renderFrame(((performance.now() - t0) / 1000) % DURATION); requestAnimationFrame(loop); };
    requestAnimationFrame(loop);
  }
})();
