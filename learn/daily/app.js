/* Kramavriddhi Daily: a scrolling feed of small tech tasks and one mini game per day, with a streak. */
(function () {
  'use strict';
  var K = window.KVLearn, D = window.KV_DAILY;
  var STORE = 'kv-learn-daily';
  var URL = 'https://kramavriddhi.com/learn/daily/';
  var DAY_MS = 86400000;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- which day is it */
  function utcDay(y, m, d) { return Date.UTC(y, m - 1, d) / DAY_MS; }
  var START = utcDay(D.start[0], D.start[1], D.start[2]);
  var now = new Date();
  var todayNum = Math.max(1, Math.floor(utcDay(now.getFullYear(), now.getMonth() + 1, now.getDate()) - START) + 1);
  var q = /[?&]day=(\d+)/.exec(location.search);
  var dayNum = q ? Math.min(todayNum, Math.max(1, +q[1])) : todayNum;
  var practice = dayNum !== todayNum;
  function cardsOf(n) { return D.days[(n - 1) % D.days.length].cards; }
  var cards = cardsOf(dayNum), N = cards.length;

  function dateOf(n) { return new Date((START + n - 1) * DAY_MS).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', timeZone: 'UTC' }); }

  /* ---------- saved progress */
  var st = K.load(STORE, null);
  if (!st || typeof st !== 'object' || !st.ans) st = { ans: {}, streak: { n: 0, last: 0 }, best: 0 };
  var mine = st.ans[dayNum] || (st.ans[dayNum] = {});
  function answeredCount() { return Object.keys(mine).length; }
  function rightCount() { var n = 0; for (var k in mine) if (mine[k].ok) n++; return n; }
  var dayDone = answeredCount() >= N;
  function streakNow() { return st.streak && st.streak.last >= todayNum - 1 ? st.streak.n : 0; }

  var feed = document.getElementById('feed'), pill = document.getElementById('pill');
  var TYPE = { output: 'What does it print?', choice: 'Pick the right answer', order: 'Tap in the right order', bug: 'Find the line with the bug',
    pipe: '🎮 Mini game · Build the pipeline', indent: '🎮 Mini game · Fix the indentation' };
  var KW = /^(def|return|if|elif|else|for|in|and|or|not|while|break|True|False|None)$/;
  var games = cards.filter(function (c) { return c.t === 'pipe' || c.t === 'indent'; }).length;

  function hl(text, yaml) {
    if (yaml) {
      var m0 = /^(- )?([^:]+):(.*)$/.exec(text);
      if (!m0) return K.esc(text);
      return (m0[1] ? '<span class="d">- </span>' : '') + '<span class="k">' + K.esc(m0[2]) + '</span>:' + (m0[3] ? '<span class="v">' + K.esc(m0[3]) + '</span>' : '');
    }
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
  function shuffleDiff(items) {
    var a = items, tries = 0;
    do { a = K.shuffle(items); tries++; } while (tries < 20 && a.join('\u0001') === items.join('\u0001'));
    return a;
  }

  /* ---------- build the feed */
  function intro() {
    var s = streakNow(), done = answeredCount(), qn = N - games;
    return '<section class="dcard intro" id="c-intro" aria-label="Day ' + dayNum + '">' +
      '<div class="dinner">' +
        '<p class="kicker">Kramavriddhi Daily · ' + (practice ? 'Practice' : 'Today') + '</p>' +
        '<h1>Day ' + dayNum + ' <span>' + dateOf(dayNum) + '</span></h1>' +
        '<p class="lede">' + qn + ' quick tasks' + (games ? ' and ' + (games > 1 ? games + ' mini games' : '1 mini game') : '') + ' from Python, cloud, data and DevOps. About 4 minutes. Scroll down like a feed, answer each one, and read why.</p>' +
        '<div class="dstats"><div><strong>' + (s ? '🔥 ' + s : '0') + '</strong><span>day streak</span></div><div><strong>' + done + '/' + N + '</strong><span>done ' + (practice ? 'on this day' : 'today') + '</span></div></div>' +
        (practice ? '<p class="note">This is an earlier day, for practice. It does not change your streak. <a href="/learn/daily/">Go to today</a></p>' : '') +
        '<button type="button" class="btn go" data-next>' + (done && done < N ? 'Continue ↓' : done >= N ? 'See my answers ↓' : 'Start ↓') + '</button>' +
      '</div></section>';
  }

  function card(c, j) {
    var head = '<div class="dhead"><span class="chip t-' + c.topic.toLowerCase() + '">' + K.esc(c.topic) + '</span><span class="dcount">' + (j + 1) + ' / ' + N + '</span></div>' +
      '<p class="dtype' + (TYPE[c.t].indexOf('🎮') === 0 ? ' game-type' : '') + '">' + TYPE[c.t] + '</p>';
    var body = '';
    if (c.t === 'output') body = codeBlock(c.code.split('\n')) + choiceList(c);
    else if (c.t === 'choice') body = '<h2 class="dq">' + K.rich(c.q) + '</h2>' + choiceList(c);
    else if (c.t === 'bug') body = '<h2 class="dq">' + K.rich(c.q) + '</h2>' + codeBlock(c.code, true);
    else if (c.t === 'order') body = '<h2 class="dq">' + K.rich(c.q) + '</h2><div class="order-list">' + shuffleDiff(c.items).map(function (it) {
        return '<button type="button" class="ord" data-item="' + K.esc(it) + '"><span class="ordn" aria-hidden="true"></span><span>' + K.esc(it) + '</span></button>';
      }).join('') + '</div><button type="button" class="btn ghost ord-reset" hidden>Start again</button>';
    else if (c.t === 'pipe') body = pipeBody(c);
    else if (c.t === 'indent') body = indentBody(c);
    return '<section class="dcard' + (c.t === 'pipe' || c.t === 'indent' ? ' gamecard' : '') + '" id="c-' + j + '" data-j="' + j + '" aria-label="Task ' + (j + 1) + ' of ' + N + '"><div class="dinner">' + head + body +
      '<div class="dres" hidden></div></div></section>';
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
        return '<li><button type="button" class="bugline iline" data-line="' + n + '" data-ind="0" aria-label="Line ' + (n + 1) + ', 0 spaces: ' + K.esc(l[1]) + '"><span class="num" aria-hidden="true">' + (n + 1) + '</span><span class="ws" aria-hidden="true"></span><span class="src">' + hl(l[1], yaml) + '</span></button></li>';
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

  function endCard() { return '<section class="dcard end" id="c-end" aria-label="Day summary"><div class="dinner" id="endin"></div></section>'; }

  feed.innerHTML = intro() + cards.map(card).join('') + endCard();
  document.documentElement.classList.add('snap-feed');

  /* ---------- results */
  function result(j, ok, restoring, verdict) {
    var c = cards[j], sec = document.getElementById('c-' + j), res = sec.querySelector('.dres');
    sec.classList.remove('is-right', 'is-wrong');
    sec.classList.add('answered', ok ? 'is-right' : 'is-wrong');
    sec.classList.toggle('solved-late', !ok && !!verdict);
    var right = c.t === 'order' && !ok ? '<p class="small">The right order:</p><ol class="right-order">' + c.items.map(function (x) { return '<li>' + K.esc(x) + '</li>'; }).join('') + '</ol>' : '';
    res.innerHTML = '<p class="verdict">' + (verdict || (ok ? '✓ Correct!' : '✗ Not quite.')) + (restoring ? ' <span class="muted">(done before)</span>' : '') + '</p>' + right +
      '<p>' + K.rich(c.why) + '</p>' +
      '<button type="button" class="btn primary" data-next>' + (j === N - 1 ? 'See my day ↓' : 'Next ↓') + '</button>';
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

  function record(j, ok, extra) {
    if (!answeredCount() && !practice) K.track('game_start', { game_name: 'kramavriddhi_daily', level: dayNum });
    mine[j] = { ok: ok };
    if (extra) mine[j].tries = extra;
    K.save(STORE, st);
    if (answeredCount() >= N) finishDay();
    updatePill();
  }

  function finishDay() {
    if (dayDone) return;
    dayDone = true;
    if (!practice) {
      if (st.streak.last === todayNum - 1) st.streak.n++;
      else if (st.streak.last !== todayNum) st.streak.n = 1;
      st.streak.last = todayNum;
      st.best = Math.max(st.best || 0, st.streak.n);
      K.track('level_complete', { game_name: 'kramavriddhi_daily', level: dayNum, stars: rightCount() });
    }
    K.save(STORE, st);
    renderEnd();
  }

  /* ---------- mini game logic */
  var tries = {};
  function pipeClick(sec, j, e) {
    var c = cards[j], tray = sec.querySelector('.mtray'), run = sec.querySelector('.mrun'), msg = sec.querySelector('.mmsg');
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
    var c = cards[+sec.getAttribute('data-j')], bdef = id.charAt(0) === 's' ? c.steps[+id.slice(1)] : c.extra[+id.slice(1)];
    sec.querySelector('.mtray').insertAdjacentHTML('beforeend', block(bdef, id));
    s.classList.remove('filled', 'ok'); if (!keepBad) s.classList.remove('bad');
    s.removeAttribute('data-b');
    s.innerHTML = '<span class="mno">' + (+s.getAttribute('data-slot') + 1) + '</span>';
    s.setAttribute('aria-label', 'Step ' + (+s.getAttribute('data-slot') + 1) + ', empty');
  }

  function indentClick(sec, j, e) {
    var c = cards[j], msg = sec.querySelector('.mmsg'), line = e.target.closest('.iline');
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
    var nx = e.target.closest('[data-next]');
    if (nx) { var next = nx.closest('.dcard').nextElementSibling; if (next) scrollToCard(next); return; }
    var sec = e.target.closest('.dcard[data-j]'); if (!sec) return;
    var j = +sec.getAttribute('data-j'), c = cards[j];
    if (mine[j]) return;
    if (c.t === 'pipe') return pipeClick(sec, j, e);
    if (c.t === 'indent') return indentClick(sec, j, e);
    var ch = e.target.closest('.choice');
    if (ch && !ch.disabled) { var ok = ch.getAttribute('data-opt') === c.a; markChoices(sec, c, ch.getAttribute('data-opt')); record(j, ok); result(j, ok); return; }
    var bl = e.target.closest('.bugline');
    if (bl && !bl.disabled) { var p = +bl.getAttribute('data-line'), ok2 = p === c.bad; markBug(sec, c, p); record(j, ok2); result(j, ok2); return; }
    if (e.target.closest('.ord-reset')) { sec.querySelectorAll('.ord').forEach(function (b) { b.removeAttribute('data-n'); b.classList.remove('picked'); b.querySelector('.ordn').textContent = ''; }); e.target.closest('.ord-reset').hidden = true; return; }
    var od = e.target.closest('.ord');
    if (od && !od.disabled && !od.getAttribute('data-n')) {
      var all = sec.querySelectorAll('.ord'), n = sec.querySelectorAll('.ord[data-n]').length + 1;
      od.setAttribute('data-n', n); od.classList.add('picked'); od.querySelector('.ordn').textContent = n;
      sec.querySelector('.ord-reset').hidden = false;
      if (n === all.length) {
        var ok3 = true;
        all.forEach(function (b) { if (c.items.indexOf(b.getAttribute('data-item')) + 1 !== +b.getAttribute('data-n')) ok3 = false; });
        markOrder(sec, c); record(j, ok3); result(j, ok3);
      }
    }
  });

  function scrollToCard(el) {
    el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    var f = el.querySelector('button:not([disabled]):not([hidden]), a'); if (f) setTimeout(function () { f.focus({ preventScroll: true }); }, 400);
  }

  /* ---------- restore answers saved earlier */
  cards.forEach(function (c, j) {
    if (!mine[j]) return;
    var sec = document.getElementById('c-' + j), t = mine[j].tries;
    if (c.t === 'output' || c.t === 'choice') markChoices(sec, c, null);
    else if (c.t === 'bug') markBug(sec, c, null);
    else if (c.t === 'order') { sec.querySelectorAll('.ord').forEach(function (b) { b.setAttribute('data-n', c.items.indexOf(b.getAttribute('data-item')) + 1); b.querySelector('.ordn').textContent = b.getAttribute('data-n'); }); markOrder(sec, c); }
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
    var v = (c.t === 'pipe' || c.t === 'indent') ? (mine[j].ok ? '✓ Solved first try.' : '✓ Solved' + (t ? ' in ' + t + ' tries.' : '.')) : null;
    result(j, mine[j].ok, true, v);
  });

  /* ---------- end card */
  function renderEnd() {
    var el = document.getElementById('endin'), n = answeredCount(), r = rightCount(), s = streakNow();
    var past = '';
    for (var d = todayNum - 1; d >= Math.max(1, todayNum - 14); d--) {
      var a = st.ans[d], full = a && Object.keys(a).length >= cardsOf(d).length;
      past += '<a class="daychip" href="/learn/daily/?day=' + d + '"' + (d === dayNum ? ' aria-current="page"' : '') + '>Day ' + d + (full ? ' ✓' : '') + '</a>';
    }
    if (practice) past = '<a class="daychip" href="/learn/daily/">Today: Day ' + todayNum + '</a>' + past;
    var share = 'I finished Day ' + dayNum + ' of Kramavriddhi Daily: ' + r + ' of ' + N + ' right first time' + (s > 1 ? ', ' + s + '-day streak 🔥' : '') + '. Small tech tasks and a mini game every day, free: ' + URL;
    var finished = n >= N, ratio = r / N;
    el.innerHTML =
      '<p class="kicker">Day ' + dayNum + ' · ' + (finished ? 'complete' : n + ' of ' + N + ' done') + '</p>' +
      (finished
        ? '<h2>' + r + ' of ' + N + ' right first time ' + K.stars(ratio >= 0.99 ? 3 : ratio >= 0.6 ? 2 : 1).replace('class="stars"', 'class="stars big"') + '</h2>' +
          (practice ? '<p>Practice done. Your streak only grows with today’s tasks.</p>'
                    : '<p class="streak-big">🔥 ' + s + ' day streak' + (st.best > s ? ' <span class="muted">(best: ' + st.best + ')</span>' : '') + '</p><p>New tasks unlock tomorrow<span id="cd"></span>. Come back to keep your streak.</p>')
        : '<h2>Almost there</h2><p>Finish all ' + N + ' cards to complete the day' + (practice ? '.' : ' and grow your streak.') + '</p><button type="button" class="btn go" data-first>Go to the next unfinished card ↑</button>') +
      (finished ? '<div class="share"><span class="share-label">Share:</span><a class="share-btn wa" href="' + K.wa(share) + '" target="_blank" rel="noopener">WhatsApp</a></div>' : '') +
      '<h3>Want more games?</h3><div class="more"><a href="/learn/python/">Python games</a><a href="/learn/devops/">Cloud &amp; DevOps games</a></div>' +
      (past ? '<h3>Earlier days</h3><div class="days">' + past + '</div>' : '');
    var first = el.querySelector('[data-first]');
    if (first) first.addEventListener('click', function () { for (var j = 0; j < N; j++) if (!mine[j]) { scrollToCard(document.getElementById('c-' + j)); return; } });
    tick();
  }

  function tick() {
    var el = document.getElementById('cd'); if (!el) return;
    var t = new Date(), ms = new Date(t.getFullYear(), t.getMonth(), t.getDate() + 1) - t;
    el.textContent = ' in ' + Math.floor(ms / 3600000) + ' h ' + Math.floor(ms % 3600000 / 60000) + ' min';
  }
  setInterval(tick, 30000);

  /* ---------- floating progress pill */
  function updatePill() {
    pill.innerHTML = '<span class="pdots" aria-hidden="true">' + cards.map(function (_, j) { return '<i class="' + (mine[j] ? (mine[j].ok ? 'ok' : 'no') : '') + '"></i>'; }).join('') + '</span>' +
      '<span>' + answeredCount() + '/' + N + '</span>' + (practice ? '' : '<span>🔥 ' + streakNow() + '</span>');
    pill.setAttribute('aria-label', answeredCount() + ' of ' + N + ' done' + (practice ? '' : ', streak ' + streakNow() + ' days'));
  }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) { es.forEach(function (en) { pill.classList.toggle('show', !en.isIntersecting); }); }, { threshold: 0.2 }).observe(document.getElementById('c-intro'));
  } else pill.classList.add('show');

  updatePill();
  renderEnd();
})();
