/* Kramavriddhi Daily: a scrolling feed of 5 small tech tasks per day, with a streak. */
(function () {
  'use strict';
  var K = window.KVLearn, D = window.KV_DAILY;
  var STORE = 'kv-learn-daily';
  var URL = 'https://kramavriddhi.com/learn/daily/';
  var DAY_MS = 86400000;

  /* ---------- which day is it */
  function utcDay(y, m, d) { return Date.UTC(y, m - 1, d) / DAY_MS; }
  var now = new Date();
  var todayNum = Math.max(1, Math.floor(utcDay(now.getFullYear(), now.getMonth() + 1, now.getDate()) - utcDay(D.start[0], D.start[1], D.start[2])) + 1);
  var q = /[?&]day=(\d+)/.exec(location.search);
  var dayNum = q ? Math.min(todayNum, Math.max(1, +q[1])) : todayNum;
  var practice = dayNum !== todayNum;
  var cards = D.days[(dayNum - 1) % D.days.length].cards;

  function dateOf(n) { var t = new Date((utcDay(D.start[0], D.start[1], D.start[2]) + n - 1) * DAY_MS); return t.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', timeZone: 'UTC' }); }

  /* ---------- saved progress */
  var st = K.load(STORE, null);
  if (!st || typeof st !== 'object' || !st.ans) st = { ans: {}, streak: { n: 0, last: 0 }, best: 0 };
  var mine = st.ans[dayNum] || (st.ans[dayNum] = {});
  var dayDone = Object.keys(mine).length >= 5;
  function streakNow() { return st.streak && st.streak.last >= todayNum - 1 ? st.streak.n : 0; }
  function answeredCount() { return Object.keys(mine).length; }
  function rightCount() { var n = 0; for (var k in mine) if (mine[k].ok) n++; return n; }

  var feed = document.getElementById('feed'), pill = document.getElementById('pill');
  var TYPE = { output: 'What does it print?', choice: 'Pick the right answer', order: 'Tap in the right order', bug: 'Find the line with the bug' };
  var KW = /^(def|return|if|elif|else|for|in|and|or|not|while|break|True|False|None)$/;

  function hl(text) {
    var re = /("[^"]*")|(\b\d+\b)|([A-Za-z_]\w*)|(\s+)|(.)/g, m, s = '';
    while ((m = re.exec(text))) {
      if (m[1]) s += '<span class="v">' + K.esc(m[1]) + '</span>';
      else if (m[2]) s += '<span class="b">' + m[2] + '</span>';
      else if (m[3]) s += KW.test(m[3]) ? '<span class="k">' + m[3] + '</span>' : text.charAt(re.lastIndex) === '(' ? '<span class="fn">' + m[3] + '</span>' : K.esc(m[3]);
      else s += K.esc(m[0]);
    }
    return s;
  }
  function codeBlock(lines, asButtons) {
    return '<div class="editor dcode">' + (asButtons
      ? '<ol class="bug-lines">' + lines.map(function (l, n) {
          return '<li><button type="button" class="bugline" data-line="' + n + '"><span class="num" aria-hidden="true">' + (n + 1) + '</span><span class="src">' + hl(l) + '</span></button></li>';
        }).join('') + '</ol>'
      : '<pre class="snippet">' + lines.map(function (l, n) { return '<span class="num" aria-hidden="true">' + (n + 1) + '</span>' + hl(l); }).join('\n') + '</pre>') + '</div>';
  }

  /* ---------- build the feed */
  function intro() {
    var s = streakNow(), done = answeredCount();
    return '<section class="dcard intro" id="c-intro" aria-label="Day ' + dayNum + '">' +
      '<div class="dinner">' +
        '<p class="kicker">Kramavriddhi Daily · ' + (practice ? 'Practice' : 'Today') + '</p>' +
        '<h1>Day ' + dayNum + ' <span>' + dateOf(dayNum) + '</span></h1>' +
        '<p class="lede">5 small tasks from Python, cloud, data and DevOps. About 3 minutes. Scroll down like a feed, answer each one, and read why.</p>' +
        '<div class="dstats"><div><strong>' + (s ? '🔥 ' + s : '0') + '</strong><span>day streak</span></div><div><strong>' + done + '/5</strong><span>done ' + (practice ? 'on this day' : 'today') + '</span></div></div>' +
        (practice ? '<p class="note">This is an earlier day, for practice. It does not change your streak. <a href="/learn/daily/">Go to today</a></p>' : '') +
        '<button type="button" class="btn go" data-next>' + (done && done < 5 ? 'Continue ↓' : done === 5 ? 'See my answers ↓' : 'Start ↓') + '</button>' +
      '</div></section>';
  }

  function card(c, j) {
    var head = '<div class="dhead"><span class="chip t-' + c.topic.toLowerCase() + '">' + K.esc(c.topic) + '</span><span class="dcount">' + (j + 1) + ' / ' + cards.length + '</span></div>' +
      '<p class="dtype">' + TYPE[c.t] + '</p>';
    var body = '';
    if (c.t === 'output') body = codeBlock(c.code.split('\n')) + choiceList(c, j);
    else if (c.t === 'choice') body = '<h2 class="dq">' + K.rich(c.q) + '</h2>' + choiceList(c, j);
    else if (c.t === 'bug') body = '<h2 class="dq">' + K.rich(c.q) + '</h2>' + codeBlock(c.code, true);
    else if (c.t === 'order') body = '<h2 class="dq">' + K.rich(c.q) + '</h2><div class="order-list">' + K.shuffleUntilDifferent(c.items).map(function (it) {
        return '<button type="button" class="ord" data-item="' + K.esc(it) + '"><span class="ordn" aria-hidden="true"></span><span>' + K.esc(it) + '</span></button>';
      }).join('') + '</div><button type="button" class="btn ghost ord-reset" hidden>Start again</button>';
    return '<section class="dcard" id="c-' + j + '" data-j="' + j + '" aria-label="Task ' + (j + 1) + ' of ' + cards.length + '"><div class="dinner">' + head + body +
      '<div class="dres" hidden></div></div></section>';
  }

  function choiceList(c, j) {
    var opts = K.shuffle([c.a].concat(c.w));
    return '<div class="choices">' + opts.map(function (o, n) {
      return '<button type="button" class="choice" data-opt="' + K.esc(o) + '"><span class="key" aria-hidden="true">' + 'ABCD'.charAt(n) + '</span><pre>' + K.esc(o) + '</pre></button>';
    }).join('') + '</div>';
  }

  function endCard() {
    return '<section class="dcard end" id="c-end" aria-label="Day summary"><div class="dinner" id="endin"></div></section>';
  }

  K.shuffleUntilDifferent = function (items) {
    var a = items, tries = 0;
    do { a = K.shuffle(items); tries++; } while (tries < 20 && a.join('\u0001') === items.join('\u0001'));
    return a;
  };

  feed.innerHTML = intro() + cards.map(card).join('') + endCard();
  document.documentElement.classList.add('snap-feed');

  /* ---------- answering */
  function result(j, ok, restoring) {
    var c = cards[j], sec = document.getElementById('c-' + j), res = sec.querySelector('.dres');
    sec.classList.add('answered', ok ? 'is-right' : 'is-wrong');
    var right = c.t === 'order' ? '<ol class="right-order">' + c.items.map(function (x) { return '<li>' + K.esc(x) + '</li>'; }).join('') + '</ol>' : '';
    res.innerHTML = '<p class="verdict">' + (ok ? '✓ Correct!' : '✗ Not quite.') + (restoring ? ' <span class="muted">(answered before)</span>' : '') + '</p>' +
      (c.t === 'order' && !ok ? '<p class="small">The right order:</p>' + right : '') +
      '<p>' + K.rich(c.why) + '</p>' +
      '<button type="button" class="btn primary" data-next>' + (j === cards.length - 1 ? 'See my day ↓' : 'Next task ↓') + '</button>';
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

  function record(j, ok) {
    if (!answeredCount() && !practice) K.track('game_start', { game_name: 'kramavriddhi_daily', level: dayNum });
    mine[j] = { ok: ok };
    if (answeredCount() === cards.length) finishDay();
    K.save(STORE, st);
    updatePill();
  }

  function finishDay() {
    if (dayDone) return;
    dayDone = true;
    var r = rightCount();
    if (!practice) {
      if (st.streak.last === todayNum - 1) st.streak.n++;
      else if (st.streak.last !== todayNum) st.streak.n = 1;
      st.streak.last = todayNum;
      st.best = Math.max(st.best || 0, st.streak.n);
      K.track('level_complete', { game_name: 'kramavriddhi_daily', level: dayNum, stars: r });
    }
    renderEnd();
  }

  feed.addEventListener('click', function (e) {
    var nx = e.target.closest('[data-next]');
    if (nx) { var sec = nx.closest('.dcard'), next = sec.nextElementSibling; if (next) scrollToCard(next); return; }
    var sec2 = e.target.closest('.dcard[data-j]'); if (!sec2) return;
    var j = +sec2.getAttribute('data-j'), c = cards[j];
    if (mine[j]) return;
    var ch = e.target.closest('.choice');
    if (ch && !ch.disabled) { var ok = ch.getAttribute('data-opt') === c.a; markChoices(sec2, c, ch.getAttribute('data-opt')); record(j, ok); result(j, ok); return; }
    var bl = e.target.closest('.bugline');
    if (bl && !bl.disabled) { var p = +bl.getAttribute('data-line'), ok2 = p === c.bad; markBug(sec2, c, p); record(j, ok2); result(j, ok2); return; }
    if (e.target.closest('.ord-reset')) { sec2.querySelectorAll('.ord').forEach(function (b) { b.removeAttribute('data-n'); b.classList.remove('picked'); b.querySelector('.ordn').textContent = ''; }); e.target.closest('.ord-reset').hidden = true; return; }
    var od = e.target.closest('.ord');
    if (od && !od.disabled && !od.getAttribute('data-n')) {
      var all = sec2.querySelectorAll('.ord'), n = sec2.querySelectorAll('.ord[data-n]').length + 1;
      od.setAttribute('data-n', n); od.classList.add('picked'); od.querySelector('.ordn').textContent = n;
      sec2.querySelector('.ord-reset').hidden = false;
      if (n === all.length) {
        var ok3 = true;
        all.forEach(function (b) { if (c.items.indexOf(b.getAttribute('data-item')) + 1 !== +b.getAttribute('data-n')) ok3 = false; });
        markOrder(sec2, c); record(j, ok3); result(j, ok3);
      }
    }
  });

  function scrollToCard(el) {
    el.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
    var f = el.querySelector('button:not([disabled]), a'); if (f) setTimeout(function () { f.focus({ preventScroll: true }); }, 400);
  }

  /* restore answers saved earlier today */
  cards.forEach(function (c, j) {
    if (!mine[j]) return;
    var sec = document.getElementById('c-' + j);
    if (c.t === 'output' || c.t === 'choice') markChoices(sec, c, null);
    else if (c.t === 'bug') markBug(sec, c, null);
    else { sec.querySelectorAll('.ord').forEach(function (b) { b.setAttribute('data-n', c.items.indexOf(b.getAttribute('data-item')) + 1); b.querySelector('.ordn').textContent = b.getAttribute('data-n'); }); markOrder(sec, c); }
    result(j, mine[j].ok, true);
  });

  /* ---------- end card */
  function renderEnd() {
    var el = document.getElementById('endin'), n = answeredCount(), r = rightCount(), s = streakNow();
    var past = '';
    for (var d = todayNum - 1; d >= Math.max(1, todayNum - 14); d--) past += '<a class="daychip" href="/learn/daily/?day=' + d + '">Day ' + d + (st.ans[d] && Object.keys(st.ans[d]).length === 5 ? ' ✓' : '') + '</a>';
    if (practice) past = '<a class="daychip" href="/learn/daily/">Today: Day ' + todayNum + '</a>' + past.replace('href="/learn/daily/?day=' + dayNum + '"', 'href="/learn/daily/?day=' + dayNum + '" aria-current="page"');
    var share = 'I finished Day ' + dayNum + ' of Kramavriddhi Daily: ' + r + ' of 5 right' + (s > 1 ? ', ' + s + '-day streak 🔥' : '') + '. 5 small tech tasks a day, free: ' + URL;
    var finished = n === cards.length;
    el.innerHTML =
      '<p class="kicker">Day ' + dayNum + ' · ' + (finished ? 'complete' : n + ' of 5 done') + '</p>' +
      (finished
        ? '<h2>' + r + ' of 5 right ' + K.stars(r >= 5 ? 3 : r >= 3 ? 2 : 1).replace('class="stars"', 'class="stars big"') + '</h2>' +
          (practice ? '<p>Practice done. Your streak only grows with today’s tasks.</p>'
                    : '<p class="streak-big">🔥 ' + s + ' day streak' + (st.best > s ? ' <span class="muted">(best: ' + st.best + ')</span>' : '') + '</p><p>New tasks unlock tomorrow' + '<span id="cd"></span>. Come back to keep your streak.</p>')
        : '<h2>Almost there</h2><p>Answer all 5 tasks to finish the day' + (practice ? '.' : ' and grow your streak.') + '</p><button type="button" class="btn go" data-first>Go to the next unanswered task ↑</button>') +
      (finished ? '<div class="share"><span class="share-label">Share:</span><a class="share-btn wa" href="' + K.wa(share) + '" target="_blank" rel="noopener">WhatsApp</a></div>' : '') +
      '<h3>Want more?</h3><div class="more"><a href="/learn/python/">Python games</a><a href="/learn/devops/">Cloud &amp; DevOps games</a></div>' +
      (past ? '<h3>Earlier days</h3><div class="days">' + past + '</div>' : '');
    var first = el.querySelector('[data-first]');
    if (first) first.addEventListener('click', function () { for (var j = 0; j < cards.length; j++) if (!mine[j]) { scrollToCard(document.getElementById('c-' + j)); return; } });
    tick();
  }

  function tick() {
    var el = document.getElementById('cd'); if (!el) return;
    var t = new Date(), mid = new Date(t.getFullYear(), t.getMonth(), t.getDate() + 1), ms = mid - t;
    var h = Math.floor(ms / 3600000), m = Math.floor(ms % 3600000 / 60000);
    el.textContent = ' in ' + h + ' h ' + m + ' min';
  }
  setInterval(tick, 30000);

  /* ---------- floating progress pill */
  function updatePill() {
    pill.innerHTML = '<span class="pdots" aria-hidden="true">' + cards.map(function (_, j) { return '<i class="' + (mine[j] ? (mine[j].ok ? 'ok' : 'no') : '') + '"></i>'; }).join('') + '</span>' +
      '<span>' + answeredCount() + '/5</span>' + (practice ? '' : '<span>🔥 ' + streakNow() + '</span>');
    pill.setAttribute('aria-label', answeredCount() + ' of 5 tasks done' + (practice ? '' : ', streak ' + streakNow() + ' days'));
  }
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.target.id === 'c-intro') pill.classList.toggle('show', !en.isIntersecting); }); }, { threshold: 0.2 });
    io.observe(document.getElementById('c-intro'));
  } else pill.classList.add('show');

  updatePill();
  renderEnd();
})();
