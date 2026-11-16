# Learn by Playing: master tracker

**Read this file before every change to `learn/`. Update it after every change.**
It is the single place that says what exists, what comes next, and in what order.
Folders and files starting with `_` are not published, so this file stays private.

Last updated: 16 Nov 2026 (Phase 8 done)

---

## 1. The big idea

Kramavriddhi Learn becomes a **mobile-first, Instagram-style learning feed**:

1. A new user picks the skills they want (Python, Azure, Git, Linux...), like choosing interests on Instagram.
2. Their feed shows short "reel" cards **from those skills only**, in a fixed order: **Basic → Intermediate → Advanced**.
3. Each concept (a **unit**) is taught completely before the next one starts: first a short explainer card, then practice tasks, then a mini game, then a checkpoint.
4. Progress, streaks, likes and saved cards are kept for each skill.
5. Mistakes come back a few days later for revision (spaced review).
6. Later: users can send in their own tasks; we check them and publish the good ones with credit.

## 2. How the content is organised

```
Track (a skill, e.g. Python)
 └─ Level: Basic | Intermediate | Advanced
     └─ Unit (one concept, e.g. "for loops"), in a fixed order
         └─ Cards (6 to 8 per unit), always in this order:
             1. learn      one-screen explainer reel: the idea, a tiny example, why it matters
             2. tasks      3 to 5 quick tasks (output / choice / order / bug)
             3. game       1 mini game (pipe / indent, more game types later)
             4. check      2 checkpoint questions; pass to finish the unit
```

**Card IDs never change** once published, so saved progress keeps working:
`<track>.<level>.<unit>.<card>`, e.g. `py.b.07.3` = Python, Basic, unit 7, card 3.

**Status marks used below:** ✅ live · 🟡 being written / live but thin · ⬜ planned · 🔁 needs rework

For Git, Linux, SQL, Docker, Kubernetes, Ansible and DevOps the exact live units are listed in `learn/daily/tracks.js` (any unit with cards is live) and shown in the app's Path view.

## 3. Build order (phases)

Work strictly in this order. Do not start a phase before the one above is ✅.

