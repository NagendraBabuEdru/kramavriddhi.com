// Dev "episode": a model sheet of Rex's poses and the props, to check designs (sketch.html?ep=sheet).
(function () {
  const A = window.ART, F = window.FILM;
  F.episode('sheet', {
    duration: 1, camera: [[0, 960, 540, 1]], wind: () => 0,
    draw(T) {
      A.ground(760, 2);
      const poses = [
        { eye: 'open', mouth: 'smile' }, { eye: 'wide', mouth: 'o', look: [0.6, -0.4] }, { eye: 'happy', mouth: 'laugh', blush: 1 },
        { eye: 'sad', mouth: 'sad' }, { eye: 'squeeze', mouth: 'wail', tears: 1, tearT: 0.4, headTilt: -0.12 }, { eye: 'closed', mouth: 'smile', shellHat: 1 },
      ];
      poses.forEach((p, i) => A.rex(170 + i * 320, 1000, 1.0, { ...p, tail: 1 }, 21));
    },
  });
})();
