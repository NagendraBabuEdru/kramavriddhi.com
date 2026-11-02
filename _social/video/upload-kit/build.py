"""Builds the Upload Kit page (YouTube + Instagram text for every Short, with copy buttons) from
_social/videos/UPLOAD.md and section 6 of _social/SOCIAL_KIT.md.
Run: python _social/video/upload-kit/build.py  ->  _social/videos/upload-kit.html (publish that file)
Update DEADLINE / CHECK / SKIP / TOPIC and the plan in template.html when Shorts are added or go out of date."""
import json, re, os

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.normpath(os.path.join(HERE, '..', '..'))
OUT = os.path.join(ROOT, 'videos', 'upload-kit.html')
up = open(os.path.join(ROOT, 'videos', 'UPLOAD.md'), encoding='utf-8').read()
kit = open(os.path.join(ROOT, 'SOCIAL_KIT.md'), encoding='utf-8').read()
kit = kit[kit.index('## 6. Instagram Reels'):]
F = '`' * 3

DEADLINE = {'10': '15 Dec', '15': '30 Nov', '19': '19 Nov'}
CHECK = {'5'}  # date-sensitive: check the guide before posting
SKIP = {'1': 'closed 31 Oct', '2': 'outdated', '4': 'closed 31 Oct', '6': 'outdated',
        '7': 'closed 31 Oct', '8': 'closed 31 Oct', '14': 'paid 30 Oct'}  # don't post
TOPIC = {
    '1': 'Pragati Scholarship', '2': 'PM-KISAN 24th instalment', '3': 'Eligibility checker',
    '4': 'Central Sector Scholarship', '5': 'Thalliki Vandanam phase 2', '6': 'Farmer checklist',
    '7': 'Pragati Scholarship', '8': 'Central Sector Scholarship', '9': 'Sukanya Samriddhi',
    '10': 'PM Fasal Bima (AP Rabi)', '11': 'PM Surya Ghar solar', '12': 'Kisan Credit Card', '13': 'Ujjwala gas subsidy',
    '14': 'PM-KISAN 24th: 30 Oct reported', '15': 'Deepam-2 free cylinder', '16': 'Ayushman Bharat card', '17': 'Atal Pension Yojana',
    '18': 'PM Vidyalaxmi education loan', '19': 'Rajiv Yuva Vikasam (Telangana)', '20': 'Dr NTR Vaidya Seva (AP)',
    '21': 'PM-KISAN + Annadata paid: not received?'}

shorts = []
for m in re.finditer(r'^## Short (\d+): (.*?) \(`(.*?)`\)\n(.*?)(?=^## |^# |\Z)', up, re.S | re.M):
    n, name, file, body = m.groups()
    def block(label):
        mm = re.search(r'\*\*' + re.escape(label) + r'\*\*\n' + F + r'\n(.*?)\n' + F, body, re.S)
        return mm.group(1).strip() if mm else ''
    tt = re.search(r'\*\*Telugu title \(translation\):\*\* `(.*?)`', body)
    pl = re.search(r'\*\*Playlists:\*\* (.*)', body)
    rm = re.search(r'\*\*Reel ' + n + r' – .*?\n' + F + r'\n(.*?)\n' + F + r'\nPinned comment: `(.*?)`', kit, re.S)
    assert rm, n
    shorts.append(dict(
        n=int(n), file=file, topic=TOPIC[n], lang='te' if int(n) <= 6 else 'en',
        deadline=DEADLINE.get(n, ''), check=n in CHECK, skip=SKIP.get(n, ''),
        yt=dict(title=block('Title'), te_title=tt.group(1) if tt else '', desc=block('Description'),
                playlists=pl.group(1).strip() if pl else '', pin=block('Pinned comment')),
        ig=dict(caption=rm.group(1).strip(), pin=rm.group(2).strip())))
shorts.sort(key=lambda s: s['n'])
assert len(shorts) == len(TOPIC), (len(shorts), len(TOPIC))

bio = re.search(r'Suggested bio.*?\n' + F + r'\n(.*?)\n' + F, kit, re.S).group(1).strip()
data = json.dumps(dict(shorts=shorts, bio=bio), ensure_ascii=False).replace('</', '<\\/')

page = open(os.path.join(HERE, 'template.html'), encoding='utf-8').read()
assert page.count('/*DATA*/null') == 1
open(OUT, 'w', encoding='utf-8', newline='\n').write(page.replace('/*DATA*/null', data))
print('wrote', os.path.relpath(OUT), len(shorts), 'shorts')
