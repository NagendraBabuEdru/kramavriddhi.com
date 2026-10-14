# Link preview images (og:image) for WhatsApp, Facebook, X and Telegram.
# Each card is a small HTML page rendered to a 1200x630 PNG with headless Microsoft Edge,
# so Telugu text shapes correctly (PIL here has no raqm). gen.py calls build() at the end
# and only cards whose content changed are re-rendered (hashes in og_manifest.json).
import hashlib, html, json, os, shutil, subprocess, tempfile
from concurrent.futures import ThreadPoolExecutor

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(os.path.dirname(HERE), "assets", "og")
MANIFEST = os.path.join(HERE, "og_manifest.json")
EDGE = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
W, H = 1200, 630
TEMPLATE_VERSION = "2"  # bump to re-render every card after changing the design below

TEAL, TEAL_DARK, CREAM, INK, MUTED, BORDER, SOFT = "#0f766e", "#0b4f4a", "#f7f7f4", "#14201e", "#55625f", "#e2e5e1", "#e3f3f0"
LOGO = f'<svg viewBox="0 0 32 32" width="56" height="56"><rect width="32" height="32" rx="8" fill="{TEAL}"/><path d="M7 24h6v-5h6v-5h6V8" stroke="white" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>'

FOOT = {"en": "Who can apply · Benefits · How to apply",
        "te": "అర్హత · లబ్ధి · దరఖాస్తు విధానం"}

DEFAULT = dict(name="default", lang="en", kind="site")


def _hash(card):
    return hashlib.md5((TEMPLATE_VERSION + json.dumps(card, sort_keys=True, ensure_ascii=False)).encode()).hexdigest()[:8]


def card_path(card):
    return ("te/" if card["lang"] == "te" and card.get("kind") != "site" else "") + card["name"] + ".png"


def card_url(card):
    """Absolute image URL with a content version, so WhatsApp refetches it when the card changes."""
    return f"https://kramavriddhi.com/assets/og/{card_path(card)}?v={_hash(card)}"


DEFAULT_URL = card_url(DEFAULT)


def _page(card):
    e = html.escape
    te = card["lang"] == "te"
    font = "'Nirmala UI','Segoe UI',sans-serif" if te else "'Segoe UI',system-ui,sans-serif"
    head = f'''<div style="display:flex;align-items:center;gap:16px">{LOGO}
      <div style="font-family:'Segoe UI',sans-serif;font-size:34px;font-weight:700;color:{INK}">Kramavriddhi</div>'''
    if card.get("kind") == "site":
        body = f'''
  <div style="height:{H}px;padding:64px 72px;display:flex;flex-direction:column;background:{TEAL_DARK};border-top:14px solid #f5b83d;color:white;font-family:'Segoe UI',sans-serif">
    <div style="display:flex;align-items:center;gap:18px">{LOGO.replace(f'fill="{TEAL}"', 'fill="white"').replace('stroke="white"', f'stroke="{TEAL}"')}
      <div style="font-size:38px;font-weight:700">Kramavriddhi</div></div>
    <div style="font-family:Georgia,serif;font-size:76px;font-weight:700;line-height:1.1;margin-top:58px">Government schemes,<br>explained simply</div>
    <div style="font-family:'Nirmala UI',sans-serif;font-size:42px;font-weight:700;margin-top:22px">ప్రభుత్వ పథకాలు · సులభంగా తెలుగులో</div>
    <div style="margin-top:auto;display:flex;justify-content:space-between;align-items:center;font-size:32px">
      <span style="opacity:.9">Central · Andhra Pradesh · Telangana</span>
      <span style="font-weight:800;color:#f5b83d">kramavriddhi.com</span></div>
  </div>'''
    else:
        facts = "".join(f'''<div style="background:white;border:2px solid {BORDER};border-radius:20px;padding:18px 22px;flex:1;min-width:0">
          <div style="font-size:24px;color:{MUTED};font-weight:600">{e(k)}</div>
          <div style="font-size:{34 if len(v) <= 16 else 29}px;font-weight:700;line-height:1.2;margin-top:6px;color:{INK}">{e(v)}</div></div>''' for k, v in card["facts"])
        title_font = font if te else "Georgia,serif"
        size = 76 if len(card["title"]) <= 22 else 62
        body = f'''
  <div style="height:{H}px;padding:52px 64px 44px;display:flex;flex-direction:column;background:{CREAM};border-top:14px solid {TEAL};font-family:{font};color:{INK}">
    {head}
      <div style="margin-left:auto;background:{SOFT};color:{TEAL_DARK};font-size:28px;font-weight:700;padding:10px 24px;border-radius:40px">{e(card["tag"])}</div></div>
    <div style="display:flex;align-items:center;gap:28px;margin-top:40px">
      <div style="width:116px;height:116px;flex-shrink:0;border-radius:28px;background:{SOFT};display:flex;align-items:center;justify-content:center;font-size:70px;font-family:'Segoe UI Emoji'">{card["icon"]}</div>
      <div style="font-family:{title_font};font-size:{size}px;font-weight:700;line-height:1.12">{e(card["title"])}</div></div>
    <div style="display:flex;gap:18px;margin-top:38px;align-items:stretch">{facts}</div>
    <div style="margin-top:auto;display:flex;justify-content:space-between;align-items:center;border-top:2px solid {BORDER};padding-top:22px">
      <span style="font-size:30px;font-weight:600;color:{MUTED}">{e(card.get("foot") or FOOT[card["lang"]])}</span>
      <span style="font-family:'Segoe UI',sans-serif;font-size:32px;font-weight:800;color:{TEAL}">kramavriddhi.com</span></div>
  </div>'''
    return f'''<!doctype html><html><head><meta charset="utf-8"><style>
*{{margin:0;padding:0;box-sizing:border-box}} html,body{{width:{W}px;height:{H}px;overflow:hidden}}
</style></head><body>{body}</body></html>'''


