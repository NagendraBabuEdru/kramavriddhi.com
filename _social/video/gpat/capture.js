// Records real screens of the live GPAT Prep app (https://kramavriddhi.com/apps/gpat/) at phone size
// (390x844 CSS px, 2x pixels = 780x1688) into cap/*.jpg, plus cap/meta.json with tap points and page heights.
// A demo profile "Priya" answers practice questions and a quick mock so the dashboard and analytics have data.
// Correct answers are read from the app's own bundled question data (apps/gpat/assets), and the demo student
// gets roughly two in three right, so the numbers on screen look like a real attempt, not a perfect one.
// Run: node capture.js            (all)      node capture.js chilaka   (one group: start | main | revise | chilaka)
const fs = require('fs'), path = require('path');
const { open, profile, go, click, sleep } = require('./lib');

const OUT = path.join(__dirname, 'cap');
const ASSETS = path.join(__dirname, '..', '..', '..', 'apps', 'gpat', 'assets');
const DPR = 2;
const meta = fs.existsSync(path.join(OUT, 'meta.json')) ? JSON.parse(fs.readFileSync(path.join(OUT, 'meta.json'))) : {};
const only = process.argv[2];

// stem -> correct option text, from the built content chunks
const ANSWERS = {};
for (const f of fs.readdirSync(ASSETS).filter(f => f.endsWith('.js'))) {
  const src = fs.readFileSync(path.join(ASSETS, f), 'utf8');
  for (const m of src.matchAll(/stem:`([^`]*)`,options:\[([^\]]*)\],answer:(\d)/g)) {
    const opts = [...m[2].matchAll(/`([^`]*)`/g)].map(x => x[1]);
    ANSWERS[m[1].trim()] = opts[+m[3]];
  }
}

let rng = 7; const rand = () => (rng = (rng * 16807) % 2147483647) / 2147483647;

async function shot(page, name, { full = false, scrollTo } = {}) {
  if (scrollTo !== undefined) {
    await page.evaluate(t => {
      const el = typeof t === 'string' ? [...document.querySelectorAll('h1,h2,h3,h4,div,section')].find(e => e.children.length < 6 && e.textContent.trim().startsWith(t)) : null;
      if (el) window.scrollTo(0, el.getBoundingClientRect().top + scrollY - 70); else window.scrollTo(0, +t || 0);
    }, scrollTo);
    await sleep(500);
  }
  await page.screenshot({ path: path.join(OUT, name + '.jpg'), type: 'jpeg', quality: 92, fullPage: full });
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  meta[name] = { ...(meta[name] || {}), height: full ? h * DPR : 844 * DPR };
  console.log('shot', name);
}
// Centre of the element containing `text`, in screenshot pixels (for the tap ring in the reel)
async function point(page, name, text, sel = 'button, a, label, [role=button]') {
  const p = await page.evaluate((text, sel) => {
    const el = [...document.querySelectorAll(sel)].find(e => e.textContent.trim().includes(text) && e.offsetParent !== null);
    if (!el) return null; const r = el.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2];
  }, text, sel);
  meta[name] = { ...(meta[name] || {}), tap: p && p.map(v => Math.round(v * DPR)) };
}
const stem = page => page.evaluate(() => {
  const opt = [...document.querySelectorAll('button')].find(b => /^A\S/.test(b.textContent.trim()));
  let n = opt && opt.parentElement; while (n && !n.previousElementSibling) n = n.parentElement;
  const cands = [...document.querySelectorAll('main p, main h2, main h3, main div')].filter(e => e.children.length === 0 && e.textContent.trim().length > 25);
  return cands.map(e => e.textContent.trim());
});
// Answer the current question: right with probability pRight, else a wrong option
async function answer(page, pRight) {
  const texts = await stem(page);
  const s = texts.find(t => ANSWERS[t]); const right = s && ANSWERS[s];
  const opts = await page.evaluate(() => [...document.querySelectorAll('button')].filter(b => /^[A-D]/.test(b.textContent.trim()) && b.textContent.trim().length > 1 && !/^(All|Again)/.test(b.textContent.trim())).map(b => b.textContent.trim().slice(1)));
  const wantRight = rand() < pRight;
  const pick = right && (wantRight ? right : opts.find(o => o !== right)) || opts[0];
  await page.evaluate(pick => [...document.querySelectorAll('button')].find(b => b.textContent.trim().slice(1) === pick).click(), pick);
  await sleep(250);
  return { right, pick, ok: pick === right };
}

