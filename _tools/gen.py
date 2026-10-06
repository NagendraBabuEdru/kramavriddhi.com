import os, sys, json
sys.path.insert(0, os.path.dirname(__file__))
from parts import head, nav, FOOTER

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

def scheme_card(s):
    return f'''        <a class="card" href="/schemes/{s["slug"]}/" data-cat="{s["cat"]}" data-name="{s["name"].lower()} {s["short"].lower()}">
          <div class="icon" aria-hidden="true">{s["icon"]}</div>
          <h3>{s["name"]}</h3>
          <p>{s["summary"]}</p>
          <span class="tag">{s["cat_label"]}</span>
        </a>
'''

# ---------------------------------------------------------------- schemes index
chips = "\n".join(
    f'        <button class="chip" type="button" data-filter="{k}" aria-pressed="{"true" if k=="all" else "false"}">{v}</button>'
    for k, v in CATEGORIES)
write("schemes/index.html",
    head("Central Government Schemes Explained Simply | Kramavriddhi",
         "Simple, step-by-step guides to central government schemes in India: who can apply, benefits, documents and how to apply.",
         "/schemes/")
    + nav("schemes") + f'''
    <header class="page-head">
      <div class="eyebrow">Government schemes</div>
      <h1>Central schemes, explained simply</h1>
      <p>Clear guides to Government of India schemes: who can apply, what you get, which documents you need, and how to apply on the official portal.</p>
    </header>

    <div class="filters" role="group" aria-label="Filter by category">
{chips}
    </div>
    <input class="search" type="search" placeholder="Search schemes…" aria-label="Search schemes">

    <div class="grid" id="scheme-list">
{"".join(scheme_card(s) for s in DISPLAY)}    </div>
    <p class="empty" id="empty">No schemes in this category yet. New guides are added every week.</p>

    <p class="soon-list"><strong>Coming soon:</strong> PM Vishwakarma, PM Fasal Bima Yojana, PM Kaushal Vikas Yojana, National Scholarship Portal, PM Ujjwala Yojana, Stand-Up India.</p>

    <div class="note" style="margin-top:32px">Kramavriddhi is an independent information website, not a government website. We never ask for your Aadhaar, bank details or any fee. Always apply only on the official portal linked in each guide.</div>

    <script>
      (function () {{
        var chips = document.querySelectorAll('.chip');
        var cards = document.querySelectorAll('#scheme-list .card');
        var search = document.querySelector('.search');
        var empty = document.getElementById('empty');
        var current = 'all';
        function apply() {{
          var q = search.value.trim().toLowerCase();
          var shown = 0;
          cards.forEach(function (c) {{
            var ok = (current === 'all' || c.dataset.cat === current) && (!q || c.dataset.name.indexOf(q) !== -1);
            c.style.display = ok ? '' : 'none';
            if (ok) shown++;
          }});
          empty.style.display = shown ? 'none' : 'block';
        }}
        chips.forEach(function (b) {{
          b.addEventListener('click', function () {{
            current = b.dataset.filter;
            chips.forEach(function (x) {{ x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); }});
            apply();
          }});
        }});
        search.addEventListener('input', apply);
      }})();
    </script>
''' + FOOTER)

# ---------------------------------------------------------------- article shell
def article(s, lede, facts, body, faqs, sources, description):
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
                 f'/schemes/{s["slug"]}/', extra)
        + nav("schemes") + f'''
    <div class="narrow">
      <p class="crumbs"><a href="/">Home</a> › <a href="/schemes/">Schemes</a> › {s["short"]}</p>
      <article>
        <div class="eyebrow">{s["icon"]} {s["cat_label"]}</div>
        <h1>{s["name"]}</h1>
        <p class="lede">{lede}</p>
        <div class="meta"><span>Last updated: {UPDATED}</span><span>Central Government scheme</span></div>

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
        <p>If the interest rate stayed at 8.2% for the whole period, yearly deposits at the start of each year for 15 years would grow roughly like this by maturity (21 years):</p>
        <div class="table-wrap">
        <table class="simple">
          <tr><th>Yearly deposit</th><th>Total you deposit</th><th>Approx. maturity amount</th></tr>
          <tr><td>₹12,000 (₹1,000/month)</td><td>₹1.8 lakh</td><td>about ₹5.7 lakh</td></tr>
          <tr><td>₹60,000 (₹5,000/month)</td><td>₹9 lakh</td><td>about ₹28.7 lakh</td></tr>
          <tr><td>₹1,50,000 (maximum)</td><td>₹22.5 lakh</td><td>about ₹71.8 lakh</td></tr>
        </table>
        </div>
        <p class="muted" style="font-size:0.9rem">This is only an illustration. The real amount depends on future interest rates, which change every quarter, and on when you deposit.</p>

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
        <p>The earlier you join, the less you pay. Monthly contributions for some ages (from the official APY chart):</p>
        <div class="table-wrap">
        <table class="simple">
          <tr><th>Age when joining</th><th>₹1,000 pension</th><th>₹2,000</th><th>₹3,000</th><th>₹4,000</th><th>₹5,000</th></tr>
{apy_table}
          <tr><td><em>Amount to nominee</em></td><td>₹1.7 lakh</td><td>₹3.4 lakh</td><td>₹5.1 lakh</td><td>₹6.8 lakh</td><td>₹8.5 lakh</td></tr>
        </table>
        </div>
        <p>You can also pay quarterly or half-yearly. The full chart for every age from 18 to 40 is in the official scheme document linked below.</p>

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
        ("How much should I pay for a ₹5,000 pension?", "It depends on your age when you join: ₹210 a month at 18, ₹376 at 25, ₹577 at 30, ₹902 at 35 and ₹1,454 at 40."),
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

urls = ["/", "/schemes/"] + [f"/schemes/{s['slug']}/" for s in SCHEMES] + ["/about/", "/contact/", "/privacy-policy/", "/disclaimer/"]
write("sitemap.xml", '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
      + "".join(f"  <url><loc>https://kramavriddhi.com{u}</loc><lastmod>{UPDATED_ISO}</lastmod></url>\n" for u in urls)
      + "</urlset>\n")
write("robots.txt", "User-agent: *\nAllow: /\n\nSitemap: https://kramavriddhi.com/sitemap.xml\n")

# cards for the home page "Latest schemes" section
with open(os.path.join(os.path.dirname(__file__), "home_cards.html"), "w", encoding="utf-8") as f:
    f.write("".join(scheme_card(s) for s in DISPLAY[:6]))
