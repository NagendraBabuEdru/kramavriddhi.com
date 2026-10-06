# Shared page shell for Kramavriddhi static pages
LOGO = '<svg viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="8" fill="var(--accent)"/><path d="M7 24h6v-5h6v-5h6V8" stroke="var(--bg)" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>'
FAVICON = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='8' fill='%230f766e'/><path d='M7 24h6v-5h6v-5h6V8' stroke='white' stroke-width='3' fill='none' stroke-linecap='round' stroke-linejoin='round'/></svg>"

def head(title, desc, path, extra=""):
    return f'''<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{title}</title>
  <meta name="description" content="{desc}">
  <link rel="canonical" href="https://kramavriddhi.com{path}">
  <meta property="og:title" content="{title}">
  <meta property="og:description" content="{desc}">
  <meta property="og:url" content="https://kramavriddhi.com{path}">
  <meta property="og:site_name" content="Kramavriddhi">
  <link rel="icon" href="{FAVICON}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Fraunces:opsz,wght@9..144,600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/assets/style.css">{extra}
</head>
<body>
  <div class="wrap">
'''

def nav(active=""):
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
        {li("/schemes/", "Schemes", "schemes")}
        {li("/tools/", "Tools", "tools")}
        {li("/#products", "Products", "products", "hide-sm")}
        {li("/about/", "About", "about", "hide-sm")}
        {li("/contact/", "Contact", "contact")}
      </ul>
    </nav>
'''

FOOTER = '''
    <footer class="site">
      <div class="cols">
        <span>© 2026 Kramavriddhi · <span lang="sa">क्रमेण वर्धामहे</span></span>
        <ul>
          <li><a href="/schemes/">Schemes</a></li>
          <li><a href="/tools/">Tools</a></li>
          <li><a href="/about/">About</a></li>
          <li><a href="/contact/">Contact</a></li>
          <li><a href="/privacy-policy/">Privacy Policy</a></li>
          <li><a href="/disclaimer/">Disclaimer</a></li>
        </ul>
      </div>
      <p class="disclaimer">Kramavriddhi is an independent information website. It is not a government website and is not affiliated with the Government of India or any state government. Always confirm details on the official portal before applying.</p>
    </footer>
  </div>
</body>
</html>
'''
