// Generates a soft background track (warm pad + gentle plucked arpeggio + light pulse) as a 16-bit
// stereo WAV, fully synthesized here, so there are no music licensing issues.
// Usage: node synth.js <out.wav> <seconds> [rootMidi] [seed]
const fs = require('fs');

function synth(out, seconds, root = 57, seed = 1) {
  const SR = 44100, N = Math.ceil(seconds * SR);
  const L = new Float32Array(N), R = new Float32Array(N);
  const hz = m => 440 * Math.pow(2, (m - 69) / 12);
  // I–V–vi–IV style progressions (semitones from the root), 4 s per chord
  const progs = [[[0, 4, 7], [7, 11, 14], [9, 12, 16], [5, 9, 12]],
                 [[0, 4, 7], [9, 12, 16], [5, 9, 12], [7, 11, 14]],
                 [[0, 4, 7], [5, 9, 12], [9, 12, 16], [7, 11, 14]]];
  const prog = progs[(seed - 1) % progs.length];
  const BAR = 4, tau = Math.PI * 2;

  // Pad: detuned sines with slow attack/release, chords crossfade
  for (let c = 0; c * BAR < seconds + BAR; c++) {
    const chord = prog[c % prog.length], t0 = c * BAR - 0.5, len = BAR + 1.5;
    const s0 = Math.max(0, Math.floor(t0 * SR)), s1 = Math.min(N, Math.floor((t0 + len) * SR));
    for (const iv of chord) {
      const f = hz(root - 12 + iv);
      for (let s = s0; s < s1; s++) {
        const t = s / SR, lt = t - t0;
        const env = Math.min(1, lt / 1.2) * Math.min(1, (len - lt) / 1.5);
        const v = env * 0.05 * (Math.sin(tau * f * t) + 0.6 * Math.sin(tau * f * 1.003 * t + 1) + 0.15 * Math.sin(tau * f * 2 * t));
        L[s] += v * (1 + 0.15 * Math.sin(tau * 0.2 * t)); R[s] += v * (1 - 0.15 * Math.sin(tau * 0.2 * t));
      }
    }
  }
  // Pluck arpeggio: eighth notes at 120 bpm, soft decay, ping-pong panning
  const pattern = [0, 1, 2, 1, 2, 0, 1, 2];
  for (let k = 0; k * 0.5 < seconds; k++) {
    const t0 = k * 0.5, chord = prog[Math.floor(t0 / BAR) % prog.length];
    const f = hz(root + 12 + chord[pattern[k % 8]]);
    const s0 = Math.floor(t0 * SR), s1 = Math.min(N, s0 + Math.floor(1.2 * SR));
    const pan = k % 2 ? 0.35 : 0.65;
    for (let s = s0; s < s1; s++) {
      const lt = (s - s0) / SR;
      const v = 0.07 * Math.exp(-lt * 4.5) * Math.min(1, lt / 0.005) * (Math.sin(tau * f * lt) + 0.25 * Math.sin(tau * 2 * f * lt));
      L[s] += v * (1 - pan); R[s] += v * pan;
    }
  }
  // Soft low pulse on each beat
  for (let k = 0; k < seconds; k++) {
    const s0 = Math.floor(k * SR), s1 = Math.min(N, s0 + Math.floor(0.3 * SR));
    let ph = 0;
    for (let s = s0; s < s1; s++) {
      const lt = (s - s0) / SR; ph += tau * (45 + 70 * Math.exp(-lt * 30)) / SR;
      const v = 0.12 * Math.exp(-lt * 14) * Math.sin(ph);
      L[s] += v; R[s] += v;
    }
  }
  // Echo (ping-pong) for space, then one-pole low-pass for warmth
  const D = Math.floor(0.375 * SR);
  for (let s = D; s < N; s++) { L[s] += 0.28 * R[s - D]; R[s] += 0.28 * L[s - D]; }
  let lp = 0, rp = 0, peak = 0;
  for (let s = 0; s < N; s++) { lp += 0.35 * (L[s] - lp); rp += 0.35 * (R[s] - rp); L[s] = lp; R[s] = rp; peak = Math.max(peak, Math.abs(lp), Math.abs(rp)); }
  // Normalise to a low level (peak about -12 dBFS) with fade in / fade out
  const gain = 0.25 / peak, buf = Buffer.alloc(44 + N * 4);
  for (let s = 0; s < N; s++) {
    const t = s / SR, fade = Math.min(1, t / 1.0) * Math.min(1, (seconds - t) / 2.0);
    buf.writeInt16LE(Math.round(32767 * Math.max(-1, Math.min(1, L[s] * gain * fade))), 44 + s * 4);
    buf.writeInt16LE(Math.round(32767 * Math.max(-1, Math.min(1, R[s] * gain * fade))), 46 + s * 4);
  }
  buf.write('RIFF', 0); buf.writeUInt32LE(36 + N * 4, 4); buf.write('WAVEfmt ', 8);
  buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22); buf.writeUInt32LE(SR, 24);
  buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34); buf.write('data', 36); buf.writeUInt32LE(N * 4, 40);
  fs.writeFileSync(out, buf);
}

module.exports = synth;
if (require.main === module) synth(process.argv[2], +process.argv[3], +(process.argv[4] || 57), +(process.argv[5] || 1));
