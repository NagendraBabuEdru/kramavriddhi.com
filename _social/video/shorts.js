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
        <div class="pill" data-in="1.8" data-fx="pop">📅 దసరా ముందు రావచ్చు</div>` },
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
          ${chip('📅', 'దసరా ముందు రావచ్చు', 'Expected before Dasara, as per news reports', 2.8)}
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
