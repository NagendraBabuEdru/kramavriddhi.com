// Scene content for the three Shorts. Times are in seconds; data-in is relative to the scene start.
// Text follows _social/SOCIAL_KIT.md section 4 and the verified facts on the matching guides.
const SAFE_TE = 'క్రమవృద్ధి స్వతంత్ర ఛానల్, ప్రభుత్వానికి చెందినది కాదు. అధికారిక పోర్టల్‌లో మాత్రమే దరఖాస్తు చేయండి. మేము ఆధార్, OTP లేదా డబ్బు ఎప్పుడూ అడగము.';
const SAFE_EN = 'Independent channel, not government. Apply only on the official portal. We never ask for Aadhaar, OTP or money.';

function endCard(extraTe, extraEn) {
  return `
  <div class="biglogo" data-in="0" data-fx="pop">{LOGO}</div>
  <div class="site" data-in="0.35">kramavriddhi.com</div>
  <div class="link" data-in="0.8" data-fx="pop" data-pulse>పూర్తి వివరాలు 👉 లింక్ డిస్క్రిప్షన్‌లో</div>
  <div class="sub en" data-in="1.1">Full guide: link in the description</div>
  <div class="share" data-in="1.7">${extraTe}<div class="sub en">${extraEn}</div></div>
  <div class="safe" data-in="2.5" data-fx="fade">⚠️ ${SAFE_TE}<div class="e en">${SAFE_EN}</div></div>`;
}
// English-primary end card: English big, Telugu small
function endCardEn(extraEn, extraTe) {
  return `
  <div class="biglogo" data-in="0" data-fx="pop">{LOGO}</div>
  <div class="site" data-in="0.35">kramavriddhi.com</div>
  <div class="link" data-in="0.8" data-fx="pop" data-pulse>Full details 👉 link in description<span class="te">పూర్తి వివరాలు 👉 లింక్ డిస్క్రిప్షన్‌లో</span></div>
  <div class="share" data-in="1.7">${extraEn}<div class="sub te">${extraTe}</div></div>
  <div class="safe" data-in="2.5" data-fx="fade">⚠️ Kramavriddhi is an independent channel, not the government. Apply only on the official portal. We never ask for Aadhaar, OTP or money.<div class="e te">${SAFE_TE}</div></div>`;
}
const point = (n, te, en, tin) =>
  `<div class="point" data-in="${tin}" data-fx="left"><div class="n">${n}</div><div><div class="t">${te}</div><div class="e en">${en}</div></div></div>`;
const chip = (ic, te, en, tin) =>
  `<div class="chip" data-in="${tin}" data-fx="left"><div class="ic">${ic}</div><div><div class="t">${te}</div><div class="e en">${en}</div></div></div>`;

