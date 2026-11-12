/* Guess the Output: read a short Python program and pick what it prints. */
(function () {
  'use strict';
  var K = window.KVLearn;
  var STORE = 'kv-learn-py-output';
  var URL = 'https://kramavriddhi.com/learn/python/guess-the-output/';

  /* a: the right answer first; the other choices are common mistakes. */
  var LEVELS = [
    {
      title: 'Text and strings', tag: 'strings',
      qs: [
        { code: 'word = "Python"\nprint(word[0], word[-1])', a: 'P n', w: ['y n', 'P o', 'IndexError'],
          why: 'Python counts positions from **0**, so `word[0]` is `P`. A negative index counts from the end: `word[-1]` is the last letter, `n`.' },
        { code: 's = "Kramavriddhi"\nprint(s[0:5])', a: 'Krama', w: ['Kramav', 'ramav', 'Kram'],
          why: 'A slice `s[0:5]` takes positions 0, 1, 2, 3 and 4. The **end number is not included**, so you get 5 letters: `Krama`.' },
        { code: 'name = "ravi"\nprint(name.upper(), len(name))', a: 'RAVI 4', w: ['Ravi 4', 'RAVI 5', 'ravi 4'],
          why: '`.upper()` makes every letter capital. `len()` counts the characters: r, a, v, i is 4.' }
      ],
      learned: ['Positions start at **0**; `-1` is the last item.', 'In a slice `[start:end]`, the end is not included.', '`.upper()`, `.lower()` and `len()` are everyday string tools.']
    },
    {
      title: 'Numbers and maths', tag: 'operators',
      qs: [
        { code: 'print(7 / 2, 7 // 2)', a: '3.5 3', w: ['3 3', '3.5 3.5', '3.5 4'],
          why: '`/` always gives a decimal (a float): `3.5`. `//` is **floor division**: it drops the part after the point, so `3`.' },
        { code: 'print(17 % 5, 2 ** 3)', a: '2 8', w: ['3 6', '2 6', '3.4 8'],
          why: '`%` gives the **remainder**: 17 = 5 × 3 + 2, so `2`. `**` is power: 2 × 2 × 2 = `8`.' },
        { code: 'a = "5"\nb = 2\nprint(a * b)', a: '55', w: ['10', '7', 'TypeError'],
          why: '`a` is text (it has quotes), not a number. Text times a number **repeats** the text: `"5" * 2` is `55`. Use `int(a) * b` to get 10.' }
      ],
      learned: ['`/` gives a decimal, `//` drops the decimal part.', '`%` is the remainder, `**` is the power.', '`"5"` (text) and `5` (number) are different types. Text × number repeats the text.']
    },
    {
      title: 'Lists', tag: 'lists',
      qs: [
        { code: 'fruits = ["mango", "banana", "guava"]\nfruits.append("jamun")\nprint(len(fruits), fruits[-1])', a: '4 jamun', w: ['3 guava', '4 guava', '3 jamun'],
          why: '`.append()` adds one item to the **end** of the list. Now there are 4 items and the last one (`[-1]`) is `jamun`.' },
        { code: 'nums = [10, 20, 30, 40, 50]\nprint(nums[1:3])', a: '[20, 30]', w: ['[10, 20, 30]', '[20, 30, 40]', '[10, 20]'],
          why: 'Position 1 is `20` (position 0 is `10`). The slice stops **before** position 3, so you get `[20, 30]`.' },
        { code: 'marks = [70, 45, 90]\nmarks.sort()\nprint(marks[0], max(marks))', a: '45 90', w: ['70 90', '90 45', '45 70'],
          why: '`.sort()` puts the list in order, smallest first: `[45, 70, 90]`. So `marks[0]` is `45`. `max()` gives the biggest: `90`.' }
      ],
      learned: ['`.append(x)` adds to the end; `len()` counts items.', 'List slices work like string slices: the end is not included.', '`.sort()` changes the list itself, smallest first.']
    },
    {
      title: 'Loops', tag: 'for + range',
      qs: [
        { code: 'for i in range(3):\n    print(i)', a: '0\n1\n2', w: ['1\n2\n3', '0\n1\n2\n3', '3'],
          why: '`range(3)` gives 3 numbers starting at **0**: 0, 1, 2. It stops before 3. The `print` is inside the loop, so it runs 3 times.' },
        { code: 'total = 0\nfor n in range(1, 5):\n    total += n\nprint(total)', a: '10', w: ['15', '4', '1\n3\n6\n10'],
          why: '`range(1, 5)` is 1, 2, 3, 4 (5 is not included). 1 + 2 + 3 + 4 = `10`. `print` is outside the loop, so it prints only once.' },
        { code: 'for word in ["red", "stop", "blue"]:\n    if word == "stop":\n        break\n    print(word)', a: 'red', w: ['red\nblue', 'red\nstop', 'red\nstop\nblue'],
          why: '`break` **leaves the loop at once**. It prints `red`, then finds `stop` and exits before printing. `blue` is never reached. (`continue` would skip only `stop`.)' }
      ],
      learned: ['`range(n)` starts at 0 and stops before `n`.', '`range(a, b)` starts at `a` and stops before `b`.', '`break` ends the loop; `continue` skips to the next item.', 'Indentation decides what repeats: inside the loop runs many times, outside runs once.']
    },
    {
      title: 'Tricky ones', tag: 'boss level',
      qs: [
        { code: 'a = [1, 2, 3]\nb = a\nb.append(4)\nprint(a)', a: '[1, 2, 3, 4]', w: ['[1, 2, 3]', '[4]', 'None'],
          why: '`b = a` does **not** copy the list. Both names point to the same list, so changing `b` also changes `a`. Use `b = a.copy()` for a real copy.' },
        { code: 'def add(x, y=10):\n    return x + y\n\nprint(add(5), add(5, 1))', a: '15 6', w: ['6 15', '15 15', 'TypeError'],
          why: '`y=10` is a **default value**. `add(5)` uses it: 5 + 10 = 15. `add(5, 1)` passes `y` = 1, so 5 + 1 = 6.' },
        { code: 'ages = {"Asha": 21, "Ravi": 25}\nprint(ages.get("Kiran", 0), ages["Ravi"])', a: '0 25', w: ['None 25', 'KeyError', '0 Ravi'],
          why: 'A **dictionary** maps keys to values. `.get("Kiran", 0)` returns the default `0` because Kiran is missing (`ages["Kiran"]` would crash with KeyError). `ages["Ravi"]` is `25`.' },
        { code: 'squares = [n * n for n in range(4)]\nprint(squares)', a: '[0, 1, 4, 9]', w: ['[1, 4, 9, 16]', '[0, 1, 4, 9, 16]', '[0, 2, 4, 6]'],
          why: 'This is a **list comprehension**: a loop inside `[ ]` that builds a list. `range(4)` is 0, 1, 2, 3, and their squares are 0, 1, 4, 9.' }
      ],
      learned: ['`b = a` shares one list; `a.copy()` makes a new one.', 'Default parameter values are used when you leave an argument out.', 'Dictionaries: `d[key]` crashes if the key is missing, `d.get(key, default)` does not.', '`[expr for x in items]` builds a list in one line.']
    }
  ];

  var $ = function (id) { return document.getElementById(id); };
  var elLevels = $('levels'), elBrief = $('brief'), elQ = $('quiz'), elMsg = $('msg'), elDone = $('done');

  var progress = K.load(STORE, null);
  if (!progress || !Array.isArray(progress.stars)) progress = { stars: [0, 0, 0, 0, 0] };

  var lv = 0, lvl, qi = 0, mistakes = 0, answered = false, order = [];

  function unlocked(i) { return i === 0 || (progress.stars[i - 1] || 0) > 0; }
  function firstOpen() { for (var i = 0; i < LEVELS.length; i++) if (!progress.stars[i]) return i; return 0; }

  function renderLevels() {
    elLevels.innerHTML = LEVELS.map(function (L, i) {
      var open = unlocked(i), s = progress.stars[i] || 0;
      return '<li><button type="button" class="lv" data-lv="' + i + '"' + (i === lv ? ' aria-current="step"' : '') + (open ? '' : ' disabled') +
        ' aria-label="Level ' + (i + 1) + (open ? (s ? ', ' + s + ' stars' : '') : ', locked') + '">' + (i + 1) +
        (open ? K.stars(s) : '<span aria-hidden="true">🔒</span>') + '</button></li>';
    }).join('');
  }

  var KW = /^(def|return|if|elif|else|for|in|and|or|not|while|break|continue|True|False|None)$/;
  function hl(text) {
    var re = /("[^"]*")|(\b\d+\b)|([A-Za-z_]\w*)|(\s+)|(.)/g, m, s = '', prevDef = false;
    while ((m = re.exec(text))) {
      if (m[1]) s += '<span class="v">' + K.esc(m[1]) + '</span>';
      else if (m[2]) s += '<span class="b">' + m[2] + '</span>';
      else if (m[3]) {
        var w = m[3], next = text.charAt(re.lastIndex);
        s += KW.test(w) ? '<span class="k">' + w + '</span>' : (prevDef || next === '(') ? '<span class="fn">' + w + '</span>' : K.esc(w);
        prevDef = w === 'def'; continue;
      } else s += K.esc(m[0]);
      if (!m[4]) prevDef = false;
    }
    return s;
  }

  function startLevel(i) {
    lv = i; lvl = LEVELS[i]; qi = 0; mistakes = 0;
    elBrief.innerHTML = '<p class="kicker">Level ' + (i + 1) + ' of ' + LEVELS.length + ' · ' + K.esc(lvl.tag) + '</p><h2>' + K.esc(lvl.title) + '</h2>' +
      '<p>' + lvl.qs.length + ' short programs. Read each one carefully and pick exactly what it prints.</p>';
    elDone.hidden = true; elDone.innerHTML = '';
    elQ.hidden = false;
    renderLevels(); renderQ();
    K.track('game_start', { game_name: 'python_guess_the_output', level: i + 1 });
  }

  function renderQ() {
    var q = lvl.qs[qi];
    answered = false;
    order = K.shuffle([q.a].concat(q.w));
    var codeLines = q.code.split('\n');
    elQ.innerHTML =
      '<div class="qhead"><span>Program ' + (qi + 1) + ' of ' + lvl.qs.length + '</span><span class="qdots" aria-hidden="true">' +
        lvl.qs.map(function (_, n) { return '<i class="' + (n < qi ? 'past' : n === qi ? 'now' : '') + '"></i>'; }).join('') + '</span></div>' +
      '<div class="editor"><div class="ed-bar"><span class="file">quiz.py</span><span>Read it, then choose</span></div>' +
        '<pre class="snippet" aria-label="Python program">' + codeLines.map(function (l, n) {
          return '<span class="sl"><span class="num" aria-hidden="true">' + (n + 1) + '</span>' + hl(l) + '</span>';
        }).join('\n') + '</pre></div>' +
      '<h3 class="qask" id="qask">What does this program print?</h3>' +
      '<div class="choices" role="group" aria-labelledby="qask">' + order.map(function (c, n) {
        return '<button type="button" class="choice" data-c="' + n + '"><span class="key" aria-hidden="true">' + 'ABCD'.charAt(n) + '</span><pre>' + K.esc(c) + '</pre></button>';
      }).join('') + '</div>' +
      '<div class="reveal" id="reveal" hidden></div>';
    say('');
  }

  function say(t, kind) { elMsg.textContent = t; elMsg.className = 'gmsg' + (kind ? ' ' + kind : ''); }

  function choose(n) {
    if (answered) return;
    answered = true;
    var q = lvl.qs[qi], right = order[n] === q.a;
    if (!right) mistakes++;
    elQ.querySelectorAll('.choice').forEach(function (b, k) {
      b.disabled = true;
      if (order[k] === q.a) b.classList.add('right');
      else if (k === n) b.classList.add('wrong');
      b.setAttribute('aria-label', 'Choice ' + 'ABCD'.charAt(k) + ': ' + order[k].replace(/\n/g, ', ') + (order[k] === q.a ? ' (correct answer)' : k === n ? ' (your choice, wrong)' : ''));
    });
    var last = qi === lvl.qs.length - 1, rv = document.getElementById('reveal');
    rv.className = 'reveal ' + (right ? 'good' : 'bad');
    rv.innerHTML =
      '<div class="term small"><span class="p">learner@python</span>:<span class="dm">~</span>$ python3 quiz.py\n' + K.esc(q.a) + '</div>' +
      '<p><strong>' + (right ? 'Correct!' : 'Not quite.') + '</strong> ' + K.rich(q.why) + '</p>' +
      '<div class="actions"><button type="button" class="btn primary" data-go>' + (last ? 'See my stars' : 'Next program') + '</button></div>';
    rv.hidden = false;
    say(right ? 'Correct!' : 'Not quite. The right answer is marked in green.', right ? 'good' : 'bad');
    rv.querySelector('[data-go]').focus({ preventScroll: true });
    rv.scrollIntoView({ block: 'nearest', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }

  function next() {
    if (qi < lvl.qs.length - 1) { qi++; renderQ(); var c = elQ.querySelector('.choice'); elQ.scrollIntoView({ block: 'start' }); if (c) c.focus({ preventScroll: true }); return; }
    finish();
  }

  function finish() {
    var st = mistakes === 0 ? 3 : mistakes === 1 ? 2 : 1;
    if (st > (progress.stars[lv] || 0)) progress.stars[lv] = st;
    K.save(STORE, progress);
    K.track('level_complete', { game_name: 'python_guess_the_output', level: lv + 1, stars: st });
    renderLevels();
    elQ.hidden = true; say('');
    var last = lv === LEVELS.length - 1, t = progress.stars.reduce(function (s, n) { return s + (n || 0); }, 0), n = lvl.qs.length;
    var share = 'I have ' + t + ' of 15 stars in “Guess the Output”, a free Python puzzle game. Can you beat me? ' + URL;
    elDone.innerHTML =
      '<h2>' + (last ? 'All levels done!' : 'Level ' + (lv + 1) + ' complete') + ' ' + K.stars(st).replace('class="stars"', 'class="stars big"') + '</h2>' +
      '<p class="score">' + (n - mistakes) + ' of ' + n + ' right. Total: ' + t + ' of 15 stars.</p>' +
      '<h3>What you learned</h3><ul class="learned">' + lvl.learned.map(function (s) { return '<li>' + K.rich(s) + '</li>'; }).join('') + '</ul>' +
      '<div class="actions">' +
        (last ? '<a class="btn primary" href="/learn/python/fix-the-code/">Play Fix the Code</a>' : '<button type="button" class="btn primary" data-next>Next level</button>') +
        (st < 3 ? '<button type="button" class="btn ghost" data-again>Try for 3 stars</button>' : '') +
      '</div>' +
      '<div class="share"><span class="share-label">Share your score:</span><a class="share-btn wa" href="' + K.wa(share) + '" target="_blank" rel="noopener">WhatsApp</a></div>';
    elDone.hidden = false;
    elDone.focus({ preventScroll: true });
    elDone.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  }

  elQ.addEventListener('click', function (e) {
    var c = e.target.closest('.choice'); if (c && !c.disabled) { choose(+c.dataset.c); return; }
    if (e.target.closest('[data-go]')) next();
  });
  elDone.addEventListener('click', function (e) {
    if (e.target.closest('[data-next]')) { startLevel(lv + 1); elBrief.scrollIntoView({ block: 'start' }); }
    else if (e.target.closest('[data-again]')) { startLevel(lv); elBrief.scrollIntoView({ block: 'start' }); }
  });
  elLevels.addEventListener('click', function (e) { var b = e.target.closest('.lv'); if (b && !b.disabled) startLevel(+b.dataset.lv); });

  window.__pyout = { LEVELS: LEVELS, answer: function () { return order.indexOf(lvl.qs[qi].a); } };

  startLevel(firstOpen());
})();
