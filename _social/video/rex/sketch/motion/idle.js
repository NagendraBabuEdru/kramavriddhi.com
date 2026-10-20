// Round 5 clip 1: idle + blink (6 s), Bible §8.1 / §8.2. The reference clip for how to build clips with MOTION.
(function () {
  const M = window.MOTION, E1 = { browCurve: 0.3, lidUp: 1, lidLo: 0, pupil: 0.58, mouth: 'M1', corners: 0.3 };
  const N = 180, BLINKS = M.blinkTimes(11, N);
  M.clip('idle', { frames: N, at(t) {
    const f = t * M.FPS, id = M.idle(f), lid = M.blink(f, BLINKS);
    const headRot = g => 0, headY = g => M.idle(g).neckDrop;
    return { x: 0, plant: ['near', 'far'], pose: {
      face: { ...E1, look: id.look, lidUp: lid },
      squash: id.squash, bob: id.bob, neckDrop: id.neckDrop,
      arms: { near: [0.96 + id.armD, 0.26 + id.armD], far: [1.15 + id.armD * 0.8, 0.45 + id.armD * 0.8] },
      tail: { seg: id.tailSeg }, hat: M.hat(headRot, headY, f),
    } };
  } });
})();
