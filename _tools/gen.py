import os, sys, json
sys.path.insert(0, os.path.dirname(__file__))
from parts import head, nav, footer, FOOTER

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UPDATED = "6 October 2026"
UPDATED_ISO = "2026-10-06"

def write(rel, html):
    p = os.path.join(ROOT, rel)
    os.makedirs(os.path.dirname(p), exist_ok=True)
    with open(p, "w", encoding="utf-8", newline="\n") as f:
        f.write(html)
    print("wrote", rel)

# ---------------------------------------------------------------- schemes data
SCHEMES = [
    dict(slug="pm-kisan", name="PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)", short="PM-KISAN",
         cat="farmers", cat_label="Farmers & Agriculture", icon="🌾",
         summary="₹6,000 a year for land-holding farmer families, paid in three ₹2,000 instalments straight to the bank account."),
    dict(slug="ayushman-bharat-pm-jay", name="Ayushman Bharat PM-JAY", short="Ayushman Bharat PM-JAY",
         cat="health", cat_label="Health", icon="🏥",
         summary="Free hospital treatment up to ₹5 lakh per family per year, plus cover for every citizen aged 70 and above."),
    dict(slug="sukanya-samriddhi-yojana", name="Sukanya Samriddhi Yojana (SSY)", short="Sukanya Samriddhi Yojana",
         cat="women", cat_label="Women & Girls", icon="👧",
         summary="A high-interest, tax-free savings account for a girl child under 10, for her education and marriage."),
    dict(slug="pm-awas-yojana-urban", name="PM Awas Yojana – Urban 2.0 (PMAY-U 2.0)", short="PM Awas Yojana – Urban 2.0",
         cat="housing", cat_label="Housing", icon="🏠",
         summary="Help to build, buy or rent a house in towns and cities: ₹2.5 lakh assistance or up to ₹1.8 lakh home-loan subsidy."),
    dict(slug="pm-awas-yojana-gramin", name="PM Awas Yojana – Gramin (PMAY-G)", short="PM Awas Yojana – Gramin",
         cat="housing", cat_label="Housing", icon="🏡",
         summary="₹1.2 lakh (₹1.3 lakh in hilly and North-East areas) to build a pucca house in villages, plus toilet and wage support."),
    dict(slug="pm-mudra-yojana", name="PM Mudra Yojana (PMMY)", short="PM Mudra Yojana",
         cat="business", cat_label="Business & Self-employment", icon="💼",
         summary="Collateral-free business loans up to ₹20 lakh for small shops, services, manufacturing and allied farm activities."),
    dict(slug="atal-pension-yojana", name="Atal Pension Yojana (APY)", short="Atal Pension Yojana",
         cat="pension", cat_label="Pension & Insurance", icon="👴",
         summary="A guaranteed pension of ₹1,000 to ₹5,000 a month after 60, for anyone aged 18–40 who is not an income-tax payer."),
    dict(slug="pm-jan-dhan-yojana", name="PM Jan Dhan Yojana (PMJDY)", short="PM Jan Dhan Yojana",
         cat="banking", cat_label="Banking", icon="🏦",
         summary="A zero-balance bank account with a free RuPay card, ₹2 lakh accident cover and an overdraft of up to ₹10,000."),
    dict(slug="pm-jeevan-jyoti-bima-yojana", name="PM Jeevan Jyoti Bima Yojana (PMJJBY)", short="PM Jeevan Jyoti Bima Yojana",
         cat="pension", cat_label="Pension & Insurance", icon="🛡️",
         summary="₹2 lakh life insurance for ₹436 a year, for anyone aged 18–50 with a bank or post office account."),
    dict(slug="pm-suraksha-bima-yojana", name="PM Suraksha Bima Yojana (PMSBY)", short="PM Suraksha Bima Yojana",
         cat="pension", cat_label="Pension & Insurance", icon="🩹",
         summary="Accident insurance up to ₹2 lakh for just ₹20 a year, for anyone aged 18–70 with a bank account."),
    dict(slug="ap-annadata-sukhibhava", name="Annadata Sukhibhava (Andhra Pradesh)", short="Annadata Sukhibhava",
         state="ap", cat="farmers", cat_label="Farmers & Agriculture", icon="🌾",
         summary="₹20,000 a year for AP farmer families: ₹14,000 from the state plus ₹6,000 from PM-KISAN, in three instalments."),
    dict(slug="ap-ntr-bharosa-pension", name="NTR Bharosa Pension (Andhra Pradesh)", short="NTR Bharosa Pension",
         state="ap", cat="pension", cat_label="Pension & Insurance", icon="👵",
         summary="Monthly pensions of ₹4,000 to ₹15,000 for the elderly, widows, persons with disabilities and other groups."),
    dict(slug="ap-thalliki-vandanam", name="Thalliki Vandanam (Andhra Pradesh)", short="Thalliki Vandanam",
         state="ap", cat="education", cat_label="Education & Skills", icon="📚",
         summary="₹15,000 a year for every school-going child in Classes 1–12, with ₹13,000 paid to the mother."),
    dict(slug="ts-rythu-bharosa", name="Rythu Bharosa (Telangana)", short="Rythu Bharosa",
         state="ts", cat="farmers", cat_label="Farmers & Agriculture", icon="🚜",
         summary="₹12,000 per acre every year for Telangana farmers, paid as ₹6,000 per acre each crop season."),
    dict(slug="ts-mahalakshmi", name="Mahalakshmi Scheme (Telangana)", short="Mahalakshmi",
         state="ts", cat="women", cat_label="Women & Girls", icon="🚌",
         summary="Free TGSRTC bus travel for women and girls, and ₹500 LPG cylinders for eligible families."),
    dict(slug="ts-indiramma-indlu", name="Indiramma Indlu (Telangana)", short="Indiramma Indlu",
         state="ts", cat="housing", cat_label="Housing", icon="🏘️",
         summary="Up to ₹5 lakh to build a pucca house for poor families who don't own one, paid in stages."),
    dict(slug="ap-deepam-2", name="Deepam-2 Free Gas Cylinders (Andhra Pradesh)", short="Deepam-2",
         state="ap", cat="women", cat_label="Women & Girls", icon="🔥",
         summary="Three free LPG cylinders a year for rice card families, one every four months, refunded within 48 hours."),
    dict(slug="ap-stree-shakti", name="Stree Shakti Free Bus Travel (Andhra Pradesh)", short="Stree Shakti",
         state="ap", cat="women", cat_label="Women & Girls", icon="🚍",
         summary="Free travel for women, girls and transgender persons in APSRTC ordinary and express buses across AP."),
    dict(slug="ts-gruha-jyothi", name="Gruha Jyothi Free Electricity (Telangana)", short="Gruha Jyothi",
         state="ts", cat="housing", cat_label="Housing", icon="💡",
         summary="Zero electricity bill for eligible households that use up to 200 units a month."),
    dict(slug="ts-rajiv-aarogyasri", name="Rajiv Aarogyasri (Telangana)", short="Rajiv Aarogyasri",
         state="ts", cat="health", cat_label="Health", icon="🩺",
         summary="Cashless treatment up to ₹10 lakh per family per year for 1,835 procedures, for white ration card families."),
    dict(slug="ts-cheyutha-pension", name="Cheyutha Pension (Telangana)", short="Cheyutha Pension",
         state="ts", cat="pension", cat_label="Pension & Insurance", icon="👵",
         summary="Monthly pensions for poor elderly people, widows, single women, persons with disabilities and other groups."),
    dict(slug="aicte-pragati-scholarship", name="AICTE Pragati Scholarship for Girls", short="Pragati Scholarship",
         cat="education", cat_label="Education & Skills", icon="🎓",
         summary="₹50,000 a year for girls in AICTE-approved degree and diploma courses. 2026-27 last date: 31 October."),
    dict(slug="cbse-single-girl-child-scholarship", name="CBSE Single Girl Child Scholarship", short="CBSE Single Girl Child",
         cat="education", cat_label="Education & Skills", icon="👩‍🎓",
         summary="₹1,000 a month in Class 11–12 for an only daughter who scored 70%+ in CBSE Class 10."),
    dict(slug="lakhpati-didi", name="Lakhpati Didi (SHG women)", short="Lakhpati Didi",
         cat="women", cat_label="Women & Girls", icon="💪",
         summary="Loans, training and business help so rural self-help group women earn ₹1 lakh+ a year."),
    dict(slug="ts-indira-mahila-shakti", name="Indira Mahila Shakti (Telangana)", short="Indira Mahila Shakti",
         state="ts", cat="business", cat_label="Business & Self-employment", icon="🏪",
         summary="Interest-free loans up to ₹10 lakh for SHGs, and women-run canteens, buses, petrol bunks and solar plants."),
]
DISPLAY = list(reversed(SCHEMES))  # newest first
CATEGORIES = [
    ("all", "All"),
    ("farmers", "🌾 Farmers & Agriculture"),
    ("health", "🏥 Health"),
    ("housing", "🏠 Housing"),
    ("business", "💼 Business & Self-employment"),
    ("pension", "👴 Pension & Insurance"),
    ("women", "👧 Women & Girls"),
    ("banking", "🏦 Banking"),
    ("education", "🎓 Education & Skills"),
]

STATES = {
    "central": dict(label="Central Government", short="Central", hub=None),
    "ap": dict(label="Andhra Pradesh", short="Andhra Pradesh", hub="/schemes/andhra-pradesh/"),
    "ts": dict(label="Telangana", short="Telangana", hub="/schemes/telangana/"),
}
def st(s):
    return s.get("state", "central")

def scheme_card(s):
    state_tag = "" if st(s) == "central" else f'<span class="tag state">{STATES[st(s)]["short"]}</span>'
    return f"""        <a class="card" href="/schemes/{s["slug"]}/" data-cat="{s["cat"]}" data-state="{st(s)}" data-name="{s["name"].lower()} {s["short"].lower()} {STATES[st(s)]["label"].lower()}">
          <div class="icon" aria-hidden="true">{s["icon"]}</div>
          <h3>{s["name"]}</h3>
          <p>{s["summary"]}</p>
          <div class="tags">{state_tag}<span class="tag">{s["cat_label"]}</span></div>
        </a>
"""

# ---------------------------------------------------------------- schemes index
STATE_FILTERS = [("all", "All"), ("central", "🇮🇳 Central"), ("ap", "Andhra Pradesh"), ("ts", "Telangana")]
state_chips = "\n".join(
    f'        <button class="chip" type="button" data-state-filter="{k}" aria-pressed="{"true" if k=="all" else "false"}">{v}</button>'
    for k, v in STATE_FILTERS)
chips = "\n".join(
    f'        <button class="chip" type="button" data-filter="{k}" aria-pressed="{"true" if k=="all" else "false"}">{v}</button>'
    for k, v in CATEGORIES)
write("schemes/index.html",
    head("Government Schemes Explained Simply: Central, Andhra Pradesh & Telangana | Kramavriddhi",
         "Simple, step-by-step guides to central government schemes and Andhra Pradesh and Telangana state schemes: who can apply, benefits, documents and how to apply.",
         "/schemes/")
    + nav("schemes") + f"""
    <header class="page-head">
      <div class="eyebrow">Government schemes</div>
      <h1>Government schemes, explained simply</h1>
      <p>Clear guides to central schemes and Andhra Pradesh and Telangana state schemes: who can apply, what you get, which documents you need, and how to apply on the official portal.</p>
      <p class="lang-switch"><a href="/te/schemes/" lang="te">తెలుగులో పథకాలు చదవండి →</a></p>
    </header>

    <div class="filters" role="group" aria-label="Filter by government">
{state_chips}
    </div>
    <div class="filters" role="group" aria-label="Filter by category">
{chips}
    </div>
    <input class="search" type="search" placeholder="Search schemes…" aria-label="Search schemes">
    <a class="cta" href="/schemes/for-women/" style="margin-top:-8px;margin-bottom:12px"><span>👩</span><div><strong>Schemes for girls &amp; women</strong><br><span class="muted" style="font-size:0.9rem">Scholarships, business loans, SHG support and more, in one place.</span></div></a>
    <a class="cta" href="/tools/scheme-eligibility-checker/" style="margin-bottom:12px"><span>✅</span><div><strong>Not sure which schemes are for you?</strong><br><span class="muted" style="font-size:0.9rem">Answer a few questions and see the schemes that may suit you.</span></div></a>
    <a class="cta" href="/tools/" style="margin-bottom:28px"><span>🧮</span><div><strong>Free calculators</strong><br><span class="muted" style="font-size:0.9rem">Atal Pension contribution by age · Sukanya Samriddhi maturity amount</span></div></a>

    <div class="grid" id="scheme-list">
{"".join(scheme_card(s) for s in DISPLAY)}    </div>
    <p class="empty" id="empty">No schemes match yet. New guides are added every week.</p>

    <p class="soon-list"><strong>Coming soon:</strong> PM Vishwakarma, PM Fasal Bima Yojana, PM Kaushal Vikas Yojana, National Scholarship Portal, PM Ujjwala Yojana, Stand-Up India, and more Andhra Pradesh and Telangana schemes.</p>

    <div class="note" style="margin-top:32px">Kramavriddhi is an independent information website, not a government website. We never ask for your Aadhaar, bank details or any fee. Always apply only on the official portal linked in each guide.</div>

    <script>
      (function () {{
        var catChips = document.querySelectorAll('[data-filter]');
        var stateChips = document.querySelectorAll('[data-state-filter]');
        var cards = document.querySelectorAll('#scheme-list .card');
        var search = document.querySelector('.search');
        var empty = document.getElementById('empty');
        var cat = 'all', state = 'all';
        var m = /[?&]state=(central|ap|ts)/.exec(location.search);
        if (m) state = m[1];
        function press(list, attr, val) {{
          list.forEach(function (x) {{ x.setAttribute('aria-pressed', x.getAttribute(attr) === val ? 'true' : 'false'); }});
        }}
        function apply() {{
          var q = search.value.trim().toLowerCase();
          var shown = 0;
          cards.forEach(function (c) {{
            var ok = (cat === 'all' || c.dataset.cat === cat) && (state === 'all' || c.dataset.state === state) && (!q || c.dataset.name.indexOf(q) !== -1);
            c.style.display = ok ? '' : 'none';
            if (ok) shown++;
          }});
          empty.style.display = shown ? 'none' : 'block';
        }}
        catChips.forEach(function (b) {{
          b.addEventListener('click', function () {{ cat = b.dataset.filter; press(catChips, 'data-filter', cat); apply(); }});
        }});
        stateChips.forEach(function (b) {{
          b.addEventListener('click', function () {{ state = b.dataset.stateFilter; press(stateChips, 'data-state-filter', state); apply(); }});
        }});
        search.addEventListener('input', apply);
        press(stateChips, 'data-state-filter', state);
        apply();
      }})();
    </script>
""" + FOOTER)

# ---------------------------------------------------------------- article shell
# Guides that also have a Telugu version (content in te_content.py)
from te_content import TE
SOURCES = {}

