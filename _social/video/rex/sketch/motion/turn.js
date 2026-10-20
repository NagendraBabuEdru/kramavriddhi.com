// Round 5 clip 2: head turn 45 → 0 → 90 → 45 (Bible §8.3 + the round 2b blink rules).
// Each turn: the pupils move first (2 f lead), the head yaw eases over 8–10 f, a blink at turn-f3 for turns over 20°,
// the hat and tail follow through on springs. The body stays in its ¾ view (body yaw = 45 + 30 % of the head's change
// stays inside 22.5…67.5, so no view switch happens in this clip).
(function () {
  const M = window.MOTION, E1 = { browCurve: 0.3, lidUp: 1, lidLo: 0, pupil: 0.58, mouth: 'M1', corners: 0.3 };
  const TURNS = [[15, 23, 45, 0], [50, 60, 0, 90], [90, 98, 90, 45]];   // [start f, end f, from yaw, to yaw]
  const N = 125;
  const yawAt = f => { let y = 45; for (const [a, b, y0, y1] of TURNS) { if (f >= b) y = y1; else if (f > a) y = y0 + (y1 - y0) * M.ease.inout((f - a) / (b - a)); } return y; };
  const lookFor = y => y < 22.5 ? [0, 0.05] : y > 67.5 ? [0.4, 0] : [0.15, 0];
  const BLINKS = M.blinkTimes(7, N).filter(b => !TURNS.some(([a, bb]) => b > a - 12 && b < bb + 12)).concat(TURNS.filter(([, , y0, y1]) => Math.abs(y1 - y0) > 20).map(([a]) => a + 3));
  M.clip('turn', { frames: N, at(t) {
    const f = t * M.FPS, yaw = yawAt(f), id = M.idle(f);
    const look = lookFor(yawAt(f + 2));   // the eyes lead by 2 f
    const drive = g => (yawAt(g) - 45) * 0.0035;
    return { x: 0, plant: ['near', 'far'], pose: {
      face: { ...E1, look, lidUp: M.blink(f, BLINKS) }, headYaw: yaw,
      squash: id.squash, bob: id.bob, neckDrop: id.neckDrop,
      arms: { near: [0.96 + id.armD, 0.26 + id.armD], far: [1.15 + id.armD * 0.8, 0.45 + id.armD * 0.8] },
      tail: { seg: (() => { const d = g => drive(g) * 1.5 + Math.sin(g / 96 * Math.PI * 2) * 0.05, sg = M.tailSeg(d, f); sg[0] += d(f); return sg; })() },
      hat: M.hat(drive, g => 0, f),
    } };
  } });
})();
