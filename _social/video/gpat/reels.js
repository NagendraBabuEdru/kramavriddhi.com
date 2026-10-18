// Scene content for the GPAT Prep reels. Times are in seconds; data-in is relative to the scene start.
// Phone screens are real captures of the live app (capture.js -> cap/*.jpg). Facts on screen come from the
// app itself: 125 questions / 180 min / +4 −1 0 marking, 1,746 questions, review intervals 1-3-7-16-35 days.
// Subject weightage is the app's estimate from past papers, never called official.
// English only (owner's choice, Oct 2026); engine.js still supports lang: 'te' if Telugu comes back.
// Rules: say "AI-generated study aid, verify with your textbooks" on every end card; no rank or score promises;
// no affiliation with NTA, AICTE or PCI; no medical or dosing claims.
const PARROT = `<svg viewBox="0 0 64 64" style="width:100%;height:100%"><path d="M22 50 L14 62 L22 58 L24 63 L28 52 Z" fill="#1f8a4c"/><path d="M26 51 L22 63 L30 56 Z" fill="#2563eb"/><ellipse cx="31" cy="40" rx="14" ry="15" fill="#22c55e"/><ellipse cx="34" cy="44" rx="8" ry="10" fill="#bbf7d0"/><path d="M19 34 C14 44 18 54 28 55 C24 48 24 40 27 34 Z" fill="#15803d"/><path d="M20 46 C21 50 24 53 28 55 C25 51 24 48 24 45 Z" fill="#dc2626"/><circle cx="35" cy="20" r="13" fill="#22c55e"/><path d="M30 8 C31 3 36 2 37 7 C39 3 43 5 41 10 Z" fill="#16a34a"/><circle cx="37" cy="26" r="3" fill="#fb7185" opacity="0.7"/><circle cx="39" cy="17" r="4.2" fill="#fff"/><circle cx="40" cy="17" r="2.3" fill="#111827"/><circle cx="40.8" cy="16" r="0.8" fill="#fff"/><path d="M45 18 C53 17 55 24 50 29 C50 25 48 23 45 23 Z" fill="#f97316"/><path d="M45 23 C48 23 50 25 50 29 C47 28 45 26 45 23 Z" fill="#c2410c"/><path d="M28 55 v4 M34 55 v4" stroke="#f59e0b" stroke-width="2.5" stroke-linecap="round"/></svg>`;

const END = {
  en: `
    <div class="parrot" data-in="0" data-fx="pop">{PARROT}</div>
    <div class="title" data-in="0.3">GPAT Prep</div>
    <div class="what" data-in="0.6">Free GPAT study app. Opens in your phone browser.</div>
    <div class="url" data-in="1.0" data-fx="pop" data-pulse>kramavriddhi.com/apps/gpat</div>
    <div class="link" data-in="1.5">🔗 Link in bio</div>
    <div class="safe" data-in="2.2" data-fx="fade">⚠️ AI-generated study aid. Verify with your textbooks.
      <div class="s2">Not affiliated with NTA, AICTE or PCI. Not medical advice.</div></div>`,
};
const head = (h, sub, tin = 0) => `<div class="head" data-in="${tin}">${h}</div>` + (sub ? `<div class="sub" data-in="${tin + 0.5}">${sub}</div>` : '');

