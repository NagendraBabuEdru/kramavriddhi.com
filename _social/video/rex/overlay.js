// Deterministic overlay for the Rex promo videos: window.setup(cfg) builds the layer for one format,
// window.renderFrame(t) poses it at time t (seconds). Formats: 'short' (1080x1920), 'trailer'
// (1920x1080) and 'thumb' (1280x720 still). cfg comes from make_rex.js (see edit.js for the words).
(function () {
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const lerp = (a, b, p) => a + (b - a) * p;
  const out3 = p => 1 - Math.pow(1 - p, 3);
  const back = p => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2); };
  const LOGO = '<svg viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#0f766e"/><path d="M7 24h6v-5h6v-5h6V8" stroke="white" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const LOGO_LIGHT = '<svg viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#f7f7f4"/><path d="M7 24h6v-5h6v-5h6V8" stroke="#0f766e" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const root = document.getElementById('root');
  const el = (html, style = '') => { const d = document.createElement('div'); d.className = 'abs'; d.style.cssText = style; d.innerHTML = html; return d; };
  let cfg, anims = [], segs = [], cards = [], flashEl = null;

  // An element that pops/slides in at time tin (absolute seconds) and fades out at tout.
  function anim(node, tin, tout, fx = 'pop', dur = 0.45) { anims.push({ node, tin, tout, fx, dur }); return node; }
  function poseAnim(a, t) {
    const raw = clamp((t - a.tin) / a.dur), p = out3(raw);
    let op = clamp(raw * 2.5), tf = '';
    if (a.fx === 'pop') tf = `scale(${lerp(0.55, 1, back(raw))})`;
    else if (a.fx === 'up') tf = `translateY(${lerp(60, 0, p)}px)`;
    else if (a.fx === 'left') tf = `translateX(${lerp(-90, 0, p)}px)`;
    else if (a.fx === 'right') tf = `translateX(${lerp(90, 0, p)}px)`;
    else if (a.fx === 'fade') op = p;
    if (a.tout != null) op *= clamp((a.tout - t) / 0.22);
    if (t < a.tin) op = 0;
    a.node.style.opacity = op;
    a.node.style.transform = tf;
  }

  function dots(W, H, n) {
    let s = '';
    for (let i = 0; i < n; i++) {
      const r = (Math.sin(i * 91.7) + 1) / 2, r2 = (Math.sin(i * 37.3 + 1) + 1) / 2;
      const size = 14 + r2 * 40;
      s += `<i style="left:${(r * W).toFixed(0)}px;top:${((r2 * 1.7 + r * 0.3) % 1 * H).toFixed(0)}px;width:${size}px;height:${size}px"></i>`;
    }
    return `<div class="dots" style="position:absolute;inset:0">${s}</div>`;
  }

  /* ---------------- Short: 1080x1920 ---------------- */
  function buildShort() {
    const { W, H, panel: P } = cfg, r = 34;
    // Teal frame around a transparent, rounded gameplay window
    const hole = `M${P.x + r},${P.y} H${P.x + P.w - r} Q${P.x + P.w},${P.y} ${P.x + P.w},${P.y + r} V${P.y + P.h - r} Q${P.x + P.w},${P.y + P.h} ${P.x + P.w - r},${P.y + P.h} H${P.x + r} Q${P.x},${P.y + P.h} ${P.x},${P.y + P.h - r} V${P.y + r} Q${P.x},${P.y} ${P.x + r},${P.y} Z`;
    let circles = '';
    for (let i = 0; i < 22; i++) {
      const a = (Math.sin(i * 91.7) + 1) / 2, b = (Math.sin(i * 37.3 + 1) + 1) / 2;
      circles += `<circle cx="${(a * W).toFixed(0)}" cy="${((b * 1.7 + a * 0.3) % 1 * H).toFixed(0)}" r="${(8 + b * 22).toFixed(0)}" fill="rgba(255,255,255,.06)"/>`;
    }
    root.appendChild(el(`<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
      <defs><linearGradient id="g" x1="0" y1="0" x2="0.35" y2="1"><stop offset="0" stop-color="#0b4f4a"/><stop offset=".62" stop-color="#0f766e"/><stop offset="1" stop-color="#12806f"/></linearGradient>
      <clipPath id="c"><path clip-rule="evenodd" d="M0,0 H${W} V${H} H0 Z ${hole}"/></clipPath></defs>
      <path fill="url(#g)" fill-rule="evenodd" d="M0,0 H${W} V${H} H0 Z ${hole}"/>
      <g clip-path="url(#c)">${circles}</g>
      <path d="${hole}" fill="none" stroke="#f5b83d" stroke-width="8"/>
    </svg>`, 'left:0;top:0'));
    // brand row
    root.appendChild(el(`<div class="brand" style="font-size:40px"><span class="logo" style="width:70px;height:70px">${LOGO_LIGHT}</span>Kramavriddhi
      <span class="pill disp" style="background:#f5b83d;color:#14201e;font-size:30px;margin-left:8px">FREE GAME</span></div>`, 'left:70px;top:112px'));
    flashEl = el('', `left:${P.x}px;top:${P.y}px;width:${P.w}px;height:${P.h}px;background:#fff;opacity:0;border-radius:${r}px`);
    root.appendChild(flashEl);

    for (const s of segs) {
      if (s.kind === 'end') { buildShortEnd(s); continue; }
      if (s.en) {
        const big = s.hook ? 86 : 80;
        const n = el(`<div class="disp shadow" style="font-size:${big}px;line-height:1.1;text-align:center;color:${s.hook ? '#fff' : '#f5b83d'}">${s.en}</div>`,
          `left:60px;width:880px;top:${s.hook ? 236 : 262}px;height:${P.y - (s.hook ? 236 : 262) - 26}px;display:flex;align-items:center;justify-content:center;transform-origin:50% 60%`);
        root.appendChild(anim(n, s.start + (s.hook ? 0.05 : 0.08), s.end, 'pop', 0.5));
      }
      if (s.te) {
        const n = el(`<div class="te" style="font-size:${s.hook ? 56 : 50}px;line-height:1.45;text-align:center;color:#fff">${s.te}</div>`,
          `left:60px;width:880px;top:${P.y + P.h + 34}px`);
        root.appendChild(anim(n, s.start + 0.28, s.end, 'up', 0.45));
      }
      if (s.badge) {
        const n = el(`<div class="disp pill" style="background:#14201e;color:#f5b83d;font-size:34px;border:3px solid #f5b83d">${s.badge}</div>`,
          `left:${P.x + 26}px;top:${P.y + 24}px;transform-origin:0 0`);
        root.appendChild(anim(n, s.start + 0.15, s.end, 'left', 0.4));
      }
    }
  }

  function buildShortEnd(s) {
    const { W, H } = cfg;
    const c = el(`<div class="bgfill"></div>${dots(W, H, 22)}`, `left:0;top:0;width:${W}px;height:${H}px`);
    root.appendChild(anim(c, s.start, null, 'fade', 0.35));
    const T = s.start + 0.25;
    const add = (html, style, tin, fx, dur) => root.appendChild(anim(el(html, style), T + tin, null, fx, dur));
    add(`<div class="brand" style="font-size:44px"><span class="logo" style="width:84px;height:84px">${LOGO_LIGHT}</span>Kramavriddhi</div>`, 'left:70px;top:150px', 0, 'left');
    add(`<img src="${cfg.images.hero}" style="width:860px;height:500px;object-fit:cover;border-radius:36px;border:8px solid #f5b83d;box-shadow:0 24px 60px rgba(0,0,0,.35)">`, 'left:70px;top:290px', 0.1, 'pop', 0.55);
    add(`<div class="disp shadow" style="font-size:96px;line-height:1.02;color:#fff">Play free<br>in your browser</div>`, 'left:70px;top:850px', 0.35, 'up');
    add(`<div class="disp" style="font-size:52px;color:#9fdc6e">No download · No sign-up</div>`, 'left:70px;top:1062px', 0.55, 'up');
    add(`<div class="te" style="font-size:44px;line-height:1.4;color:#fff">బ్రౌజర్‌లో ఉచితంగా ఆడండి · డౌన్‌లోడ్ అవసరం లేదు</div>`, 'left:70px;top:1150px;width:880px', 0.7, 'up');
    add(`<div class="disp pill" style="background:#f5b83d;color:#14201e;font-size:66px;padding:.25em .7em;box-shadow:0 12px 0 #b07c12">kramavriddhi.com/games</div>`, 'left:70px;top:1330px;transform-origin:30% 50%', 0.95, 'pop', 0.5);
  }

  /* ---------------- Trailer: 1920x1080 ---------------- */
  function buildTrailer() {
    const { W, H } = cfg;
    flashEl = el('', `left:0;top:0;width:${W}px;height:${H}px;background:#fff;opacity:0`);
    root.appendChild(flashEl);
    for (const s of segs) {
      if (s.kind === 'title') { buildTrailerTitle(s); continue; }
      if (s.kind === 'end') { buildTrailerEnd(s); continue; }
      if (!s.en) continue;
      // default: on the soil strip under the ground line (y 924+); 'top' for clips where that is busy
      const top = s.pos === 'top';
      const n = el(`<div style="background:rgba(11,79,74,.93);border:4px solid #f5b83d;border-radius:26px;padding:8px 36px 10px;text-align:center;box-shadow:0 10px 30px rgba(0,0,0,.35)">
          <div class="disp" style="font-size:50px;line-height:1.1;color:#f5b83d">${s.en}</div>
          ${s.te ? `<div class="te" style="font-size:30px;line-height:1.45;color:#fff">${s.te}</div>` : ''}</div>`,
        `left:0;width:${W}px;${top ? 'top:30px' : 'bottom:14px'};display:flex;justify-content:center;transform-origin:50% ${top ? '0' : '100%'}`);
      root.appendChild(anim(n, s.start + 0.12, s.end - 0.05, 'pop', 0.5));
    }
  }

  function buildTrailerTitle(s) {
    const { W, H } = cfg;
    const c = el(`<div class="bgfill"></div>${dots(W, H, 26)}`, `left:0;top:0;width:${W}px;height:${H}px`);
    root.appendChild(anim(c, s.start - 1, s.end, 'fade', 0.01));   // fully visible from the first frame
    const add = (html, style, tin, fx, dur) => root.appendChild(anim(el(html, style), s.start + tin, s.end, fx, dur));
    add(`<img src="${cfg.images.art}" style="width:760px;height:600px;object-fit:cover;border-radius:36px;border:8px solid #f5b83d;box-shadow:0 24px 60px rgba(0,0,0,.35)">`, 'left:110px;top:240px', 0.05, 'pop', 0.6);
    add(`<div class="brand" style="font-size:38px"><span class="logo" style="width:66px;height:66px">${LOGO_LIGHT}</span>Kramavriddhi <span class="pill disp" style="background:#f5b83d;color:#14201e;font-size:28px">FREE GAME</span></div>`, 'left:960px;top:250px', 0.2, 'right');
    add(`<div class="disp shadow" style="font-size:118px;line-height:1.0;color:#f5b83d">Rex's Big<br>Adventure</div>`, 'left:960px;top:360px', 0.3, 'right');
    add(`<div style="font-size:44px;font-weight:800;line-height:1.3;color:#fff">Help Rex rescue his friends<br>and grow bigger!</div>`, 'left:960px;top:620px', 0.5, 'up');
    add(`<div class="te" style="font-size:38px;line-height:1.5;color:#dff7c0">రెక్స్ తన స్నేహితులను కాపాడి, పెద్దగా ఎదగాలి!</div>`, 'left:960px;top:752px', 0.65, 'up');
  }

  function buildTrailerEnd(s) {
    const { W, H } = cfg;
    const c = el(`<div class="bgfill"></div>${dots(W, H, 26)}`, `left:0;top:0;width:${W}px;height:${H}px`);
    root.appendChild(anim(c, s.start, null, 'fade', 0.35));
    const T = s.start + 0.25;
    const add = (html, style, tin, fx, dur) => root.appendChild(anim(el(html, style), T + tin, null, fx, dur));
    add(`<img src="${cfg.images.hero}" style="width:800px;height:490px;object-fit:cover;border-radius:36px;border:8px solid #f5b83d;box-shadow:0 24px 60px rgba(0,0,0,.35)">`, 'left:100px;top:295px', 0.05, 'pop', 0.55);
    add(`<div class="brand" style="font-size:40px"><span class="logo" style="width:70px;height:70px">${LOGO_LIGHT}</span>Kramavriddhi</div>`, 'left:960px;top:230px', 0.15, 'right');
    add(`<div class="disp shadow" style="font-size:96px;line-height:1.02;color:#fff">Play free in<br>your browser</div>`, 'left:960px;top:340px', 0.3, 'right');
    add(`<div class="disp" style="font-size:46px;color:#9fdc6e">No download · No sign-up · For kids</div>`, 'left:960px;top:556px', 0.5, 'up');
    add(`<div class="te" style="font-size:34px;line-height:1.5;color:#fff">బ్రౌజర్‌లో ఉచితంగా ఆడండి<br>డౌన్‌లోడ్ అవసరం లేదు</div>`, 'left:960px;top:628px', 0.65, 'up');
    add(`<div class="disp pill" style="background:#f5b83d;color:#14201e;font-size:60px;padding:.22em .7em;box-shadow:0 10px 0 #b07c12">kramavriddhi.com/games</div>`, 'left:960px;top:770px;transform-origin:30% 50%', 0.9, 'pop', 0.5);
  }

  /* ---------------- Thumbnail: 1280x720 ---------------- */
  function buildThumb() {
    const { W, H } = cfg;
    root.appendChild(el(`<img src="${cfg.images.thumbBg}" style="width:${W}px;height:${H}px;object-fit:cover">`, 'left:0;top:0'));
    root.appendChild(el('', `left:0;top:0;width:${W}px;height:${H}px;background:linear-gradient(270deg, rgba(11,79,74,.97) 0%, rgba(11,79,74,.9) 36%, rgba(11,79,74,0) 58%)`));
    root.appendChild(el(`<div class="brand" style="font-size:30px"><span class="logo" style="width:52px;height:52px">${LOGO_LIGHT}</span>Kramavriddhi</div>`, 'left:700px;top:44px'));
    root.appendChild(el(`<div class="disp" style="font-size:112px;line-height:.95;color:#f5b83d;-webkit-text-stroke:3px #3a2408;text-shadow:0 7px 0 #3a2408, 0 16px 34px rgba(0,0,0,.45)">FREE<br>DINO<br>GAME</div>`, 'left:696px;top:118px'));
    root.appendChild(el(`<div class="disp pill" style="background:#fff;color:#0b4f4a;font-size:48px;padding:.2em .6em;box-shadow:0 8px 0 rgba(0,0,0,.25)">▶ Play in browser</div>`, 'left:698px;top:470px'));
    root.appendChild(el(`<div style="font-size:30px;font-weight:900;color:#fff;line-height:1.3">Rex's Big Adventure<br><span class="te" style="color:#dff7c0;font-size:28px">పిల్లల కోసం ఉచిత ఆట</span></div>`, 'left:702px;top:584px'));
  }

  window.setup = c => {
    cfg = c; segs = c.segments || [];
    root.style.width = c.W + 'px'; root.style.height = c.H + 'px';
    document.documentElement.style.width = document.body.style.width = c.W + 'px';
    document.documentElement.style.height = document.body.style.height = c.H + 'px';
    if (c.format === 'short') buildShort();
    else if (c.format === 'trailer') buildTrailer();
    else buildThumb();
    return Promise.all([document.fonts.ready, ...[...document.images].map(i => i.decode().catch(() => {}))]).then(() => true);
  };

  window.renderFrame = t => {
    for (const a of anims) poseAnim(a, t);
    if (flashEl) {
      // quick flash on each cut between gameplay clips
      let f = 0;
      for (const s of segs) if (s.kind === 'clip' && s.start > 0.01 && s.flash !== false) f = Math.max(f, clamp(1 - (t - s.start) / 0.22) * (t >= s.start ? 0.55 : 0));
      flashEl.style.opacity = f;
    }
  };
})();
