// Cheerful, kid-friendly background music + light game sound effects, fully synthesized here
// (no samples, no downloads, so no licensing questions). Writes a 16-bit stereo 48 kHz WAV.
//
//   const { music } = require('./music');
//   music(outWav, seconds, { events: [{ t: 3.2, type: 'coin' }, ...], endAt: 26 })
//
// Music: 120 bpm, C major, I–vi–IV–V. Ukulele-style plucked chords (Karplus–Strong), bouncy bass,
// marimba melody, soft kick / clap / shaker. Effects: jump, coin, rescue, roar, splash, bonk, grow, climb.
const fs = require('fs');

const SR = 48000, TAU = Math.PI * 2;
const hz = m => 440 * Math.pow(2, (m - 69) / 12);

function rng(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }

function music(out, seconds, opts = {}) {
  const N = Math.ceil(seconds * SR), mL = new Float32Array(N), mR = new Float32Array(N);
  const xL = new Float32Array(N), xR = new Float32Array(N);
  let L = mL, R = mR;                              // music bus first, then the effects bus
  const rand = rng(opts.seed || 7);
  const BPM = 120, BEAT = 60 / BPM, BAR = BEAT * 4;
  const endAt = opts.endAt ?? seconds;            // music resolves on a final chord here
  const add = (i, v, pan = 0.5) => { if (i >= 0 && i < N) { L[i] += v * (1 - pan) * 2 * 0.5; R[i] += v * pan * 2 * 0.5; } };

  // --- instruments
  function pluck(t0, m, vol, pan, dur = 0.9) {     // Karplus–Strong string
    const f = hz(m), p = Math.max(2, Math.round(SR / f)), buf = new Float32Array(p);
    for (let i = 0; i < p; i++) buf[i] = rand() * 2 - 1;
    const s0 = Math.round(t0 * SR), n = Math.round(dur * SR);
    let idx = 0;
    for (let i = 0; i < n; i++) {
      const a = buf[idx], b = buf[(idx + 1) % p];
      buf[idx] = 0.5 * (a + b) * 0.996;
      idx = (idx + 1) % p;
      add(s0 + i, a * vol * Math.min(1, (n - i) / (0.05 * SR)), pan);
    }
  }
  function marimba(t0, m, vol, pan = 0.5) {
    const f = hz(m), s0 = Math.round(t0 * SR), n = Math.round(0.7 * SR);
    for (let i = 0; i < n; i++) {
      const t = i / SR;
      const v = Math.sin(TAU * f * t) * Math.exp(-t * 7) + 0.35 * Math.sin(TAU * f * 4 * t) * Math.exp(-t * 22) + 0.1 * Math.sin(TAU * f * 10 * t) * Math.exp(-t * 60);
      add(s0 + i, v * vol * Math.min(1, t / 0.002), pan);
    }
  }
  function bass(t0, m, vol, dur) {
    const f = hz(m), s0 = Math.round(t0 * SR), n = Math.round(dur * SR);
    for (let i = 0; i < n; i++) {
      const t = i / SR, env = Math.min(1, t / 0.005) * Math.exp(-t * 3) * Math.min(1, (n - i) / (0.02 * SR));
      add(s0 + i, vol * env * (Math.sin(TAU * f * t) + 0.3 * Math.sin(TAU * 2 * f * t) + 0.12 * Math.sin(TAU * 3 * f * t)), 0.5);
    }
  }
  function kick(t0, vol) {
    const s0 = Math.round(t0 * SR), n = Math.round(0.25 * SR); let ph = 0;
    for (let i = 0; i < n; i++) { const t = i / SR, f = 50 + 110 * Math.exp(-t * 30); ph += TAU * f / SR; add(s0 + i, vol * Math.sin(ph) * Math.exp(-t * 14), 0.5); }
  }
  function noiseHit(t0, vol, dur, decay, hp, pan = 0.5) {   // clap / shaker: one-pole filtered noise
    const s0 = Math.round(t0 * SR), n = Math.round(dur * SR); let lp = 0;
    for (let i = 0; i < n; i++) {
      const t = i / SR, x = rand() * 2 - 1; lp += (x - lp) * hp; const v = x - lp;
      add(s0 + i, vol * v * Math.exp(-t * decay), pan);
    }
  }
  function sweep(t0, f0, f1, dur, vol, shape = 'sine', pan = 0.5) {
    const s0 = Math.round(t0 * SR), n = Math.round(dur * SR); let ph = 0;
    for (let i = 0; i < n; i++) {
      const u = i / n, f = f0 * Math.pow(f1 / f0, u); ph += TAU * f / SR;
      let w = Math.sin(ph); if (shape === 'square') w = Math.sign(w) * 0.5 + w * 0.3;
      add(s0 + i, vol * w * Math.min(1, i / 100) * (1 - u) ** 1.2, pan);
    }
  }

  // --- the song
  const prog = [[48, [60, 64, 67]], [45, [57, 60, 64, 69]], [41, [57, 60, 65]], [43, [59, 62, 67]]]; // C Am F G
  const scale = [60, 62, 64, 67, 69, 72, 74, 76, 79];   // C major pentatonic, so every note fits
  // two catchy 1-bar motifs (scale degrees, -1 = rest), reused across the progression
  const motifs = [[4, -1, 5, 4, 2, -1, 3, 2], [2, 3, 4, -1, 6, 5, 4, -1], [5, -1, 4, 2, 3, -1, 1, 2], [3, 4, 5, 7, 6, -1, 5, -1]];
  const bars = Math.ceil(endAt / BAR);
  for (let b = 0; b < bars; b++) {
    const t0 = b * BAR, [root, chord] = prog[b % 4], intro = b === 0 && opts.softIntro;
    // bass: root on 1, fifth on the "and" of 2, root on 3, octave pickup on 4
    bass(t0, root, 0.22, BEAT * 0.9); bass(t0 + BEAT * 1.5, root + 7, 0.16, BEAT * 0.45);
    bass(t0 + BEAT * 2, root, 0.2, BEAT * 0.9); bass(t0 + BEAT * 3.5, root + 12, 0.13, BEAT * 0.4);
    // ukulele: off-beat strums (each strum = notes a few ms apart)
    for (let k = 0; k < 4; k++) {
      const ts = t0 + BEAT * k + BEAT * 0.5;
      chord.forEach((m, j) => pluck(ts + j * 0.012, m, 0.16, 0.35 + 0.1 * j, 0.6));
    }
    // drums
    if (!intro && opts.drums !== false) {
      kick(t0, 0.5); kick(t0 + BEAT * 2, 0.45); if (b % 2) kick(t0 + BEAT * 2.75, 0.25);
      noiseHit(t0 + BEAT, 0.16, 0.18, 22, 0.25); noiseHit(t0 + BEAT * 3, 0.16, 0.18, 22, 0.25);
      for (let k = 0; k < 8; k++) noiseHit(t0 + k * BEAT / 2, k % 2 ? 0.05 : 0.03, 0.06, 70, 0.9, 0.7);
    }
    // marimba melody (from bar 1), octave up on the last pass
    if (b >= 1) {
      const mo = motifs[(b - 1) % motifs.length];
      mo.forEach((d, k) => { if (d >= 0) marimba(t0 + k * BEAT / 2, scale[d] + (b >= 8 ? 12 : 0), 0.13, 0.45 + 0.1 * Math.sin(k)); });
    }
  }
  // final chord on the end card
  const tEnd = bars * BAR;
  if (tEnd < seconds) {
    bass(tEnd, 48, 0.25, 1.6); kick(tEnd, 0.5);
    [60, 64, 67, 72].forEach((m, j) => pluck(tEnd + j * 0.02, m, 0.2, 0.3 + 0.13 * j, 2.2));
    [72, 76, 79, 84].forEach((m, j) => marimba(tEnd + j * 0.09, m, 0.12));
  }

  // --- sound effects at gameplay / story events
  L = xL; R = xR;
  const VOICE = { rex: 330, tiko: 420, stella: 470, pip: 620, momo: 250, wren: 290, gnash: 190, raptor: 230,
                  baby: 520, mama: 300, nix: 560, babyTiko: 600, flick: 760, friend: 420 };
  function blip(t0, f, vol, dur = 0.065) {
    const s0 = Math.round(t0 * SR), n = Math.round(dur * SR);
    for (let i = 0; i < n; i++) {
      const t = i / SR, env = Math.sin(Math.PI * i / n);
      const tri = 2 / Math.PI * Math.asin(Math.sin(TAU * f * t));
      add(s0 + i, vol * env * (0.7 * tri + 0.3 * Math.sin(TAU * 2 * f * t)), 0.5);
    }
  }
  for (const e of opts.events || []) {
    const t = e.t;
    switch (e.type) {
      case 'jump': sweep(t, 330, 760, 0.14, 0.09); break;
      case 'coin': sweep(t, 1976, 1976, 0.07, 0.05, 'square', 0.6); sweep(t + 0.07, 2637, 2637, 0.16, 0.05, 'square', 0.6); break;
      case 'rescue': [72, 76, 79, 84, 88].forEach((m, j) => marimba(t + j * 0.07, m, 0.16)); break;
      case 'grow': [60, 64, 67, 72, 76, 79, 84].forEach((m, j) => marimba(t + j * 0.11, m, 0.14)); break;
      case 'roar': sweep(t, 140, 70, 0.55, 0.22, 'square'); noiseHit(t, 0.12, 0.5, 5, 0.08); break;
      case 'splash': noiseHit(t, 0.2, 0.35, 9, 0.2); break;
      case 'hurt': sweep(t, 520, 180, 0.22, 0.12, 'square'); break;
      case 'climb': sweep(t, 400, 900, 0.18, 0.07); break;
      case 'hit': sweep(t, 200, 90, 0.25, 0.2, 'square'); noiseHit(t, 0.1, 0.2, 20, 0.3); break;
      case 'whoosh': noiseHit(t, 0.08, 0.35, 8, 0.6); break;
      case 'pop': marimba(t, 84, 0.12); break;
      case 'talk': {   // cute "dino chatter" instead of a voice: one blip per syllable
        const base = (VOICE[e.voice] || 400) * (e.pitch || 1);
        for (let i = 0; i < (e.n || 6); i++) blip(t + i * 0.085, base * Math.pow(2, (Math.floor(rand() * 7) - 3) / 12), 0.07);
        break;
      }
      case 'boing': sweep(t, 180, 620, 0.32, 0.16); sweep(t + 0.05, 200, 700, 0.3, 0.06, 'square'); break;
      case 'bonk': sweep(t, 300, 110, 0.18, 0.22, 'square'); noiseHit(t, 0.12, 0.12, 30, 0.3); break;
      case 'thud': kick(t, 0.7); noiseHit(t, 0.1, 0.2, 25, 0.1); break;
      case 'slideDown': sweep(t, 1400, 300, e.dur || 0.7, 0.1); break;
      case 'slideUp': sweep(t, 300, 1400, e.dur || 0.6, 0.1); break;
      case 'squeak': sweep(t, 1500, 2300, 0.12, 0.1); sweep(t + 0.12, 2300, 1800, 0.1, 0.08); break;
      case 'hic': sweep(t, 700, 1300, 0.08, 0.14, 'square'); break;
      case 'inhale': noiseHit(t, 0.06, e.dur || 0.8, 1.2, 0.5); sweep(t, 200, 400, e.dur || 0.8, 0.03); break;
      case 'bigRoar': sweep(t, 160, 60, 1.2, 0.35, 'square'); noiseHit(t, 0.25, 1.1, 2.5, 0.06); kick(t, 0.8); break;
      case 'giggle': for (let i = 0; i < 5; i++) blip(t + i * 0.09, (VOICE[e.voice] || 500) * 1.3 * (1 + (i % 2) * 0.12), 0.08, 0.06); break;
      case 'tada': [60, 64, 67].forEach((m, j) => marimba(t + j * 0.08, m + 12, 0.16)); marimba(t + 0.3, 84, 0.2); [60, 64, 67, 72].forEach(m => pluck(t + 0.3, m, 0.12, 0.5, 1.4)); break;
      case 'ding': marimba(t, 88, 0.16); break;
      case 'eep': sweep(t, 900, 1900, 0.18, 0.12, 'square'); break;
      case 'munch': for (let i = 0; i < 3; i++) noiseHit(t + i * 0.16, 0.12, 0.07, 40, 0.5); break;
      case 'scratch': noiseHit(t, 0.2, 0.25, 6, 0.4); sweep(t, 900, 200, 0.25, 0.08, 'square'); break;
      case 'sniff': for (let i = 0; i < 3; i++) noiseHit(t + i * 0.13, 0.1, 0.09, 25, 0.7); break;
      case 'ribbit': sweep(t, 160, 120, 0.12, 0.2, 'square'); sweep(t + 0.16, 170, 120, 0.12, 0.2, 'square'); break;
      case 'snore': sweep(t, 90, 140, 0.9, 0.1, 'square'); noiseHit(t, 0.03, 0.9, 2, 0.1); break;
      case 'twinkle': [84, 88, 91, 96].forEach((m, j) => marimba(t + j * 0.06, m, 0.08)); break;
      case 'wobble': for (let i = 0; i < 6; i++) sweep(t + i * 0.08, 300 + (i % 2) * 120, 300 + ((i + 1) % 2) * 120, 0.08, 0.08); break;
      case 'clink': marimba(t, 96, 0.08); marimba(t + 0.03, 101, 0.06); break;
      case 'achoo': sweep(t, 900, 1500, 0.12, 0.08); noiseHit(t + 0.12, 0.35, 0.45, 7, 0.35); sweep(t + 0.12, 700, 160, 0.35, 0.14, 'square'); break;
      case 'aah': sweep(t, 500 * (e.pitch || 1), 640 * (e.pitch || 1), e.dur || 0.5, 0.07); break;
      case 'sigh': noiseHit(t, 0.07, 0.8, 2.5, 0.6); sweep(t, 420, 260, 0.8, 0.04); break;
      case 'tiptoe': blip(t, 980, 0.05, 0.05); blip(t + 0.18, 1170, 0.05, 0.05); break;
      case 'leaves': noiseHit(t, 0.12, 0.5, 6, 0.8); break;
      case 'fwoosh': noiseHit(t, 0.28, 0.9, 3, 0.15); sweep(t, 120, 260, 0.6, 0.12, 'square'); break;
    }
  }
  // music mutes (comic pauses), with 80 ms ramps
  const gate = new Float32Array(N).fill(1), ramp = Math.round(0.08 * SR);
  for (const [a, b] of opts.mutes || []) {
    const s0 = Math.round(a * SR), s1 = Math.round(b * SR);
    for (let i = Math.max(0, s0 - ramp); i < Math.min(N, s1 + ramp); i++) {
      const g = i < s0 ? (s0 - i) / ramp : i > s1 ? (i - s1) / ramp : 0;
      gate[i] = Math.min(gate[i], g);
    }
  }
  L = new Float32Array(N); R = new Float32Array(N);
  const mv = opts.musicVol ?? 1;
  for (let i = 0; i < N; i++) { L[i] = mL[i] * gate[i] * mv + xL[i]; R[i] = mR[i] * gate[i] * mv + xR[i]; }

  // --- master: fade in/out, gentle limiter, normalize to -1 dBFS
  const fadeOut = Math.round(Math.min(1.2, seconds * 0.1) * SR);
  let peak = 0;
  for (let i = 0; i < N; i++) {
    const g = Math.min(1, i / (0.05 * SR)) * Math.min(1, (N - i) / fadeOut);
    L[i] = Math.tanh(L[i] * 1.4) * g; R[i] = Math.tanh(R[i] * 1.4) * g;
    peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
  }
  const norm = 0.89 / (peak || 1);
  const data = Buffer.alloc(N * 4);
  for (let i = 0; i < N; i++) {
    data.writeInt16LE(Math.round(Math.max(-1, Math.min(1, L[i] * norm)) * 32767), i * 4);
    data.writeInt16LE(Math.round(Math.max(-1, Math.min(1, R[i] * norm)) * 32767), i * 4 + 2);
  }
  const h = Buffer.alloc(44);
  h.write('RIFF', 0); h.writeUInt32LE(36 + data.length, 4); h.write('WAVE', 8); h.write('fmt ', 12);
  h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(2, 22); h.writeUInt32LE(SR, 24);
  h.writeUInt32LE(SR * 4, 28); h.writeUInt16LE(4, 32); h.writeUInt16LE(16, 34); h.write('data', 36); h.writeUInt32LE(data.length, 40);
  fs.writeFileSync(out, Buffer.concat([h, data]));
}

module.exports = { music };
if (require.main === module) music(process.argv[2] || 'rex-music-test.wav', +(process.argv[3] || 20), { endAt: +(process.argv[3] || 20) - 3 });