async function main() {
  const { browser, page } = await open({ dpr: DPR });
  await profile(page, 'Priya');

  // Empty dashboard: highest-value untouched topics
  await go(page, '/');
  await shot(page, 'dash-top');
  await shot(page, 'dash-untouched', { scrollTo: 'Highest-value untouched topics' });

  // Syllabus (full page to pan) and a topic with three note levels
  await go(page, '/syllabus');
  await shot(page, 'syllabus-full', { full: true });
  await shot(page, 'syllabus-top', { scrollTo: 0 });
  await click(page, 'Pharmacology', 'button.row-between'); await sleep(600);
  await shot(page, 'syllabus-topics', { scrollTo: 'Pharmacology' });
  await page.evaluate(() => { const a = document.querySelector('a[href*="topic/"]'); a && a.click(); }); await sleep(2500);
  await shot(page, 'topic-top', { scrollTo: 0 });
  await shot(page, 'topic-full', { full: true });

  // Mock page and blueprint
  await go(page, '/mock');
  await shot(page, 'mock-top', { scrollTo: 0 });
  await shot(page, 'mock-blueprint', { scrollTo: 'Blueprint being sampled' });

  // Practice with instant answers: 30 questions so analytics fills in
  await go(page, '/practice');
  await shot(page, 'practice-setup', { scrollTo: 0 });
  await click(page, '30 questions');
  await click(page, 'Start practice'); await sleep(1500);
  for (let i = 0; i < 30; i++) {
    if (i === 0) { await shot(page, 'practice-q', { scrollTo: 0 }); }
    await sleep(2500 + rand() * 3500); // think time, so the timings on the result screen look like a real attempt
    const r = await answer(page, 0.62); await sleep(500);
    if (i === 0) { await shot(page, 'practice-explained', { scrollTo: 0 }); await shot(page, 'practice-explained-full', { full: true }); }
    const ok = await page.evaluate(() => { const b = [...document.querySelectorAll('button')].find(b => /^(Next|Finish|See result|Submit)/.test(b.textContent.trim()) && !b.disabled); if (b) { b.click(); return b.textContent.trim(); } return null; });
    await sleep(500);
    if (i === 29 || !ok) break;
  }
  await sleep(2000);
  await shot(page, 'practice-result', { scrollTo: 0 });

  // Quick mock: 25 questions, demo student answers 21 and skips 4
  await go(page, '/mock');
  await page.evaluate(() => [...document.querySelectorAll('button')].filter(b => b.textContent.trim() === 'Begin')[2].click()); await sleep(2000);
  await shot(page, 'mockq-1', { scrollTo: 0 });
  for (let i = 0; i < 25; i++) {
    await sleep(2500 + rand() * 4000);
    if (i === 6) {
      await shot(page, 'mockq-7', { scrollTo: 0 });
      const r = await answer(page, 1);
      await point(page, 'mockq-7', r.pick.slice(0, 20)); await shot(page, 'mockq-7-picked', { scrollTo: 0 });
      await shot(page, 'mock-palette', { scrollTo: 'Question palette' });
    } else if (i % 6 !== 5) await answer(page, 0.7);
    if (i === 3) { await click(page, '⚐ Flag'); }
    if (i < 24) await click(page, 'Next →');
  }
  await page.evaluate(() => { const b = [...document.querySelectorAll('button')].find(b => /^Submit/.test(b.textContent.trim())); b && b.click(); });
  await sleep(1200);
  await page.evaluate(() => { const b = [...document.querySelectorAll('button')].find(b => /^(Submit|Yes|Confirm)/.test(b.textContent.trim())); b && b.click(); });
  await sleep(2500);
  await shot(page, 'mock-result', { scrollTo: 0 });
  await shot(page, 'mock-result-full', { full: true });

  // Dashboard and analytics with data
  await go(page, '/');
  await shot(page, 'dash-data', { scrollTo: 0 });
  await shot(page, 'dash-fix', { scrollTo: 'Fix these first' });
  await go(page, '/analytics');
  await shot(page, 'analytics-top', { scrollTo: 0 });
  await shot(page, 'analytics-full', { full: true });
  // The weightage table scrolls inside its own box, so a phone-size shot shows subject → accuracy
  await shot(page, 'analytics-table', { scrollTo: 'Weightage vs performance' });
  await go(page, '/mistakes');
  await shot(page, 'mistakes', { scrollTo: 0 });

  await go(page, '/settings');
  await shot(page, 'settings-full', { full: true });
  await browser.close();
}

