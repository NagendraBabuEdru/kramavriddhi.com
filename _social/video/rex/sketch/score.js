// Music and sound for the Rex Adventures episodes, synthesized here (no samples, no downloads).
// Instruments: bansuri-like flute (sine + breath, vibrato), santoor (bright plucked string), kalimba,
// tabla taps (pitched membrane), soft strings pad, wind chimes. Nature: breeze, rain, waterfall, water, birds.
// Rex: squeaks, sniffs, giggles, a sneeze, a soft whimper (no words, no voice).
//   score(outWav, { duration, music: [[t0, t1, theme, vol]], cues: [[name, t, arg]] })
const fs = require('fs');
const SR = 48000, TAU = Math.PI * 2;
const hz = m => 440 * Math.pow(2, (m - 69) / 12);
function rng(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }

function score(out, opts) {
  const N = Math.ceil(opts.duration * SR);
  const mus = [new Float32Array(N), new Float32Array(N)], fx = [new Float32Array(N), new Float32Array(N)], amb = [new Float32Array(N), new Float32Array(N)];
  const rand = rng(opts.seed || 3);
  let bus = mus;
  const add = (i, v, pan = 0.5) => { if (i >= 0 && i < N) { bus[0][i] += v * (1 - pan) * 2 * 0.7; bus[1][i] += v * pan * 2 * 0.7; } };

  /* ---------- instruments ---------- */
  function flute(t0, m, dur, vol, pan = 0.45) {
    const f = hz(m), s0 = Math.round(t0 * SR), n = Math.round((dur + 0.3) * SR); let lp = 0;
    for (let i = 0; i < n; i++) {
      const t = i / SR, env = Math.min(1, t / 0.12) * Math.min(1, (n - i) / (0.3 * SR));
      const vib = 1 + 0.006 * Math.sin(TAU * 5.2 * t) * Math.min(1, t / 0.4);
      const ph = TAU * f * vib * t;
      const x = rand() * 2 - 1; lp += (x - lp) * 0.08;
      add(s0 + i, vol * env * (Math.sin(ph) + 0.18 * Math.sin(2 * ph) + 0.05 * Math.sin(3 * ph) + 0.12 * lp), pan);
    }
  }
  function santoor(t0, m, vol, pan = 0.55, dur = 1.6) {   // Karplus-Strong, bright
    const f = hz(m), p = Math.max(2, Math.round(SR / f)), buf = new Float32Array(p);
    for (let i = 0; i < p; i++) buf[i] = rand() * 2 - 1;
    const s0 = Math.round(t0 * SR), n = Math.round(dur * SR); let idx = 0;
    for (let i = 0; i < n; i++) { const a = buf[idx], b = buf[(idx + 1) % p]; buf[idx] = (a * 0.6 + b * 0.4) * 0.998; idx = (idx + 1) % p; add(s0 + i, a * vol * Math.min(1, (n - i) / (0.05 * SR)), pan); }
  }
  function kalimba(t0, m, vol, pan = 0.5) {
    const f = hz(m), s0 = Math.round(t0 * SR), n = Math.round(1.2 * SR);
    for (let i = 0; i < n; i++) { const t = i / SR; add(s0 + i, vol * Math.min(1, t / 0.003) * (Math.sin(TAU * f * t) * Math.exp(-t * 4) + 0.25 * Math.sin(TAU * f * 5.4 * t) * Math.exp(-t * 18)), pan); }
  }
  function tabla(t0, kind, vol, pan = 0.5) {   // 'na' sharp ring, 'ge' low bend, 'ti' soft tap
    const s0 = Math.round(t0 * SR), n = Math.round(0.5 * SR); let ph = 0;
    for (let i = 0; i < n; i++) {
      const t = i / SR;
      let v;
      if (kind === 'ge') { const f = 70 + 60 * Math.exp(-t * 12); ph += TAU * f / SR; v = Math.sin(ph) * Math.exp(-t * 6); }
      else if (kind === 'na') { ph += TAU * 620 / SR; v = (Math.sin(ph) + 0.4 * Math.sin(ph * 2.7)) * Math.exp(-t * 14) + (rand() - 0.5) * Math.exp(-t * 80) * 0.6; }
      else { ph += TAU * 900 / SR; v = Math.sin(ph) * Math.exp(-t * 30) * 0.6 + (rand() - 0.5) * Math.exp(-t * 120) * 0.4; }
      add(s0 + i, vol * v, pan);
    }
  }
  function pad(t0, notes, dur, vol) {
    const s0 = Math.round(t0 * SR), n = Math.round(dur * SR);
    for (const m of notes) {
      const f = hz(m);
      for (let i = 0; i < n; i++) { const t = i / SR, env = Math.min(1, t / 1.5) * Math.min(1, (n - i) / (1.5 * SR)); add(s0 + i, vol * env * (Math.sin(TAU * f * t) + 0.5 * Math.sin(TAU * f * 1.004 * t + 1) + 0.2 * Math.sin(TAU * 2 * f * t)) / notes.length, 0.5 + 0.2 * Math.sin(t * 0.3 + m)); }
    }
  }
  function noise(t0, dur, vol, cut, pan = 0.5, shape = null, hp = false) {   // one-pole filtered noise with an envelope function
    const s0 = Math.round(t0 * SR), n = Math.round(dur * SR); let lp = 0, lp2 = 0;
    for (let i = 0; i < n; i++) {
      const t = i / SR, x = rand() * 2 - 1; lp += (x - lp) * cut; lp2 += (lp - lp2) * cut;
      const env = shape ? shape(t, dur) : Math.min(1, t / 0.01) * Math.exp(-t * 8);
      add(s0 + i, vol * env * (hp ? x - lp2 : lp2), pan);
    }
  }
  function sweep(t0, f0, f1, dur, vol, pan = 0.5, wave = 'sine') {
    const s0 = Math.round(t0 * SR), n = Math.round(dur * SR); let ph = 0;
    for (let i = 0; i < n; i++) { const u = i / n, f = f0 * Math.pow(f1 / f0, u); ph += TAU * f / SR; let w = Math.sin(ph); if (wave === 'tri') w = 2 / Math.PI * Math.asin(w); add(s0 + i, vol * w * Math.min(1, i / 120) * Math.sin(Math.PI * Math.min(1, u * 1.2)), pan); }
  }
  // Rex's little voice: a soft triangle "squeak" with a pitch shape
  function squeak(t0, f0, f1, dur, vol = 0.12) { sweep(t0, f0, f1, dur, vol, 0.5, 'tri'); }

  /* ---------- music themes ---------- */
  const PENTA = [60, 62, 64, 67, 69, 72, 74, 76, 79, 81];   // C major pentatonic (Mohanam-like)
  const phrase = (t, degs, step, vol, octave = 0, len = 0.9) => degs.forEach((d, i) => { if (d >= 0) flute(t + i * step, PENTA[d] + octave, step * len, vol); });
  const themes = {
    flute_open(t0, t1, v) { phrase(t0 + 0.5, [2, 3, 4, -1, 3, 2, 0], 1.1, 0.09 * v); phrase(t0 + 9, [4, 5, 4, 3, -1, 2, 3], 1.2, 0.09 * v); pad(t0 + 10, [48, 55, 64], t1 - t0 - 10, 0.05 * v);
      for (let t = t0 + 18; t < t1 - 1; t += 0.4) santoor(t, PENTA[[0, 2, 4, 2][Math.round((t - t0) / 0.4) % 4]] + 12, 0.04 * v, 0.6); phrase(t0 + 19, [5, 4, 2, 3, -1, 4], 1.0, 0.07 * v); },
    title(t0, t1, v) { [0, 2, 4, 7].forEach((d, i) => santoor(t0 + 0.5 + i * 0.35, PENTA[d], 0.16 * v)); tabla(t0 + 0.5, 'ge', 0.3 * v); tabla(t0 + 1.9, 'na', 0.2 * v); tabla(t0 + 2.2, 'na', 0.15 * v); kalimba(t0 + 2.5, 84, 0.1 * v); },
    tick(t0, t1, v) { let k = 0; for (let t = t0; t < t1; t += 0.75, k++) tabla(t, k % 2 ? 'ti' : 'na', 0.09 * v, k % 2 ? 0.6 : 0.4); pad(t0, [52, 59, 64], t1 - t0, 0.03 * v); for (let t = t0 + 4; t < t1 - 4; t += 9) phrase(t, [2, 3, 4, 3], 0.9, 0.05 * v); },
    heartbeat(t0, t1, v) { for (let t = t0; t < t1; t += 0.9) { tabla(t, 'ge', 0.22 * v); tabla(t + 0.22, 'ge', 0.12 * v); } },
    heartbeat_fast(t0, t1, v) { for (let t = t0; t < t1; t += 0.6) { tabla(t, 'ge', 0.24 * v); tabla(t + 0.18, 'ge', 0.13 * v); } },
    kalimba_curious(t0, t1, v) { [4, -1, 5, 4, -1, 7, -1, 5, 4].forEach((d, i) => { if (d >= 0) kalimba(t0 + 0.4 + i * 0.75, PENTA[d] + 12, 0.11 * v); }); },
    joy_run(t0, t1, v) { for (let i = 0; i < 16; i++) santoor(t0 + 0.6 + i * 0.09, PENTA[i % 10] + (i > 9 ? 12 : 0), 0.1 * v, 0.3 + i * 0.03); for (let i = 0; i < 8; i++) tabla(t0 + 0.6 + i * 0.12, i % 2 ? 'na' : 'ti', 0.15 * v); pad(t0 + 1, [60, 64, 67], t1 - t0 - 1, 0.04 * v); },
    kalimba_play(t0, t1, v) { const m = [4, 5, 7, 5, 4, 2, 4, -1, 2, 4, 5, 4, 2, 0, 2, -1]; let i = 0; for (let t = t0; t < t1; t += 0.32, i++) { const d = m[i % m.length]; if (d >= 0) kalimba(t, PENTA[d] + 12, 0.08 * v, 0.4 + (i % 3) * 0.1); if (i % 4 === 0) tabla(t, 'ti', 0.08 * v); if (i % 8 === 0) tabla(t, 'ge', 0.1 * v); } },
    flute_question(t0, t1, v) { phrase(t0 + 0.5, [4, 3, 2, -1, 3, 4, 5], 1.3, 0.08 * v); phrase(t0 + 10, [5, 4, -1, 3, 4], 1.5, 0.07 * v); },
    pad_low(t0, t1, v) { pad(t0, [45, 52], t1 - t0, 0.05 * v); },
    cry_phrase(t0, t1, v) { phrase(t0, [2, 1, 0], 0.7, 0.1 * v, 0, 1.3); phrase(t0 + 4, [2, 1, 0], 0.8, 0.06 * v, 0, 1.3); },
    end_note(t0, t1, v) { kalimba(t0, 79, 0.14 * v); kalimba(t0 + 0.5, 84, 0.08 * v); },
    // Episode 1 themes
    drop_theme(t0, t1, v) { for (let t = t0; t < t1; t += 4) [7, 9, 7, 5].forEach((d, i) => kalimba(t + i * 0.45, PENTA[d] + 12, 0.08 * v)); pad(t0, [55, 62, 67], t1 - t0, 0.035 * v); },
    dance(t0, t1, v) {   // bouncy 6/8: tabla + santoor melody
      const m = [4, 5, 7, 5, 4, 2, 4, 5, 4, 2, 0, -1]; let i = 0;
      for (let t = t0; t < t1; t += 0.25, i++) {
        if (i % 6 === 0) tabla(t, 'ge', 0.16 * v); if (i % 6 === 3) tabla(t, 'na', 0.11 * v); if (i % 6 === 5) tabla(t, 'ti', 0.07 * v);
        const d = m[i % m.length]; if (d >= 0 && i % 2 === 0) santoor(t, PENTA[d] + 12, 0.06 * v, 0.6);
        if (i % 24 === 0) pad(t, [60, 64, 67], 6, 0.03 * v);
      }
    },
    rain_drums(t0, t1, v) { let i = 0; for (let t = t0; t < t1; t += 0.3, i++) { tabla(t, i % 4 === 0 ? 'ge' : 'ti', (i % 4 === 0 ? 0.14 : 0.06) * v); } pad(t0, [48, 55, 60, 64], t1 - t0, 0.05 * v); },
    build(t0, t1, v) { let i = 0; for (let t = t0; t < t1; t += 0.25, i++) { const k = (t - t0) / (t1 - t0); tabla(t, i % 2 ? 'ti' : 'na', (0.05 + k * 0.1) * v); } pad(t0, [48, 55, 62, 67], t1 - t0, 0.06 * v); phrase(t0 + 2, [2, 3, 4, 5, 7], 1.4, 0.07 * v); },
    ride(t0, t1, v) {   // the upbeat "boat song"
      const m = [4, 4, 5, 7, 5, 4, 2, 4, 5, 5, 7, 9, 7, 5, 4, -1]; let i = 0;
      for (let t = t0; t < t1; t += 0.22, i++) {
        if (i % 4 === 0) tabla(t, 'ge', 0.16 * v); if (i % 4 === 2) tabla(t, 'na', 0.12 * v); if (i % 2 === 1) tabla(t, 'ti', 0.05 * v);
        const d = m[i % m.length]; if (d >= 0) santoor(t, PENTA[d] + 12, 0.07 * v, 0.6);
        if (i % 32 === 0) { pad(t, [60, 64, 67, 72], 7.2, 0.04 * v); phrase(t + 1.76, [7, 5, 4, 5], 0.88, 0.06 * v); }
      }
    },
    hold(t0, t1, v) { flute(t0, 88, t1 - t0, 0.05 * v); },
    calm(t0, t1, v) { phrase(t0 + 0.5, [4, 5, 4, 2, -1, 3, 2], 1.4, 0.07 * v); for (let t = t0; t < t1; t += 0.8) santoor(t, PENTA[[0, 4, 2, 4][Math.round((t - t0) / 0.8) % 4]] + 12, 0.04 * v, 0.6); },
    wonder(t0, t1, v) { phrase(t0 + 0.3, [2, 3, 4, 5, 7, 9], (t1 - t0 - 1) / 6, 0.08 * v); pad(t0, [60, 67, 72, 76], t1 - t0, 0.05 * v); },
    bright_chord(t0, t1, v) { pad(t0, [60, 64, 67, 72, 76], t1 - t0, 0.1 * v); flute(t0 + 1, 84, t1 - t0 - 1.5, 0.05 * v); },
    end_sting(t0, t1, v) { [0, 2, 4].forEach((d, i) => santoor(t0 + i * 0.4, PENTA[d] + 12, 0.15 * v)); kalimba(t0 + 1.4, 84, 0.1 * v); },
  };

  /* ---------- sound effects ---------- */
  const PL = [60, 62, 64, 67, 69, 72, 74];
  function sfx(name, t, a) {
    switch (name) {
      case 'paper': noise(t, 0.6, 0.06, 0.5, 0.5, (u) => Math.sin(Math.PI * u / 0.6)); break;
      case 'pencil': noise(t, a || 2, 0.035, 0.6, 0.4, (u) => 0.6 + 0.4 * Math.abs(Math.sin(u * 9)), true); break;
      case 'scratch': noise(t, 0.4, 0.05, 0.6, 0.5, (u) => Math.sin(Math.PI * u / 0.4), true); break;
      case 'falls': bus = amb; noise(t, (opts.duration - t), 0.05, 0.05, 0.6, (u, d) => Math.min(1, u / 2) * Math.min(1, (d - u) / 2)); bus = fx; break;
      case 'birds': for (let i = 0; i < 3; i++) { sweep(t + i * 0.22, 2600, 3400, 0.08, 0.03, 0.75); sweep(t + i * 0.22 + 0.09, 3200, 2500, 0.07, 0.025, 0.75); } break;
      case 'breeze': case 'wind': bus = amb; noise(t, a || 4, name === 'wind' ? 0.16 : 0.09, 0.03, 0.5, (u, d) => Math.min(1, u / 1.2) * Math.min(1, (d - u) / 1.5) * (0.7 + 0.3 * Math.sin(u * 1.3))); bus = fx; break;
      case 'rustle': noise(t, 0.6, 0.06, 0.4, 0.6, (u) => Math.sin(Math.PI * u / 0.6) * (0.6 + 0.4 * Math.sin(u * 60)), true); break;
      case 'thock': tabla(t, 'ge', 0.3); noise(t, 0.12, 0.12, 0.3); break;
      case 'creak': sweep(t, 180, 140, 0.5, 0.06, 0.5, 'tri'); break;
      case 'sparkle': case 'tinkle': [96, 100, 103].forEach((m, i) => kalimba(t + i * 0.07, m, 0.05)); break;
      case 'tik': case 'tak': noise(t, 0.05, 0.2, 0.6, 0.5, (u) => Math.exp(-u * 120), true); break;
      case 'pluck': santoor(t, PL[a] + 12, 0.16, 0.55); break;
      case 'whoosh': noise(t, 0.8, 0.07, 0.12, 0.5, (u) => Math.sin(Math.PI * u / 0.8)); break;
      case 'pat': noise(t, 0.08, 0.1, 0.2, 0.5, (u) => Math.exp(-u * 60)); break;
      case 'grind': sweep(t, 70, 55, a || 2, 0.08, 0.5, 'tri'); noise(t, a || 2, 0.04, 0.1); break;
      case 'plink': case 'plip': kalimba(t, 91, 0.1); break;
      case 'tok': tabla(t, 'ti', 0.3); break;
      case 'rattle': for (let i = 0; i < 18; i++) tabla(t + rand() * (a || 2), 'ti', 0.06 + rand() * 0.06, 0.3 + rand() * 0.4); break;
      case 'ding': kalimba(t, 88, 0.14); break;
      case 'slide': noise(t, a || 3, 0.06, 0.15, 0.5, (u, d) => Math.min(1, u / 0.3) * Math.min(1, (d - u) / 0.3), true); break;
      case 'bump': tabla(t, 'ge', 0.25); break;
      case 'hop': sweep(t, 400, 700, 0.15, 0.05); break;
      case 'roll': noise(t, a || 5, 0.05, 0.05, 0.5, (u, d) => Math.min(1, (d - u) / 1) * (0.6 + 0.4 * Math.sin(u * 14))); break;
      case 'fwump': noise(t, 0.3, 0.12, 0.04, 0.5, (u) => Math.exp(-u * 10)); break;
      case 'chime': [84, 88, 91, 96].forEach((m, i) => kalimba(t + i * 0.12, m, 0.07, 0.3 + i * 0.12)); break;
      case 'crack': noise(t, 0.12, 0.3, 0.7, 0.5, (u) => Math.exp(-u * 50), true); sweep(t, 2400, 1200, 0.05, 0.05); break;
      case 'tap': tabla(t, 'ti', 0.15); break;
      case 'squeak': squeak(t, 900, 1500, 0.18); break;
      case 'pop': sweep(t, 300, 900, 0.1, 0.14); noise(t, 0.08, 0.1, 0.5); break;
      case 'sniff': noise(t, 0.12, 0.08, 0.5, 0.5, (u) => Math.sin(Math.PI * u / 0.12), true); break;
      case 'ahh': squeak(t, 700, 1000, a || 1, 0.07); break;
      case 'tchoo': squeak(t, 1400, 600, 0.16, 0.16); noise(t, 0.2, 0.14, 0.5, 0.5, (u) => Math.exp(-u * 18), true); break;
      case 'giggle': for (let i = 0; i < 5; i++) squeak(t + i * 0.1, 1100 + (i % 2) * 180, 1300 + (i % 2) * 120, 0.07, 0.1); break;
      case 'laugh': for (let i = 0; i < 8; i++) squeak(t + i * 0.12, 950 + (i % 2) * 220, 1250 + (i % 2) * 150, 0.09, 0.12); break;
      case 'plop': tabla(t, 'ge', 0.2); break;
      case 'ticks': for (let k = 0; k < (a || 3) * 6; k++) noise(t + k / 6, 0.02, 0.05, 0.7, 0.5, (u) => Math.exp(-u * 200), true); break;
      case 'buzz': sweep(t, 180, 230, a || 1.5, 0.04, 0.5, 'tri'); break;
      case 'brrr': for (let i = 0; i < 6; i++) squeak(t + i * 0.06, 500, 450, 0.05, 0.07); break;
      case 'whimper': squeak(t, 900, 650, (a || 2) * 0.45, 0.12); squeak(t + (a || 2) * 0.5, 820, 560, (a || 2) * 0.45, 0.1); break;
      case 'sniffle': noise(t, 0.25, 0.07, 0.5, 0.5, (u) => Math.sin(Math.PI * u / 0.25), true); break;
      case 'note': kalimba(t, 79, 0.14); break;
      case 'rain': bus = amb; noise(t, a[0], a[1], 0.5, 0.5, (u, d) => Math.min(1, u / 2) * Math.min(1, (d - u) / 2), true); bus = fx; break;
      case 'thunder': noise(t, 2.5, 0.1, 0.01, 0.5, (u) => Math.min(1, u / 0.6) * Math.exp(-u * 1.2)); break;
      case 'water': bus = amb; noise(t, a[0], a[1], 0.08, 0.5, (u, d) => Math.min(1, u / 2) * Math.min(1, (d - u) / 2) * (0.8 + 0.2 * Math.sin(u * 2.3))); bus = fx; break;
      case 'splash': noise(t, 0.5, 0.18, 0.25, 0.5, (u) => Math.exp(-u * 7)); sweep(t, 600, 200, 0.2, 0.05); break;
      case 'blup': sweep(t, 300, 700, 0.12, 0.1); break;
      case 'gulp': sweep(t, 500, 250, 0.12, 0.1); kalimba(t + 0.1, 96, 0.06); break;
      case 'wah': sweep(t, 500, 350, 0.5, 0.06); break;
      case 'chirr': for (let i = 0; i < 8; i++) sweep(t + i * 0.03, 3000, 3600, 0.02, 0.025); break;
      case 'shloop': sweep(t, 200, 500, 0.4, 0.08); noise(t, 0.5, 0.08, 0.2); break;
      case 'whee': squeak(t, 900, 1700, 0.6, 0.12); break;
      case 'shake': noise(t, 0.6, 0.08, 0.6, 0.5, (u) => (0.6 + 0.4 * Math.sin(u * 70)) * Math.sin(Math.PI * u / 0.6), true); break;
      case 'hum': squeak(t, 600, 640, 0.5, 0.06); break;
      case 'roar': bus = amb; noise(t, a[0], a[1], 0.02, 0.5, (u, d) => Math.min(1, u / 3) * Math.min(1, (d - u) / 1)); bus = fx; break;
    }
  }

  // music
  bus = mus;
  for (const [t0, t1, th, vol] of opts.music || []) { if (themes[th]) themes[th](t0, t1, vol); }
  bus = fx;
  for (const c of opts.cues || []) sfx(c[0], c[1], c[2]);

  // mix: music, effects, ambience; gentle limiter; normalize; fade the very end
  const L = new Float32Array(N), R = new Float32Array(N);
  let sq = 0;
  for (let i = 0; i < N; i++) {
    L[i] = mus[0][i] * 0.9 + fx[0][i] + amb[0][i]; R[i] = mus[1][i] * 0.9 + fx[1][i] + amb[1][i];
    sq += L[i] * L[i] + R[i] * R[i];
  }
  // loudness, not the single loudest click, sets the level; a soft limiter tames the peaks
  const rms = Math.sqrt(sq / (2 * N)) || 1e-6, k = 0.11 / rms, data = Buffer.alloc(N * 4);
  for (let i = 0; i < N; i++) {
    const g = Math.min(1, i / (0.3 * SR)) * Math.min(1, (N - i) / (0.8 * SR));
    const l = Math.tanh(L[i] * k * 1.1) * 0.9 * g, r = Math.tanh(R[i] * k * 1.1) * 0.9 * g;
    data.writeInt16LE(Math.round(l * 32767), i * 4); data.writeInt16LE(Math.round(r * 32767), i * 4 + 2);
  }
  const h = Buffer.alloc(44);
  h.write('RIFF', 0); h.writeUInt32LE(36 + data.length, 4); h.write('WAVE', 8); h.write('fmt ', 12); h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(2, 22);
  h.writeUInt32LE(SR, 24); h.writeUInt32LE(SR * 4, 28); h.writeUInt16LE(4, 32); h.writeUInt16LE(16, 34); h.write('data', 36); h.writeUInt32LE(data.length, 40);
  fs.writeFileSync(out, Buffer.concat([h, data]));
}
module.exports = { score };
