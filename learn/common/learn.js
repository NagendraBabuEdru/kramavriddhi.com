/* Learn by Playing: small shared helpers (storage, analytics, stars, share). */
(function () {
  'use strict';

  function load(key, fallback) {
    try {
      var v = window.localStorage.getItem(key);
      return v ? JSON.parse(v) : fallback;
    } catch (e) { return fallback; }
  }

  function save(key, value) {
    try { window.localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* private mode: ignore */ }
  }

  function track(name, params) {
    try { if (typeof window.gtag === 'function') window.gtag('event', name, params || {}); } catch (e) { /* ignore */ }
  }

  var STAR = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.6l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.5l-5.9 3.1 1.2-6.5L2.5 9.5l6.6-.9z"/></svg>';

  function stars(n, max) {
    max = max || 3;
    var s = '';
    for (var i = 0; i < max; i++) s += '<span class="st' + (i < n ? ' on' : '') + '">' + STAR + '</span>';
    return '<span class="stars" role="img" aria-label="' + n + ' of ' + max + ' stars">' + s + '</span>';
  }

  function wa(text) { return 'https://wa.me/?text=' + encodeURIComponent(text); }

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* inline `code` and **bold** in short teaching strings */
  function rich(s) {
    return esc(s).replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  }

  window.KVLearn = { load: load, save: save, track: track, stars: stars, wa: wa, shuffle: shuffle, esc: esc, rich: rich };
})();
