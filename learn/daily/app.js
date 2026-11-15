/* Kramavriddhi Learn feed (Phase 1): pick skills, then learn them unit by unit
   (Basic -> Intermediate -> Advanced) in an Instagram-style feed with a daily goal and streak.
   Content: learn/daily/tracks.js. Plan and status: learn/_TRACKER.md */
(function () {
  'use strict';
  var K = window.KVLearn, T = window.KV_TRACKS;
  var STORE = 'kv-learn-feed', OLD_STORE = 'kv-learn-daily';
  var URL = 'https://kramavriddhi.com/learn/daily/';
  var DAY_MS = 86400000, GOAL = T.goal || 6;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var LEVEL = { b: 'Basic', i: 'Intermediate', a: 'Advanced' };

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
    st = { tracks: [], done: {}, likes: {}, saved: {}, streak: { n: 0, last: 0 }, best: 0, days: {} };
    var old = K.load(OLD_STORE, null);          /* keep the streak from the day-based feed (Day 1 = 12 Nov 2026) */
    if (old && old.streak && old.streak.last) {
      st.streak = { n: old.streak.n || 0, last: Date.UTC(2026, 10, 12) / DAY_MS + old.streak.last - 1 };
      st.best = old.best || 0;
    }
  }
  ['done', 'likes', 'saved', 'days', 'review'].forEach(function (k) { st[k] = st[k] || {}; });
  st.tracks = (st.tracks || []).filter(function (id) { return TR[id]; });
  st.mastered = st.mastered || 0;

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
    if (!ok) { st.review[id] = { due: today + GAPS[0], step: 0 }; return '<p class="revnote">🔁 It will come back tomorrow. Read the explanation once more.</p>'; }
    if (r.step + 1 >= GAPS.length) { delete st.review[id]; st.mastered++; return '<p class="revnote">🏅 Mastered! You got it right 3 reviews in a row, so it will not come back.</p>'; }
    st.review[id] = { due: today + GAPS[r.step + 1], step: r.step + 1 };
    return '<p class="revnote">🔁 Well remembered. Next review in ' + GAPS[r.step + 1] + ' days.</p>';
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
  var TYPE = { learn: 'Learn', output: 'What does it print?', choice: 'Pick the right answer', order: 'Tap in the right order', bug: 'Find the line with the bug',
    pipe: 'Mini game · Build the pipeline', indent: 'Mini game · Fix the indentation', check: 'Checkpoint' };
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
    devops: { ab: 'Ops', own: ACADEMY, docs: { href: 'https://learn.microsoft.com/en-us/devops/what-is-devops', label: 'Microsoft Learn: what is DevOps?', ext: 1 } }
  };
  function tkey(topic) { return String(topic).toLowerCase(); }
  function topicOf(c) { return TOPIC[tkey(c.topic)] || TOPIC.devops; }
  function learnLinks(c) {
    var t = topicOf(c), out = [];
    if (c.t === 'pipe' && c.topic !== 'DevOps' && c.topic !== 'Docker') out.push({ href: '/learn/devops/azure-data-pipeline/', label: 'Play the full game: Build the Data Pipeline' });
    if (c.t === 'indent') out.push(c.step === 2 ? { href: '/learn/devops/ansible-fix-the-playbook/', label: 'Play the full game: Fix the Playbook' } : { href: '/learn/python/fix-the-code/', label: 'Play the full game: Fix the Code' });
    out.push(t.own);
    if (c.topic === 'Ansible' && c.t !== 'indent') out.push({ href: '/learn/devops/ansible-fix-the-playbook/', label: 'Play Fix the Playbook (Ansible game)' });
    out.push(t.docs);
    return out;
  }
  var ICON = {
    heart: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.5s-7.5-4.6-9.3-9.2C1.4 7.9 3.6 4.5 7 4.5c2 0 3.6 1.1 5 3 1.4-1.9 3-3 5-3 3.4 0 5.6 3.4 4.3 6.8-1.8 4.6-9.3 9.2-9.3 9.2z"/></svg>',
    share: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21.5 3 10 14.5M21.5 3l-7 18-4.5-6.5L3 10z"/></svg>',
    save: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3.5h12v17l-6-4.5-6 4.5z"/></svg>',
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
  function hlLine(l, lang) { return lang === 'yaml' ? hlYaml(l) : lang === 'python' || !lang ? hlPy(l) : K.esc(l).replace(/(#.*)$/, '<span class="d">$1</span>'); }
  var FILE = { python: 'main.py', yaml: 'site.yml', ini: 'inventory.ini', sql: 'query.sql', shell: 'terminal', docker: 'Dockerfile' };
  function codeBlock(lines, asButtons, lang) {
    return '<div class="editor dcode">' + (lang && lang !== 'python' ? '<div class="ed-bar"><span class="file">' + FILE[lang] + '</span></div>' : '') + (asButtons
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
      '<div class="prow"><span class="pav big">' + ICON.logo + '</span><div><h1>What do you want to learn?</h1>' +
      '<p class="pbio">Pick one or more skills. Your feed teaches them step by step: <strong>Basic → Intermediate → Advanced</strong>. You can change this any time.</p></div></div>' +
      '<div class="skills" role="group" aria-label="Skills">' + T.tracks.map(function (t) {
        var lu = liveUnits(t).length, on = chosen.indexOf(t.id) >= 0;
        return '<button type="button" class="skill t-' + tkey(t.topic) + '" data-track="' + t.id + '" aria-pressed="' + on + '">' +
          '<span class="pav" aria-hidden="true">' + K.esc((TOPIC[tkey(t.topic)] || TOPIC.devops).ab) + '</span>' +
          '<span class="sk-txt"><strong>' + K.esc(t.name) + '</strong><span>' + K.esc(t.blurb) + '</span><em>' + lu + ' of ' + t.units.length + ' units ready</em></span>' +
          '<span class="sk-tick" aria-hidden="true"></span></button>';
      }).join('') + '</div>' +
      '<p class="pick-note">New units are added in every update. Skills with more units ready are best to start with.</p>' +
      '<button type="button" class="btn go" id="pick-go"' + (chosen.length ? '' : ' disabled') + '>' + (chosen.length ? 'Start learning (' + chosen.length + ') ↓' : 'Pick at least one skill') + '</button>' +
      '</div></section>';
    var go = document.getElementById('pick-go');
    feed.querySelector('.skills').addEventListener('click', function (e) {
      var b = e.target.closest('.skill'); if (!b) return;
      var id = b.getAttribute('data-track'), i = chosen.indexOf(id);
      if (i >= 0) chosen.splice(i, 1); else chosen.push(id);
      b.setAttribute('aria-pressed', i < 0);
      go.disabled = !chosen.length;
      go.textContent = chosen.length ? 'Start learning (' + chosen.length + ') ↓' : 'Pick at least one skill';
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
  var gbs = [], sinceBreak = 0;

  function buildQueue() {
    var lists = st.tracks.map(function (id) { return TR[id].units.filter(function (u) { return live(u) && !unitDone(u); }); });
    var q = [], more = true, k = 0;
    while (more) { more = false; lists.forEach(function (l) { if (l[k]) { q.push(l[k]); more = true; } }); k++; }
    return q;
  }

  function renderFeed(scroll) {
    pill.hidden = false;
    feedCards = []; feedModes = []; reviewNote = {}; tries = {};
    gbs.forEach(function (g) { if (g.timer) clearInterval(g.timer); }); gbs = []; sinceBreak = 0;
    queue = buildQueue(); qi = 0;
    var html = intro();
    var hm = /card=([\w.]+)/.exec(location.hash), shared = hm && CARD[hm[1]];
    if (shared) html += '<section class="dcard sharedhead" aria-label="Shared card"><p class="kicker">Shared with you · ' + K.esc(shared.unit.track.name) + ' · ' + K.esc(shared.unit.title) + '</p></section>' + cardHtml(shared);
    var due = dueReviews();
    if (due.length) {
      html += '<section class="dcard reviewhead" aria-label="Review time"><div class="dinner post">' +
        '<p class="kicker">🔁 Review time</p><h2 class="uh-title">' + due.length + ' card' + (due.length > 1 ? 's' : '') + ' to review</h2>' +
        '<p class="uh-sub">You missed ' + (due.length > 1 ? 'these' : 'this') + ' before. Get a card right 3 reviews in a row (after 1, 3 and 7 days) and it is mastered for good.</p>' +
        '</div></section>' + due.map(function (c) { return cardHtml(c, 'review'); }).join('');
    }
    html += nextBlocks() + '<section class="dcard end" id="c-end" aria-label="Today"><div class="dinner" id="endin"></div></section>';
    feed.innerHTML = html;
    restoreAll();
    document.documentElement.classList.add('snap-feed');
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
        if (++sinceBreak >= (todayCount() >= GOAL ? 4 : 6)) { var b = gameBreakHtml(); if (b) { h += b; sinceBreak = 0; } }
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
  var GB_KIND = { speed: '⚡ Speed round', puzzle: '🧩 Puzzle', full: '🕹️ Full game' };
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
      body = '<h2 class="dq">3 quick questions, 30 seconds</h2><p class="gbsub">From your skills: ' + K.esc(names) + '. Keep a combo going for bonus fire.</p>' +
        '<button type="button" class="btn go" data-gbstart>Start ⚡</button><div class="gbplay" hidden></div>';
    } else if (kind === 'puzzle') {
      var ps = puzzlePool(); g.card = ps[Math.floor(Math.random() * ps.length)];
      body = '<p class="gbsub">A quick puzzle from ' + K.esc(g.card.unit.track.name) + '. Solve it below, or skip.</p>';
      after = cardHtml(g.card, 'play');
    } else {
      var fs = fullPool(); g.game = fs[Math.floor(Math.random() * fs.length)];
      var pr = K.load(g.game.key, null), stars = pr && pr.stars ? pr.stars.reduce(function (a, b) { return a + (b || 0); }, 0) : 0;
      body = '<h2 class="dq">' + K.esc(g.game.name) + '</h2><p class="gbsub">' + K.esc(g.game.blurb) + '</p>' +
        '<p class="gbsub">' + (stars ? K.stars(1, 1) + ' Your stars: ' + stars + ' of 15. Go for more!' : '5 levels, up to 15 stars.') + '</p>' +
        '<a class="btn go" href="' + g.game.href + '?from=feed" data-gbopen>Play now</a>';
    }
    return '<section class="dcard gamebreak" id="gb-' + k + '" data-gb="' + k + '" aria-label="Game break: ' + GB_KIND[kind] + '"><div class="dinner post">' +
      '<div class="gbhead"><span class="gbbadge">🎮 Game break</span><span class="gbkind">' + GB_KIND[kind] + '</span>' +
      '<button type="button" class="gbskip" data-gbskip>Skip ↓</button></div>' + body + '</div></section>' + after;
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
      gbScrollPast(sec, k); return;
    }
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
      '<p class="gbmeta"><span>Question ' + (g.i + 1) + ' of ' + g.qs.length + '</span><span class="gbtime"></span><span>' + (g.combo > 1 ? '🔥 combo ×' + g.combo : '') + '</span></p>' +
      (codeQ ? '<p class="gbq">What does it print?</p>' + codeBlock(c.code.split('\n')) : '<p class="gbq">' + K.rich(c.q) + '</p>' + (c.code ? codeBlock(c.code.split('\n')) : '')) +
      choiceList(c) + '<p class="gbflash" role="status" aria-live="polite"></p>';
  }

  function speedAnswer(sec, k, opt) {
    var g = gbs[k]; if (g.over) return;
    var c = g.qs[g.i], ok = opt === c.a, play = sec.querySelector('.gbplay');
    markChoices(play, c, opt);
    if (ok) { g.right++; g.combo++; g.best = Math.max(g.best, g.combo); } else { g.combo = 0; g.wrong.push(c); }
    play.querySelector('.gbflash').textContent = ok ? (g.combo > 1 ? '✓ Right! 🔥 combo ×' + g.combo : '✓ Right!') : '✗ It was: ' + c.a.replace(/\n/g, ' / ');
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
    if (!g.counted) { g.counted = true; gstat('speed').p++; bumpDay(); save(); updatePill(); refreshStats(); renderEnd(); }
    K.track('game_break', { kind: 'speed', action: 'done', right: g.right, seconds: secs });
    sec.querySelector('.gbplay').innerHTML =
      '<p class="verdict">' + (timeout ? '⏰ Time up! ' : '⚡ ') + g.right + ' of ' + n + ' right' + (timeout ? '' : ' in ' + secs + ' s') + '</p>' +
      (stars ? '<p>' + K.stars(stars).replace('class="stars"', 'class="stars big"') + '</p>' : '') +
      (g.best > 1 ? '<p class="revnote">🔥 Best combo ×' + g.best + '</p>' : '') +
      (g.wrong.length ? '<p class="small">Remember:</p><ul class="gbwrong">' + g.wrong.map(function (c) {
        return '<li>' + K.esc(c.q ? c.q.replace(/`|\*\*/g, '') : c.code.split('\n')[0]) + ' → <strong>' + K.esc(c.a.replace(/\n/g, ' / ')) + '</strong></li>';
      }).join('') + '</ul>' : '') +
      '<p class="revnote">🎮 Game break done · it counts for today</p>' +
      '<div class="mbar"><button type="button" class="btn ghost" data-gbagain>Play again</button><button type="button" class="btn primary" data-gbnext>Back to learning ↓</button></div>';
  }

  function levelProgress(t) {
    var lu = liveUnits(t), du = lu.filter(unitDone).length, nu = nextUnit(t);
    return { live: lu.length, done: du, next: nu, label: nu ? LEVEL[nu.level] + ' · Unit ' + nu.n + ': ' + nu.title : (lu.length ? 'All ready units done' : 'Coming soon') };
  }

  function intro() {
    var s = streakNow(), unitsDone = 0;
    st.tracks.forEach(function (id) { unitsDone += liveUnits(TR[id]).filter(unitDone).length; });
    return '<section class="dcard intro" id="c-intro" aria-label="Your learning"><div class="dinner post profile">' +
      '<div class="prow"><span class="pav big">' + ICON.logo + '</span>' +
      '<div class="dstats"><div><strong id="s-streak">' + (s ? '🔥' + s : '0') + '</strong><span>streak</span></div><div><strong id="s-today">' + Math.min(todayCount(), GOAL) + '/' + GOAL + '</strong><span>today</span></div><div><strong id="s-units">' + unitsDone + '</strong><span>units done</span></div></div></div>' +
      '<h1>kramavriddhi.learn</h1>' +
      '<p class="pbio">Your skills, step by step: Basic → Intermediate → Advanced. Daily goal: ' + GOAL + ' cards. 📚</p>' +
      '<p class="revline" id="s-review">' + reviewLine() + '</p>' +
      '<h2 class="mysk">My skills</h2><ul class="mytracks">' + st.tracks.map(function (id) { return trackRow(TR[id]); }).join('') + '</ul>' +
      '<div class="introbtns"><button type="button" class="btn go" data-start>' + (todayCount() ? 'Continue ↓' : 'Start today ↓') + '</button><a class="btn ghost" href="?pick=1" data-pick>Change skills</a></div>' +
      '</div></section>';
  }

  function reviewLine() {
    var n = dueReviews().filter(function (c) { return !answeredToday(c.id); }).length;
    return [n ? '🔁 <strong>' + n + '</strong> to review today' : '', st.mastered ? '🏅 <strong>' + st.mastered + '</strong> mastered' : ''].filter(Boolean).join(' · ');
  }
  function answeredToday(id) { return feedCards.some(function (c, j) { return c.id === id && feedModes[j] === 'review' && reviewNote[j]; }); }

  function trackRow(t) {
    var p = levelProgress(t), pct = p.live ? Math.round(p.done / p.live * 100) : 0;
    return '<li class="t-' + tkey(t.topic) + '" data-trow="' + t.id + '"><details><summary>' +
      '<span class="pav" aria-hidden="true">' + K.esc((TOPIC[tkey(t.topic)] || TOPIC.devops).ab) + '</span>' +
      '<span class="tr-txt"><strong>' + K.esc(t.name) + '</strong><span class="tr-now">' + K.esc(p.label) + '</span>' +
      '<span class="bar" role="img" aria-label="' + p.done + ' of ' + p.live + ' ready units done"><i style="width:' + pct + '%"></i></span>' +
      '<span class="tr-count">' + p.done + ' of ' + p.live + ' ready units done · ' + t.units.length + ' planned</span></span>' +
      '<span class="tr-open" aria-hidden="true">Path ▾</span></summary><div class="pathbox"></div></details></li>';
  }

  function pathHtml(t) {
    var nu = nextUnit(t);
    return ['b', 'i', 'a'].map(function (lv) {
      var us = t.units.filter(function (u) { return u.level === lv; });
      return '<h3>' + LEVEL[lv] + '</h3><ol class="path">' + us.map(function (u) {
        var stt = unitDone(u) ? 'done' : u === nu ? 'now' : live(u) ? 'todo' : 'soon';
        var lab = { done: 'done', now: 'up next', todo: 'ready', soon: 'coming soon' }[stt];
        var dn = u.cards.filter(isDone).length;
        return '<li class="p-' + stt + '"><span class="pn">' + u.n + '</span><span class="pt">' + K.esc(u.title) + '</span><span class="ps">' + lab + (live(u) && stt !== 'done' && dn ? ' · ' + dn + '/' + u.cards.length : '') + '</span></li>';
      }).join('') + '</ol>';
    }).join('');
  }

  function unitHead(u) {
    var t = u.track, dn = u.cards.filter(isDone).length;
    return '<section class="dcard unithead t-' + tkey(t.topic) + '" aria-label="' + K.esc(t.name + ', unit ' + u.n + ': ' + u.title) + '"><div class="dinner post">' +
      '<header class="phead"><span class="pav" aria-hidden="true">' + K.esc((TOPIC[tkey(t.topic)] || TOPIC.devops).ab) + '</span>' +
      '<span class="pwho"><strong>' + K.esc(t.name) + '</strong><span>' + LEVEL[u.level] + ' · Unit ' + u.n + ' of ' + t.units.length + '</span></span></header>' +
      '<p class="kicker">New unit</p><h2 class="uh-title">' + K.esc(u.title) + '</h2>' +
      '<p class="uh-sub">' + u.cards.length + ' cards' + (dn ? ' · ' + dn + ' done already' : '') + ': ' + countTypes(u) + '</p>' +
      (checksOf(u).length && !dn ? '<div class="uh-test"><button type="button" class="btn ghost" data-testout="' + u.id + '">I know this: take the checkpoint ↓</button>' +
        '<span>Get all ' + checksOf(u).length + ' checkpoint questions right to skip this unit.</span></div>' : '') +
      '</div></section>';
  }
  function checksOf(u) { return u.cards.filter(function (c) { return c.t === 'check'; }); }
  function countTypes(u) {
    var l = u.cards.filter(function (c) { return c.t === 'learn'; }).length, g = u.cards.filter(function (c) { return c.t === 'pipe' || c.t === 'indent'; }).length,
        k = checksOf(u).length, q = u.cards.length - l - g - k;
    return [l ? l + ' explainer' : '', q ? q + ' practice' : '', g ? g + ' mini game' + (g > 1 ? 's' : '') : '', k ? k + ' checkpoint' + (k > 1 ? 's' : '') : ''].filter(Boolean).join(', ');
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
      return '<p class="unitdone">🎉 You tested out of “' + K.esc(u.title) + '”. Moving on!</p>';
    }
    return '<p class="unitdone">Not yet. Go through the unit from its first card above, then try the rest.</p>';
  }

  /* ---------- one card */
  function cardHtml(c, mode) {
    var j = feedCards.push(c) - 1, isGame = c.t === 'pipe' || c.t === 'indent', u = c.unit, rev = mode === 'review';
    feedModes[j] = mode || '';
    var head = '<header class="phead"><span class="pav" aria-hidden="true">' + K.esc(topicOf(c).ab) + '</span>' +
      '<span class="pwho"><strong>' + K.esc(u.track.name) + '</strong><span>Unit ' + u.n + ' · ' + K.esc(u.title) + '</span></span>' +
      '<span class="dcount">' + (rev ? '🔁' : (c.pos + 1) + '/' + u.cards.length) + '</span></header>' +
      (rev ? '<p class="dtype review-type">🔁 Review' + (st.review[c.id] && st.review[c.id].step ? ' ' + (st.review[c.id].step + 1) + ' of 3' : '') + '</p>' : '') +
      '<p class="dtype' + (isGame ? ' game-type' : c.t === 'learn' ? ' learn-type' : c.t === 'check' ? ' check-type' : '') + '">' + (isGame ? '🎮 ' : c.t === 'learn' ? '💡 ' : c.t === 'check' ? '✅ ' : '') + TYPE[c.t] + '</p>';
    var body = '';
    if (c.t === 'learn') body = '<h2 class="dq">' + K.esc(c.title) + '</h2><p class="lbody">' + K.rich(c.body) + '</p>' + (c.code ? codeBlock(c.code.split('\n'), false, c.lang) : '') +
      '<div class="mbar"><button type="button" class="btn go" data-got>Got it ✓</button></div>';
    else if (c.t === 'output') body = codeBlock(c.code.split('\n')) + choiceList(c);
    else if (c.t === 'choice') body = '<h2 class="dq">' + K.rich(c.q) + '</h2>' + choiceList(c);
    else if (c.t === 'check') body = '<h2 class="dq">' + K.rich(c.q || 'What does this print?') + '</h2>' + (c.code ? codeBlock(c.code.split('\n')) : '') + choiceList(c);
    else if (c.t === 'bug') body = '<h2 class="dq">' + K.rich(c.q) + '</h2>' + codeBlock(c.code, true);
    else if (c.t === 'order') body = '<h2 class="dq">' + K.rich(c.q) + '</h2><div class="order-list">' + shuffleDiff(c.items).map(function (it) {
        return '<button type="button" class="ord" data-item="' + K.esc(it) + '"><span class="ordn" aria-hidden="true"></span><span>' + K.esc(it) + '</span></button>';
      }).join('') + '</div><button type="button" class="btn ghost ord-reset" hidden>Start again</button>';
    else if (c.t === 'pipe') body = pipeBody(c);
    else if (c.t === 'indent') body = indentBody(c);
    var liked = !!st.likes[c.id], saved = !!st.saved[c.id];
    var actions = '<div class="pactions">' +
      '<button type="button" class="pact like" data-like aria-pressed="' + liked + '" aria-label="Like">' + ICON.heart + '</button>' +
      '<a class="pact" href="' + K.wa(shareText(c)) + '" target="_blank" rel="noopener" aria-label="Share on WhatsApp">' + ICON.share + '</a>' +
      '<button type="button" class="pact plearn" data-learn aria-expanded="false" aria-controls="lb-' + j + '">' + ICON.book + '<span>Learn more</span></button>' +
      '<button type="button" class="pact save" data-save aria-pressed="' + saved + '" aria-label="Save for later">' + ICON.save + '</button>' +
      '</div>' +
      '<div class="plearnbox" id="lb-' + j + '" hidden><p>Read and practise more:</p><ul>' + learnLinks(c).map(function (l) {
        return '<li><a href="' + K.esc(l.href) + '"' + (l.ext ? ' target="_blank" rel="noopener"' : '') + '>' + K.esc(l.label) + (l.ext ? ' ↗' : '') + '</a></li>';
      }).join('') + '</ul></div>';
    return '<section class="dcard t-' + tkey(c.topic) + (isGame ? ' gamecard' : '') + (rev ? ' reviewcard' : '') + (mode === 'play' ? ' playcard' : '') + '" id="c-' + j + '" data-j="' + j + '" aria-label="' + K.esc((rev ? 'Review: ' : mode === 'play' ? 'Game break: ' : '') + u.track.name + ', ' + u.title + ', card ' + (c.pos + 1) + ' of ' + u.cards.length) + '">' +
      '<div class="dinner post">' + head + '<div class="pbody">' + body + '</div>' +
      '<div class="dres" hidden></div>' + actions + '<span class="bigheart" aria-hidden="true">' + ICON.heart + '</span></div></section>';
  }

  function shareText(c) {
    var what = c.t === 'learn' ? c.title + ': ' + c.body : (c.t === 'output' || (c.t === 'check' && c.code && !c.q)) ? 'What does this Python code print?\n\n' + c.code : c.q;
    return (c.t === 'learn' ? 'Learn this in 1 minute' : 'Can you solve this?') + ' (' + c.unit.track.name + ')\n' + what.replace(/`|\*\*/g, '') +
      '\n\nTry it on Kramavriddhi Learn: ' + URL + '#card=' + c.id;
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
      '<p class="mhint">Tap a block to add it to the next empty step. Tap a step to take its block back.' + (c.extra && c.extra.length ? ' One block does not belong.' : '') + '</p>' +
      '<div class="mtray">' + K.shuffle(all).map(function (x) { return block(x.b, x.id); }).join('') + '</div>' +
      '<div class="mbar"><button type="button" class="btn go mrun" disabled>▶ Run</button><span class="mmsg" role="status"></span></div>';
  }

  /* mini game 2: fix the indentation (lines: [spaces, text]) */
  function indentBody(c) {
    var yaml = c.step === 2;
    return '<h2 class="dq">' + K.rich(c.q) + '</h2>' +
      '<div class="editor dcode"><div class="ed-bar"><span class="file">' + (yaml ? 'site.yml' : 'main.py') + '</span><span>Tap a line to add ' + c.step + ' spaces</span></div>' +
      '<ol class="bug-lines">' + c.lines.map(function (l, n) {
        return '<li><button type="button" class="bugline iline" data-line="' + n + '" data-ind="0" aria-label="Line ' + (n + 1) + ', 0 spaces: ' + K.esc(l[1]) + '"><span class="num" aria-hidden="true">' + (n + 1) + '</span><span class="ws" aria-hidden="true"></span><span class="src">' + (yaml ? hlYaml(l[1]) : hlPy(l[1])) + '</span></button></li>';
      }).join('') + '</ol></div>' +
      '<p class="mhint">Each tap pushes a line ' + c.step + ' spaces to the right. After the deepest level it goes back to 0. ' + (yaml ? 'In YAML, the lines under a line ending in <code>:</code> are indented 2 more.' : 'In Python, the lines under a line ending in <code>:</code> are indented 4 more.') + '</p>' +
      '<div class="mbar"><button type="button" class="btn go mrun">▶ Check</button><span class="mmsg" role="status"></span></div>';
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
    var right = c.t === 'order' && !ok ? '<p class="small">The right order:</p><ol class="right-order">' + c.items.map(function (x) { return '<li>' + K.esc(x) + '</li>'; }).join('') + '</ol>' : '';
    var finished = unitDone(u), last = c.pos === u.cards.length - 1;
    if (feedModes[j] === 'review') { extra = reviewNote[j] || ''; finished = false; last = false; }
    if (feedModes[j] === 'play') { extra = '<p class="revnote">🎮 Game break done · it counts for today</p>'; finished = false; last = false; }
    res.innerHTML = '<p class="verdict">' + (verdict || (ok ? '✓ Correct!' : '✗ Not quite.')) + (restoring ? ' <span class="muted">(done before)</span>' : '') + '</p>' + right +
      (c.why ? '<p>' + K.rich(c.why) + '</p>' : '') +
      (extra || (finished && !restoring ? '<p class="unitdone">🎉 Unit complete: ' + K.esc(u.title) + '</p>' : '')) +
      '<button type="button" class="btn primary" data-next>' + (last || finished ? 'Next unit ↓' : 'Next ↓') + '</button>';
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
    bumpDay();
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
    var e4 = document.getElementById('s-review'); if (e4) e4.innerHTML = reviewLine();
    feed.querySelectorAll('[data-trow]').forEach(function (li) {
      var t = TR[li.getAttribute('data-trow')], p = levelProgress(t), pct = p.live ? Math.round(p.done / p.live * 100) : 0;
      li.querySelector('.tr-now').textContent = p.label;
      li.querySelector('.bar i').style.width = pct + '%';
      li.querySelector('.bar').setAttribute('aria-label', p.done + ' of ' + p.live + ' ready units done');
      li.querySelector('.tr-count').textContent = p.done + ' of ' + p.live + ' ready units done · ' + t.units.length + ' planned';
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
        setTimeout(function () { result(j, ok, false, ok ? '✓ Data is flowing! Solved first try.' : '✓ Solved in ' + tries[j] + ' runs.'); }, reduce ? 0 : 700);
        return;
      }
      msg.textContent = good + ' of ' + c.steps.length + ' right. Wrong blocks went back. Try again.';
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
        result(j, ok, false, ok ? '✓ It runs! Solved first try.' : '✓ Solved in ' + tries[j] + ' tries.');
        return;
      }
      msg.textContent = bad + ' line' + (bad > 1 ? 's have' : ' has') + ' the wrong indent (red). Fix and check again.';
    }
  }

  /* ---------- clicks */
  feed.addEventListener('click', function (e) {
    if (e.target.closest('[data-pick]')) { e.preventDefault(); history.replaceState(null, '', location.pathname + '?pick=1'); renderPicker(); window.scrollTo(0, feed.getBoundingClientRect().top + window.scrollY - 70); return; }
    if (e.target.closest('[data-start]')) { var first = feed.querySelector('.dcard.unithead, .dcard[data-j]'); if (first) scrollToCard(first); return; }
    var gbSec = e.target.closest('.dcard.gamebreak'); if (gbSec) { gbClick(e, gbSec); return; }
    if (e.target.closest('[data-more]')) { var endSec = document.getElementById('c-end'), before = feedCards.length; endSec.insertAdjacentHTML('beforebegin', nextBlocks()); renderEnd(); var n = document.getElementById('c-' + before); if (n) scrollToCard(n.previousElementSibling || n); return; }
    var to = e.target.closest('[data-testout]');
    if (to) {
      var tu = UNIT[to.getAttribute('data-testout')], firstCheck = -1;
      testing[tu.id] = true;
      feedCards.forEach(function (fc, k) { if (firstCheck < 0 && fc.unit === tu && fc.t === 'check' && !isDone(fc)) firstCheck = k; });
      to.parentNode.innerHTML = '<span>Answer the checkpoint questions below. Get them all right to skip the unit.</span>';
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
    if (e.target.closest('.plearnbox, .pactions')) return;
    if (isDone(c) && sec.classList.contains('answered')) return;
    if (c.t === 'learn') { if (e.target.closest('[data-got]')) { e.target.closest('.mbar').hidden = true; record(j, true); result(j, true, false, '✓ Got it'); } return; }
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
      var g = c.t === 'pipe' || c.t === 'indent';
      result(j, d.ok, true, c.t === 'learn' ? '✓ Got it' : g ? (d.ok ? '✓ Solved first try.' : '✓ Solved' + (d.tries ? ' in ' + d.tries + ' tries.' : '.')) : null);
    });
  }

  /* ---------- end card */
  function renderEnd() {
    var el = document.getElementById('endin'); if (!el) return;
    var n = todayCount(), s = streakNow(), more = qi < queue.length;
    var share = 'I am learning ' + st.tracks.map(function (id) { return TR[id].name; }).join(', ') + ' step by step on Kramavriddhi Learn' + (s > 1 ? ' (' + s + '-day streak 🔥)' : '') + '. Free, in a scrolling feed: ' + URL;
    el.innerHTML =
      '<p class="kicker">Today · ' + Math.min(n, GOAL) + ' of ' + GOAL + ' cards</p>' +
      (n >= GOAL
        ? '<h2>Daily goal done! 🔥 ' + s + '</h2><p>' + (s > 1 ? s + ' days in a row. ' : '') + 'Come back tomorrow to keep your streak' + (st.best > s ? ' (your best: ' + st.best + ')' : '') + '. You can also keep going now.</p>'
        : '<h2>' + (GOAL - n) + ' more to reach today’s goal</h2><p>Finish ' + GOAL + ' cards a day to grow your streak' + (s ? ' (now 🔥 ' + s + ')' : '') + '.</p>') +
      (more ? '<button type="button" class="btn go" data-more>Load the next units ↓</button>'
            : '<p class="alldone">🎉 You have finished every ready unit in your skills. New units arrive in every update, or <a href="?pick=1" data-pick>add another skill</a>.</p>') +
      '<div class="share"><span class="share-label">Share:</span><a class="share-btn wa" href="' + K.wa(share) + '" target="_blank" rel="noopener">WhatsApp</a></div>' +
      (reviewsOn(today + 1) ? '<p class="revline">🔁 ' + reviewsOn(today + 1) + ' card' + (reviewsOn(today + 1) > 1 ? 's' : '') + ' to review tomorrow.</p>' : '') +
      savedList() +
      '<h3>Keep learning</h3><div class="more"><a href="/learn/python/">Python games</a><a href="/learn/devops/">Cloud &amp; DevOps games</a><a href="/courses/azure-data-engineering/">Azure Data Engineering course</a><a href="https://nagendrababuedru.github.io/DevOps/" target="_blank" rel="noopener">DevOps Academy ↗</a></div>';
  }

  function savedList() {
    var ids = Object.keys(st.saved).filter(function (id) { return CARD[id]; });
    if (!ids.length) return '';
    return '<h3>🔖 Saved for later (' + ids.length + ')</h3><ul class="savedlist">' + ids.slice(0, 20).map(function (id) {
      var c = CARD[id], title = c.t === 'learn' ? c.title : (c.t === 'output' || (c.t === 'check' && c.code && !c.q)) ? 'What does this print? ' + c.code.split('\n')[0] : c.q.replace(/`|\*\*/g, '');
      return '<li class="t-' + tkey(c.topic) + '"><a href="#card=' + id + '"><span class="pav" aria-hidden="true">' + K.esc(topicOf(c).ab) + '</span><span>' + K.esc(c.unit.track.name) + ' · ' + K.esc(title.length > 70 ? title.slice(0, 68) + '…' : title) + '</span></a></li>';
    }).join('') + '</ul>';
  }

  /* ---------- top bar: today's goal as story segments */
  function updatePill() {
    var n = todayCount(), segs = '';
    for (var i = 0; i < GOAL; i++) segs += '<i class="' + (i < n ? 'ok' : '') + '"></i>';
    pill.innerHTML = '<span class="ibrand">kramavriddhi.learn</span><span class="istreak">' + Math.min(n, GOAL) + '/' + GOAL + ' · 🔥 ' + streakNow() + '</span><span class="isegs" aria-hidden="true">' + segs + '</span>';
    pill.setAttribute('aria-label', Math.min(n, GOAL) + ' of ' + GOAL + ' cards done today, streak ' + streakNow() + ' days');
  }

  window.addEventListener('hashchange', function () { if (/card=/.test(location.hash) && st.tracks.length) renderFeed(); });

  if (!st.tracks.length || /[?&]pick=1/.test(location.search)) renderPicker();
  else renderFeed();
})();
