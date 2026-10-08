"""Builds the Kramavriddhi social media kit (profile picture, YouTube banner, Instagram posts).
Each image is an HTML page rendered to PNG with headless Microsoft Edge, so Telugu text shapes correctly.
Run: python _social/make_kit.py
"""
import os, subprocess

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "images")
TMP = os.path.join(HERE, "_html")
EDGE = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
os.makedirs(OUT, exist_ok=True)
os.makedirs(TMP, exist_ok=True)

TEAL, TEAL_DARK, CREAM, INK, GOLD = "#0f766e", "#0b4f4a", "#f7f7f4", "#14201e", "#f5b83d"
LOGO = f'<svg viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="{TEAL}"/><path d="M7 24h6v-5h6v-5h6V8" stroke="white" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>'
FONT = "font-family:'Segoe UI','Nirmala UI',system-ui,sans-serif;"

def render(name, w, h, body, bg=CREAM):
    html = f"""<!doctype html><html><head><meta charset="utf-8"><style>
    *{{margin:0;padding:0;box-sizing:border-box}}
    html,body{{width:{w}px;height:{h}px;overflow:hidden;background:{bg};{FONT}color:{INK}}}
    .te{{font-family:'Nirmala UI','Segoe UI',sans-serif}}
    </style></head><body>{body}</body></html>"""
    src = os.path.join(TMP, name + ".html")
    open(src, "w", encoding="utf-8").write(html)
    png = os.path.join(OUT, name + ".png")
    subprocess.run([EDGE, "--headless=new", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=1",
                    f"--window-size={w},{h}", f"--screenshot={png}", "file:///" + src.replace("\\", "/")],
                   check=True, capture_output=True, timeout=60)
    print("made", os.path.relpath(png, HERE))

# ---- 1. Profile picture (works for YouTube and Instagram; shows as a circle)
render("profile-picture", 800, 800, f"""
<div style="width:800px;height:800px;background:{TEAL};display:flex;flex-direction:column;align-items:center;justify-content:center;gap:28px">
  <svg viewBox="0 0 32 32" width="380" height="380"><path d="M7 24h6v-5h6v-5h6V8" stroke="white" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
  <div style="color:white;font-size:64px;font-weight:700;letter-spacing:1px;margin-top:-40px">Kramavriddhi</div>
</div>""", bg=TEAL)

# ---- 2. YouTube banner 2560x1440 (important text kept inside the central 1546x423 safe area)
render("youtube-banner", 2560, 1440, f"""
<div style="width:2560px;height:1440px;background:linear-gradient(135deg,{TEAL_DARK},{TEAL});display:flex;align-items:center;justify-content:center">
  <div style="width:1546px;height:423px;display:flex;align-items:center;gap:56px">
    <div style="width:260px;height:260px;flex-shrink:0">{LOGO.replace(f'fill="{TEAL}"', 'fill="white"').replace('stroke="white"', f'stroke="{TEAL}"')}</div>
    <div style="color:white">
      <div style="font-size:96px;font-weight:700;line-height:1">Kramavriddhi</div>
      <div class="te" style="font-size:52px;margin-top:18px;font-weight:600">ప్రభుత్వ పథకాలు · సులభంగా తెలుగులో</div>
      <div style="font-size:40px;margin-top:14px;opacity:.9">Govt schemes explained simply · AP · Telangana · Central</div>
      <div style="font-size:36px;margin-top:22px;color:{GOLD};font-weight:700">kramavriddhi.com</div>
    </div>
  </div>
</div>""", bg=TEAL)

