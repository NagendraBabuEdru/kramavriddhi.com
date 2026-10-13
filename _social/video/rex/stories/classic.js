// "Little Rex" classic Shorts: funny stories in the black-and-white ink book of Rex's Big Adventure
// (Little Rex: Ink Stories and Star Quest). Same engine as episodes.js, with ink-style bubbles and cards.
// Little Rex talks the way he does in the book: two or three words ("Rex help!", "Glasses! Heart!").
//   1. Wren Can't See!  (Puddle Lane: Nix hid Old Wren's glasses; she can't see without them)
//   2. Hide and Seek!   (Twisty Tree Hideout: hide-and-seek with Nix, Tiko and Momo)
//   3. Achoo! Fire Sneeze (Star Quest: Little Rex's new Fire Breath, at Baby Tiko's birthday)
(function () {
  const { Story } = window.StoryEngine;
  const { cam, life } = window.REX_SCENES;
  const G = 462;
  const say = (S, t, a, te, en, d, o) => S.say(t, a, te, en, d, o);

  function classicShort(opts, scene) {
    const S = new Story({ ...opts, portrait: true, style: 'ink', series: 'LITTLE REX', titleDur: 2.4, endDur: 4,
      musicVol: 0.55, drums: false, endTe: 'లిటిల్ రెక్స్ ఆటను ఉచితంగా ఆడండి!', endEn: 'Play Little Rex: Ink Stories free!' });
    const end = scene(S, 0);
    S.duration = end + S.endDur;
    S.effect(end - 0.01, 'fade', 0, 0, { screen: true, dur: 0.5, color: '#eeeeee' });
    return S;
  }

  /* ---------------- 1. Wren Can't See! ---------------- */
  function wrenGlasses(S) {
    S.bgT.set(0, { type: 'paper', ground: G });
    cam(S, 0, 487, 1.0);
    const rain = S.actor('rain', { x: 0, y: 0, z: 20 });
    const mailbox = S.actor('thing', { kind: 'mailbox', x: 385, y: G, seed: 3, z: 1 });
    const puddle = S.actor('thing', { kind: 'puddle', x: 590, y: G + 6, seed: 5, z: 0 });
    const glasses = S.actor('glasses', { x: 594, y: G + 4, s: 0.9, z: 1 });
    const wren = S.actor('inkWren', { x: 480, y: G, s: 1.25, umbrella: true, z: 3, voice: 'wren' });
    const rex = S.actor('baby', { x: 700, y: G, s: 1.1, pose: 'toddle', faceLeft: true, z: 4, voice: 'baby' });
    const frog = S.actor('critter', { kind: 'frog', x: 320, y: G, z: 5, alpha: 0 });
    // Old Wren, squinting in the rain
    let t = say(S, 0.6, wren, 'అయ్యో! కళ్ళద్దాలు లేకుండా నాకు ఏమీ కనిపించట్లేదు!', "Oh dear! I can't see without my glasses!", 3.0);
    wren.shake(0.7, 0.6, 2);
    S.effect(1.0, 'mark', 0, 0, { follow: wren, text: '?', color: '#fff', dur: 1.2 });
    // the glasses are right there in the puddle (kids will shout!)
    S.effect(2.6, 'sparkle', 594, G - 6, { dur: 1.4, size: 0.6 }); S.sfx(2.6, 'twinkle');
    rex.walk(t - 0.6, 548, 1.6); rex.set(t + 1.0, { pose: 'idle', wave: true });
    t = say(S, t + 1.0, rex, 'వ్రెన్! రెక్స్ ఇక్కడ!', 'Wren! Rex here!', 2.0);
    rex.set(t, { wave: false });
    // Wren says hello... to the mailbox
    wren.walk(t, 440, 0.6);
    t = say(S, t + 0.4, wren, 'హలో రెక్స్! నువ్వు ఎంత పొడుగయ్యావు!', "Hello, Rex! My, you've grown so TALL!", 2.8);
    wren.hop(t - 1.6, 10, 0.3); S.sfx(t - 1.6, 'clink');
    S.effect(t - 1.6, 'text', 392, G - 125, { text: 'pat pat', fs: 46, color: '#fff', dur: 1.0 });
    rex.set(t, { pose: 'hmm' }); S.effect(t, 'mark', 0, 0, { follow: rex, text: '?', color: '#fff', dur: 1.0 });
    t = say(S, t + 0.2, rex, 'అది... తపాలా డబ్బా.', 'That... mailbox.', 2.0);
    // a frog hops in; Wren thinks the frog is Rex
    frog.set(t, { alpha: 1 }).hop(t, 40, 0.45).to(t, { x: 352 }, 0.45);
    S.sfx(t + 0.4, 'ribbit'); S.effect(t + 0.4, 'text', 352, G - 70, { text: 'ribbit!', fs: 44, color: '#fff', dur: 0.9 });
    t = say(S, t + 0.9, wren, 'రెక్స్? ఇంత చిన్నగా... బెక బెక అంటున్నావేంటి?', 'Rex? Why are you so small and... ribbit-y?', 3.0);
    // the frog hops up onto her umbrella
    frog.hop(t, 120, 0.6).to(t, { x: 423 }, 0.6).set(t + 0.6, { y: G - 126 }); S.sfx(t, 'boing');
    S.effect(t + 0.6, 'text', 423, G - 185, { text: 'ribbit!', fs: 44, color: '#fff', dur: 0.9 }); S.sfx(t + 0.6, 'ribbit');
    rex.set(t + 0.9, { pose: 'plop' }); S.sfx(t + 1.0, 'sigh');
    S.effect(t + 1.0, 'text', 0, 0, { follow: rex, ox: 0, oy: -10, text: 'sigh...', fs: 44, color: '#fff', dur: 1.2 });
    // Rex sniffs out the glasses
    t += 2.3;
    rex.set(t, { pose: 'sniff' }).walk(t, 575, 0.6); S.sfx(t + 0.2, 'sniff');
    rex.set(t + 0.8, { pose: 'lift' }); glasses.to(t + 0.8, { x: 582, y: G - 82 }, 0.35, 'out'); S.sfx(t + 0.9, 'ding');
    S.effect(t + 1.0, 'sparkle', 582, G - 92, { dur: 1.3, size: 0.7 });
    t = say(S, t + 1.1, rex, 'కళ్ళద్దాలు! హార్ట్!', 'Glasses! Heart!', 1.9);
    // ...and tries them on: everything goes blurry and wobbly
    rex.set(t, { pose: 'happy' });
    glasses.to(t, { x: 592, y: G - 62 }, 0.3);
    t = say(S, t + 0.2, rex, 'రెక్స్ పెట్టుకుంటా!', 'Rex try!', 1.4);
    const blur = t;
    S.screen(blur, 3.4, { blur: 7, wobble: 2.2 }); S.sfx(blur, 'wobble'); S.sfx(blur + 0.6, 'wobble');
    rex.set(blur, { pose: 'toddle', faceLeft: true }).walk(blur, 412, 2.2);
    glasses.walk(blur, 404, 2.2);
    rex.to(blur, { rot: 0.12 }, 0.4).to(blur + 0.4, { rot: -0.12 }, 0.5).to(blur + 0.9, { rot: 0.12 }, 0.5).to(blur + 1.4, { rot: -0.1 }, 0.5).to(blur + 1.9, { rot: 0 }, 0.3);
    const bonk = blur + 2.2;
    mailbox.shake(bonk, 0.4, 3); rex.set(bonk, { pose: 'plop' });
    S.effect(bonk, 'text', 392, G - 115, { text: 'BONK!', fs: 80, color: '#fff', dur: 0.9 }); S.sfx(bonk, 'bonk');
    S.effect(bonk + 0.1, 'circling', 0, 0, { follow: rex, oy: 0, dur: 1.6, size: 0.6 });
    glasses.hop(bonk, 40, 0.5).to(bonk, { x: 430, y: G - 4 }, 0.5);
    // glasses go back where they belong
    t = bonk + 1.8;
    rex.set(t, { pose: 'carry', faceLeft: false }); glasses.set(t, { x: 440, y: G - 70 });
    rex.walk(t, 470, 0.8); glasses.walk(t, 500, 0.8);
    wren.set(t + 0.9, { glasses: true }); glasses.set(t + 0.9, { alpha: 0 }); S.sfx(t + 0.9, 'twinkle');
    S.effect(t + 0.9, 'sparkle', 0, 0, { follow: wren, dur: 1.2, size: 0.7 });
    rex.set(t + 0.9, { pose: 'idle' });
    t = say(S, t + 1.1, wren, 'నా కళ్ళద్దాలు! ఇప్పుడు నువ్వు కనిపిస్తున్నావు, రెక్స్!', 'My glasses! Oh, now I can see you, Rex!', 3.0);
    wren.set(t - 1.8, { happy: true }); S.effect(t - 1.6, 'hearts', 0, 0, { follow: wren, dur: 1.4 });
    // Rex the hero celebrates... in the puddle
    rex.set(t, { pose: 'happy' });
    t = say(S, t + 0.1, rex, 'రెక్స్ హీరో!', 'Rex hero!', 1.5);
    rex.set(t, { pose: 'toddle' }).walk(t, 545, 0.6); rex.hop(t + 0.6, 50, 0.5).to(t + 0.6, { x: 590 }, 0.5);
    const splash = t + 1.1;
    rex.set(splash, { pose: 'happy' });
    S.effect(splash, 'text', 580, G - 115, { text: 'SPLASH!', fs: 84, color: '#fff', dur: 1.0 }); S.sfx(splash, 'splash');
    S.effect(splash, 'burst', 590, G - 10, { dur: 0.8, r: 140, color: '#cfe8ff', n: 12 });
    S.effect(splash + 0.25, 'drops', 0, 0, { follow: wren, ox: 4, oy: 18, dur: 2.6, n: 10 });
    wren.set(splash + 0.25, { happy: false });
    S.mutes = [[splash + 0.3, splash + 3.2]];
    t = say(S, splash + 0.8, wren, '...ఇప్పుడు మళ్ళీ ఏమీ కనిపించట్లేదు.', "...And now I can't see AGAIN.", 2.6);
    rex.set(t - 0.6, { pose: 'hmm' }); S.sfx(t - 0.4, 'giggle', { voice: 'baby' });
    wren.set(t + 0.3, { happy: true }); S.sfx(t + 0.3, 'giggle', { voice: 'wren' });
    S.effect(t + 0.4, 'text', 423, G - 185, { text: 'ribbit!', fs: 48, color: '#fff', dur: 1.0 }); S.sfx(t + 0.4, 'ribbit');
    frog.hop(t + 0.4, 18, 0.3);
    void rain; void puddle;
    return t + 1.6;
  }

  /* ---------------- 2. Hide and Seek! ---------------- */
  function hideSeek(S) {
    S.bgT.set(0, { type: 'paper', ground: G });
    cam(S, 0, 490, 0.97);
    const grass = S.actor('thing', { kind: 'tallGrass', x: 372, y: G, seed: 2, z: 5 });
    const leaves = S.actor('thing', { kind: 'leafPile', x: 560, y: G, seed: 4, z: 5 });
    const rex = S.actor('baby', { x: 470, y: G, s: 1.1, pose: 'idle', z: 4, voice: 'baby' });
    const nix = S.actor('nix', { x: 545, y: G, s: 1.0, pose: 'taunt', faceLeft: true, z: 3, voice: 'nix' });
    const tiko = S.actor('babyTiko', { x: 405, y: G, s: 1.0, faceLeft: false, z: 3, voice: 'babyTiko' });
    const momo = S.actor('babyMomo', { x: 600, y: G, s: 1.0, faceLeft: true, z: 3, voice: 'momo' });
    const bush = S.actor('thing', { kind: 'bush', x: 740, y: G, seed: 6, z: 6, alpha: 0 });
    const bucket = S.actor('thing', { kind: 'bucket', x: 330, y: G - 30, seed: 3, z: 7, alpha: 0 });
    const fly = S.actor('critter', { kind: 'butterfly', x: 900, y: G - 160, z: 8 });
    let t = say(S, 0.5, nix, 'దాగుడుమూతలు ఆడదాం! రెక్స్ లెక్కపెట్టు!', "Let's play hide-and-seek! Rex counts!", 2.8);
    // Rex counts (and skips a few numbers)
    rex.set(t, { pose: 'hmm', faceLeft: true });
    S.effect(t + 0.2, 'text', 0, 0, { follow: rex, ox: -20, oy: -10, text: '1...', fs: 50, color: '#fff', dur: 0.8 }); S.sfx(t + 0.2, 'talk', { voice: 'baby', n: 2 });
    S.effect(t + 0.9, 'text', 0, 0, { follow: rex, ox: -20, oy: -10, text: '2...', fs: 50, color: '#fff', dur: 0.8 }); S.sfx(t + 0.9, 'talk', { voice: 'baby', n: 2 });
    S.effect(t + 1.6, 'text', 0, 0, { follow: rex, ox: -20, oy: -10, text: '10!', fs: 70, color: '#fff', dur: 0.9 }); S.sfx(t + 1.6, 'talk', { voice: 'baby', n: 2, pitch: 1.3 });
    S.caption(t + 0.2, 2.2, 'ఒకటి... రెండు... పది!', 'One... two... TEN!');
    // everyone scrambles
    tiko.walk(t + 0.1, 368, 0.6); S.sfx(t + 0.1, 'tiptoe');
    momo.set(t + 0.2, { faceLeft: true }).walk(t + 0.2, 565, 0.4).set(t + 0.6, { alpha: 0 }); S.sfx(t + 0.6, 'leaves');
    S.effect(t + 0.6, 'burst', 560, G - 20, { dur: 0.6, r: 80, color: '#bbb', n: 8 }); leaves.shake(t + 0.6, 0.4, 3);
    nix.set(t + 0.1, { pose: 'dash', faceLeft: false }).walk(t + 0.1, 760, 0.6).set(t + 0.7, { pose: 'sneak' });
    bush.set(t + 0.7, { alpha: 1 }); S.sfx(t + 0.7, 'leaves');
    t += 2.6;
    rex.set(t, { pose: 'happy', faceLeft: false });
    t = say(S, t + 0.1, rex, 'రెడీ? రెక్స్ వస్తున్నా!', 'Ready? Rex coming!', 1.8);
    // Tiko: the grass hides his face... and nothing else
    rex.set(t, { pose: 'walk', faceLeft: true }).walk(t, 425, 0.7); rex.set(t + 0.7, { pose: 'peek' });
    S.effect(t + 0.8, 'mark', 0, 0, { follow: tiko, text: '!', dur: 0.8 });
    t = say(S, t + 0.9, rex, 'టికో దొరికాడు!', 'Found Tiko!', 1.6);
    tiko.hop(t - 0.8, 30, 0.4).set(t - 0.8, { happy: true });
    t = say(S, t + 0.1, tiko, 'ఎలా తెలిసింది?!', 'How did you KNOW?!', 1.8);
    S.effect(t - 0.6, 'text', 345, G - 45, { text: 'tail!', fs: 46, color: '#fff', dur: 1.0 });
    // Momo: the leaf pile is snoring
    S.effect(t, 'zzz', 575, G - 40, { dur: 2.6 }); S.sfx(t + 0.1, 'snore'); S.sfx(t + 1.2, 'snore');
    rex.set(t, { pose: 'walk', faceLeft: false }).walk(t, 520, 0.8); rex.set(t + 0.8, { pose: 'hmm' });
    leaves.set(t + 1.6, { alpha: 0 }); momo.set(t + 1.6, { alpha: 1, faceLeft: true });
    S.effect(t + 1.6, 'burst', 560, G - 20, { dur: 0.7, r: 110, color: '#bbb', n: 10 }); S.sfx(t + 1.6, 'leaves');
    t = say(S, t + 1.8, rex, 'మోమో... నిద్ర!', 'Momo... sleeping!', 1.8);
    S.effect(t - 1.4, 'zzz', 0, 0, { follow: momo, dur: 1.4 });
    momo.set(t, { happy: true }).hop(t, 16, 0.3); S.sfx(t, 'giggle', { voice: 'momo' });
    // Nix: a bush that only moves when Rex is not looking
    rex.set(t + 0.4, { pose: 'hmm', faceLeft: true });
    t = say(S, t + 0.5, rex, 'నిక్స్ ఎక్కడ?', 'Where Nix?', 1.6);
    let tb = t;
    for (const [bx, look] of [[690, 1.0], [640, 1.0], [600, 1.0]]) {
      bush.to(tb, { x: bx }, 0.5, 'inout'); nix.to(tb, { x: bx + 20 }, 0.5, 'inout'); S.sfx(tb, 'tiptoe');
      rex.set(tb + 0.6, { faceLeft: false }); S.effect(tb + 0.65, 'mark', 0, 0, { follow: rex, text: '?', color: '#fff', dur: 0.6 });
      rex.set(tb + 0.6 + look, { faceLeft: true });
      tb += 0.6 + look + 0.2;
    }
    S.caption(t, tb - t, 'పొద కదులుతోంది! 👀', 'The bush is moving! 👀');
    // a butterfly lands on the bush: ACHOO!
    fly.to(tb - 1.6, { x: 600, y: G - 70 }, 1.6, 'out');
    const sneeze = tb + 0.4;
    S.effect(sneeze - 0.5, 'text', 610, G - 120, { text: 'a... a...', fs: 46, color: '#fff', dur: 0.6 });
    bush.hop(sneeze, 60, 0.5).to(sneeze, { x: 680 }, 0.5); fly.to(sneeze, { x: 760, y: G - 220 }, 1.0, 'out');
    S.effect(sneeze, 'text', 600, G - 130, { text: 'ACHOO!', fs: 84, color: '#fff', dur: 1.0 }); S.sfx(sneeze, 'achoo');
    nix.set(sneeze, { pose: 'caught', x: 600 });
    rex.set(sneeze + 0.2, { faceLeft: false, pose: 'happy' });
    t = say(S, sneeze + 0.6, rex, 'దొరికావు!', 'Found you!', 1.4);
    nix.set(t, { pose: 'sheepish', faceLeft: true });
    t = say(S, t + 0.1, nix, 'అయ్యో, తుమ్ము పట్టించేసింది!', 'Oops! My sneeze gave me away!', 2.4);
    // Rex's turn to hide: the bucket trick
    nix.set(t, { pose: 'stand' }); tiko.set(t, { happy: false });
    t = say(S, t + 0.1, rex, 'ఇప్పుడు రెక్స్ దాక్కుంటాడు!', 'Now Rex hides!', 1.8);
    cam(S, t, 490, 0.97, 0.6);
    rex.set(t, { pose: 'walk', faceLeft: true }).walk(t, 470, 0.4);
    bucket.set(t + 0.5, { alpha: 1, x: 482, y: G - 120, rot: Math.PI }).to(t + 0.5, { y: G - 64 }, 0.35, 'in');
    S.sfx(t + 0.85, 'clink'); rex.set(t + 0.85, { pose: 'idle' });
    t = say(S, t + 1.1, rex, 'రెక్స్ కనిపించడు!', 'Rex invisible!', 2.0, { oy: -30 });
    // everyone plays along
    [tiko, momo, nix].forEach(a => S.effect(t, 'mark', 0, 0, { follow: a, text: '?', color: '#fff', dur: 0.8 }));
    nix.set(t + 0.6, { pose: 'happy' });
    t = say(S, t + 0.8, nix, 'అరే! రెక్స్ ఎక్కడా కనిపించట్లేదే!', "Oh no! Where is Rex? We can't find him ANYWHERE!", 2.8);
    bucket.shake(t - 1.6, 1.4, 2); S.sfx(t - 1.4, 'giggle', { voice: 'baby' });
    S.effect(t - 1.4, 'text', 482, G - 140, { text: 'hee hee', fs: 44, color: '#fff', dur: 1.2 });
    // FOUND YOU!
    bucket.hop(t, 90, 0.6).to(t, { x: 400, rot: Math.PI * 3 }, 0.6).set(t + 0.6, { alpha: 0 }); S.sfx(t, 'boing');
    rex.set(t, { pose: 'happy' });
    t = say(S, t + 0.1, tiko, 'దొరికావు!!', 'FOUND YOU!!', 1.8);
    [rex, tiko, momo, nix].forEach((a, i) => a.hop(t - 1.2 + i * 0.08, 28, 0.45));
    S.effect(t - 1.0, 'hearts', 0, 0, { follow: rex, dur: 1.6 }); S.sfx(t - 1.0, 'tada');
    void grass;
    return t + 0.8;
  }

  /* ---------------- 3. Achoo! Fire Sneeze ---------------- */
  function fireSneeze(S) {
    S.bgT.set(0, { type: 'paper', ground: G });
    cam(S, 0, 487, 0.93);
    const mama = S.actor('baby', { x: 352, y: G, s: 1.45, mama: true, pose: 'idle', z: 2, voice: 'mama' });
    const rex = S.actor('baby', { x: 410, y: G, s: 1.1, pose: 'idle', z: 4, voice: 'baby' });
    const cake = S.actor('cupcake', { x: 480, y: G, s: 1.15, z: 3 });
    const present = S.actor('present', { x: 668, y: G, s: 1.0, z: 2 });
    const tiko = S.actor('babyTiko', { x: 548, y: G, s: 1.05, faceLeft: true, z: 4, voice: 'babyTiko' });
    const stella = S.actor('babyStella', { x: 612, y: G, s: 0.95, z: 3, voice: 'stella' });
    const hats = [[tiko, 17, -42], [stella, -18, -25], [rex, 4, -80]].map(([a, ox, oy]) => ({ h: S.actor('partyHat', { s: 0.8, z: 6, flyUp: 0, attach: { a, ox, oy } }) }));
    const dandelion = S.actor('thing', { kind: 'dandelion', x: 385, y: G, seed: 2, z: 1 });
    const breath = S.actor('breath', { x: 430, y: G - 52, prog: 0, alpha: 0, z: 7 });
    let t = say(S, 0.5, mama, 'టికో పుట్టినరోజు! కొవ్వొత్తి ఎవరు వెలిగిస్తారు?', "It's Tiko's birthday! Who will light the candle?", 3.0);
    rex.set(t, { pose: 'happy' }).hop(t, 26, 0.4);
    t = say(S, t + 0.1, rex, 'రెక్స్! అగ్ని శ్వాస!', 'Rex! Fire breath!', 1.8);
    // try 1: pff.
    rex.set(t, { pose: 'idle' }).walk(t, 432, 0.4);
    rex.to(t + 0.5, { sy: 1.1, sx: 0.95 }, 0.6); S.sfx(t + 0.5, 'inhale', { dur: 0.6 });
    rex.to(t + 1.1, { sy: 1, sx: 1 }, 0.15);
    S.effect(t + 1.15, 'puff', 0, 0, { follow: rex, ox: 30, oy: 30, dur: 1.0, n: 2 }); S.sfx(t + 1.15, 'pop');
    S.effect(t + 1.2, 'text', 0, 0, { follow: rex, ox: 60, oy: 0, text: 'pff.', fs: 44, color: '#fff', dur: 0.9 });
    rex.set(t + 1.6, { pose: 'hmm' });
    tiko.set(t + 1.8, { happy: true }); S.sfx(t + 1.8, 'giggle', { voice: 'babyTiko' });
    stella.set(t + 2.0, { happy: true }); S.sfx(t + 2.0, 'giggle', { voice: 'stella' });
    // try 2: hic!
    t += 2.8;
    tiko.set(t, { happy: false }); stella.set(t, { happy: false });
    rex.set(t, { pose: 'idle' }).to(t, { sy: 1.16, sx: 0.94, rot: -0.1 }, 1.0); S.sfx(t, 'inhale', { dur: 1.0 });
    rex.shake(t + 0.5, 0.5, 1.5);
    const hic = t + 1.1;
    rex.to(hic, { sy: 1, sx: 1, rot: 0 }, 0.12).hop(hic, 24, 0.3);
    S.effect(hic, 'text', 0, 0, { follow: rex, ox: 30, oy: -10, text: 'hic!', fs: 56, color: '#fff', dur: 0.8 }); S.sfx(hic, 'hic');
    S.effect(hic + 0.05, 'puff', 0, 0, { follow: rex, ox: 20, oy: 10, dur: 1.2, n: 3, dir: 0.3 });
    t = say(S, hic + 0.7, mama, 'నెమ్మదిగా, చిన్నోడా.', 'Gently, little one.', 1.9);
    // a dandelion... the nose tickles... a... a... AAA...
    S.effect(t, 'fluff', 385, G - 50, { dur: 2.0, dx: 55, n: 6 }); S.sfx(t, 'twinkle');
    const a0 = t + 1.2;
    S.mutes = [[a0, a0 + 3.6]];
    ['a...', 'aa...', 'AAA...'].forEach((w, i) => {
      rex.to(a0 + i * 0.7, { rot: -0.08 - i * 0.06, sy: 1.04 + i * 0.04 }, 0.5);
      S.effect(a0 + i * 0.7, 'text', 0, 0, { follow: rex, ox: 10, oy: -14 - i * 8, text: w, fs: 44 + i * 16, color: '#fff', dur: 0.7 });
      S.sfx(a0 + i * 0.7, 'aah', { pitch: 1 + i * 0.15, dur: 0.5 });
    });
    [tiko, stella].forEach(a => a.to(a0 + 0.8, { sx: 0.9, rot: 0.08 }, 0.6).set(a0 + 0.8, { crying: false }));
    S.effect(a0 + 1.0, 'mark', 0, 0, { follow: tiko, text: '!', dur: 0.8 });
    // ...nothing. phew.
    const nothing = a0 + 2.2;
    rex.to(nothing, { rot: 0, sy: 1 }, 0.3);
    S.effect(nothing + 0.1, 'text', 0, 0, { follow: rex, ox: 20, oy: -10, text: '...', fs: 60, color: '#fff', dur: 0.8 });
    [tiko, stella].forEach(a => a.to(nothing + 0.4, { sx: 1, rot: 0 }, 0.3));
    say(S, nothing + 0.5, stella, 'హమ్మయ్య!', 'Phew!', 0.9);
    // ACHOO!!! (fire!)
    const achoo = nothing + 1.4;
    rex.set(achoo, { rot: 0.2 }).to(achoo + 0.1, { rot: 0 }, 0.5, 'back');
    breath.set(achoo, { alpha: 1, x: 457, y: G - 60 }).to(achoo, { prog: 1 }, 0.35, 'out').to(achoo + 0.6, { alpha: 0 }, 0.4);
    cake.set(achoo + 0.25, { lit: true });
    S.effect(achoo, 'text', 0, 0, { follow: rex, ox: 40, oy: -40, text: 'ACHOO!', fs: 100, color: '#f2a33a', dur: 1.2 });
    S.effect(achoo, 'flash', 0, 0, { screen: true, dur: 0.4, a: 0.35, color: '#f2a33a' });
    S.camShake(achoo, 0.5, 6); S.sfx(achoo, 'achoo'); S.sfx(achoo + 0.12, 'fwoosh');
    // the party hats blow off... and drop back on
    hats.slice(0, 2).forEach(({ h }, i) => { h.to(achoo + 0.12 + i * 0.05, { flyUp: 1 }, 0.4, 'out'); h.to(achoo + 0.6 + i * 0.05, { flyUp: 0 }, 0.6, 'bounce'); });
    [tiko, stella].forEach(a => a.set(achoo + 0.15, { crying: false }).to(achoo + 0.15, { sx: 0.85 }, 0.2).to(achoo + 0.4, { sx: 1 }, 0.4, 'back'));
    // silence... then it's lit!
    t = say(S, achoo + 1.4, tiko, '...వెలిగింది!', "...It's LIT!", 1.6);
    S.mutes.push([achoo + 0.2, achoo + 1.5]);
    tiko.set(t, { happy: true }); stella.set(t, { happy: true }); rex.set(t, { pose: 'happy' });
    S.sfx(t, 'tada'); S.effect(t, 'notes', 480, G - 200, { dur: 2.4 }); S.effect(t + 0.2, 'sparkle', 480, G - 80, { dur: 1.6 });
    t = say(S, t + 0.1, mama, 'హ్యాపీ బర్త్‌డే, టికో!', 'Happy birthday, Tiko!', 2.0);
    // Tiko's wish... and the second sneeze
    t = say(S, t + 0.1, tiko, 'ఇప్పుడు నా కోరిక కోరుకుంటా...', 'Now I make my wish...', 2.0);
    tiko.set(t, { happy: false }).to(t, { sy: 1.12, sx: 0.95 }, 0.8); S.sfx(t, 'inhale', { dur: 0.8 });
    S.effect(t + 0.3, 'text', 0, 0, { follow: rex, ox: 10, oy: -14, text: 'a...', fs: 46, color: '#fff', dur: 0.5 }); rex.set(t + 0.3, { pose: 'idle' }).to(t + 0.3, { rot: -0.1 }, 0.4);
    const ach2 = t + 0.8;
    rex.set(ach2, { rot: 0.18 }).to(ach2 + 0.1, { rot: 0 }, 0.4, 'back');
    S.effect(ach2, 'text', 0, 0, { follow: rex, ox: 40, oy: -40, text: 'ACHOO!', fs: 80, color: '#fff', dur: 1.0 }); S.sfx(ach2, 'achoo');
    cake.set(ach2 + 0.15, { lit: false });
    S.effect(ach2 + 0.15, 'puff', 480, G - 62, { screen: false, dur: 1.2, n: 3, dir: 0.4 });
    tiko.to(ach2 + 0.1, { sy: 1, sx: 1 }, 0.2);
    S.mutes.push([ach2 + 0.2, ach2 + 2.8]);
    t = say(S, ach2 + 0.6, tiko, 'హేయ్! అది నా కోరిక!', 'Heyyy! That was MY wish!', 2.0);
    tiko.set(ach2 + 0.6, { crying: true });
    rex.set(t, { pose: 'hmm' });
    t = say(S, t + 0.1, rex, 'అయ్యో... సారీ!', 'Oops... sorry!', 1.6);
    tiko.set(t, { crying: false, happy: true }); S.sfx(t, 'giggle', { voice: 'babyTiko' });
    t = say(S, t + 0.1, mama, 'మళ్ళీ వెలిగిద్దాం!', "Let's light it again!", 1.8);
    // everyone looks at Rex... a... ACHOO! (cut)
    [mama, tiko, stella].forEach(a => S.effect(t, 'mark', 0, 0, { follow: a, text: '!', dur: 0.7 }));
    S.effect(t + 0.3, 'text', 0, 0, { follow: rex, ox: 10, oy: -14, text: 'a... a...', fs: 52, color: '#fff', dur: 0.8 });
    rex.to(t + 0.3, { rot: -0.12 }, 0.5);
    const last = t + 1.15;
    S.effect(last, 'text', 0, 0, { follow: rex, ox: 40, oy: -40, text: 'ACHOO!', fs: 110, color: '#f2a33a', dur: 0.8 }); S.sfx(last, 'achoo'); S.sfx(last + 0.1, 'fwoosh');
    S.effect(last, 'flash', 0, 0, { screen: true, dur: 0.5, a: 0.6, color: '#f2a33a' });
    void present; void dandelion;
    return last + 0.6;
  }

  Object.assign(window.EPISODES, {
    cl_glasses: o => classicShort({ ...o, seed: 21, title: { te: 'వ్రెన్ బామ్మకు కనిపించట్లేదు!', en: "Wren Can't See!" }, kicker: 'LITTLE REX · 1' }, wrenGlasses),
    cl_hide: o => classicShort({ ...o, seed: 22, title: { te: 'దాగుడుమూతలు!', en: 'Hide and Seek!' }, kicker: 'LITTLE REX · 2' }, hideSeek),
    cl_sneeze: o => classicShort({ ...o, seed: 23, title: { te: 'హాచ్ఛీ! అగ్ని తుమ్ము', en: 'Achoo! Fire Sneeze' }, kicker: 'LITTLE REX · 3' }, fireSneeze),
  });

  // Dev only: every prop and character side by side, to check how they look.
  window.EPISODES.catalog = o => {
    const S = new Story({ ...o, portrait: false, duration: 1, style: 'ink' });
    S.bgT.set(0, { type: 'paper', ground: G });
    S.camAt(0, 480, 300, 1.9);
    ['mailbox', 'leafPile', 'bucket', 'dandelion', 'puddle', 'tallGrass', 'bush', 'umbrella', 'hayBale']
      .forEach((k, i) => S.actor('thing', { kind: k, x: 40 + i * 105, y: 470, seed: 3 }));
    return S;
  };
})();