def _render(card, tmp):
    out = os.path.join(OUT, card_path(card))
    os.makedirs(os.path.dirname(out), exist_ok=True)
    key = card["lang"] + "-" + card["name"]
    src = os.path.join(tmp, key + ".html")
    with open(src, "w", encoding="utf-8") as f:
        f.write(_page(card))
    if os.path.exists(out):
        os.remove(out)
    # A fresh Edge profile for every card: a reused profile hands off to the still-running
    # instance and silently skips the screenshot. Edge can also exit without writing the file
    # (for example from a sandboxed shell), so check and retry once, then stop with an error.
    for attempt in range(2):
        profile = os.path.join(tmp, f"profile-{key}-{attempt}")
        subprocess.run([EDGE, "--headless=new", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=1",
                        "--no-first-run", "--no-default-browser-check", "--disable-extensions", "--disable-sync",
                        f"--user-data-dir={profile}", f"--window-size={W},{H}", f"--screenshot={out}",
                        "file:///" + src.replace("\\", "/")], check=True, capture_output=True, timeout=90)
        if os.path.exists(out):
            return card_path(card)
    raise RuntimeError(f"og: Edge did not write {card_path(card)}. Try running gen.py from PowerShell.")


def build(cards):
    """Render cards whose content changed since the last build. Missing Edge only prints a warning."""
    cards = [DEFAULT] + list(cards)
    try:
        done = json.load(open(MANIFEST, encoding="utf-8"))
    except (OSError, ValueError):
        done = {}
    todo = [c for c in cards if done.get(card_path(c)) != _hash(c) or not os.path.exists(os.path.join(OUT, card_path(c)))]
    if todo and not os.path.exists(EDGE):
        print(f"og: Microsoft Edge not found, {len(todo)} preview images not rendered")
        return
    if todo:
        tmp = tempfile.mkdtemp(prefix="kv-og-")
        try:
            with ThreadPoolExecutor(4) as pool:
                for p in pool.map(lambda c: _render(c, tmp), todo):
                    print("og: rendered", p)
        finally:
            shutil.rmtree(tmp, ignore_errors=True)
    keep = {card_path(c): _hash(c) for c in cards}
    for root, _, files in os.walk(OUT):  # remove images of guides that no longer exist
        for f in files:
            rel = os.path.relpath(os.path.join(root, f), OUT).replace("\\", "/")
            if rel.endswith(".png") and rel not in keep:
                os.remove(os.path.join(root, f))
                print("og: removed", rel)
    with open(MANIFEST, "w", encoding="utf-8", newline="\n") as f:
        json.dump(keep, f, indent=1, sort_keys=True)
        f.write("\n")
    print(f"og: {len(todo)} rendered, {len(cards) - len(todo)} unchanged")