def article(s, lede, facts, body, faqs, sources, description):
    SOURCES[s["slug"]] = sources
    has_te = s["slug"] in TE
    alts = {"en": f'/schemes/{s["slug"]}/', "te": f'/te/schemes/{s["slug"]}/'} if has_te else None
    lang_switch = f'\n        <p class="lang-switch"><a href="/te/schemes/{s["slug"]}/" lang="te">తెలుగులో చదవండి →</a></p>' if has_te else ""
    hub = STATES[st(s)]["hub"]
    state_crumb = f'<a href="{hub}">{STATES[st(s)]["label"]}</a> › ' if hub else ""
    facts_html = "\n".join(f'        <div class="fact"><small>{k}</small><strong>{v}</strong></div>' for k, v in facts)
    faq_html = "\n".join(f'      <details><summary>{q}</summary><p>{a}</p></details>' for q, a in faqs)
    src_html = "\n".join(f'        <li><a href="{u}" target="_blank" rel="noopener">{t}</a></li>' for t, u in sources)
    ld = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": s["name"] + " explained",
        "dateModified": UPDATED_ISO,
        "author": {"@type": "Organization", "name": "Kramavriddhi"},
        "publisher": {"@type": "Organization", "name": "Kramavriddhi"},
        "mainEntityOfPage": f"https://kramavriddhi.com/schemes/{s['slug']}/",
    }
    faq_ld = {
        "@context": "https://schema.org", "@type": "FAQPage",
        "mainEntity": [{"@type": "Question", "name": q,
                        "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in faqs],
    }
    extra = ('\n  <script type="application/ld+json">' + json.dumps(ld, ensure_ascii=False) + '</script>'
             + '\n  <script type="application/ld+json">' + json.dumps(faq_ld, ensure_ascii=False) + '</script>')
    return (head(f'{s["name"]}: Eligibility, Benefits & How to Apply | Kramavriddhi', description,
                 f'/schemes/{s["slug"]}/', extra, alternates=alts)
        + nav("schemes") + f'''
    <div class="narrow">
      <p class="crumbs"><a href="/">Home</a> › <a href="/schemes/">Schemes</a> › {state_crumb}{s["short"]}</p>
      <article>
        <div class="eyebrow">{s["icon"]} {s["cat_label"]}</div>
        <h1>{s["name"]}</h1>
        <p class="lede">{lede}</p>
        <div class="meta"><span>Last updated: {UPDATED}</span><span>{STATES[st(s)]["label"]} scheme</span></div>{lang_switch}

        <div class="facts">
{facts_html}
        </div>
{body}
        <h2>Frequently asked questions</h2>
{faq_html}

        <h2>Sources</h2>
        <ul class="sources">
{src_html}
        </ul>
        <div class="note">This guide is for general information only. Scheme rules, amounts and dates can change. Always check the official portal before applying. Kramavriddhi is not affiliated with the Government of India.</div>
      </article>
    </div>
''' + FOOTER)

# ---------------------------------------------------------------- PM-KISAN
s = SCHEMES[0]
write(f"schemes/{s['slug']}/index.html", article(s,
    lede="PM-KISAN gives ₹6,000 every year to land-holding farmer families across India. The money comes in three instalments of ₹2,000, sent directly to the farmer's Aadhaar-linked bank account.",
    description="PM-KISAN explained: ₹6,000 a year for farmers. Eligibility, who is excluded, eKYC, documents, how to register and check status, latest instalment.",
    facts=[("Benefit", "₹6,000 / year"), ("Paid as", "3 × ₹2,000"), ("Who", "Land-holding farmer families"), ("Latest instalment", "23rd, 20 June 2026")],
    body='''
        <h2>What is PM-KISAN?</h2>
        <p>Pradhan Mantri Kisan Samman Nidhi (PM-KISAN) is a Central Government scheme that gives income support to farmers. It started in February 2019 and is fully funded by the Government of India. The money is paid through Direct Benefit Transfer (DBT), so it reaches the farmer's bank account without any middleman.</p>
        <p>For the scheme, a <strong>farmer family</strong> means husband, wife and minor children who own cultivable land as per state land records.</p>

        <h2>Latest update</h2>
        <p>The <strong>23rd instalment</strong> was released on <strong>20 June 2026</strong>. Instalments usually come about every four months, so the 24th instalment is expected around October–November 2026. The government has not announced an official date yet. We will update this page when it does.</p>
        <p>On <strong>31 July 2026</strong>, the Union Cabinet approved <strong>continuing PM-KISAN from 2026-27 to 2030-31</strong> with an outlay of ₹3.15 lakh crore, so the ₹6,000 a year support will continue.</p>

        <h2>Benefits</h2>
        <ul>
          <li>₹6,000 per year per eligible farmer family.</li>
          <li>Paid in three equal instalments of ₹2,000, roughly every four months.</li>
          <li>Sent directly to the Aadhaar-seeded bank account.</li>
        </ul>

        <h2>Who can apply?</h2>
        <p>All land-holding farmer families whose names appear in state land records, subject to the exclusions below.</p>

        <h3>Who cannot get PM-KISAN?</h3>
        <p>Families where any member falls into one of these groups are not eligible:</p>
        <ul>
          <li>Institutional land holders.</li>
          <li>People who hold or held constitutional posts.</li>
          <li>Former and present Ministers, MPs, MLAs, MLCs, Mayors of municipal corporations and Chairpersons of District Panchayats.</li>
          <li>Serving or retired officers and employees of Central or State Government, PSUs, and regular employees of local bodies (Multi Tasking Staff, Class IV and Group D employees are <em>not</em> excluded).</li>
          <li>Retired pensioners with a monthly pension of ₹10,000 or more (except Multi Tasking Staff, Class IV and Group D).</li>
          <li>Anyone who paid income tax in the last assessment year.</li>
          <li>Registered professionals practising as doctors, engineers, lawyers, chartered accountants or architects.</li>
        </ul>

        <h2>Three things you must complete</h2>
        <ol>
          <li><strong>eKYC</strong> is mandatory. You can do it by OTP on the PM-KISAN portal, by fingerprint at a Common Service Centre (CSC), or by face authentication in the official PM-KISAN mobile app.</li>
          <li><strong>Aadhaar-seeded bank account.</strong> Your bank account must be linked to Aadhaar and enabled for DBT.</li>
          <li><strong>Land seeding.</strong> Your land details must be verified and linked by the state.</li>
        </ol>
        <div class="note">If any of these is pending, your instalment can be stopped. Check your status before each instalment.</div>

        <h2>Documents needed</h2>
        <ul>
          <li>Aadhaar card</li>
          <li>Bank account details (account linked with Aadhaar)</li>
          <li>Land ownership records</li>
          <li>Mobile number (linked with Aadhaar for OTP eKYC)</li>
        </ul>

        <h2>How to apply</h2>
        <h3>Online</h3>
        <ol>
          <li>Go to the official portal <a href="https://pmkisan.gov.in" target="_blank" rel="noopener">pmkisan.gov.in</a>.</li>
          <li>Under <strong>Farmers Corner</strong>, click <strong>New Farmer Registration</strong>.</li>
          <li>Choose Rural or Urban farmer, enter your Aadhaar number and mobile number, and verify with OTP.</li>
          <li>Fill in your personal, bank and land details, and submit.</li>
          <li>Your application is verified by the state government. Once approved, you start receiving instalments.</li>
        </ol>
        <h3>Offline</h3>
        <p>Visit your nearest <strong>Common Service Centre (CSC)</strong>, or contact your local revenue officer (Patwari) or the PM-KISAN nodal officer of your state.</p>

        <h2>How to check your status</h2>
        <ol>
          <li>Open <a href="https://pmkisan.gov.in" target="_blank" rel="noopener">pmkisan.gov.in</a>.</li>
          <li>Click <strong>Know Your Status</strong>.</li>
          <li>Enter your registration number (use "Know your registration number" if you have forgotten it) and the captcha, then get your status with OTP.</li>
          <li>Check that eKYC, land seeding and Aadhaar bank seeding all show <strong>Yes</strong>.</li>
        </ol>

        <div class="official">
          <strong>Official portal:</strong> <a href="https://pmkisan.gov.in" target="_blank" rel="noopener">pmkisan.gov.in</a><br>
          <strong>PM-KISAN helpline:</strong> 155261 / 011-24300606
        </div>
''',
    faqs=[
        ("How much money do farmers get under PM-KISAN?", "₹6,000 per year per eligible farmer family, paid in three instalments of ₹2,000 each."),
        ("Is eKYC compulsory for PM-KISAN?", "Yes. eKYC is mandatory for all registered farmers. It can be done by OTP on pmkisan.gov.in, by biometrics at a CSC, or by face authentication in the PM-KISAN app."),
        ("Can a tenant farmer get PM-KISAN?", "The scheme is for land-holding farmer families whose names are in the state land records. Tenant farmers who do not own land are generally not covered."),
        ("Can both husband and wife get PM-KISAN separately?", "No. The benefit is per farmer family (husband, wife and minor children), so only one member of the family receives it."),
        ("Why did my PM-KISAN instalment stop?", "Common reasons are pending eKYC, bank account not seeded with Aadhaar, land seeding not done, or the family falling into an exclusion category. Check 'Know Your Status' on pmkisan.gov.in."),
    ],
    sources=[
        ("PM-KISAN official portal", "https://pmkisan.gov.in"),
        ("PIB: Eligibility criteria of PM-KISAN", "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2146932"),
        ("PIB: Cabinet approves continuation of PM-KISAN from 2026-27 to 2030-31", "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2292437"),
    ]))

# ---------------------------------------------------------------- PM-JAY
s = SCHEMES[1]
write(f"schemes/{s['slug']}/index.html", article(s,
    lede="Ayushman Bharat PM-JAY gives eligible families free, cashless hospital treatment worth up to ₹5 lakh every year at government and empanelled private hospitals anywhere in India. Since October 2024, every citizen aged 70 or above is also covered, whatever their income.",
    description="Ayushman Bharat PM-JAY explained: ₹5 lakh free treatment per family, eligibility, Ayushman Vay Vandana card for 70+, how to check eligibility and download the Ayushman card.",
    facts=[("Cover", "₹5 lakh / family / year"), ("Treatment", "Cashless, in hospital"), ("Age 70+", "Covered, any income"), ("Helpline", "14555")],
    body='''
        <h2>What is PM-JAY?</h2>
        <p>Ayushman Bharat Pradhan Mantri Jan Arogya Yojana (AB PM-JAY) is the Government of India's health assurance scheme, run by the National Health Authority (NHA). It pays for hospital treatment of eligible families, so they do not have to spend from their own pocket.</p>

        <h2>Benefits</h2>
        <ul>
          <li>Cover of <strong>₹5 lakh per family per year</strong> for secondary and tertiary care hospitalisation.</li>
          <li><strong>Cashless and paperless</strong> treatment at public and empanelled private hospitals.</li>
          <li>Covers up to 3 days of pre-hospitalisation and 15 days of post-hospitalisation expenses, such as diagnostics and medicines.</li>
          <li>No limit on family size, age or gender.</li>
          <li>Pre-existing diseases are covered from day one.</li>
          <li>Works across India: you can get treatment in an empanelled hospital in any state.</li>
        </ul>

        <h2>Who is eligible?</h2>
        <h3>1. Families identified from SECC 2011 data</h3>
        <p>Eligibility is based on the Socio-Economic Caste Census (SECC) 2011. In rural areas, families covered include those that meet at least one of these conditions:</p>
        <ul>
          <li>Only one room with kucha walls and kucha roof.</li>
          <li>No adult member between 16 and 59 years.</li>
          <li>No adult male member between 16 and 59 years.</li>
          <li>A disabled member and no able-bodied adult member.</li>
          <li>SC/ST households.</li>
          <li>Landless households earning mainly from manual casual labour.</li>
        </ul>
        <p>Some families are included automatically, such as households without shelter, destitute families, manual scavenger families, primitive tribal groups and legally released bonded labourers. In urban areas, eligibility is based on occupation, for example rag pickers, domestic workers, street vendors, construction workers and similar categories.</p>
        <p>Many states have extended the scheme to more families using their own lists, so check your eligibility even if you are not in SECC 2011.</p>

        <h3>2. All senior citizens aged 70 and above (Ayushman Vay Vandana card)</h3>
        <p>Since 29 October 2024, every Indian citizen aged <strong>70 years or above</strong> is eligible, <strong>irrespective of income</strong>. Age is taken from the Aadhaar card.</p>
        <ul>
          <li>Seniors aged 70+ who are <strong>not</strong> in an already-covered family get ₹5 lakh per year on a family basis (shared with a spouse who is also 70+).</li>
          <li>Seniors aged 70+ whose family is <strong>already</strong> covered under PM-JAY get an <strong>additional top-up of up to ₹5 lakh per year</strong> just for themselves, which they do not share with younger family members.</li>
          <li>Seniors already using CGHS, ECHS or Ayushman CAPF can either stay with their existing scheme or choose PM-JAY.</li>
          <li>Seniors with private health insurance or ESI can also get the card.</li>
        </ul>

        <h2>How to check eligibility and get the Ayushman card</h2>
        <h3>Online (website or app)</h3>
        <ol>
          <li>Go to <a href="https://beneficiary.nha.gov.in" target="_blank" rel="noopener">beneficiary.nha.gov.in</a> or install the official <strong>Ayushman App</strong> from the Play Store / App Store.</li>
          <li>Log in with your mobile number and OTP.</li>
          <li>Search with your state, scheme (PM-JAY) and Aadhaar number or other details. For 70+, choose the senior citizen enrolment option.</li>
          <li>If your name appears, complete <strong>Aadhaar eKYC</strong>.</li>
          <li>Once approved, download your Ayushman card.</li>
        </ol>
        <h3>Offline</h3>
        <p>Visit the <strong>Ayushman Mitra</strong> help desk at any empanelled hospital, or a Common Service Centre (CSC), with your Aadhaar card and ration card.</p>

        <h2>Documents needed</h2>
        <ul>
          <li>Aadhaar card (for eKYC; age proof for 70+)</li>
          <li>Ration card or family ID, if asked</li>
          <li>Mobile number</li>
        </ul>

        <h2>How to use it at a hospital</h2>
        <ol>
          <li>Find an empanelled hospital near you on <a href="https://hospitals.pmjay.gov.in" target="_blank" rel="noopener">hospitals.pmjay.gov.in</a>.</li>
          <li>Go to the Ayushman Mitra desk and show your Ayushman card or Aadhaar.</li>
          <li>Your identity is verified and the treatment is approved under the scheme. You do not pay for covered treatment.</li>
        </ol>

        <div class="official">
          <strong>Official websites:</strong> <a href="https://nha.gov.in/PM-JAY" target="_blank" rel="noopener">nha.gov.in/PM-JAY</a> · <a href="https://beneficiary.nha.gov.in" target="_blank" rel="noopener">beneficiary.nha.gov.in</a><br>
          <strong>Toll-free helpline:</strong> 14555
        </div>
''',
    faqs=[
        ("How much cover does the Ayushman card give?", "₹5 lakh per family per year for hospitalisation at empanelled hospitals. Senior citizens aged 70+ in already-covered families get an extra top-up of up to ₹5 lakh for themselves."),
        ("Is there any income limit for the 70+ Ayushman Vay Vandana card?", "No. Every Indian citizen aged 70 or above is eligible irrespective of income. Age is verified from Aadhaar."),
        ("Does PM-JAY cover OPD or doctor consultations?", "PM-JAY is mainly for hospitalisation (secondary and tertiary care), including 3 days before and 15 days after admission. Regular OPD visits are generally not covered."),
        ("Can I use my Ayushman card in another state?", "Yes. PM-JAY is portable, so you can get treatment at empanelled hospitals across India."),
        ("Do I have to pay to get the Ayushman card?", "You can generate the card yourself free of cost on beneficiary.nha.gov.in or the Ayushman App. Beware of anyone asking for money to 'approve' your card."),
    ],
    sources=[
        ("National Health Authority: About PM-JAY", "https://nha.gov.in/PM-JAY"),
        ("PIB: Cabinet approves health cover for all citizens aged 70+ (Sept 2024)", "https://www.pib.gov.in/Pressreleaseshare.aspx?PRID=2053883"),
        ("NHA: FAQs on benefits for senior citizens (PDF)", "https://nha.gov.in/img/resources/English_FAQs_related_to_the_benefits_for_senior_citizens.pdf"),
    ]))

# ---------------------------------------------------------------- SSY
s = SCHEMES[2]
write(f"schemes/{s['slug']}/index.html", article(s,
    lede="Sukanya Samriddhi Yojana is a government-backed savings account for a girl child below 10 years. It earns one of the highest interest rates among small savings schemes, and the money is tax-free, which makes it a popular way to save for a daughter's education and marriage.",
    description="Sukanya Samriddhi Yojana explained: 8.2% interest (Oct–Dec 2026), ₹250 to ₹1.5 lakh deposit, 21-year maturity, withdrawal rules, tax benefits and how to open an SSY account.",
    facts=[("Interest (Oct–Dec 2026)", "8.2% a year"), ("Deposit", "₹250 – ₹1.5 lakh / year"), ("Girl's age", "Below 10 years"), ("Matures in", "21 years")],
    body='''
        <h2>What is Sukanya Samriddhi Yojana?</h2>
        <p>Sukanya Samriddhi Yojana (SSY) is a small savings scheme of the Government of India, launched in January 2015 under the <em>Beti Bachao Beti Padhao</em> campaign. Parents or legal guardians open the account in the girl's name and deposit money every year. The government sets the interest rate every quarter.</p>

        <h2>Current interest rate</h2>
        <p>For the quarter <strong>October–December 2026</strong>, SSY earns <strong>8.2% per year</strong>, compounded yearly. The rate has stayed at 8.2% since January 2024. It is reviewed every quarter by the Ministry of Finance.</p>

        <h2>Key rules at a glance</h2>
        <div class="table-wrap">
        <table class="simple">
          <tr><th>Rule</th><th>Details</th></tr>
          <tr><td>Who can open</td><td>Parent or legal guardian, for a girl child below 10 years of age</td></tr>
          <tr><td>Number of accounts</td><td>One account per girl; maximum two per family (more allowed in case of twins or triplets)</td></tr>
          <tr><td>Minimum deposit</td><td>₹250 per financial year</td></tr>
          <tr><td>Maximum deposit</td><td>₹1,50,000 per financial year</td></tr>
          <tr><td>Deposit period</td><td>15 years from the date of opening</td></tr>
          <tr><td>Maturity</td><td>21 years from the date of opening</td></tr>
          <tr><td>Where to open</td><td>Any post office or authorised bank</td></tr>
        </table>
        </div>

        <h2>How much can you save? (example)</h2>
        <p>If the interest rate stayed at 8.2% for the whole period, yearly deposits at the start of each year for 15 years would grow roughly like this by maturity (21 years). Try your own amount in our <a href="/tools/sukanya-samriddhi-calculator/">Sukanya Samriddhi calculator</a>.</p>
        <div class="table-wrap">
        <table class="simple">
          <tr><th>Yearly deposit</th><th>Total you deposit</th><th>Approx. maturity amount</th></tr>
          <tr><td>₹12,000 (₹1,000/month)</td><td>₹1.8 lakh</td><td>about ₹5.7 lakh</td></tr>
          <tr><td>₹60,000 (₹5,000/month)</td><td>₹9 lakh</td><td>about ₹28.7 lakh</td></tr>
          <tr><td>₹1,50,000 (maximum)</td><td>₹22.5 lakh</td><td>about ₹71.8 lakh</td></tr>
        </table>
        </div>
        <p class="muted" style="font-size:0.9rem">This is only an illustration. The real amount depends on future interest rates, which change every quarter, and on when you deposit.</p>

        <a class="cta" href="/tools/sukanya-samriddhi-calculator/"><span>🧮</span><div><strong>Sukanya Samriddhi Calculator</strong><br><span class="muted" style="font-size:0.9rem">Try your own yearly amount and see the year-by-year growth.</span></div></a>

        <h2>Withdrawal and closure</h2>
        <ul>
          <li><strong>For education:</strong> up to 50% of the balance (as at the end of the previous financial year) can be withdrawn once the girl turns 18 or passes Class 10, whichever is earlier. It can be taken in one go or yearly, for up to five years.</li>
          <li><strong>For marriage:</strong> the account can be closed early for the girl's marriage after she turns 18, with an application made within one month before or three months after the marriage.</li>
          <li><strong>Other early closure:</strong> allowed on the death of the account holder, or on compassionate grounds (such as a life-threatening illness of the girl or death of the guardian), but only after 5 years from opening.</li>
          <li><strong>Maturity:</strong> the account matures 21 years after it was opened.</li>
        </ul>

        <h2>What if you miss a deposit?</h2>
        <p>If the minimum ₹250 is not deposited in a financial year, the account goes into <strong>default</strong>. You can revive it within the 15-year deposit period by paying the minimum deposit for each missed year plus a penalty of <strong>₹50 per year</strong> of default.</p>

        <h2>Tax benefits</h2>
        <p>SSY has "exempt-exempt-exempt" status: deposits qualify for tax deduction up to ₹1.5 lakh a year under the old tax regime (the deduction commonly known as Section 80C), and both the interest and the maturity amount are tax-free. The deduction is not available under the new tax regime. Tax laws change, so check with a tax adviser for your situation.</p>

        <h2>Documents needed</h2>
        <ul>
          <li>SSY account opening form (available at the post office or bank)</li>
          <li>Birth certificate of the girl child</li>
          <li>Identity and address proof of the parent or guardian (for example Aadhaar and PAN)</li>
          <li>Passport-size photographs</li>
          <li>First deposit (minimum ₹250)</li>
        </ul>

        <h2>How to open an account</h2>
        <ol>
          <li>Visit your nearest post office or an authorised bank branch.</li>
          <li>Fill in the SSY account opening form.</li>
          <li>Submit it with the documents listed above and make the first deposit.</li>
          <li>You get a passbook. Some banks and India Post (IPPB) also let you deposit online later.</li>
        </ol>

        <div class="official">
          <strong>Official information:</strong> <a href="https://www.indiapost.gov.in" target="_blank" rel="noopener">indiapost.gov.in</a> · <a href="https://www.nsiindia.gov.in" target="_blank" rel="noopener">nsiindia.gov.in</a> (National Savings Institute)
        </div>
''',
    faqs=[
        ("What is the Sukanya Samriddhi interest rate now?", "8.2% per year for October–December 2026. The government reviews it every quarter."),
        ("What is the maximum age to open an SSY account?", "The girl must be below 10 years of age when the account is opened."),
        ("How long do I need to deposit money in SSY?", "Deposits are made for 15 years from opening. The account then keeps earning interest until it matures at 21 years."),
        ("Can I withdraw money from SSY before maturity?", "Yes, up to 50% of the balance for the girl's education after she turns 18 or passes Class 10. Early closure is also allowed for her marriage after 18 and in some special cases."),
        ("Is Sukanya Samriddhi interest taxable?", "No. The interest and maturity amount are tax-free. Deposits also get a deduction up to ₹1.5 lakh a year under the old tax regime."),
    ],
    sources=[
        ("India Post: Sukanya Samriddhi Account Scheme, 2019 (Gazette notification, PDF)", "https://www.indiapost.gov.in/documents/offerings/schemesandservices/posb/SukanyaSamriddhiAccountScheme2019English.pdf"),
        ("National Savings Institute: Sukanya Samriddhi Account Scheme, 2019", "https://www.nsiindia.gov.in/InternalPage.aspx?Id_Pk=171"),
        ("PIB: Empowering India's girls through Sukanya Samriddhi Yojana", "https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2216748"),
    ]))

# ---------------------------------------------------------------- batch 2 (added 6 Oct 2026)
BY_SLUG = {x["slug"]: x for x in SCHEMES}

# ---- PMAY-Urban 2.0
s = BY_SLUG["pm-awas-yojana-urban"]
write(f"schemes/{s['slug']}/index.html", article(s,
    lede="Pradhan Mantri Awas Yojana – Urban 2.0 helps poor and middle-class families in towns and cities to build, buy or rent a pucca house. Depending on your income and situation, you can get ₹2.5 lakh in assistance or a home-loan interest subsidy of up to ₹1.8 lakh.",
    description="PM Awas Yojana Urban 2.0 explained: EWS, LIG and MIG income limits, ₹2.5 lakh assistance, home-loan interest subsidy up to ₹1.8 lakh, how to apply on pmaymis.gov.in.",
    facts=[("Assistance", "₹2.5 lakh / house"), ("Loan subsidy", "Up to ₹1.8 lakh"), ("Income limit", "Up to ₹9 lakh / year"), ("Target", "1 crore families")],
    body='''
        <h2>What is PMAY-Urban 2.0?</h2>
        <p>PMAY-U 2.0 is the second phase of the Government of India's urban housing mission, approved by the Union Cabinet on 9 August 2024. It aims to help <strong>1 crore urban poor and middle-class families</strong> over five years to construct, purchase or rent a house at an affordable cost. It is run by the Ministry of Housing and Urban Affairs together with states, union territories and lending institutions.</p>

        <h2>Who is eligible?</h2>
        <p>Families from the EWS, LIG or MIG groups who <strong>do not own a pucca house anywhere in India</strong>.</p>
        <div class="table-wrap">
        <table class="simple">
          <tr><th>Group</th><th>Annual family income</th></tr>
          <tr><td>EWS (Economically Weaker Section)</td><td>Up to ₹3 lakh</td></tr>
          <tr><td>LIG (Low Income Group)</td><td>₹3 lakh to ₹6 lakh</td></tr>
          <tr><td>MIG (Middle Income Group)</td><td>₹6 lakh to ₹9 lakh</td></tr>
        </table>
        </div>
        <p>The scheme covers all statutory towns as per Census 2011 and towns notified later, including notified planning and development areas. Special focus is given to slum dwellers, SC/ST families, minorities, widows, persons with disabilities, safai karmis, street vendors under PM SVANidhi and artisans under PM Vishwakarma.</p>

        <h2>The four ways to benefit (verticals)</h2>
        <h3>1. Beneficiary-Led Construction (BLC)</h3>
        <p>For <strong>EWS</strong> families who own a vacant plot: financial help to build a new house on their own land. States/UTs may give land rights (pattas) to landless beneficiaries.</p>
        <h3>2. Affordable Housing in Partnership (AHP)</h3>
        <p>For <strong>EWS</strong> families: help to own a house in projects built by states, cities or public/private agencies. If you buy from an approved private project, you get a <strong>Redeemable Housing Voucher</strong>.</p>
        <h3>3. Affordable Rental Housing (ARH)</h3>
        <p>Rental homes for working women, industrial workers, urban migrants, the homeless, students and others who need a place to stay for a short time or cannot afford to buy.</p>
        <h3>4. Interest Subsidy Scheme (ISS)</h3>
        <p>For <strong>EWS, LIG and MIG</strong> families taking a home loan:</p>
        <ul>
          <li>Loan up to <strong>₹25 lakh</strong> for a house worth up to <strong>₹35 lakh</strong>.</li>
          <li><strong>4% interest subsidy</strong> on the first ₹8 lakh of the loan, for up to 12 years.</li>
          <li>Maximum subsidy of <strong>₹1.80 lakh</strong>, released in 5 yearly instalments.</li>
        </ul>

        <h2>How much assistance?</h2>
        <p>Under BLC and AHP, the total government assistance is <strong>₹2.5 lakh per house</strong>, shared between the Centre and the state:</p>
        <div class="table-wrap">
        <table class="simple">
          <tr><th>Where you live</th><th>Centre</th><th>State (minimum)</th></tr>
          <tr><td>North-Eastern states, Himachal Pradesh, Uttarakhand, J&amp;K, Puducherry, Delhi</td><td>₹2.25 lakh</td><td>₹0.25 lakh</td></tr>
          <tr><td>UTs without legislature</td><td>₹2.5 lakh</td><td>—</td></tr>
          <tr><td>All other states</td><td>₹1.5 lakh</td><td>₹1 lakh</td></tr>
        </table>
        </div>
        <p>Some states add extra money on top of this. Check with your city's urban local body.</p>

        <h2>Documents usually needed</h2>
        <ul>
          <li>Aadhaar card of all family members</li>
          <li>Income certificate or income proof</li>
          <li>Bank account details (linked with Aadhaar)</li>
          <li>Caste / category certificate, if applicable</li>
          <li>Land documents (for BLC)</li>
          <li>Home loan sanction details (for ISS)</li>
        </ul>

        <h2>How to apply</h2>
        <ol>
          <li>Go to the official portal <a href="https://pmaymis.gov.in" target="_blank" rel="noopener">pmaymis.gov.in</a>.</li>
          <li>Choose the option to apply for <strong>PMAY-U 2.0</strong> and check your eligibility.</li>
          <li>Verify yourself with Aadhaar and fill in the form with your income, family and address details.</li>
          <li>Choose the vertical that fits you (BLC, AHP, ARH or ISS) and submit.</li>
          <li>Your application is verified by your urban local body / state. For ISS, apply for the home loan through a participating bank or housing finance company.</li>
        </ol>
        <p>You can also get help at your municipal office or a Common Service Centre (CSC).</p>
        <div class="note">Applying is free. Do not pay anyone who promises to "get your PMAY house sanctioned."</div>

        <div class="official">
          <strong>Official portals:</strong> <a href="https://pmaymis.gov.in" target="_blank" rel="noopener">pmaymis.gov.in</a> · <a href="https://pmay-urban.gov.in" target="_blank" rel="noopener">pmay-urban.gov.in</a>
        </div>
''',
    faqs=[
        ("What is the income limit for PMAY-Urban 2.0?", "Annual family income up to ₹9 lakh: EWS up to ₹3 lakh, LIG ₹3–6 lakh and MIG ₹6–9 lakh."),
        ("How much money do I get under PMAY-U 2.0?", "₹2.5 lakh per house under BLC and AHP (shared by Centre and state), or a home-loan interest subsidy of up to ₹1.80 lakh under ISS."),
        ("Can I get PMAY-U 2.0 if I already own a house?", "No. The family must not own a pucca house anywhere in India."),
        ("Who can get the home loan interest subsidy?", "EWS, LIG and MIG families taking a loan up to ₹25 lakh for a house worth up to ₹35 lakh. The subsidy is 4% on the first ₹8 lakh, up to ₹1.80 lakh."),
        ("Where do I apply for PMAY-Urban 2.0?", "Online at pmaymis.gov.in, or through your urban local body (municipality) or a CSC."),
    ],
    sources=[
        ("PIB: Cabinet approves PMAY-Urban 2.0 (9 Aug 2024)", "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2043927"),
        ("PMAY-U 2.0 official portal", "https://pmaymis.gov.in"),
    ]))

# ---- PMAY-Gramin
s = BY_SLUG["pm-awas-yojana-gramin"]
write(f"schemes/{s['slug']}/index.html", article(s,
    lede="Pradhan Mantri Awaas Yojana – Gramin helps families in villages who live in kutcha or broken houses to build a pucca house with basic amenities. The government gives ₹1.20 lakh in plain areas and ₹1.30 lakh in hilly and North-Eastern areas, plus wage and toilet support.",
    description="PM Awas Yojana Gramin explained: ₹1.2 lakh / ₹1.3 lakh assistance, MGNREGA and toilet support, eligibility, 10 exclusion criteria, Awaas+ 2024 survey and how to apply.",
    facts=[("Plain areas", "₹1.20 lakh"), ("Hilly / NE areas", "₹1.30 lakh"), ("Toilet support", "₹12,000"), ("New target", "2 crore houses by 2029")],
    body='''
        <h2>What is PMAY-Gramin?</h2>
        <p>PMAY-G is the Government of India's rural housing scheme, run by the Ministry of Rural Development since 1 April 2016. In August 2024 the Union Cabinet extended it for five more years (2024-25 to 2028-29) to build <strong>2 crore more houses</strong> in rural areas.</p>

        <h2>Benefits</h2>
        <ul>
          <li><strong>₹1.20 lakh</strong> per house in plain areas.</li>
          <li><strong>₹1.30 lakh</strong> per house in North-Eastern states and hilly states/UTs (including J&amp;K and Ladakh).</li>
          <li><strong>90 or 95 days of unskilled wages</strong> under MGNREGS for building your own house.</li>
          <li><strong>₹12,000 for a toilet</strong> through Swachh Bharat Mission – Gramin, MGNREGS or other sources.</li>
          <li>The money is paid directly into the beneficiary's bank account in instalments as construction progresses.</li>
        </ul>

        <h2>Who is eligible?</h2>
        <p>Families in rural areas who are <strong>homeless</strong> or live in a <strong>kutcha house with up to 2 rooms</strong>, and whose names are on the verified Permanent Waiting List (from SECC 2011 data) or the Awaas+ list. The list is approved by the Gram Sabha.</p>

        <h3>Who is excluded? (new rules for 2024-29)</h3>
        <p>First, all households with a pucca roof and/or pucca wall, or a house with more than 2 rooms, are filtered out. Then a household is automatically excluded if it meets <strong>any one</strong> of these 10 conditions:</p>
        <ol>
          <li>Owns a motorised three-wheeler or four-wheeler.</li>
          <li>Owns mechanised three/four-wheeler agricultural equipment.</li>
          <li>Has a Kisan Credit Card with a limit of ₹50,000 or more.</li>
          <li>Any member is a government employee.</li>
          <li>Has a non-agricultural enterprise registered with the government.</li>
          <li>Any family member earns more than ₹15,000 per month.</li>
          <li>Pays income tax.</li>
          <li>Pays professional tax.</li>
          <li>Owns 2.5 acres or more of irrigated land.</li>
          <li>Owns 5 acres or more of unirrigated land.</li>
        </ol>
        <p>Compared with earlier rules, owning a motorised two-wheeler, a mechanised fishing boat, a landline phone or a refrigerator no longer excludes you, and the income limit was raised from ₹10,000 to ₹15,000 per month.</p>

        <h2>How to apply</h2>
        <ol>
          <li>Eligible families are identified through surveys, not by an open online form. For the 2024-29 phase, the survey is done through the <strong>Awaas+ 2024</strong> mobile app, which also has a <strong>self-survey</strong> option.</li>
          <li>Contact your <strong>Gram Panchayat</strong> or Block Development Office to make sure your family is surveyed.</li>
          <li>The list is checked and approved in the <strong>Gram Sabha</strong>.</li>
          <li>Once sanctioned, instalments are paid into your bank account as you build. Each stage is geo-tagged with photos.</li>
        </ol>

        <h2>Documents usually needed</h2>
        <ul>
          <li>Aadhaar card</li>
          <li>Bank account details (linked with Aadhaar)</li>
          <li>MGNREGA job card</li>
          <li>Swachh Bharat Mission (SBM) number, if any</li>
          <li>Mobile number</li>
        </ul>

        <h2>Check your status</h2>
        <p>On <a href="https://pmayg.nic.in" target="_blank" rel="noopener">pmayg.nic.in</a> you can search beneficiary details and track your house using your registration number.</p>

        <div class="note">Selection and money transfer are free. Never pay anyone to "add your name" to the list. Report such requests to your Block office.</div>

        <div class="official">
          <strong>Official portal:</strong> <a href="https://pmayg.nic.in" target="_blank" rel="noopener">pmayg.nic.in</a> (Ministry of Rural Development)
        </div>
''',
    faqs=[
        ("How much money is given under PM Awas Yojana Gramin?", "₹1.20 lakh in plain areas and ₹1.30 lakh in North-Eastern and hilly states/UTs, plus 90/95 days of MGNREGS wages and ₹12,000 for a toilet."),
        ("Can I apply for PMAY-G online?", "Beneficiaries are selected through surveys (now the Awaas+ 2024 app, which has a self-survey option) and Gram Sabha approval. Contact your Gram Panchayat to be included."),
        ("Does owning a bike make me ineligible for PMAY-G?", "No. Under the 2024-29 rules, owning a motorised two-wheeler is no longer an exclusion. A motorised three- or four-wheeler still excludes you."),
        ("What is the income limit for PMAY-G?", "A household is excluded if any member earns more than ₹15,000 per month, or pays income tax or professional tax."),
        ("Till when will PMAY-G run?", "The Cabinet approved the scheme for FY 2024-25 to 2028-29 to build 2 crore additional rural houses."),
    ],
    sources=[
        ("PIB: Automatic exclusion criteria for PMAY-G (3 Dec 2024)", "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2080091"),
        ("PIB: Expansion of PMAY-Gramin (21 Mar 2025)", "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2113748"),
        ("PMAY-G official portal", "https://pmayg.nic.in"),
    ]))

# ---- PM Mudra
s = BY_SLUG["pm-mudra-yojana"]
write(f"schemes/{s['slug']}/index.html", article(s,
    lede="Pradhan Mantri Mudra Yojana gives small business owners collateral-free loans of up to ₹20 lakh through banks, NBFCs and microfinance institutions. It is meant for non-farm micro enterprises: shops, services, small manufacturing, transport and allied farm activities like dairy or poultry.",
    description="PM Mudra Yojana explained: Shishu, Kishor, Tarun and Tarun Plus loans up to ₹20 lakh without collateral, who can apply, documents and how to apply.",
    facts=[("Max loan", "₹20 lakh"), ("Collateral", "Not required"), ("Categories", "4 (Shishu to Tarun Plus)"), ("Launched", "8 April 2015")],
    body='''
        <h2>What is PM Mudra Yojana?</h2>
        <p>PMMY was launched on 8 April 2015 with the aim of "funding the unfunded": giving bank credit to small entrepreneurs who often lack collateral or formal records. MUDRA (Micro Units Development and Refinance Agency Ltd.) does not lend directly. It supports the banks and institutions that give the loans. As of March 2026, more than 57 crore loans worth over ₹40 lakh crore have been given, and about 60% of loan accounts belong to women.</p>

        <h2>Loan categories</h2>
        <div class="table-wrap">
        <table class="simple">
          <tr><th>Category</th><th>Loan amount</th><th>Meant for</th></tr>
          <tr><td><strong>Shishu</strong></td><td>Up to ₹50,000</td><td>Starting a new or very small business</td></tr>
          <tr><td><strong>Kishor</strong></td><td>₹50,000 – ₹5 lakh</td><td>New or running businesses needing working capital or modest expansion</td></tr>
          <tr><td><strong>Tarun</strong></td><td>₹5 lakh – ₹10 lakh</td><td>Growing businesses buying equipment or scaling up</td></tr>
          <tr><td><strong>Tarun Plus</strong></td><td>₹10 lakh – ₹20 lakh</td><td>Borrowers who have taken and fully repaid a Tarun loan</td></tr>
        </table>
        </div>

        <h2>What can the loan be used for?</h2>
        <ul>
          <li>Business loans for vendors, traders, shopkeepers and service activities.</li>
          <li>Working capital, including through a <strong>MUDRA card</strong>.</li>
          <li>Buying machinery and equipment for micro units.</li>
          <li>Commercial transport vehicles such as auto-rickshaws, e-rickshaws and small goods vehicles.</li>
          <li>Allied agriculture activities like dairy, poultry, fishery, bee-keeping, livestock rearing and food processing.</li>
        </ul>
        <p>Crop loans and personal loans are <strong>not</strong> covered under Mudra.</p>

        <h2>Who can apply?</h2>
        <p>Any Indian citizen with a business plan for an income-generating, non-farm activity in manufacturing, trading, services or allied agriculture, including individuals, proprietorships and partnerships. It is meant for non-corporate micro and small enterprises, and lenders will check that you are not a defaulter on earlier loans.</p>

        <h2>Interest rate and charges</h2>
        <p>There is no fixed Mudra interest rate. Each lender sets its own rate as per RBI guidelines, based on the loan amount and your profile. Compare offers from 2–3 banks before applying.</p>

        <h2>Documents usually needed</h2>
        <ul>
          <li>Identity proof (Aadhaar, PAN, voter ID)</li>
          <li>Address proof</li>
          <li>Passport-size photographs</li>
          <li>Proof of business (Udyam registration, shop licence, GST, if any)</li>
          <li>Quotation for machinery or items to be purchased</li>
          <li>Bank statements, and a simple project report or business plan for larger loans</li>
          <li>Caste certificate, if applicable</li>
        </ul>

        <h2>How to apply</h2>
        <ol>
          <li>Prepare a short business plan: what you will do, how much you need and how you will repay.</li>
          <li>Visit a bank, Regional Rural Bank, Small Finance Bank, NBFC or MFI branch, or apply online on the <a href="https://www.jansamarth.in" target="_blank" rel="noopener">JanSamarth portal</a> or your bank's website.</li>
          <li>Fill in the Mudra loan application for the right category (Shishu, Kishor, Tarun or Tarun Plus).</li>
          <li>Submit your documents. The lender checks your plan and sanctions the loan.</li>
        </ol>
        <div class="note">MUDRA does not use agents. Beware of anyone charging a fee to "approve" a Mudra loan. Apply only directly with a bank or official portal.</div>

        <div class="official">
          <strong>Official information:</strong> <a href="https://www.mudra.org.in" target="_blank" rel="noopener">mudra.org.in</a> · <a href="https://www.jansamarth.in" target="_blank" rel="noopener">jansamarth.in</a>
        </div>
''',
    faqs=[
        ("What is the maximum Mudra loan amount?", "₹20 lakh under the Tarun Plus category, available to borrowers who have successfully repaid an earlier Tarun loan. For others the limit is ₹10 lakh."),
        ("Is collateral needed for a Mudra loan?", "No. Mudra loans up to ₹20 lakh are collateral-free."),
        ("Can I get a Mudra loan to start a new business?", "Yes. The Shishu (up to ₹50,000) and Kishor (up to ₹5 lakh) categories support new businesses, including people with no credit history."),
        ("What is the interest rate on Mudra loans?", "There is no fixed rate. Each bank or lender decides it as per RBI guidelines."),
        ("Can farmers get a Mudra loan?", "Not for crop loans. But allied activities such as dairy, poultry, fishery and bee-keeping are covered."),
    ],
    sources=[
        ("PIB: 11 Years of Pradhan Mantri MUDRA Yojana (8 Apr 2026)", "https://www.pib.gov.in/PressNoteDetails.aspx?NoteId=158056&ModuleId=3"),
        ("PIB: Mudra loan limit raised to ₹20 lakh", "https://www.pib.gov.in/PressReleaseIframePage.aspx?PRID=2068019"),
        ("Department of Financial Services: PMMY", "https://www.financialservices.gov.in/pradhan-mantri-mudra-yojana-pmmy"),
    ]))

# ---- Atal Pension Yojana
APY_ROWS = [  # entry age: monthly contribution for 1000, 2000, 3000, 4000, 5000
    (18, 42, 84, 126, 168, 210), (20, 50, 100, 150, 198, 248), (25, 76, 151, 226, 301, 376),
    (30, 116, 231, 347, 462, 577), (35, 181, 362, 543, 722, 902), (40, 291, 582, 873, 1164, 1454),
]
apy_table = "\n".join(
    f"          <tr><td>{a} years</td>" + "".join(f"<td>₹{v:,}</td>" for v in vals) + "</tr>"
    for a, *vals in APY_ROWS)
s = BY_SLUG["atal-pension-yojana"]
write(f"schemes/{s['slug']}/index.html", article(s,
    lede="Atal Pension Yojana gives you a government-guaranteed pension of ₹1,000 to ₹5,000 every month after age 60. You join between 18 and 40, pay a small fixed amount regularly, and after you, your spouse gets the same pension. It is meant mainly for workers in the unorganised sector.",
    description="Atal Pension Yojana explained: ₹1,000–₹5,000 monthly pension after 60, contribution chart by age, who can join, spouse and nominee benefits, exit rules and how to open an APY account.",
    facts=[("Pension", "₹1,000 – ₹5,000 / month"), ("Join at age", "18 – 40"), ("Pension starts", "Age 60"), ("Guarantee", "Central Government")],
    body=f'''
        <h2>What is Atal Pension Yojana?</h2>
        <p>Atal Pension Yojana (APY) is a pension scheme of the Government of India, started on 1 June 2015 and run by the Pension Fund Regulatory and Development Authority (PFRDA). You choose the monthly pension you want after 60, and pay a fixed contribution from your savings account until you turn 60.</p>

        <h2>Triple benefit</h2>
        <ol>
          <li><strong>Your pension:</strong> a guaranteed minimum pension of ₹1,000, ₹2,000, ₹3,000, ₹4,000 or ₹5,000 per month from age 60 for life.</li>
          <li><strong>Spouse pension:</strong> after your death, your spouse gets the same pension for life.</li>
          <li><strong>Money to nominee:</strong> after both of you, your nominee gets the pension wealth built up till age 60 – about ₹1.7 lakh to ₹8.5 lakh depending on the pension you chose.</li>
        </ol>

        <h2>Who can join?</h2>
        <ul>
          <li>Any Indian citizen aged <strong>18 to 40 years</strong>.</li>
          <li>Must have a <strong>savings account</strong> in a bank or post office.</li>
          <li>From <strong>1 October 2022</strong>, anyone who is or has been an <strong>income-tax payer</strong> cannot join. People who joined before that date can continue.</li>
        </ul>

        <h2>How much do you need to pay?</h2>
        <p>The earlier you join, the less you pay. Monthly contributions for some ages (from the official APY chart). For your exact age, use our <a href="/tools/atal-pension-calculator/">Atal Pension calculator</a>.</p>
        <div class="table-wrap">
        <table class="simple">
          <tr><th>Age when joining</th><th>₹1,000 pension</th><th>₹2,000</th><th>₹3,000</th><th>₹4,000</th><th>₹5,000</th></tr>
{apy_table}
          <tr><td><em>Amount to nominee</em></td><td>₹1.7 lakh</td><td>₹3.4 lakh</td><td>₹5.1 lakh</td><td>₹6.8 lakh</td><td>₹8.5 lakh</td></tr>
        </table>
        </div>
        <p>You can also pay quarterly or half-yearly. The full chart for every age from 18 to 40 is in the official scheme document linked below.</p>

        <a class="cta" href="/tools/atal-pension-calculator/"><span>🧮</span><div><strong>Atal Pension Calculator</strong><br><span class="muted" style="font-size:0.9rem">Enter your age and see your exact monthly, quarterly or half-yearly amount.</span></div></a>

        <h2>How payment works</h2>
        <ul>
          <li>Contributions are taken by <strong>auto-debit</strong> from your savings account (monthly, quarterly or half-yearly).</li>
          <li>Keep enough balance on the due date. If a payment is late, the bank collects a small overdue charge of ₹1 for every ₹100 per month, which is added to your own pension account.</li>
          <li>You can increase or decrease your pension amount once a year.</li>
        </ul>

        <h2>Exit before 60</h2>
        <ul>
          <li><strong>Death of subscriber:</strong> the spouse can continue paying until the subscriber would have turned 60 and then get the same pension, or close the account and take the money.</li>
          <li><strong>Serious illness:</strong> the money built up can be taken out early.</li>
          <li><strong>Voluntary exit:</strong> allowed, but you get back only your own contributions plus the net interest earned on them. Any government co-contribution is not returned.</li>
        </ul>

        <h2>Documents needed</h2>
        <ul>
          <li>Savings bank or post office account</li>
          <li>Aadhaar card (recommended for KYC)</li>
          <li>Mobile number</li>
          <li>Nominee and spouse details</li>
        </ul>

        <h2>How to join</h2>
        <h3>At your bank or post office</h3>
        <ol>
          <li>Visit the branch where you have a savings account.</li>
          <li>Fill in the APY registration form, choose your pension amount and give your nominee details.</li>
          <li>Submit it with your Aadhaar and mobile number. The first contribution is debited and you receive a confirmation (PRAN).</li>
        </ol>
        <h3>Online</h3>
        <p>Many banks let you open APY through net banking or their mobile app. You can also use the eAPY facility listed on the PFRDA / NSDL websites.</p>

        <div class="official">
          <strong>Official information:</strong> <a href="https://pfrda.org.in/schemes/atal-pension-yojana-apy" target="_blank" rel="noopener">PFRDA – Atal Pension Yojana</a> · <a href="https://jansuraksha.gov.in" target="_blank" rel="noopener">jansuraksha.gov.in</a>
        </div>
''',
    faqs=[
        ("What is the age limit for Atal Pension Yojana?", "You can join between 18 and 40 years of age. The pension starts at 60."),
        ("Can income-tax payers join APY?", "No. From 1 October 2022, anyone who is or has been an income-tax payer cannot open a new APY account. Those who joined earlier can continue."),
        ("How much should I pay for a ₹5,000 pension?", "It depends on your age when you join: ₹210 a month at 18, ₹376 at 25, ₹577 at 30, ₹902 at 35 and ₹1,454 at 40. Use our APY calculator at kramavriddhi.com/tools/atal-pension-calculator/ for your exact age."),
        ("What happens to APY if the subscriber dies?", "The spouse gets the same pension for life. If death happens before 60, the spouse can continue the account or take the money. After both, the nominee gets the accumulated amount."),
        ("Can I close my APY account early?", "Yes, but on voluntary exit you get only your own contributions plus net interest, not any government co-contribution."),
    ],
    sources=[
        ("Atal Pension Yojana – Details of the Scheme, with contribution chart (PDF)", "https://jansuraksha.gov.in/Files/APY/ENGLISH/APY.pdf"),
        ("PFRDA: Atal Pension Yojana", "https://pfrda.org.in/schemes/atal-pension-yojana-apy"),
    ]))

# ---------------------------------------------------------------- batch 3 (added 6 Oct 2026)

# ---- PM Jan Dhan Yojana
s = BY_SLUG["pm-jan-dhan-yojana"]
write(f"schemes/{s['slug']}/index.html", article(s,
    lede="Pradhan Mantri Jan Dhan Yojana lets anyone without a bank account open a zero-balance savings account, with a free RuPay debit card, free accident insurance of up to ₹2 lakh and an overdraft of up to ₹10,000. It is the starting point for receiving government benefits directly in your account.",
    description="PM Jan Dhan Yojana explained: zero-balance account, RuPay card with ₹2 lakh accident insurance, ₹10,000 overdraft, who can open, documents and how to open a Jan Dhan account.",
    facts=[("Minimum balance", "Zero"), ("Accident cover", "Up to ₹2 lakh"), ("Overdraft", "Up to ₹10,000"), ("Accounts opened", "59 crore+")],
    body='''
        <h2>What is PM Jan Dhan Yojana?</h2>
        <p>PMJDY is India's national mission for financial inclusion, launched in August 2014. It gives every unbanked adult a basic savings bank account, along with access to credit, insurance, pension and remittances. As of 19 August 2026, more than <strong>59 crore</strong> Jan Dhan accounts have been opened, about 33 crore of them by women.</p>

        <h2>Benefits</h2>
        <ul>
          <li><strong>Zero balance:</strong> no minimum balance is needed.</li>
          <li><strong>Interest</strong> on your savings, at the bank's normal savings rate.</li>
          <li><strong>Free RuPay debit card</strong>, accepted at all ATMs and most shops.</li>
          <li><strong>Accident insurance</strong> with the RuPay card: ₹2 lakh for accounts opened after 28 August 2018 (₹1 lakh for older accounts). You pay no premium.</li>
          <li><strong>Overdraft up to ₹10,000</strong> for one account holder per household, after 6 months of satisfactory use of the account.</li>
          <li><strong>Direct Benefit Transfer (DBT):</strong> government subsidies and payments can come straight into the account.</li>
          <li>Easy access to <a href="/schemes/atal-pension-yojana/">Atal Pension Yojana</a>, <a href="/schemes/pm-jeevan-jyoti-bima-yojana/">PM Jeevan Jyoti Bima</a>, <a href="/schemes/pm-suraksha-bima-yojana/">PM Suraksha Bima</a> and <a href="/schemes/pm-mudra-yojana/">Mudra loans</a>.</li>
        </ul>

        <a class="cta" href="/tools/"><span>🧮</span><div><strong>Plan your savings</strong><br><span class="muted" style="font-size:0.9rem">Use our free Atal Pension and Sukanya Samriddhi calculators.</span></div></a>

        <h2>Who can open a Jan Dhan account?</h2>
        <ul>
          <li>Any Indian citizen who does not already have a bank account. There is no upper age limit.</li>
          <li>One basic savings account per unbanked person. Joint accounts are allowed.</li>
        </ul>

        <h2>Documents needed</h2>
        <ul>
          <li>Aadhaar card</li>
          <li>A government ID if needed (voter ID, PAN card or ration card)</li>
          <li>Address proof (for example passport, driving licence, or an electricity, telephone or water bill)</li>
          <li>Passport-size photograph</li>
          <li>Filled and signed PMJDY account opening form</li>
        </ul>
        <div class="note">No documents at all? Banks can open a <strong>"small account"</strong> with a self-attested photo and your signature or thumb impression in front of a bank officer. It has limits on deposits and withdrawals until you complete full KYC.</div>

        <h2>How to open an account</h2>
        <ol>
          <li>Visit any bank branch, or a <strong>Business Correspondent (Bank Mitra)</strong> outlet in your village or area.</li>
          <li>Ask for the PMJDY account opening form and fill it in.</li>
          <li>Submit it with your KYC documents.</li>
          <li>After verification, your account is opened. Collect your passbook and RuPay card.</li>
        </ol>

        <h2>How to claim the accident insurance</h2>
        <p>The RuPay card accident cover applies if the cardholder has used the card (for example at an ATM, shop or online) at least once in the 90 days before the accident. The nominee should contact the bank branch where the account is held to start the claim.</p>

        <h2>Keep your account active</h2>
        <p>If you don't use your account for a long time, it may become inactive. Make at least one transaction now and then, and complete <strong>re-KYC</strong> when your bank asks for it.</p>

        <div class="official">
          <strong>Official website:</strong> <a href="https://pmjdy.gov.in" target="_blank" rel="noopener">pmjdy.gov.in</a><br>
          <strong>Toll-free:</strong> 1800 11 0001 · 1800 180 1111
        </div>
''',
    faqs=[
        ("Is a Jan Dhan account really zero balance?", "Yes. There is no minimum balance requirement in a PMJDY account."),
        ("How much accident insurance does a Jan Dhan account give?", "₹2 lakh for accounts opened after 28 August 2018, and ₹1 lakh for older accounts, through the RuPay debit card. No premium is charged."),
        ("How do I get the ₹10,000 overdraft?", "It is available to one account holder per household after 6 months of satisfactory operation of the account, subject to the bank's eligibility checks."),
        ("Can I open a Jan Dhan account if I already have a bank account?", "PMJDY is meant for people who do not have any bank account. If you already have one, you can still use other schemes through your existing account."),
        ("Can a minor open a Jan Dhan account?", "Banks allow accounts for minors above 10 years under their normal rules, and a guardian can open one for younger children. Ask your bank branch."),
    ],
    sources=[
        ("PMJDY official website: Scheme details", "https://pmjdy.gov.in/scheme"),
        ("PIB: PM Jan Dhan Yojana – Banking for All (27 Aug 2026)", "https://www.pib.gov.in/PressNoteDetails.aspx?NoteId=159721&ModuleId=3"),
    ]))

# ---- PMJJBY
s = BY_SLUG["pm-jeevan-jyoti-bima-yojana"]
write(f"schemes/{s['slug']}/index.html", article(s,
    lede="PM Jeevan Jyoti Bima Yojana is life insurance of ₹2 lakh for just ₹436 a year, which is less than ₹2 a day. If the insured person dies for any reason, the nominee gets ₹2 lakh. Anyone aged 18 to 50 with a bank or post office account can join.",
    description="PM Jeevan Jyoti Bima Yojana explained: ₹2 lakh life cover for ₹436 a year, age 18–50, pro-rata premium if you join late, 30-day waiting period, how to enrol and claim.",
    facts=[("Life cover", "₹2 lakh"), ("Premium", "₹436 / year"), ("Join at age", "18 – 50"), ("Cover period", "1 June – 31 May")],
    body='''
        <h2>What is PMJJBY?</h2>
        <p>PMJJBY is a one-year term life insurance scheme, renewable every year. It was launched on 9 May 2015 and is offered by LIC and other life insurers through banks and post offices. As of April 2026, more than 27 crore people have enrolled and over ₹21,500 crore has been paid in claims to more than 10.7 lakh families.</p>

        <h2>Benefits</h2>
        <ul>
          <li><strong>₹2 lakh</strong> paid to the nominee on the death of the insured person, <strong>due to any reason</strong>.</li>
          <li>Premium of <strong>₹436 per year</strong>, auto-debited from your account.</li>
          <li>No medical examination needed to join.</li>
        </ul>

        <h2>Who can join?</h2>
        <ul>
          <li>Anyone aged <strong>18 to 50 years</strong> with a savings account in a participating bank or post office.</li>
          <li>You can join through <strong>one account only</strong>, even if you have several.</li>
          <li>If you join before 50 and keep renewing, the cover continues until you turn <strong>55</strong>.</li>
        </ul>

        <h2>Premium if you join in the middle of the year</h2>
        <p>The cover year runs from 1 June to 31 May. If you join later in the year, you pay less:</p>
        <div class="table-wrap">
        <table class="simple">
          <tr><th>When you join</th><th>Premium</th></tr>
          <tr><td>June, July, August</td><td>₹436</td></tr>
          <tr><td>September, October, November</td><td>₹342</td></tr>
          <tr><td>December, January, February</td><td>₹228</td></tr>
          <tr><td>March, April, May</td><td>₹114</td></tr>
        </table>
        </div>
        <p>From the next 1 June, the full ₹436 is auto-debited every year.</p>

        <h2>Waiting period</h2>
        <p>For new members, there is a <strong>30-day waiting (lien) period</strong> from the date of joining. If death happens in these first 30 days for any reason other than an accident, the claim is not paid. Death due to an accident is covered from day one.</p>

        <h2>When the cover ends</h2>
        <ul>
          <li>On turning 55.</li>
          <li>If the bank account is closed or there isn't enough balance for the auto-debit on renewal.</li>
          <li>If you are covered through more than one account, only one cover is valid and extra premium is not refunded.</li>
        </ul>

        <h2>How to join</h2>
        <h3>Online</h3>
        <p>Use your bank's net banking or mobile app, or the official <a href="https://jansuraksha.gov.in" target="_blank" rel="noopener">Jan Suraksha portal</a>.</p>
        <h3>At the bank or post office</h3>
        <ol>
          <li>Fill in the PMJJBY consent-cum-declaration form at your branch.</li>
          <li>Give your nominee's details and Aadhaar.</li>
          <li>Keep enough balance for the premium. You get an acknowledgement slip as proof.</li>
        </ol>

        <h2>How to make a claim</h2>
        <ol>
          <li>The nominee goes to the bank or post office where the insured person had the account.</li>
          <li>Fill in the claim form and submit it with the death certificate and the nominee's ID and bank details.</li>
          <li>The bank sends the claim to the insurer, and the money is paid into the nominee's account.</li>
        </ol>

        <div class="official">
          <strong>Official portal:</strong> <a href="https://jansuraksha.gov.in" target="_blank" rel="noopener">jansuraksha.gov.in</a> · <a href="https://financialservices.gov.in/pradhan-mantri-jeevan-jyoti-bima-yojana-pmjjby" target="_blank" rel="noopener">Department of Financial Services</a>
        </div>
''',
    faqs=[
        ("How much is the PMJJBY premium?", "₹436 per year for ₹2 lakh life cover. If you join from September to November it is ₹342, December to February ₹228, and March to May ₹114."),
        ("What is the age limit for PMJJBY?", "You can join between 18 and 50 years. The cover continues up to 55 if you keep renewing."),
        ("Does PMJJBY cover death due to illness?", "Yes. It covers death due to any reason, but non-accidental deaths in the first 30 days after joining are not covered."),
        ("Can I have PMJJBY from two banks?", "No. You can be covered through only one bank or post office account."),
        ("Is PMJJBY the same as PMSBY?", "No. PMJJBY is life insurance (death due to any cause, ₹436 a year). PMSBY is accident insurance (accidental death or disability, ₹20 a year). You can join both."),
    ],
    sources=[
        ("PIB: Jan Suraksha schemes complete 11 years (9 May 2026)", "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2259251"),
        ("Revised rules for PMJJBY w.e.f. 1 June 2022 (PDF)", "https://jansuraksha.gov.in/Files/PMJJBY/ENGLISH/Rules.pdf"),
        ("Department of Financial Services: PMJJBY", "https://financialservices.gov.in/pradhan-mantri-jeevan-jyoti-bima-yojana-pmjjby"),
    ]))

# ---- PMSBY
s = BY_SLUG["pm-suraksha-bima-yojana"]
write(f"schemes/{s['slug']}/index.html", article(s,
    lede="PM Suraksha Bima Yojana is accident insurance of up to ₹2 lakh for only ₹20 a year. It pays if the insured person dies or becomes disabled in an accident. Anyone aged 18 to 70 with a bank or post office account can join.",
    description="PM Suraksha Bima Yojana explained: ₹2 lakh accident cover for ₹20 a year, age 18–70, what is covered, how to enrol and how to claim.",
    facts=[("Accident cover", "Up to ₹2 lakh"), ("Premium", "₹20 / year"), ("Age", "18 – 70"), ("Cover period", "1 June – 31 May")],
    body='''
        <h2>What is PMSBY?</h2>
        <p>PMSBY is a one-year accident insurance scheme, renewable every year. It was launched on 9 May 2015 and is offered by public sector general insurers and other insurers through banks and post offices. As of April 2026, more than 58 crore people have enrolled and about ₹3,660 crore has been paid for over 1.84 lakh claims.</p>

        <h2>What does it pay?</h2>
        <div class="table-wrap">
        <table class="simple">
          <tr><th>Event (due to an accident)</th><th>Amount</th></tr>
          <tr><td>Death</td><td>₹2 lakh</td></tr>
          <tr><td>Total and permanent loss of both eyes, or both hands or feet, or one eye and one hand or foot</td><td>₹2 lakh</td></tr>
          <tr><td>Total and permanent loss of sight in one eye, or loss of one hand or foot</td><td>₹1 lakh</td></tr>
        </table>
        </div>
        <p>Death due to illness is <strong>not</strong> covered. For that, see <a href="/schemes/pm-jeevan-jyoti-bima-yojana/">PM Jeevan Jyoti Bima Yojana</a>.</p>

        <h2>Who can join?</h2>
        <ul>
          <li>Anyone aged <strong>18 to 70 years</strong> with a savings account in a participating bank or post office.</li>
          <li>You can join through <strong>one account only</strong>.</li>
        </ul>

        <h2>Premium</h2>
        <p><strong>₹20 per year</strong>, auto-debited from your account. The cover year runs from 1 June to 31 May, and renewal is automatic as long as your account has enough balance around the end of May.</p>

        <h2>When the cover ends</h2>
        <ul>
          <li>On turning 70.</li>
          <li>If the bank account is closed or there isn't enough balance for renewal.</li>
          <li>If you are covered through more than one account, only one cover is valid.</li>
        </ul>

        <h2>How to join</h2>
        <h3>Online</h3>
        <p>Use your bank's net banking or mobile app, or the official <a href="https://jansuraksha.gov.in" target="_blank" rel="noopener">Jan Suraksha portal</a>.</p>
        <h3>At the bank or post office</h3>
        <ol>
          <li>Fill in the PMSBY consent-cum-declaration form.</li>
          <li>Give your nominee's details and Aadhaar.</li>
          <li>Keep ₹20 in the account for the auto-debit and collect your acknowledgement slip.</li>
        </ol>

        <h2>How to make a claim</h2>
        <ol>
          <li>Inform the bank or post office as soon as possible after the accident.</li>
          <li>Submit the claim form with documents such as the FIR or police report, the post-mortem report and death certificate (in case of death), or a disability certificate from a government doctor (in case of disability).</li>
          <li>The bank forwards the claim to the insurer, and the money is paid into the nominee's or insured person's account.</li>
        </ol>

        <div class="official">
          <strong>Official portal:</strong> <a href="https://jansuraksha.gov.in" target="_blank" rel="noopener">jansuraksha.gov.in</a> · <a href="https://financialservices.gov.in/index.php/pradhan-mantri-suraksha-bima-yojana-pmsby" target="_blank" rel="noopener">Department of Financial Services</a>
        </div>
''',
    faqs=[
        ("How much is the PMSBY premium?", "₹20 per year, auto-debited from your bank or post office account."),
        ("What does PMSBY cover?", "Accidental death and full permanent disability (₹2 lakh) and partial permanent disability (₹1 lakh). It does not cover death due to illness."),
        ("What is the age limit for PMSBY?", "18 to 70 years."),
        ("Can I join both PMSBY and PMJJBY?", "Yes. Many people take both: PMJJBY for life cover (₹436) and PMSBY for accident cover (₹20)."),
        ("How do I join PMSBY online?", "Through your bank's net banking or mobile app, or the Jan Suraksha portal at jansuraksha.gov.in."),
    ],
    sources=[
        ("PIB: Jan Suraksha schemes complete 11 years (9 May 2026)", "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2259251"),
        ("Department of Financial Services: PMSBY", "https://financialservices.gov.in/index.php/pradhan-mantri-suraksha-bima-yojana-pmsby"),
        ("Jan Suraksha portal", "https://jansuraksha.gov.in"),
    ]))

# ---------------------------------------------------------------- state schemes: Andhra Pradesh & Telangana (added 6 Oct 2026)

# ---- AP: Annadata Sukhibhava
s = BY_SLUG["ap-annadata-sukhibhava"]
write(f"schemes/{s['slug']}/index.html", article(s,
    lede="Annadata Sukhibhava is the Andhra Pradesh government's support scheme for farmers. Together with the Centre's PM-KISAN, each eligible farmer family gets ₹20,000 a year: ₹14,000 from the state and ₹6,000 from the Centre, paid in three instalments straight to the bank account.",
    description="Annadata Sukhibhava (Andhra Pradesh) explained: ₹20,000 a year for farmers with PM-KISAN, instalments, who is eligible, how to check status, latest release.",
    facts=[("Per year", "₹20,000 / family"), ("From the state", "₹14,000"), ("From PM-KISAN", "₹6,000"), ("Latest", "1st instalment, June 2026")],
    body='''
        <h2>What is Annadata Sukhibhava?</h2>
        <p>Annadata Sukhibhava – PM KISAN is a farmer income-support scheme of the Government of Andhra Pradesh. It is run along with the Central Government's <a href="/schemes/pm-kisan/">PM-KISAN</a>, so farmers get both benefits together. The state adds ₹14,000 a year to PM-KISAN's ₹6,000, for a total of <strong>₹20,000 per farmer family per year</strong>.</p>

        <h2>Latest update</h2>
        <p>The <strong>first instalment for 2026-27</strong> was released in June 2026: ₹7,000 per family (₹5,000 from the state and ₹2,000 from PM-KISAN), a total of ₹3,125.47 crore to about <strong>46.86 lakh farmer families</strong>, including cultivators under the Forest Rights Act. Further instalments are expected later in the year; we will update this page when dates are announced.</p>

        <h2>How the ₹20,000 is paid</h2>
        <div class="table-wrap">
        <table class="simple">
          <tr><th>Instalment</th><th>State</th><th>PM-KISAN</th><th>Total</th></tr>
          <tr><td>1st</td><td>₹5,000</td><td>₹2,000</td><td>₹7,000</td></tr>
          <tr><td>2nd</td><td>₹5,000</td><td>₹2,000</td><td>₹7,000</td></tr>
          <tr><td>3rd</td><td>₹4,000</td><td>₹2,000</td><td>₹6,000</td></tr>
          <tr><td><strong>Year</strong></td><td><strong>₹14,000</strong></td><td><strong>₹6,000</strong></td><td><strong>₹20,000</strong></td></tr>
        </table>
        </div>
        <p class="muted" style="font-size:0.9rem">The state releases its share together with PM-KISAN instalments. Exact dates are announced by the government each time.</p>

        <h2>Who is eligible?</h2>
        <ul>
          <li>Farmer families in Andhra Pradesh who own cultivable land (as per land records), and cultivators holding Forest Rights (RoFR) land.</li>
          <li>The government has also said landless cultivators will be supported at ₹20,000 a year from the state budget. Check with your Rythu Seva Kendram for the current status of tenant/landless farmer payments.</li>
          <li>The same exclusions as PM-KISAN generally apply, such as income-tax payers, government employees, and people holding constitutional posts.</li>
        </ul>

        <h2>What you need</h2>
        <ul>
          <li>Aadhaar-linked bank account enabled for DBT</li>
          <li>Completed eKYC</li>
          <li>Land details updated in the state's records (webland)</li>
          <li>Mobile number linked with Aadhaar</li>
        </ul>

        <h2>How to apply or fix problems</h2>
        <ol>
          <li>Visit your <strong>Rythu Seva Kendram (RSK)</strong> or village secretariat. Agriculture staff there handle registration and eKYC.</li>
          <li>If you are not on the list, ask the agriculture assistant to check your land records, Aadhaar and bank details.</li>
          <li>Make sure your PM-KISAN registration and eKYC are complete. See our <a href="/schemes/pm-kisan/">PM-KISAN guide</a>.</li>
        </ol>

        <h2>Check your status</h2>
        <p>Open the official portal <a href="https://annadathasukhibhava.ap.gov.in" target="_blank" rel="noopener">annadathasukhibhava.ap.gov.in</a>, choose <strong>Know Your Status</strong>, and enter your Aadhaar number.</p>

        <div class="official">
          <strong>Official portal:</strong> <a href="https://annadathasukhibhava.ap.gov.in" target="_blank" rel="noopener">annadathasukhibhava.ap.gov.in</a><br>
          <strong>Help:</strong> your Rythu Seva Kendram or village/ward secretariat
        </div>
''',
    faqs=[
        ("How much do farmers get under Annadata Sukhibhava?", "₹20,000 per farmer family per year: ₹14,000 from the Andhra Pradesh government and ₹6,000 from PM-KISAN."),
        ("When was the latest Annadata Sukhibhava instalment released?", "The first instalment for 2026-27 (₹7,000 per family) was released in June 2026 to about 46.86 lakh farmer families."),
        ("Do I need PM-KISAN to get Annadata Sukhibhava?", "The two are paid together. Keeping your PM-KISAN registration and eKYC complete helps make sure you receive the full ₹20,000."),
        ("How do I check Annadata Sukhibhava status?", "On annadathasukhibhava.ap.gov.in, choose Know Your Status and enter your Aadhaar number, or ask at your Rythu Seva Kendram."),
        ("Are tenant farmers eligible?", "The government announced support for landless cultivators from the state budget, but payment status for tenant farmers has varied. Check with your Rythu Seva Kendram."),
    ],
    sources=[
        ("Annadatha Sukhibhava – PM KISAN official portal", "https://annadathasukhibhava.ap.gov.in"),
        ("Tirupati district (ap.gov.in): Agriculture schemes", "https://tirupati.ap.gov.in/agriculture/"),
        ("Deccan Chronicle: CM releases ₹3,125 crore aid (June 2026)", "https://www.deccanchronicle.com/southern-states/andhra-pradesh/farmers-natural-farming-take-centre-stage-as-cm-releases-3125-crore-aid-1965111"),
    ]))

# ---- AP: NTR Bharosa Pensions
s = BY_SLUG["ap-ntr-bharosa-pension"]
write(f"schemes/{s['slug']}/index.html", article(s,
    lede="NTR Bharosa is Andhra Pradesh's social security pension scheme. Elderly people, widows, single women, persons with disabilities and several other groups get a monthly pension of ₹4,000 to ₹15,000, depending on their category.",
    description="NTR Bharosa Pension (Andhra Pradesh) explained: ₹4,000, ₹6,000, ₹10,000 and ₹15,000 monthly pensions, who is eligible, how to apply at the village or ward secretariat.",
    facts=[("Old age / widow", "₹4,000 / month"), ("Disabled", "₹6,000 / month"), ("Chronic illness", "₹10,000 / month"), ("Fully disabled", "₹15,000 / month")],
    body='''
        <h2>What is NTR Bharosa Pension?</h2>
        <p>The NTR Bharosa Pension Scheme gives monthly pensions to poor and vulnerable people in Andhra Pradesh. Under G.O.Ms.No.43 dated 13 June 2024, the pension amounts were increased, with the higher amounts paid from July 2024.</p>

        <h2>Pension amounts</h2>
        <div class="table-wrap">
        <table class="simple">
          <tr><th>Category</th><th>Monthly pension</th></tr>
          <tr><td>Old age (60+), widows, single women, fishermen, weavers, toddy tappers, traditional cobblers, Dappu artists, transgender persons, ART (PLHIV) patients</td><td><strong>₹4,000</strong></td></tr>
          <tr><td>Persons with disabilities, multi-deformity leprosy</td><td><strong>₹6,000</strong></td></tr>
          <tr><td>Chronic diseases such as kidney patients on dialysis, CKDU/CKD (as notified), kidney/liver/heart transplant, thalassemia and other notified conditions</td><td><strong>₹10,000</strong></td></tr>
          <tr><td>Fully disabled persons (as notified)</td><td><strong>₹15,000</strong></td></tr>
        </table>
        </div>
        <p class="muted" style="font-size:0.9rem">The exact list of illnesses and disability conditions for the ₹10,000 and ₹15,000 categories is set in the government order. Confirm your category at the village or ward secretariat.</p>

        <h2>Who is eligible?</h2>
        <ul>
          <li>A permanent resident of Andhra Pradesh.</li>
          <li>From a poor household (usually holding a rice card), meeting the income and asset conditions set by the government.</li>
          <li>Belonging to one of the categories above, for example 60 years or older for the old-age pension, or holding a SADAREM disability certificate for the disability pension.</li>
          <li>Not receiving another government pension.</li>
        </ul>

        <h2>How the pension is paid</h2>
        <p>Pensions are released at the start of every month. In Andhra Pradesh they are usually handed over at the beneficiary's home by village or ward secretariat staff, so elderly and disabled people don't have to travel.</p>

        <h2>Documents usually needed</h2>
        <ul>
          <li>Aadhaar card</li>
          <li>Rice card</li>
          <li>Age proof (for old-age pension)</li>
          <li>Husband's death certificate (for widow pension)</li>
          <li>SADAREM certificate (for disability pension)</li>
          <li>Medical certificates (for chronic disease pensions)</li>
          <li>Bank account details and photograph</li>
        </ul>

        <h2>How to apply</h2>
        <ol>
          <li>Go to your <strong>village or ward secretariat</strong>.</li>
          <li>Ask for the new pension application form (it is also on the official portal).</li>
          <li>Submit it with your documents. The welfare assistant verifies your details.</li>
          <li>New sanctions are approved by the government from time to time. You can check your status on the official portal.</li>
        </ol>

        <div class="official">
          <strong>Official portal:</strong> <a href="https://sspensions.ap.gov.in" target="_blank" rel="noopener">sspensions.ap.gov.in</a> (Social Security Pensions, Govt. of Andhra Pradesh)<br>
          <strong>Office:</strong> 0866-2410017
        </div>
''',
    faqs=[
        ("How much is the NTR Bharosa old age pension?", "₹4,000 per month, paid from July 2024 onwards under G.O.Ms.No.43."),
        ("How much pension do disabled persons get in Andhra Pradesh?", "₹6,000 per month for persons with disabilities. Fully disabled persons in notified categories get ₹15,000 per month."),
        ("Which patients get the ₹10,000 pension?", "People with notified chronic diseases, such as kidney patients on dialysis, certain CKD/CKDU conditions and organ transplant recipients."),
        ("Where do I apply for NTR Bharosa pension?", "At your village or ward secretariat, with Aadhaar, rice card and the documents for your category."),
        ("When is the pension paid?", "At the start of every month, usually handed over at home by secretariat staff."),
    ],
    sources=[
        ("Social Security Pensions portal, Govt. of Andhra Pradesh", "https://sspensions.ap.gov.in"),
    ]))

# ---- AP: Thalliki Vandanam
s = BY_SLUG["ap-thalliki-vandanam"]
write(f"schemes/{s['slug']}/index.html", article(s,
    lede="Thalliki Vandanam is the Andhra Pradesh government's education support scheme. For every school-going child in Classes 1 to 12, the mother gets ₹13,000 a year in her bank account, and ₹2,000 more goes to the school's maintenance.",
    description="Thalliki Vandanam (Andhra Pradesh) explained: ₹15,000 per child per year, ₹13,000 to mothers, eligibility, 75% attendance rule, 2026-27 release and how to check.",
    facts=[("Per child", "₹15,000 / year"), ("To mother", "₹13,000"), ("To school upkeep", "₹2,000"), ("2026-27", "Released 22 July 2026")],
    body='''
        <h2>What is Thalliki Vandanam?</h2>
        <p>Thalliki Vandanam (also written Talliki Vandanam) supports families so their children can keep going to school. The benefit is given <strong>for every eligible child</strong> in the family, with no limit on the number of children.</p>

        <h2>Latest update</h2>
        <p>For the <strong>2026-27</strong> academic year, the government released ₹10,120.78 crore on <strong>22 July 2026</strong>, for about <strong>67.47 lakh students</strong>, credited to the accounts of about 42.70 lakh mothers. Beneficiary lists were displayed at village (Swarna Gramam) and ward offices. Newly admitted students in Classes 1–9 and Intermediate first year were to be covered by 30 August 2026.</p>

        <h2>Benefits</h2>
        <ul>
          <li><strong>₹15,000 per child per year.</strong></li>
          <li><strong>₹13,000</strong> is credited directly to the mother's (or guardian's) bank account.</li>
          <li><strong>₹2,000</strong> is kept for school maintenance and development.</li>
        </ul>

        <h2>Who is eligible?</h2>
        <ul>
          <li>Students in <strong>Classes 1 to 12</strong> (including Intermediate) in government, aided and recognised private schools and colleges in Andhra Pradesh.</li>
          <li>The family must meet the government's income and eligibility conditions (usually a rice card holding household).</li>
          <li>Students are expected to keep at least <strong>75% attendance</strong>; low attendance or dropping out can affect the next year's benefit.</li>
        </ul>

        <h2>What you need</h2>
        <ul>
          <li>Mother's Aadhaar-linked bank account enabled for DBT</li>
          <li>Child's Aadhaar and school details updated correctly</li>
          <li>Rice card / household details in the state's records</li>
        </ul>

        <h2>How to check or correct</h2>
        <ol>
          <li>Check the beneficiary list displayed at your village or ward secretariat.</li>
          <li>If your child's name is missing, contact the welfare/education assistant at the secretariat or the school headmaster with the child's and mother's Aadhaar.</li>
          <li>Make sure the mother's bank account is linked to Aadhaar and active.</li>
        </ol>
        <div class="note">No one needs to pay any fee to be included. Report anyone asking for money to your secretariat.</div>

        <div class="official">
          <strong>Help:</strong> your village or ward secretariat, or the child's school<br>
          <strong>Official state portal:</strong> <a href="https://www.ap.gov.in" target="_blank" rel="noopener">ap.gov.in</a>
        </div>
''',
    faqs=[
        ("How much money is given under Thalliki Vandanam?", "₹15,000 per child per year: ₹13,000 is credited to the mother's account and ₹2,000 goes to school maintenance."),
        ("When was Thalliki Vandanam 2026-27 released?", "On 22 July 2026, for about 67.47 lakh students. New admissions were to be covered by 30 August 2026."),
        ("Is Thalliki Vandanam given for all children in a family?", "Yes. The benefit is given for every eligible school-going child, not just one."),
        ("Do private school students get Thalliki Vandanam?", "Students in recognised private schools are covered along with government and aided schools, subject to the family meeting the eligibility conditions."),
        ("What if my child's name is not in the list?", "Contact your village or ward secretariat or the school with the child's and mother's Aadhaar to check and correct the details."),
    ],
    sources=[
        ("Deccan Chronicle: AP Govt to release Thalliki Vandanam funds on July 22 (2026)", "https://www.deccanchronicle.com/southern-states/andhra-pradesh/ap-govt-to-release-thalliki-vandanam-funds-on-july-22-1971425"),
        ("Government of Andhra Pradesh portal", "https://www.ap.gov.in"),
    ]))

# ---- TS: Rythu Bharosa
s = BY_SLUG["ts-rythu-bharosa"]
write(f"schemes/{s['slug']}/index.html", article(s,
    lede="Rythu Bharosa is the Telangana government's investment support for farmers. Farmers get ₹12,000 per acre every year, paid as ₹6,000 per acre for each crop season, directly into their bank accounts.",
    description="Rythu Bharosa (Telangana) explained: ₹12,000 per acre per year in two seasons, who is eligible, which land is excluded, latest release and how to check.",
    facts=[("Per acre / year", "₹12,000"), ("Per season", "₹6,000 / acre"), ("Seasons", "Kharif + Rabi"), ("Paid by", "DBT to bank")],
    body='''
        <h2>What is Rythu Bharosa?</h2>
        <p>Rythu Bharosa replaced the earlier Rythu Bandhu scheme. It gives farmers money for each crop season to meet cultivation costs like seeds, fertiliser and labour, without needing a loan.</p>

        <h2>Latest update</h2>
        <p>The Telangana government released Rythu Bharosa funds for the <strong>2026 Kharif season</strong> from 30 June 2026. A ₹500 per quintal bonus for notified fine rice varieties was also approved for the Kharif season.</p>

        <h2>Benefits</h2>
        <ul>
          <li><strong>₹12,000 per acre per year</strong>.</li>
          <li>Paid in two parts: <strong>₹6,000 per acre</strong> for Kharif (monsoon) and ₹6,000 per acre for Rabi (winter).</li>
          <li>Money goes directly to the farmer's bank account (DBT).</li>
        </ul>

        <h2>Who is eligible?</h2>
        <ul>
          <li>Farmers in Telangana whose <strong>cultivable land</strong> is recorded in the state's land records (Bhu Bharati).</li>
          <li>Payment is for land that is actually suitable for farming.</li>
        </ul>
        <h3>Land that is excluded</h3>
        <ul>
          <li>Non-agricultural land such as real-estate layouts, industrial areas and mining land.</li>
          <li>Land that is not cultivable, and lands the government has excluded after verification.</li>
        </ul>

        <h2>What you need</h2>
        <ul>
          <li>Land recorded in your name (pattadar passbook)</li>
          <li>Aadhaar-linked bank account</li>
          <li>Correct details with your Agriculture Extension Officer (AEO)</li>
        </ul>

        <h2>How to get it or fix problems</h2>
        <ol>
          <li>Eligible farmers are identified from land records, so you usually don't need to apply each season.</li>
          <li>If money hasn't come, contact your <strong>Agriculture Extension Officer (AEO)</strong> or Mandal Agriculture Officer with your passbook, Aadhaar and bank details.</li>
          <li>New land owners (after purchase or inheritance) should get their records updated in Bhu Bharati and inform the AEO.</li>
        </ol>

        <div class="official">
          <strong>Official portal:</strong> <a href="https://www.rythubharosa.telangana.gov.in" target="_blank" rel="noopener">rythubharosa.telangana.gov.in</a><br>
          <strong>Help:</strong> Agriculture Extension Officer (AEO) or Mandal Agriculture Office
        </div>
''',
    faqs=[
        ("How much is Rythu Bharosa per acre?", "₹12,000 per acre per year, paid as ₹6,000 per acre for each of the Kharif and Rabi seasons."),
        ("When was Rythu Bharosa released for Kharif 2026?", "The Telangana government began releasing Kharif 2026 Rythu Bharosa funds from 30 June 2026."),
        ("Is Rythu Bharosa paid for non-agricultural land?", "No. Real-estate layouts, industrial and mining lands and non-cultivable land are excluded."),
        ("Do I need to apply every season for Rythu Bharosa?", "Usually not. Farmers are identified from land records. If payment is missing, contact your Agriculture Extension Officer."),
        ("Is Rythu Bharosa the same as Rythu Bandhu?", "Rythu Bharosa replaced Rythu Bandhu, with a higher amount and changes in which lands qualify."),
    ],
    sources=[
        ("Suryapet district (telangana.gov.in): Rythu Bharosa", "https://suryapet.telangana.gov.in/scheme/rythu-bharosa/"),
        ("Siasat: Revanth Reddy to release Rythu Bharosa funds on June 30 (2026)", "https://www.siasat.com/revanth-reddy-to-release-rythu-bharosa-funds-on-june-30-3491822/"),
    ]))

# ---- TS: Mahalakshmi
s = BY_SLUG["ts-mahalakshmi"]
write(f"schemes/{s['slug']}/index.html", article(s,
    lede="Mahalakshmi is a Telangana government scheme for women. Its two main benefits now running are free travel for women and girls in TGSRTC buses across the state, and LPG cooking gas cylinders at ₹500 for eligible families.",
    description="Mahalakshmi scheme (Telangana) explained: free bus travel for women in TGSRTC buses, Mahalakshmi smart card, ₹500 gas cylinder eligibility, and status of the ₹2,500 monthly assistance.",
    facts=[("Bus travel", "Free in TGSRTC"), ("Gas cylinder", "₹500 each"), ("Smart card fee", "₹50"), ("₹2,500 / month", "Not yet started")],
    body='''
        <h2>What is Mahalakshmi?</h2>
        <p>Mahalakshmi is one of the Telangana government's guarantees for women, launched in December 2023. Two parts are running today. A third part, ₹2,500 per month for women, has been announced but has <strong>not been started</strong> as of 2026.</p>

        <h2>1. Free bus travel</h2>
        <ul>
          <li>Women, girls and transgender persons who live in Telangana can travel <strong>free in TGSRTC buses</strong> within the state.</li>
          <li>Free travel applies to ordinary services such as Palle Velugu, Express and city ordinary/express buses. AC, luxury and similar premium services are generally not included.</li>
          <li>Show your <strong>original Aadhaar card</strong> or another government ID with a Telangana address to the conductor to get a zero-fare ticket. Photocopies are not accepted.</li>
        </ul>
        <h3>Mahalakshmi smart card</h3>
        <p>From 2 June 2026, the government began issuing <strong>Mahalakshmi smart cards</strong> for free travel, first on a pilot basis in one mandal per district before expanding statewide. Until the card reaches you, Aadhaar or other government ID continues to work.</p>
        <ul>
          <li>Apply at <strong>MeeSeva centres</strong> or <strong>TGSRTC bus pass counters</strong>.</li>
          <li>Bring your Aadhaar card, a passport-size photo and your mobile number.</li>
          <li>A nominal fee of <strong>₹50</strong> is charged for the card.</li>
        </ul>

        <h2>2. LPG cylinder at ₹500</h2>
        <ul>
          <li>Eligible families pay an effective price of <strong>₹500 per domestic LPG cylinder</strong>. The state government pays the rest as a subsidy credited to the bank account.</li>
          <li>To be eligible, you should have applied under <strong>Praja Palana</strong>, hold a <strong>white ration card (food security card)</strong>, and have an <strong>active domestic gas connection in your name</strong>.</li>
          <li>The number of subsidised cylinders per year is based on your household's <strong>average use over the last three years</strong>.</li>
        </ul>

        <h2>3. ₹2,500 per month for women</h2>
        <p>This part of Mahalakshmi was promised but, according to news reports up to 2026, it <strong>has not been implemented yet</strong>. Be careful of anyone asking you to "register" or pay for it. We will update this page if the government starts it.</p>

        <div class="official">
          <strong>Bus travel:</strong> <a href="https://www.tgsrtc.telangana.gov.in" target="_blank" rel="noopener">TGSRTC</a> · smart card at MeeSeva or TGSRTC bus pass counters<br>
          <strong>Gas subsidy:</strong> your LPG distributor, or your mandal/municipal office for Praja Palana applications
        </div>
''',
    faqs=[
        ("Is bus travel free for women in Telangana?", "Yes. Women, girls and transgender persons who live in Telangana can travel free in ordinary TGSRTC buses within the state by showing Aadhaar or a Mahalakshmi smart card."),
        ("How do I get a Mahalakshmi smart card?", "Apply at a MeeSeva centre or TGSRTC bus pass counter with Aadhaar, a photo and your mobile number. The fee is ₹50."),
        ("Who gets the ₹500 gas cylinder in Telangana?", "Families who applied under Praja Palana, hold a white ration card and have an active domestic LPG connection in their name."),
        ("Has the ₹2,500 per month Mahalakshmi assistance started?", "As of 2026, news reports say this part has not been implemented yet. Free bus travel and the ₹500 gas cylinder are running."),
        ("Can women from other states travel free in Telangana buses?", "No. Free travel is for women who are residents of Telangana."),
    ],
    sources=[
        ("Wanaparthy district (telangana.gov.in): Maha Lakshmi Scheme", "https://wanaparthy.telangana.gov.in/scheme/mahalakshmi-scheme/"),
        ("Deccan Chronicle: Mahalakshmi smart cards from June 2 (2026)", "https://www.deccanchronicle.com/southern-states/telangana/telangana-rtc-mahalakshmi-smart-cards-for-free-bus-travel-how-and-where-to-apply-1959859"),
        ("Telangana Today: Who is eligible for subsidised LPG cylinders", "https://telanganatoday.com/telangana-who-is-eligible-for-subsidised-lpg-cylinders-under-mahalakshmi-scheme"),
        ("The Hans India: Women's cash transfer scheme in spotlight (2026)", "https://www.thehansindia.com/telangana/telangana-womens-cash-transfer-scheme-in-spotlight-ahead-of-budget-1058039"),
    ]))

# ---- TS: Indiramma Indlu
s = BY_SLUG["ts-indiramma-indlu"]
write(f"schemes/{s['slug']}/index.html", article(s,
    lede="Indiramma Indlu is the Telangana government's housing scheme for poor families without a house. Eligible families get up to ₹5 lakh to build a pucca house, paid in stages directly to their bank account as construction progresses.",
    description="Indiramma Indlu (Telangana housing) explained: ₹5 lakh assistance, who is eligible, how beneficiaries are selected, stage-wise payment and how to check status online.",
    facts=[("Assistance", "Up to ₹5 lakh"), ("Paid", "In 4 stages"), ("Income limit", "Below ₹2 lakh / year"), ("Helpline", "040-29390057")],
    body='''
        <h2>What is Indiramma Indlu?</h2>
        <p>Indiramma Indlu (Indiramma Houses) helps families who do not own a house to build one. In the first phase, the focus is on families who have their own plot but no pucca house. The government has said landless families will also be covered, including with house sites.</p>

        <h2>Latest update</h2>
        <p>As of September 2026, about <strong>4.5 lakh houses</strong> were sanctioned in the first phase and 2.5 lakh in the second phase. Payments are being credited to beneficiaries' bank accounts every Monday, based on the stage of construction.</p>

        <h2>Benefits</h2>
        <ul>
          <li>Financial assistance of <strong>up to ₹5 lakh</strong> to build a house.</li>
          <li>Paid in <strong>four stages</strong> (foundation, walls, roof slab and completion), each released after officials verify that stage with geo-tagged photos.</li>
          <li>Houses are registered in the <strong>woman's name</strong> as a priority.</li>
        </ul>

        <h2>Who is eligible?</h2>
        <ul>
          <li>A resident of Telangana from a poor (BPL) family with a <strong>ration card</strong>.</li>
          <li>Family income <strong>below ₹2 lakh per year</strong>.</li>
          <li>Must <strong>not own a pucca house</strong>, and must not have received a house under an earlier government housing scheme.</li>
          <li>Single women and widows are eligible. Priority goes to families living in huts or temporary shelters, and to SC, ST, minority and other weaker sections.</li>
        </ul>

        <h2>How beneficiaries are selected</h2>
        <ol>
          <li>Applications were collected through <strong>Praja Palana</strong>.</li>
          <li>Officials survey applicants using a mobile app.</li>
          <li>The list is finalised in <strong>Gram Sabhas</strong> (villages) and <strong>Ward Sabhas</strong> (towns) with village committees.</li>
          <li>Selected families get a sanction letter and can start construction.</li>
        </ol>

        <h2>Check your status</h2>
        <ol>
          <li>Go to <a href="https://indirammaindlu.telangana.gov.in" target="_blank" rel="noopener">indirammaindlu.telangana.gov.in</a>.</li>
          <li>Choose <strong>Application Status</strong>.</li>
          <li>Search with your Aadhaar number, mobile number, ration card number or application number.</li>
        </ol>

        <div class="note">Selection and payments are free. Do not pay anyone who promises to get your house sanctioned. Report it to your MPDO or municipal office.</div>

        <div class="official">
          <strong>Official portal:</strong> <a href="https://indirammaindlu.telangana.gov.in" target="_blank" rel="noopener">indirammaindlu.telangana.gov.in</a><br>
          <strong>Helpline:</strong> 040-29390057
        </div>
''',
    faqs=[
        ("How much money is given under Indiramma Indlu?", "Up to ₹5 lakh per house, paid in four stages as construction progresses."),
        ("Who is eligible for Indiramma Indlu?", "Poor families in Telangana with a ration card, income below ₹2 lakh a year, who do not own a pucca house and haven't received a house under an earlier scheme."),
        ("How do I check my Indiramma house status?", "On indirammaindlu.telangana.gov.in, choose Application Status and search with Aadhaar, mobile, ration card or application number."),
        ("How are Indiramma Indlu beneficiaries chosen?", "From Praja Palana applications, after a field survey, and finalised in Gram Sabhas and Ward Sabhas."),
        ("When is the Indiramma Indlu money paid?", "After each construction stage is verified, payments are credited directly to the beneficiary's bank account, usually every Monday."),
    ],
    sources=[
        ("Indiramma Indlu official portal", "https://indirammaindlu.telangana.gov.in"),
        ("Mahabubnagar district (telangana.gov.in): Indiramma Indlu", "https://mahabubnagar.telangana.gov.in/scheme/indiramma-indlu/"),
        ("The Hans India: How to check Indiramma Houses status (Sept 2026)", "https://www.thehansindia.com/telangana/here-is-how-to-check-the-status-of-the-telangana-indiramma-houses-scheme-1117422"),
        ("Deccan Chronicle: 4.5 lakh Indiramma houses sanctioned (Sept 2026)", "https://www.deccanchronicle.com/southern-states/telangana/45-lakh-indiramma-houses-sanctioned-in-first-phase-1990852"),
    ]))

# ---------------------------------------------------------------- state schemes batch 2 (added 6 Oct 2026)

# ---- AP: Deepam-2
s = BY_SLUG["ap-deepam-2"]
write(f"schemes/{s['slug']}/index.html", article(s,
    lede="Deepam-2 is the Andhra Pradesh government's free cooking gas scheme. Eligible families get three LPG cylinders free every year, one in each four-month period. You pay at delivery and the full amount comes back to your bank account within 48 hours.",
    description="Deepam-2 (Andhra Pradesh) explained: 3 free LPG gas cylinders a year, booking periods, how the refund works, who is eligible and what to do if money doesn't come.",
    facts=[("Free cylinders", "3 per year"), ("Refund", "Within 48 hours"), ("Launched", "1 November 2024"), ("Now booking", "Aug – Nov period")],
    body='''
        <h2>What is Deepam-2?</h2>
        <p>Deepam-2 (Deepam 2.0) is one of the Andhra Pradesh government's welfare schemes for women. It was launched on 1 November 2024 to make cooking gas affordable for poor families. About 1.55 crore households were targeted when it started.</p>

        <h2>Benefits</h2>
        <ul>
          <li><strong>Three free domestic LPG refills every year</strong>.</li>
          <li>One cylinder in each four-month period.</li>
          <li>The money you pay for the cylinder is refunded to your bank account within 48 hours of delivery.</li>
        </ul>

        <h2>Booking periods</h2>
        <div class="table-wrap">
        <table class="simple">
          <tr><th>Free cylinder</th><th>Period</th><th>Book by</th></tr>
          <tr><td>1st</td><td>December – March</td><td>31 March</td></tr>
          <tr><td>2nd</td><td>April – July</td><td>31 July</td></tr>
          <tr><td>3rd</td><td>August – November</td><td>30 November</td></tr>
        </table>
        </div>
        <div class="note"><strong>Right now (October 2026)</strong> you are in the August–November period. If you haven't taken this period's free cylinder yet, book it before <strong>30 November</strong>. An unused free cylinder does not carry over to the next period.</div>

        <h2>Who is eligible?</h2>
        <ul>
          <li>Families in Andhra Pradesh with a <strong>rice card</strong>.</li>
          <li>An <strong>active domestic LPG connection</strong>.</li>
          <li>The gas connection, rice card, Aadhaar and mobile number must be linked and verified.</li>
          <li>An active bank account linked to Aadhaar, so the refund can be credited.</li>
        </ul>

        <h2>How it works</h2>
        <ol>
          <li>Book your cylinder with your gas agency as usual (phone, app or SMS).</li>
          <li>Pay the cylinder price when it is delivered. Delivery is usually within 24 hours in towns and 48 hours in villages.</li>
          <li>The full amount you paid is credited back to your bank account within about 48 hours.</li>
        </ol>

        <h2>If the money doesn't come</h2>
        <ul>
          <li>Check that your Aadhaar is linked to your bank account and the account is active for DBT.</li>
          <li>Check that your gas connection and rice card are linked to the same Aadhaar.</li>
          <li>Contact your gas agency, your village/ward secretariat, or the civil supplies toll-free number <strong>1967</strong>.</li>
        </ul>

        <div class="official">
          <strong>Help:</strong> your gas agency, village/ward secretariat, or civil supplies toll-free <strong>1967</strong><br>
          <strong>Official state portal:</strong> <a href="https://www.ap.gov.in" target="_blank" rel="noopener">ap.gov.in</a>
        </div>
''',
    faqs=[
        ("How many free gas cylinders do we get under Deepam-2?", "Three free LPG refills per year, one in each four-month period."),
        ("Do I have to pay for the Deepam-2 cylinder?", "Yes, you pay the price at delivery, and the full amount is credited back to your bank account within about 48 hours."),
        ("What are the Deepam-2 booking periods?", "December–March (by 31 March), April–July (by 31 July) and August–November (by 30 November)."),
        ("Who is eligible for Deepam-2?", "Families with a rice card and an active domestic LPG connection, with Aadhaar, mobile and bank account linked."),
        ("What if I miss a period?", "The free cylinder for that period is not carried forward, so book within each period."),
    ],
    sources=[
        ("Siasat: Andhra CM launches free cooking gas cylinder scheme Deepam-2 (Nov 2024)", "https://www.siasat.com/andhra-cm-launches-free-cooking-gas-cylinder-scheme-deepam-2-3124093/"),
        ("The Hans India: Free LPG scheme – booking for cylinders begins", "https://www.thehansindia.com/andhra-pradesh/free-lpg-scheme-booking-for-cylinders-begins-918080"),
        ("Deccan Chronicle: Gas bookings under Deepam 2.0", "https://www.deccanchronicle.com/southern-states/andhra-pradesh/gas-bookings-under-deepam-20-scheme-cross-8037-lakh-in-42-days-manohar-1845733"),
    ]))

# ---- AP: Stree Shakti
s = BY_SLUG["ap-stree-shakti"]
write(f"schemes/{s['slug']}/index.html", article(s,
    lede="Stree Shakti is the Andhra Pradesh government's free bus travel scheme. Since 15 August 2025, women, girls and transgender persons who live in Andhra Pradesh can travel free in most APSRTC ordinary and express buses anywhere in the state.",
    description="Stree Shakti (Andhra Pradesh) explained: free APSRTC bus travel for women, which bus types are free and which are not, ID needed, and who is eligible.",
    facts=[("Bus fare", "Free"), ("Started", "15 August 2025"), ("Free bus types", "5"), ("Who", "Women, girls, transgender persons")],
    body='''
        <h2>What is Stree Shakti?</h2>
        <p>Stree Shakti lets women in Andhra Pradesh travel without paying a fare in APSRTC buses. It was launched on Independence Day, 15 August 2025, and is expected to benefit about 2.62 crore women. Out of APSRTC's 11,449 buses, women can travel free in about 8,458.</p>

        <h2>Who can travel free?</h2>
        <ul>
          <li>Women, girls and transgender persons who are <strong>residents of Andhra Pradesh</strong>.</li>
          <li>Travel is allowed <strong>from anywhere to anywhere within the state</strong>.</li>
        </ul>

        <h2>Which buses are free?</h2>
        <div class="table-wrap">
        <table class="simple">
          <tr><th>Free ✅</th><th>Not free ❌</th></tr>
          <tr><td>Palle Velugu</td><td>Non-stop services</td></tr>
          <tr><td>Ultra Palle Velugu</td><td>Super Luxury</td></tr>
          <tr><td>City Ordinary</td><td>AC buses</td></tr>
          <tr><td>Express</td><td>Services on ghat roads</td></tr>
          <tr><td>Metro Express</td><td>Interstate services, contract carriage, charters and package tours</td></tr>
        </table>
        </div>

        <h2>What to show the conductor</h2>
        <p>Show any one valid ID with an Andhra Pradesh address, such as:</p>
        <ul>
          <li>Aadhaar card</li>
          <li>Voter ID</li>
          <li>Ration card</li>
          <li>Driving licence</li>
        </ul>
        <p>The conductor issues a zero-fare ticket. Keep your ID with you during the journey.</p>

        <div class="note">You don't need to apply or register for Stree Shakti. Anyone asking for money to "register" you is not from the government.</div>

        <div class="official">
          <strong>Official:</strong> <a href="https://www.apsrtc.ap.gov.in" target="_blank" rel="noopener">APSRTC</a> · <a href="https://www.ap.gov.in" target="_blank" rel="noopener">ap.gov.in</a>
        </div>
''',
    faqs=[
        ("Is bus travel free for women in Andhra Pradesh?", "Yes. Under Stree Shakti, women, girls and transgender persons who live in Andhra Pradesh travel free in Palle Velugu, Ultra Palle Velugu, City Ordinary, Express and Metro Express APSRTC buses."),
        ("Which APSRTC buses are not free under Stree Shakti?", "Non-stop, Super Luxury and AC buses, ghat road services, interstate services, contract carriages, charters and package tours."),
        ("What ID do I need for free bus travel in AP?", "Any valid ID with an Andhra Pradesh address, such as Aadhaar, voter ID, ration card or driving licence."),
        ("Do I need to register for Stree Shakti?", "No. Just show your ID to the conductor to get a zero-fare ticket."),
        ("When did Stree Shakti start?", "On 15 August 2025."),
    ],
    sources=[
        ("Deccan Chronicle: AP CM launches Stree Shakti (Aug 2025)", "https://www.deccanchronicle.com/southern-states/andhra-pradesh/ap-cm-launches-stree-shakti-statewide-free-bus-travel-scheme-for-women-1897697"),
        ("Deccan Chronicle: AP issues modalities for free bus travel", "https://www.deccanchronicle.com/southern-states/andhra-pradesh/free-bus-travel-in-andhra-for-girls-women-transgenders-from-aug-15-1896807"),
        ("The Hans India: Free travel in five categories of buses", "https://www.thehansindia.com/andhra-pradesh/under-stree-shakti-scheme-free-travel-facility-for-women-in-five-categories-of-buses-from-aug-15-995900"),
    ]))

# ---- TS: Gruha Jyothi
s = BY_SLUG["ts-gruha-jyothi"]
write(f"schemes/{s['slug']}/index.html", article(s,
    lede="Gruha Jyothi is the Telangana government's free electricity scheme. Eligible households that use up to 200 units of electricity in a month get a zero bill for that month.",
    description="Gruha Jyothi (Telangana) explained: zero electricity bill up to 200 units a month, who is eligible, tenants, what happens above 200 units, and how to get added.",
    facts=[("Free up to", "200 units / month"), ("Bill", "Zero, if ≤ 200 units"), ("Started", "March 2024"), ("Connections", "1 per household")],
    body='''
        <h2>What is Gruha Jyothi?</h2>
        <p>Gruha Jyothi is one of the Telangana government's guarantees. Under G.O.Ms.No.7 (Energy) dated 26 February 2024, eligible households get free domestic electricity of up to 200 units a month. Zero bills have been issued from March 2024. The government pays the electricity companies (DISCOMs) for these bills.</p>

        <h2>Benefits</h2>
        <ul>
          <li>If your household uses <strong>200 units or less</strong> in a month, you get a <strong>zero bill</strong> for that month.</li>
          <li>The benefit is for <strong>one domestic service connection</strong> per household.</li>
        </ul>
        <div class="note">If you use <strong>more than 200 units</strong> in a month, you get a normal bill for that month. Keep an eye on usage in summer when fans, coolers and ACs push consumption up.</div>

        <h2>Who is eligible?</h2>
        <ul>
          <li>Households that applied through <strong>Praja Palana</strong> (or another approved channel) and are entered in the Praja Palana portal.</li>
          <li>A valid <strong>Food Security Card (white ration card)</strong> linked with <strong>Aadhaar</strong>.</li>
          <li>A <strong>domestic electricity service connection number</strong> linked to the application.</li>
        </ul>
        <h3>Tenants</h3>
        <p>Tenants can also benefit. The bill stays in the name of the original connection holder (the electricity company does not change the name for this scheme), but the household's white ration card is linked to that connection.</p>

        <h2>Important rules</h2>
        <ul>
          <li>Only for <strong>domestic</strong> use. Using it for a shop or business is an offence under the Electricity Act.</li>
          <li>Only one connection per household gets the benefit.</li>
        </ul>

        <h2>Not getting a zero bill?</h2>
        <ol>
          <li>Check that your Praja Palana application included Gruha Jyothi and your service connection number.</li>
          <li>Make sure your white ration card and Aadhaar are linked correctly.</li>
          <li>Visit your <strong>mandal / municipal office</strong> or your electricity company's (DISCOM) section office with your ration card, Aadhaar and electricity bill to get it corrected.</li>
        </ol>

        <div class="official">
          <strong>Official order:</strong> <a href="http://www.tgerc.telangana.gov.in/file_upload/uploads/Tariff%20Orders/Current%20Year%20Orders/2024/Order%20regarding%20Gruha%20Jyothi%20Scheme.pdf" target="_blank" rel="noopener">TGERC order on Gruha Jyothi (PDF)</a><br>
          <strong>Help:</strong> mandal/municipal office or your DISCOM section office
        </div>
''',
    faqs=[
        ("How many units are free under Gruha Jyothi?", "Up to 200 units per month. If your household uses 200 units or less, the bill for that month is zero."),
        ("What if I use more than 200 units?", "You receive a normal bill for that month."),
        ("Can tenants get Gruha Jyothi?", "Yes. The bill stays in the connection holder's name, but the tenant household's white ration card can be linked to the connection."),
        ("Who is eligible for Gruha Jyothi?", "Households that applied through Praja Palana with a valid white ration card linked to Aadhaar and a domestic service connection."),
        ("Can I use Gruha Jyothi for my shop?", "No. It is only for domestic use. Using it for non-domestic purposes is an offence."),
    ],
    sources=[
        ("TGERC order on Gruha Jyothi, 16 March 2024 (PDF), quoting G.O.Ms.No.7", "http://www.tgerc.telangana.gov.in/file_upload/uploads/Tariff%20Orders/Current%20Year%20Orders/2024/Order%20regarding%20Gruha%20Jyothi%20Scheme.pdf"),
        ("Wanaparthy district (telangana.gov.in): Gruha Jyothi", "https://wanaparthy.telangana.gov.in/scheme/gruha-jyothi-scheme/"),
        ("Deccan Chronicle: 200 units of free power for tenants too", "https://www.deccanchronicle.com/nation/current-affairs/200-units-of-free-power-gruha-jyoti-for-tenants-too-881341"),
    ]))

# ---- TS: Rajiv Aarogyasri
s = BY_SLUG["ts-rajiv-aarogyasri"]
write(f"schemes/{s['slug']}/index.html", article(s,
    lede="Rajiv Aarogyasri is the Telangana government's health scheme for poor families. It covers cashless treatment worth up to ₹10 lakh per family per year in government and private network hospitals, for more than 1,800 procedures.",
    description="Rajiv Aarogyasri (Telangana) explained: ₹10 lakh health cover per family, 1,835 procedures, who is eligible, how to get treatment through Aarogyamithra, helpline 104.",
    facts=[("Cover", "₹10 lakh / family / year"), ("Procedures", "1,835"), ("Treatment", "Cashless"), ("Helpline", "104")],
    body='''
        <h2>What is Rajiv Aarogyasri?</h2>
        <p>Rajiv Aarogyasri is run by the Aarogyasri Health Care Trust of the Government of Telangana. The cover was raised from ₹5 lakh to <strong>₹10 lakh per family per year</strong>. In July 2024, 163 new procedures were added, bringing the total to <strong>1,835 procedures</strong>, including costly treatments like organ transplants and cochlear implants. In Telangana it works together with the Centre's <a href="/schemes/ayushman-bharat-pm-jay/">Ayushman Bharat PM-JAY</a>.</p>

        <h2>Benefits</h2>
        <ul>
          <li>Cashless treatment up to <strong>₹10 lakh per family per year</strong>.</li>
          <li>Covers surgeries and treatments for <strong>1,835 listed procedures</strong>, including cancer, heart, kidney, neuro and many other conditions.</li>
          <li>Available in government hospitals and private <strong>network hospitals</strong> across Telangana.</li>
        </ul>

        <h2>Who is eligible?</h2>
        <ul>
          <li>Poor (BPL) families in Telangana with a valid <strong>white ration card</strong> (including Annapurna and Antyodaya cards) or an Aarogyasri health card.</li>
          <li>Family members whose <strong>name and photo</strong> appear on the card are covered.</li>
          <li>The treatment must be one of the listed procedures.</li>
        </ul>
        <p class="muted" style="font-size:0.9rem">The government has discussed widening eligibility beyond the white ration card and issuing new health cards. We will update this page when new rules are notified.</p>

        <h2>How to get treatment</h2>
        <ol>
          <li>Go to a <strong>network hospital</strong>, or first visit a PHC, CHC, area or district hospital, where doctors can refer you.</li>
          <li>Meet the <strong>Aarogyamithra</strong> (help desk) at the hospital and register.</li>
          <li>Carry your <strong>white ration card or health card</strong>, Aadhaar and any medical records.</li>
          <li>After pre-authorisation, treatment is given without you paying for covered procedures.</li>
        </ol>
        <div class="note">You should not be asked to pay for a covered procedure at a network hospital. If you are, call <strong>104</strong> to complain.</div>

        <div class="official">
          <strong>Official website:</strong> <a href="https://www.rajivaarogyasri.telangana.gov.in" target="_blank" rel="noopener">rajivaarogyasri.telangana.gov.in</a><br>
          <strong>Toll-free (24×7, Telugu &amp; English):</strong> 104
        </div>
''',
    faqs=[
        ("How much cover does Rajiv Aarogyasri give?", "Up to ₹10 lakh per family per year for listed procedures."),
        ("How many procedures are covered under Aarogyasri?", "1,835 procedures, after 163 new ones were added in July 2024."),
        ("Who is eligible for Aarogyasri in Telangana?", "BPL families with a valid white ration card (including Annapurna and Antyodaya cards) or an Aarogyasri health card."),
        ("How do I use Aarogyasri at a hospital?", "Go to a network hospital and register with the Aarogyamithra help desk, carrying your white ration card or health card and Aadhaar."),
        ("What is the Aarogyasri helpline number?", "Toll-free 104, available round the clock in Telugu and English."),
    ],
    sources=[
        ("Aarogyasri Health Care Trust: FAQs", "http://www.aarogyasri.telangana.gov.in/faqs"),
        ("Suryapet district (telangana.gov.in): Arogya Sri", "https://suryapet.telangana.gov.in/arogya-sri/"),
        ("Telangana Today: 163 new procedures included in Rajiv Aarogyasri (July 2024)", "https://telanganatoday.com/telangana-163-new-procedures-included-in-rajiv-aarogyasri-scheme"),
    ]))

# ---- TS: Cheyutha pensions (added 6 Oct 2026)
s = BY_SLUG["ts-cheyutha-pension"]
write(f"schemes/{s['slug']}/index.html", article(s,
    lede="Cheyutha (earlier called Aasara) is Telangana's social security pension scheme. It pays a monthly pension to poor elderly people, widows, single women, persons with disabilities, weavers, toddy tappers, beedi workers and patients with certain illnesses.",
    description="Cheyutha pension (Telangana) explained: categories, current pension amounts and the promised increase, 2026 enrolment, new thalassemia and sickle cell pensions, how to apply.",
    facts=[("Categories", "10+"), ("2026 enrolment", "Closed 15 Sept 2026"), ("New in 2026", "Thalassemia, sickle cell"), ("Paid", "Monthly to bank")],
    body='''
        <h2>What is Cheyutha?</h2>
        <p>Cheyutha is the Telangana government's pension scheme for vulnerable people, continuing the earlier Aasara pensions. The money is credited to the beneficiary's bank account every month. Pensioners from white ration card families are also covered for health care under <a href="/schemes/ts-rajiv-aarogyasri/">Rajiv Aarogyasri</a>.</p>

        <h2>Who gets a Cheyutha pension?</h2>
        <ul>
          <li>Senior citizens</li>
          <li>Widows and single women</li>
          <li>Persons with disabilities</li>
          <li>Weavers and toddy tappers</li>
          <li>Beedi workers</li>
          <li>People living with HIV, filaria patients and dialysis patients</li>
          <li><strong>New in 2026:</strong> persons with thalassemia, sickle cell disease and haemophilia (distribution to identified beneficiaries began from 15 August 2026)</li>
        </ul>
        <p>Applicants should be permanent residents of Telangana from poor (BPL) families, usually with a white ration card.</p>

        <h2>How much is the pension?</h2>
        <div class="note"><strong>Reports differ on the current amount.</strong> Some government pages and statements list <strong>₹4,000 per month</strong> (and <strong>₹6,000</strong> for persons with disabilities), the amounts promised in 2023. But a news report from 1 October 2026 says senior citizens are <strong>still receiving ₹2,016 per month</strong> and that the increase to ₹4,000 has not been implemented for them. Please check the amount credited in your bank account, or ask your MPDO or municipal office, for the amount that applies to your category.</div>
        <div class="table-wrap">
        <table class="simple">
          <tr><th>Category</th><th>Amount before 2023</th><th>Amount listed / promised</th></tr>
          <tr><td>Senior citizens, widows, single women, weavers, toddy tappers, beedi workers, HIV, filaria, dialysis</td><td>₹2,016</td><td>₹4,000</td></tr>
          <tr><td>Persons with disabilities</td><td>₹4,016</td><td>₹6,000</td></tr>
        </table>
        </div>
        <p>We will update this page as soon as the government confirms the amounts being paid.</p>

        <h2>2026 enrolment for new pensions</h2>
        <ul>
          <li>In 2026 the government announced about <strong>2 lakh new pensions</strong>.</li>
          <li>Applications were accepted for <strong>widows, single women, persons with disabilities, toddy tappers, weavers, filaria patients, dialysis patients</strong>, and the new categories (thalassemia, sickle cell, haemophilia).</li>
          <li><strong>Senior citizens, HIV patients and beedi workers were not part of this enrolment round.</strong></li>
          <li>The last date was 31 August 2026, extended to <strong>15 September 2026</strong> in some districts.</li>
          <li>Applications given earlier through Praja Palana, the 99-day Pragathi Pranalika Gram Sabhas or Prajavani are processed automatically. You don't need to apply again.</li>
        </ul>

        <h2>How to apply (when enrolment is open)</h2>
        <ol>
          <li>Villages: apply through the <strong>Panchayat Secretary</strong> or the <strong>MPDO</strong> office.</li>
          <li>Towns: apply through the <strong>Ward Officer</strong> or <strong>Municipal Commissioner</strong> (Deputy Commissioner in municipal corporations).</li>
          <li>You can also apply through <strong>MeeSeva</strong>.</li>
          <li>Your application is entered on the Cheyutha portal, checked in the field, verified by the department and approved by the District Collector.</li>
        </ol>

        <h2>Documents usually needed</h2>
        <ul>
          <li>Aadhaar card</li>
          <li>White ration card</li>
          <li>Bank account details (linked to Aadhaar)</li>
          <li>Category proof: husband's death certificate (widows), SADAREM disability certificate, medical certificates (dialysis, thalassemia, etc.), or occupation proof (weavers, toddy tappers)</li>
          <li>Passport-size photograph</li>
        </ul>

        <div class="official">
          <strong>Help:</strong> Panchayat Secretary / MPDO (villages), Ward Officer / Municipal Commissioner (towns), or MeeSeva<br>
          <strong>Health cover for pensioners:</strong> <a href="/schemes/ts-rajiv-aarogyasri/">Rajiv Aarogyasri</a>
        </div>
''',
    faqs=[
        ("How much is the old age pension in Telangana?", "Reports differ. Some government pages list ₹4,000 a month, but an October 2026 news report says senior citizens still receive ₹2,016 and the promised increase hasn't been implemented. Check with your MPDO or the amount credited to your account."),
        ("Can senior citizens apply for a new Cheyutha pension now?", "Senior citizens were not included in the 2026 enrolment round, which accepted widows, single women, persons with disabilities, toddy tappers, weavers, filaria and dialysis patients, and new illness categories."),
        ("Who got new pensions in 2026?", "Persons with thalassemia, sickle cell disease and haemophilia were added, with distribution to identified beneficiaries starting from 15 August 2026."),
        ("Where do I apply for a Cheyutha pension?", "Through the Panchayat Secretary or MPDO in villages, the Ward Officer or Municipal Commissioner in towns, or MeeSeva, when enrolment is open."),
        ("Do I need to apply again if I applied in Praja Palana?", "No. Earlier complete applications from Praja Palana, the 99-day Gram Sabhas and Prajavani are processed automatically."),
    ],
    sources=[
        ("Warangal district (telangana.gov.in): Cheyutha Scheme", "https://warangal.telangana.gov.in/scheme/cheyutha-scheme/"),
        ("Siasat: Applications invited for Cheyutha pension scheme (Aug 2026)", "https://www.siasat.com/applications-invited-for-cheyutha-pension-scheme-in-telangana-3523654/"),
        ("The Hans India: Cheyutha application deadline extended to 15 September", "https://www.thehansindia.com/news/cities/warangal/telangana-extends-cheyutha-pension-application-deadline-to-september-15-1116222"),
        ("The Hans India: Thalassemia, sickle cell patients to get pensions (Aug 2026)", "https://www.thehansindia.com/telangana/thalassemia-sickle-cell-patients-to-get-pensions-cm-revanth-1103640"),
        ("Telangana Today: Senior citizens still await ₹4,000 pension promise (1 Oct 2026)", "https://telanganatoday.com/three-years-on-telangana-senior-citizens-still-await-congress-rs-4000-pension-promise"),
    ]))

# ---------------------------------------------------------------- girls & women batch (added 8 Oct 2026)

# ---- AICTE Pragati Scholarship
s = BY_SLUG["aicte-pragati-scholarship"]
write(f"schemes/{s['slug']}/index.html", article(s,
    lede="The AICTE Pragati Scholarship gives ₹50,000 a year to girl students in technical courses such as engineering, pharmacy and polytechnic diplomas, to help with fees, books and a computer. For 2026-27, applications on the National Scholarship Portal close on 31 October 2026.",
    description="AICTE Pragati Scholarship for girls explained: ₹50,000 a year for degree and diploma students, eligibility, income limit, documents, how to apply on NSP, 2026-27 last date.",
    facts=[("Scholarship", "₹50,000 / year"), ("For", "Girls in AICTE courses"), ("Family income", "Below ₹8 lakh"), ("2026-27 last date", "31 Oct 2026")],
    body='''
        <h2>What is the Pragati Scholarship?</h2>
        <p>The All India Council for Technical Education (AICTE) has run the Pragati Scholarship since 2014-15 to encourage girls to study technical subjects. Every year about <strong>10,000 scholarships</strong> are given (5,000 for degree and 5,000 for diploma students) in most states, and in some states and union territories, including the North-East and Jammu &amp; Kashmir, <strong>all eligible girls</strong> get it.</p>

        <div class="note"><strong>2026-27 applications are open now.</strong> The window on the National Scholarship Portal opened on 1 June 2026 and closes on <strong>31 October 2026</strong>. Apply early, because your college must also verify your application.</div>

        <h2>Benefits</h2>
        <ul>
          <li><strong>₹50,000 per year</strong>, paid directly to the student's bank account.</li>
          <li>Can be used for college fees, books, a computer, equipment, software and similar study costs.</li>
          <li>Renewed every year of the course on promotion to the next year.</li>
        </ul>

        <h2>Who can apply?</h2>
        <ul>
          <li>Girl students admitted to the <strong>1st year of a degree or diploma</strong> course in an <strong>AICTE-approved</strong> institution, or the <strong>2nd year through lateral entry</strong>.</li>
          <li>Total family income <strong>less than ₹8 lakh per year</strong>.</li>
          <li>A maximum of <strong>two girls per family</strong>.</li>
          <li>Selection is on merit: Class 12 marks for degree, Class 10 marks for diploma.</li>
          <li>Reservation: 15% SC, 7.5% ST and 27% OBC.</li>
        </ul>

        <h2>Documents usually needed</h2>
        <ul>
          <li>Class 10 and/or Class 12 marks memo</li>
          <li>Admission letter and fee receipt</li>
          <li>Income certificate issued by the state government</li>
          <li>Caste certificate (SC/ST/OBC-NCL), if applicable</li>
          <li>Aadhaar and an Aadhaar-seeded bank account in the student's name</li>
          <li>Bonafide certificate from the institution</li>
        </ul>

        <h2>How to apply</h2>
        <ol>
          <li>Go to the <a href="https://scholarships.gov.in" target="_blank" rel="noopener">National Scholarship Portal (scholarships.gov.in)</a> and register (One Time Registration with Aadhaar).</li>
          <li>Choose the <strong>AICTE Pragati Scholarship</strong> (degree or diploma).</li>
          <li>Fill in the form and upload your documents.</li>
          <li>Your <strong>college verifies</strong> the application, then the state's technical education department checks it.</li>
          <li>Selected students receive the money by DBT. Apply for renewal each year with your promotion certificate.</li>
        </ol>

        <div class="official">
          <strong>Apply at:</strong> <a href="https://scholarships.gov.in" target="_blank" rel="noopener">scholarships.gov.in</a><br>
          <strong>Scheme details:</strong> <a href="https://www.aicte-india.org/schemes/students-development-schemes" target="_blank" rel="noopener">AICTE Student Development Schemes</a>
        </div>
''',
    faqs=[
        ("How much is the Pragati Scholarship?", "₹50,000 per year for each year of the course, paid by DBT."),
        ("What is the last date for Pragati Scholarship 2026-27?", "31 October 2026 on the National Scholarship Portal (the window opened on 1 June 2026)."),
        ("Can two sisters get the Pragati Scholarship?", "Yes. A maximum of two girls per family can get it."),
        ("What is the income limit for Pragati?", "Total family income must be less than ₹8 lakh per year."),
        ("Is Pragati only for engineering?", "It is for girls in AICTE-approved technical degree and diploma courses, such as engineering, pharmacy, architecture and polytechnic diplomas."),
    ],
    sources=[
        ("PIB: Scholarship scheme under AICTE to encourage girl students (Pragati)", "https://www.pib.gov.in/PressReleasePage.aspx?PRID=1779333"),
        ("AICTE: Pragati – General Instructions", "https://www.aicte-india.org/schemes/students-development-schemes/Pragati/General-Instructions"),
        ("National Scholarship Portal", "https://scholarships.gov.in"),
    ]))

# ---- CBSE Single Girl Child Scholarship
s = BY_SLUG["cbse-single-girl-child-scholarship"]
write(f"schemes/{s['slug']}/index.html", article(s,
    lede="The CBSE Merit Scholarship for Single Girl Child gives ₹1,000 a month to girls who are the only child of their parents and scored 70% or more in the CBSE Class 10 exam, for their Class 11 and 12 studies.",
    description="CBSE Single Girl Child Scholarship explained: ₹1,000 a month for Class 11-12, 70% in Class 10, only-child rule, fee and income limits, renewal and how to apply.",
    facts=[("Scholarship", "₹1,000 / month"), ("For", "Classes 11 & 12"), ("Class 10 marks", "70% or more"), ("Family income", "Up to ₹8 lakh")],
    body='''
        <h2>What is this scholarship?</h2>
        <p>The Central Board of Secondary Education (CBSE) rewards parents who support their only daughter's education. Every single girl child who meets the conditions gets the scholarship. There is no fixed number of awards.</p>

        <h2>Benefits</h2>
        <ul>
          <li><strong>₹1,000 per month</strong> during Class 11 and Class 12 (up to two years).</li>
          <li>You can also keep other fee concessions from your school or other organisations.</li>
        </ul>

        <h2>Who can apply?</h2>
        <ul>
          <li>A girl who is the <strong>only child</strong> of her parents. Twins or triplets who are all girls are also treated as single girl children.</li>
          <li>Passed the <strong>CBSE Class 10</strong> exam with <strong>70% or more</strong> marks.</li>
          <li>Studying Class 11 and 12 in a <strong>CBSE-affiliated school</strong>.</li>
          <li>Tuition fee: not more than <strong>₹2,500 per month</strong> in Class 10, and not more than <strong>₹3,000 per month</strong> in Class 11 and 12 (₹6,000 for NRI students).</li>
          <li>Gross family income up to <strong>₹8 lakh per year</strong>.</li>
          <li>Indian nationals (NRI students of CBSE can apply).</li>
        </ul>

        <h2>Renewal for Class 12</h2>
        <p>To continue in Class 12, the student must be promoted with <strong>70% or more</strong> marks in Class 11 and apply for renewal. Good conduct and regular attendance are required. Changing school or stream needs CBSE's approval.</p>

        <h2>How to apply</h2>
        <ol>
          <li>Watch for the CBSE notice. Applications usually open a few months after the Class 10 results.</li>
          <li>Apply online on the <a href="https://www.cbse.gov.in/cbsenew/scholar.html" target="_blank" rel="noopener">CBSE scholarship page</a>.</li>
          <li>Upload the affidavit that she is the only child (in the format CBSE gives), the fee certificate, income details and bank details.</li>
          <li>The school verifies the application.</li>
        </ol>
        <div class="note">The marks requirement was raised from 60% to <strong>70%</strong> in recent years. Always check the latest CBSE notice for the current year's rules and dates.</div>

        <div class="official">
          <strong>Official page:</strong> <a href="https://www.cbse.gov.in/cbsenew/scholar.html" target="_blank" rel="noopener">CBSE Scholarships</a><br>
          <strong>Email:</strong> scholarship.cbse@nic.in
        </div>
''',
    faqs=[
        ("How much is the CBSE Single Girl Child Scholarship?", "₹1,000 per month for Class 11 and Class 12."),
        ("How many marks are needed?", "70% or more in the CBSE Class 10 exam, and 70% or more in Class 11 to renew for Class 12."),
        ("Are twin girls eligible?", "Yes. All girl children born together are treated as single girl children of their parents."),
        ("What is the fee limit?", "Tuition fee up to ₹3,000 per month in Class 11 and 12 (₹2,500 in Class 10; ₹6,000 for NRIs)."),
        ("Is there an income limit?", "Yes. Gross family income must be up to ₹8 lakh per year."),
    ],
    sources=[
        ("CBSE: Guidelines for Single Girl Child Merit Scholarship (PDF)", "https://www.cbse.gov.in/cbsenew/scholar/Guidelines_SGC_2025.pdf"),
        ("CBSE Scholarships page", "https://www.cbse.gov.in/cbsenew/scholar.html"),
    ]))

# ---- Lakhpati Didi
s = BY_SLUG["lakhpati-didi"]
write(f"schemes/{s['slug']}/index.html", article(s,
    lede="Lakhpati Didi helps women in rural self-help groups (SHGs) earn at least ₹1 lakh a year for their family, through low-cost loans, training and help to start or grow small businesses. Over 3 crore women had become Lakhpati Didis by May 2026.",
    description="Lakhpati Didi scheme explained: who is a Lakhpati Didi, how SHG women get loans, revolving fund and training, how to join a self-help group, AP and Telangana details.",
    facts=[("Goal", "₹1 lakh+ income / year"), ("For", "Rural SHG women"), ("Achieved", "3.07 crore (May 2026)"), ("Run under", "DAY-NRLM")],
    body='''
        <h2>What is Lakhpati Didi?</h2>
        <p>A <strong>Lakhpati Didi</strong> is a self-help group (SHG) member whose household earns <strong>₹1 lakh or more a year</strong> on a sustained basis. The initiative, started in 2023, works through the government's rural livelihood mission, <strong>DAY-NRLM</strong> (Deendayal Antyodaya Yojana – National Rural Livelihoods Mission). By May 2026, <strong>3.07 crore</strong> rural women had become Lakhpati Didis.</p>

        <h2>What support do women get?</h2>
        <ul>
          <li><strong>Revolving Fund</strong> of ₹20,000–₹30,000 per eligible SHG, to start lending within the group.</li>
          <li><strong>Community Investment Fund</strong> of up to ₹2.5 lakh per SHG, through village and cluster federations, for members' income activities.</li>
          <li><strong>Bank loans</strong> to SHGs at low interest, with interest subvention in many districts.</li>
          <li><strong>Training</strong> in business, money management and digital skills. A National Campaign on Entrepreneurship started in January 2026 to train 50 lakh SHG members.</li>
          <li>Help to start livelihoods such as dairy, poultry, tailoring, food processing, shops, and services like <strong>Drone Didi</strong> (farm drones) and <strong>Bank Sakhi</strong>.</li>
        </ul>

        <h2>Who can join?</h2>
        <ul>
          <li>Women from poor rural households can join a <strong>self-help group</strong> of usually 10–20 women in their village.</li>
          <li>SHG members who are active and want to start or grow an income activity get the Lakhpati Didi support.</li>
        </ul>

        <h2>How to join</h2>
        <ol>
          <li>Ask your village's SHG leader, Village Organisation, or the <strong>Community Resource Person (CRP)</strong> to add you to an SHG.</li>
          <li>Attend weekly meetings, save small amounts regularly and keep records.</li>
          <li>After the SHG is graded, it can get the revolving fund and bank loans.</li>
          <li>Make a simple business plan with the CRP's help to use the loan for an income activity.</li>
        </ol>

        <h3>In Andhra Pradesh and Telangana</h3>
        <ul>
          <li><strong>Andhra Pradesh:</strong> SHGs are supported by SERP (rural) and MEPMA (towns). Ask at your village/ward secretariat.</li>
          <li><strong>Telangana:</strong> SHGs are supported by SERP and MEPMA, and also get interest-free loans up to ₹10 lakh under <a href="/schemes/ts-indira-mahila-shakti/">Indira Mahila Shakti</a>.</li>
        </ul>

        <div class="official">
          <strong>Official:</strong> <a href="https://aajeevika.gov.in" target="_blank" rel="noopener">aajeevika.gov.in</a> (DAY-NRLM, Ministry of Rural Development)
        </div>
''',
    faqs=[
        ("Who is a Lakhpati Didi?", "A self-help group member whose household earns ₹1 lakh or more a year on a sustained basis."),
        ("How many Lakhpati Didis are there?", "Over 3.07 crore rural women had become Lakhpati Didis by May 2026."),
        ("Do I get ₹1 lakh directly from the government?", "No. The scheme helps you earn ₹1 lakh a year through SHG loans, training and business support. It is not a direct cash payment."),
        ("How do I join a self-help group?", "Contact your village SHG leader, Village Organisation or Community Resource Person (CRP), or ask at your village/ward secretariat."),
        ("What businesses can Lakhpati Didis do?", "Dairy, poultry, tailoring, food processing, small shops, services such as drone spraying (Drone Didi) and banking help (Bank Sakhi), and more."),
    ],
    sources=[
        ("PIB: Lakhpati Didi scheme", "https://www.pib.gov.in/PressNoteDetails.aspx?NoteId=152064&ModuleId=3"),
        ("PIB: Key interventions for women's economic advancement (Mar 2026, PDF)", "https://static.pib.gov.in/WriteReadData/specificdocs/documents/2026/mar/doc202636813101.pdf"),
        ("PIB: Department of Rural Development Year Ender 2025", "https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2210378"),
    ]))

# ---- TS: Indira Mahila Shakti
s = BY_SLUG["ts-indira-mahila-shakti"]
write(f"schemes/{s['slug']}/index.html", article(s,
    lede="Indira Mahila Shakti is the Telangana government's programme to make women in self-help groups into business owners. SHGs get interest-free bank loans of up to ₹10 lakh, and help to run businesses like canteens, RTC buses, petrol bunks and solar plants.",
    description="Indira Mahila Shakti (Telangana) explained: interest-free SHG loans up to ₹10 lakh (Vaddi Leni Runalu), women-run canteens, buses, petrol bunks, solar plants, how to join.",
    facts=[("Interest-free loan", "Up to ₹10 lakh / SHG"), ("Women covered", "About 63 lakh"), ("Raised from", "₹5 lakh (May 2026)"), ("Goal", "1 crore women crorepatis")],
    body='''
        <h2>What is Indira Mahila Shakti?</h2>
        <p>Indira Mahila Shakti is the Telangana government's umbrella programme for women's self-help groups (SHGs). Its aim is to turn SHG women into entrepreneurs. The government has said it wants to give <strong>₹1 lakh crore in interest-free loans</strong> to women's groups over five years and make <strong>one crore women "crorepatis."</strong></p>

        <h2>Interest-free loans (Vaddi Leni Runalu)</h2>
        <ul>
          <li>The state government <strong>pays the interest</strong> on bank loans taken by SHGs, so the loan is interest-free for the women.</li>
          <li>In May 2026 the limit was <strong>raised from ₹5 lakh to ₹10 lakh per SHG</strong>. About <strong>63 lakh women</strong> in SHGs are expected to benefit.</li>
          <li>The group must repay the loan on time to keep getting the interest-free benefit.</li>
        </ul>

        <h2>Businesses run by women's groups</h2>
        <p>Under Indira Mahila Shakti, SHGs have been helped to run:</p>
        <ul>
          <li><strong>Indira Mahila Shakti canteens</strong></li>
          <li><strong>RTC buses</strong> hired out to TGSRTC, with the hire charges paid to the women's groups</li>
          <li><strong>Petrol bunks</strong></li>
          <li><strong>Solar power plants</strong></li>
          <li>Dairy and poultry units, Mahila Marts and warehouses</li>
        </ul>

        <h2>Who can benefit?</h2>
        <ul>
          <li>Women who are members of a <strong>self-help group</strong> in Telangana, in villages (SERP) or towns (MEPMA).</li>
          <li>SHGs that save regularly, keep records and repay loans on time.</li>
        </ul>

        <h2>How to join</h2>
        <ol>
          <li>Join or form a self-help group through your village SHG leader, Village Organisation or Community Resource Person.</li>
          <li>In towns, contact the MEPMA staff at your municipality.</li>
          <li>Once your SHG is active, the group can apply for a bank loan through the SHG federation. The interest is reimbursed by the government.</li>
          <li>For business units like canteens or buses, watch for announcements from your district's DRDA/SERP office and apply through your federation.</li>
        </ol>

        <div class="official">
          <strong>Help:</strong> your Village Organisation / Mandal Samakhya (SERP) in villages, MEPMA office in towns<br>
          <strong>Related:</strong> <a href="/schemes/lakhpati-didi/">Lakhpati Didi</a> (central support for SHG women)
        </div>
''',
    faqs=[
        ("What is the interest-free loan limit for SHGs in Telangana?", "Up to ₹10 lakh per SHG. The limit was raised from ₹5 lakh in May 2026, and the government pays the interest."),
        ("Who can get Indira Mahila Shakti benefits?", "Women who are members of active self-help groups in Telangana, through SERP in villages and MEPMA in towns."),
        ("What businesses do women's groups run under Indira Mahila Shakti?", "Canteens, RTC buses hired to TGSRTC, petrol bunks, solar plants, dairy and poultry units, Mahila Marts and warehouses."),
        ("Do individual women get the loan?", "The loan goes to the self-help group, which lends to its members for income activities."),
        ("How do I join a self-help group in Telangana?", "Contact your village SHG leader, Village Organisation or Community Resource Person, or the MEPMA office in your town."),
    ],
    sources=[
        ("The Hans India: State raises interest-free loan limit for SHGs to ₹10 lakh (May 2026)", "https://www.thehansindia.com/telangana/state-govt-raises-interest-free-loan-limit-for-shgs-to-rs-10l-1073333"),
        ("Deccan Chronicle: ₹1 lakh crore interest-free loans to women's groups in five years", "https://www.deccanchronicle.com/southern-states/telangana/govt-to-give-rs1lakh-cr-interest-free-loans-to-womens-groups-in-five-years-bhatti-1833503"),
        ("Deccan Chronicle: Indira Mahila Shakti canteen launched in Hyderabad", "https://www.deccanchronicle.com/southern-states/telangana/ponnam-launches-indira-mahila-shakti-canteen-in-hyderabad-1991183"),
    ]))

# ---- Collection: For girls & women
def coll_group(title, intro, slugs):
    cards = "".join(scheme_card(BY_SLUG[x]) for x in slugs if x in BY_SLUG)
    return f"""
    <section style="padding:40px 0">
      <div class="section-head">
        <h2>{title}</h2>
        <p>{intro}</p>
      </div>
      <div class="grid">
{cards}      </div>
    </section>
"""

write("schemes/for-women/index.html",
    head("Government Schemes for Girls and Women: Education, Business & Support | Kramavriddhi",
         "All government schemes for girls and women in one place: scholarships, savings for daughters, self-employment loans, SHG support, free bus travel, gas and pensions. Central, AP and Telangana.",
         "/schemes/for-women/")
    + nav("schemes") + f"""
    <p class="crumbs"><a href="/">Home</a> › <a href="/schemes/">Schemes</a> › For girls &amp; women</p>
    <header class="page-head">
      <div class="eyebrow">Collection</div>
      <h1>Schemes for girls &amp; women</h1>
      <p>Scholarships, savings, business loans and everyday support for girls and women, from the Central Government, Andhra Pradesh and Telangana, all in one place.</p>
    </header>
    <a class="cta" href="/tools/scheme-eligibility-checker/"><span>✅</span><div><strong>Find what fits you</strong><br><span class="muted" style="font-size:0.9rem">Answer a few questions in our eligibility checker.</span></div></a>
""" + coll_group("🎓 Education", "Help for girls to study, from school to technical degrees.",
        ["sukanya-samriddhi-yojana", "cbse-single-girl-child-scholarship", "aicte-pragati-scholarship", "ap-thalliki-vandanam"])
    + coll_group("💼 Self-employment & business", "Loans, training and support for women who want to earn.",
        ["lakhpati-didi", "ts-indira-mahila-shakti", "pm-mudra-yojana"])
    + """
    <div class="note"><strong>Being relaunched:</strong> <strong>Stand-Up India</strong> (bank loans of ₹10 lakh–₹1 crore for women and SC/ST entrepreneurs) ended in March 2025 and the government announced in March 2026 that a revamped version is being prepared. <strong>PMEGP</strong> (subsidy for new businesses, with a higher subsidy for women) ran until 31 March 2026, and its extension is under consideration. We will add full guides when the new rules are announced.</div>
""" + coll_group("🛡️ Everyday support", "Travel, cooking gas, pensions and housing support for women and their families.",
        ["ts-mahalakshmi", "ap-stree-shakti", "ap-deepam-2", "ap-ntr-bharosa-pension", "ts-cheyutha-pension", "pm-jan-dhan-yojana"])
    + """    <div style="height:24px"></div>
""" + FOOTER)

# ---- state hub pages
def state_hub(key, intro, slug):
    items = [x for x in DISPLAY if st(x) == key]
    label = STATES[key]["label"]
    write(f"schemes/{slug}/index.html",
        head(f"{label} Government Schemes Explained Simply | Kramavriddhi",
             f"Simple guides to {label} government schemes: eligibility, benefits, documents and how to apply. Updated regularly.",
             f"/schemes/{slug}/")
        + nav("schemes") + f"""
    <p class="crumbs"><a href="/">Home</a> › <a href="/schemes/">Schemes</a> › {label}</p>
    <header class="page-head">
      <div class="eyebrow">State schemes</div>
      <h1>{label} government schemes</h1>
      <p>{intro}</p>
      <p class="lang-switch"><a href="/te/schemes/" lang="te">తెలుగులో పథకాలు చదవండి →</a></p>
    </header>
    <div class="grid">
{"".join(scheme_card(x) for x in items)}    </div>
    <div class="note" style="margin-top:32px">State schemes change often. Each guide shows when it was last updated. Always confirm details at your village/ward secretariat or on the official portal before applying.</div>
    <p style="margin:24px 0 48px">Looking for central schemes too? <a href="/schemes/?state=central">See all central government schemes →</a></p>
""" + FOOTER)

state_hub("ap", "Guides to Andhra Pradesh state schemes for farmers, pensioners, mothers and students, explained in simple language.", "andhra-pradesh")
state_hub("ts", "Guides to Telangana state schemes for farmers, women and families, explained in simple language.", "telangana")

# ---------------------------------------------------------------- tools
# Official APY monthly contribution chart (jansuraksha.gov.in APY.pdf, Annex-1)
# entry age: [[monthly, quarterly, half-yearly] for ₹1000, ₹2000, ₹3000, ₹4000, ₹5000]
APY_CHART = {
    18: [[42, 125, 248], [84, 250, 496], [126, 376, 744], [168, 501, 991], [210, 626, 1239]],
    19: [[46, 137, 271], [92, 274, 543], [138, 411, 814], [183, 545, 1080], [228, 679, 1346]],
    20: [[50, 149, 295], [100, 298, 590], [150, 447, 885], [198, 590, 1169], [248, 739, 1464]],
    21: [[54, 161, 319], [108, 322, 637], [162, 483, 956], [215, 641, 1269], [269, 802, 1588]],
    22: [[59, 176, 348], [117, 349, 690], [177, 527, 1045], [234, 697, 1381], [292, 870, 1723]],
    23: [[64, 191, 378], [127, 378, 749], [192, 572, 1133], [254, 757, 1499], [318, 948, 1877]],
    24: [[70, 209, 413], [139, 414, 820], [208, 620, 1228], [277, 826, 1635], [346, 1031, 2042]],
    25: [[76, 226, 449], [151, 450, 891], [226, 674, 1334], [301, 897, 1776], [376, 1121, 2219]],
    26: [[82, 244, 484], [164, 489, 968], [246, 733, 1452], [327, 975, 1930], [409, 1219, 2414]],
    27: [[90, 268, 531], [178, 530, 1050], [268, 799, 1582], [356, 1061, 2101], [446, 1329, 2632]],
    28: [[97, 289, 572], [194, 578, 1145], [292, 870, 1723], [388, 1156, 2290], [485, 1445, 2862]],
    29: [[106, 316, 626], [212, 632, 1251], [318, 948, 1877], [423, 1261, 2496], [529, 1577, 3122]],
    30: [[116, 346, 685], [231, 688, 1363], [347, 1034, 2048], [462, 1377, 2727], [577, 1720, 3405]],
    31: [[126, 376, 744], [252, 751, 1487], [379, 1129, 2237], [504, 1502, 2974], [630, 1878, 3718]],
    32: [[138, 411, 814], [276, 823, 1629], [414, 1234, 2443], [551, 1642, 3252], [689, 2053, 4066]],
    33: [[151, 450, 891], [302, 900, 1782], [453, 1350, 2673], [602, 1794, 3553], [752, 2241, 4438]],
    34: [[165, 492, 974], [330, 983, 1948], [495, 1475, 2921], [659, 1964, 3889], [824, 2456, 4863]],
    35: [[181, 539, 1068], [362, 1079, 2136], [543, 1618, 3205], [722, 2152, 4261], [902, 2688, 5323]],
    36: [[198, 590, 1169], [396, 1180, 2337], [594, 1770, 3506], [792, 2360, 4674], [990, 2950, 5843]],
    37: [[218, 650, 1287], [436, 1299, 2573], [654, 1949, 3860], [870, 2593, 5134], [1087, 3239, 6415]],
    38: [[240, 715, 1416], [480, 1430, 2833], [720, 2146, 4249], [957, 2852, 5648], [1196, 3564, 7058]],
    39: [[264, 787, 1558], [528, 1574, 3116], [792, 2360, 4674], [1054, 3141, 6220], [1318, 3928, 7778]],
    40: [[291, 867, 1717], [582, 1734, 3435], [873, 2602, 5152], [1164, 3469, 6869], [1454, 4333, 8581]],
}

TOOLS = [
    dict(slug="atal-pension-calculator", name="Atal Pension Yojana Calculator", icon="👴",
         summary="Enter your age and see how much you need to pay each month for a ₹1,000 to ₹5,000 pension."),
    dict(slug="sukanya-samriddhi-calculator", name="Sukanya Samriddhi Calculator", icon="👧",
         summary="See how much your daughter's SSY account could grow to by maturity, year by year."),
]

def tool_card(t):
    return f'''        <a class="card" href="/tools/{t["slug"]}/">
          <div class="icon" aria-hidden="true">{t["icon"]}</div>
          <h3>{t["name"]}</h3>
          <p>{t["summary"]}</p>
          <span class="tag">Calculator</span>
        </a>
'''

# ---------------------------------------------------------------- eligibility checker (English + Telugu)
TOOLS.insert(0, dict(slug="scheme-eligibility-checker", name="Which Schemes Am I Eligible For?", icon="✅",
    summary="Answer a few simple questions and see the central, Andhra Pradesh and Telangana schemes that may suit you."))

CHECKER_TEXT = {
    "en": dict(
        path="/tools/scheme-eligibility-checker/",
        title="Which Government Schemes Am I Eligible For? Free Checker | Kramavriddhi",
        desc="Free scheme eligibility checker: answer a few questions to find central, Andhra Pradesh and Telangana government schemes that may suit you, with simple guides.",
        crumbs='<a href="/">Home</a> › <a href="/tools/">Tools</a> › Scheme Eligibility Checker',
        eyebrow="✅ Free tool", h1="Which schemes am I eligible for?",
        lede="Answer a few simple questions to see which government schemes may suit you. It takes less than a minute, and nothing you enter leaves your phone or computer.",
        switch='<a href="/te/tools/scheme-eligibility-checker/" lang="te">తెలుగులో చూడండి →</a>',
        q_state="Where do you live?", states=[("ap", "Andhra Pradesh"), ("ts", "Telangana"), ("other", "Another state")],
        q_area="Village or town?", areas=[("rural", "Village (rural)"), ("urban", "Town or city (urban)")],
        q_age="Your age",
        q_gender="You are", genders=[("f", "Woman / girl"), ("m", "Man / boy"), ("t", "Transgender person")],
        q_income="Family income per year", incomes=[("1", "Up to ₹2 lakh"), ("3", "₹2 – 3 lakh"), ("6", "₹3 – 6 lakh"), ("9", "₹6 – 9 lakh"), ("99", "More than ₹9 lakh")],
        q_checks="Tick everything that applies to you",
        checks=[
            ("ration", "Our family has a ration card (white / rice / BPL card)"),
            ("farmland", "Our family owns farm land"),
            ("bank", "I have a bank or post office account"),
            ("incometax", "I or my family pay income tax"),
            ("govtjob", "Someone in the family is a government employee or pensioner"),
            ("pucca", "Our family already owns a pucca (concrete) house"),
            ("lpg", "We have an LPG gas connection"),
            ("daughter", "I have a daughter below 10 years"),
            ("school", "We have children studying in Classes 1–12"),
            ("techstudent", "I am in (or joining) a degree or diploma course like engineering, pharmacy or polytechnic"),
            ("business", "I want a loan to start or grow a small business"),
            ("widow", "I am a widow or single woman"),
            ("disabled", "I or a family member have a disability"),
        ],
        button="Show my schemes",
        note="This checker gives a <strong>first idea only</strong>, based on the main rules of each scheme. Every scheme has more detailed conditions, so open each guide and confirm on the official portal, or at your village/ward secretariat, before applying. Kramavriddhi is not a government website and never asks for your Aadhaar, bank details or any fee.",
        none='<strong>No matches from our guides yet.</strong><p>Try changing your answers, or <a href="/schemes/">browse all schemes</a>. We add new guides every week.</p>',
        count_one="scheme may suit you", count_many="schemes may suit you",
        open_each="Open each guide to check the full rules and how to apply.", why="Why:",
        tags={"central": "Central", "ap": "Andhra Pradesh", "ts": "Telangana"},
        W=dict(
            kisan="Your family owns farm land and doesn't pay income tax.",
            jay70="Everyone aged 70 or above gets ₹5 lakh health cover, whatever their income.",
            jayPoor="Families with a BPL / ration card are often covered. Check your name on the official site.",
            ssy="You have a daughter below 10 years.",
            pmayu="You live in a town, don't own a pucca house, and your income is within ₹9 lakh.",
            pmayg="You live in a village and don't own a pucca house.",
            mudra="You want a loan for a small business. Mudra gives up to ₹20 lakh without collateral.",
            apy="You are 18–40 and don't pay income tax, so you can join for a pension after 60.",
            jdy="You don't have a bank account yet. Open a zero-balance account.",
            pmjjby="You are 18–50: ₹2 lakh life cover for ₹436 a year.",
            pmsby="You are 18–70: ₹2 lakh accident cover for ₹20 a year.",
            apAnnadata="AP farmer family: ₹20,000 a year with PM-KISAN.",
            apNtr60="You are 60+ with a rice card.",
            apNtrDis="Your family has a person with disability and a rice card.",
            apNtrWidow="You are a widow or single woman with a rice card.",
            apThalliki="You have school-going children and a rice card: ₹15,000 per child per year.",
            apDeepam="Rice card and LPG connection: three free cylinders a year.",
            apStree="Free travel in APSRTC ordinary and express buses.",
            tsRythu="Telangana farmer: ₹12,000 per acre per year.",
            tsMahaBus="Free TGSRTC bus travel.",
            tsMahaBusGas="Free TGSRTC bus travel, and ₹500 gas cylinders for your family.",
            tsMahaGas="₹500 gas cylinders for white ration card families with LPG.",
            tsIndiramma="White ration card, income under ₹2 lakh and no pucca house: up to ₹5 lakh to build.",
            tsGruha="White ration card families get a zero bill up to 200 units a month.",
            tsAarogya="White ration card families get health cover up to ₹10 lakh a year.",
            tsCheyDis="Persons with disabilities from white ration card families can get a monthly pension.",
            tsCheyWidow="Widows and single women from white ration card families can get a monthly pension.",
            tsCheyOld="Elderly people from white ration card families get a monthly pension (new enrolment for seniors was not open in 2026).",
            pragati="Girls in AICTE degree or diploma courses with family income below ₹8 lakh can get ₹50,000 a year.",
            lakhpati="Women in rural self-help groups get low-cost loans and training to earn ₹1 lakh+ a year.",
            tsMahilaShakti="Telangana SHG women get interest-free loans up to ₹10 lakh per group.",
        ),
    ),
    "te": dict(
        path="/te/tools/scheme-eligibility-checker/",
        title="నాకు ఏ ప్రభుత్వ పథకాలు వర్తిస్తాయి? ఉచిత చెకర్ | Kramavriddhi",
        desc="ఉచిత పథకాల అర్హత చెకర్: కొన్ని ప్రశ్నలకు సమాధానం ఇచ్చి మీకు వర్తించే కేంద్ర, ఆంధ్రప్రదేశ్, తెలంగాణ ప్రభుత్వ పథకాలు తెలుసుకోండి.",
        crumbs='<a href="/">హోమ్</a> › <a href="/te/schemes/">తెలుగు పథకాలు</a> › అర్హత చెకర్',
        eyebrow="✅ ఉచిత సాధనం", h1="నాకు ఏ పథకాలు వర్తిస్తాయి?",
        lede="కొన్ని సులభమైన ప్రశ్నలకు సమాధానం ఇవ్వండి, మీకు ఏ ప్రభుత్వ పథకాలు సరిపోతాయో చూడండి. ఒక నిమిషం కూడా పట్టదు. మీరు ఇచ్చే సమాచారం మీ ఫోన్ లేదా కంప్యూటర్ దాటి ఎక్కడికీ వెళ్ళదు.",
        switch='<a href="/tools/scheme-eligibility-checker/" lang="en">Use in English →</a>',
        q_state="మీరు ఎక్కడ నివసిస్తున్నారు?", states=[("ap", "ఆంధ్రప్రదేశ్"), ("ts", "తెలంగాణ"), ("other", "ఇతర రాష్ట్రం")],
        q_area="గ్రామమా, పట్టణమా?", areas=[("rural", "గ్రామం"), ("urban", "పట్టణం / నగరం")],
        q_age="మీ వయసు",
        q_gender="మీరు", genders=[("f", "మహిళ / బాలిక"), ("m", "పురుషుడు / బాలుడు"), ("t", "ట్రాన్స్‌జెండర్")],
        q_income="కుటుంబ వార్షిక ఆదాయం", incomes=[("1", "₹2 లక్షల వరకు"), ("3", "₹2 – 3 లక్షలు"), ("6", "₹3 – 6 లక్షలు"), ("9", "₹6 – 9 లక్షలు"), ("99", "₹9 లక్షల కంటే ఎక్కువ")],
        q_checks="మీకు వర్తించే వాటన్నింటినీ టిక్ చేయండి",
        checks=[
            ("ration", "మా కుటుంబానికి రేషన్ కార్డు ఉంది (తెల్ల / బియ్యం / BPL కార్డు)"),
            ("farmland", "మా కుటుంబానికి వ్యవసాయ భూమి ఉంది"),
            ("bank", "నాకు బ్యాంకు లేదా పోస్టాఫీసు ఖాతా ఉంది"),
            ("incometax", "నేను లేదా మా కుటుంబం ఆదాయపు పన్ను కడతాం"),
            ("govtjob", "మా కుటుంబంలో ఎవరైనా ప్రభుత్వ ఉద్యోగి లేదా పింఛనుదారు"),
            ("pucca", "మా కుటుంబానికి ఇప్పటికే పక్కా (కాంక్రీటు) ఇల్లు ఉంది"),
            ("lpg", "మాకు ఎల్పీజీ గ్యాస్ కనెక్షన్ ఉంది"),
            ("daughter", "నాకు 10 ఏళ్ళ లోపు కూతురు ఉంది"),
            ("school", "మా పిల్లలు 1–12 తరగతుల్లో చదువుతున్నారు"),
            ("techstudent", "నేను ఇంజినీరింగ్, ఫార్మసీ, పాలిటెక్నిక్ వంటి డిగ్రీ లేదా డిప్లొమా కోర్సులో చదువుతున్నాను (లేదా చేరబోతున్నాను)"),
            ("business", "చిన్న వ్యాపారం ప్రారంభించడానికి లేదా పెంచడానికి నాకు రుణం కావాలి"),
            ("widow", "నేను వితంతువు లేదా ఒంటరి మహిళను"),
            ("disabled", "నాకు లేదా మా కుటుంబ సభ్యులకు వైకల్యం ఉంది"),
        ],
        button="నా పథకాలు చూపించు",
        note="ఈ చెకర్ ప్రతి పథకం ప్రధాన నిబంధనల ఆధారంగా <strong>ప్రాథమిక అంచనా మాత్రమే</strong> ఇస్తుంది. ప్రతి పథకానికి మరిన్ని వివరమైన షరతులు ఉంటాయి, కాబట్టి దరఖాస్తు చేసే ముందు ప్రతి గైడ్ తెరిచి, అధికారిక పోర్టల్‌లో లేదా మీ గ్రామ/వార్డు సచివాలయంలో నిర్ధారించుకోండి. క్రమవృద్ధి ప్రభుత్వ వెబ్‌సైట్ కాదు, మీ ఆధార్, బ్యాంకు వివరాలు లేదా ఎలాంటి ఫీజు ఎప్పుడూ అడగదు.",
        none='<strong>మా గైడ్‌లలో ఇంకా సరిపోయే పథకాలు లేవు.</strong><p>మీ సమాధానాలు మార్చి చూడండి, లేదా <a href="/te/schemes/">అన్ని తెలుగు పథకాలు చూడండి</a>. ప్రతి వారం కొత్త గైడ్‌లు జోడిస్తున్నాం.</p>',
        count_one="పథకం మీకు సరిపోవచ్చు", count_many="పథకాలు మీకు సరిపోవచ్చు",
        open_each="పూర్తి నిబంధనలు, దరఖాస్తు విధానం కోసం ప్రతి గైడ్ తెరవండి.", why="ఎందుకు:",
        tags={"central": "కేంద్రం", "ap": "ఆంధ్రప్రదేశ్", "ts": "తెలంగాణ"},
        W=dict(
            kisan="మీ కుటుంబానికి వ్యవసాయ భూమి ఉంది, ఆదాయపు పన్ను కట్టరు.",
            jay70="70 ఏళ్ళు దాటిన ప్రతి ఒక్కరికీ, ఆదాయంతో సంబంధం లేకుండా ₹5 లక్షల ఆరోగ్య రక్షణ.",
            jayPoor="BPL / రేషన్ కార్డు ఉన్న కుటుంబాలు తరచుగా ఇందులో ఉంటాయి. అధికారిక సైట్‌లో మీ పేరు చూసుకోండి.",
            ssy="మీకు 10 ఏళ్ళ లోపు కూతురు ఉంది.",
            pmayu="మీరు పట్టణంలో ఉంటారు, పక్కా ఇల్లు లేదు, ఆదాయం ₹9 లక్షల లోపు.",
            pmayg="మీరు గ్రామంలో ఉంటారు, పక్కా ఇల్లు లేదు.",
            mudra="చిన్న వ్యాపారానికి రుణం కావాలి. ముద్ర హామీ లేకుండా ₹20 లక్షల వరకు ఇస్తుంది.",
            apy="మీ వయసు 18–40, ఆదాయపు పన్ను కట్టరు, కాబట్టి 60 తర్వాత పింఛన్ కోసం చేరవచ్చు.",
            jdy="మీకు ఇంకా బ్యాంకు ఖాతా లేదు. జీరో బ్యాలెన్స్ ఖాతా తెరవండి.",
            pmjjby="మీ వయసు 18–50: ఏడాదికి ₹436కు ₹2 లక్షల జీవిత బీమా.",
            pmsby="మీ వయసు 18–70: ఏడాదికి ₹20కు ₹2 లక్షల ప్రమాద బీమా.",
            apAnnadata="ఏపీ రైతు కుటుంబం: పీఎం కిసాన్‌తో కలిపి ఏడాదికి ₹20,000.",
            apNtr60="మీ వయసు 60+, బియ్యం కార్డు ఉంది.",
            apNtrDis="మీ కుటుంబంలో దివ్యాంగులు ఉన్నారు, బియ్యం కార్డు ఉంది.",
            apNtrWidow="మీరు వితంతువు లేదా ఒంటరి మహిళ, బియ్యం కార్డు ఉంది.",
            apThalliki="బడికి వెళ్ళే పిల్లలు, బియ్యం కార్డు ఉన్నాయి: ఒక్కో బిడ్డకు ఏడాదికి ₹15,000.",
            apDeepam="బియ్యం కార్డు, ఎల్పీజీ కనెక్షన్ ఉన్నాయి: ఏడాదికి మూడు ఉచిత సిలిండర్లు.",
            apStree="ఏపీఎస్ఆర్టీసీ ఆర్డినరీ, ఎక్స్‌ప్రెస్ బస్సుల్లో ఉచిత ప్రయాణం.",
            tsRythu="తెలంగాణ రైతు: ఎకరానికి ఏడాదికి ₹12,000.",
            tsMahaBus="టీజీఎస్ఆర్టీసీ బస్సుల్లో ఉచిత ప్రయాణం.",
            tsMahaBusGas="టీజీఎస్ఆర్టీసీ బస్సుల్లో ఉచిత ప్రయాణం, మీ కుటుంబానికి ₹500కే గ్యాస్ సిలిండర్.",
            tsMahaGas="ఎల్పీజీ ఉన్న తెల్ల రేషన్ కార్డు కుటుంబాలకు ₹500కే గ్యాస్ సిలిండర్.",
            tsIndiramma="తెల్ల రేషన్ కార్డు, ₹2 లక్షల లోపు ఆదాయం, పక్కా ఇల్లు లేదు: ఇల్లు కట్టుకోవడానికి ₹5 లక్షల వరకు.",
            tsGruha="తెల్ల రేషన్ కార్డు కుటుంబాలకు నెలకు 200 యూనిట్ల వరకు జీరో బిల్లు.",
            tsAarogya="తెల్ల రేషన్ కార్డు కుటుంబాలకు ఏడాదికి ₹10 లక్షల వరకు ఆరోగ్య రక్షణ.",
            tsCheyDis="తెల్ల రేషన్ కార్డు కుటుంబాల దివ్యాంగులకు నెలవారీ పింఛన్ వస్తుంది.",
            tsCheyWidow="తెల్ల రేషన్ కార్డు కుటుంబాల వితంతువులు, ఒంటరి మహిళలకు నెలవారీ పింఛన్ వస్తుంది.",
            tsCheyOld="తెల్ల రేషన్ కార్డు కుటుంబాల వృద్ధులకు నెలవారీ పింఛన్ వస్తుంది (2026లో వృద్ధులకు కొత్త నమోదు తెరవలేదు).",
            pragati="కుటుంబ ఆదాయం ₹8 లక్షల లోపు ఉండి AICTE డిగ్రీ/డిప్లొమా కోర్సుల్లో చదివే బాలికలకు ఏడాదికి ₹50,000.",
            lakhpati="గ్రామీణ స్వయం సహాయక సంఘాల మహిళలకు తక్కువ వడ్డీ రుణాలు, శిక్షణ: ఏడాదికి ₹1 లక్ష+ సంపాదించేలా.",
            tsMahilaShakti="తెలంగాణ స్వయం సహాయక సంఘాలకు ఒక్కో సంఘానికి ₹10 లక్షల వరకు వడ్డీ లేని రుణాలు.",
        ),
    ),
}

def checker_data(lang):
    out = {}
    for x in SCHEMES:
        t = TE.get(x["slug"]) if lang == "te" else None
        out[x["slug"]] = dict(
            name=t["name"] if t else x["name"],
            href=(f'/te/schemes/{x["slug"]}/' if t else f'/schemes/{x["slug"]}/'),
            state=st(x), icon=x["icon"])
    return out

def checker_page(lang):
    T = CHECKER_TEXT[lang]
    opts = lambda pairs: "".join(f'<option value="{v}">{l}</option>' for v, l in pairs)
    checks_html = "\n".join(
        f'            <label class="check"><input type="checkbox" name="f" value="{k}"> <span>{v}</span></label>' for k, v in T["checks"])
    alts = {"en": CHECKER_TEXT["en"]["path"], "te": CHECKER_TEXT["te"]["path"]}
    js_cfg = dict(S=checker_data(lang), W=T["W"], tags=T["tags"], none=T["none"], one=T["count_one"],
                  many=T["count_many"], open_each=T["open_each"], why=T["why"])
    return (head(T["title"], T["desc"], T["path"], lang=lang, alternates=alts)
        + nav("tools", lang=lang) + f'''
    <div class="narrow">
      <p class="crumbs">{T["crumbs"]}</p>
      <article>
        <div class="eyebrow">{T["eyebrow"]}</div>
        <h1>{T["h1"]}</h1>
        <p class="lede">{T["lede"]}</p>
        <p class="lang-switch">{T["switch"]}</p>

        <form id="checker" class="calc checker" onsubmit="return false">
          <label>{T["q_state"]}
            <select id="state">{opts(T["states"])}</select>
          </label>
          <label>{T["q_area"]}
            <select id="area">{opts(T["areas"])}</select>
          </label>
          <label>{T["q_age"]}
            <input type="number" id="age" min="1" max="110" value="30" inputmode="numeric">
          </label>
          <label>{T["q_gender"]}
            <select id="gender">{opts(T["genders"])}</select>
          </label>
          <label>{T["q_income"]}
            <select id="income">{opts(T["incomes"])}</select>
          </label>
          <fieldset class="checks">
            <legend>{T["q_checks"]}</legend>
{checks_html}
          </fieldset>
          <button class="btn primary" type="submit" id="go">{T["button"]}</button>
        </form>

        <div id="out" aria-live="polite"></div>

        <div class="note">{T["note"]}</div>
      </article>
    </div>
    <script>
      (function () {{
        var C = {json.dumps(js_cfg, ensure_ascii=False)};
        var S = C.S, W = C.W;
        function $(id) {{ return document.getElementById(id); }}
        function run() {{
          var f = {{}};
          document.querySelectorAll('input[name=f]').forEach(function (c) {{ f[c.value] = c.checked; }});
          var state = $('state').value, rural = $('area').value === 'rural', age = parseInt($('age').value, 10) || 0;
          var g = $('gender').value, inc = parseInt($('income').value, 10);
          var woman = g === 'f', trans = g === 't', notRich = !f.incometax, poor = f.ration;
          var hits = [];
          function add(slug, key) {{ hits.push({{ slug: slug, why: W[key] }}); }}

          // Central schemes
          if (f.farmland && notRich && !f.govtjob) add('pm-kisan', 'kisan');
          if (age >= 70) add('ayushman-bharat-pm-jay', 'jay70');
          else if (poor) add('ayushman-bharat-pm-jay', 'jayPoor');
          if (f.daughter) add('sukanya-samriddhi-yojana', 'ssy');
          if (!f.pucca && !rural && inc <= 9) add('pm-awas-yojana-urban', 'pmayu');
          if (!f.pucca && rural && notRich && !f.govtjob && (poor || inc <= 1)) add('pm-awas-yojana-gramin', 'pmayg');
          if (f.business) add('pm-mudra-yojana', 'mudra');
          if (age >= 18 && age <= 40 && notRich) add('atal-pension-yojana', 'apy');
          if (!f.bank && age >= 10) add('pm-jan-dhan-yojana', 'jdy');
          if (age >= 18 && age <= 50) add('pm-jeevan-jyoti-bima-yojana', 'pmjjby');
          if (age >= 18 && age <= 70) add('pm-suraksha-bima-yojana', 'pmsby');
          if (woman && f.techstudent && inc <= 9) add('aicte-pragati-scholarship', 'pragati');
          if (woman && rural && age >= 18 && (poor || inc <= 1)) add('lakhpati-didi', 'lakhpati');

          // Andhra Pradesh
          if (state === 'ap') {{
            if (f.farmland && notRich && !f.govtjob) add('ap-annadata-sukhibhava', 'apAnnadata');
            if (poor && (age >= 60 || f.widow || f.disabled)) add('ap-ntr-bharosa-pension', age >= 60 ? 'apNtr60' : (f.disabled ? 'apNtrDis' : 'apNtrWidow'));
            if (poor && f.school) add('ap-thalliki-vandanam', 'apThalliki');
            if (poor && f.lpg) add('ap-deepam-2', 'apDeepam');
            if (woman || trans) add('ap-stree-shakti', 'apStree');
          }}
          // Telangana
          if (state === 'ts') {{
            if (f.farmland) add('ts-rythu-bharosa', 'tsRythu');
            if (woman || trans || (poor && f.lpg)) add('ts-mahalakshmi', (woman || trans) ? (poor && f.lpg ? 'tsMahaBusGas' : 'tsMahaBus') : 'tsMahaGas');
            if (poor && !f.pucca && inc <= 1) add('ts-indiramma-indlu', 'tsIndiramma');
            if (woman && age >= 18 && poor) add('ts-indira-mahila-shakti', 'tsMahilaShakti');
            if (poor) add('ts-gruha-jyothi', 'tsGruha');
            if (poor) add('ts-rajiv-aarogyasri', 'tsAarogya');
            if (poor && (f.widow || f.disabled)) add('ts-cheyutha-pension', f.disabled ? 'tsCheyDis' : 'tsCheyWidow');
            else if (poor && age >= 57) add('ts-cheyutha-pension', 'tsCheyOld');
          }}

          var out = $('out');
          if (!hits.length) {{
            out.innerHTML = '<div class="result">' + C.none + '</div>';
          }} else {{
            var html = '<div class="result"><div class="big">' + hits.length + ' <small>' + (hits.length > 1 ? C.many : C.one) + '</small></div><p>' + C.open_each + '</p></div><div class="grid">';
            hits.forEach(function (h) {{
              var s = S[h.slug];
              html += '<a class="card" href="' + s.href + '"><div class="icon" aria-hidden="true">' + s.icon + '</div><h3>' + s.name + '</h3><p><strong>' + C.why + '</strong> ' + h.why + '</p><div class="tags"><span class="tag">' + C.tags[s.state] + '</span></div></a>';
            }});
            out.innerHTML = html + '</div>';
          }}
          out.scrollIntoView({{ behavior: 'smooth', block: 'start' }});
        }}
        $('go').addEventListener('click', run);
      }})();
    </script>
''' + footer(lang))

write("tools/scheme-eligibility-checker/index.html", checker_page("en"))
write("te/tools/scheme-eligibility-checker/index.html", checker_page("te"))

write("tools/index.html",
    head("Free Calculators for Government Schemes | Kramavriddhi",
         "Free, simple calculators for Indian government schemes: Atal Pension Yojana contribution and Sukanya Samriddhi maturity.",
         "/tools/")
    + nav("tools") + f'''
    <header class="page-head">
      <div class="eyebrow">Tools</div>
      <h1>Simple calculators</h1>
      <p>Free tools to plan your savings and pension under government schemes. Nothing you enter leaves your device.</p>
    </header>
    <div class="grid">
{"".join(tool_card(t) for t in TOOLS)}    </div>
    <p class="soon-list"><strong>Coming soon:</strong> PMJJBY premium checker, PM-KISAN instalment tracker, home-loan subsidy (PMAY) estimator.</p>
    <div style="height:48px"></div>
''' + FOOTER)

# ---- APY calculator
apy_rows = "\n".join(
    f'          <tr><td>{a}</td>' + "".join(f"<td>₹{v[0]:,}</td>" for v in vals) + "</tr>" for a, vals in APY_CHART.items())
write("tools/atal-pension-calculator/index.html",
    head("Atal Pension Yojana Calculator: Monthly Contribution by Age | Kramavriddhi",
         "APY calculator: enter your age to see the monthly, quarterly and half-yearly contribution for a ₹1,000 to ₹5,000 pension, based on the official chart.",
         "/tools/atal-pension-calculator/")
    + nav("tools") + f'''
    <div class="narrow">
      <p class="crumbs"><a href="/">Home</a> › <a href="/tools/">Tools</a> › Atal Pension Calculator</p>
      <article>
        <div class="eyebrow">👴 Calculator</div>
        <h1>Atal Pension Yojana Calculator</h1>
        <p class="lede">Find out how much you need to pay to get a guaranteed pension of ₹1,000 to ₹5,000 a month after 60. Based on the official APY contribution chart.</p>

        <div class="calc">
          <label>Your age today
            <input type="number" id="age" min="18" max="40" value="25" inputmode="numeric">
          </label>
          <label>Pension you want after 60
            <select id="pension">
              <option value="0">₹1,000 / month</option>
              <option value="1">₹2,000 / month</option>
              <option value="2">₹3,000 / month</option>
              <option value="3">₹4,000 / month</option>
              <option value="4" selected>₹5,000 / month</option>
            </select>
          </label>
        </div>

        <div class="result" id="result" aria-live="polite"></div>

        <h2>All pension options for your age</h2>
        <div class="table-wrap">
        <table class="simple" id="compare"></table>
        </div>

        <h2>Full official chart (monthly contribution)</h2>
        <details>
          <summary>Show chart for ages 18 to 40</summary>
          <div class="table-wrap">
          <table class="simple">
            <tr><th>Age</th><th>₹1,000</th><th>₹2,000</th><th>₹3,000</th><th>₹4,000</th><th>₹5,000</th></tr>
{apy_rows}
          </table>
          </div>
        </details>

        <div class="note">This calculator uses the official monthly contribution chart. The pension amount is guaranteed by the Central Government. Income-tax payers cannot join APY from 1 October 2022.</div>
        <p>Want to know more about the scheme? Read our <a href="/schemes/atal-pension-yojana/">Atal Pension Yojana guide</a>.</p>
      </article>
    </div>
    <script>
      (function () {{
        var CHART = {json.dumps(APY_CHART)};
        var PENSIONS = [1000, 2000, 3000, 4000, 5000];
        var CORPUS = ["₹1.7 lakh", "₹3.4 lakh", "₹5.1 lakh", "₹6.8 lakh", "₹8.5 lakh"];
        var ageEl = document.getElementById('age'), penEl = document.getElementById('pension');
        var out = document.getElementById('result'), cmp = document.getElementById('compare');
        function inr(n) {{ return '₹' + Math.round(n).toLocaleString('en-IN'); }}
        function render() {{
          var age = parseInt(ageEl.value, 10);
          if (isNaN(age) || age < 18 || age > 40) {{
            out.innerHTML = '<strong>Enter an age between 18 and 40.</strong> APY can only be joined in this age range.';
            cmp.innerHTML = '';
            return;
          }}
          var i = parseInt(penEl.value, 10), m = CHART[age][i][0], years = 60 - age;
          out.innerHTML =
            '<div class="big">' + inr(m) + ' <small>per month</small></div>' +
            '<p>Pay this every month for <strong>' + years + ' years</strong> (age ' + age + ' to 60) to get <strong>' + inr(PENSIONS[i]) + ' a month</strong> for life.</p>' +
            '<ul><li>Total you pay: about <strong>' + inr(m * 12 * years) + '</strong></li>' +
            '<li>Your spouse gets the same pension after you.</li>' +
            '<li>After both of you, your nominee gets <strong>' + CORPUS[i] + '</strong>.</li></ul>';
          var h = '<tr><th>Pension</th><th>Monthly</th><th>Quarterly</th><th>Half-yearly</th></tr>';
          for (var k = 0; k < 5; k++) {{
            var v = CHART[age][k];
            h += '<tr' + (k === i ? ' class="hl"' : '') + '><td>' + inr(PENSIONS[k]) + '</td><td>' + inr(v[0]) + '</td><td>' + inr(v[1]) + '</td><td>' + inr(v[2]) + '</td></tr>';
          }}
          cmp.innerHTML = h;
        }}
        ageEl.addEventListener('input', render);
        penEl.addEventListener('change', render);
        render();
      }})();
    </script>
''' + FOOTER)

# ---- SSY calculator
write("tools/sukanya-samriddhi-calculator/index.html",
    head("Sukanya Samriddhi Yojana Calculator: Maturity Amount | Kramavriddhi",
         "SSY calculator: enter your yearly deposit to see the maturity amount, total interest and year-by-year growth of a Sukanya Samriddhi account at the current 8.2% rate.",
         "/tools/sukanya-samriddhi-calculator/")
    + nav("tools") + '''
    <div class="narrow">
      <p class="crumbs"><a href="/">Home</a> › <a href="/tools/">Tools</a> › Sukanya Samriddhi Calculator</p>
      <article>
        <div class="eyebrow">👧 Calculator</div>
        <h1>Sukanya Samriddhi Yojana Calculator</h1>
        <p class="lede">See how much a Sukanya Samriddhi account could grow to when it matures after 21 years.</p>

        <div class="calc">
          <label>Yearly deposit (₹250 to ₹1,50,000)
            <input type="number" id="dep" min="250" max="150000" step="50" value="60000" inputmode="numeric">
          </label>
          <label>Year you open the account
            <input type="number" id="start" min="2015" max="2040" value="2026" inputmode="numeric">
          </label>
          <label>Interest rate (% per year)
            <input type="number" id="rate" min="1" max="15" step="0.1" value="8.2" inputmode="decimal">
          </label>
        </div>
        <p class="muted" style="font-size:0.9rem">8.2% is the official rate for October–December 2026. The government reviews it every quarter.</p>

        <div class="result" id="result" aria-live="polite"></div>

        <details>
          <summary>Show year-by-year growth</summary>
          <div class="table-wrap"><table class="simple" id="years"></table></div>
        </details>

        <div class="note">This is an estimate. It assumes you deposit the same amount at the start of every financial year for 15 years and that the interest rate stays the same for all 21 years. The real amount will change with future interest rates and the timing of your deposits. Interest and maturity amount are tax-free.</div>
        <p>New to SSY? Read our <a href="/schemes/sukanya-samriddhi-yojana/">Sukanya Samriddhi Yojana guide</a>.</p>
      </article>
    </div>
    <script>
      (function () {
        var dep = document.getElementById('dep'), start = document.getElementById('start'), rate = document.getElementById('rate');
        var out = document.getElementById('result'), yrs = document.getElementById('years');
        function inr(n) { return '₹' + Math.round(n).toLocaleString('en-IN'); }
        function render() {
          var d = parseFloat(dep.value), r = parseFloat(rate.value) / 100, s = parseInt(start.value, 10);
          if (isNaN(d) || d < 250 || d > 150000) {
            out.innerHTML = '<strong>Enter a yearly deposit between ₹250 and ₹1,50,000.</strong>';
            yrs.innerHTML = ''; return;
          }
          if (isNaN(r) || r <= 0 || isNaN(s)) { out.innerHTML = '<strong>Check the year and interest rate.</strong>'; yrs.innerHTML = ''; return; }
          var bal = 0, paid = 0, rows = '<tr><th>Year</th><th>Deposit</th><th>Interest</th><th>Balance</th></tr>';
          for (var y = 0; y < 21; y++) {
            var add = y < 15 ? d : 0; bal += add; paid += add;
            var intr = bal * r; bal += intr;
            rows += '<tr><td>' + (y + 1) + ' (' + (s + y) + '-' + String(s + y + 1).slice(2) + ')</td><td>' + (add ? inr(add) : '—') + '</td><td>' + inr(intr) + '</td><td>' + inr(bal) + '</td></tr>';
          }
          out.innerHTML =
            '<div class="big">' + inr(bal) + ' <small>at maturity</small></div>' +
            '<ul><li>You deposit: <strong>' + inr(paid) + '</strong> over 15 years</li>' +
            '<li>Interest earned: <strong>' + inr(bal - paid) + '</strong></li>' +
            '<li>Account matures in: <strong>' + (s + 21) + '</strong></li></ul>';
          yrs.innerHTML = rows;
        }
        [dep, start, rate].forEach(function (el) { el.addEventListener('input', render); });
        render();
      })();
    </script>
''' + FOOTER)

# ---------------------------------------------------------------- Telugu pages (added 6 Oct 2026)
TE_STATE = {"central": "కేంద్ర ప్రభుత్వ పథకం", "ap": "ఆంధ్రప్రదేశ్ ప్రభుత్వ పథకం", "ts": "తెలంగాణ ప్రభుత్వ పథకం"}
TE_STATE_SHORT = {"central": "కేంద్రం", "ap": "ఆంధ్రప్రదేశ్", "ts": "తెలంగాణ"}
TE_UPDATED = "6 అక్టోబర్ 2026"

def article_te(s, t):
    slug = s["slug"]
    facts_html = "\n".join(f'        <div class="fact"><small>{k}</small><strong>{v}</strong></div>' for k, v in t["facts"])
    faq_html = "\n".join(f'      <details><summary>{q}</summary><p>{a}</p></details>' for q, a in t["faqs"])
    src_html = "\n".join(f'        <li><a href="{u}" target="_blank" rel="noopener">{n}</a></li>' for n, u in SOURCES[slug])
    ld = {
        "@context": "https://schema.org", "@type": "Article", "inLanguage": "te",
        "headline": t["name"], "dateModified": UPDATED_ISO,
        "author": {"@type": "Organization", "name": "Kramavriddhi"},
        "publisher": {"@type": "Organization", "name": "Kramavriddhi"},
        "mainEntityOfPage": f"https://kramavriddhi.com/te/schemes/{slug}/",
    }
    faq_ld = {"@context": "https://schema.org", "@type": "FAQPage", "inLanguage": "te",
              "mainEntity": [{"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in t["faqs"]]}
    extra = ('\n  <script type="application/ld+json">' + json.dumps(ld, ensure_ascii=False) + '</script>'
             + '\n  <script type="application/ld+json">' + json.dumps(faq_ld, ensure_ascii=False) + '</script>')
    alts = {"en": f"/schemes/{slug}/", "te": f"/te/schemes/{slug}/"}
    return (head(f'{t["name"]}: అర్హత, లబ్ధి, దరఖాస్తు విధానం | Kramavriddhi', t["description"],
                 f"/te/schemes/{slug}/", extra, lang="te", alternates=alts)
        + nav("schemes", lang="te") + f'''
    <div class="narrow">
      <p class="crumbs"><a href="/">హోమ్</a> › <a href="/te/schemes/">తెలుగు పథకాలు</a> › {t["short"]}</p>
      <article>
        <div class="eyebrow">{s["icon"]} {t["cat_label"]}</div>
        <h1>{t["name"]}</h1>
        <p class="lede">{t["lede"]}</p>
        <div class="meta"><span>చివరిగా అప్‌డేట్ చేసింది: {TE_UPDATED}</span><span>{TE_STATE[st(s)]}</span></div>
        <p class="lang-switch"><a href="/schemes/{slug}/" lang="en">Read in English →</a></p>

        <div class="facts">
{facts_html}
        </div>
{t["body"]}
        <h2>తరచుగా అడిగే ప్రశ్నలు</h2>
{faq_html}

        <h2>మూలాలు (Sources)</h2>
        <ul class="sources">
{src_html}
        </ul>
        <div class="note">ఈ గైడ్ సాధారణ సమాచారం కోసం మాత్రమే. పథకం నిబంధనలు, మొత్తాలు, తేదీలు మారవచ్చు. దరఖాస్తు చేసే ముందు అధికారిక పోర్టల్‌లో తప్పకుండా సరిచూసుకోండి. క్రమవృద్ధికి భారత ప్రభుత్వంతో గానీ, ఏ రాష్ట్ర ప్రభుత్వంతో గానీ సంబంధం లేదు.</div>
      </article>
    </div>
''' + footer("te"))

for slug, t in TE.items():
    write(f"te/schemes/{slug}/index.html", article_te(BY_SLUG[slug], t))

def te_card(s, t):
    return f'''        <a class="card" href="/te/schemes/{s["slug"]}/" lang="te">
          <div class="icon" aria-hidden="true">{s["icon"]}</div>
          <h3>{t["name"]}</h3>
          <p>{t["lede"].split(". ")[0].split("। ")[0]}.</p>
          <div class="tags"><span class="tag state">{TE_STATE_SHORT[st(s)]}</span><span class="tag">{t["cat_label"]}</span></div>
        </a>
'''

te_items = [x for x in DISPLAY if x["slug"] in TE]
write("te/schemes/index.html",
    head("తెలుగులో ప్రభుత్వ పథకాలు: ఆంధ్రప్రదేశ్, తెలంగాణ | Kramavriddhi",
         "ఆంధ్రప్రదేశ్, తెలంగాణ ప్రభుత్వ పథకాల సులభమైన తెలుగు గైడ్‌లు: అర్హత, లబ్ధి, పత్రాలు, దరఖాస్తు విధానం.",
         "/te/schemes/", lang="te", alternates={"en": "/schemes/", "te": "/te/schemes/"})
    + nav("schemes", lang="te") + f'''
    <header class="page-head">
      <div class="eyebrow">తెలుగులో పథకాలు</div>
      <h1>ప్రభుత్వ పథకాలు, సులభమైన తెలుగులో</h1>
      <p>ఆంధ్రప్రదేశ్, తెలంగాణ ప్రభుత్వ పథకాల గురించి స్పష్టమైన గైడ్‌లు: ఎవరు అర్హులు, ఏం లభిస్తుంది, ఏ పత్రాలు కావాలి, అధికారిక పోర్టల్‌లో ఎలా దరఖాస్తు చేయాలి.</p>
      <p class="lang-switch"><a href="/schemes/" lang="en">All schemes in English →</a></p>
    </header>
    <a class="cta" href="/te/tools/scheme-eligibility-checker/" style="margin-bottom:28px"><span>✅</span><div><strong>మీకు ఏ పథకాలు వర్తిస్తాయో తెలియదా?</strong><br><span class="muted" style="font-size:0.9rem">కొన్ని ప్రశ్నలకు సమాధానం ఇచ్చి మీకు సరిపోయే పథకాలు చూడండి.</span></div></a>
    <div class="grid">
{"".join(te_card(x, TE[x["slug"]]) for x in te_items)}    </div>
    <p class="soon-list"><strong>త్వరలో:</strong> మరిన్ని ఆంధ్రప్రదేశ్, తెలంగాణ పథకాలు, కేంద్ర పథకాలు తెలుగులో.</p>
    <div class="note" style="margin-top:32px">క్రమవృద్ధి ఒక స్వతంత్ర సమాచార వెబ్‌సైట్, ప్రభుత్వ వెబ్‌సైట్ కాదు. మేము మీ ఆధార్, బ్యాంకు వివరాలు లేదా ఎలాంటి ఫీజు అడగము. ఎల్లప్పుడూ గైడ్‌లో ఇచ్చిన అధికారిక పోర్టల్‌లోనే దరఖాస్తు చేయండి.</div>
    <div style="height:40px"></div>
''' + footer("te"))

# ---------------------------------------------------------------- games (added 6 Oct 2026)
GAMES = [
    dict(slug="rex-adventure", name="Rex's Big Adventure", emoji="🦖",
         summary="Help Rex the T-Rex rescue his friends and grow bigger. Pick your dino buddy and play right in your browser.",
         tags=["Adventure", "For kids", "Free"]),
]
def game_card(x):
    tags = "".join(f'<span class="tag">{t}</span>' for t in x["tags"])
    return f"""        <a class="card game" href="/games/{x["slug"]}/">
          <div class="game-art" aria-hidden="true">{x["emoji"]}</div>
          <h3>{x["name"]}</h3>
          <p>{x["summary"]}</p>
          <div class="tags">{tags}</div>
          <span class="btn primary" style="align-self:flex-start;margin-top:6px">Play now →</span>
        </a>
"""
write("games/index.html",
    head("Free Online Games | Kramavriddhi", "Free games to play in your browser, made by Kramavriddhi. No download needed.", "/games/")
    + nav("games") + f"""
    <header class="page-head">
      <div class="eyebrow">Games</div>
      <h1>Play free games</h1>
      <p>Simple, fun games made by Kramavriddhi. They run right in your browser on phone or computer, with no download or sign-up.</p>
    </header>
    <div class="grid">
{"".join(game_card(x) for x in GAMES)}    </div>
    <p class="soon-list"><strong>More games coming soon.</strong></p>
    <div style="height:40px"></div>
""" + FOOTER)

# ---------------------------------------------------------------- simple pages
def simple(path, title, desc, active, h1, eyebrow, body):
    write(path.strip("/") + "/index.html", head(f"{title} | Kramavriddhi", desc, path) + nav(active) + f'''
    <div class="narrow">
      <article>
        <div class="eyebrow">{eyebrow}</div>
        <h1>{h1}</h1>
{body}
      </article>
    </div>
''' + FOOTER)

simple("/about/", "About Us", "About Kramavriddhi: an independent website explaining Indian government schemes simply, and building apps for everyday growth.",
    "about", "About Kramavriddhi", "About us", '''
        <p class="lede"><strong>Kramavriddhi</strong> (<span lang="sa">क्रमवृद्धिः</span>) is Sanskrit for "growth in steps." Our motto, <em lang="sa">क्रमेण वर्धामहे</em>, means "we grow step by step."</p>
        <h2>What we do</h2>
        <p>Government schemes can change lives, but the official information is often hard to find and harder to understand. Kramavriddhi explains central government schemes in simple language: who can apply, what you get, which documents you need and exactly how to apply on the official portal.</p>
        <p>We also build apps and tools for everyday growth, in fitness, productivity, media and data.</p>
        <h2>How we write our guides</h2>
        <ul>
          <li><strong>Official sources first.</strong> Every guide is based on official government portals, notifications and Press Information Bureau (PIB) releases, and we link to them.</li>
          <li><strong>Dated and updated.</strong> Each guide shows when it was last updated. When rules or amounts change, we update the guide.</li>
          <li><strong>Simple language.</strong> We explain things the way you would explain them to a family member.</li>
          <li><strong>We never collect applications.</strong> We do not ask for Aadhaar, bank details or any fee. We always send you to the official portal to apply.</li>
        </ul>
        <h2>Independent website</h2>
        <p>Kramavriddhi is an independent information website. It is not a government website and is not affiliated with the Government of India or any state government.</p>
        <h2>Who we are</h2>
        <p>Kramavriddhi was founded by <a href="https://nagendrababuedru.github.io" target="_blank" rel="noopener">Nagendra Babu Edru</a>. Found a mistake or want us to cover a scheme? <a href="/contact/">Contact us</a>.</p>
''')

simple("/contact/", "Contact Us", "Contact Kramavriddhi for corrections, suggestions or questions about our scheme guides.",
    "contact", "Contact us", "Contact", '''
        <p class="lede">Found a mistake in a guide, want us to explain a scheme, or have a question? We'd love to hear from you.</p>
        <div class="official">
          <strong>Email:</strong> <a href="mailto:support@kramavriddhi.com">support@kramavriddhi.com</a>
        </div>
        <p>We usually reply within 2–3 working days.</p>
        <div class="note"><strong>Please note:</strong> Kramavriddhi is not a government office. We cannot check your application status, approve benefits or change your records. For that, please contact the official helpline listed in each scheme guide. Never share your Aadhaar number, OTP or bank details with anyone, including us.</div>
''')

simple("/privacy-policy/", "Privacy Policy", "Privacy Policy of Kramavriddhi: what information we collect, cookies, advertising and your choices.",
    "", "Privacy Policy", "Legal", f'''
        <p class="meta">Last updated: {UPDATED}</p>
        <p>This Privacy Policy explains how Kramavriddhi ("we", "us") handles information when you visit <strong>kramavriddhi.com</strong>.</p>
        <h2>Information we collect</h2>
        <ul>
          <li><strong>You do not need an account.</strong> We do not ask for your name, Aadhaar, bank details or any personal documents to read our guides.</li>
          <li><strong>If you email us</strong>, we receive your email address and message, and use them only to reply.</li>
          <li><strong>Technical information.</strong> Our hosting provider (GitHub Pages) may log basic technical data such as IP address and browser type for security and to keep the site running.</li>
        </ul>
        <h2>Cookies</h2>
        <p>Cookies are small files stored in your browser. Our site itself does not set cookies to track you. However, third-party services we use, such as analytics or advertising, may set cookies.</p>
        <h2>Advertising</h2>
        <p>We may show ads from third-party vendors, including Google. Third-party vendors, including Google, use cookies to serve ads based on your prior visits to this website or other websites. Google's use of advertising cookies enables it and its partners to serve ads to you based on your visits to this site and/or other sites on the internet.</p>
        <p>You can opt out of personalised advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener">Google Ads Settings</a>, or opt out of some third-party vendors' use of cookies for personalised advertising at <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener">www.aboutads.info</a>. To learn more, see <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener">how Google uses information from sites that use its services</a>.</p>
        <h2>Links to other websites</h2>
        <p>Our guides link to official government portals and other websites. We are not responsible for their content or privacy practices.</p>
        <h2>Children</h2>
        <p>Our website is meant for general audiences. We do not knowingly collect personal information from children.</p>
        <h2>Changes to this policy</h2>
        <p>We may update this policy from time to time. The date at the top shows when it was last changed.</p>
        <h2>Contact</h2>
        <p>Questions about this policy? Email <a href="mailto:support@kramavriddhi.com">support@kramavriddhi.com</a>.</p>
''')

simple("/disclaimer/", "Disclaimer", "Disclaimer: Kramavriddhi is an independent information website and is not affiliated with any government.",
    "", "Disclaimer", "Legal", f'''
        <p class="meta">Last updated: {UPDATED}</p>
        <h2>Not a government website</h2>
        <p>Kramavriddhi is an <strong>independent information website</strong>. It is not owned, run or endorsed by the Government of India, any state government, or any government department. Scheme names belong to their respective government owners and are used only to identify the schemes we explain.</p>
        <h2>Information only</h2>
        <p>Our guides are for general information. We base them on official sources and update them regularly, but scheme rules, amounts, dates and eligibility can change at any time. <strong>Always confirm details on the official portal</strong> linked in each guide before you apply or make any financial decision.</p>
        <h2>We do not process applications</h2>
        <p>We do not accept applications, collect documents, or charge any fee. We will never ask for your Aadhaar number, OTP, bank details or passwords. If anyone claiming to be from Kramavriddhi asks for these, do not share them.</p>
        <h2>No professional advice</h2>
        <p>Nothing on this website is legal, financial or tax advice. For decisions about investments or taxes, consult a qualified professional.</p>
        <h2>External links</h2>
        <p>We link to official and third-party websites for your convenience. We are not responsible for their content or availability.</p>
        <h2>Contact</h2>
        <p>If you find an error, please tell us at <a href="mailto:support@kramavriddhi.com">support@kramavriddhi.com</a> and we will correct it.</p>
''')

# ---------------------------------------------------------------- 404, sitemap, robots
write("404.html", head("Page not found | Kramavriddhi", "Page not found.", "/404.html") + nav() + '''
    <div class="narrow">
      <article>
        <div class="eyebrow">404</div>
        <h1>Page not found</h1>
        <p class="lede">The page you're looking for doesn't exist or has moved.</p>
        <div class="btns"><a class="btn primary" href="/schemes/">Browse schemes</a><a class="btn ghost" href="/">Go home</a></div>
      </article>
    </div>
''' + FOOTER)

urls = ["/", "/schemes/", "/schemes/for-women/", "/schemes/andhra-pradesh/", "/schemes/telangana/", "/te/schemes/", "/te/tools/scheme-eligibility-checker/"] + [f"/te/schemes/{k}/" for k in TE] + [f"/schemes/{s['slug']}/" for s in SCHEMES] + ["/tools/"] + [f"/tools/{t['slug']}/" for t in TOOLS] + ["/games/"] + [f"/games/{x['slug']}/" for x in GAMES] + ["/about/", "/contact/", "/privacy-policy/", "/disclaimer/"]
write("sitemap.xml", '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
      + "".join(f"  <url><loc>https://kramavriddhi.com{u}</loc><lastmod>{UPDATED_ISO}</lastmod></url>\n" for u in urls)
      + "</urlset>\n")
write("robots.txt", "User-agent: *\nAllow: /\n\nSitemap: https://kramavriddhi.com/sitemap.xml\n")

# cards for the home page "Latest schemes" section
with open(os.path.join(os.path.dirname(__file__), "home_cards.html"), "w", encoding="utf-8") as f:
    f.write("".join(scheme_card(s) for s in DISPLAY[:6]))
