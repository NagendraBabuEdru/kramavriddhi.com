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

  /* ---------- app (PWA): offline, install, daily reminder */
  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    window.addEventListener('load', function () { navigator.serviceWorker.register('/learn/sw.js', { scope: '/learn/' }).catch(function () {}); });
  }
  var deferred = null, onInstallChange = [];
  window.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); deferred = e; onInstallChange.forEach(function (f) { f(); }); });
  window.addEventListener('appinstalled', function () { deferred = null; track('app_install', { how: 'prompt' }); onInstallChange.forEach(function (f) { f(); }); });
  function standalone() { return (window.matchMedia && matchMedia('(display-mode: standalone)').matches) || navigator.standalone === true; }
  function isIOS() { return /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1); }
  /* 'installed' | 'prompt' (browser can install with one tap) | 'ios' (Share → Add to Home Screen) | 'manual' (browser menu) */
  function installState() { return standalone() ? 'installed' : deferred ? 'prompt' : isIOS() ? 'ios' : 'manual'; }
  function install() {
    if (!deferred) return Promise.resolve('none');
    var d = deferred; deferred = null; d.prompt();
    return d.userChoice.then(function (c) { track('app_install_prompt', { outcome: c.outcome }); onInstallChange.forEach(function (f) { f(); }); return c.outcome; });
  }

  /* daily reminder as a repeating calendar event (works on every phone, no server and no sign-in needed) */
  var REM_TITLE = 'Kramavriddhi Learn: 6 cards today', REM_URL = 'https://kramavriddhi.com/learn/daily/';
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function remStart(hhmm) {
    var p = String(hhmm || '19:00').split(':'), d = new Date(), h = +p[0] || 0, m = +p[1] || 0;
    if (d.getHours() * 60 + d.getMinutes() >= h * 60 + m) d.setDate(d.getDate() + 1);
    return { d: d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate()), t: pad(h) + pad(m) + '00', t2: pad(m + 10 >= 60 ? (h + 1) % 24 : h) + pad((m + 10) % 60) + '00', wrap: h === 23 && m >= 50 };
  }
  function reminderGoogle(hhmm) {
    var s = remStart(hhmm), end = s.wrap ? s.d + 'T235900' : s.d + 'T' + s.t2;
    return 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=' + encodeURIComponent(REM_TITLE) +
      '&dates=' + s.d + 'T' + s.t + '/' + end + '&recur=' + encodeURIComponent('RRULE:FREQ=DAILY') +
      '&details=' + encodeURIComponent('Open your feed: ' + REM_URL);
  }
  function reminderIcs(hhmm) {
    var s = remStart(hhmm), end = s.wrap ? '235900' : s.t2, now = new Date();
    var stamp = now.getUTCFullYear() + pad(now.getUTCMonth() + 1) + pad(now.getUTCDate()) + 'T' + pad(now.getUTCHours()) + pad(now.getUTCMinutes()) + pad(now.getUTCSeconds()) + 'Z';
    var ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Kramavriddhi//Learn//EN', 'CALSCALE:GREGORIAN', 'BEGIN:VEVENT',
      'UID:learn-reminder-' + stamp + '@kramavriddhi.com', 'DTSTAMP:' + stamp, 'DTSTART:' + s.d + 'T' + s.t, 'DTEND:' + s.d + 'T' + end,
      'RRULE:FREQ=DAILY', 'SUMMARY:' + REM_TITLE, 'DESCRIPTION:Open your feed: ' + REM_URL, 'URL:' + REM_URL,
      'BEGIN:VALARM', 'ACTION:DISPLAY', 'DESCRIPTION:' + REM_TITLE, 'TRIGGER:PT0M', 'END:VALARM', 'END:VEVENT', 'END:VCALENDAR'].join('\r\n') + '\r\n';
    return URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
  }

  window.KVLearn = { load: load, save: save, track: track, stars: stars, wa: wa, shuffle: shuffle, esc: esc, rich: rich,
    installState: installState, install: install, onInstallChange: function (f) { onInstallChange.push(f); },
    reminderGoogle: reminderGoogle, reminderIcs: reminderIcs };

  /* opened from a game break in the Learn feed: offer a way back */
  if (/[?&]from=feed/.test(location.search)) {
    var main = document.querySelector('main.game:not(.daily)');
    if (main) main.insertAdjacentHTML('afterbegin', '<a class="backfeed" href="/learn/daily/">← Back to my feed</a>');
  }
})();
