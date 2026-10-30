import os
from parts import head, nav, FOOTER
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
updates = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "home_updates.html"), encoding="utf-8").read()
apps = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "home_apps.html"), encoding="utf-8").read()
cards = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "home_cards.html"), encoding="utf-8").read()
import json
ORG_LD = '\n  <script type="application/ld+json">' + json.dumps({
    "@context": "https://schema.org", "@type": "Organization", "name": "Kramavriddhi",
    "url": "https://kramavriddhi.com", "email": "support@kramavriddhi.com",
    "sameAs": ["https://www.youtube.com/@kramavriddhi"]}) + '</script>'
# Layout (Hallmark redesign, Editorial theme): the motto set as a marquee, then updates on an ink band,
# guides as an index beside the "browse by" links, tools as a bento, apps as a rail, approach as steps.
html = head("Kramavriddhi — Government schemes explained, step by step",
            "Kramavriddhi explains Indian government schemes in simple language: eligibility, benefits, documents and how to apply. Growth, step by step.",
            "/", extra=ORG_LD) + nav() + '''
    <header class="hero">
      <h1>Small steps.<br>Steady growth.</h1>
      <div class="hero-foot">
        <p class="lead">Kramavriddhi helps people grow a little every day: with simple guides to government schemes, and apps for health, work and creativity.</p>
        <div class="btns">
          <a class="btn primary" href="/schemes/">Explore government schemes</a>
          <a class="btn ghost" href="/apps/">Our apps &amp; games</a>
        </div>
      </div>
    </header>

    <section id="updates" class="band-ink">
      <div class="section-head split">
        <h2>Latest updates &amp; deadlines</h2>
        <div>
          <p>Don't miss important dates for scholarships, instalments and bookings.</p>
          <a class="more" href="/updates/">See all updates</a>
        </div>
      </div>
      <div class="updates">
''' + updates + '''
    </section>

    <section id="schemes" class="index">
      <div class="section-head">
        <h2>Latest scheme guides</h2>
        <p>Central, Andhra Pradesh and Telangana government schemes explained in plain language, with links to the official portals.</p>
        <a class="more" href="/schemes/">See all schemes</a>
        <ul class="browse" aria-label="Browse schemes">
          <li><a href="/schemes/?state=central">Central</a></li>
          <li><a href="/schemes/andhra-pradesh/">Andhra Pradesh</a></li>
          <li><a href="/schemes/telangana/">Telangana</a></li>
          <li><a href="/schemes/for-women/">For girls &amp; women</a></li>
          <li><a href="/schemes/for-youth/">For youth</a></li>
          <li><a href="/schemes/for-men/">For boys &amp; men</a></li>
        </ul>
      </div>
      <div class="grid rows">
''' + cards + '''      </div>
    </section>

    <section id="tools">
      <div class="section-head">
        <h2>Free tools</h2>
        <p>Find schemes for you, and plan your pension and savings in seconds.</p>
        <a class="more" href="/tools/">See all tools</a>
      </div>
      <div class="bento">
        <a class="card lead-tile" href="/tools/scheme-eligibility-checker/">
          <h3>Which schemes am I eligible for?</h3>
          <p>Answer a few simple questions and see the schemes that may suit you.</p>
          <span class="tag">Free tool</span>
        </a>
        <a class="card" href="/tools/atal-pension-calculator/">
          <h3>Atal Pension Calculator</h3>
          <p>Your monthly contribution for a ₹1,000 to ₹5,000 pension, by age.</p>
          <span class="tag">Calculator</span>
        </a>
        <a class="card" href="/tools/sukanya-samriddhi-calculator/">
          <h3>Sukanya Samriddhi Calculator</h3>
          <p>How much your daughter's SSY account could grow to by maturity.</p>
          <span class="tag">Calculator</span>
        </a>
      </div>
    </section>

    <section id="apps">
      <div class="section-head split">
        <h2>Apps &amp; games</h2>
        <div>
          <p>Free learning apps and games you can open right in your browser.</p>
          <a class="more" href="/apps/">See all apps</a>
        </div>
      </div>
      <div class="grid rail" tabindex="0" aria-label="Apps and games, scroll sideways">
''' + apps + '''      </div>
    </section>

    <section id="approach">
      <div class="section-head">
        <h2>Our approach</h2>
      </div>
      <ol class="steps">
        <li class="step"><h3>Start small</h3><p>Build the simplest useful version first, and put it in people's hands.</p></li>
        <li class="step"><h3>Learn daily</h3><p>Listen to real users and improve a little with every release.</p></li>
        <li class="step"><h3>Grow steadily</h3><p>Compound small improvements into products people rely on.</p></li>
      </ol>
    </section>

    <section id="about">
      <div class="about-grid">
        <div>
          <h2>About Kramavriddhi</h2>
        </div>
        <div>
          <p class="standfirst"><strong>Kramavriddhi</strong> (<span lang="sa">क्रमवृद्धिः</span>) is Sanskrit for "growth in steps." Our motto, <em lang="sa">क्रमेण वर्धामहे</em>, means "we grow step by step." It's the idea behind everything we make: real progress comes from small, consistent steps.</p>
          <p>Founded by Nagendra Babu Edru, Kramavriddhi explains government schemes simply and builds apps for fitness, productivity, media and data. <a href="/about/">Read more</a></p>
          <a class="founder" href="https://nagendrababuedru.github.io" target="_blank" rel="noopener">
            <img src="https://avatars.githubusercontent.com/u/95692402?v=4" alt="Nagendra Babu Edru" width="64" height="64">
            <span><strong>Nagendra Babu Edru</strong><small>Founder</small></span>
          </a>
        </div>
      </div>
    </section>

    <section id="contact" class="band-paper">
      <div class="contact-box">
        <h2>Let's talk</h2>
        <p>Questions, corrections, or a scheme you'd like us to explain? We'd love to hear from you.</p>
        <div class="btns">
          <a class="btn primary" href="mailto:support@kramavriddhi.com">support@kramavriddhi.com</a>
        </div>
      </div>
    </section>
''' + FOOTER
open(os.path.join(ROOT, "index.html"), "w", encoding="utf-8", newline="\n").write(html)
print("home written")
