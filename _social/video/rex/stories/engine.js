// Story engine for the Rex story videos (runs inside the puppet-theatre page, see make_stories.js).
// An episode script builds actors with keyframed tracks, a camera, speech bubbles, captions,
// comic effects and sound cues. Every frame is a pure function of time T, so capture is exact:
//   window.storyFrame(w, h)  -> JSON display list for the Flutter puppet renderer (game art)
//   window.renderOverlay(T)  -> HTML/canvas layer on top: bubbles, captions, effects, cards
(function () {
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const lerp = (a, b, p) => a + (b - a) * p;
  const EASE = {
    lin: p => p,
    in: p => p * p * p,
    out: p => 1 - Math.pow(1 - p, 3),
    inout: p => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2),
    back: p => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2); },
    bounce: p => { const n = 7.5625, d = 2.75; if (p < 1 / d) return n * p * p; if (p < 2 / d) return n * (p -= 1.5 / d) * p + 0.75; if (p < 2.5 / d) return n * (p -= 2.25 / d) * p + 0.9375; return n * (p -= 2.625 / d) * p + 0.984375; },
  };

  class Track {
    constructor(init) { this.init = init; this.segs = []; this.sorted = true; }
    add(s) { this.segs.push(s); this.sorted = false; }
    val(T) {
      if (!this.sorted) { this.segs.sort((a, b) => a.t0 - b.t0 || a.i - b.i); this.sorted = true; }
      let v = this.init;
      for (const s of this.segs) {
        if (T < s.t0) break;
        if (s.set || T >= s.t1) { v = s.to; continue; }
        const p = (T - s.t0) / (s.t1 - s.t0);
        return typeof v === 'number' ? lerp(v, s.to, (EASE[s.ease] || EASE.inout)(p)) : v;
      }
      return v;
    }
    lastSet(T) { let at = -1e9; for (const s of this.segs) if (s.t0 <= T) at = s.t0; return at; }
  }
  let segId = 0;

  // Where a speech bubble points, relative to the foot point, in units of the actor's size s.
  const HEAD = {
    rex: [44, -88], tri: [34, -50], stego: [34, -52], ankylo: [34, -48], ptera: [18, -42], wren: [18, -42],
    raptor: [-30, -72], boss: [-30, -78], baby: [8, -84], mama: [8, -84], nix: [10, -96], babyTiko: [-6, -58], flick: [0, -14],
    inkWren: [-6, -66], babyStella: [6, -50], babyMomo: [-8, -48], goblin: [0, -66],
  };

  class Actor {
    constructor(story, k, props) {
      this.story = story; this.k = k; this.tracks = {};
      this.base = { x: 0, y: 462, s: 1, z: 0, dy: 0, dx: 0, rot: 0, sx: 1, sy: 1, alpha: 1, flip: false, move: false, shk: 0, bob: 0, ...props };
    }
    tr(p) { return this.tracks[p] || (this.tracks[p] = new Track(this.base[p])); }
    set(t, props) { for (const [p, v] of Object.entries(props)) this.tr(p).add({ t0: t, t1: t, to: v, set: true, i: segId++ }); return this; }
    to(t, props, dur, ease = 'inout') { for (const [p, v] of Object.entries(props)) this.tr(p).add({ t0: t, t1: t + dur, to: v, ease, i: segId++ }); return this; }
    walk(t, x, dur, extra = {}) { this.set(t, { move: true, ...extra }); this.to(t, { x }, dur, 'lin'); this.set(t + dur, { move: false }); return this; }
    hop(t, h = 40, dur = 0.5) {
      this.set(t, { air: true }); this.to(t, { dy: -h }, dur / 2, 'out'); this.to(t + dur / 2, { dy: 0 }, dur / 2, 'in'); this.set(t + dur, { air: false });
      return this;
    }
    squash(t, amt = 0.25, dur = 0.35) {
      this.to(t, { sy: 1 - amt, sx: 1 + amt * 0.7 }, dur * 0.3, 'out'); this.to(t + dur * 0.3, { sy: 1, sx: 1 }, dur * 0.7, 'back');
      return this;
    }
    shake(t, dur = 0.4, amp = 4) { this.set(t, { shk: amp }); this.set(t + dur, { shk: 0 }); return this; }
    v(p, T) { return this.tracks[p] ? this.tracks[p].val(T) : this.base[p]; }
    head(T) {
      const kind = this.k === 'friend' ? this.base.kind : this.k === 'raptor' ? (this.base.boss ? 'boss' : 'raptor') : this.k === 'baby' && this.base.mama ? 'mama' : this.k;
      const [hx, hy] = HEAD[kind] || [0, -60];
      const s = this.v('s', T), flip = this.v('flip', T), faceLeft = this.v('faceLeft', T);
      const sgn = (flip ? -1 : 1) * (faceLeft ? -1 : 1);
      return [this.v('x', T) + this.v('dx', T) + hx * s * sgn, this.v('y', T) + this.v('dy', T) + hy * s * this.v('sy', T)];
    }
    item(T) {
      const it = { k: this.k };
      const skip = new Set(['dy', 'dx', 'move', 'shk', 'z', 'bob', 'voice', 'hidden', 'attach', 'flyUp']);
      for (const p of new Set([...Object.keys(this.base), ...Object.keys(this.tracks)])) if (!skip.has(p)) it[p] = this.v(p, T);
      const shk = this.v('shk', T);
      it.x = it.x + this.v('dx', T) + (shk ? Math.sin(T * 70) * shk : 0);
      it.y = it.y + this.v('dy', T) + Math.sin(T * 3 + (this.base.tOff || 0)) * this.v('bob', T);
      it.t = T + (this.base.tOff || 0);
      const at = this.base.attach;   // ride on another actor (a party hat on a head); flyUp lifts it off
      if (at) {
        const o = at.a, s = o.v('s', T), sg = (o.v('faceLeft', T) ? -1 : 1) * (o.v('flip', T) ? -1 : 1), fu = this.v('flyUp', T) || 0;
        it.x = o.v('x', T) + o.v('dx', T) + at.ox * s * sg + fu * 30;
        it.y = o.v('y', T) + o.v('dy', T) + at.oy * s * o.v('sy', T) - fu * 150;
        it.rot = (it.rot || 0) + fu * 4 + o.v('rot', T);
        it.alpha = Math.min(it.alpha ?? 1, o.v('alpha', T));
      }
      if (this.k === 'rex' || this.k === 'friend' || this.k === 'raptor') {
        const flies = this.k === 'friend' && (this.base.kind === 'ptera' || this.base.kind === 'wren');
        it.still = !(this.v('move', T) || flies || this.v('air', T));
      }
      if (this.tracks.pose) it.poseT = T - this.tracks.pose.lastSet(T);
      return it;
    }
  }

  class Story {
    constructor(opts) {
      Object.assign(this, { W: 1080, H: 1920, portrait: true, duration: 30, title: null, ...opts });
      this.actors = []; this.bubbles = []; this.caps = []; this.fx = []; this.cues = []; this.cards = []; this.clips = [];
      this.cam = new Actor(this, 'cam', { cx: 480, cy: 270, zz: 1, shk: 0 });
      this.bgT = new Actor(this, 'bg', { type: 'game', theme: 0, s: 0, ground: 462 });
    }
    actor(k, props) { const a = new Actor(this, k, props); this.actors.push(a); return a; }
    rex(p) { return this.actor('rex', p); }
    friend(kind, p) { return this.actor('friend', { kind, ...p }); }
    // a line of dialogue: bubble over the actor, Telugu first, English below
    say(t, a, te, en, dur, o = {}) {
      const d = dur || clamp(1.6 + (te.length + en.length) * 0.028, 2.0, 4.6);
      this.bubbles.push({ t0: t, t1: t + d, a, te, en, ...o });
      this.cues.push({ t: t + 0.05, type: 'talk', voice: a.base.voice || a.k, n: Math.round(clamp((en.length) / 4, 3, 14)) });
      return t + d;
    }
    caption(t, dur, te, en) { this.caps.push({ t0: t, t1: t + dur, te, en }); }
    // real gameplay video (served next to the page) shown full-frame from t for dur seconds
    clip(t, dur, src, from = 0, frames) { this.clips.push({ t0: t, t1: t + dur, src, from, frames }); }
    screen(t, dur, o = {}) { (this.screens || (this.screens = [])).push({ t0: t, t1: t + dur, ...o }); }
    effect(t, type, x, y, o = {}) { this.fx.push({ t0: t, type, x, y, ...o }); }
    sfx(t, type, o = {}) { this.cues.push({ t, type, ...o }); }
    camAt(t, cx, cy, z, dur = 0, ease = 'inout') { dur ? this.cam.to(t, { cx, cy, zz: z }, dur, ease) : this.cam.set(t, { cx, cy, zz: z }); }
    camShake(t, dur = 0.5, amp = 6) { this.cam.shake(t, dur, amp); }
    camera(T) {
      const shk = this.cam.v('shk', T);
      return { cx: this.cam.v('cx', T) + (shk ? Math.sin(T * 63) * shk : 0), cy: this.cam.v('cy', T) + (shk ? Math.cos(T * 51) * shk * 0.7 : 0), z: this.cam.v('zz', T) };
    }
    toScreen(T, wx, wy) {
      const c = this.camera(T), z = c.z * this.renderScale;
      return [(wx - c.cx) * z + this.W / 2, (wy - c.cy) * z + this.H / 2];
    }
    frame(T) {
      const bg = { type: this.bgT.v('type', T), theme: this.bgT.v('theme', T), s: this.bgT.v('s', T), t: T, ground: this.bgT.v('ground', T) };
      const items = this.actors.filter(a => a.v('alpha', T) > 0 && !a.v('hidden', T))
        .sort((a, b) => a.v('z', T) - b.v('z', T)).map(a => a.item(T));
      const c = this.camera(T);
      return { cam: { cx: c.cx, cy: c.cy, z: c.z * this.renderScale }, bg, items };
    }
  }

  /* ---------------- overlay: bubbles, captions, effects, cards ---------------- */
  let story = null, layer, fxCanvas, ctx, bubbleEls = new Map(), capEl, chrome;
  const LOGO = '<svg viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#f7f7f4"/><path d="M7 24h6v-5h6v-5h6V8" stroke="#0f766e" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  function buildOverlay() {
    const css = document.createElement('style');
    css.textContent = `
      #sl { position: fixed; inset: 0; z-index: 100; pointer-events: none; font-family: 'Nunito', 'Segoe UI', sans-serif; }
      #sl .te { font-family: 'Nirmala UI', 'Noto Sans Telugu', sans-serif; font-weight: 700; }
      #sl .disp { font-family: 'Lilita One', 'Segoe UI', sans-serif; }
      #sl .bub { position: absolute; background: #fffdf4; border: 5px solid #14201e; border-radius: 34px; padding: 14px 26px 16px; text-align: center;
                 box-shadow: 0 10px 0 rgba(0,0,0,.18); transform-origin: 50% 100%; }
      #sl .bub .t1 { color: #14201e; line-height: 1.35; }
      #sl .bub .t2 { color: #0f766e; font-weight: 800; line-height: 1.25; margin-top: 4px; }
      #sl .tail { position: absolute; width: 0; height: 0; }
      #sl .cap { position: absolute; left: 50%; transform: translateX(-50%); text-align: center; background: rgba(20,32,30,.82); border-radius: 26px; padding: 12px 30px; color: #fff; }
      #sl .card { position: absolute; inset: 0; background: linear-gradient(165deg,#0b4f4a,#0f766e 62%,#12806f); display: flex; flex-direction: column; justify-content: center; }
      #sl .pill { display: inline-block; border-radius: 999px; padding: .18em .7em; }
      #sl.ink .bub { background: #fbfbfb; border: 5px solid #222; border-radius: 30px 38px 32px 36px; box-shadow: 6px 8px 0 rgba(0,0,0,.12); }
      #sl.ink .bub .t1 { color: #111; }
      #sl.ink .bub .t2 { color: #555; font-family: 'Patrick Hand', 'Segoe Print', cursive; font-weight: 400; }
      #sl.ink .cap { background: rgba(250,250,250,.94); color: #111; border: 4px solid #222; }
      #sl.ink .cap div + div { color: #555 !important; font-family: 'Patrick Hand', cursive; font-weight: 400 !important; }
    `;
    document.head.appendChild(css);
    const fonts = document.createElement('link');
    fonts.rel = 'stylesheet';
    fonts.href = 'https://fonts.googleapis.com/css2?family=Lilita+One&family=Nunito:wght@700;800;900&family=Patrick+Hand&display=block';
    document.head.appendChild(fonts);
    layer = document.createElement('div'); layer.id = 'sl'; if (story.style === 'ink') layer.className = 'ink'; document.body.appendChild(layer);
    fxCanvas = document.createElement('canvas'); fxCanvas.width = story.W; fxCanvas.height = story.H;
    fxCanvas.style.cssText = 'position:absolute;left:0;top:0;width:100%;height:100%';
    layer.appendChild(fxCanvas); ctx = fxCanvas.getContext('2d');
    capEl = document.createElement('div'); capEl.className = 'cap'; layer.appendChild(capEl);
    chrome = document.createElement('div'); chrome.style.cssText = 'position:absolute;inset:0'; layer.appendChild(chrome);
  }

  // cards: title (over the opening scene) and end card
  function renderChrome(T) {
    const S = story, P = S.portrait;
    let html = '';
    // corner brand during the story
    const brandOp = S.title ? clamp((T - S.titleDur) / 0.4) * clamp((S.duration - S.endDur - T) / 0.3) : 1;
    if (brandOp > 0) {
      html += `<div style="position:absolute;${P ? 'left:60px;top:96px' : 'left:36px;top:30px'};opacity:${brandOp * 0.92};display:flex;align-items:center;gap:12px;color:${S.style === 'ink' ? '#222' : '#fff'};font:700 ${P ? 34 : 28}px 'Segoe UI';text-shadow:${S.style === 'ink' ? 'none' : '0 2px 8px rgba(0,0,0,.5)'}">
        <span style="width:${P ? 56 : 46}px;height:${P ? 56 : 46}px;display:block">${LOGO}</span>Kramavriddhi${S.series ? ` <span class="pill disp" style="background:#f5b83d;color:#14201e;font-size:${P ? 26 : 22}px;font-weight:400;text-shadow:none">${S.series}</span>` : ''}</div>`;
    }
    if (S.title && T < S.titleDur + 0.4) {
      const p = clamp(T / 0.5), out = clamp((S.titleDur + 0.4 - T) / 0.4);
      const sc = lerp(0.6, 1, EASE.back(p));
      html += `<div style="position:absolute;left:0;right:0;${P ? 'top:330px' : 'top:120px'};display:flex;justify-content:center;opacity:${Math.min(p * 2, 1) * out}">
        <div style="transform:scale(${sc});${S.style === 'ink' ? 'background:#fbfbfb;border:6px solid #222;border-radius:30px 40px 34px 38px;color:#111' : 'background:rgba(11,79,74,.94);border:6px solid #f5b83d;border-radius:36px'};padding:${P ? '26px 44px' : '20px 44px'};text-align:center;max-width:${P ? 880 : 1300}px;box-shadow:0 18px 50px rgba(0,0,0,.35)">
          <div class="disp" style="font-size:${P ? 34 : 30}px;color:${S.style === 'ink' ? '#777' : '#9fdc6e'};letter-spacing:2px">${S.kicker || "REX'S BIG ADVENTURE"}</div>
          <div class="te" style="font-size:${P ? 66 : 58}px;color:${S.style === 'ink' ? '#111' : '#fff'};line-height:1.35">${S.title.te}</div>
          <div style="font-size:${P ? 64 : 56}px;line-height:1.1;${S.style === 'ink' ? "font-family:'Patrick Hand',cursive;color:#333" : "font-family:'Lilita One';color:#f5b83d"}">${S.title.en}</div></div></div>`;
    }
    if (S.endDur && T > S.duration - S.endDur) {
      const lt = T - (S.duration - S.endDur), p = clamp(lt / 0.4), q = k => EASE.back(clamp((lt - k) / 0.5));
      html += `<div class="card" style="opacity:${p};${P ? 'padding:0 150px 0 70px' : 'padding:0 160px'}">
        <div style="display:flex;align-items:center;gap:16px;color:#fff;font:700 ${P ? 42 : 38}px 'Segoe UI';transform:scale(${q(0.1)})"><span style="width:${P ? 80 : 66}px;height:${P ? 80 : 66}px;display:block">${LOGO}</span>Kramavriddhi</div>
        <div class="te" style="margin-top:${P ? 50 : 30}px;font-size:${P ? 60 : 54}px;color:#fff;line-height:1.4;transform:translateY(${(1 - q(0.25)) * 40}px);opacity:${clamp((lt - 0.25) * 3)}">${S.endTe || 'రెక్స్ ఆటను ఉచితంగా ఆడండి!'}</div>
        <div class="disp" style="font-size:${P ? 76 : 70}px;color:#f5b83d;line-height:1.05;transform:translateY(${(1 - q(0.4)) * 40}px);opacity:${clamp((lt - 0.4) * 3)}">${S.endEn || "Play Rex's Big Adventure free!"}</div>
        <div class="disp" style="margin-top:14px;font-size:${P ? 44 : 40}px;color:#9fdc6e;opacity:${clamp((lt - 0.55) * 3)}">In your browser · No download</div>
        <div style="margin-top:${P ? 50 : 34}px;transform:scale(${q(0.75)});transform-origin:0 50%"><span class="disp pill" style="background:#f5b83d;color:#14201e;font-size:${P ? 62 : 58}px;box-shadow:0 10px 0 #b07c12">kramavriddhi.com/games</span></div>
        ${S.next ? `<div class="te" style="margin-top:${P ? 60 : 40}px;font-size:${P ? 36 : 32}px;color:#dff7c0;opacity:${clamp((lt - 1) * 3)}">${S.next}</div>` : ''}
      </div>`;
    }
    chrome.innerHTML = html;
  }

  function renderBubbles(T) {
    const S = story, P = S.portrait, live = new Set();
    const fsT = P ? 46 : 40, fsE = P ? 34 : 30, maxW = P ? 760 : 820;
    const minX = P ? 60 : 40, maxX = P ? S.W - 150 : S.W - 40, minY = P ? 230 : 70;
    for (const b of S.bubbles) {
      if (T < b.t0 || T > b.t1 + 0.2) continue;
      const key = b; live.add(key);
      let el = bubbleEls.get(key);
      if (!el) {
        el = document.createElement('div'); el.className = 'bub';
        el.innerHTML = `<div class="t1 te" style="font-size:${fsT}px">${b.te}</div><div class="t2" style="font-size:${fsE}px">${b.en}</div>`;
        el.style.maxWidth = maxW + 'px';
        const tail = document.createElement('div'); tail.className = 'tail';
        layer.appendChild(el); layer.appendChild(tail); el._tail = tail;
        bubbleEls.set(key, el);
      }
      const [hx, hy] = b.a.head(T), [sx, sy] = S.toScreen(T, hx + (b.ox || 0), hy + (b.oy || 0));
      const w = el.offsetWidth, h = el.offsetHeight;
      let left = clamp(sx - w / 2, minX, maxX - w), top = Math.max(minY, sy - h - 46);
      if (b.below) top = sy + 40;
      const p = clamp((T - b.t0) / 0.28), out = clamp((b.t1 + 0.2 - T) / 0.2);
      el.style.left = left + 'px'; el.style.top = top + 'px';
      el.style.opacity = Math.min(1, p * 3) * out;
      el.style.transform = `scale(${lerp(0.5, 1, EASE.back(p))})`;
      const tl = el._tail, tx = clamp(sx, left + 40, left + w - 40), tyTop = top + h - 6;
      const tipY = Math.min(sy - 8, tyTop + 60);
      tl.style.cssText = `position:absolute;left:0;top:0;width:${S.W}px;height:${S.H}px;opacity:${el.style.opacity}`;
      tl.innerHTML = `<svg width="${S.W}" height="${S.H}" style="position:absolute;left:0;top:0;overflow:visible"><path d="M${tx - 22},${tyTop} L${tx + 22},${tyTop} L${lerp(tx, sx, 0.7)},${Math.max(tipY, tyTop + 26)} Z" fill="${S.style === 'ink' ? '#fbfbfb' : '#fffdf4'}" stroke="${S.style === 'ink' ? '#222' : '#14201e'}" stroke-width="5" stroke-linejoin="round"/><rect x="${tx - 19}" y="${tyTop - 9}" width="38" height="10" fill="${S.style === 'ink' ? '#fbfbfb' : '#fffdf4'}"/></svg>`;
    }
    for (const [k, el] of bubbleEls) if (!live.has(k)) { el._tail.remove(); el.remove(); bubbleEls.delete(k); }
  }

  function renderCaption(T) {
    const S = story, P = S.portrait;
    const c = S.caps.find(c => T >= c.t0 && T <= c.t1);
    if (!c) { capEl.style.opacity = 0; return; }
    const p = clamp((T - c.t0) / 0.3) * clamp((c.t1 - T) / 0.25);
    if (!capEl._placed) { capEl.style.cssText += P ? ';top:1380px;max-width:860px;margin-left:-45px' : ';bottom:36px;max-width:1500px'; capEl._placed = true; }
    capEl.style.opacity = p;
    capEl.innerHTML = `<div class="te" style="font-size:${P ? 44 : 40}px;line-height:1.4">${c.te}</div><div style="font-size:${P ? 32 : 28}px;font-weight:800;color:#bfe9d9">${c.en}</div>`;
  }

  // comic effects drawn on a 2D canvas in screen space
  function star(x, y, r, rot) {
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const a = rot + i * Math.PI / 5, rr = i % 2 ? r * 0.45 : r;
      ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
    }
    ctx.closePath();
  }
  function heart(x, y, s) {
    ctx.beginPath(); ctx.moveTo(x, y + 6 * s);
    ctx.bezierCurveTo(x - 12 * s, y - 2 * s, x - 8 * s, y - 12 * s, x, y - 6 * s);
    ctx.bezierCurveTo(x + 8 * s, y - 12 * s, x + 12 * s, y - 2 * s, x, y + 6 * s); ctx.closePath();
  }
  function renderFx(T) {
    const S = story, Z = S.camera(T).z * S.renderScale;
    ctx.clearRect(0, 0, S.W, S.H);
    for (const f of S.fx) {
      const lt = T - f.t0, dur = f.dur || 1;
      if (lt < 0 || lt > dur) continue;
      if (f.type === 'text' && window.__noFxText) continue;   // thumbnails add their own title
      const p = lt / dur;
      let [x, y] = f.screen ? [f.x, f.y] : S.toScreen(T, f.x, f.y);
      if (f.follow) { const [hx, hy] = f.follow.head(T); [x, y] = S.toScreen(T, hx + (f.ox || 0), hy + (f.oy || 0)); }
      const sz = (f.size || 1) * (S.portrait ? 1.8 : 1);
      ctx.save();
      switch (f.type) {
        case 'text': {   // comic word: BOING!, ROAAAR!, hic!
          const sc = lerp(0.3, 1, EASE.back(clamp(lt / 0.25))) * sz;
          ctx.globalAlpha = clamp((dur - lt) / 0.25);
          ctx.translate(x, y - lt * 30); ctx.rotate(f.rot ?? -0.12); ctx.scale(sc, sc);
          ctx.font = `${f.fs || 90}px 'Lilita One'`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.lineJoin = 'round'; ctx.lineWidth = 14; ctx.strokeStyle = '#14201e'; ctx.strokeText(f.text, 0, 0);
          ctx.fillStyle = f.color || '#f5b83d'; ctx.fillText(f.text, 0, 0);
          break;
        }
        case 'burst': {   // stars flying out
          for (let i = 0; i < (f.n || 8); i++) {
            const a = i / (f.n || 8) * Math.PI * 2 + (f.seed || 0), d = EASE.out(p) * (f.r || 120) * sz;
            ctx.globalAlpha = 1 - p; ctx.fillStyle = f.color || '#ffd34d';
            star(x + Math.cos(a) * d, y + Math.sin(a) * d, 16 * sz * (1 - p * 0.5), a); ctx.fill();
          }
          break;
        }
        case 'circling': {   // dizzy stars around the head
          for (let i = 0; i < 3; i++) {
            const a = T * 6 + i * 2.1;
            ctx.fillStyle = '#ffd34d'; ctx.strokeStyle = '#8a5a10'; ctx.lineWidth = 2;
            star(x + Math.cos(a) * 46 * sz, y - 10 + Math.sin(a) * 14 * sz, 13 * sz, a); ctx.fill(); ctx.stroke();
          }
          break;
        }
        case 'rings': {   // roar shock waves
          for (let i = 0; i < 3; i++) {
            const q = clamp(p * 1.6 - i * 0.25); if (q <= 0 || q >= 1) continue;
            ctx.globalAlpha = (1 - q) * 0.9; ctx.strokeStyle = i % 2 ? '#ffa05a' : '#ffd678'; ctx.lineWidth = 14 * (1 - q) + 3;
            ctx.beginPath(); ctx.arc(x, y, q * (f.r || 520) * Z / 2, -1.1, 1.1); ctx.stroke();
          }
          break;
        }
        case 'lines': {   // speed lines
          ctx.strokeStyle = 'rgba(255,255,255,.85)'; ctx.lineCap = 'round';
          for (let i = 0; i < 9; i++) {
            const yy = y + (i - 4) * 26 * sz, len = (80 + (i * 37) % 70) * sz, off = ((lt * 900 + i * 53) % 260) * sz;
            ctx.globalAlpha = 0.8 * (1 - p); ctx.lineWidth = 6;
            ctx.beginPath(); ctx.moveTo(x - off * (f.dir || 1), yy); ctx.lineTo(x - (off + len) * (f.dir || 1), yy); ctx.stroke();
          }
          break;
        }
        case 'dust': {
          for (let i = 0; i < 7; i++) {
            const a = Math.PI + (i / 6 - 0.5) * 1.6 * (f.dir || 1), d = EASE.out(p) * 70 * sz;
            ctx.globalAlpha = (1 - p) * 0.8; ctx.fillStyle = f.color || '#d9c3a0';
            ctx.beginPath(); ctx.arc(x + Math.cos(a) * d * (f.dir || 1), y - Math.abs(Math.sin(a)) * d * 0.4, (14 + i % 3 * 5) * sz * (0.6 + p), 0, 7); ctx.fill();
          }
          break;
        }
        case 'zzz': {
          ctx.font = `${44 * sz}px 'Lilita One'`; ctx.fillStyle = '#fff'; ctx.strokeStyle = '#14201e'; ctx.lineWidth = 8; ctx.lineJoin = 'round';
          for (let i = 0; i < 3; i++) {
            const q = (lt * 0.7 + i / 3) % 1;
            ctx.globalAlpha = Math.sin(q * Math.PI);
            const xx = x + q * 60 * sz + i * 6, yy = y - q * 110 * sz;
            ctx.strokeText('z', xx, yy); ctx.fillText('z', xx, yy);
          }
          break;
        }
        case 'hearts': {
          for (let i = 0; i < 4; i++) {
            const q = clamp(p * 1.4 - i * 0.12);
            ctx.globalAlpha = Math.sin(q * Math.PI); ctx.fillStyle = '#ff6b8b';
            heart(x + (i - 1.5) * 34 * sz + Math.sin(lt * 5 + i) * 8, y - q * 120 * sz, 2.4 * sz); ctx.fill();
          }
          break;
        }
        case 'notes': {
          ctx.font = `${52 * sz}px 'Segoe UI Symbol'`; ctx.fillStyle = '#14201e';
          for (let i = 0; i < 3; i++) {
            const q = (lt * 0.8 + i / 3) % 1;
            ctx.globalAlpha = Math.sin(q * Math.PI);
            ctx.fillText(i % 2 ? '♪' : '♫', x + (i - 1) * 50 * sz + Math.sin(q * 6) * 10, y - q * 100 * sz);
          }
          break;
        }
        case 'mark': {   // ! or ? popping over a head
          const sc = lerp(0.2, 1, EASE.back(clamp(lt / 0.2))) * sz;
          ctx.globalAlpha = clamp((dur - lt) / 0.2);
          ctx.translate(x, y - 30 * sz); ctx.scale(sc, sc);
          ctx.font = `80px 'Lilita One'`; ctx.textAlign = 'center';
          ctx.lineWidth = 12; ctx.lineJoin = 'round'; ctx.strokeStyle = '#14201e'; ctx.strokeText(f.text, 0, 0);
          ctx.fillStyle = f.color || '#ff5a5a'; ctx.fillText(f.text, 0, 0);
          break;
        }
        case 'sparkle': {
          for (let i = 0; i < 6; i++) {
            const a = i * 1.05 + (f.seed || 0), d = (40 + (i * 23) % 50) * sz, tw = Math.sin(lt * 9 + i * 1.7);
            ctx.globalAlpha = clamp(tw) * (1 - p * 0.5); ctx.fillStyle = '#fff6c2';
            star(x + Math.cos(a) * d, y + Math.sin(a) * d * 0.7, 12 * sz * (0.6 + tw * 0.4), 0); ctx.fill();
          }
          break;
        }
        case 'fluff': {   // dandelion seeds drifting
          for (let i = 0; i < (f.n || 7); i++) {
            const q = clamp(p * 1.2 - i * 0.05), xx = x + (f.dx || 160) * q * sz + Math.sin(lt * 3 + i * 1.7) * 18 * sz, yy = y - 60 * q * sz + Math.cos(lt * 2 + i) * 14 * sz + i * 4;
            ctx.globalAlpha = Math.sin(clamp(p * 1.1) * Math.PI); ctx.strokeStyle = '#444'; ctx.lineWidth = 1.5;
            for (let r = 0; r < 6; r++) { const a = r * 1.05; ctx.beginPath(); ctx.moveTo(xx, yy); ctx.lineTo(xx + Math.cos(a) * 7 * sz, yy + Math.sin(a) * 7 * sz); ctx.stroke(); }
          }
          break;
        }
        case 'puff': {   // grey smoke puffs (a tiny fizzle of fire breath)
          for (let i = 0; i < (f.n || 4); i++) {
            const q = clamp(p * 1.3 - i * 0.1);
            ctx.globalAlpha = (1 - q) * 0.85; ctx.fillStyle = f.color || '#9a9a9a'; ctx.strokeStyle = '#333'; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.arc(x + (f.dir || 1) * (20 + q * 60) * sz + i * 6, y - q * 50 * sz - i * 8, (8 + q * 16 + i * 3) * sz, 0, 7); ctx.fill(); ctx.stroke();
          }
          break;
        }
        case 'drops': {   // water drops on glasses / after a splash
          for (let i = 0; i < (f.n || 10); i++) {
            const a = i * 2.4, d = (10 + (i * 13) % 40) * sz;
            ctx.globalAlpha = 1 - p * 0.6; ctx.fillStyle = '#cfe8ff'; ctx.strokeStyle = '#333'; ctx.lineWidth = 1.5;
            ctx.beginPath(); ctx.ellipse(x + Math.cos(a) * d, y + Math.sin(a) * d * 0.6 + p * 20 * sz, 5 * sz, 7 * sz, 0, 0, 7); ctx.fill(); ctx.stroke();
          }
          break;
        }
        case 'flash': { ctx.globalAlpha = (1 - p) * (f.a || 0.7); ctx.fillStyle = f.color || '#fff'; ctx.fillRect(0, 0, S.W, S.H); break; }
        case 'fade': { ctx.globalAlpha = Math.sin(p * Math.PI); ctx.fillStyle = f.color || '#071009'; ctx.fillRect(0, 0, S.W, S.H); break; }
      }
      ctx.restore();
    }
  }

  window.StoryEngine = { Story, EASE, clamp, lerp };
  window.storyUse = s => { story = s; story.renderScale = story.renderScale || 1; buildOverlay(); };
  window.__T = 0;
  window.storyFrame = () => { window.__drawn = (window.__drawn || 0) + 1; return JSON.stringify(story ? story.frame(window.__T) : {}); };
  // real gameplay: a folder of numbered JPEG frames (30 fps) next to the page; one image per video frame
  const imgs = new Map();
  async function renderClips(T) {
    for (const c of story.clips) {
      let im = imgs.get(c);
      if (!im) {
        im = document.createElement('img');
        im.style.cssText = 'position:absolute;left:0;top:0;width:100%;height:100%;object-fit:cover;background:#000';
        layer.insertBefore(im, layer.firstChild); imgs.set(c, im);
      }
      const on = T >= c.t0 && T < c.t1;
      im.style.display = on ? 'block' : 'none';
      if (on) {
        const n = Math.min(c.frames || 1e9, Math.round((c.from + T - c.t0) * 30) + 1);
        const src = `${c.src}/${String(n).padStart(4, '0')}.jpg`;
        if (!im.src.endsWith(src)) { im.src = src; await im.decode().catch(() => {}); }
      }
    }
  }
  function renderScreen(T) {
    const fv = document.querySelector('flutter-view') || document.querySelector('flt-glass-pane');
    if (!fv) return;
    let blur = 0, wob = 0;
    for (const s of story.screens || []) {
      if (T < s.t0 || T > s.t1) continue;
      const k = Math.min(clamp((T - s.t0) / 0.35), clamp((s.t1 - T) / 0.35));
      blur = Math.max(blur, (s.blur || 0) * k); wob = Math.max(wob, (s.wobble || 0) * k);
    }
    fv.style.filter = blur ? `blur(${blur.toFixed(2)}px)` : '';
    fv.style.transform = wob ? `rotate(${(Math.sin(T * 5) * wob).toFixed(3)}deg) scale(${(1 + wob * 0.012).toFixed(4)}) skewX(${(Math.sin(T * 3.3) * wob * 0.6).toFixed(3)}deg)` : '';
  }
  window.renderOverlay = async T => { await renderClips(T); renderScreen(T); renderBubbles(T); renderCaption(T); renderFx(T); renderChrome(T); };
  window.storyCues = () => story.cues;
})();
