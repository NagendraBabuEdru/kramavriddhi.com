# Shared page shell for Kramavriddhi static pages
LOGO = '<svg viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="8" fill="var(--accent)"/><path d="M7 24h6v-5h6v-5h6V8" stroke="var(--bg)" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>'
FAVICON = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='8' fill='%230f766e'/><path d='M7 24h6v-5h6v-5h6V8' stroke='white' stroke-width='3' fill='none' stroke-linecap='round' stroke-linejoin='round'/></svg>"

import hashlib, html, os
from urllib.parse import quote
from og import DEFAULT_URL as OG_DEFAULT
_ASSETS = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "assets")
ASSET_VERSION = hashlib.md5(b"".join(open(os.path.join(_ASSETS, n), "rb").read() for n in ("style.css", "site.js"))).hexdigest()[:8]

GA_ID = "G-S6RF0STQM2"  # Google Analytics 4 measurement ID
GA_TAG = f'''
  <script async src="https://www.googletagmanager.com/gtag/js?id={GA_ID}"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){{dataLayer.push(arguments);}}
    gtag('js', new Date());
    gtag('config', '{GA_ID}');
  </script>'''

FONTS = {
    "en": "family=Inter:wght@400;500;600;700&family=Fraunces:opsz,wght@9..144,600",
    "te": "family=Inter:wght@400;500;600;700&family=Fraunces:opsz,wght@9..144,600&family=Noto+Sans+Telugu:wght@400;600;700",
}

def head(title, desc, path, extra="", lang="en", alternates=None, image=None, og_type="website"):
    """alternates: {"en": "/path/", "te": "/te/path/"} when a page exists in both languages.
    image: absolute og:image URL (see og.py); pages without their own card use the site card."""
    alt = ""
    if alternates:
        alt = "".join(f'\n  <link rel="alternate" hreflang="{l}" href="https://kramavriddhi.com{p}">' for l, p in alternates.items())
        alt += f'\n  <link rel="alternate" hreflang="x-default" href="https://kramavriddhi.com{alternates["en"]}">'
    return f'''<!doctype html>
<html lang="{lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">{GA_TAG}
  <title>{title}</title>
  <meta name="description" content="{desc}">
  <link rel="canonical" href="https://kramavriddhi.com{path}">{alt}
  <meta property="og:title" content="{title}">
  <meta property="og:description" content="{desc}">
  <meta property="og:url" content="https://kramavriddhi.com{path}">
  <meta property="og:type" content="{og_type}">
  <meta property="og:image" content="{image or OG_DEFAULT}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="{title}">
  <meta name="twitter:card" content="summary_large_image">
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
    "en": dict(schemes="Schemes", tools="Tools", games="Games", apps="Apps", products="Products", about="About", contact="Contact"),
    "te": dict(schemes="పథకాలు", tools="సాధనాలు", games="ఆటలు", apps="యాప్‌లు", products="ఉత్పత్తులు", about="మా గురించి", contact="సంప్రదించండి"),
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
        {li("/apps/", L["apps"], "apps")}
        {li("/about/", L["about"], "about", "hide-sm")}
        {li("/contact/", L["contact"], "contact")}
      </ul>
    </nav>
'''

# Official social profiles (shown in every footer). Add Instagram here when it is ready.
SOCIAL = [
    dict(name="YouTube", url="https://www.youtube.com/@kramavriddhi",
         icon='<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M23 7.2a3 3 0 0 0-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 0 0 1 7.2 31 31 0 0 0 .5 12a31 31 0 0 0 .5 4.8 3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .5-4.8 31 31 0 0 0-.5-4.8ZM9.8 15.1V8.9l5.4 3.1-5.4 3.1Z"/></svg>'),
]

# Share bar: WhatsApp link works without JavaScript; site.js shows "Copy link" and the phone's own share sheet.
SHARE_LABELS = {
    "en": dict(label="Share:", copy="Copy link", done="Link copied ✓", more="More",
               ask="Know someone who needs this? Share it with family and friends on WhatsApp."),
    "te": dict(label="షేర్ చేయండి:", copy="లింక్ కాపీ", done="కాపీ అయింది ✓", more="ఇంకా",
               ask="ఈ సమాచారం ఎవరికైనా ఉపయోగపడుతుందా? కుటుంబం, స్నేహితులతో వాట్సాప్‌లో షేర్ చేయండి."),
}
WA_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Z"/><path fill="#15803d" d="M8.6 7.2c.2-.4.5-.4.8-.4h.6c.2 0 .4.1.5.4l.8 1.9c.1.2 0 .5-.1.7l-.6.7c-.1.2-.1.4 0 .6.8 1.4 1.9 2.4 3.3 3.1.2.1.4.1.6-.1l.7-.8c.2-.2.4-.2.7-.1l1.8.9c.3.1.4.3.4.6 0 .9-.6 1.8-1.5 2-.8.2-1.8.2-3.5-.6-2.1-1-3.7-2.7-4.6-4.4-.8-1.5-.6-2.6-.2-3.4l.3-.6Z"/></svg>'
LINK_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/></svg>'
SHARE_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M12 3v12M7 8l5-5 5 5M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6"/></svg>'

def share_bar(path, text, lang="en", big=False):
    """path: page path like /schemes/pm-kisan/. text: one-line message sent before the link."""
    L = SHARE_LABELS[lang]
    url = "https://kramavriddhi.com" + path
    wa = "https://wa.me/?text=" + quote(f"{text}\n{url}")
    bar = f'''<div class="share" data-url="{url}" data-text="{html.escape(text)}">
          <span class="share-label">{L["label"]}</span>
          <a class="share-btn wa" href="{wa}" target="_blank" rel="noopener" data-share="whatsapp">{WA_ICON}<span>WhatsApp</span></a>
          <button class="share-btn" type="button" data-share="copy" data-done="{L["done"]}" hidden>{LINK_ICON}<span>{L["copy"]}</span></button>
          <button class="share-btn" type="button" data-share="native" hidden>{SHARE_ICON}<span>{L["more"]}</span></button>
        </div>'''
    if big:
        return f'''
        <div class="share-box">
          <p>{L["ask"]}</p>
          {bar}
        </div>'''
    return "\n        " + bar

def social_links(lang="en"):
    label = "మమ్మల్ని ఫాలో అవ్వండి:" if lang == "te" else "Follow us:"
    items = "".join(f'<a href="{s["url"]}" target="_blank" rel="noopener me">{s["icon"]}<span>{s["name"]}</span></a>' for s in SOCIAL)
    return f'<div class="social"><span>{label}</span>{items}</div>'

def footer(lang="en"):
    if lang == "te":
        links = '''          <li><a href="/te/schemes/">తెలుగు పథకాలు</a></li>
          <li><a href="/te/updates/">తాజా సమాచారం</a></li>
          <li><a href="/schemes/">Schemes (English)</a></li>
          <li><a href="/tools/">సాధనాలు</a></li>
          <li><a href="/apps/">యాప్‌లు</a></li>
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
          <li><a href="/apps/">Apps</a></li>
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
      {social_links(lang)}
      <p class="disclaimer">{note}</p>
    </footer>
  </div>
</body>
</html>
'''

FOOTER = footer("en")
