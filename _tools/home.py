import os
import re
from parts import head, nav, FOOTER
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
old = open(os.path.join(ROOT, "index.html"), encoding="utf-8").read()
products = re.search(r'(    <section id="products">.*?</section>\n)', old, re.S).group(1)
approach = re.search(r'(    <section id="approach">.*?</section>\n)', old, re.S).group(1)
cards = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "home_cards.html"), encoding="utf-8").read()
html = head("Kramavriddhi — Government schemes explained, step by step",
            "Kramavriddhi explains Indian government schemes in simple language: eligibility, benefits, documents and how to apply. Growth, step by step.",
            "/") + nav() + '''
    <header class="hero">
      <div class="eyebrow" lang="sa">क्रमवृद्धिः · क्रमेण वर्धामहे</div>
      <h1>Small steps.<br>Steady growth.</h1>
      <p>Kramavriddhi helps people grow a little every day: with simple guides to government schemes, and apps for health, work and creativity.</p>
      <div class="btns">
        <a class="btn primary" href="/schemes/">Explore government schemes</a>
        <a class="btn ghost" href="#products">Our products</a>
      </div>
    </header>

    <section id="schemes">
      <div class="section-head">
        <h2>Latest scheme guides</h2>
        <p>Central, Andhra Pradesh and Telangana government schemes explained in plain language, with links to the official portals.</p>
        <a class="more" href="/schemes/">See all schemes →</a>
        <div class="filters" style="margin:14px 0 0">
          <a class="chip" href="/schemes/?state=central" style="text-decoration:none">🇮🇳 Central</a>
          <a class="chip" href="/schemes/andhra-pradesh/" style="text-decoration:none">Andhra Pradesh</a>
          <a class="chip" href="/schemes/telangana/" style="text-decoration:none">Telangana</a>
        </div>
      </div>
      <div class="grid">
''' + cards + '''      </div>
    </section>

    <section id="tools">
      <div class="section-head">
        <h2>Free tools</h2>
        <p>Find schemes for you, and plan your pension and savings in seconds.</p>
        <a class="more" href="/tools/">See all tools →</a>
      </div>
      <div class="grid">
        <a class="card" href="/tools/scheme-eligibility-checker/">
          <div class="icon" aria-hidden="true">✅</div>
          <h3>Which schemes am I eligible for?</h3>
          <p>Answer a few simple questions and see the schemes that may suit you.</p>
          <span class="tag">Free tool</span>
        </a>
        <a class="card" href="/tools/atal-pension-calculator/">
          <div class="icon" aria-hidden="true">👴</div>
          <h3>Atal Pension Calculator</h3>
          <p>Your monthly contribution for a ₹1,000 to ₹5,000 pension, by age.</p>
          <span class="tag">Calculator</span>
        </a>
        <a class="card" href="/tools/sukanya-samriddhi-calculator/">
          <div class="icon" aria-hidden="true">👧</div>
          <h3>Sukanya Samriddhi Calculator</h3>
          <p>How much your daughter's SSY account could grow to by maturity.</p>
          <span class="tag">Calculator</span>
        </a>
      </div>
    </section>

    <section id="games">
      <div class="section-head">
        <h2>Games</h2>
        <p>Free games you can play right in your browser.</p>
        <a class="more" href="/games/">See all games →</a>
      </div>
      <div class="grid">
        <a class="card game" href="/games/rex-adventure/">
          <div class="game-art" aria-hidden="true">🦖</div>
          <h3>Rex's Big Adventure</h3>
          <p>Help Rex the T-Rex rescue his friends and grow bigger.</p>
          <span class="btn primary" style="align-self:flex-start;margin-top:6px">Play now →</span>
        </a>
      </div>
    </section>

''' + products + "\n" + approach + '''
    <section id="about">
      <div class="about-grid">
        <div>
          <h2>About Kramavriddhi</h2>
        </div>
        <div>
          <p><strong>Kramavriddhi</strong> (<span lang="sa">क्रमवृद्धिः</span>) is Sanskrit for "growth in steps." Our motto, <em lang="sa">क्रमेण वर्धामहे</em>, means "we grow step by step." It's the idea behind everything we make: real progress comes from small, consistent steps.</p>
          <p>Founded by Nagendra Babu Edru, Kramavriddhi explains government schemes simply and builds apps for fitness, productivity, media and data. <a href="/about/">Read more</a></p>
          <a class="founder" href="https://nagendrababuedru.github.io" target="_blank" rel="noopener">
            <img src="https://avatars.githubusercontent.com/u/95692402?v=4" alt="Nagendra Babu Edru">
            <div><strong>Nagendra Babu Edru</strong><small>Founder</small></div>
          </a>
        </div>
      </div>
    </section>

    <section id="contact">
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
