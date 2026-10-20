// Rex v3 look sheet (after the owner's pencil reference).
(function () {
  const A = window.ART, F = window.FILM;
  const base = { duration: 1, camera: [[0, 960, 540, 1]], wind: () => 0 };
  const label = (txt, x, y, size = 28) => { const c = A.ctx(); c.save(); c.font = `${size}px 'Patrick Hand'`; c.fillStyle = '#3a3530'; c.textAlign = 'center'; c.fillText(txt, x, y); c.restore(); };
  const ground = y => { const c = A.ctx(); c.save(); c.strokeStyle = 'rgba(42,39,36,0.45)'; c.lineWidth = 2; c.beginPath(); c.moveTo(40, y); c.lineTo(1880, y); c.stroke(); c.restore(); };
  F.episode('v3hero', { ...base, draw() {   // the reference pose, big
    ground(980);
    A.rex3(900, 985, 3.0, { mouth: 'grin', eye: { look: [0.5, -0.2] }, brow: 0.4, headTilt: -0.05, legs: { far: { dx: -8, lift: 10, rot: 0.3 }, near: { dx: 10 } } });
  } });
  F.episode('v3sheet', { ...base, draw() {
    ground(900);
    const L = [
      ['grin (like your sketch)', { mouth: 'grin', eye: { look: [0.5, -0.2] }, brow: 0.4, legs: { far: { dx: -8, lift: 10, rot: 0.3 }, near: { dx: 10 } } }],
      ['smile', { mouth: 'smile', eye: { look: [0.35, 0] } }],
      ['big laugh', { mouth: 'grin', open: 0.8, eye: { closed: 'happy' }, brow: 0.6, headTilt: -0.12, blush: 1, tail: { up: 0.4 } }],
      ['sad', { mouth: 'sad', eye: { look: [0, 0.5], lid: 0.8 }, brow: -1, headTilt: 0.18, tail: { up: -0.4 }, arms: { near: [1.4, 1.5], far: [1.5, 1.5] } }],
      ['surprised', { mouth: 'o', eye: { look: [0.3, -0.3] }, brow: 1, headTilt: -0.08 }],
      ['with eggshell cap', { mouth: 'smile', eye: { look: [0.35, 0] }, hat: true }],
    ];
    L.forEach(([n, pose], i) => { A.rex3(215 + i * 310, 900, 1.0, pose); label(n, 205 + i * 310, 960, 26); });
  } });
})();