# ---- 3. Instagram posts 1080x1350 (portrait). Bilingual, one big number, clear call to action.
def post(name, tag, tag_color, title_te, title_en, big, big_label, points, cta):
    pts = "".join(f'<li style="margin:14px 0">{p}</li>' for p in points)
    render(name, 1080, 1350, f"""
<div style="width:1080px;height:1350px;display:flex;flex-direction:column;padding:70px 72px;background:{CREAM}">
  <div style="display:flex;align-items:center;gap:18px">
    <div style="width:70px;height:70px">{LOGO}</div>
    <div style="font-size:38px;font-weight:700">Kramavriddhi</div>
    <div style="margin-left:auto;background:{tag_color};color:white;font-size:30px;font-weight:700;padding:12px 26px;border-radius:40px">{tag}</div>
  </div>
  <div class="te" style="font-size:66px;font-weight:700;line-height:1.3;margin-top:64px">{title_te}</div>
  <div style="font-size:40px;color:#55625f;margin-top:14px;font-weight:600">{title_en}</div>
  <div style="margin-top:46px;background:{TEAL};color:white;border-radius:30px;padding:40px 48px">
    <div style="font-size:120px;font-weight:800;line-height:1">{big}</div>
    <div class="te" style="font-size:38px;margin-top:12px;font-weight:600">{big_label}</div>
  </div>
  <ul class="te" style="font-size:38px;line-height:1.45;margin:40px 0 0 44px">{pts}</ul>
  <div style="margin-top:auto;display:flex;align-items:center;justify-content:space-between;border-top:3px solid #e2e5e1;padding-top:30px">
    <div class="te" style="font-size:36px;font-weight:700">{cta}</div>
    <div style="font-size:38px;font-weight:800;color:{TEAL}">kramavriddhi.com</div>
  </div>
</div>""")

post("post-1-pragati", "⏰ Last date 31 Oct", "#d97706",
     "అమ్మాయిలకు ఏడాదికి ₹50,000 స్కాలర్‌షిప్", "AICTE Pragati Scholarship for girls",
     "₹50,000", "ప్రతి సంవత్సరం · ఇంజినీరింగ్, ఫార్మసీ, పాలిటెక్నిక్",
     ["కుటుంబ ఆదాయం ₹8 లక్షల లోపు", "ఒక కుటుంబంలో ఇద్దరు అమ్మాయిల వరకు", "National Scholarship Portal లో దరఖాస్తు"],
     "పూర్తి వివరాలు 👉")
post("post-2-pm-kisan", "📅 Expected", "#2563eb",
     "పీఎం కిసాన్ 24వ విడత ఎప్పుడు?", "PM-KISAN 24th instalment",
     "₹2,000", "అక్టోబర్–నవంబర్‌లో రావచ్చు · అధికారిక తేదీ ఇంకా లేదు",
     ["ఈకేవైసీ పూర్తి చేశారా?", "ఆధార్–బ్యాంకు లింక్ ఉందా?", "'20 అక్టోబర్' తేదీ ఇంకా నిర్ధారణ కాలేదు"],
     "స్టేటస్ ఎలా చూడాలి 👉")
post("post-3-deepam", "⏰ Book by 30 Nov", "#d97706",
     "దీపం-2: ఉచిత గ్యాస్ సిలిండర్ బుక్ చేశారా?", "AP Deepam-2 free LPG cylinder",
     "3 / ఏడాది", "ఉచిత సిలిండర్లు · 48 గంటల్లో డబ్బు వాపసు",
     ["ఆగస్టు–నవంబర్ సిలిండర్ 30 నవంబర్ లోపు", "వాడుకోకపోతే తర్వాతి కాలానికి రాదు", "బియ్యం కార్డు + గ్యాస్ కనెక్షన్ ఉండాలి"],
     "పూర్తి వివరాలు 👉")
post("post-4-thalliki", "📚 AP", TEAL,
     "తల్లికి వందనం: ఒక్కో బిడ్డకు ₹15,000", "Thalliki Vandanam 2026-27",
     "₹13,000", "తల్లి ఖాతాలో జమ · ₹2,000 పాఠశాల నిర్వహణకు",
     ["1–12 తరగతుల ప్రతి బిడ్డకు", "75% హాజరు తప్పనిసరి", "జాబితాలో పేరు లేకపోతే సచివాలయంలో అడగండి"],
     "పూర్తి వివరాలు 👉")
post("post-5-checker", "✅ Free tool", "#7c3aed",
     "మీకు ఏ ప్రభుత్వ పథకాలు వస్తాయి?", "Which schemes am I eligible for?",
     "1 నిమిషం", "కొన్ని ప్రశ్నలకు సమాధానం ఇవ్వండి",
     ["కేంద్ర, ఏపీ, తెలంగాణ పథకాలు", "తెలుగు & ఇంగ్లీష్‌లో", "పూర్తిగా ఉచితం · మీ వివరాలు ఎక్కడికీ వెళ్ళవు"],
     "ఇప్పుడే చెక్ చేయండి 👉")
