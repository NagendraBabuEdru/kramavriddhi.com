/* Fix the Code: reorder and indent Python lines, then run them in a tiny built-in Python runner. */
(function () {
  'use strict';
  var K = window.KVLearn;
  var STORE = 'kv-learn-py-fix';
  var URL = 'https://kramavriddhi.com/learn/python/fix-the-code/';
  var FILE = 'main.py';
  var MAXIND = 12, STEP = 4;

  /* Each line: [spaces, text, how it runs]. Kinds: s = statement, a = name it assigns,
     if/elif = condition, else, for = loop variable + it = list, def = function name + p = params, ret = return value. */
  var LEVELS = [
    {
      title: 'Hello, variables', tag: 'variables + print', brief: 'Python runs a program from the top line to the bottom line. These four lines are in the wrong order. Put them back so the program prints the expected output.',
      lines: [
        [0, 'name = "Asha"', { a: 'name', s: function (e) { e.set('name', 'Asha'); } }],
        [0, 'age = 21', { a: 'age', s: function (e) { e.set('age', 21); } }],
        [0, 'print("Hello,", name)', { s: function (e) { e.out('Hello,', e.g('name')); } }],
        [0, 'print(f"Next year you will be {age + 1}")', { s: function (e) { e.out('Next year you will be ' + (e.g('age') + 1)); } }]
      ],
      expect: ['Hello, Asha', 'Next year you will be 22'],
      learned: [
        'A **variable** is a name for a value. `name = "Asha"` stores the text `Asha` in `name`.',
        'You must create a variable **before** you use it. Using it too early gives `NameError`.',
        '`print("Hello,", name)` prints both values with a space between them.',
        'An **f-string** like `f"... {age + 1}"` puts the result of the code inside `{ }` into the text.'
      ]
    },
    {
      title: 'Pass or fail', tag: 'if / else', keepOrder: true,
      brief: 'The lines are in the right order, but every indent was lost. In Python the spaces at the start of a line decide which block it belongs to. Fix them.',
      lines: [
        [0, 'marks = 72', { a: 'marks', s: function (e) { e.set('marks', 72); } }],
        [0, 'if marks >= 35:', { 'if': function (e) { return e.g('marks') >= 35; } }],
        [4, 'print("Pass")', { s: function (e) { e.out('Pass'); } }],
        [0, 'else:', { 'else': 1 }],
        [4, 'print("Fail")', { s: function (e) { e.out('Fail'); } }],
        [0, 'print("Result checked")', { s: function (e) { e.out('Result checked'); } }]
      ],
      expect: ['Pass', 'Result checked'],
      learned: [
        'A line that ends with a colon `:` starts a **block**. The lines under it are indented by 4 spaces.',
        '`if` runs its block only when the condition is `True`. Otherwise the `else:` block runs.',
        '`else:` lines up with its `if`, at the same indent.',
        'The last `print` is back at 0 spaces, so it is outside the if/else and always runs.'
      ]
    },
    {
      title: 'Add them up', tag: 'for loop + list',
      brief: 'Add every number in the list and print the total once. Think about which line must repeat inside the loop and which must not.',
      lines: [
        [0, 'nums = [4, 8, 15]', { a: 'nums', s: function (e) { e.set('nums', [4, 8, 15]); } }],
        [0, 'total = 0', { a: 'total', s: function (e) { e.set('total', 0); } }],
        [0, 'for n in nums:', { 'for': 'n', it: function (e) { return e.g('nums'); } }],
        [4, 'total = total + n', { a: 'total', s: function (e) { e.set('total', e.g('total') + e.g('n')); } }],
        [0, 'print("Total:", total)', { s: function (e) { e.out('Total:', e.g('total')); } }]
      ],
      expect: ['Total: 27'],
      learned: [
        'A **list** holds many values in order: `[4, 8, 15]`.',
        '`for n in nums:` runs its block once for every item, with `n` set to that item.',
        'The total must start at 0 **before** the loop. Inside the loop it would be reset every time.',
        'The `print` is outside the loop (0 spaces), so it runs once, after the loop ends. Inside, it would print 3 times.'
      ]
    },
    {
      title: 'Write a function', tag: 'def + return',
      brief: 'A function is a reusable block of code. Build a greet function and call it twice.',
      lines: [
        [0, 'def greet(name):', { def: 'greet', p: ['name'] }],
        [4, 'message = "Namaste, " + name', { a: 'message', s: function (e) { e.set('message', 'Namaste, ' + e.g('name')); } }],
        [4, 'return message', { ret: function (e) { return e.g('message'); } }],
        [0, 'print(greet("Ravi"))', { s: function (e) { e.out(e.call('greet', ['Ravi'])); } }],
        [0, 'print(greet("Lakshmi"))', { s: function (e) { e.out(e.call('greet', ['Lakshmi'])); } }]
      ],
      expect: ['Namaste, Ravi', 'Namaste, Lakshmi'],
      learned: [
        '`def greet(name):` defines a function. `name` is a **parameter**: it gets the value you pass in.',
        'The function body is indented. It does not run until you **call** the function: `greet("Ravi")`.',
        'Define a function before you call it, or Python says `NameError`.',
        '`return` sends a value back to the caller. `print(greet("Ravi"))` prints what came back.',
        '`+` joins two pieces of text.'
      ]
    },
    {
      title: 'Count the even numbers', tag: 'function + loop + if',
      brief: 'Boss level. A function that counts the even numbers in a list. Three blocks inside each other: def, for and if. Watch where `return` goes.',
      lines: [
        [0, 'def count_even(numbers):', { def: 'count_even', p: ['numbers'] }],
        [4, 'count = 0', { a: 'count', s: function (e) { e.set('count', 0); } }],
        [4, 'for n in numbers:', { 'for': 'n', it: function (e) { return e.g('numbers'); } }],
        [8, 'if n % 2 == 0:', { 'if': function (e) { return e.g('n') % 2 === 0; } }],
        [12, 'count = count + 1', { a: 'count', s: function (e) { e.set('count', e.g('count') + 1); } }],
        [4, 'return count', { ret: function (e) { return e.g('count'); } }],
        [0, 'print(count_even([3, 6, 8, 11, 14]))', { s: function (e) { e.out(e.call('count_even', [[3, 6, 8, 11, 14]])); } }],
        [0, 'print(count_even([7, 10]))', { s: function (e) { e.out(e.call('count_even', [[7, 10]])); } }]
      ],
      expect: ['3', '1'],
      learned: [
        '`n % 2` is the remainder after dividing by 2. When it is `0`, the number is even.',
        'Blocks can sit inside blocks: the `if` is inside the `for`, which is inside the function. Each level adds 4 spaces.',
        '`return count` is at 4 spaces, after the loop. Inside the loop it would stop the function after the first number.',
        'One function, many calls: the same code counted two different lists.'
      ]
    }
  ];

  var $ = function (id) { return document.getElementById(id); };
  var elLevels = $('levels'), elBrief = $('brief'), elCode = $('yaml'), elRun = $('run'), elReset = $('reset'), elMsg = $('msg'),
      elExpect = $('expect'), elTerm = $('term'), elFix = $('fixit'), elDone = $('done');

  var progress = K.load(STORE, null);
  if (!progress || !Array.isArray(progress.stars)) progress = { stars: [0, 0, 0, 0, 0] };

  var lv = 0, lvl, canon, canonTree, lines, sel = null, fails = 0, solved = false, running = false, runToken = 0;

  function kindOf(sp) { return sp['if'] ? 'if' : sp.elif ? 'elif' : sp['else'] ? 'else' : sp['for'] ? 'for' : sp.def ? 'def' : sp.ret ? 'ret' : 's'; }
  function opens(sp) { var k = kindOf(sp); return k === 'if' || k === 'elif' || k === 'else' || k === 'for' || k === 'def'; }

  /* ---------- parse: Python's indentation rules, then a block tree */
  function PyErr(type, msg, at) { this.type = type; this.msg = msg; this.at = at; }
  function blockWord(sp) { var k = kindOf(sp); return k === 'def' ? 'function definition' : '\'' + k + '\' statement'; }

  function parse(ls) {
    var stack = [0], root = { kids: [] }, open = [{ ind: 0, node: root }];
    for (var i = 0; i < ls.length; i++) {
      var L = ls[i], prev = i > 0 ? ls[i - 1] : null;
      if (prev && opens(prev.sp)) {
        if (L.ind <= prev.ind) throw new PyErr('IndentationError', 'expected an indented block after ' + blockWord(prev.sp) + ' on line ' + i, i);
        stack.push(L.ind);
      } else if (L.ind > stack[stack.length - 1]) {
        throw new PyErr('IndentationError', 'unexpected indent', i);
      } else if (L.ind < stack[stack.length - 1]) {
        while (stack.length && L.ind < stack[stack.length - 1]) stack.pop();
        if (stack[stack.length - 1] !== L.ind) throw new PyErr('IndentationError', 'unindent does not match any outer indentation level', i);
      }
      while (open.length > 1 && open[open.length - 1].ind > L.ind) open.pop();
      var parent = open[open.length - 1].node, node = { i: i, line: L, kind: kindOf(L.sp), kids: [], parent: parent };
      if (node.kind === 'else' || node.kind === 'elif') {
        var sib = parent.kids[parent.kids.length - 1];
        var okPrev = sib && (sib.kind === 'if' || sib.kind === 'elif' || (node.kind === 'else' && sib.kind === 'for'));
        if (!okPrev) throw new PyErr('SyntaxError', 'invalid syntax', i);
      }
      if (node.kind === 'ret') {
        var up = parent, inDef = false;
        while (up) { if (up.kind === 'def') { inDef = true; break; } up = up.parent; }
        if (!inDef) throw new PyErr('SyntaxError', '\'return\' outside function', i);
      }
      parent.kids.push(node);
      if (opens(L.sp)) open.push({ ind: L.ind + 1, node: node });
    }
    var last = ls[ls.length - 1];
    if (opens(last.sp)) throw new PyErr('IndentationError', 'expected an indented block after ' + blockWord(last.sp) + ' on line ' + ls.length, ls.length - 1);
    return root;
  }

  /* ---------- run the tree */
  function pyStr(v, inner) {
    if (v === null || v === undefined) return 'None';
    if (v === true) return 'True'; if (v === false) return 'False';
    if (Array.isArray(v)) return '[' + v.map(function (x) { return pyStr(x, true); }).join(', ') + ']';
    if (typeof v === 'string') return inner ? '\'' + v + '\'' : v;
    if (typeof v === 'object' && v.fn) return '<function ' + v.name + ' at 0x7f3a2c1e0d60>';
    return String(v);
  }

  function assigned(node, set) {
    node.kids.forEach(function (k) {
      if (k.line.sp.a) set[k.line.sp.a] = 1;
      if (k.line.sp['for']) set[k.line.sp['for']] = 1;
      if (k.kind === 'def') set[k.line.sp.def] = 1; else assigned(k, set);
    });
    return set;
  }

  function RetSig(v) { this.v = v; }

  function execute(tree) {
    var out = [], steps = 0, globals = {}, frames = [{ vars: globals, where: '<module>', line: 0, locals: null }];
    var e = {
      out: function () { out.push(Array.prototype.map.call(arguments, function (a) { return pyStr(a); }).join(' ')); },
      set: function (n, v) { frames[frames.length - 1].vars[n] = v; },
      g: function (n) {
        var f = frames[frames.length - 1];
        if (Object.prototype.hasOwnProperty.call(f.vars, n)) return f.vars[n];
        if (f.locals && f.locals[n]) throw new PyErr('UnboundLocalError', 'cannot access local variable \'' + n + '\' where it is not associated with a value', f.line);
        if (Object.prototype.hasOwnProperty.call(globals, n)) return globals[n];
        throw new PyErr('NameError', 'name \'' + n + '\' is not defined', f.line);
      },
      call: function (n, args) {
        var fn = e.g(n), v = {};
        fn.params.forEach(function (p, k) { v[p] = args[k]; });
        frames.push({ vars: v, where: n, line: fn.node.i, locals: fn.locals });
        if (frames.length > 50) throw new PyErr('RecursionError', 'maximum recursion depth exceeded', fn.node.i);
        try { block(fn.node.kids); } catch (x) { if (x instanceof RetSig) { frames.pop(); return x.v; } throw x; }
        frames.pop(); return null;
      }
    };
    function block(nodes) {
      for (var k = 0; k < nodes.length; k++) {
        var nd = nodes[k], sp = nd.line.sp;
        if (++steps > 4000) throw new PyErr('Stopped', 'the program ran too long', nd.i);
        frames[frames.length - 1].line = nd.i;
        if (nd.kind === 's') sp.s(e);
        else if (nd.kind === 'ret') throw new RetSig(sp.ret(e));
        else if (nd.kind === 'def') e.set(sp.def, { fn: 1, name: sp.def, params: sp.p, node: nd, locals: (function () { var s = assigned(nd, {}); sp.p.forEach(function (p) { s[p] = 1; }); return s; })() });
        else if (nd.kind === 'for') {
          var arr = sp.it(e);
          for (var j = 0; j < arr.length; j++) { e.set(sp['for'], arr[j]); block(nd.kids); frames[frames.length - 1].line = nd.i; }
          if (nodes[k + 1] && nodes[k + 1].kind === 'else') { k++; block(nodes[k].kids); }
        } else if (nd.kind === 'if') {
          var done = false;
          if (sp['if'](e)) { block(nd.kids); done = true; }
          while (nodes[k + 1] && (nodes[k + 1].kind === 'elif' || nodes[k + 1].kind === 'else')) {
            k++; var c = nodes[k];
            if (done) continue;
            frames[frames.length - 1].line = c.i;
            if (c.kind === 'else' || c.line.sp.elif(e)) { block(c.kids); done = true; }
          }
        } else if (nd.kind === 'else' || nd.kind === 'elif') { /* handled with its if */ }
      }
    }
    try { block(tree.kids); return { out: out }; }
    catch (x) {
      if (x instanceof PyErr) return { out: out, err: x, stack: frames.map(function (f) { return { where: f.where, line: f.line }; }) };
      throw x;
    }
  }

  /* ---------- level setup */
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

  /* true if this order, with every line at 0 spaces, would already print the expected output */
  function solves(order) {
    try {
      var r = execute(parse(order.map(function (l) { return { id: l.id, text: l.text, sp: l.sp, ind: 0 }; })));
      return !r.err && r.out.join('\n') === lvl.expect.join('\n');
    } catch (x) { return false; }
  }

  function prompt() { return '<span class="p">learner@python</span>:<span class="dm">~</span>$ '; }

  function startLevel(i) {
    runToken++; running = false;
    lv = i; lvl = LEVELS[i];
    canon = lvl.lines.map(function (l, n) { return { id: n, ind: l[0], text: l[1], sp: l[2] }; });
    canonTree = parse(canon);
    var order = canon.slice();
    if (!lvl.keepOrder) {
      var key = function (a) { return a.map(function (l) { return l.id; }).join(); };
      var tries = 0;
      do { order = K.shuffle(canon); tries++; } while (tries < 50 && (key(order) === key(canon) || solves(order)));
    }
    lines = order.map(function (l) { return { id: l.id, text: l.text, sp: l.sp, ind: 0 }; });
    sel = lines[0].id; fails = 0; solved = false;
    elBrief.innerHTML = '<p class="kicker">Level ' + (i + 1) + ' of ' + LEVELS.length + ' · ' + K.esc(lvl.tag) + '</p><h2>' + K.esc(lvl.title) + '</h2><p>' + K.rich(lvl.brief) + '</p>';
    elDone.hidden = true; elDone.innerHTML = ''; elFix.hidden = true;
    say('');
    renderExpect(null);
    elTerm.innerHTML = prompt() + '<span class="cursor"></span>';
    renderLevels(); render();
    K.track('game_start', { game_name: 'python_fix_the_code', level: i + 1 });
  }

  function renderExpect(got) {
    elExpect.innerHTML = '<div class="ex-head"><span>Expected output</span>' + (got ? '<span>Your output</span>' : '') + '</div>' +
      '<ol class="ex-lines' + (got ? ' two' : '') + '">' + (function () {
        var n = Math.max(lvl.expect.length, got ? got.length : 0), s = '';
        for (var k = 0; k < n; k++) {
          var w = lvl.expect[k], g = got ? got[k] : undefined, ok = got && w === g;
          s += '<li><span class="ex-w">' + (w === undefined ? '<span class="dm">(nothing)</span>' : K.esc(w)) + '</span>' +
            (got ? '<span class="ex-g ' + (ok ? 'ok' : 'er') + '"><span class="vh">' + (ok ? 'matches: ' : 'different: ') + '</span>' + (g === undefined ? '<span class="dm">(nothing)</span>' : K.esc(g)) + '</span>' : '') + '</li>';
        }
        return s;
      })() + '</ol>';
  }

  /* Python syntax colours */
  var KW = /^(def|return|if|elif|else|for|in|and|or|not|while|break|True|False|None)$/;
  function hl(text) {
    var re = /(f?"[^"]*")|(\b\d+\b)|([A-Za-z_]\w*)|(\s+)|(.)/g, m, s = '', prevDef = false;
    while ((m = re.exec(text))) {
      if (m[1]) s += '<span class="v">' + K.esc(m[1]) + '</span>';
      else if (m[2]) s += '<span class="b">' + m[2] + '</span>';
      else if (m[3]) {
        var w = m[3], next = text.charAt(re.lastIndex);
        if (KW.test(w)) s += '<span class="k">' + w + '</span>';
        else if (prevDef || next === '(') s += '<span class="fn">' + w + '</span>';
        else s += K.esc(w);
        prevDef = w === 'def'; continue;
      } else s += K.esc(m[0]);
      if (!m[4]) prevDef = false;
    }
    return s;
  }

  function render(focus, bad) {
    elCode.innerHTML = lines.map(function (l, n) {
      var label = 'Line ' + (n + 1) + ', ' + l.ind + ' spaces: ' + l.text;
      return '<li class="ln' + (bad === n ? ' badline' : '') + '" data-id="' + l.id + '"><span class="grip" data-grip="' + l.id + '" aria-hidden="true"></span>' +
        '<button type="button" class="code" data-id="' + l.id + '" aria-pressed="' + (sel === l.id) + '" aria-label="' + K.esc(label) + '">' +
        '<span class="num" aria-hidden="true">' + (n + 1) + '</span><span class="ws" aria-hidden="true">' + new Array(l.ind + 1).join('·') + '</span>' + hl(l.text) + '</button></li>';
    }).join('');
    var idx = indexOfSel(), dis = solved || running || idx < 0;
    document.querySelectorAll('.tbtn').forEach(function (b) {
      var a = b.dataset.act;
      b.disabled = dis || (a === 'up' && idx === 0) || (a === 'down' && idx === lines.length - 1) ||
        (a === 'out' && lines[idx].ind === 0) || (a === 'in' && lines[idx].ind >= MAXIND);
    });
    elRun.disabled = running || solved;
    if (focus) { var f = elCode.querySelector('.code[data-id="' + sel + '"]'); if (f) f.focus({ preventScroll: false }); }
  }

  function indexOfSel() { for (var i = 0; i < lines.length; i++) if (lines[i].id === sel) return i; return -1; }

  function act(a) {
    var i = indexOfSel();
    if (i < 0 || solved || running) return;
    var l = lines[i];
    if (a === 'up' && i > 0) { lines.splice(i, 1); lines.splice(i - 1, 0, l); }
    else if (a === 'down' && i < lines.length - 1) { lines.splice(i, 1); lines.splice(i + 1, 0, l); }
    else if (a === 'out' && l.ind > 0) l.ind -= STEP;
    else if (a === 'in' && l.ind < MAXIND) l.ind += STEP;
    else return;
    elFix.hidden = true;
    render(true);
    say('Line ' + (indexOfSel() + 1) + ' now has ' + l.ind + ' spaces.');
  }

  function say(t, kind) { elMsg.textContent = t; elMsg.className = 'gmsg' + (kind ? ' ' + kind : ''); }

  document.querySelector('.tools').addEventListener('click', function (e) {
    var b = e.target.closest('.tbtn'); if (b && !b.disabled) { act(b.dataset.act); var f = elCode.querySelector('.code[data-id="' + sel + '"]'); if (f) f.scrollIntoView({ block: 'nearest' }); b.focus(); }
  });
  elCode.addEventListener('click', function (e) {
    var c = e.target.closest('.code'); if (!c || dragMoved) return;
    sel = +c.dataset.id; render(true);
  });
  elCode.addEventListener('keydown', function (e) {
    var c = e.target.closest('.code'); if (!c) return;
    sel = +c.dataset.id;
    var i = indexOfSel(), map = null;
    if (e.shiftKey && e.key === 'ArrowUp') map = 'up';
    else if (e.shiftKey && e.key === 'ArrowDown') map = 'down';
    else if (e.key === 'ArrowLeft') map = 'out';
    else if (e.key === 'ArrowRight') map = 'in';
    if (map) { e.preventDefault(); act(map); return; }
    if (e.key === 'ArrowUp' && i > 0) { e.preventDefault(); sel = lines[i - 1].id; render(true); }
    if (e.key === 'ArrowDown' && i < lines.length - 1) { e.preventDefault(); sel = lines[i + 1].id; render(true); }
  });

  /* drag the handle: up/down moves the line, left/right changes the indent */
  var drag = null, dragMoved = false;
  elCode.addEventListener('pointerdown', function (e) {
    var g = e.target.closest('.grip'); if (!g || solved || running) return;
    e.preventDefault();
    var id = +g.dataset.grip, row = g.parentNode, num = row.querySelector('.num');
    sel = id;
    var i = indexOfSel();
    drag = { id: id, pid: e.pointerId, x: e.clientX, y: e.clientY, i0: i, ind0: lines[i].ind, h: row.getBoundingClientRect().height || 40,
      step: Math.max(20, (num.getBoundingClientRect().width / 2.6) * STEP) };
    render();
    var r = elCode.querySelector('.ln[data-id="' + id + '"]'); if (r) r.classList.add('dragging');
  });
  window.addEventListener('pointermove', function (e) {
    if (!drag || e.pointerId !== drag.pid) return;
    e.preventDefault();
    var ni = Math.max(0, Math.min(lines.length - 1, drag.i0 + Math.round((e.clientY - drag.y) / drag.h)));
    var nind = Math.max(0, Math.min(MAXIND, drag.ind0 + Math.round((e.clientX - drag.x) / drag.step) * STEP));
    var i = indexOfSel(), l = lines[i];
    if (ni !== i || nind !== l.ind) {
      lines.splice(i, 1); lines.splice(ni, 0, l); l.ind = nind; elFix.hidden = true;
      render();
      var r = elCode.querySelector('.ln[data-id="' + drag.id + '"]'); if (r) r.classList.add('dragging');
    }
  }, { passive: false });
  function endDrag(e) {
    if (!drag || e.pointerId !== drag.pid) return;
    drag = null; dragMoved = true; setTimeout(function () { dragMoved = false; }, 50);
    render(true);
    var n = indexOfSel(); say('Line ' + (n + 1) + ' now has ' + lines[n].ind + ' spaces.');
  }
  window.addEventListener('pointerup', endDrag);
  window.addEventListener('pointercancel', endDrag);

  /* ---------- terminal */
  function playScript(steps, done) {
    var token = ++runToken, i = 0;
    running = true; render();
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    (function next() {
      if (token !== runToken) return;
      if (i >= steps.length) { running = false; elTerm.innerHTML += '\n' + prompt() + '<span class="cursor"></span>'; elTerm.scrollTop = elTerm.scrollHeight; render(); done(); return; }
      var s = steps[i++];
      elTerm.innerHTML += s.t + '\n'; elTerm.scrollTop = elTerm.scrollHeight;
      setTimeout(next, reduce ? 0 : (s.d || 140));
    })();
  }

  function src(i) { return K.esc(lines[i].text); }
  function fileLine(i, where) { return '  File "/home/learner/' + FILE + '", line ' + (i + 1) + (where ? ', in ' + K.esc(where) : ''); }

  /* ---------- teaching tips */
  function canonOf(text) { for (var n = 0; n < canon.length; n++) if (canon[n].text === text) return n; return -1; }
  function canonParent(ci) { var found = null; (function walk(nd) { nd.kids.forEach(function (k) { if (k.i === ci) found = nd; else walk(k); }); })(canonTree); return found; }

  function expectedWhere(text, userParent) {
    var ci = canonOf(text), c = canon[ci], p = canonParent(ci), t = '`' + c.text + '`';
    if (!p || p.line === undefined) {
      var extra = userParent && userParent.kind === 'for' ? ' Inside the loop it runs again for every item.' : userParent && userParent.kind === 'def' ? ' Inside the function it only runs when the function is called.' : '';
      return t + ' belongs at the left edge (0 spaces), outside every block.' + extra;
    }
    var pt = '`' + p.line.text + '`', sp = c.ind + ' spaces';
    if (p.kind === 'for') return t + ' must be inside the loop ' + pt + ', at ' + sp + ', so it runs for every item.';
    if (p.kind === 'def') return t + ' is part of the function. Put it at ' + sp + ' under ' + pt + '.';
    if (p.kind === 'if' || p.kind === 'elif') return t + ' should run only when ' + pt + ' is true. Put it at ' + sp + ' under that line.';
    if (p.kind === 'else') return t + ' is the else branch. Put it at ' + sp + ' under ' + pt + '.';
    return t + ' goes inside ' + pt + ' at ' + sp + '.';
  }

  function definer(name) {
    for (var n = 0; n < canon.length; n++) { var sp = canon[n].sp; if (sp.a === name || sp.def === name || sp['for'] === name || (sp.p && sp.p.indexOf(name) >= 0)) return canon[n]; }
    return null;
  }

  function errTip(err) {
    var m = /'([^']+)'/.exec(err.msg), name = m ? m[1] : '', d = definer(name);
    if (err.type === 'NameError' && d && d.sp.def) return 'Python runs from the top. The function `' + name + '` is used before the line `' + d.text + '` has run. Define a function above the lines that call it.';
    if (err.type === 'NameError' && d && d.sp.p) return '`' + name + '` only exists inside the function. ' + expectedWhere(lines[err.at].text);
    if (err.type === 'NameError' && d) return '`' + name + '` is used before it has a value. The line `' + d.text + '` must come earlier' + (d.ind ? ', at ' + d.ind + ' spaces inside its block.' : '.');
    if (err.type === 'UnboundLocalError' && d) return 'Inside a function, `' + name + '` must get its first value before it is used. ' + expectedWhere(d.text);
    return expectedWhere(lines[err.at].text);
  }

  function parseTip(err) {
    var i = err.at, L = lines[i];
    if (/expected an indented block/.test(err.msg)) {
      var opener = /line (\d+)/.exec(err.msg), oi = +opener[1] - 1;
      if (!lines[oi + 1]) return 'The last line `' + lines[oi].text + '` ends with a colon `:`, so it needs a block under it, but nothing comes after it. Move it up, or move the lines that belong inside it below it and indent them.';
      return 'Line ' + (oi + 1) + ' ends with a colon `:`, so the next line must be pushed in further (4 more spaces). ' + (lines[oi + 1] ? expectedWhere(lines[oi + 1].text) : '');
    }
    if (err.msg === 'unexpected indent') return 'Line ' + (i + 1) + ' has more spaces than the line above, but the line above does not end with `:`. ' + expectedWhere(L.text);
    if (/unindent/.test(err.msg)) return 'The spaces on line ' + (i + 1) + ' do not line up with any block above it. ' + expectedWhere(L.text);
    if (/return/.test(err.msg)) return '`return` only works inside a function. ' + expectedWhere(L.text);
    return '`' + L.text + '` must come straight after its `if` block, at the same indent as the `if`. ' + expectedWhere(L.text);
  }

  function wrongTip(tree) {
    /* 1. a line in the wrong block */
    var userPar = {};
    (function walk(nd) { nd.kids.forEach(function (k) { userPar[k.line.text] = nd; walk(k); }); })(tree);
    for (var n = 0; n < lines.length; n++) {
      var up = userPar[lines[n].text], cp = canonParent(canonOf(lines[n].text));
      var a = up && up.line ? up.line.text : '', b = cp && cp.line ? cp.line.text : '';
      if (a !== b) return { at: n, tip: expectedWhere(lines[n].text, up) };
    }
    /* 2. right blocks, wrong order */
    for (var k = 0; k < lines.length; k++) if (lines[k].text !== canon[k].text) {
      return { at: k, tip: 'Every line is in the right block, but the order is off. Python runs top to bottom: `' + canon[k].text + '` should come before `' + lines[k].text + '`.' };
    }
    return { at: -1, tip: 'Compare your output with the expected output, line by line.' };
  }

  /* ---------- run */
  elRun.addEventListener('click', function () {
    if (running || solved) return;
    elFix.hidden = true;
    elTerm.innerHTML = prompt() + 'python3 ' + FILE + '\n';
    var tree;
    try { tree = parse(lines); }
    catch (err) {
      if (!(err instanceof PyErr)) throw err;
      var i = err.at;
      var t = fileLine(i) + '\n    ' + src(i) + '\n    <span class="er">^</span>\n<span class="er">' + err.type + ': ' + K.esc(err.msg) + '</span>';
      renderExpect([]);
      return fail([{ t: t, d: 200 }], i, parseTip(err), 'Python could not read the program, so nothing ran.');
    }
    var r = execute(tree), steps = r.out.map(function (o) { return { t: K.esc(o) }; });
    if (r.err) {
      var x = r.err, tb = 'Traceback (most recent call last):\n' + r.stack.map(function (f) { return fileLine(f.line, f.where) + '\n    ' + src(f.line); }).join('\n') +
        '\n<span class="er">' + x.type + ': ' + K.esc(x.msg) + '</span>';
      steps.push({ t: tb, d: 200 });
      renderExpect(r.out);
      return fail(steps, x.at, errTip(x), 'The program crashed with a ' + x.type + '.');
    }
    renderExpect(r.out);
    var same = r.out.length === lvl.expect.length && r.out.every(function (o, n) { return o === lvl.expect[n]; });
    if (!same) {
      var w = wrongTip(tree);
      if (!r.out.length) steps.push({ t: '<span class="dm">(the program printed nothing)</span>' });
      return fail(steps, w.at, w.tip, 'It ran, but the output is not what we expected.');
    }
    win(steps);
  });

  function fail(steps, badIdx, tip, line) {
    fails++;
    say(line + ' Read the yellow box and try again.', 'bad');
    playScript(steps, function () {
      render(false, badIdx);
      elFix.innerHTML = '<strong>How to fix it:</strong> ' + (badIdx >= 0 ? 'look at line ' + (badIdx + 1) + ' (red). ' : '') + K.rich(tip);
      elFix.hidden = false;
    });
  }

  function win(steps) {
    solved = true;
    var st = fails === 0 ? 3 : fails === 1 ? 2 : 1;
    if (st > (progress.stars[lv] || 0)) progress.stars[lv] = st;
    K.save(STORE, progress);
    K.track('level_complete', { game_name: 'python_fix_the_code', level: lv + 1, stars: st });
    say('Running…');
    playScript(steps, function () {
      say('Correct! The output matches.', 'good');
      renderLevels();
      showDone(st);
    });
  }

  function total() { return progress.stars.reduce(function (s, n) { return s + (n || 0); }, 0); }

  function showDone(st) {
    var last = lv === LEVELS.length - 1, t = total();
    var share = 'I have ' + t + ' of 15 stars in “Fix the Code”, a free Python puzzle game. Can you beat me? ' + URL;
    elDone.innerHTML =
      '<h2>' + (last ? 'All levels done!' : 'Level ' + (lv + 1) + ' complete') + ' ' + K.stars(st).replace('class="stars"', 'class="stars big"') + '</h2>' +
      '<p class="score">' + (fails === 0 ? 'Right first time.' : fails + ' failed run' + (fails > 1 ? 's' : '') + ' before success.') + ' Total: ' + t + ' of 15 stars.</p>' +
      '<h3>What you learned</h3><ul class="learned">' + lvl.learned.map(function (s) { return '<li>' + K.rich(s) + '</li>'; }).join('') + '</ul>' +
      '<div class="actions">' +
        (last ? '<a class="btn primary" href="/learn/python/guess-the-output/">Play Guess the Output</a>' : '<button type="button" class="btn primary" data-next>Next level</button>') +
        (st < 3 ? '<button type="button" class="btn ghost" data-again>Try for 3 stars</button>' : '') +
      '</div>' +
      '<div class="share"><span class="share-label">Share your score:</span><a class="share-btn wa" href="' + K.wa(share) + '" target="_blank" rel="noopener">WhatsApp</a></div>';
    elDone.hidden = false;
    elDone.focus({ preventScroll: true });
    elDone.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  }

  elDone.addEventListener('click', function (e) {
    if (e.target.closest('[data-next]')) { startLevel(lv + 1); elBrief.scrollIntoView({ block: 'start' }); }
    else if (e.target.closest('[data-again]')) { startLevel(lv); elBrief.scrollIntoView({ block: 'start' }); }
  });
  elReset.addEventListener('click', function () { startLevel(lv); });
  elLevels.addEventListener('click', function (e) { var b = e.target.closest('.lv'); if (b && !b.disabled) startLevel(+b.dataset.lv); });

  /* test hook for automated checks */
  window.__pyfix = { parse: parse, execute: execute, LEVELS: LEVELS, set: function (arr) { lines = arr; render(); }, get: function () { return lines; }, canon: function () { return canon; } };

  startLevel(firstOpen());
})();