| # | Phase | What it delivers | Status |
|---|---|---|---|
| 0 | Daily feed v1 | Day-based feed, 5 tasks + 1 mini game a day, streak, Instagram look, brand themes per topic, Learn more links | ✅ live (12 Nov 2026) |
| 1 | Tracks engine | Skill picker on first open; feed built from chosen tracks in unit order; progress per track; card IDs; the new `learn` explainer card; existing 84 cards moved into units | ✅ live (15 Nov 2026): 9 tracks, 124 units planned, 43 units live, 127 cards (84 old + 43 explainers) |
| 2 | First two tracks complete to Basic | Python Basic (10 units) and Azure Data Engineering Basic (6 units) fully written, 6 to 8 cards each, plus 2 checkpoint cards per unit (`check` type, also enables D3 test-out) | ✅ live (15 Nov 2026): 75 new cards, 16 units at 6 to 8 cards + 2 checkpoints, test-out built |
| 3 | Spaced review | Wrong answers return after 1, 3 and 7 days; "Review" cards in the feed | ✅ live (15 Nov 2026): missed cards return after 1, 3, 7 days; right 3 times in a row = mastered; wrong resets to 1 day; max 10 reviews a day, shown before new units; reviews count toward the daily goal; earlier mistakes picked up automatically |
| 3b | Game breaks | 🎮 Game break every 6 cards (every 4 after the daily goal): ⚡ speed round (3 questions, 30 s, combo), 🧩 puzzle (pipe/indent, practice only), 🕹️ full game (opens with "Back to my feed"). Only from chosen skills; kinds played/liked come more, skipped less; never the same kind twice in a row; finishing one counts toward the daily goal, never changes lesson progress | ✅ live (15 Nov 2026), owner asked for it before Phase 4 |
| 4 | More tracks to Basic | Git, Linux, SQL Basic, plus **Power BI** (new track added at the owner's request) | ✅ live (15 Nov 2026): 129 new cards; Git, Linux, SQL and Power BI Basic complete (6 to 8 cards + 2 checkpoints per unit) |
| 5 | Intermediate levels | Python, Azure, Git, Linux, SQL, Power BI Intermediate | ✅ live (15 Nov 2026): 279 new cards, 35 Intermediate units complete (6 to 8 cards + 2 checkpoints each) |
| 6 | Docker, Kubernetes, Ansible, CI/CD Basic | Docker, Kubernetes, Ansible and DevOps/CI-CD Basic levels complete | ✅ live (15 Nov 2026): 94 new cards, 13 Basic units complete (6 to 8 cards + 2 checkpoints each); bug cards now show the right file (Dockerfile, terminal, deployment.yaml, ci.yml) |
| 7 | Install as an app (PWA) | Add to home screen, works offline, optional daily reminder | ✅ live (15 Nov 2026): `learn/manifest.webmanifest` (name "Kramavriddhi Learn", opens `/learn/daily/`), icons in `learn/icons/`, service worker `learn/sw.js` (scope `/learn/`: saves all 8 Learn pages + their files on first visit; pages network-first, `?v=` files cache-first, keeps only the newest version of each file). Profile card has 📲 Install (one tap on Android Chrome; steps for iPhone and other browsers) and ⏰ Daily reminder = a repeating event in the learner's **own calendar** (Google Calendar link or .ics file), because real push notifications need a server (later, with D5) |
| 8 | Telugu version | Telugu explainer cards and questions | ✅ live (16 Nov 2026): English / తెలుగు switch on the picker and profile card (also `?lang=te` links); all **391 Basic cards** of all 10 skills, all 142 unit titles, skill blurbs and every button/label in Telugu (`learn/daily/te.js`, loaded only in Telugu mode). Code, commands, outputs and backtick text stay English; tech words stay in English letters. Intermediate units show "English for now" (→ **8b**) |
| 6b | Docker, Kubernetes, Ansible, CI/CD Intermediate | Units dk 4–7, k8s 4–6, ans 5–8, ops 4–6 (14 units) to 6–8 cards + 2 checkpoints, same method as Phases 5–6. Gap found 16 Nov 2026: Phase 5 covered only 6 skills | ⬜ **NEXT** (owner's pick pending) |
| S1 | Reels mode, My notes, Profile (owner asked 16 Nov 2026) | ▶ Reels mode (full screen, one card per swipe, site menu hidden, remembered per phone); 💬 My notes on every card (saved on the phone) + "Ask a doubt" (WhatsApp message with the question and the doubt); 👤 Profile page (`?profile=1`: name + initials avatar, 6 stats, 12-week calendar, skills by level, 11 badges, notes, saved, WhatsApp share). All in English and Telugu | ✅ live (16 Nov 2026). Public comments / public profiles need login + database (decision D5) |
| 8b | Telugu for Intermediate | The 309 Intermediate cards in Telugu, same method | ⬜ |
| 9 | User-submitted tasks | Submit form, review queue, credit on the card | ⬜ (needs a decision on how: see section 7; 8b can run any time before or after) |
| 10 | Advanced levels | All tracks | ⬜ |
| 11 | Challenges and achievement posts | Timed challenge (10 questions, time limit, up to 3 tries, shuffled) after a completed level; achievement card (skill brand look, time, tries, score, Gold/Silver/Bronze badge, check code, caption); share to LinkedIn / WhatsApp / image. Can start with completed **Basic** levels before Phase 10. Mockup approved by owner 15 Nov 2026 | ⬜ |
| 12 | Achievements feed | Shared Instagram-style feed of everyone's achievement posts, Applaud + Insightful reactions only, "Try this challenge" button. Needs accounts, a database and moderation (decision D5) | ⬜ (after D5) |

## 4. Tracks, levels and units (the syllabus, in teaching order)

Unit count per level is a plan; it can grow. Each unit = about 6 to 8 cards.

### 4.1 Python (`py`) · brand look: python.org
| Level | Units in order | Status |
|---|---|---|
| Basic | 1 print and variables · 2 numbers and maths · 3 strings · 4 input and type conversion · 5 if / elif / else · 6 lists · 7 for loops and range · 8 while loops · 9 functions · 10 dictionaries | ✅ complete: every unit 6 to 8 cards + 2 checkpoints |
| Intermediate | 11 tuples and sets · 12 string methods and f-strings · 13 errors and try/except · 14 files (`with open`) · 15 modules and pip · 16 list comprehensions · 17 default args, *args, **kwargs · 18 classes and objects · 19 virtual environments · 20 JSON and CSV | ✅ complete (Phase 5) |
| Advanced | 21 iterators and generators · 22 decorators · 23 context managers · 24 type hints · 25 testing with pytest · 26 async basics · 27 pandas for data · 28 project structure and packaging | ⬜ |

### 4.2 Azure Data Engineering (`az`) · brand look: Microsoft Learn
Matches the levels of `/courses/azure-data-engineering/`.
| Level | Units in order | Status |
|---|---|---|
| Basic | 1 cloud basics and the Azure hierarchy · 2 storage accounts and tiers · 3 Data Lake Gen2 · 4 Data Factory pipelines · 5 Azure SQL basics · 6 Power BI basics | ✅ complete: every unit 6 cards + 2 checkpoints |
| Intermediate | 7 Databricks and Spark · 8 medallion and Delta Lake · 9 Synapse · 10 Event Hubs and Stream Analytics · 11 Key Vault and security · 12 Parquet and partitioning | ✅ complete (Phase 5) |
| Advanced | 13 Microsoft Fabric · 14 governance and Unity Catalog · 15 CI/CD for data · 16 Bicep (infrastructure as code) · 17 cost optimisation · 18 monitoring | 🟡 16 live (2 cards); rest ⬜ |

### 4.3 Git (`git`) · brand look: git-scm.com
| Level | Units in order | Status |
|---|---|---|
| Basic | 1 what Git is · 2 init, clone, add, commit · 3 status, log, diff · 4 push and pull | ✅ complete (Phase 4) |
| Intermediate | 5 branches · 6 merge · 7 merge conflicts · 8 pull requests | ✅ complete (Phase 5) |
| Advanced | 9 rebase · 10 stash · 11 revert vs reset · 12 tags and releases · 13 team workflows | ⬜ |

### 4.4 Linux (`lx`) · brand look: ubuntu.com
| Level | Units in order | Status |
|---|---|---|
| Basic | 1 files and folders · 2 reading files · 3 permissions · 4 users and sudo | ✅ complete (Phase 4) |
| Intermediate | 5 processes · 6 services (systemctl) · 7 packages (apt) · 8 networking commands · 9 shell scripts | ✅ complete (Phase 5) |
| Advanced | 10 cron · 11 logs and journalctl · 12 SSH keys · 13 troubleshooting a slow server | ⬜ |

### 4.5 SQL (`sql`) · brand look: Microsoft Learn (teal)
| Level | Units in order | Status |
|---|---|---|
| Basic | 1 SELECT and FROM · 2 WHERE · 3 ORDER BY · 4 COUNT, SUM, AVG | ✅ complete (Phase 4) |
| Intermediate | 5 GROUP BY and HAVING · 6 JOINs · 7 subqueries · 8 INSERT, UPDATE, DELETE | ✅ complete (Phase 5) |
| Advanced | 9 window functions · 10 CTEs · 11 indexes and performance · 12 star schema modelling | ⬜ |

### 4.5b Power BI (`pbi`) · brand look: Microsoft Learn with the Power BI yellow band (#F2C811, dark text)
Added 15 Nov 2026 at the owner's request.
| Level | Units in order | Status |
|---|---|---|
| Basic | 1 what Power BI is · 2 getting data · 3 Power Query basics · 4 visuals and charts · 5 filters and slicers · 6 publish and share | ✅ complete: every unit 6 cards + 2 checkpoints |
| Intermediate | 7 data modelling and relationships · 8 DAX basics: measures and columns · 9 CALCULATE and filter context · 10 time intelligence · 11 row-level security · 12 refresh and gateways | ✅ complete (Phase 5) |
| Advanced | 13 performance tuning · 14 composite models and aggregations · 15 deployment pipelines and Git · 16 Power BI in Microsoft Fabric · 17 paginated reports · 18 governance and sensitivity labels | ⬜ |

### 4.6 Docker (`dk`) · brand look: docs.docker.com
| Level | Units in order | Status |
|---|---|---|
| Basic | 1 images vs containers · 2 run, ps, stop · 3 Dockerfile | ✅ complete (Phase 6) |
| Intermediate | 4 volumes · 5 networks · 6 Docker Compose · 7 registries | ⬜ |
| Advanced | 8 multi-stage builds · 9 image size and security | ⬜ |

### 4.7 Kubernetes (`k8s`) · brand look: kubernetes.io
| Level | Units in order | Status |
|---|---|---|
| Basic | 1 cluster, node, pod · 2 kubectl basics · 3 deployments | ✅ complete (Phase 6) |
| Intermediate | 4 services · 5 ConfigMaps and Secrets · 6 scaling | ⬜ |
| Advanced | 7 ingress · 8 Helm · 9 RBAC · 10 AKS on Azure | ⬜ |

### 4.8 Ansible (`ans`) · brand look: Ansible docs
| Level | Units in order | Status |
|---|---|---|
| Basic | 1 inventory · 2 ad-hoc commands · 3 playbook structure · 4 apt, copy, service | ✅ complete (Phase 6; full game "Fix the Playbook" ✅) |
| Intermediate | 5 variables · 6 handlers · 7 templates · 8 loops and conditions | ⬜ |
| Advanced | 9 roles · 10 Ansible Vault · 11 Galaxy · 12 testing idempotency | ⬜ |

### 4.9 DevOps and CI/CD (`ops`) · brand look: Microsoft Learn (green)
| Level | Units in order | Status |
|---|---|---|
| Basic | 1 what DevOps is · 2 environments (dev, staging, prod) · 3 continuous integration | ✅ complete (Phase 6) |
| Intermediate | 4 pipeline YAML (GitHub Actions / Azure Pipelines) · 5 test stages · 6 artifacts | ⬜ |
| Advanced | 7 blue-green and canary releases · 8 infrastructure as code · 9 monitoring and SRE basics | ⬜ |

## 5. What is live now (inventory)

| Page | URL | Notes |
|---|---|---|
| Hub | /learn/ | Daily banner, Cloud & DevOps card, Python card, total stars of 60 |
| Learn feed | /learn/daily/ | Skill picker, unit-by-unit feed (skills take turns), daily goal of 6 cards, streak, Path view per skill, checkpoints + "I know this" test-out, likes, saves, share links `#card=<id>`, Learn more links. 704 cards in 86 live units, 10 skills. Old day-based feed retired 15 Nov 2026 |
| Cloud & DevOps | /learn/devops/ | 2 games + 6 coming-soon cards |
| Build the Data Pipeline | /learn/devops/azure-data-pipeline/ | 5 levels |
| Fix the Playbook | /learn/devops/ansible-fix-the-playbook/ | 5 levels |
| Python | /learn/python/ | 2 games + 3 coming-soon cards |
| Fix the Code | /learn/python/fix-the-code/ | 5 levels, built-in mini Python runner |
| Guess the Output | /learn/python/guess-the-output/ | 5 levels, 16 programs |

Files: `learn/common/learn.css` (all styles, versioned `?v=`), `learn/common/learn.js` (storage, analytics, stars, share), `learn/daily/tracks.js` (all feed content: tracks → units → cards with IDs), `learn/daily/app.js` (feed engine), `learn/_src/` (page bodies + `compose.py` that builds the HTML pages).
Browser storage keys: `kv-learn-pipeline`, `kv-learn-playbook`, `kv-learn-py-fix`, `kv-learn-py-output`, `kv-learn-feed` (feed: chosen tracks, done cards by ID (first answer), likes, saves, streak, cards per day, `review` {id: {due day, step}}, `mastered` count, `gb` {speed|puzzle|full: {p played, l liked, s skipped}}, `gbLast`). Old `kv-learn-daily` is read once to carry over the streak.
Analytics events: `game_start`, `level_complete` (feed: per unit, with `unit_id`), `track_select`, `daily_goal`, `daily_learn_more`, `unit_test_out`, `review_answer`, `game_break` (kind, action: play/done/skip/open).

## 6. Rules for every update

1. Read this file first. Pick the next ⬜ item in the phase order; do not jump ahead.
2. Facts must be correct: run every Python card in real Python, parse every YAML card, check every link returns 200, and use official docs for cloud facts.
3. Never change the ID or meaning of a published card; add a new one instead and mark the old one 🔁.
4. Test on a phone-sized screen (375 px) in light and dark mode before publishing.
5. Bump the `?v=` number on any changed CSS or JS file (required: the offline app serves `?v=` files from its cache).
6. Rebuild pages with `python learn/_src/compose.py`, then `git add learn/` only, commit with the Co-Authored-By trailer, push, and check the live URL.
7. Add a line to the change log (section 9) and update the status marks.
8. To add content: write the new cards in a file shaped `{ 'py.b.03': [cards] }` and run `node learn/_src/merge_cards.js learn/daily/tracks.js <file>`. It appends with the next IDs and refuses to change old cards. Every unit needs one `learn` card and, once it is complete, 2 `check` cards. Bump `tracks.js?v=` in `learn/_src/body_daily.html` and rebuild.
9. How Phase 4 content was made (reuse this): a Sonnet helper drafts cards with `verify` fields (SQL: SQLite setup/query/rows; shell/git: bash script + expected output); the main session runs them for real, reads every concept card, checks cloud facts on Microsoft Learn, strips `verify`, then merges.
10. Only say what an official source confirms. If a number (copies, limits, counts) is not stated on the official page, leave it out.

## 7. Open decisions (need the owner's answer)

| # | Question | Options | Recommendation |
|---|---|---|---|
| D1 | Which tracks first in Phase 2? | any two from section 4 | ✅ **Decided 15 Nov 2026: Python + Azure Data Engineering** |
| D2 | Keep the day-based streak after tracks arrive? | keep "Daily mix" / remove | ✅ **Decided: keep.** Built as a daily goal of 6 cards from the chosen tracks; streak grows when the goal is met |
| D3 | Can users skip a unit they already know? | yes with a short test / no | ✅ **Decided and built (Phase 2):** "I know this" on a unit header; all checkpoints right skips the rest of the unit (skipped cards do not count toward the daily goal) |
| D4 | How will users send their own tasks (Phase 9)? | Google Form / GitHub issue / own backend with login | Start with a Google Form; move to accounts only if many people contribute |
| D5 | Accounts and login? | none (progress on the phone) / login | None for now; needed later for cross-device progress, likes and contributions |

## 8. Ideas parking lot (not scheduled yet)

- Certificate-style badge when a level is finished (shareable image).
- Weekly leaderboard among friends via a share code.
- "Interview mode": only advanced checkpoint questions, timed.
- Explainer reels as short animated cards (the scheme videos pipeline could make matching YouTube Shorts).
- New mini games: SQL query builder, Linux terminal simulator, Git branch puzzle, Kubernetes YAML fixer.

## 9. Change log (newest first)

| Date | Change |
|---|---|
| 16 Nov 2026 | **S1 done:** Reels mode, My notes + Ask a doubt, Profile page with calendar and badges (owner asked). New analytics events `reels_mode`, `note_save`, `ask_doubt`, `profile_open`. Note: the site CSS already has a `.note` class, so feed classes use `pnote`/`pnotebox` |
| 16 Nov 2026 | **Phase 8 done:** Telugu version: 391 Basic cards translated by 4 Sonnet helpers, checked by script (all backtick text, bold marks, answer lists, item counts identical to English) and read by the main session; 171 UI strings in Telugu; Noto Sans Telugu font on Learn pages; language saved per phone (`st.lang`). New analytics event `lang_switch`. **Rule: when a card changes in English, update its Telugu in te.js too (and bump `te.js?v=` in app.js)** |
| 15 Nov 2026 | **Phase 7 done:** Learn installs as an app (manifest, icons, service worker), works offline after the first visit (tested with the server stopped), daily reminder via the learner's own calendar. New analytics events `app_install`, `app_install_prompt`, `app_install_help`, `reminder_add`. **Rule: the offline cache keeps each `?v=` file, so always bump `?v=` when a CSS/JS/tracks file changes** |
| 15 Nov 2026 | **Phase 6 done:** Basic levels complete for Docker, Kubernetes, Ansible and DevOps/CI-CD (94 new cards by 2 Sonnet helpers; every YAML card parsed; facts checked on docs.docker.com, kubernetes.io and docs.ansible.com; Ansible `command` card corrected: it does expand `$HOME`, only pipes/redirects need `shell`). Bug cards show the file name and colours of their language. Rule for these skills: Docker/kubectl/Ansible are not run here, so cards avoid printed output and cite the official page |
| 15 Nov 2026 | **Phase 5 done:** Intermediate levels complete for Python, Azure, Git, Linux, SQL and Power BI (279 new cards by 4 Sonnet helpers; 57 Python programs, 20 SQL queries and 13 shell scripts run for real; Power BI RLS and CALCULATE cards corrected against Microsoft Learn) |
| 15 Nov 2026 | **Phase 4 done:** Git, Linux, SQL Basic complete; new **Power BI** track (18 units planned, Basic complete); SQL cards show `query.sql` and "What does it return?"; 129 new cards (16 SQL answers run in SQLite, Git/Linux answers run in bash) |
| 15 Nov 2026 | **Game breaks (3b):** speed rounds, puzzles and full-game breaks inside the feed, picked by interest; "Back to my feed" on full games |
| 15 Nov 2026 | Site now links to Learn (menu, home, apps, sitemap, course page); Learn pages show "Learn" in their own menu |
| 15 Nov 2026 | Planned Phases 11 (challenges + achievement posts) and 12 (shared achievements feed) from the owner's idea |
| 15 Nov 2026 | **Phase 3 done:** spaced review: 🔁 Review cards at the top of the feed (1, 3, 7 days, then 🏅 mastered), review counts on the profile and end card |
| 15 Nov 2026 | **Phase 2 done:** Python Basic and Azure Basic complete (75 new cards incl. 32 checkpoints, Azure SQL and Power BI units added), checkpoint card type, "I know this" test-out; Python cards run in real Python, Azure facts checked on Microsoft Learn |
| 15 Nov 2026 | **Phase 1 done:** skill picker, unit-by-unit feed, Path view, daily goal + streak, 43 explainer cards, all 84 old cards moved into units with permanent IDs, old day feed retired |
| 15 Nov 2026 | Created this tracker; moved page sources and `compose.py` into `learn/_src/` |
| 12 Nov 2026 | Daily: each card themed like its technology's website (Microsoft Learn, python.org, git-scm, Ubuntu, Docker, Kubernetes, Ansible) |
| 12 Nov 2026 | Daily: Instagram-style feed, brand colours, like / save / share, Learn more links |
| 12 Nov 2026 | Daily: mini games (pipeline, indentation) and week 2 (days 8 to 14) |
| 12 Nov 2026 | Daily feed launched (days 1 to 7) |
| 12 Nov 2026 | Python section: Fix the Code, Guess the Output |
| 12 Nov 2026 | Learn hub, Cloud & DevOps: Build the Data Pipeline, Fix the Playbook |

## 10. Waiting on other sessions

- ✅ **Done by Main 15 Nov 2026 (commit b96165d), checked live:** menu "Learn" on every page, home + /apps/ cards → /learn/daily/, 8 sitemap URLs, Azure course links. Learn pages' own menu updated to match (`learn/_src/top.html`). Original request: add "Learn" to the main menu → /learn/; home page card → /learn/daily/; sitemap entries for all URLs in section 5; /apps/ listing; link from /courses/azure-data-engineering/ to /learn/.
