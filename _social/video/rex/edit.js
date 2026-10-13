// Cut list for the Rex promo videos. src = [from, to] seconds in take.mkv (1920x1080, recorded by
// capture.js), crop = [x, y, w, h] of the take shown in that clip. Captions: en (English), te (Telugu).
// Only real game features appear: name + dino buddy, run/jump, ledges and vines, rescuing friends,
// growing bigger after each stage, swimming, rope bridges, roaring at raptors, the Gnash boss fight.
// Times below match the take recorded on 2026-10-13 (see take.jsonl for where things happen).
const C43 = x => [x, 0, 1440, 1080];            // 4:3 window for the Short's gameplay panel
const BOSS = { t: 214.3, crop: [0, 0, 1920, 1080] };   // big Rex + herd facing Gnash

module.exports = {
  short: {
    file: 'rex-short.mp4', W: 1080, H: 1920, seed: 7,
    panel: { x: 40, y: 560, w: 1000, h: 750 },
    images: { hero: BOSS },
    segments: [
      { src: [27.2, 29.6], crop: C43(0), hook: true, en: '🦖 Can you help Rex rescue his friends?', te: 'రెక్స్ తన స్నేహితులను కాపాడగలడా?' },
      { src: [1.2, 5.4], crop: C43(240), scene: 'who', en: 'Pick your dino buddy', te: 'నీ పేరు రాసి, డైనో దోస్త్‌ని ఎంచుకో' },
      { src: [31.0, 34.4], crop: C43(0), en: 'Run, jump & grab coins!', te: 'పరుగెత్తు, దూకు, నాణేలు పట్టు!' },
      { src: [34.4, 38.2], crop: C43(0), en: 'Rescue your friends', te: 'చిక్కుకున్న స్నేహితులను కాపాడు' },
      { src: [183.6, 186.8], crop: C43(400), en: 'Rex grows bigger!', te: 'ప్రతి దశ తర్వాత రెక్స్ పెద్దవుతాడు!' },
      { src: [75.4, 77.8], crop: C43(0), badge: 'Fern River', en: 'Swim the river', te: 'నదిని ఈదు' },
      { src: [141.6, 144.2], crop: C43(0), badge: 'Raptor Ridge', en: 'Roar at the raptors!', te: 'రాప్టర్లపై గర్జించు!' },
      { src: [209.0, 211.6], crop: C43(240), badge: 'Volcano Lair', en: 'Beat Gnash, the Raptor King', te: 'రాప్టర్ రాజు గ్నాష్‌ను ఓడించు' },
      { kind: 'end', dur: 4.5 },
    ],
  },
  trailer: {
    file: 'rex-trailer.mp4', W: 1920, H: 1080, seed: 3, level: '4.2',
    images: { art: { t: 6.6, crop: [105, 188, 470, 368] }, hero: BOSS },
    segments: [
      { kind: 'title', dur: 3.2 },
      { src: [1.0, 5.8], scene: 'who', pos: 'top', en: 'Type your name · pick a dino buddy', te: 'నీ పేరు రాసి, డైనో దోస్త్‌ని ఎంచుకో' },
      { src: [7.6, 10.4], flash: false },   // the game's own title card says it all
      { src: [27.0, 33.0], en: 'Run, jump and collect coins', te: 'పరుగెత్తు, దూకు, నాణేలు సేకరించు' },
      { src: [33.0, 38.8], pos: 'top', en: 'Rescue your friends', te: 'చిక్కుకున్న స్నేహితులను కాపాడు' },
      { src: [53.4, 57.0], en: 'After every stage, Rex grows bigger', te: 'ప్రతి దశ తర్వాత రెక్స్ పెద్దవుతాడు' },
      { src: [75.0, 78.8], pos: 'top', en: 'Swim across Fern River', te: 'ఫెర్న్ నదిని ఈదు' },
      { src: [86.6, 91.6], pos: 'top', en: 'Hop the bridge · free Pip', te: 'వంతెనపై దూకు, పిప్‌ని విడిపించు' },
      { src: [120.6, 124.0], en: 'Roar at the raptors!', te: 'రాప్టర్లపై గర్జించు!' },
      { src: [139.0, 142.6], en: 'Climb the vines', te: 'తీగలు పట్టుకుని ఎక్కు' },
      { src: [208.6, 211.6], en: 'Face Gnash, the Raptor King', te: 'రాప్టర్ రాజు గ్నాష్‌తో పోరాడు' },
      { src: [236.6, 239.8], en: 'Gnash is beaten!', te: 'గ్నాష్ ఓడిపోయాడు!' },
      { src: [249.4, 253.4], pos: 'top', en: 'Bring every friend home', te: 'స్నేహితులందరినీ ఇంటికి తీసుకురా' },
      { kind: 'end', dur: 5 },
    ],
  },
  thumb: { bg: { t: 214.3, crop: [40, 230, 1280, 720] } },
};
