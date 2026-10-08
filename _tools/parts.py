# Shared page shell for Kramavriddhi static pages
LOGO = '<svg viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="8" fill="var(--accent)"/><path d="M7 24h6v-5h6v-5h6V8" stroke="var(--bg)" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>'
FAVICON = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='8' fill='%230f766e'/><path d='M7 24h6v-5h6v-5h6V8' stroke='white' stroke-width='3' fill='none' stroke-linecap='round' stroke-linejoin='round'/></svg>"

import hashlib, os
_ASSETS = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "assets")
ASSET_VERSION = hashlib.md5(b"".join(open(os.path.join(_ASSETS, n), "rb").read() for n in ("style.css", "site.js"))).hexdigest()[:8]

FONTS = {
    "en": "family=Inter:wght@400;500;600;700&family=Fraunces:opsz,wght@9..144,600",
    "te": "family=Inter:wght@400;500;600;700&family=Fraunces:opsz,wght@9..144,600&family=Noto+Sans+Telugu:wght@400;600;700",
}

def head(title, desc, path, extra="", lang="en", alternates=None):
    """alternates: {"en": "/path/", "te": "/te/path/"} when a page exists in both languages."""
    alt = ""
    if alternates:
        alt = "".join(f'\n  <link rel="alternate" hreflang="{l}" href="https://kramavriddhi.com{p}">' for l, p in alternates.items())
        alt += f'\n  <link rel="alternate" hreflang="x-default" href="https://kramavriddhi.com{alternates["en"]}">'
    return f'''<!doctype html>
<html lang="{lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{title}</title>
  <meta name="description" content="{desc}">
  <link rel="canonical" href="https://kramavriddhi.com{path}">{alt}
  <meta property="og:title" content="{title}">
  <meta property="og:description" content="{desc}">
  <meta property="og:url" content="https://kramavriddhi.com{path}">
  <meta property="og:site_name" content="Kramavriddhi">
  <meta property="og:locale" content="{"te_IN" if lang == "te" else "en_IN"}">
  <link rel="icon" href="{FAVICON}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?{FONTS[lang]}&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/assets/style.css?v={ASSET_VERSION}">
  <script src="/assets/site.js?v={ASSET_VERSION}" defer></script>{extra}
</head>
<body>
  <div class="wrap">
'''

NAV_LABELS = {
    "en": dict(schemes="Schemes", tools="Tools", games="Games", products="Products", about="About", contact="Contact"),
    "te": dict(schemes="పథకాలు", tools="సాధనాలు", games="ఆటలు", products="ఉత్పత్తులు", about="మా గురించి", contact="సంప్రదించండి"),
}

def nav(active="", lang="en"):
    L = NAV_LABELS[lang]
    schemes_href = "/te/schemes/" if lang == "te" else "/schemes/"
    def li(href, label, key, cls=""):
        cur = ' aria-current="page"' if key == active else ""
        c = f' class="{cls}"' if cls else ""
        return f'<li{c}><a href="{href}"{cur}>{label}</a></li>'
    return f'''    <nav class="top">
      <a class="brand" href="/">
        {LOGO}
        Kramavriddhi
      </a>
      <ul>
        {li(schemes_href, L["schemes"], "schemes")}
        {li("/tools/", L["tools"], "tools")}
        {li("/games/", L["games"], "games")}
        {li("/about/", L["about"], "about", "hide-sm")}
        {li("/contact/", L["contact"], "contact")}
      </ul>
    </nav>
'''

def footer(lang="en"):
    if lang == "te":
        links = '''          <li><a href="/te/schemes/">తెలుగు పథకాలు</a></li>
          <li><a href="/schemes/">Schemes (English)</a></li>
          <li><a href="/tools/">సాధనాలు</a></li>
          <li><a href="/games/">ఆటలు</a></li>
          <li><a href="/contact/">సంప్రదించండి</a></li>
          <li><a href="/privacy-policy/">Privacy Policy</a></li>
          <li><a href="/disclaimer/">Disclaimer</a></li>'''
        note = "క్రమవృద్ధి ఒక స్వతంత్ర సమాచార వెబ్‌సైట్. ఇది ప్రభుత్వ వెబ్‌సైట్ కాదు, భారత ప్రభుత్వం లేదా ఏ రాష్ట్ర ప్రభుత్వంతోనూ సంబంధం లేదు. దరఖాస్తు చేసే ముందు అధికారిక పోర్టల్‌లో వివరాలు తప్పకుండా సరిచూసుకోండి."
    else:
        links = '''          <li><a href="/schemes/">Schemes</a></li>
          <li><a href="/updates/">Updates</a></li>
          <li><a href="/te/schemes/">తెలుగు</a></li>
          <li><a href="/tools/">Tools</a></li>
          <li><a href="/games/">Games</a></li>
          <li><a href="/about/">About</a></li>
          <li><a href="/contact/">Contact</a></li>
          <li><a href="/privacy-policy/">Privacy Policy</a></li>
          <li><a href="/disclaimer/">Disclaimer</a></li>'''
        note = "Kramavriddhi is an independent information website. It is not a government website and is not affiliated with the Government of India or any state government. Always confirm details on the official portal before applying."
    return f'''
    <footer class="site">
      <div class="cols">
        <span>© 2026 Kramavriddhi · <span lang="sa">क्रमेण वर्धामहे</span></span>
        <ul>
{links}
        </ul>
      </div>
      <p class="disclaimer">{note}</p>
    </footer>
  </div>
</body>
</html>
'''

FOOTER = footer("en")
