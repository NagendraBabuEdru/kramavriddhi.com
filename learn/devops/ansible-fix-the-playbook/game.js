/* Fix the Playbook: reorder and indent YAML lines, then run a simulated ansible-playbook. */
(function () {
  'use strict';
  var K = window.KVLearn;
  var STORE = 'kv-learn-playbook';
  var URL = 'https://kramavriddhi.com/learn/devops/ansible-fix-the-playbook/';
  var HOSTS = ['web1', 'web2'];
  var MAXIND = 10;

  /* lines: [spaces, text] in the correct order */
  var LEVELS = [
    {
      title: 'Install nginx', tag: 'ansible.builtin.apt', file: 'site.yml', keepOrder: true,
      brief: 'The lines are already in the right order, but every indent was lost. Push each line to the right depth so Ansible can read it.',
      lines: [[0, '- name: Install web server'], [2, 'hosts: web'], [2, 'become: true'], [2, 'tasks:'],
        [4, '- name: Install nginx'], [6, 'ansible.builtin.apt:'], [8, 'name: nginx'], [8, 'state: present'], [8, 'update_cache: true']],
      learned: [
        'A playbook is a YAML **list of plays**. Each play says which `hosts` to run on and which `tasks` to run there.',
        '`become: true` runs the tasks with sudo (as root). Installing packages needs it.',
        '`ansible.builtin.apt` is the full name of the apt module (its FQCN). The short name `apt` also works, but the full name is the recommended style.',
        '`state: present` means “make sure it is installed”. `update_cache: true` runs `apt update` first.',
        'YAML uses **spaces, never tabs**. One line that ends with a colon holds the lines indented under it.'
      ]
    },
    {
      title: 'Copy a web page', tag: 'ansible.builtin.copy', file: 'site.yml',
      brief: 'Now the lines are scrambled too. This play copies a home page from your computer to every web server.',
      lines: [[0, '- name: Publish home page'], [2, 'hosts: web'], [2, 'become: true'], [2, 'tasks:'],
        [4, '- name: Copy the home page'], [6, 'ansible.builtin.copy:'], [8, 'src: files/index.html'], [8, 'dest: /var/www/html/index.html'], [8, 'mode: "0644"']],
      learned: [
        '`ansible.builtin.copy` sends a file from the control node (your machine) to each server. `src` is found in the playbook’s `files/` folder.',
        '`dest` is the full path on the server.',
        '`mode: "0644"` sets file permissions (owner can write, everyone can read). Quote it so YAML keeps it as text with the leading zero.',
        'Order of keys inside one block does not matter: `src`, `dest` and `mode` can be in any order.'
      ]
    },
    {
      title: 'Install, then start', tag: 'ansible.builtin.service', file: 'site.yml',
      brief: 'Two tasks this time. Tasks run from top to bottom, so think about which one must come first.',
      lines: [[0, '- name: Run nginx'], [2, 'hosts: web'], [2, 'become: true'], [2, 'tasks:'],
        [4, '- name: Install nginx'], [6, 'ansible.builtin.apt:'], [8, 'name: nginx'], [8, 'state: present'],
        [4, '- name: Start nginx'], [6, 'ansible.builtin.service:'], [8, 'name: nginx'], [8, 'state: started'], [8, 'enabled: true']],
      orderFail: { task: '- name: Start nginx', msg: 'Could not find the requested service nginx: host',
        tip: 'Tasks run top to bottom. You cannot start nginx before it is installed, so the **Install nginx** task must come first.' },
      learned: [
        'Tasks run **in order, top to bottom**, on every server in the group.',
        '`ansible.builtin.service` controls services. `state: started` starts it if it is not running; `enabled: true` starts it again after a reboot.',
        'Both modules use `name: nginx`, but each belongs to its own task.'
      ]
    },
    {
      title: 'Use a variable', tag: 'vars + Jinja2', file: 'site.yml',
      brief: 'Do not repeat yourself: put the package name in a variable once and use it in the task.',
      lines: [[0, '- name: Set up web server'], [2, 'hosts: web'], [2, 'become: true'], [2, 'vars:'], [4, 'web_package: nginx'], [2, 'tasks:'],
        [4, '- name: Install the web package'], [6, 'ansible.builtin.apt:'], [8, 'name: "{{ web_package }}"'], [8, 'state: present']],
      learned: [
        '`vars:` defines variables for the whole play. Here `web_package` is `nginx`.',
        '`{{ web_package }}` is Jinja2: Ansible replaces it with the value before running the task.',
        'When a value **starts** with `{{`, put it in quotes, or YAML thinks it is a dictionary.',
        'Variables can also come from the inventory, `group_vars/` files or `-e` on the command line.'
      ]
    },
    {
      title: 'Restart only when needed', tag: 'handlers + notify', file: 'site.yml',
      brief: 'Boss level. Copy a new nginx config, and restart nginx only if the config really changed. That is what handlers are for.',
      lines: [[0, '- name: Configure nginx'], [2, 'hosts: web'], [2, 'become: true'], [2, 'tasks:'],
        [4, '- name: Copy nginx config'], [6, 'ansible.builtin.template:'], [8, 'src: templates/nginx.conf.j2'], [8, 'dest: /etc/nginx/nginx.conf'],
        [6, 'notify: Restart nginx'], [2, 'handlers:'], [4, '- name: Restart nginx'], [6, 'ansible.builtin.service:'], [8, 'name: nginx'], [8, 'state: restarted']],
      learned: [
        '`notify: Restart nginx` belongs to the **task**, next to the module. It calls the handler with exactly that name.',
        'Handlers run once, at the end of the play, and **only if** a task that notifies them reported `changed`.',
        'Run it again with no config change: the template task says `ok`, nothing is notified, and nginx is not restarted. That is idempotency.',
        '`ansible.builtin.template` is like copy, but fills in Jinja2 variables in the `.j2` file first.'
      ]
    }
  ];

  var PLAY_KEYS = ['name', 'hosts', 'become', 'vars', 'tasks', 'handlers', 'gather_facts', 'remote_user'];
  var TASK_KEYS = ['name', 'become', 'notify', 'vars', 'when', 'register', 'loop', 'tags'];
  var STATES = { 'ansible.builtin.apt': 'absent, build-dep, latest, present, fixed', 'ansible.builtin.service': 'reloaded, restarted, started, stopped' };

  var $ = function (id) { return document.getElementById(id); };
  var elLevels = $('levels'), elBrief = $('brief'), elYaml = $('yaml'), elRun = $('run'), elReset = $('reset'), elMsg = $('msg'),
      elServers = $('servers'), elTerm = $('term'), elFix = $('fixit'), elDone = $('done'), elFname = $('fname');

  var progress = K.load(STORE, null);
  if (!progress || !Array.isArray(progress.stars)) progress = { stars: [0, 0, 0, 0, 0] };

  var lv = 0, lvl, canon, canonPar, lines, sel = null, fails = 0, solved = false, running = false, runToken = 0;

  /* ---------- YAML-ish analysis */
  function info(t) {
    var dash = t.indexOf('- ') === 0, body = dash ? t.slice(2) : t, c = body.indexOf(':');
    var val = body.slice(c + 1).trim();
    return { dash: dash, key: body.slice(0, c), val: val, hasVal: val !== '' };
  }

  function analyze(ls) {
    var I = ls.map(function (l) { return info(l.text); }), par = [];
    function err(type, at, j) { return { err: type, at: at, near: j, par: par }; }
    for (var i = 0; i < ls.length; i++) {
      var L = ls[i], li = I[i], p = null, found = false;
      for (var j = i - 1; j >= 0; j--) {
        var P = ls[j], pi = I[j];
        if (P.ind > L.ind) continue;
        if (P.ind === L.ind) {
          if (pi.dash === li.dash) { p = par[j]; found = true; break; }
          return err('mix', i, j);
        }
        if (pi.dash && !li.dash && P.ind + 2 === L.ind) { p = j; found = true; break; }
        if (!pi.hasVal) {
          if (L.ind === P.ind + (pi.dash ? 2 : 0) + 2) { p = j; found = true; break; }
          return err('indent', i, j);
        }
        return err('value', i, j);
      }
      if (!found) {
        if (L.ind !== 0) return err('indent', i, -1);
        if (!li.dash) return err('rootmap', i, -1);
        p = -1;
      }
      par[i] = p;
    }
    /* children of one parent must be all list items or all keys */
    var kind = {};
    for (var n = 0; n < ls.length; n++) {
      var k = par[n] + ':' + (I[n].dash ? 'd' : 'k'), other = par[n] + ':' + (I[n].dash ? 'k' : 'd');
      if (kind[other] !== undefined) return err(par[n] >= 0 && /^(tasks|handlers)$/.test(I[par[n]].key) && !I[n].dash ? 'malformed' : 'mix', n, kind[other]);
      if (kind[k] === undefined) kind[k] = n;
    }
    return { par: par };
  }

  function sigs(ls, par) {
    var out = [];
    function s(i) { if (out[i] !== undefined) return out[i]; out[i] = (par[i] >= 0 ? s(par[i]) + '\u0001' : '') + ls[i].text; return out[i]; }
    for (var i = 0; i < ls.length; i++) s(i);
    return out;
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

  function startLevel(i) {
    runToken++; running = false;
    lv = i; lvl = LEVELS[i];
    canon = lvl.lines.map(function (l, n) { return { id: n, ind: l[0], text: l[1] }; });
    canonPar = analyze(canon).par;
    var order = canon.slice();
    if (!lvl.keepOrder) { do { order = K.shuffle(canon); } while (order.map(function (l) { return l.id; }).join() === canon.map(function (l) { return l.id; }).join()); }
    lines = order.map(function (l) { return { id: l.id, text: l.text, ind: 0 }; });
    sel = lines[0].id; fails = 0; solved = false;
    elFname.textContent = lvl.file;
    elBrief.innerHTML = '<p class="kicker">Level ' + (i + 1) + ' of ' + LEVELS.length + ' · ' + K.esc(lvl.tag) + '</p><h2>' + K.esc(lvl.title) + '</h2><p>' + K.esc(lvl.brief) + '</p>';
    elDone.hidden = true; elDone.innerHTML = ''; elFix.hidden = true;
    say('');
    setServers('idle');
    elTerm.innerHTML = '<span class="p">devops@control</span>:<span class="dm">~</span>$ <span class="cursor"></span>';
    elRun.disabled = false;
    renderLevels(); render();
    K.track('game_start', { game_name: 'ansible_fix_the_playbook', level: i + 1 });
  }

  function hl(text) {
    var f = info(text), s = '';
    if (f.dash) s += '<span class="d">- </span>';
    s += '<span class="k">' + K.esc(f.key) + '</span>:';
    if (f.hasVal) s += ' <span class="' + (/^(true|false|yes|no)$/.test(f.val) ? 'b' : 'v') + '">' + K.esc(f.val) + '</span>';
    return s;
  }

  function render(focus, bad) {
    elYaml.innerHTML = lines.map(function (l, n) {
      var label = 'Line ' + (n + 1) + ', ' + l.ind + ' spaces: ' + l.text;
      return '<li class="ln' + (bad === n ? ' badline' : '') + '" data-id="' + l.id + '"><span class="grip" data-grip="' + l.id + '" aria-hidden="true"></span>' +
        '<button type="button" class="code" data-id="' + l.id + '" aria-pressed="' + (sel === l.id) + '" aria-label="' + K.esc(label) + '">' +
        '<span class="num" aria-hidden="true">' + (n + 1) + '</span><span class="ws" aria-hidden="true">' + new Array(l.ind + 1).join('·') + '</span>' + hl(l.text) + '</button></li>';
    }).join('');
    var idx = indexOfSel(), dis = solved || running || idx < 0;
    document.querySelectorAll('.tbtn').forEach(function (b) {
      var a = b.dataset.act, off = dis || (a === 'up' && idx === 0) || (a === 'down' && idx === lines.length - 1) ||
        (a === 'out' && lines[idx].ind === 0) || (a === 'in' && lines[idx].ind >= MAXIND);
      b.disabled = off;
    });
    if (focus) { var f = elYaml.querySelector('.code[data-id="' + sel + '"]'); if (f) f.focus({ preventScroll: false }); }
  }

  function indexOfSel() { for (var i = 0; i < lines.length; i++) if (lines[i].id === sel) return i; return -1; }

  function act(a) {
    var i = indexOfSel();
    if (i < 0 || solved || running) return;
    var l = lines[i];
    if (a === 'up' && i > 0) { lines.splice(i, 1); lines.splice(i - 1, 0, l); }
    else if (a === 'down' && i < lines.length - 1) { lines.splice(i, 1); lines.splice(i + 1, 0, l); }
    else if (a === 'out' && l.ind > 0) l.ind -= 2;
    else if (a === 'in' && l.ind < MAXIND) l.ind += 2;
    else return;
    elFix.hidden = true;
    render(true);
    var n = indexOfSel();
    say('Line ' + (n + 1) + ' now has ' + l.ind + ' spaces.');
  }

  function say(t, kind) { elMsg.textContent = t; elMsg.className = 'gmsg' + (kind ? ' ' + kind : ''); }

  document.querySelector('.tools').addEventListener('click', function (e) {
    var b = e.target.closest('.tbtn'); if (b && !b.disabled) { act(b.dataset.act); var f = elYaml.querySelector('.code[data-id="' + sel + '"]'); if (f) f.scrollIntoView({ block: 'nearest' }); b.focus(); }
  });

  elYaml.addEventListener('click', function (e) {
    var c = e.target.closest('.code'); if (!c || dragMoved) return;
    sel = +c.dataset.id; render(true);
  });

  elYaml.addEventListener('keydown', function (e) {
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

  /* ---------- drag the handle: vertical moves the line, horizontal changes the indent */
  var drag = null, dragMoved = false;
  elYaml.addEventListener('pointerdown', function (e) {
    var g = e.target.closest('.grip'); if (!g || solved || running) return;
    e.preventDefault();
    var id = +g.dataset.grip, row = g.parentNode, num = row.querySelector('.num');
    sel = id;
    var i = indexOfSel();
    drag = { id: id, pid: e.pointerId, x: e.clientX, y: e.clientY, i0: i, ind0: lines[i].ind, h: row.getBoundingClientRect().height || 40,
      step: Math.max(14, (num.getBoundingClientRect().width / 2.6) * 2) };
    render();
    var r = elYaml.querySelector('.ln[data-id="' + id + '"]'); if (r) r.classList.add('dragging');
  });
  window.addEventListener('pointermove', function (e) {
    if (!drag || e.pointerId !== drag.pid) return;
    e.preventDefault();
    var ni = Math.max(0, Math.min(lines.length - 1, drag.i0 + Math.round((e.clientY - drag.y) / drag.h)));
    var nind = Math.max(0, Math.min(MAXIND, drag.ind0 + Math.round((e.clientX - drag.x) / drag.step) * 2));
    var i = indexOfSel(), l = lines[i];
    if (ni !== i || nind !== l.ind) {
      lines.splice(i, 1); lines.splice(ni, 0, l); l.ind = nind; elFix.hidden = true;
      render();
      var r = elYaml.querySelector('.ln[data-id="' + drag.id + '"]'); if (r) r.classList.add('dragging');
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

  /* ---------- servers and terminal */
  function setServers(state, extra) {
    var label = { idle: 'Waiting', run: 'Running…', ok: 'ok', fail: 'failed', nc: 'Not contacted' }[state];
    elServers.innerHTML = HOSTS.map(function (h) {
      return '<div class="srv ' + state + '"><span class="rack" aria-hidden="true"><i></i><i></i><i></i></span><div><strong>' + h + '</strong><span>' + label + (extra ? ' · ' + extra : '') + '</span></div></div>';
    }).join('');
  }

  function stars(t) { var n = Math.max(3, 44 - t.length); return t + ' ' + new Array(n + 1).join('*'); }
  function recap(ok, ch, failed) {
    return HOSTS.map(function (h) {
      var c = failed ? 'er' : ch ? 'ch' : 'ok';
      return '<span class="' + c + '">' + h + '</span>                       : <span class="ok">ok=' + ok + '</span>    <span class="' + (ch ? 'ch' : '') + '">changed=' + ch + '</span>    unreachable=0    <span class="' + (failed ? 'er' : '') + '">failed=' + (failed ? 1 : 0) + '</span>    skipped=0    rescued=0    ignored=0';
    }).join('\n');
  }

  function playScript(steps, done) {
    var token = ++runToken, i = 0;
    running = true; render();
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    (function next() {
      if (token !== runToken) return;
      if (i >= steps.length) { running = false; elTerm.innerHTML += '\n<span class="p">devops@control</span>:<span class="dm">~</span>$ <span class="cursor"></span>'; elTerm.scrollTop = elTerm.scrollHeight; render(); done(); return; }
      var s = steps[i++];
      if (s.fn) s.fn();
      if (s.t !== undefined) { elTerm.innerHTML += s.t + '\n'; elTerm.scrollTop = elTerm.scrollHeight; }
      setTimeout(next, reduce ? 0 : (s.d || 90));
    })();
  }

  function cmd() { return '<span class="p">devops@control</span>:<span class="dm">~</span>$ ansible-playbook -i inventory.ini ' + lvl.file + '\n'; }

  function tasksOf(listKey) {
    var out = [];
    canon.forEach(function (l, i) { var p = canonPar[i]; if (p >= 0 && info(canon[p].text).key === listKey && info(l.text).dash) out.push(info(l.text).val); });
    return out;
  }

  /* ---------- run */
  elRun.addEventListener('click', function () {
    if (running || solved) return;
    elFix.hidden = true;
    elTerm.innerHTML = cmd();
    var a = analyze(lines);
    if (a.err) return fail(syntaxSteps(a), a.at, a.err === 'rootmap' ? 'nc' : 'nc');
    var mine = sigs(lines, a.par), want = sigs(canon, canonPar), pool = {};
    want.forEach(function (s) { pool[s] = (pool[s] || 0) + 1; });
    for (var i = 0; i < lines.length; i++) {
      if (pool[mine[i]]) { pool[mine[i]]--; continue; }
      return structural(i, a.par);
    }
    /* list order (tasks run top to bottom) */
    var o = listOrder(lines, a.par, mine), w = listOrder(canon, canonPar, want);
    for (var key in w) {
      if (o[key] !== w[key] && lvl.orderFail) {
        var bad = -1; lines.forEach(function (l, n) { if (l.text === lvl.orderFail.task) bad = n; });
        var steps = runSteps([]);
        steps.push({ t: '\n' + '<span class="hd">' + stars('TASK [' + info(lvl.orderFail.task).val + ']') + '</span>', d: 500, fn: function () { setServers('run'); } });
        HOSTS.forEach(function (h) { steps.push({ t: '<span class="er">fatal: [' + h + ']: FAILED! =&gt; {"changed": false, "msg": "' + K.esc(lvl.orderFail.msg) + '"}</span>', d: 160 }); });
        steps.push({ t: '\n<span class="hd">' + stars('PLAY RECAP') + '</span>\n' + recap(1, 0, true), fn: function () { setServers('fail'); } });
        return fail(steps, bad, null, lvl.orderFail.tip);
      }
    }
    win();
  });

  function listOrder(ls, par, sg) {
    var m = {};
    ls.forEach(function (l, i) { if (info(l.text).dash) { var k = par[i] >= 0 ? sg[par[i]] : '#root'; m[k] = (m[k] ? m[k] + '\u0002' : '') + l.text; } });
    return m;
  }

  function runSteps(prefix) {
    var playName = info(canon[0].text).val;
    return prefix.concat([
      { t: '<span class="hd">' + stars('PLAY [' + playName + ']') + '</span>\n', d: 300, fn: function () { setServers('run'); } },
      { t: '<span class="hd">' + stars('TASK [Gathering Facts]') + '</span>', d: 500 },
      { t: '<span class="ok">ok: [web1]</span>', d: 120 }, { t: '<span class="ok">ok: [web2]</span>', d: 200 }
    ]);
  }

  function expectedWhere(text) {
    var ci = -1;
    for (var n = 0; n < canon.length; n++) if (canon[n].text === text) { ci = n; break; }
    var c = canon[ci], p = canonPar[ci], t = '`' + c.text + '`', sp = c.ind + ' spaces';
    if (p < 0) return t + ' starts the play. It goes on the first line, at the very left (0 spaces).';
    var pt = canon[p].text, pf = info(pt), ptx = '`' + pt + '`', key = info(c.text).key;
    if (pf.dash && canonPar[p] < 0) return t + ' is a play setting. Put it at ' + sp + ', under the play’s ' + ptx + ' line.';
    if (pf.key === 'tasks' || pf.key === 'handlers') return t + ' starts a ' + (pf.key === 'handlers' ? 'handler' : 'task') + '. Put it inside ' + ptx + ', at ' + sp + '.';
    if (pf.dash) {
      if (key.indexOf('.') > 0) return t + ' is the module this task runs. Put it at ' + sp + ', under the task’s ' + ptx + ' line.';
      return t + ' belongs to the task itself, at the same level as the module (' + sp + '), not inside the module.';
    }
    if (pf.key === 'vars') return t + ' defines a variable, so it goes inside `vars:` at ' + sp + '.';
    if (pf.key.indexOf('.') > 0) return t + ' is an option of ' + ptx + '. Put it at ' + sp + ', one step deeper than the module line.';
    return t + ' goes inside ' + ptx + ' at ' + sp + '.';
  }

  function where(i) { return 'The error appears to be in \'/home/devops/' + lvl.file + '\': line ' + (i + 1) + ', column ' + (lines[i].ind + 1) + ', but may\nbe elsewhere in the file depending on the exact syntax problem.'; }

  function offending(i) {
    var s = '\nThe offending line appears to be:\n\n';
    if (i > 0) s += K.esc(new Array(lines[i - 1].ind + 1).join(' ') + lines[i - 1].text) + '\n';
    s += K.esc(new Array(lines[i].ind + 1).join(' ') + lines[i].text) + '\n' + new Array(lines[i].ind + 1).join(' ') + '<span class="er">^ here</span>';
    return s;
  }

  function syntaxSteps(a) {
    var i = a.at, t;
    if (a.err === 'rootmap') {
      t = '<span class="er">ERROR! A playbook must be a list of plays, got a &lt;class \'ansible.parsing.yaml.objects.AnsibleMapping\'&gt; instead</span>\n\n' + where(i);
    } else if (a.err === 'malformed') {
      t = '<span class="er">ERROR! A malformed block was encountered while loading tasks: it should be a list or None</span>\n\n' + where(i) + '\n' + offending(i);
    } else {
      var reason = a.err === 'value' ? 'mapping values are not allowed in this context' : 'did not find expected key';
      if (a.err === 'mix') reason = 'did not find expected \'-\' indicator';
      t = '<span class="er">ERROR! We were unable to read either as JSON nor YAML, these are the errors we got from each:</span>\nJSON: Expecting value: line 1 column 1 (char 0)\n\n<span class="er">Syntax Error while loading YAML.</span>\n  ' + reason + '\n\n' + where(i) + '\n' + offending(i);
    }
    return [{ t: t, d: 300, fn: function () { setServers('nc'); } }];
  }

  function structural(i, par) {
    var L = lines[i], f = info(L.text), ap = par[i], steps, pre = true;
    var apf = ap >= 0 ? info(lines[ap].text) : null;
    var parentIsPlay = ap >= 0 && apf.dash && par[ap] < 0;
    var parentIsTask = ap >= 0 && apf.dash && par[ap] >= 0;
    var parentIsModule = ap >= 0 && !apf.dash && apf.key.indexOf('.') > 0;
    var msg = null;
    if (ap < 0) msg = 'ERROR! the field \'hosts\' is required but was not set';
    else if (parentIsPlay && PLAY_KEYS.indexOf(f.key) < 0) msg = 'ERROR! \'' + f.key + '\' is not a valid attribute for a Play';
    else if (parentIsTask && f.key.indexOf('.') > 0) {
      var other = null; lines.forEach(function (l, n) { var g = info(l.text); if (n !== i && par[n] === ap && g.key.indexOf('.') > 0) other = g.key; });
      msg = other ? 'ERROR! conflicting action statements: ' + other + ', ' + f.key : null;
    } else if (parentIsTask && TASK_KEYS.indexOf(f.key) < 0) msg = 'ERROR! \'' + f.key + '\' is not a valid attribute for a Task';
    else if (parentIsModule) {
      pre = false;
      var taskLine = par[ap] >= 0 ? info(lines[par[ap]].text).val : 'task';
      var fatal = f.key === 'state' && STATES[apf.key]
        ? 'value of state must be one of: ' + STATES[apf.key] + ', got: ' + f.val
        : 'Unsupported parameters for (' + apf.key + ') module: ' + f.key;
      steps = runSteps([]);
      steps.push({ t: '\n<span class="hd">' + stars('TASK [' + taskLine + ']') + '</span>', d: 500 });
      HOSTS.forEach(function (h) { steps.push({ t: '<span class="er">fatal: [' + h + ']: FAILED! =&gt; {"changed": false, "msg": "' + K.esc(fatal) + '"}</span>', d: 160 }); });
      steps.push({ t: '\n<span class="hd">' + stars('PLAY RECAP') + '</span>\n' + recap(1, 0, true), fn: function () { setServers('fail'); } });
    }
    if (pre) {
      var body = msg ? '<span class="er">' + K.esc(msg) + '</span>\n\n' + where(i) + '\n' + offending(i)
        : '<span class="er">✗ Playbook check failed: line ' + (i + 1) + ' is valid YAML, but it is in the wrong place.</span>\n<span class="dm">(Ansible might run it, but not the way this play needs.)</span>';
      steps = [{ t: body, d: 300, fn: function () { setServers('nc'); } }];
    }
    fail(steps, i, null);
  }

  function fail(steps, badIdx, _s, tip) {
    fails++;
    say('The playbook failed. Read the yellow box, fix it and run again.', 'bad');
    playScript(steps, function () {
      render(false, badIdx);
      var text = tip || (badIdx >= 0 ? expectedWhere(lines[badIdx].text) : 'Check the indentation.');
      elFix.innerHTML = '<strong>How to fix it:</strong> ' + (badIdx >= 0 ? 'look at line ' + (badIdx + 1) + ' (red). ' : '') + K.rich(text);
      elFix.hidden = false;
    });
  }

  function win() {
    var tasks = tasksOf('tasks'), handlers = tasksOf('handlers');
    var steps = runSteps([]);
    tasks.forEach(function (t) {
      steps.push({ t: '\n<span class="hd">' + stars('TASK [' + t + ']') + '</span>', d: 600 });
      HOSTS.forEach(function (h) { steps.push({ t: '<span class="ch">changed: [' + h + ']</span>', d: 220 }); });
    });
    handlers.forEach(function (t) {
      steps.push({ t: '\n<span class="hd">' + stars('RUNNING HANDLER [' + t + ']') + '</span>', d: 600 });
      HOSTS.forEach(function (h) { steps.push({ t: '<span class="ch">changed: [' + h + ']</span>', d: 220 }); });
    });
    var ch = tasks.length + handlers.length;
    steps.push({ t: '\n<span class="hd">' + stars('PLAY RECAP') + '</span>\n' + recap(ch + 1, ch, false), fn: function () { setServers('ok', ch + ' changed'); } });
    solved = true;
    var stars3 = fails === 0 ? 3 : fails === 1 ? 2 : 1;
    if (stars3 > (progress.stars[lv] || 0)) progress.stars[lv] = stars3;
    K.save(STORE, progress);
    K.track('level_complete', { game_name: 'ansible_fix_the_playbook', level: lv + 1, stars: stars3 });
    say('Running…');
    playScript(steps, function () {
      say('Success! Both servers are configured.', 'good');
      renderLevels();
      showDone(stars3);
    });
  }

  function total() { return progress.stars.reduce(function (s, n) { return s + (n || 0); }, 0); }

  function showDone(st) {
    var last = lv === LEVELS.length - 1, t = total();
    var share = 'I have ' + t + ' of 15 stars in “Fix the Playbook”, a free Ansible puzzle game. Can you beat me? ' + URL;
    elDone.innerHTML =
      '<h2>' + (last ? 'All levels done!' : 'Level ' + (lv + 1) + ' complete') + ' ' + K.stars(st).replace('class="stars"', 'class="stars big"') + '</h2>' +
      '<p class="score">' + (fails === 0 ? 'Right first time.' : fails + ' failed run' + (fails > 1 ? 's' : '') + ' before success.') + ' Total: ' + t + ' of 15 stars.</p>' +
      '<h3>What you learned</h3><ul class="learned">' + lvl.learned.map(function (s) { return '<li>' + K.rich(s) + '</li>'; }).join('') + '</ul>' +
      '<div class="actions">' +
        (last ? '<a class="btn primary" href="/learn/devops/">More Cloud &amp; DevOps games</a>' : '<button type="button" class="btn primary" data-next>Next level</button>') +
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

  startLevel(firstOpen());
})();
