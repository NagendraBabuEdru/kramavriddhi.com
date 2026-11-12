/* Build the Data Pipeline: put Azure services in the order data travels. */
(function () {
  'use strict';
  var K = window.KVLearn;
  var STORE = 'kv-learn-pipeline';
  var URL = 'https://kramavriddhi.com/learn/devops/azure-data-pipeline/';

  /* Block catalogue. fam: src | az | bronze | silver | gold */
  var B = {
    csv:    { g: 'CSV', fam: 'src', n: 'Sales CSV files', role: 'Source', ex: 'Store tills export a CSV file every night. This is where the data starts.' },
    adf:    { g: 'DF', fam: 'az', n: 'Data Factory', role: 'Ingest', ex: 'Azure Data Factory copies data from many sources on a schedule or trigger, and runs the steps in order (orchestration).' },
    adls:   { g: 'DL', fam: 'az', n: 'Data Lake Gen2', role: 'Store', ex: 'Azure Data Lake Storage Gen2 stores huge amounts of raw and cleaned files cheaply, with real folders (hierarchical namespace).' },
    dbx:    { g: 'DB', fam: 'az', n: 'Databricks', role: 'Transform', ex: 'Azure Databricks runs Apache Spark to clean, join and reshape big data.' },
    syn:    { g: 'SY', fam: 'az', n: 'Synapse Analytics', role: 'Serve', ex: 'Azure Synapse Analytics is a SQL data warehouse that serves clean, modelled tables to reports. Microsoft Fabric is the newer all-in-one option.' },
    pbi:    { g: 'BI', fam: 'az', n: 'Power BI', role: 'Visualise', ex: 'Power BI turns tables into dashboards and reports that people read.' },
    iot:    { g: 'IoT', fam: 'src', n: 'Factory sensors', role: 'Source', ex: 'Machines send a small reading every second: temperature, speed, vibration.' },
    eh:     { g: 'EH', fam: 'az', n: 'Event Hubs', role: 'Ingest (stream)', ex: 'Azure Event Hubs takes in millions of events per second and keeps them for a while so readers can catch up. It also speaks the Kafka protocol.' },
    asa:    { g: 'SA', fam: 'az', n: 'Stream Analytics', role: 'Process (stream)', ex: 'Azure Stream Analytics runs SQL-like queries on data while it moves, for example the average temperature per 1-minute window.' },
    erp:    { g: 'ERP', fam: 'src', n: 'ERP database', role: 'Source', ex: 'The company’s main business database: orders, customers, products.' },
    bronze: { g: 'Br', fam: 'bronze', n: 'Bronze layer', role: 'Raw', ex: 'Bronze: data landed exactly as it came, never edited, so you can always reprocess it.' },
    silver: { g: 'Si', fam: 'silver', n: 'Silver layer', role: 'Cleaned', ex: 'Silver: cleaned, de-duplicated and joined tables with correct types.' },
    gold:   { g: 'Go', fam: 'gold', n: 'Gold layer', role: 'Business-ready', ex: 'Gold: aggregated, business-friendly tables such as daily sales per store.' },
    pay:    { g: '₹', fam: 'src', n: 'Card payments', role: 'Source', ex: 'Every card swipe is an event: amount, shop, city, time.' },
    fn:     { g: 'FN', fam: 'az', n: 'Azure Functions', role: 'Act', ex: 'Azure Functions runs a small piece of code when something happens. Here it sends the fraud alert by SMS or email.' },
    web:    { g: 'WEB', fam: 'src', n: 'Website clicks', role: 'Source', ex: 'Every page view and click on the shop website, as a stream of events.' },
    arch:   { g: 'AR', fam: 'az', n: 'Archive tier storage', role: '', ex: '' },
    files:  { g: 'AF', fam: 'az', n: 'Azure Files', role: '', ex: '' }
  };

  var LEVELS = [
    {
      title: 'Your first pipeline', tag: 'Batch',
      brief: 'A shop chain’s tills drop sales CSV files every night. Copy them into Azure, keep them safe in a lake, clean them with Spark, load a warehouse, and show a dashboard by 9 am.',
      order: ['csv', 'adf', 'adls', 'dbx', 'syn', 'pbi'], extra: [],
      note: 'This is **batch** processing: data moves in scheduled chunks (here, once a night).'
    },
    {
      title: 'Live sensors', tag: 'Streaming',
      brief: 'A factory wants a live dashboard of machine temperatures, updated every few seconds. No waiting for a nightly job.',
      order: ['iot', 'eh', 'asa', 'pbi'], extra: [],
      ex: { pbi: 'Stream Analytics can send its results straight to a Power BI dashboard that updates live.' },
      note: 'This is **streaming**: each event is handled within seconds of happening. Event Hubs collects, Stream Analytics calculates.'
    },
    {
      title: 'The medallion lakehouse', tag: 'Bronze · Silver · Gold',
      brief: 'Copy the ERP database into the lakehouse every day. Keep the raw copy, then a cleaned version, then business-ready tables for the dashboard.',
      order: ['erp', 'adf', 'bronze', 'silver', 'gold', 'pbi'], extra: [],
      note: 'Bronze, Silver and Gold are usually **Delta tables** stored in Data Lake Gen2. Databricks (or Fabric) notebooks move data from one layer to the next.'
    },
    {
      title: 'Fraud alerts in seconds', tag: 'Odd one out',
      brief: 'A bank must flag a suspicious card payment within seconds and alert the customer. One block below does not belong in this pipeline.',
      order: ['pay', 'eh', 'asa', 'fn'], extra: ['adf'],
      why: { adf: 'Data Factory runs pipelines on a schedule or trigger: it is built for batch copies. A fraud alert cannot wait for the next run.' },
      ex: { asa: 'Stream Analytics checks each payment as it arrives, for example “two cities in 5 minutes”, and sends matches to the next step.' },
      note: 'Streaming pipelines can **act**, not only report: Stream Analytics can send results to Azure Functions, which then calls the alert service.'
    },
    {
      title: 'Boss level: streaming lakehouse', tag: 'Two odd ones out',
      brief: 'Website clicks stream in all day. Analysts want full history in a lakehouse (raw, cleaned, business-ready) and a dashboard that is minutes fresh. Two blocks do not belong.',
      order: ['web', 'eh', 'bronze', 'silver', 'gold', 'pbi'], extra: ['arch', 'files'],
      why: {
        arch: 'The Archive tier is offline storage: a file must be rehydrated first, which can take hours. Good for old backups, useless for live data.',
        files: 'Azure Files is a shared network drive (SMB or NFS) for apps and people. Lakehouse layers live in Data Lake Gen2 as Delta tables.'
      },
      ex: { bronze: 'Bronze: Databricks Structured Streaming reads Event Hubs (through its Kafka endpoint) and writes every click, as-is, into a Delta table.' },
      note: 'You built a **streaming lakehouse**: the same bronze, silver and gold layers, but fed continuously instead of once a day.'
    }
  ];

  var $ = function (id) { return document.getElementById(id); };
  var elLevels = $('levels'), elBrief = $('brief'), elRail = $('rail'), elTray = $('tray'), elRun = $('run'),
      elClear = $('clear'), elMsg = $('msg'), elDone = $('done'), elBoard = $('board');

  var progress = K.load(STORE, null);
  if (!progress || !Array.isArray(progress.stars)) progress = { stars: [0, 0, 0, 0, 0] };

  var lv = 0, lvl, placed, trayOrder, locked, selected = null, mistakes = 0, solved = false, started = false;

  function unlocked(i) { return i === 0 || (progress.stars[i - 1] || 0) > 0; }
  function firstOpen() { for (var i = 0; i < LEVELS.length; i++) if (!progress.stars[i]) return i; return 0; }
  function exText(id) { return (lvl.ex && lvl.ex[id]) || B[id].ex; }
  function glyph(id) { var b = B[id]; return '<span class="glyph ' + b.fam + '" aria-hidden="true">' + K.esc(b.g) + '</span>'; }

  function renderLevels() {
    elLevels.innerHTML = LEVELS.map(function (L, i) {
      var open = unlocked(i), s = progress.stars[i] || 0;
      return '<li><button type="button" class="lv" data-lv="' + i + '"' + (i === lv ? ' aria-current="step"' : '') + (open ? '' : ' disabled') +
        ' aria-label="Level ' + (i + 1) + (open ? (s ? ', ' + s + ' stars' : '') : ', locked') + '">' + (i + 1) +
        (open ? K.stars(s) : '<span aria-hidden="true">🔒</span>') + '</button></li>';
    }).join('');
  }

  function startLevel(i) {
    lv = i; lvl = LEVELS[i];
    placed = lvl.order.map(function () { return null; });
    locked = lvl.order.map(function () { return false; });
    var all = lvl.order.concat(lvl.extra);
    do { trayOrder = K.shuffle(all); } while (all.length > 2 && trayOrder.join() === all.join());
    selected = null; mistakes = 0; solved = false; started = false;
    elDone.hidden = true; elDone.innerHTML = '';
    elRail.classList.remove('flowing'); elBoard.classList.remove('solved');
    elMsg.textContent = ''; elMsg.className = 'gmsg';
    elBrief.innerHTML = '<p class="kicker">Level ' + (i + 1) + ' of ' + LEVELS.length + ' · ' + K.esc(lvl.tag) + '</p><h2>' + K.esc(lvl.title) + '</h2><p>' + K.esc(lvl.brief) + '</p>' +
      (lvl.extra.length ? '<p><strong>' + lvl.order.length + ' steps, ' + all.length + ' blocks.</strong> Leave the wrong ' + (lvl.extra.length > 1 ? 'ones' : 'one') + ' in the tray.</p>' : '');
    renderLevels(); render();
    K.track('game_start', { game_name: 'azure_data_pipeline', level: i + 1 });
  }

  function render(focusKey) {
    elRail.innerHTML = placed.map(function (id, i) {
      var b = id && B[id];
      var cls = 'slot' + (id ? ' filled' : '') + (locked[i] ? ' ok' : '') + (selected && !id ? ' armed' : '');
      var label = 'Step ' + (i + 1) + ': ' + (b ? b.n + (locked[i] ? ', correct' : solved ? '' : '. Press to send back to the tray') : 'empty' + (selected ? '. Press to place ' + B[selected].n : ''));
      return '<li><button type="button" class="' + cls + '" data-slot="' + i + '"' + (id ? ' data-id="' + id + '"' : '') + ' style="--d:' + (i * 260) + 'ms" aria-label="' + K.esc(label) + '">' +
        (b ? glyph(id) + '<span class="tile-text"><span class="bname">' + K.esc(b.n) + '</span><span class="role">' + K.esc(b.role) + '</span></span>'
           : '<span class="no" aria-hidden="true">' + (i + 1) + '</span><span class="hint">' + (selected ? 'Place here' : 'Empty') + '</span>') +
        '</button></li>';
    }).join('');
    var inTray = trayOrder.filter(function (id) { return placed.indexOf(id) < 0; });
    elTray.innerHTML = solved ? '' : inTray.map(function (id) {
      return '<button type="button" class="block" data-id="' + id + '" aria-pressed="' + (selected === id) + '">' + glyph(id) + '<span class="bname">' + K.esc(B[id].n) + '</span></button>';
    }).join('');
    var full = placed.every(Boolean);
    elRun.disabled = !full || solved;
    if (focusKey) {
      var f = document.querySelector(focusKey);
      if (f) f.focus({ preventScroll: true });
    }
  }

  function markStarted() {
    if (!started) { started = true; }
  }

  function place(id, slot) {
    if (solved || locked[slot]) return;
    markStarted();
    var from = placed.indexOf(id);
    var prev = placed[slot];
    if (from >= 0) { if (locked[from]) return; placed[from] = prev && from !== slot ? prev : null; }
    placed[slot] = id;
    selected = null;
    elMsg.textContent = ''; elMsg.className = 'gmsg';
  }

  function toTray(id) {
    var i = placed.indexOf(id);
    if (i >= 0 && !locked[i]) placed[i] = null;
  }

  /* ---------- tap / keyboard */
  var suppressClick = false;
  elBoard.addEventListener('click', function (e) {
    if (suppressClick) { suppressClick = false; return; }
    var blk = e.target.closest('.block'), slot = e.target.closest('.slot');
    if (blk) {
      selected = selected === blk.dataset.id ? null : blk.dataset.id;
      render('.block[data-id="' + blk.dataset.id + '"]');
      if (selected) say('Selected ' + B[selected].n + '. Now choose a step.');
      return;
    }
    if (slot && !solved) {
      var i = +slot.dataset.slot;
      if (locked[i]) return;
      if (selected) { var n = B[selected].n; place(selected, i); render('.slot[data-slot="' + i + '"]'); say(n + ' placed in step ' + (i + 1) + '.'); }
      else if (placed[i]) { var m = B[placed[i]].n; placed[i] = null; render('.slot[data-slot="' + i + '"]'); say(m + ' sent back to the tray.'); }
      else say('First choose a block from the tray below.');
    }
  });

  function say(t, kind) { elMsg.textContent = t; elMsg.className = 'gmsg' + (kind ? ' ' + kind : ''); }

  /* ---------- drag (pointer events: mouse, pen and touch) */
  var drag = null;
  elBoard.addEventListener('pointerdown', function (e) {
    if (solved || e.button > 0) return;
    var src = e.target.closest('.block, .slot.filled');
    if (!src || src.classList.contains('ok')) return;
    suppressClick = false;
    drag = { id: src.dataset.id, src: src, x: e.clientX, y: e.clientY, pid: e.pointerId, on: false, ghost: null, over: null };
  });
  window.addEventListener('pointermove', function (e) {
    if (!drag || e.pointerId !== drag.pid) return;
    if (!drag.on) {
      if (Math.abs(e.clientX - drag.x) + Math.abs(e.clientY - drag.y) < 8) return;
      drag.on = true;
      var g = document.createElement('div');
      g.className = 'block drag-ghost';
      g.innerHTML = glyph(drag.id) + '<span class="bname">' + K.esc(B[drag.id].n) + '</span>';
      document.body.appendChild(g); drag.ghost = g;
      drag.src.classList.add('lifted');
    }
    e.preventDefault();
    drag.ghost.style.left = e.clientX + 'px'; drag.ghost.style.top = e.clientY + 'px';
    var t = document.elementFromPoint(e.clientX, e.clientY);
    var over = t && (t.closest('.slot') || t.closest('.tray'));
    if (over !== drag.over) {
      if (drag.over) drag.over.classList.remove('over');
      drag.over = over && !over.classList.contains('ok') ? over : null;
      if (drag.over && drag.over.classList.contains('slot')) drag.over.classList.add('over');
    }
  }, { passive: false });
  function endDrag(e) {
    if (!drag || (e && e.pointerId !== drag.pid)) return;
    var d = drag; drag = null;
    if (!d.on) return;
    suppressClick = true;
    setTimeout(function () { suppressClick = false; }, 50);
    d.ghost.remove(); d.src.classList.remove('lifted');
    if (d.over && e && e.type === 'pointerup') {
      if (d.over.classList.contains('slot')) { var i = +d.over.dataset.slot; place(d.id, i); render(); say(B[d.id].n + ' placed in step ' + (i + 1) + '.'); return; }
      toTray(d.id); selected = null; render(); return;
    }
    render();
  }
  window.addEventListener('pointerup', endDrag);
  window.addEventListener('pointercancel', endDrag);

  /* ---------- run */
  elRun.addEventListener('click', function () {
    if (solved || !placed.every(Boolean)) return;
    var right = 0, extraUsed = [];
    placed.forEach(function (id, i) {
      if (id === lvl.order[i]) { locked[i] = true; right++; }
      else if (lvl.extra.indexOf(id) >= 0) extraUsed.push(id);
    });
    if (right === lvl.order.length) return win();
    mistakes++;
    var wrong = [];
    placed.forEach(function (id, i) { if (!locked[i]) wrong.push(i); });
    render();
    wrong.forEach(function (i) { var s = elRail.querySelector('[data-slot="' + i + '"]'); if (s) s.classList.add('bad'); });
    var hint = right + ' of ' + lvl.order.length + ' steps are right (ticked). ';
    if (extraUsed.length) hint += '“' + B[extraUsed[0]].n + '” does not belong in this pipeline at all. ';
    else hint += 'Think about what must happen to the data before each step. ';
    say(hint + 'Wrong blocks went back to the tray.', 'bad');
    setTimeout(function () { wrong.forEach(function (i) { placed[i] = null; }); render(); }, 650);
  });

  elClear.addEventListener('click', function () { startLevel(lv); });

  function win() {
    solved = true;
    var stars = mistakes === 0 ? 3 : mistakes === 1 ? 2 : 1;
    if (stars > (progress.stars[lv] || 0)) progress.stars[lv] = stars;
    K.save(STORE, progress);
    K.track('level_complete', { game_name: 'azure_data_pipeline', level: lv + 1, stars: stars });
    elBoard.classList.add('solved');
    render();
    elRail.classList.add('flowing');
    say('Data is flowing! Pipeline complete.', 'good');
    var wait = lvl.order.length * 260 + 900;
    setTimeout(function () { showDone(stars); }, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 50 : wait);
    renderLevels();
  }

  function total() { return progress.stars.reduce(function (s, n) { return s + (n || 0); }, 0); }

  function showDone(stars) {
    var last = lv === LEVELS.length - 1, t = total();
    var share = 'I have ' + t + ' of 15 stars in “Build the Data Pipeline”, a free Azure puzzle game. Can you beat me? ' + URL;
    var items = lvl.order.map(function (id) {
      return '<li>' + glyph(id) + '<span><strong>' + K.esc(B[id].n) + '</strong>' + (B[id].role ? ' · ' + K.esc(B[id].role) : '') + '. ' + K.esc(exText(id)) + '</span></li>';
    }).concat(lvl.extra.map(function (id) {
      return '<li class="out">' + glyph(id) + '<span><strong>Left out: ' + K.esc(B[id].n) + '.</strong> ' + K.esc(lvl.why[id]) + '</span></li>';
    })).join('');
    elDone.innerHTML =
      '<h2>' + (last ? 'All levels done!' : 'Level ' + (lv + 1) + ' complete') + ' <span class="stars-wrap">' + K.stars(stars).replace('class="stars"', 'class="stars big"') + '</span></h2>' +
      '<p class="score">' + (mistakes === 0 ? 'Right first time.' : mistakes + ' wrong run' + (mistakes > 1 ? 's' : '') + ' before the answer.') + ' Total: ' + t + ' of 15 stars.</p>' +
      '<h3>What each step does</h3><ol class="explain">' + items + '</ol>' +
      '<p class="foot-note">' + K.rich(lvl.note) + '</p>' +
      '<div class="actions">' +
        (last ? '<a class="btn primary" href="/learn/devops/">More Cloud &amp; DevOps games</a>' : '<button type="button" class="btn primary" data-next>Next level</button>') +
        (stars < 3 ? '<button type="button" class="btn ghost" data-again>Try for 3 stars</button>' : '') +
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

  elLevels.addEventListener('click', function (e) {
    var b = e.target.closest('.lv');
    if (b && !b.disabled) startLevel(+b.dataset.lv);
  });

  startLevel(firstOpen());
})();