// ------------------------------------------------------------ Reel 2: mock test
function mockReel(lang) {
  const T = {
    en: {
      hook: `<div class="kicker" data-in="0">Practise GPAT</div>
        <div class="h1 gold" data-in="0.3">like the real exam</div>`,
      s1: head('Full mock: 125 questions, 3 hours', 'Or a 60-question half paper, or a 25-question quick mock'),
      s2: head('Real marking: <span class="green">+4</span> right, <span class="red">−1</span> wrong', 'Skip = 0. And a timer runs, just like exam day.'),
      s3: head('Flag, skip, and jump to any question'),
      s4: head('See your score and the marks lost to guessing', 'Then review every answer with its explanation'),
      timer: '⏱ Timer', flag: '⚐ Flagged',
    },
  }[lang];
  return {
    file: `gpat-reel-2-mock-${lang}`, lang, duration: 30, tag: '📝 GPAT Prep', music: { root: 57, seed: 2 },
    scenes: [
      { start: 0, html: T.hook + `
        <div class="chips">
          <div class="chip big" data-in="1.0" data-fx="pop">125 Q</div>
          <div class="chip big" data-in="1.4" data-fx="pop">180 min</div>
          <div class="chip big" data-in="1.8" data-fx="pop"><span class="green">+4</span>&nbsp;/&nbsp;<span class="red">−1</span></div>
        </div>` },
      { start: 3.5, phone: true, html: T.s1 },
      { start: 8.5, phone: true, html: T.s2 },
      { start: 14.5, phone: true, html: T.s3 },
      { start: 18.5, phone: true, html: T.s4 },
      { start: 23.5, cls: 'full end', html: END[lang] },
    ],
    screens: [
      { at: 0, img: 'mock-top' },
      { at: 8.5, img: 'mockq-7' },
      { at: 11.2, img: 'mockq-7-picked' },
      { at: 14.5, img: 'mock-palette', zoom: { at: 15.2, dur: 1, s: 1.2, x: 390, y: 420 } },
      { at: 18.5, img: 'mock-result-full', y0: 0, y1: 700, pan: [20.5, 23] },
    ],
    taps: [{ at: 10.8, img: 'mockq-7' }],
    callouts: [{ at: 9.4, out: 14.2, html: T.timer, x: 700, y: 560, rot: 4 }],
  };
}

// ------------------------------------------------------------ Reel 4: Chilaka
function chilakaReel(lang) {
  const T = {
    en: {
      hook: `<div class="bigparrot" data-in="0" data-fx="pop">{PARROT}</div>
        <div class="h1" data-in="0.5">Meet <span class="gold">Chilaka</span></div>
        <div class="sub" data-in="0.9" style="font-size:52px">your GPAT study buddy</div>`,
      s1: head('Chilaka pops up the first time you open a page'),
      s2: head('and explains what each page is for'),
      s3: head('Exam tips, right when you need them', 'Like: guessing costs marks, so skip if unsure'),
      s4: head('Plus an honest reminder', 'The notes are AI-written. If your textbook differs, trust the textbook.'),
    },
  }[lang];
  return {
    file: `gpat-reel-4-chilaka-${lang}`, lang, duration: 30, tag: '🦜 GPAT Prep', music: { root: 60, seed: 3 },
    scenes: [
      { start: 0, html: T.hook },
      { start: 4, phone: true, html: T.s1 },
      { start: 9.5, phone: true, html: T.s2 },
      { start: 15, phone: true, html: T.s3 },
      { start: 19.5, phone: true, html: T.s4 },
      { start: 24, cls: 'full end', html: END[lang] },
    ],
    screens: [
      { at: 0, img: 'chilaka-dash-1', zoom: { at: 5, dur: 1, s: 1.12, x: 780, y: 1640 } },
      { at: 7.3, img: 'chilaka-dash-2', zoom: { at: 0, dur: 0.01, s: 1.12, x: 780, y: 1640 } },
      { at: 9.5, img: 'chilaka-syllabus-1' },
      { at: 12.2, img: 'chilaka-revise-1' },
      { at: 15, img: 'chilaka-mock-2', zoom: { at: 15.6, dur: 1, s: 1.12, x: 780, y: 1640 } },
      { at: 19.5, img: 'chilaka-topic-4', zoom: { at: 20.1, dur: 1, s: 1.12, x: 780, y: 1640 } },
    ],
    taps: [{ at: 6.7, img: 'chilaka-dash-1' }],
  };
}