const SHORTS = {
  // ---------------------------------------------------------------- Short 1: Pragati
  1: {
    file: 'short-1-pragati', duration: 34, tag: '⏰ Last date 31 Oct', tagColor: '#d97706', music: { root: 57, seed: 1 },
    scenes: [
      { start: 0, dark: true, html: `
        <div class="kicker" data-in="0" data-dur="0.4">అమ్మాయిలకు ఏడాదికి</div>
        <div class="mega gold" data-in="0.25" data-fx="count" data-count="50000" data-prefix="₹" data-pulse>₹50,000</div>
        <div class="h1" data-in="0.9">స్కాలర్‌షిప్!</div>
        <div class="sub en" data-in="1.2">₹50,000 scholarship for girls, every year</div>
        <div class="pill" data-in="1.8" data-fx="pop">⏰ చివరి తేదీ: 31 అక్టోబర్</div>` },
      { start: 4.5, html: `
        <div class="label en" data-in="0.1">What is it?</div>
        <div class="h2" data-in="0.2">AICTE ప్రగతి స్కాలర్‌షిప్</div>
        <div class="sub en" data-in="0.5">AICTE Pragati Scholarship 2026-27</div>
        <div class="para" data-in="1.1">AICTE గుర్తింపు ఉన్న డిగ్రీ / డిప్లొమా కోర్సులు చదువుతున్న అమ్మాయిలకు</div>
        <div class="chips">
          ${chip('🛠️', 'ఇంజినీరింగ్', 'Engineering', 2.2)}
          ${chip('💊', 'ఫార్మసీ', 'Pharmacy', 2.9)}
          ${chip('🏫', 'పాలిటెక్నిక్', 'Polytechnic (diploma)', 3.6)}
        </div>` },
      { start: 11, html: `
        <div class="label en" data-in="0.1">Who can apply?</div>
        <div class="h2" data-in="0.2">ఎవరు దరఖాస్తు చేయవచ్చు?</div>
        ${point(1, 'కుటుంబ ఆదాయం ₹8 లక్షల లోపు', 'Family income below ₹8 lakh a year', 1.0)}
        ${point(2, 'ఒక కుటుంబంలో ఇద్దరు అమ్మాయిల వరకు', 'Up to two girls per family', 3.4)}
        ${point(3, 'AICTE గుర్తింపు ఉన్న కాలేజీ / కోర్సు', 'AICTE-approved college and course', 5.8)}` },
      { start: 20.5, dark: true, html: `
        <div class="label en" data-in="0.1">How to apply</div>
        <div class="h2" data-in="0.2">ఎక్కడ దరఖాస్తు చేయాలి?</div>
        <div class="card white" data-in="0.9" data-fx="pop">
          <div class="portal"><div class="ic">🎓</div><div><div class="t">National Scholarship Portal</div><div class="u">scholarships.gov.in</div></div></div>
        </div>
        <div class="row">
          <div class="datecard" data-in="2.0" data-fx="pop" data-pulse>
            <div class="top">LAST DATE</div><div class="day">31</div><div class="mon">అక్టోబర్ 2026</div>
          </div>
        </div>
        <div class="sub" data-in="3.0">✔ అధికారిక పోర్టల్‌లో మాత్రమే దరఖాస్తు చేయండి<br><span class="en">Apply only on the official portal</span></div>` },
      { start: 27, cls: 'end', html: endCard('మీకు తెలిసిన అమ్మాయిలకు షేర్ చేయండి! 💛', 'Share with girls who can apply') },
    ],
  },

  // ---------------------------------------------------------------- Short 2: PM-KISAN
  2: {
    file: 'short-2-pm-kisan', duration: 34, tag: '📅 24th instalment', tagColor: '#2563eb', music: { root: 55, seed: 2 },
    scenes: [
      { start: 0, dark: true, html: `
        <div class="h1" data-in="0" data-dur="0.4">పీఎం కిసాన్ 24వ విడత ఎప్పుడు?</div>
        <div class="row">
          <div class="datecard" data-in="0.6" data-fx="pop" data-pulse>
            <div class="top">PM-KISAN</div><div class="day">20</div><div class="mon">అక్టోబర్?</div>
          </div>
          <div class="mega gold" data-in="1.1" data-fx="pop" data-pulse style="font-size:260px">?</div>
        </div>
        <div class="kicker mt" data-in="1.5">ఇది నిజమేనా? 🤔</div>
        <div class="sub en" data-in="1.8">PM-KISAN 24th instalment: is "20 October" true?</div>` },
      { start: 4.5, html: `
        <div class="label en" data-in="0.1">Fact check</div>
        <div class="row">
          <div class="datecard" data-in="0.2" data-fx="pop">
            <div class="top">20 OCT</div><div class="day strike" data-in="0.9" data-fx="strike">20</div><div class="mon">అక్టోబర్</div>
            <div class="stamp" data-in="1.5" data-fx="stamp" data-dur="0.5">నిర్ధారణ కాలేదు<div class="en">NOT CONFIRMED</div></div>
          </div>
        </div>
        <div class="h2 mt" data-in="2.4">అధికారిక తేదీ ఇంకా ప్రకటించలేదు</div>
        <div class="sub en" data-in="2.7">The official date has not been announced yet</div>
        <div class="para" data-in="3.6">సోషల్ మీడియాలో వచ్చే తేదీలు నిర్ధారణ కాలేదు. అధికారిక ప్రకటన కోసం వేచి చూడండి.</div>` },
      { start: 11, dark: true, html: `
        <div class="label en" data-in="0.1">How much &amp; when</div>
        <div class="card teal-bg" data-in="0.2" data-fx="pop" style="background:rgba(255,255,255,.12)">
          <div class="kicker" style="font-size:52px">ఒక్కో విడత</div>
          <div class="mega gold" data-in="0.5" data-fx="count" data-count="2000" data-prefix="₹">₹2,000</div>
        </div>
        <div class="h2 mt" data-in="1.8">అక్టోబర్–నవంబర్ 2026లో రావచ్చు</div>
        <div class="sub en" data-in="2.1">Expected October–November 2026, going by past instalments</div>` },
      { start: 17, html: `
        <div class="label en" data-in="0.1">Do this now</div>
        <div class="h2" data-in="0.2">డబ్బు ఆగిపోకుండా ఇవి పూర్తి చేయండి</div>
        ${point('✓', 'ఈకేవైసీ (eKYC) పూర్తి చేయండి', 'Complete eKYC', 1.0)}
        ${point('✓', 'ఆధార్–బ్యాంకు ఖాతా లింక్', 'Link Aadhaar with your bank account', 2.8)}
        ${point('✓', 'ల్యాండ్ సీడింగ్ (భూమి వివరాలు)', 'Land seeding of your land records', 4.6)}
        <div class="warn" data-in="6.6" data-fx="pop">⚠️ ఎవరైనా ఫోన్ చేసి OTP అడిగితే చెప్పకండి<div class="e en">Never share your OTP with callers</div></div>` },
      { start: 27, cls: 'end', html: endCard('మీ స్టేటస్ ఎలా చెక్ చేయాలో మా గైడ్‌లో ఉంది', 'How to check your status: see our guide') },
    ],
  },

  // ---------------------------------------------------------------- Short 3: Eligibility checker
  3: {
    file: 'short-3-checker', duration: 36, tag: '✅ Free tool', tagColor: '#7c3aed', music: { root: 60, seed: 3 },
    scenes: [
      { start: 0, dark: true, html: `
        <div class="h1" data-in="0" data-dur="0.4">మీకు ఏ ప్రభుత్వ పథకాలు వస్తాయి?</div>
        <div class="row">
          <div class="ring" data-in="0.5" data-fx="pop">
            <svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255,255,255,.18)" stroke-width="8"/>
            <circle cx="50" cy="50" r="44" fill="none" stroke="#f5b83d" stroke-width="8" stroke-linecap="round"
              stroke-dasharray="276.5" stroke-dashoffset="276.5" data-in="0.7" data-fx="ring" data-len="276.5" data-dur="2.4"/></svg>
            <div class="num">1</div>
          </div>
          <div><div class="kicker" data-in="0.9">నిమిషం</div><div class="kicker gold" data-in="1.2">చాలు!</div></div>
        </div>
        <div class="sub en mt" data-in="1.6">Find the schemes you can get in about 1 minute</div>` },
      { start: 4.5, onFrame: phoneFrame, html: `
        <div class="cap-wrap">
          <div data-in="0.1" data-out="5.3"><div class="step-n en">STEP 1</div><div class="h2" style="font-size:54px">kramavriddhi.com లో 'నాకు ఏ పథకాలు వర్తిస్తాయి?' ఓపెన్ చేయండి</div><div class="sub en">Open the free eligibility checker</div></div>
          <div data-in="5.7" data-out="11.3"><div class="step-n en">STEP 2</div><div class="h2" style="font-size:54px">మీ రాష్ట్రం, వయసు, రేషన్ కార్డు ఉందా వంటివి ఎంచుకోండి</div><div class="sub en">Pick your state, age, ration card and more</div></div>
          <div data-in="11.7"><div class="step-n en">STEP 3</div><div class="h2" style="font-size:54px">'నా పథకాలు చూపించు' నొక్కండి</div><div class="sub en">See matching schemes and why they fit</div></div>
        </div>
        <div class="phone" data-in="0.3" data-fx="up"><div class="screen">
          <div class="bar"><span class="logo">{LOGO}</span>Kramavriddhi</div>
          <div class="scroll" data-in="11.6" data-fx="move" data-y0="0" data-y1="-560" data-dur="1.2">
            <h3>నాకు ఏ పథకాలు వర్తిస్తాయి?</h3>
            <div class="field"><div class="l">మీరు ఎక్కడ నివసిస్తున్నారు?</div><div class="v"><span class="ph" id="ph1">ఎంచుకోండి</span><span class="val" id="v1">ఆంధ్రప్రదేశ్</span></div></div>
            <div class="field"><div class="l">మీ వయసు</div><div class="v"><span class="ph" id="ph2">—</span><span class="val" id="v2">42</span></div></div>
            <div class="field"><div class="l">మీరు</div><div class="v"><span class="ph" id="ph3">ఎంచుకోండి</span><span class="val" id="v3">మహిళ / బాలిక</span></div></div>
            <div class="tick"><div class="box"><i id="c1"></i></div>మా కుటుంబానికి రేషన్ కార్డు ఉంది</div>
            <div class="tick"><div class="box"><i id="c2"></i></div>మా కుటుంబానికి వ్యవసాయ భూమి ఉంది</div>
            <div class="btn" id="go">నా పథకాలు చూపించు</div>
            <div class="res" data-in="13.4" data-fx="right"><div class="t">✅ పీఎం కిసాన్</div><div class="w">ఎందుకు: వ్యవసాయ భూమి ఉంది</div></div>
            <div class="res" data-in="14.0" data-fx="right"><div class="t">✅ అన్నదాత సుఖీభవ</div><div class="w">ఎందుకు: ఏపీ రైతు కుటుంబం</div></div>
            <div class="res" data-in="14.6" data-fx="right"><div class="t">✅ దీపం-2</div><div class="w">ఎందుకు: బియ్యం కార్డు ఉంది</div></div>
          </div>
          <div class="tap" data-in="6.6" data-fx="tap" data-dur="0.7" style="left:300px;top:300px"></div>
          <div class="tap" data-in="7.6" data-fx="tap" data-dur="0.7" style="left:300px;top:425px"></div>
          <div class="tap" data-in="8.6" data-fx="tap" data-dur="0.7" style="left:300px;top:555px"></div>
          <div class="tap" data-in="9.6" data-fx="tap" data-dur="0.7" style="left:50px;top:600px"></div>
          <div class="tap" data-in="10.4" data-fx="tap" data-dur="0.7" style="left:50px;top:666px"></div>
          <div class="tap" data-in="12.4" data-fx="tap" data-dur="0.7" style="left:280px;top:268px"></div>
        </div></div>
        <div class="sub" data-in="15.2" style="font-size:34px;text-align:center">ఉదాహరణ మాత్రమే · Example only</div>` },
      { start: 22, dark: true, html: `
        <div class="label en" data-in="0.1">Why use it</div>
        <div class="chips">
          ${chip('💯', 'పూర్తిగా ఉచితం', 'Completely free', 0.4)}
          ${chip('🗣️', 'తెలుగు & ఇంగ్లీష్‌లో', 'In Telugu and English', 1.4)}
          ${chip('🏛️', 'కేంద్ర + ఏపీ + తెలంగాణ పథకాలు', 'Central, AP and Telangana schemes', 2.4)}
          ${chip('🔒', 'మీ సమాధానాలు మీ ఫోన్‌లోనే ఉంటాయి', 'Your answers stay on your device', 3.4)}
        </div>
        <div class="sub" data-in="4.6" style="font-size:36px">ఇది ప్రాథమిక అంచనా మాత్రమే · It gives a first estimate only</div>` },
      { start: 29, cls: 'end', html: endCard('ఇప్పుడే ట్రై చేయండి! 👆', 'Try it now: kramavriddhi.com/te/tools/') },
    ],
  },

  // ---------------------------------------------------------------- Short 4: Central Sector Scholarship (CSSS)
  4: {
    file: 'short-4-csss', duration: 35, tag: '⏰ Last date 31 Oct', tagColor: '#d97706', music: { root: 58, seed: 1 },
    scenes: [
      { start: 0, dark: true, html: `
        <div class="kicker" data-in="0" data-dur="0.4">కాలేజీ విద్యార్థులకు ఏడాదికి</div>
        <div class="mega gold" data-in="0.25" data-fx="pop" data-pulse style="font-size:150px;line-height:1.15">₹12,000–<br>₹20,000</div>
        <div class="h1" data-in="0.9">స్కాలర్‌షిప్!</div>
        <div class="sub en" data-in="1.2">Scholarship for college students, every year</div>
        <div class="pill" data-in="1.8" data-fx="pop">⏰ చివరి తేదీ: 31 అక్టోబర్</div>` },
      { start: 4.5, html: `
        <div class="label en" data-in="0.1">What is it?</div>
        <div class="h2" data-in="0.2">సెంట్రల్ సెక్టార్ స్కాలర్‌షిప్</div>
        <div class="sub en" data-in="0.5">Central Sector Scholarship (CSSS) · PM-USP, Ministry of Education</div>
        <div class="chips">
          ${chip('🎓', 'డిగ్రీ 1–3 సంవత్సరాలు: ₹12,000 / ఏడాది', 'Degree years 1–3: ₹12,000 a year', 1.4)}
          ${chip('📚', 'పీజీ, B.Tech 4వ సంవత్సరం: ₹20,000 / ఏడాది', 'PG and 4th/5th year of technical courses: ₹20,000', 2.3)}
          ${chip('🏦', 'నేరుగా మీ బ్యాంకు ఖాతాలోకి (DBT)', 'Paid by DBT to your bank account', 3.2)}
        </div>` },
      { start: 10, html: `
        <div class="label en" data-in="0.1">Who can apply?</div>
        <div class="h2" data-in="0.2">ఎవరు దరఖాస్తు చేయవచ్చు?</div>
        ${point(1, '12వ తరగతిలో టాప్ 20%', 'Above the 80th percentile in your stream, Class 12 board', 0.9)}
        ${point(2, 'కుటుంబ ఆదాయం ₹4.5 లక్షల లోపు', 'Family income up to ₹4.5 lakh a year', 2.6)}
        ${point(3, 'రెగ్యులర్ డిగ్రీ కోర్సు', 'Regular degree course, not diploma or distance', 4.3)}
        ${point(4, 'వేరే స్కాలర్‌షిప్ రాకూడదు', 'Not getting another scholarship or fee reimbursement', 5.8)}` },
      { start: 17.5, dark: true, html: `
        <div class="label en" data-in="0.1">For boys and girls</div>
        <div class="split">
          <div class="half" data-in="0.3" data-fx="pop"><div class="ic">👦</div><div class="pc">50%</div><div class="t">అబ్బాయిలకు</div><div class="e en">Boys</div></div>
          <div class="half" data-in="0.7" data-fx="pop"><div class="ic">👧</div><div class="pc">50%</div><div class="t">అమ్మాయిలకు</div><div class="e en">Girls</div></div>
        </div>
        <div class="para" data-in="1.8">ప్రతి సంవత్సరం కొనసాగాలంటే: 50% మార్కులు + 75% హాజరు</div>
        <div class="sub en" data-in="2.1">To renew each year: at least 50% marks and 75% attendance</div>` },
      { start: 22.5, html: `
        <div class="label en" data-in="0.1">How to apply</div>
        <div class="h2" data-in="0.2">ఎక్కడ దరఖాస్తు చేయాలి?</div>
        <div class="card white" data-in="0.8" data-fx="pop">
          <div class="portal"><div class="ic">🎓</div><div><div class="t">National Scholarship Portal</div><div class="u">scholarships.gov.in</div></div></div>
        </div>
        <div class="row">
          <div class="datecard" data-in="1.7" data-fx="pop" data-pulse>
            <div class="top">LAST DATE</div><div class="day">31</div><div class="mon">అక్టోబర్ 2026</div>
          </div>
        </div>
        <div class="sub" data-in="2.6">✔ తర్వాత మీ కాలేజీ వెరిఫై చేస్తుంది · అధికారిక పోర్టల్‌లో మాత్రమే దరఖాస్తు చేయండి<br><span class="en">Then your college verifies it. Apply only on the official portal</span></div>` },
      { start: 28, cls: 'end', html: endCard('కాలేజీ ఫ్రెండ్స్‌కి షేర్ చేయండి! 🎓', 'Share with your college friends') },
    ],
  },

  // ---------------------------------------------------------------- Short 5: Thalliki Vandanam phase 2 (AP)
  5: {
    file: 'short-5-thalliki-phase2', duration: 34, tag: '📅 Phase 2 · AP', tagColor: '#2563eb', music: { root: 57, seed: 2 },
    scenes: [
      { start: 0, dark: true, html: `
        <div class="kicker" data-in="0" data-dur="0.4">తల్లికి వందనం రెండో విడత</div>
        <div class="mega gold" data-in="0.25" data-fx="count" data-count="13000" data-prefix="₹" data-pulse>₹13,000</div>
        <div class="h1" data-in="0.9">తల్లి ఖాతాలోకి!</div>
        <div class="sub en" data-in="1.2">Thalliki Vandanam phase 2: ₹13,000 to the mother</div>
        <div class="pill" data-in="1.8" data-fx="pop">📅 ఇంకా జమ కాలేదు</div>` },
      { start: 4.5, html: `
        <div class="label en" data-in="0.1">Who gets it now?</div>
        <div class="h2" data-in="0.2">ఈ విడతలో ఎవరికి?</div>
        <div class="mega teal" data-in="0.6" data-fx="count" data-count="329201" style="font-size:150px">3,29,201</div>
        <div class="para" data-in="1.2" style="margin-top:0">మంది విద్యార్థులకు <span class="en" style="color:var(--muted);font-size:40px">students</span></div>
        <div class="chips">
          ${chip('🎒', 'కొత్తగా 1వ తరగతిలో చేరిన పిల్లలు', 'New Class 1 admissions', 2.0)}
          ${chip('📘', 'ఇంటర్ మొదటి సంవత్సరం విద్యార్థులు', 'Inter first-year students', 2.8)}
          ${chip('🔁', '22 జూలై చెల్లింపులో రాని పిల్లలు', 'Children left out of the 22 July payment', 3.6)}
        </div>` },
      { start: 11, dark: true, cls: 'compact', html: `
        <div class="label en" data-in="0.1">When?</div>
        <div class="h2" data-in="0.2">ఎప్పుడు వస్తుంది?</div>
        <div class="chips">
          ${chip('📜', 'ఉత్తర్వు G.O.Ms.No.26 జారీ', 'Government order issued 10 October 2026', 0.8)}
          ${chip('🏛️', 'క్యాబినెట్ ఆమోదం', 'Revised sanction: 68.06 lakh students, ₹10,208.69 crore', 1.8)}
          ${chip('📅', 'దసరాకు రాలేదు, తేదీ ఇంకా లేదు', 'Not paid at Dasara; no date yet (24 Oct)', 2.8)}
        </div>
        <div class="warn" data-in="4.0" data-fx="pop">కచ్చితమైన తేదీ ఇంకా ప్రకటించలేదు<div class="e en">No exact date has been announced yet</div></div>` },
      { start: 18, cls: 'compact', html: `
        <div class="label en" data-in="0.1">Check this now</div>
        <div class="h2" data-in="0.2">డబ్బు ఆగకుండా ఇవి చూసుకోండి</div>
        ${point('✓', 'తల్లి ఖాతా ఆధార్ / NPCI లింక్', "Mother's bank account linked to Aadhaar (NPCI)", 1.0)}
        ${point('✓', 'eKYC పూర్తి చేయండి', 'Complete eKYC', 2.7)}
        ${point('✓', 'పేరు లేదా? సచివాలయంలో అడగండి', 'Name missing? Ask at your village / ward secretariat', 4.4)}
        <div class="warn" data-in="6.2" data-fx="pop">⚠️ OTP ఎవరికీ చెప్పకండి<div class="e en">Never share your OTP with callers</div></div>` },
      { start: 27, cls: 'end', html: endCard('ఎదురుచూస్తున్న తల్లులకు షేర్ చేయండి! 💐', 'Share with mothers who are waiting') },
    ],
  },

  // ---------------------------------------------------------------- Short 6: farmer checklist before the next instalment (no dates or amounts)
  6: {
    file: 'short-6-farmer-ekyc', duration: 34, tag: '🌾 Farmers', tagColor: '#15803d', music: { root: 55, seed: 3 },
    scenes: [
      { start: 0, dark: true, html: `
        <div class="kicker" data-in="0" data-dur="0.4" style="font-size:62px">పీఎం కిసాన్ · అన్నదాత సుఖీభవ</div>
        <div class="h1" data-in="0.3">తదుపరి విడతకు ముందు</div>
        <div class="row">
          <div class="mega gold" data-in="0.7" data-fx="pop" data-pulse style="font-size:300px">3</div>
          <div class="kicker" data-in="1.0">విషయాలు<br>చెక్ చేయండి!</div>
        </div>
        <div class="sub en" data-in="1.4">Before the next PM-KISAN / Annadata Sukhibhava instalment: check these 3 things</div>
        <div class="pill" data-in="2.0" data-fx="pop">📅 అధికారిక తేదీ ఇంకా లేదు</div>` },
      { start: 4.5, cls: 'compact', html: `
        <div class="label en" data-in="0.1">The 3 checks</div>
        <div class="h2" data-in="0.2">డబ్బు ఆగకుండా ఇవి పూర్తి చేయండి</div>
        ${point(1, 'ఈకేవైసీ (eKYC) పూర్తి', 'eKYC completed', 1.0)}
        ${point(2, 'ఆధార్–బ్యాంకు (DBT) లింక్', 'Bank account linked to Aadhaar and enabled for DBT', 2.8)}
        ${point(3, 'ల్యాండ్ సీడింగ్', 'Land records verified and linked by the state', 4.6)}
        <div class="warn" data-in="6.6" data-fx="pop">ఏదైనా పెండింగ్ ఉంటే రైతు సేవా కేంద్రం (RSK) లో అడగండి<div class="e en">Anything pending? Visit your Rythu Seva Kendram</div></div>` },
      { start: 14.5, dark: true, cls: 'compact', html: `
        <div class="label en" data-in="0.1">Check your status · PM-KISAN</div>
        <div class="card white" data-in="0.3" data-fx="pop">
          <div class="portal"><div class="ic">🌾</div><div><div class="t">PM-KISAN</div><div class="u">pmkisan.gov.in</div></div></div>
        </div>
        ${point(1, 'pmkisan.gov.in ఓపెన్ చేయండి', 'Open the official site', 1.0)}
        ${point(2, "'Know Your Status' నొక్కండి", 'Tap Know Your Status', 2.2)}
        ${point(3, 'రిజిస్ట్రేషన్ నంబర్ + captcha ఇవ్వండి', 'Enter your registration number and the captcha', 3.4)}` },
      { start: 21, cls: 'compact', html: `
        <div class="label en" data-in="0.1">Check your status · Annadata Sukhibhava (AP)</div>
        <div class="card white" data-in="0.3" data-fx="pop">
          <div class="portal"><div class="ic">🌱</div><div><div class="t">Annadata Sukhibhava</div><div class="u" style="font-size:38px">annadathasukhibhava.ap.gov.in</div></div></div>
        </div>
        ${point(1, "'Know Your Status' ఎంచుకోండి", 'Choose Know Your Status', 1.0)}
        ${point(2, 'మీ ఆధార్ నంబర్ ఇవ్వండి', 'Enter your Aadhaar number, only on the official site', 2.2)}
        <div class="warn" data-in="3.6" data-fx="pop">📅 త్వరలో రావచ్చు, అధికారిక తేదీ ఇంకా ప్రకటించలేదు<div class="e en">Expected soon. No official date yet</div></div>` },
      { start: 27, cls: 'end', html: endCard('రైతు మిత్రులకు షేర్ చేయండి! 🌾', 'Share with farmer friends') },
    ],
  },

  // ================= English-primary Shorts (lang: 'en'): English big, Telugu small, for an all-India audience
  // ---------------------------------------------------------------- Short 7: Pragati Scholarship (English)
  7: {
    file: 'short-7-pragati-en', lang: 'en', duration: 34, tag: '⏰ Last date 31 Oct', tagColor: '#d97706', music: { root: 60, seed: 1 },
    scenes: [
      { start: 0, dark: true, html: `
        <div class="kicker" data-in="0" data-dur="0.4">Girls can get</div>
        <div class="mega gold" data-in="0.25" data-fx="count" data-count="50000" data-prefix="₹" data-pulse>₹50,000</div>
        <div class="h1" data-in="0.9">every year!</div>
        <div class="sub te" data-in="1.2">అమ్మాయిలకు ఏడాదికి ₹50,000 స్కాలర్‌షిప్</div>
        <div class="pill" data-in="1.8" data-fx="pop">⏰ Last date: 31 October</div>` },
      { start: 4.5, html: `
        <div class="label" data-in="0.1">What is it?</div>
        <div class="h2" data-in="0.2">AICTE Pragati Scholarship 2026-27</div>
        <div class="sub te" data-in="0.5">AICTE ప్రగతి స్కాలర్‌షిప్</div>
        <div class="para" data-in="1.1">For girls studying an AICTE-approved degree or diploma course</div>
        <div class="chips">
          ${chip('🛠️', 'Engineering', 'ఇంజినీరింగ్', 2.2)}
          ${chip('💊', 'Pharmacy', 'ఫార్మసీ', 2.9)}
          ${chip('🏫', 'Polytechnic (diploma)', 'పాలిటెక్నిక్', 3.6)}
        </div>` },
      { start: 11, html: `
        <div class="label" data-in="0.1">Who can apply?</div>
        <div class="h2" data-in="0.2">Check if you qualify</div>
        ${point(1, 'Family income below ₹8 lakh a year', 'కుటుంబ ఆదాయం ₹8 లక్షల లోపు', 1.0)}
        ${point(2, 'Up to two girls per family', 'ఒక కుటుంబంలో ఇద్దరు అమ్మాయిల వరకు', 3.4)}
        ${point(3, 'AICTE-approved college and course', 'AICTE గుర్తింపు ఉన్న కాలేజీ / కోర్సు', 5.8)}` },
      { start: 20.5, dark: true, html: `
        <div class="label" data-in="0.1">How to apply</div>
        <div class="h2" data-in="0.2">Apply online, free</div>
        <div class="card white" data-in="0.9" data-fx="pop">
          <div class="portal"><div class="ic">🎓</div><div><div class="t">National Scholarship Portal</div><div class="u">scholarships.gov.in</div></div></div>
        </div>
        <div class="row">
          <div class="datecard" data-in="2.0" data-fx="pop" data-pulse>
            <div class="top">LAST DATE</div><div class="day">31</div><div class="mon">October 2026</div>
          </div>
        </div>
        <div class="sub" data-in="3.0">✔ Apply only on the official portal<br><span class="te">అధికారిక పోర్టల్‌లో మాత్రమే దరఖాస్తు చేయండి</span></div>` },
      { start: 27, cls: 'end', html: endCardEn('Share with girls who can apply! 💛', 'మీకు తెలిసిన అమ్మాయిలకు షేర్ చేయండి') },
    ],
  },

  // ---------------------------------------------------------------- Short 8: Central Sector Scholarship (English)
  8: {
    file: 'short-8-csss-en', lang: 'en', duration: 35, tag: '⏰ Last date 31 Oct', tagColor: '#d97706', music: { root: 58, seed: 2 },
    scenes: [
      { start: 0, dark: true, html: `
        <div class="kicker" data-in="0" data-dur="0.4">College students can get</div>
        <div class="mega gold" data-in="0.25" data-fx="pop" data-pulse style="font-size:150px;line-height:1.15">₹12,000–<br>₹20,000</div>
        <div class="h1" data-in="0.9">a year!</div>
        <div class="sub te" data-in="1.2">కాలేజీ విద్యార్థులకు ఏడాదికి ₹12,000–₹20,000 స్కాలర్‌షిప్</div>
        <div class="pill" data-in="1.8" data-fx="pop">⏰ Last date: 31 October</div>` },
      { start: 4.5, html: `
        <div class="label" data-in="0.1">What is it?</div>
        <div class="h2" data-in="0.2">Central Sector Scholarship (CSSS)</div>
        <div class="sub" data-in="0.5">PM-USP · Ministry of Education<br><span class="te">సెంట్రల్ సెక్టార్ స్కాలర్‌షిప్</span></div>
        <div class="chips">
          ${chip('🎓', 'Degree years 1–3: ₹12,000 a year', 'డిగ్రీ 1–3 సంవత్సరాలు', 1.4)}
          ${chip('📚', 'PG, and 4th/5th year of technical courses: ₹20,000 a year', 'పీజీ, B.Tech 4వ సంవత్సరం', 2.3)}
          ${chip('🏦', 'Paid by DBT to your bank account', 'నేరుగా బ్యాంకు ఖాతాలోకి', 3.2)}
        </div>` },
      { start: 10, cls: 'compact', html: `
        <div class="label" data-in="0.1">Who can apply?</div>
        <div class="h2" data-in="0.2">Check if you qualify</div>
        ${point(1, 'Top 20% in your Class 12 board', 'Above the 80th percentile in your stream · 12వ తరగతిలో టాప్ 20%', 0.9)}
        ${point(2, 'Family income up to ₹4.5 lakh', 'కుటుంబ ఆదాయం ₹4.5 లక్షల లోపు', 2.6)}
        ${point(3, 'Regular degree course', 'Not diploma or distance · రెగ్యులర్ డిగ్రీ కోర్సు', 4.3)}
        ${point(4, 'No other scholarship', 'Or fee reimbursement · వేరే స్కాలర్‌షిప్ రాకూడదు', 5.8)}` },
      { start: 17.5, dark: true, html: `
        <div class="label" data-in="0.1">For boys and girls</div>
        <div class="split">
          <div class="half" data-in="0.3" data-fx="pop"><div class="ic">👦</div><div class="pc">50%</div><div class="t">Boys</div><div class="e te">అబ్బాయిలకు</div></div>
          <div class="half" data-in="0.7" data-fx="pop"><div class="ic">👧</div><div class="pc">50%</div><div class="t">Girls</div><div class="e te">అమ్మాయిలకు</div></div>
        </div>
        <div class="para" data-in="1.8">To renew each year: 50% marks + 75% attendance</div>
        <div class="sub te" data-in="2.1">ప్రతి సంవత్సరం కొనసాగాలంటే: 50% మార్కులు + 75% హాజరు</div>` },
      { start: 22.5, html: `
        <div class="label" data-in="0.1">How to apply</div>
        <div class="h2" data-in="0.2">Apply online, free</div>
        <div class="card white" data-in="0.8" data-fx="pop">
          <div class="portal"><div class="ic">🎓</div><div><div class="t">National Scholarship Portal</div><div class="u">scholarships.gov.in</div></div></div>
        </div>
        <div class="row">
          <div class="datecard" data-in="1.7" data-fx="pop" data-pulse>
            <div class="top">LAST DATE</div><div class="day">31</div><div class="mon">October 2026</div>
          </div>
        </div>
        <div class="sub" data-in="2.6">✔ Then your college verifies it. Apply only on the official portal.<br><span class="te">తర్వాత మీ కాలేజీ వెరిఫై చేస్తుంది</span></div>` },
      { start: 28, cls: 'end', html: endCardEn('Share with your college friends! 🎓', 'కాలేజీ ఫ్రెండ్స్‌కి షేర్ చేయండి') },
    ],
  },

  // ---------------------------------------------------------------- Short 9: Sukanya Samriddhi Yojana (English)
  9: {
    file: 'short-9-sukanya-en', lang: 'en', duration: 35, tag: '📈 8.2% · Oct–Dec 2026', tagColor: '#7c3aed', music: { root: 62, seed: 3 },
    scenes: [
      { start: 0, dark: true, html: `
        <div class="kicker" data-in="0" data-dur="0.4">Saving for your daughter?</div>
        <div class="mega gold" data-in="0.3" data-fx="pop" data-pulse>8.2%</div>
        <div class="h1" data-in="0.9">interest, tax-free</div>
        <div class="sub te" data-in="1.2">సుకన్య సమృద్ధి: కూతురి కోసం 8.2% వడ్డీ, పన్ను లేదు</div>
        <div class="pill" data-in="1.8" data-fx="pop" style="background:#7c3aed">📈 Rate for Oct–Dec 2026</div>` },
      { start: 4.5, cls: 'compact', html: `
        <div class="label" data-in="0.1">The rules</div>
        <div class="h2" data-in="0.2">Sukanya Samriddhi Yojana</div>
        <div class="chips">
          ${chip('👧', 'Girl below 10 years', '10 ఏళ్ల లోపు అమ్మాయి', 1.0)}
          ${chip('💰', 'Deposit ₹250 – ₹1.5 lakh a year', 'ఏడాదికి ₹250 – ₹1.5 లక్షలు', 1.9)}
          ${chip('📅', 'Deposit for 15 years, matures in 21', '15 ఏళ్లు జమ · 21 ఏళ్లకు మెచ్యూరిటీ', 2.8)}
          ${chip('🏤', 'Open at a post office or bank', 'పోస్టాఫీసు లేదా బ్యాంకులో', 3.7)}
        </div>` },
      { start: 11.5, dark: true, html: `
        <div class="label" data-in="0.1">Example</div>
        <div class="h2" data-in="0.2">Save ₹1,000 a month</div>
        <div class="sub te" data-in="0.5">నెలకు ₹1,000 జమ చేస్తే</div>
        <div class="card teal-bg" data-in="1.0" data-fx="pop" style="background:rgba(255,255,255,.12)">
          <div class="kicker" style="font-size:46px">You deposit ₹1.8 lakh. At 21 years, about</div>
          <div class="mega gold" data-in="1.4" data-fx="pop" style="font-size:140px;white-space:nowrap">₹5.7 lakh</div>
          <div class="cap te">సుమారు ₹5.7 లక్షలు</div>
        </div>
        <div class="sub" data-in="2.6">Illustration only, if the rate stays at 8.2%. Rates change every quarter.</div>` },
      { start: 18.5, cls: 'compact', html: `
        <div class="label" data-in="0.1">Good to know</div>
        <div class="h2" data-in="0.2">Before you open one</div>
        ${point('✓', 'Withdraw up to 50% for education', 'After she turns 18 or passes Class 10 · చదువుకు 50% వరకు', 1.0)}
        ${point('✓', 'Interest and maturity are tax-free', 'Deposit deduction only in the old tax regime · వడ్డీపై పన్ను లేదు', 2.8)}
        ${point('✓', 'Missed a year? Revive it', 'Pay ₹250 + ₹50 penalty per missed year · ₹50 జరిమానాతో మళ్ళీ', 4.6)}` },
      { start: 28, cls: 'end', html: endCardEn('Try our free Sukanya calculator! 🧮', 'కూతుళ్ళ తల్లిదండ్రులకు షేర్ చేయండి') },
    ],
  },

  // ---------------------------------------------------------------- Short 10: PM Fasal Bima, AP Rabi 2026-27 (English)
  10: {
    file: 'short-10-fasal-bima-en', lang: 'en', duration: 35, tag: '⏰ AP: enrol by 15 Dec', tagColor: '#d97706', music: { root: 55, seed: 1 },
    scenes: [
      { start: 0, dark: true, html: `
        <div class="kicker" data-in="0" data-dur="0.4">Andhra Pradesh farmers:</div>
        <div class="h1" data-in="0.25">Insure your Rabi crop for just</div>
        <div class="mega gold" data-in="0.6" data-fx="pop" data-pulse>1.5%</div>
        <div class="sub" data-in="1.1">maximum premium for Rabi food and oilseed crops<br><span class="te">ఏపీ రైతులు: రబీ పంట బీమా, ప్రీమియం గరిష్ఠంగా 1.5%</span></div>
        <div class="pill" data-in="1.8" data-fx="pop">⏰ Enrol by 15 December</div>` },
      { start: 4.5, html: `
        <div class="label" data-in="0.1">PM Fasal Bima Yojana · AP Rabi 2026-27</div>
        <div class="h2" data-in="0.2">Last dates to enrol</div>
        <div class="row" style="gap:30px">
          <div class="datecard" data-in="0.8" data-fx="pop" style="min-width:380px"><div class="top">RABI CROPS</div><div class="day">15</div><div class="mon">December</div></div>
          <div class="datecard" data-in="1.3" data-fx="pop" style="min-width:380px"><div class="top">PADDY</div><div class="day">31</div><div class="mon">December</div></div>
        </div>
        <div class="para" data-in="2.2">Miss the date and your crop is not covered for the whole season.</div>
        <div class="sub te" data-in="2.5">చివరి తేదీ దాటితే ఈ సీజన్ మొత్తం బీమా ఉండదు</div>
        <div class="sub" data-in="3.4" style="font-size:36px">Telangana: no notification with dates yet</div>` },
      { start: 11, dark: true, html: `
        <div class="label" data-in="0.1">What does it cost?</div>
        <div class="h2" data-in="0.2">Sum insured ₹50,000 a hectare?</div>
        <div class="card teal-bg" data-in="0.8" data-fx="pop" style="background:rgba(255,255,255,.12)">
          <div class="kicker" style="font-size:46px">You pay at most</div>
          <div class="mega gold" data-in="1.1" data-fx="count" data-count="750" data-prefix="₹">₹750</div>
          <div class="cap">per hectare for Rabi<br><span class="te" style="font-size:36px">హెక్టారుకు గరిష్ఠంగా ₹750</span></div>
        </div>
        <div class="sub" data-in="2.4">The Central and State governments pay the rest.</div>` },
      { start: 18.5, cls: 'compact', html: `
        <div class="label" data-in="0.1">How to enrol</div>
        <div class="h2" data-in="0.2">Enrol early</div>
        ${point(1, 'Bank, CSC or Rythu Seva Kendram', 'Or pmfby.gov.in / Crop Insurance app · బ్యాంకు, CSC లేదా RSK', 1.0)}
        ${point(2, 'Agristack farmer ID needed in AP', 'అగ్రిస్టాక్ రైతు ఐడీ తప్పనిసరి', 2.6)}
        ${point(3, 'Land record, Aadhaar, bank passbook', 'And the crop you have sown · భూమి పత్రం, ఆధార్, బ్యాంకు పాస్‌బుక్', 4.2)}
        <div class="warn" data-in="6.0" data-fx="pop">🌧️ Crop damaged? Report within 72 hours on 14447<div class="e te">పంట నష్టం జరిగితే 72 గంటల్లో 14447 కి చెప్పండి</div></div>` },
      { start: 28, cls: 'end', html: endCardEn('Share with farmer friends! 🌾', 'రైతు మిత్రులకు షేర్ చేయండి') },
    ],
  },

  // ---------------------------------------------------------------- Short 11: PM Surya Ghar rooftop solar (English)
  11: {
    file: 'short-11-surya-ghar-en', lang: 'en', duration: 35, tag: '☀️ Open till March 2027', tagColor: '#ca8a04', music: { root: 62, seed: 2 },
    scenes: [
      { start: 0, dark: true, html: `
        <div class="kicker" data-in="0" data-dur="0.4">Rooftop solar subsidy, up to</div>
        <div class="mega gold" data-in="0.25" data-fx="count" data-count="78000" data-prefix="₹" data-pulse>₹78,000</div>
        <div class="h1" data-in="0.9">for your home!</div>
        <div class="sub te" data-in="1.2">ఇంటి పైకప్పుపై సోలార్‌కి ₹78,000 వరకు సబ్సిడీ</div>
        <div class="pill" data-in="1.8" data-fx="pop" style="background:#ca8a04">☀️ Up to 300 units a month</div>` },
      { start: 4.5, html: `
        <div class="label" data-in="0.1">PM Surya Ghar Muft Bijli Yojana</div>
        <div class="h2" data-in="0.2">How much subsidy?</div>
        <div class="chips">
          ${chip('☀️', '1 kW → ₹30,000', '1 కిలోవాట్', 1.0)}
          ${chip('☀️', '2 kW → ₹60,000', '2 కిలోవాట్లు', 1.8)}
          ${chip('🌞', '3 kW or more → ₹78,000 (max)', '3 కిలోవాట్లు లేదా ఎక్కువ', 2.6)}
        </div>
        <div class="sub" data-in="3.6">1–2 kW suits up to 150 units a month; 2–3 kW suits 150–300 units.</div>` },
      { start: 11, dark: true, cls: 'compact', html: `
        <div class="label" data-in="0.1">Who can apply?</div>
        <div class="h2" data-in="0.2">You need</div>
        ${point('✓', 'Your own house with a suitable roof', 'సొంత ఇల్లు, సోలార్‌కి సరిపోయే పైకప్పు', 1.0)}
        ${point('✓', 'Electricity connection in your name', 'మీ పేరుతో కరెంట్ కనెక్షన్', 2.6)}
        ${point('✓', 'No other solar subsidy taken', 'ఇంతకు ముందు సోలార్ సబ్సిడీ తీసుకోకూడదు', 4.2)}` },
      { start: 18.5, cls: 'compact', html: `
        <div class="label" data-in="0.1">How to apply</div>
        <div class="h2" data-in="0.2">Apply online, free</div>
        ${point(1, 'Register on pmsuryaghar.gov.in', 'With your electricity consumer number · కరెంట్ కన్స్యూమర్ నంబర్‌తో', 1.0)}
        ${point(2, 'Install through a registered vendor', 'పోర్టల్‌లోని వెండర్ ద్వారానే', 2.4)}
        ${point(3, 'Net metering → subsidy to your bank', 'సబ్సిడీ నేరుగా బ్యాంకు ఖాతాలోకి', 3.8)}
        <div class="warn" data-in="5.4" data-fx="pop">Applying is free. Don't pay anyone promising "free solar".<div class="e">Helpline 15555 · <span class="te">దరఖాస్తు ఉచితం</span></div></div>` },
      { start: 28, cls: 'end', html: endCardEn('Share with homeowners you know! ☀️', 'ఇల్లు ఉన్నవారికి షేర్ చేయండి') },
    ],
  },

  // ---------------------------------------------------------------- Short 12: Kisan Credit Card (English)
  12: {
    file: 'short-12-kcc-en', lang: 'en', duration: 35, tag: '💳 For farmers', tagColor: '#15803d', music: { root: 57, seed: 3 },
    scenes: [
      { start: 0, dark: true, html: `
        <div class="kicker" data-in="0" data-dur="0.4">Kisan Credit Card: farm loan at</div>
        <div class="mega gold" data-in="0.3" data-fx="pop" data-pulse>4%</div>
        <div class="h1" data-in="0.9">if you repay on time!</div>
        <div class="sub" data-in="1.2">7% a year, with 3% back for on-time repayment<br><span class="te">కిసాన్ క్రెడిట్ కార్డ్: సమయానికి కడితే 4% వడ్డీ</span></div>
        <div class="pill" data-in="1.8" data-fx="pop" style="background:#15803d">💳 No collateral up to ₹2 lakh</div>` },
      { start: 4.5, cls: 'compact', html: `
        <div class="label" data-in="0.1">Interest and limits</div>
        <div class="h2" data-in="0.2">What you get</div>
        <div class="chips">
          ${chip('💰', '7% interest on loans up to ₹3 lakh', '₹5 lakh limit announced, ask your bank · ₹3 లక్షల వరకు 7%', 1.0)}
          ${chip('⏱️', 'Repay on time: effectively 4%', 'సమయానికి కడితే 4% మాత్రమే', 2.0)}
          ${chip('🔓', 'No collateral up to ₹2 lakh', 'తాకట్టు లేకుండా ₹2 లక్షల వరకు', 3.0)}
          ${chip('💳', 'RuPay card, valid 5 years', '5 ఏళ్లు చెల్లుబాటు', 4.0)}
        </div>` },
      { start: 11, dark: true, cls: 'compact', html: `
        <div class="label" data-in="0.1">Who can get one?</div>
        <div class="h2" data-in="0.2">Not just landowners</div>
        ${point('✓', 'Farmers who own land', 'భూమి ఉన్న రైతులు', 1.0)}
        ${point('✓', 'Tenant farmers and sharecroppers', 'కౌలు రైతులు కూడా', 2.5)}
        ${point('✓', 'Dairy, poultry, goat and fish farmers', 'పాడి, కోళ్లు, మేకలు, చేపల పెంపకం', 4.0)}` },
      { start: 18.5, cls: 'compact', html: `
        <div class="label" data-in="0.1">How to apply</div>
        <div class="h2" data-in="0.2">At your bank</div>
        ${point(1, 'Visit your bank branch', 'Or get the KCC form on pmkisan.gov.in · బ్యాంకు శాఖకు వెళ్ళండి', 1.0)}
        ${point(2, 'Aadhaar, photo, land records', 'Or tenancy papers, plus crop details · ఆధార్, ఫోటో, భూమి పత్రాలు', 2.6)}
        ${point(3, 'Decision in about 14 days', 'సుమారు 14 రోజుల్లో నిర్ణయం', 4.2)}
        <div class="warn" data-in="6.0" data-fx="pop">No processing fee up to ₹3 lakh at most banks. Don't pay agents.<div class="e te">ఏజెంట్లకు డబ్బు ఇవ్వకండి</div></div>` },
      { start: 28, cls: 'end', html: endCardEn('Share with farmer friends! 🌾', 'రైతు మిత్రులకు షేర్ చేయండి') },
    ],
  },

  // ---------------------------------------------------------------- Short 13: Ujjwala subsidy change (English)
  13: {
    file: 'short-13-ujjwala-en', lang: 'en', duration: 35, tag: '🔥 Changed in June 2026', tagColor: '#dc2626', music: { root: 58, seed: 1 },
    scenes: [
      { start: 0, dark: true, html: `
        <div class="kicker" data-in="0" data-dur="0.4">Ujjwala gas subsidy has changed!</div>
        <div class="mega gold" data-in="0.3" data-fx="pop"><span class="strike" data-in="1.0" data-fx="strike" style="color:rgba(255,255,255,.55)">9</span> → 4</div>
        <div class="h1" data-in="1.2">subsidised refills a year</div>
        <div class="sub te" data-in="1.5">ఉజ్వల: ₹300 సబ్సిడీ ఇప్పుడు ఏడాదికి 4 సిలిండర్లకే</div>
        <div class="pill" data-in="2.0" data-fx="pop" style="background:#dc2626">🔥 From June 2026</div>` },
      { start: 4.5, html: `
        <div class="label" data-in="0.1">What you get now</div>
        <div class="mega teal" data-in="0.3" data-fx="count" data-count="300" data-prefix="₹" style="font-size:170px">₹300</div>
        <div class="para" data-in="0.9" style="margin-top:0">subsidy per 14.2 kg cylinder</div>
        <div class="chips">
          ${chip('🔥', '4 refills a year → up to ₹1,200', 'ఏడాదికి 4 సిలిండర్లు · ₹1,200 వరకు', 1.6)}
          ${chip('💸', 'After the 4th: normal price', '5వ సిలిండర్ నుంచి పూర్తి ధర', 2.5)}
          ${chip('🏦', 'Credited to your bank account', 'నేరుగా బ్యాంకు ఖాతాలోకి', 3.4)}
        </div>` },
      { start: 11, dark: true, cls: 'compact', html: `
        <div class="label" data-in="0.1">PM Ujjwala Yojana</div>
        <div class="h2" data-in="0.2">Free gas connection</div>
        <div class="chips">
          ${chip('🎁', 'Free connection, first refill and stove', 'Ujjwala 2.0 · ఉచిత కనెక్షన్, స్టవ్', 1.0)}
          ${chip('👩', 'Woman 18+ from a poor family', 'పేద కుటుంబంలో 18 ఏళ్లు నిండిన మహిళ', 2.0)}
          ${chip('🏠', 'No LPG connection at home already', 'ఇంట్లో ఇప్పటికే గ్యాస్ ఉండకూడదు', 3.0)}
          ${chip('📝', 'Apply at pmuy.gov.in or your distributor', 'pmuy.gov.in లేదా గ్యాస్ డిస్ట్రిబ్యూటర్', 4.0)}
        </div>` },
      { start: 18.5, cls: 'compact', html: `
        <div class="label" data-in="0.1">Keep your subsidy coming</div>
        <div class="h2" data-in="0.2">Check these</div>
        ${point('✓', 'Aadhaar eKYC with your gas distributor', 'డిస్ట్రిబ్యూటర్ దగ్గర ఈకేవైసీ', 1.0)}
        ${point('✓', 'Bank account linked to Aadhaar', 'బ్యాంకు ఖాతా ఆధార్‌తో లింక్', 2.6)}
        ${point('✓', 'AP: Deepam-2 · TS: ₹500 cylinder', 'State help is separate · రాష్ట్ర పథకాలు వేరు', 4.2)}
        <div class="warn" data-in="6.0" data-fx="pop">The connection is free. Don't pay agents.<div class="e te">కనెక్షన్ ఉచితం, ఏజెంట్లకు డబ్బు ఇవ్వకండి</div></div>` },
      { start: 28, cls: 'end', html: endCardEn('Share with families who use Ujjwala! 🔥', 'ఉజ్వల వాడే కుటుంబాలకు షేర్ చేయండి') },
    ],
  },

  // ================= Batch 3 (made 24 Oct 2026; facts from the guides checked that day), English-primary
  // ---------------------------------------------------------------- Short 14: PM-KISAN 24th + Annadata, 30 Oct reported
  14: {
    file: 'short-14-pm-kisan-30oct-en', lang: 'en', duration: 35, tag: '📅 Reported date', tagColor: '#2563eb', music: { root: 55, seed: 2 },
    scenes: [
      { start: 0, dark: true, html: `
        <div class="kicker" data-in="0" data-dur="0.4">PM-KISAN 24th instalment</div>
        <div class="row">
          <div class="datecard" data-in="0.3" data-fx="pop" data-pulse><div class="top">REPORTED</div><div class="day">30</div><div class="mon">October</div></div>
        </div>
        <div class="h1 mt" data-in="1.0">₹2,000 for farmers</div>
        <div class="sub te" data-in="1.3">పీఎం కిసాన్ 24వ విడత: 30 అక్టోబర్ (వార్తల ప్రకారం)</div>
        <div class="pill" data-in="1.9" data-fx="pop">⚠️ PIB confirmation awaited</div>` },
      { start: 4.5, cls: 'compact', html: `
        <div class="label" data-in="0.1">Fact check · 24 October</div>
        <div class="h2" data-in="0.2">What we know</div>
        ${point('✓', 'News: Agriculture Ministry posted 30 Oct', 'On social media, 23 October · వ్యవసాయ శాఖ ప్రకటన (వార్తలు)', 1.0)}
        ${point('!', 'No PIB press release yet', 'అధికారిక PIB ప్రకటన ఇంకా లేదు', 2.6)}
        ${point('✗', '17, 18, 20 October were wrong', 'ఆ తేదీలు తప్పు', 4.2)}
        <div class="warn" data-in="5.8" data-fx="pop">Final word: PIB and pmkisan.gov.in<div class="e te">తుది సమాచారం: PIB, pmkisan.gov.in</div></div>` },
      { start: 12, dark: true, html: `
        <div class="label" data-in="0.1">Andhra Pradesh farmers</div>
        <div class="h2" data-in="0.2">Annadata Sukhibhava 2nd instalment</div>
        <div class="para" data-in="0.9">News reports say AP plans to pay it on the same day, 30 October.</div>
        <div class="sub te" data-in="1.2">అన్నదాత సుఖీభవ 2వ విడత కూడా 30 అక్టోబర్‌న రావచ్చు (వార్తలు)</div>
        <div class="warn" data-in="2.4" data-fx="pop">Date and amount are not officially confirmed yet<div class="e te">తేదీ, మొత్తం ఇంకా అధికారికంగా నిర్ధారణ కాలేదు</div></div>` },
      { start: 19, cls: 'compact', html: `
        <div class="label" data-in="0.1">Do this before 30 October</div>
        <div class="h2" data-in="0.2">So your money isn't held back</div>
        ${point(1, 'eKYC done', 'ఈకేవైసీ పూర్తి', 1.0)}
        ${point(2, 'Aadhaar–bank (DBT) link', 'ఆధార్–బ్యాంకు లింక్', 2.2)}
        ${point(3, 'Land seeding', 'ల్యాండ్ సీడింగ్ · AP: ask at your Rythu Seva Kendram', 3.4)}
        <div class="warn" data-in="5.0" data-fx="pop">Check status: pmkisan.gov.in → Know Your Status<div class="e">Never share your OTP · <span class="te">OTP ఎవరికీ చెప్పకండి</span></div></div>` },
      { start: 28, cls: 'end', html: endCardEn('Share with farmer friends! 🌾', 'రైతు మిత్రులకు షేర్ చేయండి') },
    ],
  },

  // ---------------------------------------------------------------- Short 15: Deepam-2, book by 30 Nov (AP)
  15: {
    file: 'short-15-deepam-en', lang: 'en', duration: 35, tag: '⏰ AP: book by 30 Nov', tagColor: '#d97706', music: { root: 60, seed: 1 },
    scenes: [
      { start: 0, dark: true, html: `
        <div class="kicker" data-in="0" data-dur="0.4">AP families: your free gas cylinder</div>
        <div class="row">
          <div class="datecard" data-in="0.3" data-fx="pop" data-pulse><div class="top">BOOK BY</div><div class="day">30</div><div class="mon">November</div></div>
        </div>
        <div class="h1 mt" data-in="1.0">Deepam-2</div>
        <div class="sub te" data-in="1.3">దీపం-2: ఈ విడత ఉచిత సిలిండర్ 30 నవంబర్ లోపు బుక్ చేయండి</div>
        <div class="pill" data-in="1.9" data-fx="pop">🔥 3 free cylinders a year</div>` },
      { start: 4.5, html: `
        <div class="label" data-in="0.1">How it works</div>
        <div class="h2" data-in="0.2">Book, pay, get it back</div>
        ${point(1, 'Book with your gas agency as usual', 'Phone, app or SMS · మామూలుగా బుక్ చేయండి', 1.0)}
        ${point(2, 'Pay at delivery', 'డెలివరీ సమయంలో డబ్బు కట్టండి', 2.6)}
        ${point(3, 'Full amount back in 48 hours', 'To your bank account · 48 గంటల్లో డబ్బు వాపసు', 4.2)}` },
      { start: 11.5, dark: true, cls: 'compact', html: `
        <div class="label" data-in="0.1">One free cylinder in each period</div>
        <div class="h2" data-in="0.2">Book by the last date</div>
        <div class="chips">
          ${chip('1️⃣', 'December – March → by 31 March', 'డిసెంబర్–మార్చి', 0.8)}
          ${chip('2️⃣', 'April – July → by 31 July', 'ఏప్రిల్–జూలై', 1.6)}
          ${chip('👉', 'August – November → by 30 November', 'ఇప్పుడు ఈ విడత · this period now', 2.4)}
        </div>
        <div class="warn" data-in="3.8" data-fx="pop">An unused free cylinder does not carry over<div class="e te">వాడుకోకపోతే తర్వాతి విడతకు రాదు</div></div>` },
      { start: 19, cls: 'compact', html: `
        <div class="label" data-in="0.1">Who can get it?</div>
        <div class="h2" data-in="0.2">You need</div>
        ${point('✓', 'A rice card', 'బియ్యం కార్డు', 1.0)}
        ${point('✓', 'An active LPG connection', 'గ్యాస్ కనెక్షన్', 2.2)}
        ${point('✓', 'Aadhaar linked to gas, rice card and bank', 'అన్నీ ఆధార్‌తో లింక్', 3.4)}
        <div class="warn" data-in="5.0" data-fx="pop">Refund didn't come? Call 1967<div class="e te">డబ్బు రాకపోతే 1967 కి ఫోన్ చేయండి</div></div>` },
      { start: 28, cls: 'end', html: endCardEn('Share with AP families! 🔥', 'ఏపీ కుటుంబాలకు షేర్ చేయండి') },
    ],
  },

  // ---------------------------------------------------------------- Short 16: Ayushman Bharat PM-JAY
  16: {
    file: 'short-16-ayushman-en', lang: 'en', duration: 35, tag: '🏥 All India', tagColor: '#0f766e', music: { root: 62, seed: 3 },
    scenes: [
      { start: 0, dark: true, html: `
        <div class="kicker" data-in="0" data-dur="0.4">Free hospital treatment up to</div>
        <div class="mega gold" data-in="0.3" data-fx="pop" data-pulse>₹5 lakh</div>
        <div class="h1" data-in="0.9">a year, per family</div>
        <div class="sub te" data-in="1.2">ఆయుష్మాన్ భారత్: కుటుంబానికి ఏడాదికి ₹5 లక్షల ఉచిత వైద్యం</div>
        <div class="pill" data-in="1.8" data-fx="pop" style="background:#7c3aed">👴 Everyone 70+ covered, any income</div>` },
      { start: 4.5, cls: 'compact', html: `
        <div class="label" data-in="0.1">Ayushman Bharat PM-JAY</div>
        <div class="h2" data-in="0.2">What you get</div>
        <div class="chips">
          ${chip('🏥', 'Cashless at govt and empanelled private hospitals', 'డబ్బు కట్టకుండా చికిత్స', 1.0)}
          ${chip('🗺️', 'Works in any state in India', 'ఏ రాష్ట్రంలోనైనా', 1.9)}
          ${chip('✅', 'Old illnesses covered from day one', 'ముందున్న వ్యాధులకూ వర్తిస్తుంది', 2.8)}
          ${chip('💊', '3 days before + 15 days after hospital costs', 'ముందు, తర్వాత ఖర్చులు కూడా', 3.7)}
        </div>` },
      { start: 11.5, dark: true, cls: 'compact', html: `
        <div class="label" data-in="0.1">Who is covered?</div>
        <div class="h2" data-in="0.2">Check if you're eligible</div>
        ${point('✓', 'Poor families in the SECC 2011 list', 'Many states added more families · రాష్ట్ర జాబితాలు కూడా', 1.0)}
        ${point('✓', 'Every citizen aged 70+, any income', 'Ayushman Vay Vandana card · 70 ఏళ్లు పైబడిన అందరికీ', 2.8)}` },
      { start: 19, cls: 'compact', html: `
        <div class="label" data-in="0.1">Get your Ayushman card</div>
        <div class="h2" data-in="0.2">Free, online or at a hospital</div>
        ${point(1, 'beneficiary.nha.gov.in or Ayushman App', 'Search with Aadhaar, then eKYC · ఆధార్‌తో చెక్ చేయండి', 1.0)}
        ${point(2, 'Or Ayushman Mitra desk / CSC', 'With Aadhaar and ration card', 2.6)}
        ${point(3, "At hospital: don't pay for covered treatment", 'కవర్ అయిన చికిత్సకు డబ్బు కట్టకండి', 4.2)}
        <div class="warn" data-in="5.8" data-fx="pop">Helpline 14555 (toll-free)<div class="e te">సహాయం: 14555</div></div>` },
      { start: 28, cls: 'end', html: endCardEn('Share with your family, especially elders! 👴', 'ఇంట్లో పెద్దలకు షేర్ చేయండి') },
    ],
  },

  // ---------------------------------------------------------------- Short 17: Atal Pension Yojana
  17: {
    file: 'short-17-atal-pension-en', lang: 'en', duration: 35, tag: '👴 Pension at 60', tagColor: '#2563eb', music: { root: 57, seed: 1 },
    scenes: [
      { start: 0, dark: true, html: `
        <div class="kicker" data-in="0" data-dur="0.4">Guaranteed pension up to</div>
        <div class="mega gold" data-in="0.25" data-fx="count" data-count="5000" data-prefix="₹" data-pulse>₹5,000</div>
        <div class="h1" data-in="0.9">a month after 60</div>
        <div class="sub te" data-in="1.2">అటల్ పెన్షన్: 60 ఏళ్ల తర్వాత నెలకు ₹5,000 వరకు పెన్షన్</div>
        <div class="pill" data-in="1.8" data-fx="pop" style="background:#2563eb">Join between 18 and 40</div>` },
      { start: 4.5, html: `
        <div class="label" data-in="0.1">For a ₹5,000 pension you pay</div>
        <div class="h2" data-in="0.2">The earlier, the cheaper</div>
        <div class="chips">
          ${chip('🧑', 'Join at 18 → ₹210 a month', '18 ఏళ్లకు చేరితే నెలకు ₹210', 1.0)}
          ${chip('🧔', 'Join at 30 → ₹577 a month', '30 ఏళ్లకు చేరితే ₹577', 1.8)}
          ${chip('👨', 'Join at 40 → ₹1,454 a month', '40 ఏళ్లకు చేరితే ₹1,454', 2.6)}
        </div>
        <div class="sub" data-in="3.6">Smaller pensions (₹1,000–₹4,000) cost less. Official APY chart.</div>` },
      { start: 11.5, dark: true, cls: 'compact', html: `
        <div class="label" data-in="0.1">Triple benefit</div>
        <div class="h2" data-in="0.2">Guaranteed by the Government of India</div>
        ${point(1, 'Your pension, for life', 'మీకు జీవితాంతం పెన్షన్', 1.0)}
        ${point(2, 'Then your spouse gets the same', 'తర్వాత భార్య / భర్తకు అదే పెన్షన్', 2.6)}
        ${point(3, 'Then your nominee gets ₹1.7–8.5 lakh', 'నామినీకి ₹1.7–8.5 లక్షలు', 4.2)}` },
      { start: 19, cls: 'compact', html: `
        <div class="label" data-in="0.1">How to join · at your bank or post office</div>
        ${point('✓', 'Indian citizen, age 18 to 40', '18–40 ఏళ్ల వయసు', 1.0)}
        ${point('✓', 'Savings account + Aadhaar + mobile', 'ఖాతా నుంచి ఆటో-డెబిట్', 2.4)}
        ${point('✗', 'Not for income-tax payers', 'Since 1 Oct 2022 · ఆదాయపు పన్ను కట్టేవారికి కాదు', 3.8)}
        <div class="warn" data-in="5.4" data-fx="pop">Your exact amount: free APY calculator 👉 link in description</div>` },
      { start: 28, cls: 'end', html: endCardEn('Share with young workers you know! 💼', 'యువతకు షేర్ చేయండి') },
    ],
  },

  // ---------------------------------------------------------------- Short 18: PM Vidyalaxmi education loan
  18: {
    file: 'short-18-vidyalaxmi-en', lang: 'en', duration: 35, tag: '🎓 Education loan', tagColor: '#7c3aed', music: { root: 60, seed: 2 },
    scenes: [
      { start: 0, dark: true, html: `
        <div class="kicker" data-in="0" data-dur="0.4">Got a seat in a top college?</div>
        <div class="h1" data-in="0.3">Education loan with</div>
        <div class="mega gold" data-in="0.6" data-fx="pop" data-pulse style="font-size:118px;line-height:1.1;white-space:nowrap">no collateral</div>
        <div class="kicker" data-in="1.1">no guarantor</div>
        <div class="sub te" data-in="1.4">పీఎం విద్యాలక్ష్మి: తాకట్టు, హామీదారు లేకుండా విద్యా రుణం</div>` },
      { start: 4.5, cls: 'compact', html: `
        <div class="label" data-in="0.1">PM Vidyalaxmi</div>
        <div class="h2" data-in="0.2">What you get</div>
        <div class="chips">
          ${chip('🎓', 'Loan for full tuition and course costs', 'పూర్తి కోర్సు ఖర్చుకు రుణం', 1.0)}
          ${chip('🛡️', 'Govt guarantees 75% of loans up to ₹7.5 lakh', 'బ్యాంకులకు ప్రభుత్వ హామీ', 1.9)}
          ${chip('💸', 'Family income up to ₹8 lakh: govt pays 3% interest', 'On loans up to ₹10 lakh, during the course · 3% వడ్డీ ప్రభుత్వం', 2.8)}
        </div>
        <div class="sub" data-in="4.0" style="font-size:36px">3% help goes to 1 lakh students a year; not if you get another govt scholarship.</div>` },
      { start: 11.5, dark: true, cls: 'compact', html: `
        <div class="label" data-in="0.1">Which colleges?</div>
        <div class="h2" data-in="0.2">Quality institutions only</div>
        ${point('✓', 'Top 100 in NIRF rankings', 'Govt and private · NIRF టాప్ 100', 1.0)}
        ${point('✓', 'State govt institutions ranked 101–200', 'రాష్ట్ర ప్రభుత్వ సంస్థలు 101–200', 2.4)}
        ${point('✓', 'Central institutions: IITs, NITs, IIMs…', 'కేంద్ర సంస్థలు', 3.8)}` },
      { start: 19, cls: 'compact', html: `
        <div class="label" data-in="0.1">How to apply</div>
        <div class="card white" data-in="0.3" data-fx="pop">
          <div class="portal"><div class="ic">🎓</div><div><div class="t">PM-Vidyalaxmi portal</div><div class="u">pmvidyalaxmi.co.in</div></div></div>
        </div>
        ${point(1, 'One common loan application', 'ఒకే దరఖాస్తు', 1.0)}
        ${point(2, 'Choose up to 3 banks', '3 బ్యాంకుల వరకు ఎంచుకోండి', 2.2)}
        ${point(3, 'Admission letter, fees, Aadhaar, PAN, income certificate', 'పత్రాలు అప్‌లోడ్ చేయండి', 3.4)}` },
      { start: 28, cls: 'end', html: endCardEn('Share with students and parents! 🎓', 'విద్యార్థులకు, తల్లిదండ్రులకు షేర్ చేయండి') },
    ],
  },

  // ---------------------------------------------------------------- Short 19: Rajiv Yuva Vikasam (Telangana), status
  19: {
    file: 'short-19-rajiv-yuva-vikasam-en', lang: 'en', duration: 35, tag: '📢 Telangana · status', tagColor: '#2563eb', music: { root: 58, seed: 3 },
    scenes: [
      { start: 0, dark: true, html: `
        <div class="kicker" data-in="0" data-dur="0.4">Telangana: Rajiv Yuva Vikasam</div>
        <div class="row">
          <div class="datecard" data-in="0.3" data-fx="pop" data-pulse><div class="top">1ST PHASE PLANNED</div><div class="day">19</div><div class="mon">November</div></div>
        </div>
        <div class="sub te mt" data-in="1.1">రాజీవ్ యువ వికాసం: మొదటి దశ 19 నవంబర్ నుంచి (ప్రకటన)</div>
        <div class="pill" data-in="1.8" data-fx="pop" style="background:#dc2626">⚠️ Nothing paid yet</div>` },
      { start: 4.5, cls: 'compact', html: `
        <div class="label" data-in="0.1">Status · 24 October 2026</div>
        <div class="h2" data-in="0.2">What we know</div>
        ${point('✓', 'About 16 lakh people applied', 'సుమారు 16 లక్షల దరఖాస్తులు', 1.0)}
        ${point('✓', '1st phase: units up to ₹1 lakh, from 19 Nov', 'Said by the Deputy CM, Sept 2026 · ₹1 లక్ష వరకు యూనిట్లు', 2.6)}
        ${point('!', 'Final list not published yet', 'తుది జాబితా ఇంకా రాలేదు', 4.2)}
        ${point('!', 'Bigger units (₹1–4 lakh): no date', 'పెద్ద యూనిట్లకు తేదీ లేదు', 5.4)}` },
      { start: 12.5, dark: true, cls: 'compact', html: `
        <div class="label" data-in="0.1">Support announced (SC, ST, BC, minority youth)</div>
        <div class="h2" data-in="0.2">Subsidy on your unit cost</div>
        <div class="chips">
          ${chip('💯', 'Up to ₹50,000 → 100%', '₹50,000 వరకు 100%', 0.8)}
          ${chip('🟢', 'Up to ₹1 lakh → 90%', '₹1 లక్ష వరకు 90%', 1.5)}
          ${chip('🟡', 'Up to ₹2 lakh → 80%', '₹2 లక్షల వరకు 80%', 2.2)}
          ${chip('🟠', 'Up to ₹4 lakh → 70%', '₹4 లక్షల వరకు 70%', 2.9)}
        </div>
        <div class="sub" data-in="3.8" style="font-size:36px">The rest is a bank loan. Applying doesn't guarantee selection.</div>` },
      { start: 20, cls: 'compact', html: `
        <div class="label" data-in="0.1">What to do now</div>
        <div class="h2" data-in="0.2">If you applied</div>
        ${point(1, 'Keep your application number safe', 'దరఖాస్తు నంబర్ దాచుకోండి', 1.0)}
        ${point(2, 'Watch your district welfare office', 'Official announcements only · అధికారిక ప్రకటనలు మాత్రమే', 2.4)}
        <div class="warn" data-in="4.0" data-fx="pop">Never pay anyone who promises to get your unit sanctioned<div class="e te">యూనిట్ ఇప్పిస్తామంటే డబ్బు ఇవ్వకండి</div></div>` },
      { start: 28, cls: 'end', html: endCardEn('Share with Telangana youth! 🚀', 'తెలంగాణ యువతకు షేర్ చేయండి') },
    ],
  },

  // ---------------------------------------------------------------- Short 20: Dr NTR Vaidya Seva (AP)
  20: {
    file: 'short-20-ntr-vaidya-seva-en', lang: 'en', duration: 35, tag: '🏥 AP health', tagColor: '#0f766e', music: { root: 62, seed: 1 },
    scenes: [
      { start: 0, dark: true, html: `
        <div class="kicker" data-in="0" data-dur="0.4">AP: free treatment up to</div>
        <div class="mega gold" data-in="0.3" data-fx="pop" data-pulse style="font-size:180px;white-space:nowrap">₹25 lakh</div>
        <div class="h1" data-in="0.9">per family, per year</div>
        <div class="sub te" data-in="1.2">డాక్టర్ ఎన్టీఆర్ వైద్య సేవ: కుటుంబానికి ఏడాదికి ₹25 లక్షల వరకు ఉచిత వైద్యం</div>
        <div class="pill" data-in="1.8" data-fx="pop" style="background:#2563eb">🏥 Helpline 104</div>` },
      { start: 4.5, cls: 'compact', html: `
        <div class="label" data-in="0.1">Dr NTR Vaidya Seva</div>
        <div class="h2" data-in="0.2">What you get</div>
        <div class="chips">
          ${chip('🏥', 'Cashless at network hospitals', 'నెట్‌వర్క్ ఆసుపత్రుల్లో ఉచితం', 1.0)}
          ${chip('🩺', '3,257 procedures and surgeries', '3,257 చికిత్సలు', 1.9)}
          ${chip('🍚', 'For rice card (BPL) families with a health card', 'బియ్యం కార్డు కుటుంబాలకు', 2.8)}
          ${chip('🤝', 'Works with Ayushman Bharat', 'ఆయుష్మాన్ భారత్‌తో కలిపి', 3.7)}
        </div>` },
      { start: 11.5, dark: true, cls: 'compact', html: `
        <div class="label" data-in="0.1">How to get treatment</div>
        <div class="h2" data-in="0.2">At the hospital</div>
        ${point(1, 'Go with your health card, or Aadhaar + rice card', 'హెల్త్ కార్డు లేదా ఆధార్ + బియ్యం కార్డు', 1.0)}
        ${point(2, 'Meet the Aarogyamitra desk', 'ఆరోగ్యమిత్రను కలవండి', 2.6)}
        ${point(3, 'After approval, treatment is free', 'అనుమతి తర్వాత ఉచిత చికిత్స', 4.2)}` },
      { start: 19, cls: 'compact', html: `
        <div class="label" data-in="0.1">Good to know</div>
        <div class="warn" data-in="0.4" data-fx="pop">Asked to pay for a covered procedure? Call 104<div class="e te">కవర్ అయిన చికిత్సకు డబ్బు అడిగితే 104 కి ఫోన్ చేయండి</div></div>
        <div class="para" data-in="1.8">The new insurance system announced for April 2026 is not confirmed yet. Use your existing health card.</div>
        <div class="sub te" data-in="2.2">కొత్త బీమా విధానం ఇంకా నిర్ధారణ కాలేదు. ఇప్పటి హెల్త్ కార్డు వాడండి.</div>
        <div class="sub" data-in="3.2">Don't pay agents for a health card.</div>` },
      { start: 28, cls: 'end', html: endCardEn('Share with AP families! 🏥', 'ఏపీ కుటుంబాలకు షేర్ చేయండి') },
    ],
  },
};

// Step 2 of the checker demo: fields fill in after each tap, then the button is pressed.
function phoneFrame(lt, root) {
  const on = (id, t) => { const v = lt >= t; root.querySelector('#v' + id).style.opacity = v ? 1 : 0; root.querySelector('#ph' + id).style.opacity = v ? 0 : 1; };
  on(1, 6.9); on(2, 7.9); on(3, 8.9);
  root.querySelector('#c1').style.opacity = lt >= 9.9 ? 1 : 0;
  root.querySelector('#c2').style.opacity = lt >= 10.7 ? 1 : 0;
  const press = lt >= 12.5 && lt < 12.9;
  root.querySelector('#go').style.cssText = press ? 'background:#0b4f4a;transform:scale(.96)' : '';
}