// Flashcards: question, reveal, rate, then a few more so the 7-day chart fills in.
// Scrolled down 330 px so the card and its buttons sit in the middle of the phone screen.
async function revise() {
  const { browser, page } = await open({ dpr: DPR });
  await profile(page, 'Priya');
  await go(page, '/revise');
  await shot(page, 'revise-top', { scrollTo: 0 });
  await shot(page, 'revise-q', { scrollTo: 330 });
  await point(page, 'revise-q', 'Reveal answer');
  await click(page, 'Reveal answer'); await sleep(500);
  await shot(page, 'revise-a', { scrollTo: 330 });
  await point(page, 'revise-a', 'Good');
  await click(page, 'Good'); await sleep(600);
  await shot(page, 'revise-q2', { scrollTo: 330 });
  for (let i = 0; i < 8; i++) { await sleep(1500); await click(page, 'Reveal answer'); await sleep(1500); await click(page, i % 3 ? 'Good' : 'Easy'); }
  await shot(page, 'revise-week', { scrollTo: 330 });
  await browser.close();
}

// Chilaka: a fresh profile with the buddy left on, visiting pages for the first time
async function chilaka() {
  const { browser, page } = await open({ dpr: DPR });
  await profile(page, 'Priya', { quiet: false });
  await go(page, '/'); await sleep(1500);
  await shot(page, 'chilaka-dash-1', { scrollTo: 0 });
  await point(page, 'chilaka-dash-1', 'Next');
  await click(page, 'Next'); await shot(page, 'chilaka-dash-2');
  await click(page, 'Next'); await shot(page, 'chilaka-dash-3');
  await click(page, 'Next'); await shot(page, 'chilaka-dash-4');
  for (const [h, n] of [['/syllabus', 'syllabus'], ['/mock', 'mock'], ['/revise', 'revise'], ['/analytics', 'analytics']]) {
    await go(page, h); await sleep(1500);
    await shot(page, `chilaka-${n}-1`, { scrollTo: 0 });
    if (n === 'mock') { await click(page, 'Next'); await shot(page, 'chilaka-mock-2'); }
    if (n === 'revise') { await click(page, 'Next'); await shot(page, 'chilaka-revise-2'); }
  }
  await go(page, '/syllabus'); await click(page, '×'); await click(page, 'Pharmacology', 'button.row-between');
  await page.evaluate(() => { const a = document.querySelector('a[href*="topic/"]'); a && a.click(); }); await sleep(3000);
  await shot(page, 'chilaka-topic-1', { scrollTo: 0 });
  for (let i = 2; i <= 4; i++) { await click(page, 'Next'); await shot(page, 'chilaka-topic-' + i); }
  await browser.close();
}

// First launch: profile form (typing a name) and the AI-content notice
async function start() {
  const { browser, page } = await open({ dpr: DPR });
  await shot(page, 'start-empty');
  await page.type('input', 'Priya', { delay: 60 });
  await shot(page, 'start-name');
  await point(page, 'start-name', 'Start studying');
  await page.click('button[type=submit]'); await sleep(1200);
  await shot(page, 'start-gate');
  await shot(page, 'start-gate-full', { full: true });
  await browser.close();
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  for (const [n, f] of [['start', start], ['main', main], ['revise', revise], ['chilaka', chilaka]]) if (!only || only === n) await f();
  fs.writeFileSync(path.join(OUT, 'meta.json'), JSON.stringify(meta, null, 1));
})().catch(e => { console.error(e); fs.writeFileSync(path.join(OUT, 'meta.json'), JSON.stringify(meta, null, 1)); process.exit(1); });