const REELS = {
  // ---------------------------------------------------------- Reel 1: what to study first
  'study-en': {
    file: 'gpat-reel-1-study-first-en', lang: 'en', duration: 28, tag: '🎯 GPAT Prep', music: { root: 55, seed: 1 },
    scenes: [
      { start: 0, html: `
        <div class="kicker" data-in="0">GPAT has</div>
        <div class="mega" data-in="0.2" data-fx="count" data-count="125" data-pulse>125</div>
        <div class="kicker" data-in="0.9">questions.</div>
        <div class="h1 gold mt" data-in="1.5">Where do you start?</div>` },
      { start: 4, phone: true, html: head('See what each subject is worth', 'Question counts estimated from past papers. Not official.') },
      { start: 10, phone: true, html: head('Pharmacology alone ≈ 18 of 125', 'Start with the big subjects. They pay back the most.') },
      { start: 15, phone: true, html: head('Then it shows where you are losing the most marks', 'Based on your own practice answers') },
      { start: 21, cls: 'full end', html: END.en },
    ],
    screens: [
      { at: 0, img: 'syllabus-full', y0: 0, y1: 3000, pan: [5.4, 9.7] },
      { at: 10, img: 'mock-blueprint', zoom: { at: 10.6, dur: 1, s: 1.3, x: 60, y: 300 } },
      { at: 15, img: 'analytics-table' },
    ],
  },

  'mock-en': mockReel('en'),

  // ---------------------------------------------------------- Reel 3: flashcards
  'cards-en': {
    file: 'gpat-reel-3-flashcards-en', lang: 'en', duration: 27, tag: '🔁 GPAT Prep', music: { root: 62, seed: 1 },
    scenes: [
      { start: 0, html: `
        <div class="h1" data-in="0">Read it once.</div>
        <div class="h1 gold" data-in="0.9">Forgot it by exam day?</div>` },
      { start: 3.5, phone: true, html: head('Flashcards: try to recall, then flip') },
      { start: 9, phone: true, html: `<div class="head" data-in="0">Remembered? It comes back after</div>
        <div class="days">
          <div class="d" data-in="0.5" data-fx="pop">1</div><div class="a" data-in="0.7" data-fx="fade">→</div>
          <div class="d" data-in="0.9" data-fx="pop">3</div><div class="a" data-in="1.1" data-fx="fade">→</div>
          <div class="d" data-in="1.3" data-fx="pop">7</div><div class="a" data-in="1.5" data-fx="fade">→</div>
          <div class="d" data-in="1.7" data-fx="pop">16</div><div class="a" data-in="1.9" data-fx="fade">→</div>
          <div class="d" data-in="2.1" data-fx="pop">35</div><div class="a" data-in="2.3" data-fx="fade">days</div>
        </div>
        <div class="sub" data-in="3">Blanked? It comes back soon.</div>` },
      { start: 15, phone: true, html: head('Wrong answers land in your mistake notebook', 'Get one right and it leaves the list') },
      { start: 20, cls: 'full end', html: END.en },
    ],
    screens: [
      { at: 0, img: 'revise-q' },
      { at: 6.4, img: 'revise-a' },
      { at: 10.2, img: 'revise-week' },
      { at: 15, img: 'mistakes' },
    ],
    taps: [{ at: 6, img: 'revise-q' }, { at: 9.6, img: 'revise-a' }],
  },

  'chilaka-en': chilakaReel('en'),

  // ---------------------------------------------------------- Reel 5: free, no sign-up
  'free-en': {
    file: 'gpat-reel-5-free-en', lang: 'en', duration: 29, tag: '📱 GPAT Prep', music: { root: 57, seed: 3 },
    scenes: [
      { start: 0, html: `
        <div class="stack">
          <div class="stamp" data-in="0" data-fx="stamp" data-dur="0.5">FREE</div>
          <div class="stamp" data-in="0.8" data-fx="stamp" data-dur="0.5">NO SIGN-UP</div>
          <div class="stamp" data-in="1.6" data-fx="stamp" data-dur="0.5">ON YOUR PHONE</div>
        </div>
        <div class="sub mt" data-in="2.4" style="font-size:48px">A GPAT study app for B.Pharm students</div>` },
      { start: 4, phone: true, html: head('No email. No password. No OTP.', 'Just type a name and start.') },
      { start: 9.5, phone: true, html: head('It tells you upfront: the material is AI-generated', 'Use it to revise and test yourself, alongside your textbooks') },
      { start: 14.5, phone: true, html: head('1,746 practice questions', 'Notes at 3 levels: basic, exam level, advanced') },
      { start: 19, phone: true, html: head('Your progress stays on your phone', 'Export a backup file any time from Settings') },
      { start: 23, cls: 'full end', html: END.en },
    ],
    screens: [
      { at: 0, img: 'start-empty' },
      { at: 5.6, img: 'start-name' },
      { at: 9.5, img: 'start-gate-full', y0: 0, y1: 500, pan: [11, 14] },
      { at: 14.5, img: 'topic-full', zoom: { at: 15.2, dur: 1, s: 1.3, x: 40, y: 560 } },
      { at: 19, img: 'dash-data' },
    ],
    taps: [{ at: 7.6, img: 'start-name' }],
  },
};
