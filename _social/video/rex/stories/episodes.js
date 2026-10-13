// Story scripts for the Rex videos. Runs in the puppet-theatre page (see engine.js / make_stories.js).
// All characters, places and abilities come from Rex's Big Adventure: Old Wren teaches Rex to roar
// (Raptor Ridge), Rex climbs vines and Tiko teaches the double jump (Whispering Woods), Stella and Pip
// at Fern River, Momo, Gnash the Raptor King; and in the ink book, Little Rex, Baby Tiko's star ball,
// Flick the firefly and cheeky Nix. Each scene function adds its own actors and returns its end time,
// so the Shorts and the long episode reuse the same scenes.
(function () {
  const { Story, clamp } = window.StoryEngine;
  const G = 462;   // ground line of the colourful book

  // Camera helper: zoom 1 = the standard framing for this format, cx = world x to centre on.
  function cam(S, t, cx, zm = 1, dur = 0, groundAt) {
    const z = (S.portrait ? 3.6 : 3) * zm;
    const gy = groundAt ?? (S.portrait ? 1300 : 930);
    const half = S.W / 2 / z;
    cx = clamp(cx, half, 960 - half);
    let cy = G - (gy - S.H / 2) / z;
    S.camAt(t, cx, cy, z, dur);
  }
  // Show an actor only between t0 and t1.
  function life(a, t0, t1) { const on = a.base.alpha; a.base.alpha = 0; a.set(t0, { alpha: on }); if (t1 != null) a.set(t1, { alpha: 0 }); return a; }
  const say = (S, t, a, te, en, d) => S.say(t, a, te, en, d);

  /* ---------------- Scene: The Roar Lesson (Raptor Ridge) ---------------- */
  function sceneRoar(S, t0, o = {}) {
    const T = x => t0 + x, P = S.portrait;
    S.bgT.set(T(0), { type: 'game', theme: 2 });
    cam(S, T(0), P ? 470 : 480);
    const rock = life(S.actor('rock', { x: 528, y: G, w: 74, h: 44, z: 1 }), T(0), null);
    const rex = life(S.rex({ x: P ? 150 : 60, s: 1.3, z: 3, voice: 'rex' }), T(0), null);
    const wren = life(S.friend('wren', { x: 760, y: 280, s: 1.15, flip: true, z: 4, voice: 'wren', bob: 4 }), T(0), null);
    const pip = life(S.friend('ptera', { x: 200, y: 120, s: 0.95, z: 5, voice: 'pip', bob: 5, tOff: 1 }), T(0), null);
    const gnash = life(S.actor('raptor', { x: P ? 730 : 900, y: G, s: 1.45, boss: true, still: true, z: 2, voice: 'gnash' }), T(0), null);
    rex.walk(T(0.3), 380, 1.7);
    wren.to(T(0.8), { x: 566, y: 418 }, 1.4, 'out');
    let t = say(S, T(2.6), wren, 'రెక్స్! గట్టిగా గర్జించడం నేర్చుకుందాం!', "Rex! Let's learn to ROAR!");
    rex.set(t, { eye: 'happy' });
    t = say(S, t + 0.1, rex, 'సరే! చూడండి!', 'Okay! Watch this!', 2.0);
    // try 1: a squeak
    rex.set(t, { eye: 'closed' }).to(t, { sy: 1.12, sx: 0.95, rot: -0.06 }, 0.8, 'inout'); S.sfx(t, 'inhale', { dur: 0.8 });
    const r1 = t + 0.9;
    rex.set(r1, { roar: true, eye: 'normal' }).to(r1, { sy: 1, sx: 1, rot: 0 }, 0.2, 'out');
    S.effect(r1, 'text', 0, 0, { follow: rex, ox: 16, oy: 0, text: 'squeak!', fs: 56, color: '#ffb3c8', dur: 1.1 }); S.sfx(r1, 'squeak');
    rex.set(r1 + 0.45, { roar: false, eye: 'wide', blush: true });
    wren.set(r1 + 0.6, { eye: 'happy' }); S.sfx(r1 + 0.6, 'giggle', { voice: 'wren' });
    t = say(S, r1 + 1.0, wren, 'హి హి! ఇంకా పెద్దగా!', 'Hee hee! Bigger!', 2.3);
    wren.set(t, { eye: 'normal' });
    // try 2: hiccups
    rex.set(t, { eye: 'angry', blush: false }).to(t, { sy: 1.24, sx: 1.12, rot: -0.1 }, 1.1, 'inout'); S.sfx(t, 'inhale', { dur: 1.1 });
    rex.shake(t + 0.6, 0.5, 2);
    for (let i = 0; i < 3; i++) {
      const h = t + 1.3 + i * 0.7;
      rex.hop(h, 22, 0.28); rex.set(h, { eye: 'wide' });
      S.effect(h, 'text', 0, 0, { follow: rex, ox: 20, oy: -10 - i * 6, text: 'HIC!', fs: 70, color: '#9fdc6e', dur: 0.6, rot: 0.15 - i * 0.12 }); S.sfx(h, 'hic');
    }
    const afterHic = t + 3.4;
    rex.to(afterHic - 0.6, { sy: 1, sx: 1, rot: 0 }, 0.4).set(afterHic - 0.4, { eye: 'dizzy', sweat: true });
    // Pip's advice
    pip.to(afterHic - 0.6, { x: P ? 345 : 230, y: 330 }, 1.0, 'out');
    t = say(S, afterHic + 0.4, pip, 'ఊపిరి బిగబట్టి, పది లెక్కపెట్టు!', 'Hold your breath and count to ten!', 2.8);
    rex.set(t - 0.6, { eye: 'normal', sweat: false });
    // try 3: count... then the BIG roar
    rex.set(t, { eye: 'closed' }).to(t, { sy: 1.16, sx: 1.1 }, 0.5); rex.shake(t + 0.5, 1.7, 1.5);
    ['1', '2', '3', '…10!'].forEach((n, i) => {
      const tt = t + 0.45 + i * 0.5;
      S.effect(tt, 'text', 0, 0, { follow: rex, ox: -50 + i * 34, oy: -20, text: n, fs: 54, color: '#fff', dur: 0.8, rot: 0 }); S.sfx(tt, 'ding');
    });
    const roar = t + 2.6;
    rex.set(roar, { roar: true, eye: 'angry' }).to(roar, { sy: 1.05, sx: 1.05, rot: -0.05 }, 0.15, 'out');
    S.camShake(roar, 1.0, P ? 9 : 7);
    S.effect(roar, 'rings', 0, 0, { follow: rex, ox: 40, oy: 30, dur: 1.2, r: 900 });
    S.effect(roar, 'text', 0, 0, { follow: rex, ox: 70, oy: -50, text: 'ROAAAR!', fs: 130, color: '#ff8a3d', dur: 1.6, size: 1 });
    S.effect(roar + 0.1, 'lines', 0, 0, { follow: rex, ox: 190, oy: 20, dur: 0.9, dir: -1 });
    S.sfx(roar, 'bigRoar');
    S.mutes = (S.mutes || []).concat([[roar - 0.05, roar + 2.6]]);
    // the wind blows Wren and Pip away
    wren.set(roar + 0.15, { eye: 'wide' }).to(roar + 0.15, { x: 1150, y: 120, rot: 9 }, 0.9, 'in');
    pip.set(roar + 0.15, { eye: 'wide' }).to(roar + 0.15, { x: 1100, y: -200, rot: -7 }, 1.0, 'in');
    S.sfx(roar + 0.25, 'slideUp', { dur: 0.5 });
    rex.set(roar + 1.3, { roar: false, eye: 'normal' }).to(roar + 1.3, { sy: 1, sx: 1, rot: 0 }, 0.3);
    // silence... then Wren comes back, a bit dizzy
    const back = roar + 2.6;
    wren.set(back - 0.4, { x: 1000, y: 330, rot: 0, eye: 'dizzy', sweat: true }).to(back - 0.4, { x: 566, y: 405 }, 1.2, 'out');
    S.effect(back + 0.4, 'circling', 0, 0, { follow: wren, oy: -12, dur: 3.6, size: 0.8 });
    t = say(S, back + 0.9, wren, 'అది... చాలా... బాగుంది.', 'That... was... very good.', 2.8);
    let end = t;
    if (o.gnash !== false) {
      // reveal: Gnash was hiding behind the ridge, and he is shaking
      cam(S, t, P ? 650 : 720, 1, 0.9);
      gnash.set(t, { eye: 'wide', sweat: true }); gnash.shake(t, 3.6, 2.5);
      S.effect(t + 0.9, 'mark', 0, 0, { follow: gnash, text: '!', dur: 1.0 }); S.sfx(t + 0.9, 'eep');
      t = say(S, t + 1.2, gnash, 'అమ్మో! నేను ఇంటికి వెళ్తా!', "Yikes! I'm going home!", 2.4);
      gnash.set(t, { flip: true, still: false, move: true }).to(t, { x: 1250 }, 0.8, 'in');
      S.effect(t, 'dust', 0, 0, { x: 800, y: G, dur: 0.8, dir: -1 }); S.sfx(t, 'whoosh');
      cam(S, t + 0.7, P ? 470 : 480, 1, 0.7);
      end = t + 1.5;
    }
    // proud Rex... and one last tiny hiccup
    rex.set(end, { eye: 'happy' }).hop(end, 30, 0.45); S.sfx(end, 'tada'); S.effect(end + 0.2, 'sparkle', 0, 0, { follow: rex, dur: 1.6 });
    pip.set(end - 1.6, { x: 200, y: 260, rot: 0, eye: 'normal' }).to(end - 1.6, { x: P ? 345 : 250, y: 320 }, 1.2, 'out');
    t = say(S, end + 0.3, rex, 'నేను చేశాను!', 'I did it!', 1.9);
    rex.hop(t + 0.1, 14, 0.25).set(t + 0.1, { eye: 'wide', blush: true });
    S.effect(t + 0.1, 'text', 0, 0, { follow: rex, ox: 20, oy: -10, text: 'hic!', fs: 50, color: '#9fdc6e', dur: 0.8 }); S.sfx(t + 0.1, 'hic');
    wren.set(t + 0.6, { eye: 'happy', sweat: false }); pip.set(t + 0.6, { eye: 'happy' });
    S.sfx(t + 0.6, 'giggle', { voice: 'pip' }); S.sfx(t + 0.75, 'giggle', { voice: 'wren' });
    rex.set(t + 0.9, { eye: 'happy' });
    if (o.hide) [rock, rex, wren, pip, gnash].forEach(a => a.set(t + 2.0, { alpha: 0 }));
    return t + 2.0;
  }

  /* ---------------- Scene: Too Tall! (Whispering Woods) ---------------- */
  function sceneTall(S, t0, o = {}) {
    const T = x => t0 + x, P = S.portrait;
    S.bgT.set(T(0), { type: 'game', theme: 0 });
    // cliff with vines from x 470 to 760, and stone steps on its right side
    // terrain pieces are positioned by the game itself (y = 0 here)
    const cliff = life(S.actor('cliff', { x: 470, y: 0, w: 290, h: 195, theme: 0, z: 1 }), T(0), null);
    const steps = [0, 1, 2].map(i => life(S.actor('cliff', { x: 760 + i * 44, y: 0, w: 44, h: 147 - i * 49, theme: 0, z: 1 }), T(0), null));
    const coins = [0, 1, 2, 3].map(i => life(S.actor('coin', { x: 200 + i * 52, y: G - 34, z: 2 }), T(0), null));
    const rex = life(S.rex({ x: P ? 20 : 20, s: 1.0, z: 3, voice: 'rex' }), T(0), null);
    const tiko = life(S.friend('tri', { x: -80, s: 0.95, z: 4, voice: 'tiko' }), T(0), null);
    const zm = P ? 0.8 : 1;
    cam(S, T(0), P ? 300 : 480, zm);
    // run in, collect coins
    rex.walk(T(0.2), 380, 2.4);
    coins.forEach((c, i) => { const tc = T(0.2 + (200 + i * 52 - 20 + 30) / 360 * 2.4 - 0.25); c.set(tc, { alpha: 0 }); S.sfx(tc, 'coin'); S.effect(tc, 'sparkle', 200 + i * 52, G - 34, { dur: 0.5, size: 0.5 }); });
    cam(S, T(0.6), P ? 400 : 480, zm, 2.0);
    // look up at the wall
    let t = T(2.8);
    cam(S, t, P ? 420 : 520, zm, 0.9);
    rex.set(t, { eye: 'wide', look: 0 }); S.effect(t + 0.2, 'mark', 0, 0, { follow: rex, text: '?', color: '#ffd34d', dur: 1.0 });
    t = say(S, t + 0.6, rex, 'అమ్మో... చాలా ఎత్తు!', 'Whoa... too tall!', 2.2);
    // jump 1: bonk
    rex.set(t, { eye: 'angry' }).walk(t, 300, 0.5, { flip: true }).set(t + 0.5, { flip: false });
    rex.walk(t + 0.7, 400, 0.45); rex.hop(t + 0.95, 70, 0.6);
    const bonk = t + 1.2;
    rex.set(bonk, { eye: 'stars' }); S.effect(bonk, 'text', 0, 0, { follow: rex, ox: 30, oy: -10, text: 'BONK!', fs: 80, color: '#ffd34d', dur: 0.9 });
    S.effect(bonk, 'burst', 0, 0, { follow: rex, ox: 30, dur: 0.6, r: 70 }); S.sfx(bonk, 'bonk');
    rex.to(bonk + 0.35, { x: 395 }, 0.5); S.sfx(bonk + 0.3, 'slideDown', { dur: 0.6 });
    rex.squash(bonk + 0.35, 0.3, 0.5).set(bonk + 1.0, { eye: 'dizzy' });
    S.effect(bonk + 0.5, 'circling', 0, 0, { follow: rex, oy: -10, dur: 1.4, size: 0.7 });
    // jump 2: boing backwards, onto his tail
    t = bonk + 2.2;
    rex.set(t, { eye: 'angry' }).walk(t, 260, 0.6, { flip: true }).set(t + 0.6, { flip: false });
    rex.walk(t + 0.8, 410, 0.4); rex.hop(t + 1.0, 95, 0.55);
    const boing = t + 1.3;
    rex.set(boing, { eye: 'wide' }).to(boing, { x: 320, rot: -6.28 }, 0.9, 'out');
    S.effect(boing, 'text', 0, 0, { follow: rex, ox: 40, oy: -20, text: 'BOING!', fs: 84, color: '#ff8ab0', dur: 1.0 }); S.sfx(boing, 'boing');
    rex.set(boing + 0.9, { rot: 0 }).squash(boing + 0.9, 0.35, 0.5).set(boing + 0.9, { eye: 'dizzy', sweat: true });
    S.effect(boing + 0.9, 'dust', 0, 0, { x: 320, y: G, dur: 0.6 }); S.sfx(boing + 0.9, 'thud');
    // Tiko arrives, munching a leaf
    t = boing + 1.7;
    tiko.walk(t - 1.0, 235, 1.2); S.sfx(t, 'munch');
    cam(S, t - 1.0, P ? 360 : 480, zm, 0.8);
    rex.set(t + 0.2, { flip: true, eye: 'normal', sweat: false });
    t = say(S, t + 0.3, tiko, 'రెక్స్! తీగల్లోకి పరిగెత్తు, పైకి ఎక్కేయ్!', 'Rex! Run into the vines and climb!', 3.0);
    rex.set(t, { flip: false, eye: 'happy' });
    // the climb
    rex.walk(t + 0.2, 446, 0.4);
    const climb0 = t + 0.6, climb1 = climb0 + 1.6;
    rex.set(climb0, { rot: -0.25, move: true }).to(climb0, { dy: -195 }, climb1 - climb0, 'lin');
    cam(S, climb0, P ? 560 : 520, zm, 1.0);
    for (let i = 0; i < 4; i++) S.sfx(climb0 + i * 0.4, 'pop');
    rex.set(climb1, { rot: 0, move: false, y: G - 195, dy: 0, x: 490 });
    rex.hop(climb1, 30, 0.4).walk(climb1 + 0.4, 560, 0.5);
    S.effect(climb1, 'text', 0, 0, { follow: rex, ox: 0, oy: -20, text: 'Climbed!', fs: 64, color: '#dff7c0', dur: 1.0 }); S.sfx(climb1, 'climb');
    t = climb1 + 1.0;
    rex.set(t, { eye: 'happy' }); S.sfx(t, 'tada'); S.effect(t, 'sparkle', 0, 0, { follow: rex, dur: 1.5 });
    t = say(S, t + 0.2, rex, 'నేను పైకి వచ్చేశా!', 'I made it to the top!', 2.2);
    // ...but Tiko is already up here
    tiko.set(t - 0.2, { x: 680, y: G - 195, flip: true, still: true });
    rex.set(t, { flip: true, eye: 'wide' }); S.effect(t + 0.1, 'mark', 0, 0, { follow: rex, text: '!', dur: 0.9 }); S.sfx(t + 0.1, 'eep');
    rex.set(t + 0.3, { flip: false });
    S.sfx(t + 0.4, 'munch');
    t = say(S, t + 0.8, rex, 'నువ్వు... ఎలా?!', 'How did YOU...?!', 2.0);
    cam(S, t, P ? 730 : 560, zm, 1.0);
    t = say(S, t + 0.3, tiko, 'పక్కనే మెట్లు ఉన్నాయి.', 'There are stairs on the side.', 2.6);
    S.effect(t - 1.8, 'text', 840, G - 175, { text: 'stairs!', fs: 54, color: '#fff', dur: 1.6, rot: 0.1 });
    cam(S, t, P ? 620 : 520, zm, 0.8);
    rex.set(t + 0.2, { eye: 'closed', sweat: true }).squash(t + 0.2, 0.35, 0.6); S.sfx(t + 0.2, 'slideDown', { dur: 0.5 });
    tiko.set(t + 0.9, { eye: 'happy' }); S.sfx(t + 0.9, 'giggle', { voice: 'tiko' });
    t = say(S, t + 1.1, tiko, 'కానీ నీ ఎక్కడం సూపర్!', 'But your climbing was SUPER!', 2.4);
    rex.set(t, { eye: 'happy', blush: true, sweat: false }); S.effect(t, 'hearts', 0, 0, { follow: rex, dur: 1.4 }); S.sfx(t, 'twinkle');
    if (o.hide) [cliff, ...steps, ...coins, rex, tiko].forEach(a => a.set(t + 1.6, { alpha: 0 }));
    return t + 1.6;
  }

  /* ---------------- Scene: Who Took the Star Ball? (ink book) ---------------- */
  function sceneBall(S, t0, o = {}) {
    const T = x => t0 + x, P = S.portrait;
    S.bgT.set(T(0), { type: 'paper', ground: G });
    const zm = P ? 0.85 : 1.1;
    cam(S, T(0), P ? 360 : 480, zm);
    const bush1 = life(S.actor('thing', { kind: 'bush', x: 240, y: G, seed: 4, z: 1 }), T(0), null);
    const bush2 = life(S.actor('thing', { kind: 'bush', x: 570, y: G, seed: 7, z: 2 }), T(0), null);
    const tail = life(S.actor('nixTail', { x: 638, y: G - 8, wiggle: true, z: 1 }), T(0), null);
    const frog = life(S.actor('critter', { kind: 'frog', x: 240, y: G - 4, z: 0, alpha: 0 }), T(0), null);
    const tiko = life(S.actor('babyTiko', { x: 400, y: G, s: 1.15, crying: true, faceLeft: true, z: 3, voice: 'babyTiko' }), T(0), null);
    const rex = life(S.actor('baby', { x: 120, y: G, s: 1.15, pose: 'idle', z: 4, voice: 'baby' }), T(0), null);
    const flick = life(S.actor('flick', { x: 470, y: G - 165, s: 1.0, z: 6, voice: 'flick', bob: 8 }), T(0), null);
    const nix = life(S.actor('nix', { x: 625, y: G, s: 1.1, pose: 'stand', z: 5, voice: 'nix', alpha: 0 }), T(0), null);
    const ball = life(S.actor('starBall', { x: 655, y: G, z: 5, alpha: 0 }), T(0), null);
    let t = T(0.4);
    S.sfx(t, 'talk', { voice: 'babyTiko', n: 6 });
    t = say(S, T(0.6), tiko, 'ఊఁఊఁ! నా బంతి పోయింది!', 'Waaah! My ball is gone!', 2.6);
    rex.set(t - 1.2, { pose: 'walk' }).walk(t - 1.2, 320, 1.2);
    rex.set(t + 0.2, { pose: 'idle' });
    t = say(S, t + 0.3, rex, 'టికో బాధ? రెక్స్ సాయం!', 'Tiko sad? Rex help!', 2.2);
    t = say(S, t + 0.1, flick, 'నీ ముక్కుకు అన్నీ తెలుసు! వాసన చూడు!', 'Your nose knows! Sniff!', 2.4);
    // sniff, sniff... wrong bush: a frog!
    rex.set(t, { pose: 'walk', faceLeft: true }).walk(t, 292, 0.5);
    rex.set(t + 0.6, { pose: 'sniff' }); S.sfx(t + 0.7, 'sniff');
    S.effect(t + 0.7, 'text', 0, 0, { follow: rex, ox: -40, oy: 0, text: 'sniff sniff', fs: 44, color: '#fff', dur: 1.0 });
    rex.set(t + 1.6, { pose: 'peek' });
    const fr = t + 2.1;
    frog.set(fr, { alpha: 1, z: 5 }).hop(fr, 70, 0.6).to(fr, { x: 190 }, 0.6, 'out');
    S.effect(fr, 'text', 285, G - 120, { text: 'RIBBIT!', fs: 70, color: '#fff', dur: 1.0 }); S.sfx(fr, 'ribbit');
    rex.set(fr + 0.05, { pose: 'plop' }); S.sfx(fr + 0.1, 'thud');
    S.effect(fr + 0.1, 'mark', 0, 0, { follow: rex, text: '!', dur: 0.8 });
    frog.set(fr + 0.6, { alpha: 1 }).hop(fr + 0.9, 50, 0.5).to(fr + 0.9, { x: 40 }, 0.5).set(fr + 1.5, { alpha: 0 });
    tiko.set(fr + 0.6, { crying: false, happy: true }); S.sfx(fr + 0.6, 'giggle', { voice: 'babyTiko' });
    tiko.set(fr + 1.5, { happy: false, crying: true });
    // a wiggly tail in the other bush
    t = fr + 1.8;
    rex.set(t, { pose: 'walk', faceLeft: false }).walk(t, 425, 0.8); rex.set(t + 0.8, { pose: 'idle' });
    cam(S, t, P ? 520 : 480, zm, 0.8);
    cam(S, t + 2.8, P ? 560 : 480, zm, 1.2);
    S.effect(t + 0.9, 'mark', 0, 0, { follow: rex, text: '?', color: '#fff', dur: 1.0 });
    t = say(S, t + 1.1, rex, 'అది... తోక?', 'That... tail?', 1.8);
    rex.set(t, { pose: 'walk' }).walk(t, 505, 0.9);
    rex.set(t + 1.0, { pose: 'lift' }); S.sfx(t + 1.1, 'boing');
    const pop = t + 1.2;
    tail.set(pop, { alpha: 0 });
    nix.set(pop, { alpha: 1, pose: 'caught', x: 610, faceLeft: true, carrying: 'ball' }).hop(pop, 60, 0.5).to(pop, { x: 685 }, 0.5, 'out');
    S.effect(pop, 'burst', 610, G - 60, { dur: 0.6, color: '#fff', r: 90 });
    S.effect(pop, 'text', 600, G - 160, { text: 'POP!', fs: 70, color: '#fff', dur: 0.8 });
    rex.set(pop + 0.1, { pose: 'idle' });
    nix.set(pop + 0.7, { pose: 'taunt' });
    t = say(S, pop + 0.6, nix, 'హీ హీ! నేనే దాచాను!', 'Hee hee! I hid it!', 2.3);
    t = say(S, t + 0.1, rex, 'నిక్స్! బంతి ఇవ్వు!', 'Nix! Ball, please!', 2.0);
    nix.set(t, { pose: 'sheepish' });
    t = say(S, t + 0.1, nix, 'నాకూ ఆడుకోవాలని ఉంది...', 'I just wanted to play too...', 2.6);
    rex.set(t, { pose: 'happy' }); S.sfx(t, 'twinkle');
    t = say(S, t + 0.1, rex, 'కలిసి ఆడదాం!', 'Play together!', 2.0);
    // everyone plays: the ball bounces Rex -> Nix -> Tiko
    tiko.set(t, { crying: false, happy: true }); nix.set(t, { pose: 'happy', carrying: null });
    tiko.walk(t, 440, 0.6); ball.set(t, { alpha: 1, x: 665, y: G - 4 });
    const path = [[665, 515], [515, 660], [660, 455], [455, 580]];
    let tb = t + 0.2;
    for (const [a, b] of path) {
      ball.set(tb, { x: a, y: G - 4 }).to(tb, { x: b }, 0.7, 'lin').to(tb, { dy: -130 }, 0.35, 'out').to(tb + 0.35, { dy: 0 }, 0.35, 'in');
      ball.to(tb, { spin: (tb - t) * 6 }, 0.7, 'lin');
      S.sfx(tb + 0.7, 'boing'); tb += 0.75;
    }
    S.effect(t + 0.3, 'notes', 520, G - 230, { dur: 3 });
    S.effect(t + 1.2, 'hearts', 0, 0, { follow: tiko, dur: 1.6 });
    if (o.hide) [bush1, bush2, tail, frog, tiko, rex, flick, nix, ball].forEach(a => a.set(tb + 0.4, { alpha: 0 }));
    return tb + 0.4;
  }

  /* ---------------- Scene: Wake up, Rex! (Whispering Woods, morning) ---------------- */
  function sceneWake(S, t0, o = {}) {
    const T = x => t0 + x;
    S.bgT.set(T(0), { type: 'game', theme: 0 });
    cam(S, T(0), 420, 1.15);
    const rex = life(S.rex({ x: 380, s: 1.0, z: 3, voice: 'rex', eye: 'closed', still: true, rot: 0.06 }), T(0), null);
    const wren = life(S.friend('wren', { x: 900, y: 200, s: 1.1, flip: true, z: 4, voice: 'wren', bob: 4 }), T(0), null);
    S.caption(T(0.3), 4.2, ...(o.caption || ['ఒక ఉదయం, గుసగుసల అడవిలో...', 'One morning, in the Whispering Woods...']));
    S.effect(T(0.5), 'zzz', 0, 0, { follow: rex, ox: -10, oy: -10, dur: 6.5 });
    S.sfx(T(0.8), 'snore'); S.sfx(T(2.6), 'snore'); S.sfx(T(4.4), 'snore');
    rex.to(T(0.5), { sy: 1.04 }, 0.9).to(T(1.4), { sy: 1 }, 0.9).to(T(2.3), { sy: 1.04 }, 0.9).to(T(3.2), { sy: 1 }, 0.9);
    wren.to(T(4.6), { x: 520, y: 360 }, 1.4, 'out');
    let t = say(S, T(6.2), wren, 'రెక్స్! లేవు! లేవు!', 'Rex! Wake up! Wake up!', 2.0);
    S.sfx(t - 0.4, 'snore');
    t = say(S, t + 0.2, wren, 'గ్నాష్ మన స్నేహితులను చెల్లాచెదురు చేశాడు!', 'Gnash has scattered our friends!', 2.8);
    // Rex jumps awake
    rex.set(t, { eye: 'wide', rot: 0 }).hop(t, 60, 0.5); S.sfx(t, 'boing');
    S.effect(t, 'mark', 0, 0, { follow: rex, text: '!', dur: 0.8 });
    rex.set(t + 0.7, { eye: 'angry' });
    t = say(S, t + 0.8, rex, 'నేను అందరినీ ఇంటికి తీసుకొస్తా! మాటిస్తున్నా!', "I'll bring everyone home. I promise!", 3.0);
    rex.set(t, { eye: 'happy' }).walk(t + 0.2, 1000, 2.2); S.effect(t + 0.2, 'lines', 0, 0, { follow: rex, ox: -60, oy: 40, dur: 1.2 });
    wren.to(t + 0.4, { x: 1100, y: 250 }, 1.6, 'in');
    S.sfx(t + 0.2, 'whoosh');
    [rex, wren].forEach(a => a.set(t + 2.4, { alpha: 0 }));
    return t + 2.4;
  }

  // Rex asleep, about to dream of when he was little (the ink book)
  function sceneDream(S, t0) {
    const T = x => t0 + x;
    S.bgT.set(T(0), { type: 'game', theme: 0 });
    cam(S, T(0), 420, 1.15);
    const rex = life(S.rex({ x: 380, s: 1.0, z: 3, eye: 'closed', still: true, rot: 0.06 }), T(0), null);
    S.caption(T(0.4), 4.6, 'రెక్స్ నిద్రపోతున్నాడు... చిన్నప్పటి కల కంటున్నాడు.', 'Rex is fast asleep... dreaming of when he was little.');
    S.effect(T(0.3), 'zzz', 0, 0, { follow: rex, ox: -10, oy: -10, dur: 5 });
    S.sfx(T(0.6), 'snore'); S.sfx(T(2.4), 'snore'); S.sfx(T(4.2), 'twinkle');
    rex.to(T(0.5), { sy: 1.04 }, 0.9).to(T(1.4), { sy: 1 }, 0.9).to(T(2.3), { sy: 1.04 }, 0.9).to(T(3.2), { sy: 1 }, 0.9);
    cam(S, T(2.5), 420, 1.6, 2.6);
    S.effect(T(4.6), 'flash', 0, 0, { screen: true, dur: 0.8, a: 0.9 });
    rex.set(T(5.2), { alpha: 0 });
    return T(5.2);
  }

  /* ---------------- Scene: Tiko is stuck in the roots ---------------- */
  function sceneTiko(S, t0) {
    const T = x => t0 + x;
    S.bgT.set(T(0), { type: 'game', theme: 0, s: 600 });
    cam(S, T(0), 440, 1.15);
    const rex = life(S.rex({ x: 120, s: 1.0, z: 3, voice: 'rex' }), T(0), null);
    const tiko = life(S.friend('tri', { x: 560, s: 0.95, flip: true, z: 2, voice: 'tiko', still: true, eye: 'sad' }), T(0), null);
    const roots = life(S.actor('rock', { x: 520, y: G, w: 90, h: 24, z: 4 }), T(0), null);
    S.caption(T(0.2), 3.2, 'టికో వేర్లలో చిక్కుకున్నాడు!', 'Tiko is stuck in the roots!');
    tiko.shake(T(0.4), 2.4, 2);
    let t = say(S, T(0.6), tiko, 'సాయం! నా కొమ్ములు ఇరుక్కుపోయాయి!', 'Help! My horns are stuck!', 2.6);
    rex.walk(T(0.5), 440, 1.6);
    t = say(S, t + 0.1, rex, 'పట్టుకో టికో! నేను లాగుతా!', "Hold on, Tiko! I'll pull!", 2.2);
    // pull... pull... POP!
    rex.set(t, { eye: 'angry', flip: true }).to(t, { rot: -0.15, x: 425 }, 0.4);
    tiko.set(t, { eye: 'closed' });
    for (let i = 0; i < 3; i++) { rex.shake(t + 0.5 + i * 0.6, 0.35, 3); tiko.shake(t + 0.5 + i * 0.6, 0.35, 3); S.sfx(t + 0.5 + i * 0.6, 'wobble'); }
    S.effect(t + 0.5, 'text', 0, 0, { follow: rex, ox: -40, oy: -10, text: 'pull!', fs: 54, color: '#fff', dur: 0.6 });
    S.effect(t + 1.1, 'text', 0, 0, { follow: rex, ox: -50, oy: -20, text: 'pull!!', fs: 60, color: '#fff', dur: 0.6 });
    const pop = t + 2.1;
    S.effect(pop, 'text', 560, G - 90, { text: 'POP!', fs: 90, color: '#ffd34d', dur: 0.9 }); S.sfx(pop, 'pop'); S.sfx(pop, 'boing');
    S.effect(pop, 'burst', 560, G - 30, { dur: 0.7, r: 120 });
    roots.set(pop, { alpha: 0 });
    tiko.set(pop, { eye: 'happy', still: false }).hop(pop, 50, 0.5);
    rex.set(pop, { rot: 0 }).to(pop, { x: 330, rot: 0.25 }, 0.5, 'out').squash(pop + 0.5, 0.35, 0.5);
    rex.set(pop + 0.5, { rot: 0, eye: 'dizzy' }); S.sfx(pop + 0.5, 'thud');
    S.effect(pop + 0.5, 'dust', 330, G, { dur: 0.6 });
    tiko.set(pop + 0.6, { still: true });
    t = say(S, pop + 0.9, tiko, 'థాంక్యూ రెక్స్! నా ఎగిరే దూకు నేర్పిస్తా!', "Thank you, Rex! I'll teach you my springy hop!", 3.0);
    rex.set(t - 1.6, { eye: 'happy', flip: false });
    // double jump, shown by Tiko and copied by Rex
    tiko.hop(t + 0.1, 70, 0.55); tiko.hop(t + 0.62, 60, 0.5); S.sfx(t + 0.1, 'jump'); S.sfx(t + 0.62, 'jump');
    rex.hop(t + 1.4, 70, 0.55); rex.hop(t + 1.92, 70, 0.55); S.sfx(t + 1.4, 'jump'); S.sfx(t + 1.92, 'jump');
    S.effect(t + 1.92, 'text', 0, 0, { follow: rex, ox: 0, oy: -30, text: 'double jump!', fs: 56, color: '#dff7c0', dur: 1.0 });
    S.effect(t + 2.5, 'sparkle', 0, 0, { follow: rex, dur: 1.2 }); S.sfx(t + 2.5, 'tada');
    [rex, tiko, roots].forEach(a => a.set(t + 3.4, { alpha: 0 }));
    return t + 3.4;
  }

  /* ---------------- Scene: Fern River ---------------- */
  function sceneRiver(S, t0) {
    const T = x => t0 + x;
    S.bgT.set(T(0), { type: 'game', theme: 1 });
    cam(S, T(0), 520, 1.0);
    const water = life(S.actor('water', { x: 420, y: 0, w: 300, theme: 1, z: 1 }), T(0), null);
    const front = life(S.actor('waterFront', { x: 420, y: 0, w: 300, z: 6 }), T(0), null);
    const rex = life(S.rex({ x: 160, s: 1.1, z: 3, voice: 'rex' }), T(0), null);
    const stella = life(S.friend('stego', { x: 800, s: 0.95, flip: true, z: 3, voice: 'stella', still: true, eye: 'sad' }), T(0), null);
    const pip = life(S.friend('ptera', { x: 330, y: 250, s: 0.9, z: 5, voice: 'pip', bob: 5, tOff: 2 }), T(0), null);
    S.caption(T(0.2), 3.4, 'తర్వాత, ఫెర్న్ నది దగ్గర...', 'Next, at Fern River...');
    rex.walk(T(0.4), 370, 1.6);
    let t = say(S, T(1.2), stella, 'రెక్స్! నేను అవతల ఒడ్డున ఉన్నా!', "Rex! I'm stuck on the other side!", 2.6);
    // toe in the water: brrr!
    rex.set(t, { eye: 'wide' }).to(t, { x: 400 }, 0.3).shake(t + 0.4, 1.0, 3);
    S.effect(t + 0.4, 'text', 0, 0, { follow: rex, ox: 10, oy: -10, text: 'BRRR!', fs: 70, color: '#bfe8ff', dur: 1.0 }); S.sfx(t + 0.4, 'wobble');
    rex.set(t + 0.5, { sweat: true });
    t = say(S, t + 0.6, rex, 'నీళ్ళు చల్లగా ఉన్నాయి!', 'The water is COLD!', 2.0);
    t = say(S, t + 0.1, pip, 'జంప్ నొక్కు, చిందులేస్తూ ఈదు!', 'Tap jump to splash-hop!', 2.4);
    rex.set(t, { eye: 'angry', sweat: false }).to(t, { x: 380 }, 0.3);
    rex.hop(t + 0.4, 90, 0.5).to(t + 0.4, { x: 470 }, 0.5, 'lin');
    const sp = t + 0.9;
    rex.set(sp, { y: 507, eye: 'closed' });
    S.effect(sp, 'text', 470, G - 80, { text: 'SPLASH!', fs: 96, color: '#bfe8ff', dur: 1.0 }); S.sfx(sp, 'splash');
    S.effect(sp, 'burst', 470, G + 10, { dur: 0.8, r: 140, color: '#bfe8ff', n: 12 });
    rex.set(sp + 0.5, { eye: 'happy', move: true }).to(sp + 0.5, { x: 680 }, 2.4, 'lin');
    for (let i = 0; i < 3; i++) { rex.hop(sp + 0.8 + i * 0.7, 26, 0.45); S.sfx(sp + 0.8 + i * 0.7, 'splash'); }
    S.effect(sp + 0.6, 'notes', 0, 0, { follow: rex, oy: -30, dur: 2.2 });
    const out = sp + 2.9;
    rex.set(out, { y: G, move: false }).hop(out, 60, 0.5).to(out, { x: 740 }, 0.5, 'lin');
    // shake off like a puppy... all over Stella and Pip
    t = out + 0.8;
    rex.set(t, { eye: 'closed' }).shake(t, 1.0, 6); S.sfx(t, 'wobble');
    S.effect(t, 'burst', 0, 0, { follow: rex, ox: -30, oy: 40, dur: 0.9, r: 160, color: '#8ccbff', n: 14 });
    stella.set(t + 0.3, { eye: 'closed' }); pip.to(t, { x: 640, y: 300 }, 0.6);
    S.effect(t + 0.5, 'text', 800, G - 120, { text: 'drip drip', fs: 44, color: '#bfe8ff', dur: 1.0 });
    t = say(S, t + 1.2, stella, 'హే! నేనూ తడిసిపోయా!', "Hey! Now I'm wet too!", 2.0);
    stella.set(t, { eye: 'happy' }); rex.set(t, { eye: 'happy', blush: true }); S.sfx(t, 'giggle', { voice: 'stella' });
    t = say(S, t + 0.4, stella, 'నా వీపు పలకలు గట్టివి. ఒక దెబ్బ నేను ఆపుతా!', 'My back plates are tough. I will block a hit for you!', 3.2);
    rex.set(t, { shield: true, blush: false }); S.sfx(t, 'twinkle'); S.effect(t, 'sparkle', 0, 0, { follow: rex, oy: 40, dur: 1.4 });
    S.effect(t + 0.1, 'text', 0, 0, { follow: rex, ox: 0, oy: -30, text: 'Plate Shield!', fs: 56, color: '#bfe1ff', dur: 1.2 });
    [water, front, rex, stella, pip].forEach(a => a.set(t + 2.0, { alpha: 0 }));
    return t + 2.0;
  }

  /* ---------------- Scene: Gnash just wants friends (Volcano Lair) ---------------- */
  function sceneFriends(S, t0) {
    const T = x => t0 + x;
    S.bgT.set(T(0), { type: 'game', theme: 3 });
    cam(S, T(0), 480, 1.0);
    const gnash = life(S.actor('raptor', { x: 700, y: G, s: 1.6, boss: true, still: true, z: 2, voice: 'gnash', eye: 'angry' }), T(0), null);
    const rex = life(S.rex({ x: 60, s: 1.5, z: 4, voice: 'rex' }), T(0), null);
    const tiko = life(S.friend('tri', { x: -20, s: 0.7, z: 5, voice: 'tiko' }), T(0), null);
    const stella = life(S.friend('stego', { x: -70, s: 0.7, z: 5, voice: 'stella' }), T(0), null);
    const momo = life(S.friend('ankylo', { x: -120, s: 0.7, z: 5, voice: 'momo' }), T(0), null);
    const pip = life(S.friend('ptera', { x: 100, y: 200, s: 0.8, z: 6, voice: 'pip', bob: 6, tOff: 3 }), T(0), null);
    const coins = Array.from({ length: 9 }, (_, i) => life(S.actor('coin', { x: 260 + i * 55, y: -40, z: 7, alpha: 0 }), T(0), null));
    S.caption(T(0.2), 3.4, 'చివరికి, అగ్నిపర్వత గుహ దగ్గర...', 'At last, at the Volcano Lair...');
    rex.walk(T(0.3), 330, 1.8); tiko.walk(T(0.3), 230, 1.8); stella.walk(T(0.3), 180, 1.8); momo.walk(T(0.3), 130, 1.8);
    pip.to(T(0.3), { x: 300, y: 260 }, 1.8);
    let t = say(S, T(2.4), gnash, 'ఈ లోయ నాది! ఇక్కడికి రాకండి!', 'This valley is MINE! Go away!', 2.6);
    gnash.shake(T(2.5), 0.6, 4); S.camShake(T(2.5), 0.5, 4); S.sfx(T(2.5), 'thud');
    t = say(S, t + 0.2, rex, 'గ్నాష్, నువ్వు ఎందుకు ఎప్పుడూ కోపంగా ఉంటావు?', 'Gnash, why are you always so grumpy?', 2.8);
    gnash.set(t, { eye: 'sad', tear: true });
    S.mutes = (S.mutes || []).concat([[t, t + 3.2]]);
    t = say(S, t + 0.4, gnash, 'ఎందుకంటే... నాతో ఎవరూ ఆడరు...', 'Because... nobody plays with me...', 2.8);
    [tiko, stella, momo, pip].forEach(a => a.set(t - 0.6, { eye: 'sad' }));
    rex.set(t, { eye: 'happy' });
    t = say(S, t + 0.2, rex, 'అయితే మాతో ఆడు!', 'Then come and play with US!', 2.2);
    gnash.set(t, { eye: 'wide', tear: false, blush: true }); S.effect(t, 'mark', 0, 0, { follow: gnash, text: '?', color: '#ffd34d', dur: 0.9 });
    t = say(S, t + 0.3, gnash, 'నిజంగా? నేను కూడా?', 'Really? Me too?', 2.0);
    // everyone at once: YES!
    [tiko, stella, momo].forEach((a, i) => { a.set(t, { eye: 'happy' }); a.hop(t + i * 0.08, 34, 0.45); });
    pip.set(t, { eye: 'happy' }); rex.hop(t, 40, 0.5);
    t = say(S, t + 0.1, tiko, 'అవును! అందరం కలిసి!', 'Yes! All of us together!', 2.2);
    gnash.set(t, { eye: 'happy', still: false }).hop(t, 50, 0.5).hop(t + 0.6, 50, 0.5); S.sfx(t, 'tada');
    // Gnash shares the golden coins: they rain down and everyone dances
    coins.forEach((c, i) => { const tc = t + 0.6 + i * 0.12; c.set(tc, { alpha: 1 }).to(tc, { y: G - 20 - (i % 3) * 30 }, 0.8, 'bounce'); S.sfx(tc + 0.7, 'coin'); });
    t = say(S, t + 0.8, gnash, 'ఈ బంగారు నాణేలు అందరివీ!', 'These golden coins are for everyone!', 2.6);
    [rex, tiko, stella, momo, gnash].forEach((a, i) => { for (let k = 0; k < 4; k++) a.hop(t + k * 0.55 + i * 0.07, 30, 0.45); });
    S.effect(t, 'notes', 480, G - 260, { dur: 3.4 }); S.effect(t + 0.4, 'hearts', 0, 0, { follow: gnash, dur: 1.6 });
    S.caption(t + 0.3, 3.4, 'అలా లోయలో అందరూ స్నేహితులయ్యారు!', 'And everyone in the valley became friends!');
    [gnash, rex, tiko, stella, momo, pip, ...coins].forEach(a => a.set(t + 3.8, { alpha: 0 }));
    return t + 3.8;
  }

  /* ---------------- Outro: the real game ---------------- */
  // story-gameplay/ = take.mkv seconds 31.0-34.0, 75.4-77.8, 141.6-144.2 and 209.0-211.6 (run, swim, roar, Gnash),
  // joined and exported as 318 numbered JPEG frames at 30 fps.
  function sceneGameplay(S, t0) {
    S.clip(t0, 10.5, 'story-gameplay', 0, 318);
    S.caption(t0 + 0.3, 9.8, 'ఇప్పుడు నీ వంతు! రెక్స్‌తో ఆడు!', "Now it's YOUR turn! Play with Rex!");
    S.sfx(t0, 'whoosh');
    return t0 + 10.5;
  }

  // the long episode: one adventure, chapter after chapter, with a fade between places
  function bigDay(o) {
    const S = new Story({ ...o, portrait: false, series: 'REX STORIES', seed: 4, titleDur: 3.2, endDur: 6, musicVol: 0.7,
      kicker: 'REX STORIES · FULL EPISODE', title: { te: 'రెక్స్ పెద్ద రోజు', en: "Rex's Big Day" } });
    const parts = [sceneDream, (S, t) => sceneBall(S, t, { hide: true }),
      (S, t) => sceneWake(S, t, { caption: ['కల అయిపోయింది. ఉదయం అయింది!', 'The dream ends. Good morning, Rex!'] }), sceneTiko, (S, t) => sceneTall(S, t, { hide: true }), sceneRiver, (S, t) => sceneRoar(S, t, { hide: true }), sceneFriends];
    let t = 0;
    S.chapters = [];
    parts.forEach((fn, i) => {
      if (i > 0) S.effect(t - 0.25, 'fade', 0, 0, { screen: true, dur: 0.5 });
      S.chapters.push(t);
      t = fn(S, t);
    });
    S.effect(t - 0.25, 'fade', 0, 0, { screen: true, dur: 0.5 });
    S.chapters.push(t);
    t = sceneGameplay(S, t);
    S.duration = t + S.endDur;
    return S;
  }

  /* ---------------- episodes ---------------- */
  function short(opts, scene, endTe, endEn) {
    const S = new Story({ ...opts, portrait: true, series: 'REX STORIES', titleDur: 2.4, endDur: 4, endTe, endEn });
    const end = scene(S, 0);
    S.duration = end + S.endDur;
    S.effect(end - 0.01, 'fade', 0, 0, { screen: true, dur: 0.5 });
    return S;
  }

  window.EPISODES = {
    bigday: bigDay,
    roar: o => short({ ...o, seed: 11, title: { te: 'రెక్స్ గర్జన పాఠం', en: 'The Roar Lesson' }, kicker: 'REX STORIES · EPISODE 1' }, sceneRoar),
    tall: o => short({ ...o, seed: 5, title: { te: 'అమ్మో, చాలా ఎత్తు!', en: 'Too Tall!' }, kicker: 'REX STORIES · EPISODE 2' }, sceneTall),
    ball: o => short({ ...o, seed: 9, title: { te: 'స్టార్ బంతి ఎవరు తీశారు?', en: 'Who Took the Star Ball?' }, kicker: 'REX STORIES · EPISODE 3' }, sceneBall),
  };
  window.REX_SCENES = { sceneRoar, sceneTall, sceneBall, cam, life };
})();
