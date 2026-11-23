/* Kramavriddhi Learn feed (Phase 1): pick skills, then learn them unit by unit
   (Basic -> Intermediate -> Advanced) in an Instagram-style feed with a daily goal and streak.
   Content: learn/daily/tracks.js. Plan and status: learn/_TRACKER.md */
function kvLearnMain() {
  'use strict';
  var K = window.KVLearn, T = window.KV_TRACKS;
  var STORE = 'kv-learn-feed', OLD_STORE = 'kv-learn-daily';
  /* ---------- language (Phase 8): English or Telugu; Telugu text comes from te.js */
  var LANG = (K.load(STORE, {}) || {}).lang === 'te' && window.KV_TE ? 'te' : 'en', UI = LANG === 'te' ? (window.KV_TE.ui || {}) : {};
  function tr(en, v) { var o = UI[en] || en; return v ? o.replace(/\{(\w+)\}/g, function (m, k) { return v[k] === undefined ? m : v[k]; }) : o; }
  if (LANG === 'te') {
    var TE = window.KV_TE;
    document.documentElement.lang = 'te'; document.documentElement.classList.add('lang-te');
    T.tracks.forEach(function (t) {
      if (TE.tracks[t.id]) t.blurb = TE.tracks[t.id].blurb;
      t.units.forEach(function (u) {
        if (TE.units[u.id]) u.title = TE.units[u.id];
        u.cards.forEach(function (c) {
          var x = TE.cards[c.id]; if (!x) return;
          ['title', 'body', 'q', 'a', 'why'].forEach(function (k) { if (x[k]) c[k] = x[k]; });
          if (x.w) c.w = x.w;
          if (x.items) c.items = x.items;
          if (x.steps) c.steps = c.steps.map(function (b, i) { return [b[0], x.steps[i] || b[1]].concat(b.slice(2)); });
          if (x.extra && c.extra) c.extra = c.extra.map(function (b, i) { return [b[0], x.extra[i] || b[1]].concat(b.slice(2)); });
          c.te = 1;
        });
        u.te = u.cards.length && u.cards.every(function (c) { return c.te; });
      });
    });
  }
  function langSwitch() {
    return '<div class="langsw" role="group" aria-label="Language / భాష"><button type="button" data-lang="en" aria-pressed="' + (LANG === 'en') + '">English</button><button type="button" data-lang="te" lang="te" aria-pressed="' + (LANG === 'te') + '">తెలుగు</button></div>';
  }
  var URL = 'https://kramavriddhi.com/learn/daily/';
  var DAY_MS = 86400000, GOAL = T.goal || 6;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var LEVEL = { b: tr('Basic'), i: tr('Intermediate'), a: tr('Advanced') };

  function dayNo(d) { return Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / DAY_MS); }
  var today = dayNo(new Date());

  /* ---------- index the content */
  var TR = {}, UNIT = {}, CARD = {};
  T.tracks.forEach(function (t) {
    TR[t.id] = t;
    t.units.forEach(function (u) {
      u.track = t; UNIT[u.id] = u;
      /* show order inside a unit: explainer, practice, mini games, checkpoints (IDs stay as written) */
      var RANK = { learn: 0, pipe: 2, indent: 2, check: 3 };
      u.cards = u.cards.map(function (c, i) { return { c: c, i: i }; })
        .sort(function (a, b) { return ((RANK[a.c.t] === undefined ? 1 : RANK[a.c.t]) - (RANK[b.c.t] === undefined ? 1 : RANK[b.c.t])) || a.i - b.i; })
        .map(function (x) { return x.c; });
      u.cards.forEach(function (c, i) { c.unit = u; c.pos = i; CARD[c.id] = c; });
    });
  });

  /* ---------- saved progress (on this phone only) */
  var st = K.load(STORE, null);
  if (!st || typeof st !== 'object' || !st.done) {
    st = { tracks: [], done: {}, likes: {}, saved: {}, streak: { n: 0, last: 0 }, best: 0, days: {}, lang: st && st.lang };
    var old = K.load(OLD_STORE, null);          /* keep the streak from the day-based feed (Day 1 = 12 Nov 2026) */
    if (old && old.streak && old.streak.last) {
      st.streak = { n: old.streak.n || 0, last: Date.UTC(2026, 10, 12) / DAY_MS + old.streak.last - 1 };
      st.best = old.best || 0;
    }
  }
  ['done', 'likes', 'saved', 'days', 'review', 'notes'].forEach(function (k) { st[k] = st[k] || {}; });
  st.tracks = (st.tracks || []).filter(function (id) { return TR[id]; });
  st.mastered = st.mastered || 0;
  /* credits (🪙): earned by answering, spent to see a hint or the solution. Start with 10, plus 1 for every card already answered right */
  var COST = { hint: 1, reveal: 3 };
  if (typeof st.cr !== 'number') st.cr = 10 + Object.keys(st.done).filter(function (id) { var d = st.done[id]; return d && d.ok && !d.skip && CARD[id] && CARD[id].t !== 'learn'; }).length;
  st.revealed = st.revealed || {};
  var earned = {};
  st.streak = st.streak && typeof st.streak === 'object' ? st.streak : { n: 0, last: 0 }; st.best = st.best || 0;

  /* ---------- spaced review: a missed card comes back after 1 day, then 3, then 7; right 3 times = mastered */
  var GAPS = [1, 3, 7], MAX_REVIEWS = 10;
  if (!st.reviewSeeded) {          /* cards missed before reviews existed are due today */
    Object.keys(st.done).forEach(function (id) { var d = st.done[id]; if (d && d.ok === false && !d.skip && CARD[id] && !st.review[id]) st.review[id] = { due: today, step: 0 }; });
    st.reviewSeeded = 1;
    K.save(STORE, st);
  }
  Object.keys(st.review).forEach(function (id) { if (!CARD[id]) delete st.review[id]; });
  function dueReviews() {
    return Object.keys(st.review).filter(function (id) { return st.review[id].due <= today && st.tracks.indexOf(CARD[id].unit.track.id) >= 0; })
      .sort(function (a, b) { return st.review[a].due - st.review[b].due || (a < b ? -1 : 1); }).slice(0, MAX_REVIEWS).map(function (id) { return CARD[id]; });
  }
  function scheduleMiss(id) { st.review[id] = { due: today + GAPS[0], step: 0 }; }
  function reviewAnswer(id, ok) {
    var r = st.review[id] || { step: 0 };
    K.track('review_answer', { ok: ok ? 1 : 0, step: r.step + 1 });
    if (!ok) { st.review[id] = { due: today + GAPS[0], step: 0 }; return '<p class="revnote">' + tr('🔁 It will come back tomorrow. Read the explanation once more.') + '</p>'; }
    if (r.step + 1 >= GAPS.length) { delete st.review[id]; st.mastered++; return '<p class="revnote">' + tr('🏅 Mastered! You got it right 3 reviews in a row, so it will not come back.') + '</p>'; }
    st.review[id] = { due: today + GAPS[r.step + 1], step: r.step + 1 };
    return '<p class="revnote">' + tr('🔁 Well remembered. Next review in {n} days.', { n: GAPS[r.step + 1] }) + '</p>';
  }
  function reviewsOn(day) { return Object.keys(st.review).filter(function (id) { return st.review[id].due === day && st.tracks.indexOf(CARD[id].unit.track.id) >= 0; }).length; }
  function save() { K.save(STORE, st); }
  function streakNow() { return st.streak.last >= today - 1 ? st.streak.n : 0; }
  function todayCount() { return st.days[today] || 0; }
  function isDone(c) { return !!st.done[c.id]; }
  function live(u) { return u.cards.length > 0; }
  function unitDone(u) { return live(u) && u.cards.every(isDone); }
  function liveUnits(t) { return t.units.filter(live); }
  function nextUnit(t) { var a = t.units.filter(function (u) { return live(u) && !unitDone(u); }); return a[0] || null; }

  var feed = document.getElementById('feed'), pill = document.getElementById('pill');
  var TYPE = { learn: tr('Learn'), output: tr('What does it print?'), choice: tr('Pick the right answer'), order: tr('Tap in the right order'), bug: tr('Find the line with the bug'),
    pipe: tr('Mini game · Build the pipeline'), indent: tr('Mini game · Fix the indentation'), check: tr('Checkpoint') };
  var testing = {};   /* unit id -> true while someone is trying to test out of it */
  var KW = /^(def|return|if|elif|else|for|in|and|or|not|while|break|try|except|with|as|True|False|None)$/;

  /* where to learn more, per topic */
  var ACADEMY = { href: 'https://nagendrababuedru.github.io/DevOps/', label: 'DevOps Academy: free labs and interview questions', ext: 1 };
  var COURSE = { href: '/courses/azure-data-engineering/', label: 'Free Azure Data Engineering course (Kramavriddhi)' };
  var TOPIC = {
    python: { ab: 'Py', own: { href: '/learn/python/', label: 'Python games on Kramavriddhi' }, docs: { href: 'https://docs.python.org/3/tutorial/', label: 'Official Python tutorial (python.org)', ext: 1 } },
    azure: { ab: 'Az', own: COURSE, docs: { href: 'https://learn.microsoft.com/en-us/training/azure/', label: 'Microsoft Learn: free Azure training', ext: 1 } },
    data: { ab: 'Da', own: COURSE, docs: { href: 'https://learn.microsoft.com/en-us/azure/databricks/lakehouse/medallion', label: 'Microsoft Learn: medallion architecture', ext: 1 } },
    sql: { ab: 'SQL', own: COURSE, docs: { href: 'https://learn.microsoft.com/en-us/sql/t-sql/queries/select-transact-sql', label: 'Microsoft Learn: the SELECT statement', ext: 1 } },
    git: { ab: 'Git', own: ACADEMY, docs: { href: 'https://git-scm.com/book/en/v2', label: 'Pro Git book, free (git-scm.com)', ext: 1 } },
    linux: { ab: '$_', own: ACADEMY, docs: { href: 'https://ubuntu.com/tutorials/command-line-for-beginners', label: 'Ubuntu: command line for beginners', ext: 1 } },
    ansible: { ab: 'A', own: ACADEMY, docs: { href: 'https://docs.ansible.com/ansible/latest/getting_started/index.html', label: 'Ansible docs: getting started', ext: 1 } },
    docker: { ab: 'Dk', own: ACADEMY, docs: { href: 'https://docs.docker.com/get-started/', label: 'Docker docs: get started', ext: 1 } },
    kubernetes: { ab: 'K8s', own: ACADEMY, docs: { href: 'https://kubernetes.io/docs/tutorials/kubernetes-basics/', label: 'Kubernetes basics (kubernetes.io)', ext: 1 } },
    powerbi: { ab: 'BI', own: { href: 'https://learn.microsoft.com/en-us/training/powerplatform/power-bi', label: 'Microsoft Learn: free Power BI training', ext: 1 }, docs: { href: 'https://learn.microsoft.com/en-us/power-bi/fundamentals/power-bi-overview', label: 'Microsoft Learn: what is Power BI?', ext: 1 } },
    dataeng: { ab: 'DE', own: COURSE, docs: { href: 'https://airflow.apache.org/docs/apache-airflow/stable/index.html', label: 'Apache Airflow docs (pipelines and scheduling)', ext: 1 } },
    snowflake: { ab: 'Sn', own: { href: 'https://docs.snowflake.com/en/user-guide-getting-started', label: 'Snowflake docs: getting started', ext: 1 }, docs: { href: 'https://docs.snowflake.com/en/sql-reference', label: 'Snowflake SQL reference', ext: 1 } },
    aws: { ab: 'AWS', own: { href: 'https://skillbuilder.aws/', label: 'AWS Skill Builder: free AWS courses', ext: 1 }, docs: { href: 'https://docs.aws.amazon.com/', label: 'AWS documentation', ext: 1 } },
    gcp: { ab: 'GC', own: { href: 'https://cloud.google.com/learn/training', label: 'Google Cloud training', ext: 1 }, docs: { href: 'https://cloud.google.com/docs', label: 'Google Cloud documentation', ext: 1 } },
    redhat: { ab: 'RH', own: ACADEMY, docs: { href: 'https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/', label: 'Red Hat Enterprise Linux docs', ext: 1 } },
    devops: { ab: 'Ops', own: ACADEMY, docs: { href: 'https://learn.microsoft.com/en-us/devops/what-is-devops', label: 'Microsoft Learn: what is DevOps?', ext: 1 } }
  };
  function tkey(topic) { return String(topic).toLowerCase(); }
  function topicOf(c) { return TOPIC[tkey(c.topic)] || TOPIC.devops; }
  function learnLinks(c) {
    var t = topicOf(c), out = [];
    if (c.t === 'pipe' && (c.topic === 'Azure' || c.topic === 'Data')) out.push({ href: '/learn/devops/azure-data-pipeline/', label: 'Play the full game: Build the Data Pipeline' });
    if (c.t === 'indent' && (c.step !== 2 || c.topic === 'Ansible')) out.push(c.step === 2 ?{ href: '/learn/devops/ansible-fix-the-playbook/', label: 'Play the full game: Fix the Playbook' } : { href: '/learn/python/fix-the-code/', label: 'Play the full game: Fix the Code' });
    out.push(t.own);
    if (c.topic === 'Ansible' && c.t !== 'indent') out.push({ href: '/learn/devops/ansible-fix-the-playbook/', label: 'Play Fix the Playbook (Ansible game)' });
    out.push(t.docs);
    return out;
  }
  var ICON = {
    heart: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.5s-7.5-4.6-9.3-9.2C1.4 7.9 3.6 4.5 7 4.5c2 0 3.6 1.1 5 3 1.4-1.9 3-3 5-3 3.4 0 5.6 3.4 4.3 6.8-1.8 4.6-9.3 9.2-9.3 9.2z"/></svg>',
    share: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21.5 3 10 14.5M21.5 3l-7 18-4.5-6.5L3 10z"/></svg>',
    save: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3.5h12v17l-6-4.5-6 4.5z"/></svg>',
    note: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 11.6c0 4.4-3.8 7.9-8.5 7.9-1.3 0-2.6-.3-3.7-.8L3.5 20l1.4-3.7c-.9-1.3-1.4-2.9-1.4-4.6C3.5 7.2 7.3 3.7 12 3.7s8.5 3.5 8.5 7.9z"/></svg>',
    user: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 20.5c1.2-4 4.2-6 8-6s6.8 2 8 6"/></svg>',
    reels: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="4"/><path d="M3.5 8.5h17M8 3.5l3 5M13.5 3.5l3 5M10.5 12v5l4.3-2.5z"/></svg>',
    book: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 5.5c3-1.3 6-1.3 9 .8 3-2.1 6-2.1 9-.8v14c-3-1.3-6-1.3-9 .8-3-2.1-6-2.1-9-.8zM12 6.3v14"/></svg>',
    logo: '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M7 24h6v-5h6v-5h6V8" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };

  /* ---------- code display */
  function hlPy(text) {
    var re = /(#.*$)|("[^"]*"|'[^']*')|(\b\d+(?:\.\d+)?\b)|([A-Za-z_]\w*)|(\s+)|(.)/g, m, s = '';
    while ((m = re.exec(text))) {
      if (m[1]) s += '<span class="d">' + K.esc(m[1]) + '</span>';
      else if (m[2]) s += '<span class="v">' + K.esc(m[2]) + '</span>';
      else if (m[3]) s += '<span class="b">' + m[3] + '</span>';
      else if (m[4]) s += KW.test(m[4]) ? '<span class="k">' + m[4] + '</span>' : text.charAt(re.lastIndex) === '(' ? '<span class="fn">' + m[4] + '</span>' : K.esc(m[4]);
      else s += K.esc(m[0]);
    }
    return s;
  }
  function hlYaml(text) {
    var m0 = /^(\s*)(- )?([^:]+):(.*)$/.exec(text);
    if (!m0) return K.esc(text);
    return m0[1] + (m0[2] ? '<span class="d">- </span>' : '') + '<span class="k">' + K.esc(m0[3]) + '</span>:' + (m0[4] ? '<span class="v">' + K.esc(m0[4]) + '</span>' : '');
  }
  function hlLine(l, lang) { return lang === 'yaml' || lang === 'k8s' || lang === 'ci' || lang === 'compose' ? hlYaml(l) : lang === 'python' || !lang ? hlPy(l) : K.esc(l).replace(/(#.*)$/, '<span class="d">$1</span>'); }
  var FILE = { python: 'main.py', yaml: 'site.yml', ini: 'inventory.ini', sql: 'query.sql', shell: 'terminal', docker: 'Dockerfile', k8s: 'deployment.yaml', ci: '.github/workflows/ci.yml', compose: 'compose.yaml' };
  function codeBlock(lines, asButtons, lang) {
    return '<div class="editor dcode">' + (lang && lang !== 'python' && FILE[lang] ? '<div class="ed-bar"><span class="file">' + FILE[lang] + '</span></div>' : '') + (asButtons
      ? '<ol class="bug-lines">' + lines.map(function (l, n) {
          return '<li><button type="button" class="bugline" data-line="' + n + '"><span class="num" aria-hidden="true">' + (n + 1) + '</span><span class="src">' + hlLine(l, lang) + '</span></button></li>';
        }).join('') + '</ol>'
      : '<pre class="snippet">' + lines.map(function (l, n) { return '<span class="num" aria-hidden="true">' + (n + 1) + '</span>' + hlLine(l, lang); }).join('\n') + '</pre>') + '</div>';
  }
  function shuffleDiff(items) {
    var a = items, tries = 0;
    do { a = K.shuffle(items); tries++; } while (tries < 20 && a.join('\u0001') === items.join('\u0001'));
    return a;
  }

  /* =====================================================================
     1. Skill picker
     ===================================================================== */
  function renderPicker() {
    var chosen = st.tracks.slice();
    pill.hidden = true;
    feed.innerHTML = '<section class="dcard picker" aria-label="Pick your skills"><div class="dinner post profile">' +
      '<div class="prow"><span class="pav big">' + ICON.logo + '</span><div><h1>' + tr('What do you want to learn?') + '</h1>' +
      '<p class="pbio">' + tr('Pick one or more skills. Your feed teaches them step by step: <strong>Basic → Intermediate → Advanced</strong>. You can change this any time.') + '</p></div></div>' + langSwitch() +
      '<div class="skills" role="group" aria-label="Skills">' + T.tracks.map(function (t) {
        var lu = liveUnits(t).length, on = chosen.indexOf(t.id) >= 0;
        return '<button type="button" class="skill t-' + tkey(t.topic) + '" data-track="' + t.id + '" aria-pressed="' + on + '">' +
          '<span class="pav" aria-hidden="true">' + K.esc((TOPIC[tkey(t.topic)] || TOPIC.devops).ab) + '</span>' +
          '<span class="sk-txt"><strong>' + K.esc(t.name) + '</strong><span>' + K.esc(t.blurb) + '</span><em>' + tr('{n} of {m} units ready', { n: lu, m: t.units.length }) + '</em></span>' +
          '<span class="sk-tick" aria-hidden="true"></span></button>';
      }).join('') + '</div>' +
      '<p class="pick-note">' + tr('New units are added in every update. Skills with more units ready are best to start with.') + '</p>' +
      '<button type="button" class="btn go" id="pick-go"' + (chosen.length ? '' : ' disabled') + '>' + (chosen.length ? tr('Start learning ({n}) ↓', { n: chosen.length }) : tr('Pick at least one skill')) + '</button>' +
      '</div></section>';
    var go = document.getElementById('pick-go');
    feed.querySelector('.skills').addEventListener('click', function (e) {
      var b = e.target.closest('.skill'); if (!b) return;
      var id = b.getAttribute('data-track'), i = chosen.indexOf(id);
      if (i >= 0) chosen.splice(i, 1); else chosen.push(id);
      b.setAttribute('aria-pressed', i < 0);
      go.disabled = !chosen.length;
      go.textContent = chosen.length ? tr('Start learning ({n}) ↓', { n: chosen.length }) : tr('Pick at least one skill');
    });
    go.addEventListener('click', function () {
      st.tracks = T.tracks.map(function (t) { return t.id; }).filter(function (id) { return chosen.indexOf(id) >= 0; });
      save();
      K.track('track_select', { tracks: st.tracks.join(',') });
      if (location.search) history.replaceState(null, '', location.pathname + (/card=/.test(location.hash) ? location.hash : ''));
      renderFeed(true);
    });
  }

  /* =====================================================================
     2. The feed: units from the chosen skills, in order, taking turns
     ===================================================================== */
  var feedCards = [], feedModes = [], reviewNote = {}, queue = [], qi = 0, tries = {}, started = false;
  var gbs = [], sinceBreak = 0, sinceMeme = 0;

  function buildQueue() {
    var lists = st.tracks.map(function (id) { return TR[id].units.filter(function (u) { return live(u) && !unitDone(u); }); });
    var q = [], more = true, k = 0;
    while (more) { more = false; lists.forEach(function (l) { if (l[k]) { q.push(l[k]); more = true; } }); k++; }
    return q;
  }

  function renderFeed(scroll) {
    pill.hidden = false;
    if (/[?&]profile=1/.test(location.search)) history.replaceState(null, '', location.pathname + location.hash);
    feedCards = []; feedModes = []; reviewNote = {}; tries = {};
    gbs.forEach(function (g) { if (g.timer) clearInterval(g.timer); }); gbs = []; sinceBreak = 0; sinceMeme = 0;
    queue = buildQueue(); qi = 0;
    var html = intro();
    var hm = /card=([\w.]+)/.exec(location.hash), shared = hm && CARD[hm[1]];
    if (shared) html += '<section class="dcard sharedhead" aria-label="Shared card"><p class="kicker">' + tr(st.revealed[shared.id] || st.notes[shared.id] || st.saved[shared.id] ? 'Your card' : 'Shared with you') + ' · ' + K.esc(shared.unit.track.name) + ' · ' + K.esc(shared.unit.title) + '</p></section>' + cardHtml(shared);
    var due = dueReviews();
    if (due.length) {
      html += '<section class="dcard reviewhead" aria-label="Review time"><div class="dinner post">' +
        '<p class="kicker">' + tr('🔁 Review time') + '</p><h2 class="uh-title">' + tr(due.length > 1 ? '{n} cards to review' : '1 card to review', { n: due.length }) + '</h2>' +
        '<p class="uh-sub">' + tr('You missed these before. Get a card right 3 reviews in a row (after 1, 3 and 7 days) and it is mastered for good.') + '</p>' +
        '</div></section>' + due.map(function (c) { return cardHtml(c, 'review'); }).join('');
    }
    html += nextBlocks() + '<section class="dcard end" id="c-end" aria-label="Today"><div class="dinner" id="endin"></div></section>';
    feed.innerHTML = html;
    restoreAll();
    document.documentElement.classList.add('snap-feed'); applyReels();
    updatePill(); renderEnd(); refreshStats();
    if (shared) setTimeout(function () { var e = feed.querySelector('.sharedhead'); if (e) e.scrollIntoView({ block: 'start' }); }, 60);
    else if (scroll) setTimeout(function () { feed.scrollIntoView({ block: 'start' }); }, 30);
  }

  /* add unit blocks until there are about two days' worth of cards */
  function nextBlocks() {
    var html = '', count = 0;
    while (qi < queue.length && (count < GOAL * 2 || html === '')) {
      var u = queue[qi++], rest = u.cards.filter(function (c) { return !isDone(c); });
      html += unitHead(u) + rest.map(function (c) {
        var h = cardHtml(c);
        var gbNow = false;
        if (++sinceBreak >= (todayCount() >= GOAL ? 4 : 6)) { var b = gameBreakHtml(); if (b) { h += b; sinceBreak = 0; gbNow = true; } }
        if (!gbNow && ++sinceMeme >= 10) { var mm = memeHtml(); if (mm) { h += mm; sinceMeme = 0; } }
        return h;
      }).join('');
      count += rest.length;
    }
    return html;
  }

  /* =====================================================================
     3. Game breaks: a short game every few cards, picked by interest
     ===================================================================== */
  var FULL = {
    py: [{ name: 'Fix the Code', href: '/learn/python/fix-the-code/', key: 'kv-learn-py-fix', blurb: 'Put scrambled Python in order, fix the indentation and run it.' },
         { name: 'Guess the Output', href: '/learn/python/guess-the-output/', key: 'kv-learn-py-output', blurb: 'Read a short program and pick exactly what it prints.' }],
    az: [{ name: 'Build the Data Pipeline', href: '/learn/devops/azure-data-pipeline/', key: 'kv-learn-pipeline', blurb: 'Put Azure services in the order data travels and watch it flow.' }],
    ans: [{ name: 'Fix the Playbook', href: '/learn/devops/ansible-fix-the-playbook/', key: 'kv-learn-playbook', blurb: 'Fix a broken Ansible playbook and run it on two servers.' }]
  };
  var GB_KIND = { speed: tr('⚡ Speed round'), puzzle: tr('🧩 Puzzle'), full: tr('🕹️ Full game'), arcade: tr('🎯 Arcade') };
  st.gb = st.gb || {};
  function gstat(type) { return st.gb[type] || (st.gb[type] = { p: 0, l: 0, s: 0 }); }
  function chosenCards(test) {
    var out = [];
    st.tracks.forEach(function (id) { TR[id].units.forEach(function (u) { u.cards.forEach(function (c) { if (test(c)) out.push(c); }); }); });
    return out;
  }
  function mcPool() {
    var all = chosenCards(function (c) { return c.t === 'output' || c.t === 'choice' || c.t === 'check'; });
    var seen = all.filter(isDone);
    return seen.length >= 6 ? seen : all;
  }
  function puzzlePool() { return chosenCards(function (c) { return c.t === 'pipe' || c.t === 'indent'; }); }
  function fullPool() { var out = []; st.tracks.forEach(function (id) { (FULL[id] || []).forEach(function (g) { out.push(g); }); }); return out; }

  /* interest: kinds you play or like come more often, kinds you skip less; never the same kind twice in a row */
  function pickKind() {
    var avail = [];
    if (mcPool().length >= 3) avail.push('speed');
    if (puzzlePool().length) avail.push('puzzle');
    if (fullPool().length) avail.push('full');
    if (arcadePool().length) avail.push('arcade');
    if (!avail.length) return null;
    var choices = avail.length > 1 ? avail.filter(function (t) { return t !== st.gbLast; }) : avail;
    var w = choices.map(function (t) { var g = gstat(t); return (1 + g.p + 2 * g.l) / (1 + 1.5 * g.s); });
    var sum = w.reduce(function (a, b) { return a + b; }, 0), r = Math.random() * sum;
    for (var i = 0; i < choices.length; i++) { r -= w[i]; if (r <= 0) return choices[i]; }
    return choices[choices.length - 1];
  }

  function gameBreakHtml() {
    var kind = pickKind(); if (!kind) return '';
    st.gbLast = kind;
    var k = gbs.push({ kind: kind, counted: false }) - 1, g = gbs[k], body = '', after = '';
    var names = st.tracks.map(function (id) { return TR[id].name; }).join(', ');
    if (kind === 'speed') {
      body = '<h2 class="dq">' + tr('3 quick questions, 30 seconds') + '</h2><p class="gbsub">' + tr('From your skills: {s}. Keep a combo going for bonus fire.', { s: K.esc(names) }) + '</p>' +
        '<button type="button" class="btn go" data-gbstart>' + tr('Start ⚡') + '</button><div class="gbplay" hidden></div>';
    } else if (kind === 'arcade') {
      var ap = arcadePool(); g.game = ap[Math.floor(Math.random() * ap.length)];
      var gx = LANG === 'te' && g.game.te ? g.game.te : g.game;
      body = '<h2 class="dq">' + g.game.icon + ' ' + K.esc(gx.name) + '</h2><p class="gbsub">' + K.esc(gx.intro) + '</p>' +
        '<p class="gbsub">' + (g.game.type === 'chain' ? tr('Solve the case · +3 🪙, minus 1 for each wrong guess') : g.game.type === 'tapset' ? tr('{s} seconds · +1 🪙 for every 2 right tiles', { s: g.game.secs }) : tr('{n} rounds · {s} seconds each · +1 🪙 for every right answer', { n: g.game.rounds, s: g.game.secs })) + '</p>' +
        '<button type="button" class="btn go" data-arcstart>' + tr('Start') + ' ' + g.game.icon + '</button><div class="arcplay" hidden></div>';
    } else if (kind === 'puzzle') {
      var ps = puzzlePool(); g.card = ps[Math.floor(Math.random() * ps.length)];
      body = '<p class="gbsub">' + tr('A quick puzzle from {s}. Solve it below, or skip.', { s: K.esc(g.card.unit.track.name) }) + '</p>';
      after = cardHtml(g.card, 'play');
    } else {
      var fs = fullPool(); g.game = fs[Math.floor(Math.random() * fs.length)];
      var pr = K.load(g.game.key, null), stars = pr && pr.stars ? pr.stars.reduce(function (a, b) { return a + (b || 0); }, 0) : 0;
      body = '<h2 class="dq">' + K.esc(g.game.name) + '</h2><p class="gbsub">' + K.esc(tr(g.game.blurb)) + '</p>' +
        '<p class="gbsub">' + (stars ? K.stars(1, 1) + ' ' + tr('Your stars: {n} of 15. Go for more!', { n: stars }) : tr('5 levels, up to 15 stars.')) + '</p>' +
        '<a class="btn go" href="' + g.game.href + '?from=feed" data-gbopen>' + tr('Play now') + '</a>';
    }
    return '<section class="dcard gamebreak" id="gb-' + k + '" data-gb="' + k + '" aria-label="Game break: ' + GB_KIND[kind] + '"><div class="dinner post">' +
      '<div class="gbhead"><span class="gbbadge">' + tr('🎮 Game break') + '</span><span class="gbkind">' + GB_KIND[kind] + '</span>' +
      '<button type="button" class="gbskip" data-gbskip>' + tr('Skip ↓') + '</button></div>' + body + '</div></section>' + after;
  }

  function gbScrollPast(sec, k) {
    var next = sec.nextElementSibling;
    if (gbs[k].kind === 'puzzle' && next) next = next.nextElementSibling;
    if (next) scrollToCard(next);
  }

  function gbClick(e, sec) {
    var k = +sec.getAttribute('data-gb'), g = gbs[k];
    if (e.target.closest('[data-gbskip]')) {
      gstat(g.kind).s++; save(); K.track('game_break', { kind: g.kind, action: 'skip' });
      if (g.timer) { clearInterval(g.timer); g.timer = null; }
      if (g.kind === 'speed' && g.qs && !g.over) {          /* leave no half-played round behind */
        g.over = true;
        var pl = sec.querySelector('.gbplay'); pl.innerHTML = ''; pl.hidden = true;
        var sb = sec.querySelector('[data-gbstart]'); if (sb) sb.hidden = false;
      }
      if (g.kind === 'arcade' && g.qs && !g.over) {
        g.over = true;
        var ap2 = sec.querySelector('.arcplay'); ap2.innerHTML = ''; ap2.hidden = true;
        var as2 = sec.querySelector('[data-arcstart]'); if (as2) as2.hidden = false;
      }
      gbScrollPast(sec, k); return;
    }
    if (e.target.closest('[data-arcstart]') || e.target.closest('[data-arcagain]')) { arcStart(sec, k); return; }
    if (e.target.closest('[data-arcnext]')) { if (g.next) g.next(); return; }
    var tp = e.target.closest('[data-tap]'); if (tp && !tp.disabled) { tp.setAttribute('aria-pressed', tp.getAttribute('aria-pressed') !== 'true'); return; }
    if (e.target.closest('[data-tapcheck]')) { tapEnd(sec, k, false); return; }
    var ch2 = e.target.closest('[data-chain]'); if (ch2 && !ch2.disabled) { chainPick(sec, k, ch2); return; }
    var ab = e.target.closest('[data-arcpick]'); if (ab && !ab.disabled) { arcAnswer(sec, k, ab.getAttribute('data-arcpick')); return; }
    if (e.target.closest('[data-gbopen]')) { gstat(g.kind).p++; save(); K.track('game_break', { kind: 'full', action: 'open', game: g.game.name }); return; }
    if (e.target.closest('[data-gbnext]')) { gbScrollPast(sec, k); return; }
    if (e.target.closest('[data-gbstart]') || e.target.closest('[data-gbagain]')) { speedStart(sec, k); return; }
    var ch = e.target.closest('.choice');
    if (ch && !ch.disabled && g.kind === 'speed') speedAnswer(sec, k, ch.getAttribute('data-opt'));
  }

  function speedStart(sec, k) {
    var g = gbs[k], play = sec.querySelector('.gbplay');
    g.qs = K.shuffle(mcPool()).slice(0, 3); g.i = 0; g.right = 0; g.combo = 0; g.best = 0; g.wrong = []; g.t0 = Date.now(); g.limit = 30000; g.over = false;
    var st0 = sec.querySelector('[data-gbstart]'); if (st0) st0.hidden = true;
    play.hidden = false;
    speedQuestion(sec, k);
    if (g.timer) clearInterval(g.timer);
    g.timer = setInterval(function () {
      var left = Math.max(0, g.limit - (Date.now() - g.t0)), bar = sec.querySelector('.gbbar i');
      if (bar) bar.style.width = (left / g.limit * 100) + '%';
      var tl = sec.querySelector('.gbtime'); if (tl) tl.textContent = Math.ceil(left / 1000) + ' s';
      if (!left) speedEnd(sec, k, true);
    }, 200);
    K.track('game_break', { kind: 'speed', action: 'play' });
  }

  function speedQuestion(sec, k) {
    var g = gbs[k], c = g.qs[g.i], play = sec.querySelector('.gbplay');
    var codeQ = c.t === 'output' || (c.t === 'check' && c.code && !c.q);
    play.innerHTML = '<div class="gbbar" aria-hidden="true"><i style="width:' + Math.max(0, (g.limit - (Date.now() - g.t0)) / g.limit * 100) + '%"></i></div>' +
      '<p class="gbmeta"><span>' + tr('Question {n} of {m}', { n: g.i + 1, m: g.qs.length }) + '</span><span class="gbtime"></span><span>' + (g.combo > 1 ? '🔥 combo ×' + g.combo : '') + '</span></p>' +
      (codeQ ? '<p class="gbq">' + tr(c.lang === 'sql' ? 'What does it return?' : 'What does it print?') + '</p>' + codeBlock(c.code.split('\n'), false, c.lang) : '<p class="gbq">' + K.rich(c.q) + '</p>' + (c.code ? codeBlock(c.code.split('\n'), false, c.lang) : '')) +
      choiceList(c) + '<p class="gbflash" role="status" aria-live="polite"></p>';
  }

  function speedAnswer(sec, k, opt) {
    var g = gbs[k]; if (g.over) return;
    var c = g.qs[g.i], ok = opt === c.a, play = sec.querySelector('.gbplay');
    markChoices(play, c, opt);
    if (ok) { g.right++; g.combo++; g.best = Math.max(g.best, g.combo); } else { g.combo = 0; g.wrong.push(c); }
    play.querySelector('.gbflash').textContent = ok ? (g.combo > 1 ? tr('✓ Right!') + ' 🔥 combo ×' + g.combo : tr('✓ Right!')) : tr('✗ It was:') + ' ' + c.a.replace(/\n/g, ' / ');
    setTimeout(function () {
      if (g.over) return;
      g.i++;
      if (g.i < g.qs.length) speedQuestion(sec, k); else speedEnd(sec, k, false);
    }, reduce ? 300 : ok ? 650 : 1400);
  }

  function speedEnd(sec, k, timeout) {
    var g = gbs[k]; if (g.over) return;
    g.over = true; clearInterval(g.timer); g.timer = null;
    for (var i = g.i; i < g.qs.length; i++) if (g.wrong.indexOf(g.qs[i]) < 0 && timeout) g.wrong.push(g.qs[i]);
    var secs = Math.round(Math.min(g.limit, Date.now() - g.t0) / 1000), n = g.qs.length;
    var stars = g.right === n && !timeout ? 3 : g.right >= n - 1 ? 2 : g.right ? 1 : 0;
    if (!g.counted) { g.counted = true; gstat('speed').p++; st.cr += g.right; g.gain = g.right; bumpDay(); save(); updatePill(); refreshStats(); renderEnd(); }
    K.track('game_break', { kind: 'speed', action: 'done', right: g.right, seconds: secs });
    sec.querySelector('.gbplay').innerHTML =
      '<p class="verdict">' + (timeout ? tr('⏰ Time up!') + ' ' : '⚡ ') + tr(timeout ? '{n} of {m} right' : '{n} of {m} right in {s} s', { n: g.right, m: n, s: secs }) + '</p>' +
      (stars ? '<p>' + K.stars(stars).replace('class="stars"', 'class="stars big"') + '</p>' : '') +
      (g.gain ? '<p class="revnote"><span class="earn">+' + g.gain + ' 🪙</span></p>' : '') +
      (g.best > 1 ? '<p class="revnote">🔥 ' + tr('Best combo') + ' ×' + g.best + '</p>' : '') +
      (g.wrong.length ? '<p class="small">' + tr('Remember:') + '</p><ul class="gbwrong">' + g.wrong.map(function (c) {
        return '<li>' + K.esc(c.q ? c.q.replace(/`|\*\*/g, '') : c.code.split('\n')[0]) + ' → <strong>' + K.esc(c.a.replace(/\n/g, ' / ')) + '</strong></li>';
      }).join('') + '</ul>' : '') +
      '<p class="revnote">' + tr('🎮 Game break done · it counts for today') + '</p>' +
      '<div class="mbar"><button type="button" class="btn ghost" data-gbagain>' + tr('Play again') + '</button><button type="button" class="btn primary" data-gbnext>' + tr('Back to learning ↓') + '</button></div>';
  }

  function levelProgress(t) {
    var lu = liveUnits(t), du = lu.filter(unitDone).length, nu = nextUnit(t);
    return { live: lu.length, done: du, next: nu, label: nu ? LEVEL[nu.level] + ' · ' + tr('Unit {n}', { n: nu.n }) + ': ' + nu.title : tr(lu.length ? 'All ready units done' : 'Coming soon') };
  }

  function intro() {
    var s = streakNow(), unitsDone = 0;
    st.tracks.forEach(function (id) { unitsDone += liveUnits(TR[id]).filter(unitDone).length; });
    return '<section class="dcard intro" id="c-intro" aria-label="Your learning"><div class="dinner post profile">' +
      '<div class="prow"><span class="pav big">' + ICON.logo + '</span>' +
      '<div class="dstats"><div><strong id="s-streak">' + (s ? '🔥' + s : '0') + '</strong><span>' + tr('streak') + '</span></div><div><strong id="s-today">' + Math.min(todayCount(), GOAL) + '/' + GOAL + '</strong><span>' + tr('today') + '</span></div><div><strong id="s-units">' + unitsDone + '</strong><span>' + tr('units done') + '</span></div></div></div>' +
      '<h1>kramavriddhi.learn</h1>' +
      '<p class="pbio">' + tr('Your skills, step by step: Basic → Intermediate → Advanced. Daily goal: {n} cards.', { n: GOAL }) + ' 📚</p>' + langSwitch() +
      '<p class="revline" id="s-review">' + reviewLine() + '</p>' +
      '<p class="crline">🪙 <strong id="s-cr">' + st.cr + '</strong> ' + tr('credits') + ' · <a href="?profile=1" data-profile>' + tr('how to earn and use them') + '</a></p>' +
      '<h2 class="mysk">' + tr('My skills') + '</h2><ul class="mytracks">' + st.tracks.map(function (id) { return trackRow(TR[id]); }).join('') + '</ul>' +
      '<div class="introbtns"><button type="button" class="btn go" data-start>' + tr(todayCount() ? 'Continue ↓' : 'Start today ↓') + '</button><a class="btn ghost" href="?pick=1" data-pick>' + tr('Change skills') + '</a></div>' +
      '<div class="introbtns two"><a class="btn ghost" href="?profile=1" data-profile>👤 ' + tr('My profile') + '</a><button type="button" class="btn ghost" data-reels>' + (st.reels ? '✕ ' + tr('Exit reels') : '▶ ' + tr('Reels mode')) + '</button></div>' +
      appBox() + '</div></section>';
  }

  /* ---------- app box: install, daily reminder, offline (Phase 7) */
  var INSTALL_HELP = {
    ios: tr('On iPhone: open this page in <strong>Safari</strong>, tap <strong>Share</strong> (the square with an arrow), then <strong>Add to Home Screen</strong>.'),
    manual: tr('Open your browser menu (<strong>⋮</strong>) and tap <strong>Install app</strong> or <strong>Add to Home screen</strong>.')
  };
  function appBox() {
    var s = K.installState(), t = st.remTime || '19:00';
    return '<div class="appbox" id="appbox">' +
      (s === 'installed' ? '' : '<div class="approw">' +
        (s === 'prompt' ? '<button type="button" class="btn go" data-install>' + tr('📲 Install the app') + '</button>' : '<button type="button" class="btn ghost" data-installhelp aria-expanded="false">' + tr('📲 Get the app') + '</button>') +
        '<button type="button" class="btn ghost" data-rem aria-expanded="false">' + tr('⏰ Daily reminder') + '</button></div>' +
        (s === 'prompt' ? '' : '<p class="apphelp" id="installhelp" hidden>' + INSTALL_HELP[s] + '</p>')) +
      (s === 'installed' ? '<div class="approw one"><button type="button" class="btn ghost" data-rem aria-expanded="false">' + tr('⏰ Daily reminder') + '</button></div>' : '') +
      '<div class="rembox" id="rembox" hidden><label class="remtime">' + tr('Remind me every day at') + ' <input type="time" value="' + K.esc(t) + '" data-remtime></label>' +
        '<div class="remlinks"><a class="btn go" data-remg href="' + K.reminderGoogle(t) + '" target="_blank" rel="noopener">Google Calendar</a>' +
        '<a class="btn ghost" data-remics href="#" download="kramavriddhi-learn-reminder.ics">' + tr('Other calendar (.ics)') + '</a></div>' +
        '<p class="apphelp">' + tr('This adds a repeating event to <strong>your own calendar</strong>, so your phone reminds you. You can delete it there any time.') + '</p></div>' +
      '<p class="appnote">' + (s === 'installed' ? tr('✓ You are using the app.') + ' ' : '') + tr('📶 Works offline after your first visit. Your progress stays on this phone.') + '</p>' +
      '</div>';
  }
  function refreshAppBox() { var b = document.getElementById('appbox'); if (b) b.outerHTML = appBox(); }
  K.onInstallChange(refreshAppBox);
  feed.addEventListener('change', function (e) {
    var cb = e.target.closest('[data-clean]');
    if (cb) {
      var box = cb.closest('.cleanbox'), all = box.querySelectorAll('[data-clean]'), on = box.querySelectorAll('[data-clean]:checked').length;
      if (on === all.length && !st.cleaned[box.getAttribute('data-unit')]) {
        st.cleaned[box.getAttribute('data-unit')] = today; st.cr += 2; save(); updatePill(); refreshStats();
        box.querySelector('.cleanmsg').innerHTML = tr('🧹 Clean-up done!') + ' <span class="earn">+2 🪙</span>' + (Object.keys(st.cleaned).length === 3 ? ' · ' + tr('New badge: Cloud cleaner') : '');
        K.track('cleanup_done', { unit_id: box.getAttribute('data-unit') });
      }
      return;
    }
    var nm = e.target.closest('[data-name]');
    if (nm) { st.name = nm.value.trim().slice(0, 40); save(); var av = document.getElementById('pf-av'); if (av) av.innerHTML = avatar(); return; }
    var ti = e.target.closest('[data-remtime]'); if (!ti || !ti.value) return;
    st.remTime = ti.value; save();
    var g = feed.querySelector('[data-remg]'); if (g) g.href = K.reminderGoogle(ti.value);
  });
  function appClick(e) {
    if (e.target.closest('[data-install]')) { K.install().then(refreshAppBox); return true; }
    var h = e.target.closest('[data-installhelp]');
    if (h) { var box = document.getElementById('installhelp'), open = box.hidden; box.hidden = !open; h.setAttribute('aria-expanded', open); if (open) K.track('app_install_help', { how: K.installState() }); return true; }
    var r = e.target.closest('[data-rem]');
    if (r) { var rb = document.getElementById('rembox'), o = rb.hidden; rb.hidden = !o; r.setAttribute('aria-expanded', o); return true; }
    if (e.target.closest('[data-remg]')) { K.track('reminder_add', { cal: 'google' }); return false; }
    var ic = e.target.closest('[data-remics]');
    if (ic) { ic.href = K.reminderIcs(st.remTime || '19:00'); K.track('reminder_add', { cal: 'ics' }); return false; }
    return false;
  }

  function reviewLine() {
    var n = dueReviews().filter(function (c) { return !answeredToday(c.id); }).length;
    return [n ? '🔁 ' + tr('<strong>{n}</strong> to review today', { n: n }) : '', st.mastered ? '🏅 ' + tr('<strong>{n}</strong> mastered', { n: st.mastered }) : ''].filter(Boolean).join(' · ');
  }
  function answeredToday(id) { return feedCards.some(function (c, j) { return c.id === id && feedModes[j] === 'review' && reviewNote[j]; }); }

  function trackRow(t) {
    var p = levelProgress(t), pct = p.live ? Math.round(p.done / p.live * 100) : 0;
    return '<li class="t-' + tkey(t.topic) + '" data-trow="' + t.id + '"><details><summary>' +
      '<span class="pav" aria-hidden="true">' + K.esc((TOPIC[tkey(t.topic)] || TOPIC.devops).ab) + '</span>' +
      '<span class="tr-txt"><strong>' + K.esc(t.name) + '</strong><span class="tr-now">' + K.esc(p.label) + '</span>' +
      '<span class="bar" role="img" aria-label="' + p.done + ' of ' + p.live + ' ready units done"><i style="width:' + pct + '%"></i></span>' +
      '<span class="tr-count">' + tr('{n} of {m} ready units done · {p} planned', { n: p.done, m: p.live, p: t.units.length }) + '</span></span>' +
      '<span class="tr-open" aria-hidden="true">' + tr('Path') + ' ▾</span></summary><div class="pathbox"></div></details></li>';
  }

  function pathHtml(t) {
    var nu = nextUnit(t);
    return ['b', 'i', 'a'].map(function (lv) {
      var us = t.units.filter(function (u) { return u.level === lv; });
      return '<h3>' + LEVEL[lv] + '</h3><ol class="path">' + us.map(function (u) {
        var stt = unitDone(u) ? 'done' : u === nu ? 'now' : live(u) ? 'todo' : 'soon';
        var lab = tr({ done: 'done', now: 'up next', todo: 'ready', soon: 'coming soon' }[stt]);
        var dn = u.cards.filter(isDone).length;
        return '<li class="p-' + stt + '"><span class="pn">' + u.n + '</span><span class="pt">' + K.esc(u.title) + '</span><span class="ps">' + lab + (live(u) && stt !== 'done' && dn ? ' · ' + dn + '/' + u.cards.length : '') + '</span></li>';
      }).join('') + '</ol>';
    }).join('');
  }

  function unitHead(u) {
    var t = u.track, dn = u.cards.filter(isDone).length;
    return '<section class="dcard unithead t-' + tkey(t.topic) + '" aria-label="' + K.esc(t.name + ', unit ' + u.n + ': ' + u.title) + '"><div class="dinner post">' +
      '<header class="phead"><span class="pav" aria-hidden="true">' + K.esc((TOPIC[tkey(t.topic)] || TOPIC.devops).ab) + '</span>' +
      '<span class="pwho"><strong>' + K.esc(t.name) + '</strong><span>' + LEVEL[u.level] + ' · ' + tr('Unit {n} of {m}', { n: u.n, m: t.units.length }) + '</span></span></header>' +
      '<p class="kicker">' + tr('New unit') + '</p><h2 class="uh-title">' + K.esc(u.title) + '</h2>' +
      '<p class="uh-sub">' + tr('{n} cards', { n: u.cards.length }) + (dn ? ' · ' + tr('{n} done already', { n: dn }) : '') + ': ' + countTypes(u) + '</p>' +
      (LANG === 'te' && !u.te ? '<p class="uh-sub enonly">' + tr('This unit is in English for now. Telugu is coming soon.') + '</p>' : '') +
      (checksOf(u).length && !dn ? '<div class="uh-test"><button type="button" class="btn ghost" data-testout="' + u.id + '">' + tr('I know this: take the checkpoint ↓') + '</button>' +
        '<span>' + tr('Get all {n} checkpoint questions right to skip this unit.', { n: checksOf(u).length }) + '</span></div>' : '') +
      '</div></section>';
  }
  function checksOf(u) { return u.cards.filter(function (c) { return c.t === 'check'; }); }
  function countTypes(u) {
    var l = u.cards.filter(function (c) { return c.t === 'learn'; }).length, g = u.cards.filter(function (c) { return c.t === 'pipe' || c.t === 'indent'; }).length,
        k = checksOf(u).length, q = u.cards.length - l - g - k;
    return [l ? tr('{n} explainer', { n: l }) : '', q ? tr('{n} practice', { n: q }) : '', g ? tr(g > 1 ? '{n} mini games' : '{n} mini game', { n: g }) : '', k ? tr(k > 1 ? '{n} checkpoints' : '{n} checkpoint', { n: k }) : ''].filter(Boolean).join(', ');
  }

  /* test out: when all checkpoints of a unit someone is testing are answered */
  function testOutResult(c) {
    var u = c.unit, ks = checksOf(u);
    if (c.t !== 'check' || !testing[u.id] || !ks.every(isDone)) return '';
    delete testing[u.id];
    if (ks.every(function (k) { return st.done[k.id].ok; })) {
      u.cards.forEach(function (x) {
        if (isDone(x)) return;
        st.done[x.id] = { ok: true, d: today, skip: 1 };
        feedCards.forEach(function (fc, j) { if (fc === x) { var s = document.getElementById('c-' + j); if (s) s.classList.add('skipped'); } });
      });
      save(); refreshStats();
      K.track('unit_test_out', { unit_id: u.id });
      return '<p class="unitdone">' + tr('🎉 You tested out of “{t}”. Moving on!', { t: K.esc(u.title) }) + '</p>';
    }
    return '<p class="unitdone">' + tr('Not yet. Go through the unit from its first card above, then try the rest.') + '</p>';
  }

  /* ---------- one card */
  function cardHtml(c, mode) {
    var j = feedCards.push(c) - 1, isGame = c.t === 'pipe' || c.t === 'indent', u = c.unit, rev = mode === 'review';
    feedModes[j] = mode || '';
    var head = '<header class="phead"><span class="pav" aria-hidden="true">' + K.esc(topicOf(c).ab) + '</span>' +
      '<span class="pwho"><strong>' + K.esc(u.track.name) + '</strong><span>' + tr('Unit {n}', { n: u.n }) + ' · ' + K.esc(u.title) + '</span></span>' +
      '<span class="dcount">' + (rev ? '🔁' : (c.pos + 1) + '/' + u.cards.length) + '</span></header>' +
      (rev ? '<p class="dtype review-type">🔁 ' + tr('Review') + (st.review[c.id] && st.review[c.id].step ? ' ' + tr('{n} of 3', { n: st.review[c.id].step + 1 }) : '') + '</p>' : '') +
      '<p class="dtype' + (isGame ? ' game-type' : c.t === 'learn' ? ' learn-type' : c.t === 'check' ? ' check-type' : '') + '">' + (isGame ? '🎮 ' : c.t === 'learn' ? '💡 ' : c.t === 'check' ? '✅ ' : '') + (c.t === 'output' && c.lang === 'sql' ? tr('What does it return?') : TYPE[c.t]) + '</p>';
    var body = '';
    if (c.t === 'learn') body = '<h2 class="dq">' + K.esc(c.title) + '</h2><p class="lbody">' + gl(K.rich(c.body)) + '</p>' + (c.code ? codeBlock(c.code.split('\n'), false, c.lang) : '') +
      '<div class="mbar"><button type="button" class="btn go" data-got>' + tr('Got it ✓') + '</button></div>';
    else if (c.t === 'output') body = codeBlock(c.code.split('\n'), false, c.lang) + choiceList(c);
    else if (c.t === 'choice') body = '<h2 class="dq">' + K.rich(c.q) + '</h2>' + choiceList(c);
    else if (c.t === 'check') body = '<h2 class="dq">' + K.rich(c.q || tr(c.lang === 'sql' ? 'What does this query return?' : 'What does this print?')) + '</h2>' + (c.code ? codeBlock(c.code.split('\n'), false, c.lang) : '') + choiceList(c);
    else if (c.t === 'bug') body = '<h2 class="dq">' + K.rich(c.q) + '</h2>' + codeBlock(c.code, true, c.lang);
    else if (c.t === 'order') body = '<h2 class="dq">' + K.rich(c.q) + '</h2><div class="order-list">' + shuffleDiff(c.items).map(function (it) {
        return '<button type="button" class="ord" data-item="' + K.esc(it) + '"><span class="ordn" aria-hidden="true"></span><span>' + K.esc(it) + '</span></button>';
      }).join('') + '</div><button type="button" class="btn ghost ord-reset" hidden>' + tr('Start again') + '</button>';
    else if (c.t === 'pipe') body = pipeBody(c);
    else if (c.t === 'indent') body = indentBody(c);
    if (c.t !== 'learn' && c.t !== 'check' && mode !== 'play') body += helpBar(c);
    var liked = !!st.likes[c.id], saved = !!st.saved[c.id];
    var actions = '<div class="pactions">' +
      '<button type="button" class="pact like" data-like aria-pressed="' + liked + '" aria-label="Like">' + ICON.heart + '</button>' +
      '<a class="pact" href="' + K.wa(shareText(c)) + '" target="_blank" rel="noopener" aria-label="Share on WhatsApp">' + ICON.share + '</a>' +
      '<button type="button" class="pact pnote" data-note aria-expanded="false" aria-pressed="' + !!st.notes[c.id] + '" aria-controls="nb-' + j + '" aria-label="' + tr('My notes') + '">' + ICON.note + '</button>' +
      '<button type="button" class="pact plearn" data-learn aria-expanded="false" aria-controls="lb-' + j + '">' + ICON.book + '<span>' + tr('Learn more') + '</span></button>' +
      '<button type="button" class="pact save" data-save aria-pressed="' + saved + '" aria-label="Save for later">' + ICON.save + '</button>' +
      '</div>' +
      '<div class="plearnbox" id="lb-' + j + '" hidden><p>' + tr('Read and practise more:') + '</p><ul>' + learnLinks(c).map(function (l) {
        return '<li><a href="' + K.esc(l.href) + '"' + (l.ext ? ' target="_blank" rel="noopener"' : '') + '>' + K.esc(tr(l.label)) + (l.ext ? ' ↗' : '') + '</a></li>';
      }).join('') + '</ul></div>' + noteBox(c, j);
    return '<section class="dcard t-' + tkey(c.topic) + (isGame ? ' gamecard' : '') + (rev ? ' reviewcard' : '') + (mode === 'play' ? ' playcard' : '') + '" id="c-' + j + '" data-j="' + j + '" aria-label="' + K.esc((rev ? 'Review: ' : mode === 'play' ? 'Game break: ' : '') + u.track.name + ', ' + u.title + ', card ' + (c.pos + 1) + ' of ' + u.cards.length) + '">' +
      '<div class="dinner post">' + head + '<div class="pbody">' + body + '</div>' +
      '<div class="dres" hidden></div>' + actions + '<span class="bigheart" aria-hidden="true">' + ICON.heart + '</span></div></section>';
  }

  function shareText(c) {
    var what = c.t === 'learn' ? c.title + ': ' + c.body : (c.t === 'output' || (c.t === 'check' && c.code && !c.q)) ? tr(c.lang === 'sql' ? 'What does this SQL query return?' : c.lang === 'shell' ? 'What does this command print?' : 'What does this Python code print?') + '\n\n' + c.code : c.q;
    return tr(c.t === 'learn' ? 'Learn this in 1 minute' : 'Can you solve this?') + ' (' + c.unit.track.name + ')\n' + what.replace(/`|\*\*/g, '') +
      '\n\n' + tr('Try it on Kramavriddhi Learn:') + ' ' + URL + (LANG === 'te' ? '?lang=te' : '') + '#card=' + c.id;
  }

  function choiceList(c) {
    return '<div class="choices">' + K.shuffle([c.a].concat(c.w)).map(function (o, n) {
      return '<button type="button" class="choice" data-opt="' + K.esc(o) + '"><span class="key" aria-hidden="true">' + 'ABCD'.charAt(n) + '</span><pre>' + K.esc(o) + '</pre></button>';
    }).join('') + '</div>';
  }

  /* mini game 1: build the pipeline (steps: [glyph, name, style]) */
  function block(b, id) {
    return '<button type="button" class="mblock" data-b="' + id + '"><span class="glyph ' + (b[2] || '') + '">' + K.esc(b[0]) + '</span><span class="bname">' + K.esc(b[1]) + '</span></button>';
  }
  function pipeBody(c) {
    var all = c.steps.map(function (b, n) { return { b: b, id: 's' + n }; }).concat((c.extra || []).map(function (b, n) { return { b: b, id: 'x' + n }; }));
    return '<h2 class="dq">' + K.rich(c.q) + '</h2>' +
      '<ol class="mpipe" aria-label="Pipeline steps">' + c.steps.map(function (_, n) { return '<li><button type="button" class="mslot" data-slot="' + n + '" aria-label="Step ' + (n + 1) + ', empty"><span class="mno">' + (n + 1) + '</span></button></li>'; }).join('') + '</ol>' +
      '<p class="mhint">' + tr('Tap a block to add it to the next empty step. Tap a step to take its block back.') + (c.extra && c.extra.length ? ' ' + tr('One block does not belong.') : '') + '</p>' +
      '<div class="mtray">' + K.shuffle(all).map(function (x) { return block(x.b, x.id); }).join('') + '</div>' +
      '<div class="mbar"><button type="button" class="btn go mrun" disabled>▶ ' + tr('Run') + '</button><span class="mmsg" role="status"></span></div>';
  }

  /* mini game 2: fix the indentation (lines: [spaces, text]) */
  function indentBody(c) {
    var yaml = c.step === 2;
    return '<h2 class="dq">' + K.rich(c.q) + '</h2>' +
      '<div class="editor dcode"><div class="ed-bar"><span class="file">' + (FILE[c.lang] || (yaml ? 'site.yml' : 'main.py')) + '</span><span>' + tr('Tap a line to add {n} spaces', { n: c.step }) + '</span></div>' +
      '<ol class="bug-lines">' + c.lines.map(function (l, n) {
        return '<li><button type="button" class="bugline iline" data-line="' + n + '" data-ind="0" aria-label="Line ' + (n + 1) + ', 0 spaces: ' + K.esc(l[1]) + '"><span class="num" aria-hidden="true">' + (n + 1) + '</span><span class="ws" aria-hidden="true"></span><span class="src">' + (yaml ? hlYaml(l[1]) : hlPy(l[1])) + '</span></button></li>';
      }).join('') + '</ol></div>' +
      '<p class="mhint">' + tr('Each tap pushes a line {n} spaces to the right. After the deepest level it goes back to 0.', { n: c.step }) + ' ' + tr(yaml ? 'In YAML, the lines under a line ending in <code>:</code> are indented 2 more.' : 'In Python, the lines under a line ending in <code>:</code> are indented 4 more.') + '</p>' +
      '<div class="mbar"><button type="button" class="btn go mrun">▶ ' + tr('Check') + '</button><span class="mmsg" role="status"></span></div>';
  }
  function maxInd(c) { return c.lines.reduce(function (m, l) { return Math.max(m, l[0]); }, 0) + c.step; }
  function setInd(btn, ind, c) {
    btn.setAttribute('data-ind', ind);
    btn.querySelector('.ws').textContent = new Array(ind + 1).join('·');
    btn.setAttribute('aria-label', 'Line ' + (+btn.getAttribute('data-line') + 1) + ', ' + ind + ' spaces: ' + c.lines[+btn.getAttribute('data-line')][1]);
  }

  /* ---------- results */
  function result(j, ok, restoring, verdict, extra) {
    var c = feedCards[j], sec = document.getElementById('c-' + j), res = sec.querySelector('.dres'), u = c.unit;
    sec.classList.remove('is-right', 'is-wrong');
    sec.classList.add('answered', ok ? 'is-right' : 'is-wrong');
    sec.classList.toggle('solved-late', !ok && !!verdict);
    var right = c.t === 'order' && !ok ? '<p class="small">' + tr('The right order:') + '</p><ol class="right-order">' + c.items.map(function (x) { return '<li>' + K.esc(x) + '</li>'; }).join('') + '</ol>' : '';
    var finished = unitDone(u), last = c.pos === u.cards.length - 1;
    if (feedModes[j] === 'review') { extra = reviewNote[j] || ''; finished = false; last = false; }
    if (feedModes[j] === 'play') { extra = '<p class="revnote">' + tr('🎮 Game break done · it counts for today') + '</p>'; finished = false; last = false; }
    var gain = earned[j]; delete earned[j];
    res.innerHTML = '<p class="verdict">' + (verdict || tr(ok ? '✓ Correct!' : '✗ Not quite.')) + (restoring ? ' <span class="muted">' + tr('(done before)') + '</span>' : '') + (gain ? ' <span class="earn">+' + gain + ' 🪙</span>' : '') + '</p>' + right +
      (c.why ? '<p>' + gl(K.rich(c.why)) + '</p>' : '') +
      (extra || (finished && !restoring ? '<p class="unitdone">' + tr('🎉 Unit complete:') + ' ' + K.esc(u.title) + '</p>' + cleanupBox(u) : '')) +
      '<button type="button" class="btn primary" data-next>' + tr(last || finished ? 'Next unit ↓' : 'Next ↓') + '</button>';
    res.hidden = false;
  }

  function markChoices(sec, c, picked) {
    sec.querySelectorAll('.choice').forEach(function (b) {
      b.disabled = true;
      var o = b.getAttribute('data-opt');
      if (o === c.a) b.classList.add('right'); else if (o === picked) b.classList.add('wrong');
    });
  }
  function markBug(sec, c, picked) {
    sec.querySelectorAll('.bugline').forEach(function (b) {
      b.disabled = true;
      var n = +b.getAttribute('data-line');
      if (n === c.bad) b.classList.add('right'); else if (n === picked) b.classList.add('wrong');
    });
  }
  function markOrder(sec, c) {
    sec.querySelectorAll('.ord').forEach(function (b) {
      b.disabled = true;
      var want = c.items.indexOf(b.getAttribute('data-item')) + 1, got = +(b.getAttribute('data-n') || 0);
      b.classList.add(want === got ? 'right' : 'wrong');
      if (!got) b.querySelector('.ordn').textContent = want;
    });
    sec.querySelector('.ord-reset').hidden = true;
  }

  function record(j, ok, nTries) {
    var c = feedCards[j], u = c.unit, wasDone = unitDone(u);
    if (!started) { started = true; K.track('game_start', { game_name: 'kramavriddhi_learn', level: u.n, unit_id: u.id }); }
    if (feedModes[j] === 'review') reviewNote[j] = reviewAnswer(c.id, ok);
    else if (feedModes[j] === 'play') { gstat('puzzle').p++; K.track('game_break', { kind: 'puzzle', action: 'done', ok: ok ? 1 : 0 }); }
    else {
      st.done[c.id] = { ok: ok, d: today };
      if (nTries) st.done[c.id].tries = nTries;
      if (!ok && c.t !== 'learn') scheduleMiss(c.id);
    }
    var gain = ok && c.t !== 'learn' ? (c.t === 'check' ? 2 : 1) : 0, before = todayCount();
    bumpDay();
    if (before < GOAL && todayCount() >= GOAL) gain += 5;
    if (!wasDone && unitDone(u)) gain += 3;
    if (gain) { st.cr += gain; earned[j] = gain; }
    if (!wasDone && unitDone(u)) {
      var right = u.cards.filter(function (x) { return st.done[x.id].ok; }).length;
      K.track('level_complete', { game_name: 'kramavriddhi_learn', level: u.n, unit_id: u.id, stars: right === u.cards.length ? 3 : right >= u.cards.length * 0.6 ? 2 : 1 });
    }
    save();
    updatePill(); refreshStats(); renderEnd();
  }

  /* one more card (or game break) done today; the streak grows when the daily goal is reached */
  function bumpDay() {
    st.days[today] = todayCount() + 1;
    if (todayCount() === GOAL) {
      if (st.streak.last === today - 1) st.streak.n++;
      else if (st.streak.last !== today) st.streak.n = 1;
      st.streak.last = today;
      st.best = Math.max(st.best || 0, st.streak.n);
      K.track('daily_goal', { streak: st.streak.n });
    }
  }

  function refreshStats() {
    var s = streakNow(), e1 = document.getElementById('s-streak'), e2 = document.getElementById('s-today'), e3 = document.getElementById('s-units');
    if (!e1) return;
    var unitsDone = 0;
    st.tracks.forEach(function (id) { unitsDone += liveUnits(TR[id]).filter(unitDone).length; });
    e1.textContent = s ? '🔥' + s : '0'; e2.textContent = Math.min(todayCount(), GOAL) + '/' + GOAL; e3.textContent = unitsDone;
    var e5 = document.getElementById('s-cr'); if (e5) e5.textContent = st.cr;
    var e4 = document.getElementById('s-review'); if (e4) e4.innerHTML = reviewLine();
    feed.querySelectorAll('[data-trow]').forEach(function (li) {
      var t = TR[li.getAttribute('data-trow')], p = levelProgress(t), pct = p.live ? Math.round(p.done / p.live * 100) : 0;
      li.querySelector('.tr-now').textContent = p.label;
      li.querySelector('.bar i').style.width = pct + '%';
      li.querySelector('.bar').setAttribute('aria-label', p.done + ' of ' + p.live + ' ready units done');
      li.querySelector('.tr-count').textContent = tr('{n} of {m} ready units done · {p} planned', { n: p.done, m: p.live, p: t.units.length });
      var box = li.querySelector('.pathbox'); if (li.querySelector('details').open) box.innerHTML = pathHtml(t);
    });
  }

  /* ---------- mini game logic */
  function pipeClick(sec, j, e) {
    var c = feedCards[j], tray = sec.querySelector('.mtray'), run = sec.querySelector('.mrun'), msg = sec.querySelector('.mmsg');
    var b = e.target.closest('.mblock'), slot = e.target.closest('.mslot');
    if (b && b.parentNode === tray) {
      var empty = sec.querySelector('.mslot:not(.filled)');
      if (!empty) return;
      empty.classList.add('filled'); empty.classList.remove('bad');
      empty.setAttribute('data-b', b.getAttribute('data-b'));
      empty.innerHTML = '<span class="mno">' + (+empty.getAttribute('data-slot') + 1) + '</span>' + b.innerHTML;
      empty.setAttribute('aria-label', 'Step ' + (+empty.getAttribute('data-slot') + 1) + ': ' + b.querySelector('.bname').textContent + '. Tap to take it back.');
      b.remove(); msg.textContent = '';
    } else if (slot && slot.classList.contains('filled') && !slot.classList.contains('ok')) {
      unslot(sec, slot);
    } else if (e.target.closest('.mrun') && !run.disabled) {
      tries[j] = (tries[j] || 0) + 1;
      var good = 0;
      sec.querySelectorAll('.mslot').forEach(function (s) {
        if (s.getAttribute('data-b') === 's' + s.getAttribute('data-slot')) { s.classList.add('ok'); good++; }
        else { s.classList.add('bad'); unslot(sec, s, true); }
      });
      if (good === c.steps.length) {
        sec.querySelector('.mpipe').classList.add('flowing');
        tray.hidden = true; sec.querySelector('.mhint').hidden = true; run.hidden = true;
        msg.textContent = '';
        var ok = tries[j] === 1;
        record(j, ok, tries[j]);
        setTimeout(function () { result(j, ok, false, ok ? tr('✓ Data is flowing! Solved first try.') : tr('✓ Solved in {n} runs.', { n: tries[j] })); }, reduce ? 0 : 700);
        return;
      }
      msg.textContent = tr('{n} of {m} right. Wrong blocks went back. Try again.', { n: good, m: c.steps.length });
    }
    run.disabled = !!sec.querySelector('.mslot:not(.filled)');
  }
  function unslot(sec, s, keepBad) {
    var id = s.getAttribute('data-b'); if (!id) return;
    var c = feedCards[+sec.getAttribute('data-j')], bdef = id.charAt(0) === 's' ? c.steps[+id.slice(1)] : c.extra[+id.slice(1)];
    sec.querySelector('.mtray').insertAdjacentHTML('beforeend', block(bdef, id));
    s.classList.remove('filled', 'ok'); if (!keepBad) s.classList.remove('bad');
    s.removeAttribute('data-b');
    s.innerHTML = '<span class="mno">' + (+s.getAttribute('data-slot') + 1) + '</span>';
    s.setAttribute('aria-label', 'Step ' + (+s.getAttribute('data-slot') + 1) + ', empty');
  }

  function indentClick(sec, j, e) {
    var c = feedCards[j], msg = sec.querySelector('.mmsg'), line = e.target.closest('.iline');
    if (line && !line.disabled) {
      var ind = +line.getAttribute('data-ind') + c.step;
      if (ind > maxInd(c)) ind = 0;
      setInd(line, ind, c); line.classList.remove('wrong'); msg.textContent = '';
      return;
    }
    if (e.target.closest('.mrun')) {
      tries[j] = (tries[j] || 0) + 1;
      var bad = 0;
      sec.querySelectorAll('.iline').forEach(function (b) {
        var want = c.lines[+b.getAttribute('data-line')][0];
        if (+b.getAttribute('data-ind') !== want) { bad++; b.classList.add('wrong'); } else b.classList.remove('wrong');
      });
      if (!bad) {
        sec.querySelectorAll('.iline').forEach(function (b) { b.disabled = true; b.classList.add('right'); });
        sec.querySelector('.mrun').hidden = true; sec.querySelector('.mhint').hidden = true; msg.textContent = '';
        var ok = tries[j] === 1;
        record(j, ok, tries[j]);
        result(j, ok, false, ok ? tr('✓ It runs! Solved first try.') : tr('✓ Solved in {n} tries.', { n: tries[j] }));
        return;
      }
      msg.textContent = tr(bad > 1 ? '{n} lines have the wrong indent (red). Fix and check again.' : '1 line has the wrong indent (red). Fix and check again.', { n: bad });
    }
  }

  /* ---------- clicks */
  feed.addEventListener('click', function (e) {
    if (e.target.closest('[data-profile]')) { e.preventDefault(); openProfile(); return; }
    if (e.target.closest('[data-back]')) { e.preventDefault(); history.replaceState(null, '', location.pathname); renderFeed(true); return; }
    if (e.target.closest('[data-reels]')) { setReels(!st.reels); return; }
    var lb = e.target.closest('[data-lang]');
    if (lb) { st.lang = lb.getAttribute('data-lang'); save(); K.track('lang_switch', { lang: st.lang }); location.reload(); return; }
    if (e.target.closest('#appbox') && appClick(e)) return;
    if (e.target.closest('[data-pick]')) { e.preventDefault(); history.replaceState(null, '', location.pathname + '?pick=1'); renderPicker(); window.scrollTo(0, feed.getBoundingClientRect().top + window.scrollY - 70); return; }
    if (e.target.closest('[data-start]')) { var first = feed.querySelector('.dcard.unithead, .dcard[data-j]'); if (first) scrollToCard(first); return; }
    var gt = e.target.closest('.gterm'); if (gt) { glossOpen(gt); return; }
    if (e.target.closest('[data-gclose]')) { var gp = e.target.closest('.gpop'); glossClose(gp); return; }
    if (e.target.closest('.gpop')) return;
    var gbSec = e.target.closest('.dcard.gamebreak'); if (gbSec) { gbClick(e, gbSec); return; }
    var mSec = e.target.closest('.dcard.memecard'); if (mSec) { memeClick(e, mSec); return; }
    if (e.target.closest('[data-memetoggle]')) { st.memesOff = !st.memesOff; save(); K.track('meme_toggle', { on: st.memesOff ? 0 : 1 }); renderProfile(); return; }
    if (e.target.closest('[data-more]')) { var endSec = document.getElementById('c-end'), before = feedCards.length; endSec.insertAdjacentHTML('beforebegin', nextBlocks()); renderEnd(); var n = document.getElementById('c-' + before); if (n) scrollToCard(n.previousElementSibling || n); return; }
    var to = e.target.closest('[data-testout]');
    if (to) {
      var tu = UNIT[to.getAttribute('data-testout')], firstCheck = -1;
      testing[tu.id] = true;
      feedCards.forEach(function (fc, k) { if (firstCheck < 0 && fc.unit === tu && fc.t === 'check' && !isDone(fc)) firstCheck = k; });
      to.parentNode.innerHTML = '<span>' + tr('Answer the checkpoint questions below. Get them all right to skip the unit.') + '</span>';
      if (firstCheck >= 0) scrollToCard(document.getElementById('c-' + firstCheck));
      return;
    }
    var nx = e.target.closest('[data-next]');
    if (nx) { var next = nx.closest('.dcard').nextElementSibling; if (next) scrollToCard(next); return; }
    var sec = e.target.closest('.dcard[data-j]'); if (!sec) return;
    var j = +sec.getAttribute('data-j'), c = feedCards[j];
    var lk = e.target.closest('[data-like]'); if (lk) { setLike(sec, c, !st.likes[c.id]); return; }
    var sv = e.target.closest('[data-save]');
    if (sv) {
      var on = !st.saved[c.id];
      if (on) st.saved[c.id] = 1; else delete st.saved[c.id];
      sv.setAttribute('aria-pressed', on); save(); renderEnd();
      return;
    }
    var ln = e.target.closest('[data-learn]');
    if (ln) {
      var box = document.getElementById('lb-' + j), open = box.hidden;
      box.hidden = !open; ln.setAttribute('aria-expanded', open);
      if (open) { K.track('daily_learn_more', { topic: c.topic }); box.scrollIntoView({ block: 'nearest', behavior: reduce ? 'auto' : 'smooth' }); }
      return;
    }
    var nb = e.target.closest('[data-note]');
    if (nb) {
      var nbox = document.getElementById('nb-' + j), nopen = nbox.hidden;
      nbox.hidden = !nopen; nb.setAttribute('aria-expanded', nopen);
      if (nopen) { var ta = nbox.querySelector('textarea'); nbox.scrollIntoView({ block: 'nearest', behavior: reduce ? 'auto' : 'smooth' }); setTimeout(function () { ta.focus({ preventScroll: true }); }, 250); }
      return;
    }
    if (e.target.closest('[data-notesave]')) { saveNote(sec, c); return; }
    var ask = e.target.closest('[data-ask]');
    if (ask) { saveNote(sec, c, true); ask.href = K.wa(askText(c, sec.querySelector('.pnotebox textarea').value)); K.track('ask_doubt', { topic: c.topic }); return; }
    if (e.target.closest('.plearnbox, .pactions, .pnotebox')) return;
    if (isDone(c) && sec.classList.contains('answered')) return;
    var hb = e.target.closest('[data-hint], [data-reveal]');
    if (hb) { if (!sec.classList.contains('answered')) helpClick(sec, j, c, hb); return; }
    if (c.t === 'learn') { if (e.target.closest('[data-got]')) { e.target.closest('.mbar').hidden = true; record(j, true); result(j, true, false, tr('✓ Got it')); } return; }
    if (c.t === 'pipe') return pipeClick(sec, j, e);
    if (c.t === 'indent') return indentClick(sec, j, e);
    var ch = e.target.closest('.choice');
    if (ch && !ch.disabled) { var ok = ch.getAttribute('data-opt') === c.a; markChoices(sec, c, ch.getAttribute('data-opt')); record(j, ok); result(j, ok, false, null, testOutResult(c)); return; }
    var bl = e.target.closest('.bugline');
    if (bl && !bl.disabled) { var p = +bl.getAttribute('data-line'), ok2 = p === c.bad; markBug(sec, c, p); record(j, ok2); result(j, ok2); return; }
    if (e.target.closest('.ord-reset')) { sec.querySelectorAll('.ord').forEach(function (b) { b.removeAttribute('data-n'); b.classList.remove('picked'); b.querySelector('.ordn').textContent = ''; }); e.target.closest('.ord-reset').hidden = true; return; }
    var od = e.target.closest('.ord');
    if (od && !od.disabled && !od.getAttribute('data-n')) {
      var all = sec.querySelectorAll('.ord'), n2 = sec.querySelectorAll('.ord[data-n]').length + 1;
      od.setAttribute('data-n', n2); od.classList.add('picked'); od.querySelector('.ordn').textContent = n2;
      sec.querySelector('.ord-reset').hidden = false;
      if (n2 === all.length) {
        var ok3 = true;
        all.forEach(function (b) { if (c.items.indexOf(b.getAttribute('data-item')) + 1 !== +b.getAttribute('data-n')) ok3 = false; });
        markOrder(sec, c); record(j, ok3); result(j, ok3);
      }
    }
  });
  /* open a unit's path when its row is expanded */
  feed.addEventListener('toggle', function (e) {
    var d = e.target; if (!d.matches || !d.matches('details') || !d.open) return;
    var li = d.closest('[data-trow]'); if (li) li.querySelector('.pathbox').innerHTML = pathHtml(TR[li.getAttribute('data-trow')]);
  }, true);

  function setLike(sec, c, on, pop) {
    if (on && !st.likes[c.id] && feedModes[+sec.getAttribute('data-j')] === 'play') gstat('puzzle').l++;
    if (on) st.likes[c.id] = 1; else delete st.likes[c.id];
    sec.querySelector('[data-like]').setAttribute('aria-pressed', on);
    save();
    if (on && pop && !reduce) { var h = sec.querySelector('.bigheart'); h.classList.remove('pop'); void h.offsetWidth; h.classList.add('pop'); }
  }
  feed.addEventListener('dblclick', function (e) {
    var area = e.target.closest('.phead, .dq, .snippet, .lbody'); if (!area) return;
    var sec = area.closest('.dcard[data-j]'); if (!sec) return;
    setLike(sec, feedCards[+sec.getAttribute('data-j')], true, true);
  });

  function scrollToCard(el) {
    el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    var f = el.querySelector('button:not([disabled]):not([hidden]), a'); if (f) setTimeout(function () { f.focus({ preventScroll: true }); }, 400);
  }

  /* show cards that were done before (only a shared card can be) as answered */
  function restoreAll() {
    feedCards.forEach(function (c, j) {
      if (!isDone(c) || feedModes[j] === 'review' || feedModes[j] === 'play') return;
      var sec = document.getElementById('c-' + j), d = st.done[c.id];
      if (!sec || sec.classList.contains('answered')) return;
      showSolution(sec, c);
      var g = c.t === 'pipe' || c.t === 'indent';
      result(j, d.ok, true, st.revealed[c.id] ? '🔓 ' + tr('Solution shown') : c.t === 'learn' ? tr('✓ Got it') : g ? (d.ok ? tr('✓ Solved first try.') : d.tries ? tr('✓ Solved in {n} tries.', { n: d.tries }) : tr('✓ Solved.')) : null);
    });
  }

  /* the right answer shown on the card (used for cards done before, and for Show solution) */
  function showSolution(sec, c) {
    if (c.t === 'output' || c.t === 'choice' || c.t === 'check') markChoices(sec, c, null);
    else if (c.t === 'bug') markBug(sec, c, null);
    else if (c.t === 'order') { sec.querySelectorAll('.ord').forEach(function (b) { b.setAttribute('data-n', c.items.indexOf(b.getAttribute('data-item')) + 1); b.querySelector('.ordn').textContent = b.getAttribute('data-n'); }); markOrder(sec, c); }
    else if (c.t === 'learn') sec.querySelector('.mbar').hidden = true;
    else if (c.t === 'pipe') {
      sec.querySelectorAll('.mslot').forEach(function (s) {
        var n = +s.getAttribute('data-slot'), b = c.steps[n];
        s.className = 'mslot filled ok'; s.setAttribute('data-b', 's' + n);
        s.innerHTML = '<span class="mno">' + (n + 1) + '</span><span class="glyph ' + (b[2] || '') + '">' + K.esc(b[0]) + '</span><span class="bname">' + K.esc(b[1]) + '</span>';
      });
      sec.querySelector('.mtray').hidden = true; sec.querySelector('.mhint').hidden = true; sec.querySelector('.mrun').hidden = true;
    } else if (c.t === 'indent') {
      sec.querySelectorAll('.iline').forEach(function (b) { setInd(b, c.lines[+b.getAttribute('data-line')][0], c); b.disabled = true; b.classList.add('right'); });
      sec.querySelector('.mrun').hidden = true; sec.querySelector('.mhint').hidden = true;
    }
  }

  /* =====================================================================
     Credits: 💡 50/50 hint and 🔓 Show solution (Phase S2)
     ===================================================================== */
  function helpBar(c) {
    var fifty = c.t === 'choice' || c.t === 'output';
    return '<div class="helpbar">' +
      (fifty ? '<button type="button" class="hbtn" data-hint>💡 50/50 <span class="hcost">' + COST.hint + ' 🪙</span></button>' : '') +
      '<button type="button" class="hbtn" data-reveal>🔓 ' + tr('Show solution') + ' <span class="hcost">' + COST.reveal + ' 🪙</span></button>' +
      '<p class="hmsg" role="status"></p></div>';
  }
  function helpClick(sec, j, c, btn) {
    var kind = btn.hasAttribute('data-hint') ? 'hint' : 'reveal', cost = COST[kind], msg = sec.querySelector('.hmsg');
    if (st.cr < cost) { msg.textContent = tr('You have {n} 🪙. Answer cards right to earn more.', { n: st.cr }); return; }
    if (!btn.hasAttribute('data-armed')) {          /* tap twice, so credits are never spent by mistake */
      sec.querySelectorAll('[data-armed]').forEach(function (b) { b.removeAttribute('data-armed'); });
      btn.setAttribute('data-armed', '1');
      msg.textContent = tr(kind === 'hint' ? 'Tap again to remove 2 wrong answers for {n} 🪙.' : 'Tap again to see the solution for {n} 🪙. The card will come back for review.', { n: cost });
      setTimeout(function () { if (btn.isConnected) { btn.removeAttribute('data-armed'); if (msg.textContent.indexOf('🪙') >= 0 && !btn.disabled) msg.textContent = ''; } }, 5000);
      return;
    }
    st.cr -= cost; K.track('credit_spend', { kind: kind, topic: c.topic });
    if (kind === 'hint') {
      var wrong = [].slice.call(sec.querySelectorAll('.choice:not(:disabled)')).filter(function (b) { return b.getAttribute('data-opt') !== c.a; });
      K.shuffle(wrong).slice(0, 2).forEach(function (b) { b.disabled = true; b.classList.add('out'); });
      btn.remove(); msg.textContent = tr('2 wrong answers removed.');
      save(); updatePill(); refreshStats();
      return;
    }
    st.revealed[c.id] = { d: today };
    showSolution(sec, c);
    record(j, false, tries[j]);
    result(j, false, false, '🔓 ' + tr('Solution shown'), '<p class="revnote">' + tr('Saved in your profile under “Solutions I opened”. This card comes back tomorrow for review.') + '</p>');
  }
  function revealedList() {
    var ids = Object.keys(st.revealed).filter(function (id) { return CARD[id]; }).sort(function (a, b) { return st.revealed[b].d - st.revealed[a].d; });
    if (!ids.length) return '';
    return '<h3 class="pfh">🔓 ' + tr('Solutions I opened') + ' (' + ids.length + ')</h3><p class="nhelp">' + tr('Tap one to open that reel again and read the concept.') + '</p><ul class="savedlist">' + ids.slice(0, 30).map(function (id) {
      var c = CARD[id], title = c.t === 'learn' ? c.title : (c.t === 'output' || (c.t === 'check' && c.code && !c.q)) ? tr('What does this print?') + ' ' + c.code.split('\n')[0] : c.q.replace(/`|\*\*/g, '');
      return '<li class="t-' + tkey(c.topic) + '"><a href="#card=' + id + '"><span class="pav" aria-hidden="true">' + K.esc(topicOf(c).ab) + '</span><span><strong>' + K.esc(c.unit.track.name) + ' · ' + K.esc(c.unit.title) + '</strong><br>' + K.esc(title.length > 80 ? title.slice(0, 78) + '…' : title) + '</span></a></li>';
    }).join('') + '</ul>';
  }

  /* =====================================================================
     Meme breaks: a light, original meme every 10 cards, with a real lesson (Phase S3)
     ===================================================================== */
  st.laughs = st.laughs || {};
  function memeHtml() {
    var all = window.KV_MEMES || [];
    if (st.memesOff || !all.length) return '';
    var pool = all.filter(function (m) { return st.tracks.indexOf(m.tr) >= 0 && TR[m.tr]; });
    if (!pool.length) return '';
    var seen = st.memeSeen || [], avail = pool.filter(function (m) { return seen.indexOf(m.id) < 0; });
    if (!avail.length) { seen = seen.filter(function (id) { return !pool.some(function (m) { return m.id === id; }); }); avail = pool; }
    var shown = {}; feed.querySelectorAll('.memecard').forEach(function (x) { shown[x.getAttribute('data-meme')] = 1; });
    var fresh = avail.filter(function (m) { return !shown[m.id]; }); if (fresh.length) avail = fresh;
    var m = avail[Math.floor(Math.random() * avail.length)], t = TR[m.tr], x = LANG === 'te' && m.te ? m.te : m;
    seen.push(m.id); st.memeSeen = seen.slice(-40);
    var share = '😂 ' + x.top + '\n' + m.face + '\n' + x.bottom + '\n\n📚 ' + x.lesson.replace(/`|\*\*/g, '') + '\n\n' + tr('Learn {s} with memes and games on Kramavriddhi Learn:', { s: t.name }) + ' ' + URL + (LANG === 'te' ? '?lang=te' : '');
    return '<section class="dcard memecard t-' + tkey(t.topic) + '" data-meme="' + m.id + '" aria-label="' + K.esc(tr('😂 Meme break')) + '"><div class="dinner post">' +
      '<header class="phead"><span class="pav" aria-hidden="true">' + K.esc((TOPIC[tkey(t.topic)] || TOPIC.devops).ab) + '</span><span class="pwho"><strong>' + tr('😂 Meme break') + '</strong><span>' + K.esc(t.name) + '</span></span>' +
      '<button type="button" class="gbskip" data-memeskip>' + tr('Skip ↓') + '</button></header>' +
      '<figure class="meme"><p class="mtop">' + K.esc(x.top) + '</p><div class="mface" aria-hidden="true">' + m.face + '</div><p class="mbot">' + K.esc(x.bottom) + '</p><figcaption class="mbrand">kramavriddhi.learn</figcaption></figure>' +
      '<p class="mlesson">📚 <strong>' + tr('Lesson:') + '</strong> ' + K.rich(x.lesson) + '</p>' +
      '<div class="pactions"><button type="button" class="pact mlaugh" data-laugh aria-pressed="' + !!st.laughs[m.id] + '">😂 <span>' + tr('Haha') + '</span></button>' +
      '<a class="pact" href="' + K.wa(share) + '" target="_blank" rel="noopener" data-memeshare aria-label="Share on WhatsApp">' + ICON.share + '</a>' +
      '<button type="button" class="pact moff" data-memeoff>' + tr('Turn off memes') + '</button></div>' +
      '</div></section>';
  }
  function memeClick(e, sec) {
    var id = sec.getAttribute('data-meme');
    if (e.target.closest('[data-memeskip]')) { var nx = sec.nextElementSibling; if (nx) scrollToCard(nx); return; }
    var lb = e.target.closest('[data-laugh]');
    if (lb) {
      var on = !st.laughs[id]; if (on) st.laughs[id] = 1; else delete st.laughs[id];
      lb.setAttribute('aria-pressed', on); save();
      if (on) { K.track('meme_laugh', { meme: id }); if (!reduce) { lb.classList.remove('pop'); void lb.offsetWidth; lb.classList.add('pop'); } }
      return;
    }
    if (e.target.closest('[data-memeshare]')) { K.track('meme_share', { meme: id }); return; }
    if (e.target.closest('[data-memeoff]')) {
      st.memesOff = true; save(); K.track('meme_toggle', { on: 0 });
      feed.querySelectorAll('.memecard').forEach(function (x) { if (x !== sec) x.remove(); });
      sec.querySelector('.dinner').innerHTML = '<p class="mlesson">' + tr('Memes are off. You can turn them on again in your profile.') + '</p>';
    }
  }

  /* =====================================================================
     Glossary chips (S5): tap a bold tech word for a one-line meaning
     ===================================================================== */
  var GL = {};
  (window.KV_GLOSS || []).forEach(function (g) { [g.key].concat(g.aliases || []).forEach(function (k) { GL[k.toLowerCase()] = g; }); });
  var CLOUD_NAME = { aws: 'AWS', azure: 'Azure', gcp: 'Google Cloud' };
  function gl(html) {
    return html.replace(/<strong>([^<]{2,60})<\/strong>/g, function (m, t) {
      var g = GL[t.replace(/&amp;/g, '&').trim().toLowerCase()];
      return g ? '<strong class="gterm" role="button" tabindex="0" aria-expanded="false" data-g="' + K.esc(g.key) + '">' + t + '</strong>' : m;
    });
  }
  function glossClose(pop) {
    if (!pop) return;
    var owner = pop.previousElementSibling; pop.remove();
    if (owner) owner.querySelectorAll('.gterm[aria-expanded="true"]').forEach(function (x) { x.setAttribute('aria-expanded', 'false'); });
  }
  function glossOpen(el) {
    var g = GL[el.getAttribute('data-g')]; if (!g) return;
    var para = el.closest('p'), open = el.getAttribute('aria-expanded') === 'true';
    feed.querySelectorAll('.gpop').forEach(glossClose);
    if (open) return;
    var cloud = g.cloud ? '<p class="gcloud"><span>' + tr('Same idea in other clouds:') + '</span> ' + ['aws', 'azure', 'gcp'].filter(function (k) { return g.cloud[k]; }).map(function (k) {
      return '<b>' + CLOUD_NAME[k] + '</b>: ' + K.esc(g.cloud[k]); }).join(' · ') + '<small>' + tr('Official names; the features are not always exactly the same.') + '</small></p>' : '';
    para.insertAdjacentHTML('afterend', '<div class="gpop" role="note"><p class="gdef"><strong>' + K.esc(g.term) + '</strong> · ' + K.esc(LANG === 'te' && g.te ? g.te : g.def) + '</p>' +
      (LANG === 'te' && g.te ? '<p class="gen">' + K.esc(g.def) + '</p>' : '') + cloud +
      '<button type="button" class="gclose" data-gclose aria-label="' + tr('Close') + '">✕</button></div>');
    el.setAttribute('aria-expanded', 'true');
    K.track('glossary_open', { term: g.key });
  }
  feed.addEventListener('keydown', function (e) {
    var gt = e.target.closest && e.target.closest('.gterm');
    if (gt && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); glossOpen(gt); }
  });

  /* =====================================================================
     Arcade (S6): swipe games inside game breaks
     ===================================================================== */
  function arcadePool() { return (window.KV_ARCADE || []).filter(function (a) { return a.skills.some(function (s) { return st.tracks.indexOf(s) >= 0; }); }); }
  function arcStart(sec, k) {
    if (gbs[k].game.type === 'tapset') return tapStart(sec, k);
    if (gbs[k].game.type === 'chain') return chainStart(sec, k);
    var g = gbs[k], G = g.game, play = sec.querySelector('.arcplay');
    var half = Math.floor(G.rounds / 2), Ls = K.shuffle(G.items.filter(function (x) { return x.a === 'l'; })), Rs = K.shuffle(G.items.filter(function (x) { return x.a === 'r'; }));
    g.qs = K.shuffle(Ls.slice(0, half).concat(Rs.slice(0, G.rounds - half))); g.i = 0; g.right = 0; g.wrong = []; g.over = false; g.combo = 0;
    var b = sec.querySelector('[data-arcstart]'); if (b) b.hidden = true;
    play.hidden = false; arcItem(sec, k);
    K.track('game_break', { kind: 'arcade', action: 'play', game: G.id });
  }
  function arcText(it) { return LANG === 'te' && it.te ? it.te : it; }
  function arcItem(sec, k) {
    var g = gbs[k], G = g.game, it = g.qs[g.i], gx = LANG === 'te' && G.te ? G.te : G, play = sec.querySelector('.arcplay');
    play.innerHTML = '<p class="gbmeta"><span>' + tr('Question {n} of {m}', { n: g.i + 1, m: g.qs.length }) + '</span><span class="gbtime"></span><span>' + (g.combo > 1 ? '🔥 ×' + g.combo : '') + '</span></p>' +
      '<div class="gbbar" aria-hidden="true"><i style="width:100%"></i></div>' +
      (G.rules ? '<div class="swrules"><strong>📋 ' + tr('Rules') + '</strong><ul>' + (gx.rules || G.rules).map(function (r) { return '<li>' + K.esc(r) + '</li>'; }).join('') + '</ul></div>' : '') +
      '<div class="swstage"><div class="swcard" tabindex="0" aria-live="polite">' + K.esc(arcText(it).t) + '</div></div>' +
      '<div class="swbtns"><button type="button" class="btn swl" data-arcpick="l">◀ ' + K.esc(gx.left) + '</button><button type="button" class="btn swr" data-arcpick="r">' + K.esc(gx.right) + ' ▶</button></div>' +
      '<p class="swhint">' + tr('Swipe the card, or tap a button.') + '</p><p class="gbflash" role="status"></p><button type="button" class="btn primary swnext" data-arcnext hidden>' + tr('Next ↓') + '</button>';
    var card = play.querySelector('.swcard'), x0 = null;
    card.addEventListener('pointerdown', function (e) { x0 = e.clientX; card.setPointerCapture(e.pointerId); card.classList.add('drag'); });
    card.addEventListener('pointermove', function (e) { if (x0 === null) return; var dx = e.clientX - x0; card.style.transform = 'translateX(' + dx + 'px) rotate(' + dx / 20 + 'deg)'; });
    function up(e) { if (x0 === null) return; var dx = e.clientX - x0; x0 = null; card.classList.remove('drag'); card.style.transform = '';
      if (Math.abs(dx) > 60) arcAnswer(sec, k, dx < 0 ? 'l' : 'r'); }
    card.addEventListener('pointerup', up); card.addEventListener('pointercancel', function () { x0 = null; card.style.transform = ''; card.classList.remove('drag'); });
    card.addEventListener('keydown', function (e) { if (e.key === 'ArrowLeft') arcAnswer(sec, k, 'l'); if (e.key === 'ArrowRight') arcAnswer(sec, k, 'r'); });
    g.t0 = Date.now(); g.lock = false;
    if (g.timer) clearInterval(g.timer);
    g.timer = setInterval(function () {
      var left = Math.max(0, G.secs * 1000 - (Date.now() - g.t0)), bar = sec.querySelector('.arcplay .gbbar i'), tl = sec.querySelector('.arcplay .gbtime');
      if (bar) bar.style.width = (left / (G.secs * 1000) * 100) + '%'; if (tl) tl.textContent = Math.ceil(left / 1000) + ' s';
      if (!left) arcAnswer(sec, k, null);
    }, 150);
  }
  function arcAnswer(sec, k, pick) {
    var g = gbs[k], G = g.game; if (g.lock || g.over) return;
    g.lock = true; clearInterval(g.timer); g.timer = null;
    var it = g.qs[g.i], ok = pick === it.a, gx = LANG === 'te' && G.te ? G.te : G, play = sec.querySelector('.arcplay');
    if (ok) { g.right++; g.combo++; } else { g.combo = 0; g.wrong.push(it); }
    var card = play.querySelector('.swcard'); card.classList.add(ok ? 'ok' : 'bad', it.a === 'l' ? 'goL' : 'goR');
    play.querySelectorAll('[data-arcpick]').forEach(function (b) { b.disabled = true; if (b.getAttribute('data-arcpick') === it.a) b.classList.add('right'); });
    play.querySelector('.gbflash').innerHTML = (ok ? '✓ ' + tr('Right!') : (pick ? '✗ ' : '⏰ ') + tr('It is') + ' <strong>' + K.esc(it.a === 'l' ? gx.left : gx.right) + '</strong>.') + ' ' + K.esc(arcText(it).why);
    var nb = play.querySelector('.swnext'); nb.hidden = false; nb.focus({ preventScroll: true });
    g.next = function () { if (g.over || g.nextDone) return; g.nextDone = true; clearTimeout(g.auto); g.i++; if (g.i < g.qs.length) arcItem(sec, k); else arcEnd(sec, k); };
    g.nextDone = false; g.auto = setTimeout(g.next, ok ? 5000 : 8000);
  }
  function arcEnd(sec, k) {
    var g = gbs[k], G = g.game, n = g.qs.length; g.over = true;
    var stars = g.right === n ? 3 : g.right >= n - 2 ? 2 : g.right ? 1 : 0;
    if (!g.counted) { g.counted = true; gstat('arcade').p++; st.cr += g.right; bumpDay(); save(); updatePill(); refreshStats(); renderEnd(); }
    K.track('game_break', { kind: 'arcade', action: 'done', game: G.id, right: g.right });
    sec.querySelector('.arcplay').innerHTML = '<p class="verdict">' + G.icon + ' ' + tr('{n} of {m} right', { n: g.right, m: n }) + ' <span class="earn">+' + g.right + ' 🪙</span></p>' +
      (stars ? '<p>' + K.stars(stars).replace('class="stars"', 'class="stars big"') + '</p>' : '') +
      (g.wrong.length ? '<p class="small">' + tr('Remember:') + '</p><ul class="gbwrong">' + g.wrong.map(function (it) {
        var gx = LANG === 'te' && G.te ? G.te : G;
        return '<li>' + K.esc(arcText(it).t) + ' → <strong>' + K.esc(it.a === 'l' ? gx.left : gx.right) + '</strong></li>'; }).join('') + '</ul>' : '') +
      '<p class="revnote">' + tr('🎮 Game break done · it counts for today') + '</p>' +
      '<div class="mbar"><button type="button" class="btn ghost" data-arcagain>' + tr('Play again') + '</button><button type="button" class="btn primary" data-gbnext>' + tr('Back to learning ↓') + '</button></div>';
  }

  /* tap-set: tap every tile that matches, then Check */
  function tapStart(sec, k) {
    var g = gbs[k], G = g.game, play = sec.querySelector('.arcplay');
    var scenes = G.scenes.filter(function (sc) { return !sc.skill || st.tracks.indexOf(sc.skill) >= 0; });
    g.scene = (scenes.length ? scenes : G.scenes)[Math.floor(Math.random() * (scenes.length || G.scenes.length))];
    g.tiles = K.shuffle(g.scene.tiles); g.over = false;
    var b = sec.querySelector('[data-arcstart]'); if (b) b.hidden = true;
    var gx = LANG === 'te' && G.te ? G.te : G;
    play.hidden = false;
    play.innerHTML = '<p class="gbmeta"><span>' + K.esc(LANG === 'te' && g.scene.te_title ? g.scene.te_title : g.scene.title) + '</span><span class="gbtime"></span></p>' +
      '<div class="gbbar" aria-hidden="true"><i style="width:100%"></i></div>' +
      (g.scene.q ? '<p class="gbq">' + K.rich(LANG === 'te' && g.scene.te_q ? g.scene.te_q : g.scene.q) + '</p>' : '') +
      '<p class="tapask">👆 ' + K.esc(gx.ask) + '</p>' +
      '<div class="tapgrid">' + g.tiles.map(function (t, n) { return '<button type="button" class="tapt" data-tap="' + n + '" aria-pressed="false">' + K.esc(arcText(t).t) + '</button>'; }).join('') + '</div>' +
      '<div class="mbar"><button type="button" class="btn go" data-tapcheck>✓ ' + tr('Check') + '</button></div>';
    g.t0 = Date.now();
    if (g.timer) clearInterval(g.timer);
    g.timer = setInterval(function () {
      var left = Math.max(0, G.secs * 1000 - (Date.now() - g.t0)), bar = sec.querySelector('.arcplay .gbbar i'), tl = sec.querySelector('.arcplay .gbtime');
      if (bar) bar.style.width = (left / (G.secs * 1000) * 100) + '%'; if (tl) tl.textContent = Math.ceil(left / 1000) + ' s';
      if (!left) tapEnd(sec, k, true);
    }, 200);
    K.track('game_break', { kind: 'arcade', action: 'play', game: G.id });
  }
  function tapEnd(sec, k, timeout) {
    var g = gbs[k], G = g.game; if (g.over) return;
    g.over = true; clearInterval(g.timer); g.timer = null;
    var play = sec.querySelector('.arcplay'), right = 0, n = g.tiles.length;
    play.querySelectorAll('[data-tap]').forEach(function (b) {
      var t = g.tiles[+b.getAttribute('data-tap')], on = b.getAttribute('aria-pressed') === 'true', ok = on === t.on;
      if (ok) right++;
      b.disabled = true; b.classList.add(ok ? 'right' : 'wrong', t.on ? 'yes' : 'no');
      b.insertAdjacentHTML('beforeend', '<span class="tapwhy">' + (ok ? '✓ ' : '✗ ') + K.esc(arcText(t).why) + '</span>');
    });
    var gain = Math.round(right / 2), stars = right === n ? 3 : right >= n - 2 ? 2 : right ? 1 : 0;
    if (!g.counted) { g.counted = true; gstat('arcade').p++; st.cr += gain; bumpDay(); save(); updatePill(); refreshStats(); renderEnd(); }
    K.track('game_break', { kind: 'arcade', action: 'done', game: G.id, right: right });
    play.querySelector('.mbar').outerHTML = '<p class="verdict">' + (timeout ? tr('⏰ Time up!') + ' ' : '') + G.icon + ' ' + tr('{n} of {m} right', { n: right, m: n }) + (gain ? ' <span class="earn">+' + gain + ' 🪙</span>' : '') + '</p>' +
      (stars ? '<p>' + K.stars(stars).replace('class="stars"', 'class="stars big"') + '</p>' : '') +
      '<p class="small">' + K.esc((LANG === 'te' && G.te && G.te.legend) || G.legend || '') + '</p>' +
      '<p class="revnote">' + tr('🎮 Game break done · it counts for today') + '</p>' +
      '<div class="mbar"><button type="button" class="btn ghost" data-arcagain>' + tr('Play again') + '</button><button type="button" class="btn primary" data-gbnext>' + tr('Back to learning ↓') + '</button></div>';
  }

  /* chain: a short story; pick the right check at each step */
  function chainStart(sec, k) {
    var g = gbs[k], G = g.game;
    var cs = G.cases.filter(function (c) { return !c.skill || st.tracks.indexOf(c.skill) >= 0; }); if (!cs.length) cs = G.cases;
    g.case = cs[Math.floor(Math.random() * cs.length)]; g.step = 0; g.miss = 0; g.clues = []; g.over = false;
    var b = sec.querySelector('[data-arcstart]'); if (b) b.hidden = true;
    sec.querySelector('.arcplay').hidden = false;
    chainRender(sec, k);
    K.track('game_break', { kind: 'arcade', action: 'play', game: G.id });
  }
  function stepText(stp) { var t = LANG === 'te' && stp.te ? stp.te : {}; return { q: t.q || stp.q, a: t.a || stp.a, w: t.w || stp.w, clue: t.clue || stp.clue }; }
  function chainRender(sec, k) {
    var g = gbs[k], c = g.case, stp = stepText(c.steps[g.step]), play = sec.querySelector('.arcplay');
    var opts = K.shuffle([{ t: stp.a, ok: 1 }].concat(stp.w.map(function (w) { return { t: w, ok: 0 }; })));
    g.opts = opts;
    play.innerHTML = '<p class="gbmeta"><span>🕵️ ' + K.esc(LANG === 'te' && c.te_title ? c.te_title : c.title) + '</span><span>' + tr('Step {n} of {m}', { n: g.step + 1, m: c.steps.length }) + '</span></p>' +
      (g.clues.length ? '<ul class="clues">' + g.clues.map(function (cl) { return '<li>🔎 ' + K.rich(cl) + '</li>'; }).join('') + '</ul>' : '') +
      '<p class="gbq">' + K.rich(stp.q) + '</p><div class="choices">' + opts.map(function (o, n) {
        return '<button type="button" class="choice" data-chain="' + n + '"><span class="key" aria-hidden="true">' + 'ABC'.charAt(n) + '</span><span class="ctext">' + K.rich(o.t) + '</span></button>'; }).join('') + '</div>' +
      '<p class="gbflash" role="status"></p>';
  }
  function chainPick(sec, k, btn) {
    var g = gbs[k], G = g.game, c = g.case; if (g.over) return;
    var o = g.opts[+btn.getAttribute('data-chain')], play = sec.querySelector('.arcplay');
    if (!o.ok) { g.miss++; btn.disabled = true; btn.classList.add('wrong'); play.querySelector('.gbflash').textContent = '✗ ' + tr('Not that one. Think: what must be true first?'); return; }
    btn.classList.add('right'); play.querySelectorAll('[data-chain]').forEach(function (b) { b.disabled = true; });
    g.clues.push(stepText(c.steps[g.step]).clue);
    setTimeout(function () {
      if (g.over) return;
      g.step++;
      if (g.step < c.steps.length) return chainRender(sec, k);
      g.over = true;
      var gain = Math.max(1, 3 - g.miss), stars = g.miss === 0 ? 3 : g.miss <= 2 ? 2 : 1;
      if (!g.counted) { g.counted = true; gstat('arcade').p++; st.cr += gain; bumpDay(); save(); updatePill(); refreshStats(); renderEnd(); }
      K.track('game_break', { kind: 'arcade', action: 'done', game: G.id, miss: g.miss });
      play.innerHTML = '<p class="verdict">🕵️ ' + tr('Case solved!') + ' <span class="earn">+' + gain + ' 🪙</span></p><p>' + K.stars(stars).replace('class="stars"', 'class="stars big"') + '</p>' +
        '<ul class="clues">' + g.clues.map(function (cl) { return '<li>🔎 ' + K.rich(cl) + '</li>'; }).join('') + '</ul>' +
        '<p class="small">' + tr('Real servers fail in this order too: installed? running? firewall? permissions?') + '</p>' +
        '<p class="revnote">' + tr('🎮 Game break done · it counts for today') + '</p>' +
        '<div class="mbar"><button type="button" class="btn ghost" data-arcagain>' + tr('Play again') + '</button><button type="button" class="btn primary" data-gbnext>' + tr('Back to learning ↓') + '</button></div>';
    }, reduce ? 300 : 900);
  }

  /* =====================================================================
     Clean-up checklist after a cloud unit (S9): stop paying for practice resources
     ===================================================================== */
  st.cleaned = st.cleaned || {};
  var CLEAN = {
    aws: ['Terminate EC2 instances you started for practice', 'Delete unused EBS volumes and snapshots, release Elastic IPs, and delete S3 data you do not need', 'Open Billing and Cost Management and check your budget'],
    gcp: ['Delete the VMs and disks you made for practice', 'Delete buckets and BigQuery data you do not need, and release unused static IP addresses', 'Open Billing reports and check your budget'],
    az: ['Delete the practice VMs, or stop them so they show Stopped (deallocated)', 'Delete the practice resource groups you do not need', 'Open Cost Management and check your budget']
  };
  function cleanupBox(u) {
    var list = CLEAN[u.track.id]; if (!list) return '';
    var done = !!st.cleaned[u.id];
    return '<div class="cleanbox" data-unit="' + K.esc(u.id) + '"><p class="cleanh">🧹 ' + tr('Did a hands-on lab? Clean up so you do not pay (only delete things you created for practice):') + '</p>' +
      list.map(function (t, n) { return '<label class="cleanrow"><input type="checkbox" data-clean' + (done ? ' checked disabled' : '') + '> <span>' + K.esc(tr(t)) + '</span></label>'; }).join('') +
      '<p class="cleanmsg" role="status">' + (done ? tr('🧹 Clean-up done!') : '') + '</p></div>';
  }

  /* ---------- end card */
  function renderEnd() {
    var el = document.getElementById('endin'); if (!el) return;
    var n = todayCount(), s = streakNow(), more = qi < queue.length;
    var share = 'I am learning ' + st.tracks.map(function (id) { return TR[id].name; }).join(', ') + ' step by step on Kramavriddhi Learn' + (s > 1 ? ' (' + s + '-day streak 🔥)' : '') + '. Free, in a scrolling feed: ' + URL;
    el.innerHTML =
      '<p class="kicker">' + tr('Today · {n} of {m} cards', { n: Math.min(n, GOAL), m: GOAL }) + '</p>' +
      (n >= GOAL
        ? '<h2>' + tr('Daily goal done!') + ' 🔥 ' + s + '</h2><p>' + (s > 1 ? tr('{n} days in a row.', { n: s }) + ' ' : '') + tr('Come back tomorrow to keep your streak.') + (st.best > s ? ' ' + tr('Your best: {n}.', { n: st.best }) : '') + ' ' + tr('You can also keep going now.') + '</p>'
        : '<h2>' + tr('{n} more to reach today’s goal', { n: GOAL - n }) + '</h2><p>' + tr('Finish {n} cards a day to grow your streak.', { n: GOAL }) + (s ? ' (🔥 ' + s + ')' : '') + '</p>') +
      (more ? '<button type="button" class="btn go" data-more>' + tr('Load the next units ↓') + '</button>'
            : '<p class="alldone">' + tr('🎉 You have finished every ready unit in your skills. New units arrive in every update, or <a href="?pick=1" data-pick>add another skill</a>.') + '</p>') +
      '<div class="share"><span class="share-label">' + tr('Share:') + '</span><a class="share-btn wa" href="' + K.wa(share) + '" target="_blank" rel="noopener">WhatsApp</a></div>' +
      (reviewsOn(today + 1) ? '<p class="revline">🔁 ' + tr(reviewsOn(today + 1) > 1 ? '{n} cards to review tomorrow.' : '1 card to review tomorrow.', { n: reviewsOn(today + 1) }) + '</p>' : '') +
      savedList() + revealedList() +
      '<h3>' + tr('Keep learning') + '</h3><div class="more"><a href="/learn/python/">' + tr('Python games') + '</a><a href="/learn/devops/">' + tr('Cloud &amp; DevOps games') + '</a><a href="/courses/azure-data-engineering/">' + tr('Azure Data Engineering course') + '</a><a href="https://nagendrababuedru.github.io/DevOps/" target="_blank" rel="noopener">DevOps Academy ↗</a></div>';
  }

  function savedList() {
    var ids = Object.keys(st.saved).filter(function (id) { return CARD[id]; });
    if (!ids.length) return '';
    return '<h3>🔖 ' + tr('Saved for later') + ' (' + ids.length + ')</h3><ul class="savedlist">' + ids.slice(0, 20).map(function (id) {
      var c = CARD[id], title = c.t === 'learn' ? c.title : (c.t === 'output' || (c.t === 'check' && c.code && !c.q)) ? tr('What does this print?') + ' ' + c.code.split('\n')[0] : c.q.replace(/`|\*\*/g, '');
      return '<li class="t-' + tkey(c.topic) + '"><a href="#card=' + id + '"><span class="pav" aria-hidden="true">' + K.esc(topicOf(c).ab) + '</span><span>' + K.esc(c.unit.track.name) + ' · ' + K.esc(title.length > 70 ? title.slice(0, 68) + '…' : title) + '</span></a></li>';
    }).join('') + '</ul>';
  }

  /* ---------- top bar: today's goal as story segments */
  function updatePill() {
    var n = todayCount(), segs = '';
    for (var i = 0; i < GOAL; i++) segs += '<i class="' + (i < n ? 'ok' : '') + '"></i>';
    pill.innerHTML = '<span class="ibrand">kramavriddhi.learn</span><span class="iright"><span class="istreak" role="status" aria-label="' + Math.min(n, GOAL) + ' of ' + GOAL + ' cards done today, streak ' + streakNow() + ' days">' + Math.min(n, GOAL) + '/' + GOAL + ' · 🔥 ' + streakNow() + '</span><span class="icr" title="' + K.esc(tr('Credits')) + '">🪙 ' + st.cr + '</span>' +
      '<button type="button" class="ibtn" data-reels aria-pressed="' + !!st.reels + '" aria-label="' + tr(st.reels ? 'Exit reels' : 'Reels mode') + '">' + (st.reels ? '✕' : ICON.reels) + '</button>' +
      '<a class="ibtn" href="?profile=1" data-profile aria-label="' + tr('My profile') + '">' + ICON.user + '</a></span><span class="isegs" aria-hidden="true">' + segs + '</span>';
  }
  pill.addEventListener('click', function (e) {
    if (e.target.closest('[data-reels]')) { setReels(!st.reels); return; }
    if (e.target.closest('[data-profile]')) { e.preventDefault(); openProfile(); }
  });

  /* =====================================================================
     Reels mode: one card fills the screen, swipe up for the next (Phase 9a)
     ===================================================================== */
  function applyReels() { document.documentElement.classList.toggle('reels-mode', !!st.reels); }
  function setReels(on) {
    var cur = null, best = 1e9;
    feed.querySelectorAll('.dcard').forEach(function (d) { var t = Math.abs(d.getBoundingClientRect().top); if (t < best) { best = t; cur = d; } });
    st.reels = !!on; save(); applyReels(); updatePill();
    K.track('reels_mode', { on: on ? 1 : 0 });
    var b = feed.querySelector('.intro [data-reels]'); if (b) b.textContent = on ? '✕ ' + tr('Exit reels') : '▶ ' + tr('Reels mode');
    if (cur) setTimeout(function () { cur.scrollIntoView({ block: 'start' }); }, 30);
  }

  /* =====================================================================
     My notes on each card (saved on this phone) + Ask a doubt (WhatsApp)
     ===================================================================== */
  function noteBox(c, j) {
    var n = st.notes[c.id];
    return '<div class="pnotebox" id="nb-' + j + '" hidden><label class="nlabel" for="nt-' + j + '">📝 ' + tr('My notes and doubts') + '</label>' +
      '<textarea id="nt-' + j + '" rows="3" maxlength="600" placeholder="' + K.esc(tr('Write what you learned, or your doubt…')) + '">' + K.esc(n ? n.t : '') + '</textarea>' +
      '<div class="nbtns"><button type="button" class="btn go" data-notesave>' + tr('Save note') + '</button>' +
      '<a class="btn ghost" data-ask href="#" target="_blank" rel="noopener">💬 ' + tr('Ask a doubt') + '</a><span class="nmsg" role="status"></span></div>' +
      '<p class="nhelp">' + tr('Notes are saved only on this phone. “Ask a doubt” opens WhatsApp so you can ask a friend, teacher or group. Public comments are coming later.') + '</p></div>';
  }
  function saveNote(sec, c, quiet) {
    var ta = sec.querySelector('.pnotebox textarea'), v = ta.value.trim().slice(0, 600);
    if (v) st.notes[c.id] = { t: v, d: today }; else delete st.notes[c.id];
    save();
    sec.querySelector('[data-note]').setAttribute('aria-pressed', !!v);
    if (!quiet) { sec.querySelector('.nmsg').textContent = v ? tr('Saved ✓') : tr('Note removed'); K.track('note_save', { topic: c.topic }); }
  }
  function askText(c, note) {
    var what = c.t === 'learn' ? c.title : c.q || tr('What does this print?') + '\n' + (c.code || '');
    return tr('I have a doubt in this {s} question:', { s: c.unit.track.name }) + '\n' + String(what).replace(/`|\*\*/g, '') +
      (note && note.trim() ? '\n\n' + tr('My doubt:') + ' ' + note.trim() : '') + '\n\n' + URL + (LANG === 'te' ? '?lang=te' : '') + '#card=' + c.id;
  }

  /* =====================================================================
     Profile page (on this phone): stats, calendar, skills, badges, notes
     ===================================================================== */
  function avatar() {
    var nm = (st.name || '').trim();
    if (!nm) return ICON.logo;
    var parts = nm.split(/\s+/), ini = (parts[0].charAt(0) + (parts.length > 1 ? parts[parts.length - 1].charAt(0) : '')).toUpperCase();
    return '<span class="pfini">' + K.esc(ini) + '</span>';
  }
  function totals() {
    var cards = Object.keys(st.done).filter(function (id) { return CARD[id] && !st.done[id].skip; }).length, units = 0, games = 0, basic = 0;
    T.tracks.forEach(function (t) {
      units += liveUnits(t).filter(unitDone).length;
      var b = t.units.filter(function (u) { return u.level === 'b' && live(u); });
      if (b.length && b.every(unitDone)) basic++;
    });
    Object.keys(st.gb || {}).forEach(function (k) { games += st.gb[k].p || 0; });
    return { cards: cards, units: units, games: games, basic: basic, days: Object.keys(st.days).filter(function (d) { return st.days[d] > 0; }).length, notes: Object.keys(st.notes).length };
  }
  var BADGES = [
    ['🌱', 'First step', 'Answer your first card', function (x) { return x.cards >= 1; }],
    ['📘', 'First unit', 'Finish a whole unit', function (x) { return x.units >= 1; }],
    ['🔥', '3-day streak', 'Meet the daily goal 3 days in a row', function () { return (st.best || 0) >= 3; }],
    ['⚡', '7-day streak', 'Meet the daily goal 7 days in a row', function () { return (st.best || 0) >= 7; }],
    ['🏆', '30-day streak', 'Meet the daily goal 30 days in a row', function () { return (st.best || 0) >= 30; }],
    ['🎯', '50 cards', 'Answer 50 cards', function (x) { return x.cards >= 50; }],
    ['💯', '200 cards', 'Answer 200 cards', function (x) { return x.cards >= 200; }],
    ['🎓', 'Basic complete', 'Finish every Basic unit of a skill', function (x) { return x.basic >= 1; }],
    ['🏅', 'Memory master', 'Master 10 cards in review', function () { return (st.mastered || 0) >= 10; }],
    ['🎮', 'Game lover', 'Play 10 game breaks', function (x) { return x.games >= 10; }],
    ['📝', 'Note taker', 'Write 5 notes', function (x) { return x.notes >= 5; }],
    ['🧹', 'Cloud cleaner', 'Finish 3 clean-up checklists after cloud units', function () { return Object.keys(st.cleaned || {}).length >= 3; }]
  ];
  function calendarHtml() {
    var start = today - 77 - ((today + 4) % 7), cells = '';       /* 12 weeks, columns start on Sunday */
    for (var d = start; d < start + 84; d++) {
      var n = st.days[d] || 0, lv = d > today ? 'f' : n >= GOAL ? 4 : n >= 4 ? 3 : n >= 2 ? 2 : n ? 1 : 0;
      var dt = new Date(d * DAY_MS);
      cells += '<i class="c' + lv + '" title="' + dt.getUTCDate() + '/' + (dt.getUTCMonth() + 1) + ': ' + n + '"></i>';
    }
    return '<div class="pcal" role="img" aria-label="' + K.esc(tr('Cards done each day, last 12 weeks')) + '">' + cells + '</div>' +
      '<p class="pcal-key"><span>' + tr('Less') + '</span><i class="c0"></i><i class="c1"></i><i class="c2"></i><i class="c3"></i><i class="c4"></i><span>' + tr('More') + '</span></p>';
  }
  function skillRing(t) {
    return '<li class="t-' + tkey(t.topic) + '"><span class="pav" aria-hidden="true">' + K.esc((TOPIC[tkey(t.topic)] || TOPIC.devops).ab) + '</span><div class="pfsk"><strong>' + K.esc(t.name) + '</strong>' +
      ['b', 'i', 'a'].map(function (lv) {
        var us = t.units.filter(function (u) { return u.level === lv && live(u); }), dn = us.filter(unitDone).length, pct = us.length ? Math.round(dn / us.length * 100) : 0;
        return '<span class="pflv"><em>' + LEVEL[lv] + '</em><span class="bar" role="img" aria-label="' + dn + ' / ' + us.length + '"><i style="width:' + pct + '%"></i></span><b>' + (us.length ? dn + '/' + us.length : '–') + '</b></span>';
      }).join('') + '</div></li>';
  }
  function openProfile() {
    history.replaceState(null, '', location.pathname + '?profile=1');
    renderProfile(); window.scrollTo(0, 0);
    K.track('profile_open', {});
  }
  function renderProfile() {
    gbs.forEach(function (g) { if (g.timer) clearInterval(g.timer); });
    document.documentElement.classList.remove('snap-feed', 'reels-mode');
    pill.hidden = true;
    var x = totals(), s = streakNow(), mine = T.tracks.filter(function (t) { return st.tracks.indexOf(t.id) >= 0 || t.units.some(function (u) { return u.cards.some(isDone); }); });
    var first = Object.keys(st.days).map(Number).filter(function (d) { return st.days[d] > 0; }).sort()[0];
    var since = first ? new Date(first * DAY_MS) : null;
    var earned = BADGES.filter(function (b) { return b[3](x); }).length;
    var share = tr('I have done {n} cards on Kramavriddhi Learn', { n: x.cards }) + (st.best > 1 ? ' (🔥 ' + st.best + ')' : '') + ': ' + mine.map(function (t) { return t.name; }).join(', ') + '. ' + URL;
    var notes = Object.keys(st.notes).filter(function (id) { return CARD[id]; });
    feed.innerHTML = '<section class="dcard profilepage" aria-label="' + K.esc(tr('My profile')) + '"><div class="dinner post profile">' +
      '<p class="pfback"><a href="' + location.pathname + '" data-back>← ' + tr('Back to my feed') + '</a></p>' +
      '<div class="prow"><span class="pav big" id="pf-av">' + avatar() + '</span><div class="pfname"><label for="pf-name">' + tr('Your name') + '</label>' +
      '<input id="pf-name" data-name type="text" maxlength="40" autocomplete="name" value="' + K.esc(st.name || '') + '" placeholder="' + K.esc(tr('Type your name')) + '">' +
      '<p class="pfsince">' + (since ? tr('Learning since {d}', { d: since.getUTCDate() + '/' + (since.getUTCMonth() + 1) + '/' + since.getUTCFullYear() }) : tr('Start your first card today!')) + '</p></div></div>' +
      '<div class="pfstats">' + [[s ? '🔥' + s : '0', tr('streak')], [st.best || 0, tr('best streak')], [x.cards, tr('cards done')], [x.units, tr('units done')], ['🪙 ' + st.cr, tr('credits')], [x.days, tr('days active')]]
        .map(function (v) { return '<div><strong>' + v[0] + '</strong><span>' + v[1] + '</span></div>'; }).join('') + '</div>' +
      '<div class="crbox"><h2 class="pfh">🪙 ' + tr('Credits') + ': ' + st.cr + '</h2><p><strong>' + tr('Earn:') + '</strong> ' + tr('+1 right answer · +2 checkpoint · +3 unit complete · +5 daily goal · +1 each right answer in a speed round') + '</p>' +
        '<p><strong>' + tr('Use:') + '</strong> ' + tr('💡 50/50 removes 2 wrong answers (1 🪙) · 🔓 Show solution (3 🪙). Opened solutions are saved below and come back for review.') + '</p></div>' +
      '<h2 class="pfh">' + tr('My learning days') + '</h2>' + calendarHtml() +
      '<h2 class="pfh">' + tr('My skills') + '</h2>' + (mine.length ? '<ul class="pfskills">' + mine.map(skillRing).join('') + '</ul>' : '<p>' + tr('No skills yet.') + '</p>') +
      '<h2 class="pfh">' + tr('Badges') + ' <span class="muted">' + earned + '/' + BADGES.length + '</span></h2><ul class="pfbadges">' + BADGES.map(function (b) {
        var on = b[3](x);
        return '<li class="' + (on ? 'on' : 'off') + '"><span class="bic" aria-hidden="true">' + b[0] + '</span><strong>' + tr(b[1]) + '</strong><span>' + (on ? tr('Earned') : tr(b[2])) + '</span></li>';
      }).join('') + '</ul>' +
      '<h2 class="pfh">📝 ' + tr('My notes') + ' (' + notes.length + ')</h2>' + (notes.length ? '<ul class="savedlist pfnotes">' + notes.slice(0, 30).map(function (id) {
        var c = CARD[id], n = st.notes[id].t;
        return '<li class="t-' + tkey(c.topic) + '"><a href="#card=' + id + '"><span class="pav" aria-hidden="true">' + K.esc(topicOf(c).ab) + '</span><span><strong>' + K.esc(c.unit.track.name) + ' · ' + K.esc(c.unit.title) + '</strong><br>' + K.esc(n.length > 90 ? n.slice(0, 88) + '…' : n) + '</span></a></li>';
      }).join('') + '</ul>' : '<p class="muted">' + tr('Tap 💬 on any card to write a note or a doubt.') + '</p>') +
      revealedList() + savedList() +
      '<div class="introbtns"><a class="btn go" href="' + location.pathname + '" data-back>' + tr('Back to my feed') + ' ↓</a><a class="btn ghost" href="?pick=1" data-pick>' + tr('Change skills') + '</a></div>' +
      '<div class="share"><span class="share-label">' + tr('Share:') + '</span><a class="share-btn wa" href="' + K.wa(share) + '" target="_blank" rel="noopener">WhatsApp</a></div>' +
      '<p class="memerow">😂 ' + tr('Memes in my feed') + ' <button type="button" class="btn ghost" data-memetoggle aria-pressed="' + !st.memesOff + '">' + tr(st.memesOff ? 'Off' : 'On') + '</button></p>' +
      langSwitch() + '<p class="nhelp">' + tr('Your profile is saved only on this phone. A public profile with login is planned for later.') + '</p>' +
      '</div></section>';
  }

  window.addEventListener('hashchange', function () { if (/card=/.test(location.hash) && st.tracks.length) renderFeed(); });

  if (!st.tracks.length || /[?&]pick=1/.test(location.search)) renderPicker();
  else if (/[?&]profile=1/.test(location.search)) renderProfile();
  else renderFeed();
}
/* load Telugu text first when the learner picked Telugu (Phase 8) */
(function () {
  var lang = /[?&]lang=(te|en)\b/.exec(location.search), st = window.KVLearn.load('kv-learn-feed', null);
  if (lang) { st = st || {}; st.lang = lang[1]; window.KVLearn.save('kv-learn-feed', st); }
  if (st && st.lang === 'te' && !window.KV_TE) {
    var sc = document.createElement('script'); sc.src = '/learn/daily/te.js?v=15';
    sc.onload = sc.onerror = kvLearnMain; document.head.appendChild(sc);
  } else kvLearnMain();
})();
