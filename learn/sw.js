/* Kramavriddhi Learn: offline support (service worker, scope /learn/).
   Pages: network first, cached copy when offline. Files with ?v= (CSS, JS, tracks): cache first, because a new version gets a new URL.
   On install it saves the Learn pages and every file they load, so the app works offline from the second open. */
'use strict';
var CACHE = 'kv-learn-1';
var PAGES = ['/learn/', '/learn/daily/', '/learn/python/', '/learn/python/fix-the-code/', '/learn/python/guess-the-output/',
  '/learn/devops/', '/learn/devops/azure-data-pipeline/', '/learn/devops/ansible-fix-the-playbook/'];
var EXTRA = ['/learn/manifest.webmanifest', '/learn/icons/icon-192.png', '/learn/icons/icon-512.png'];

function assetsIn(html) {
  var out = [], re = /(?:src|href)="(\/(?:assets|learn)\/[^"#]+)"/g, m;
  while ((m = re.exec(html))) if (!/\/$/.test(m[1])) out.push(m[1].replace(/&amp;/g, '&'));
  return out;
}

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) {
    return Promise.all(PAGES.map(function (p) {
      return fetch(p, { cache: 'no-cache' }).then(function (r) {
        if (!r.ok) return [];
        return r.clone().text().then(function (html) { return c.put(p, r).then(function () { return assetsIn(html); }); });
      }).catch(function () { return []; });
    })).then(function (lists) {
      var all = EXTRA.concat.apply(EXTRA, lists).filter(function (u, i, a) { return a.indexOf(u) === i; });
      return Promise.all(all.map(function (u) { return c.add(u).catch(function () {}); }));
    });
  }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k.indexOf('kv-learn-') === 0 && k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

/* keep only the newest ?v= copy of each file */
function putVersioned(c, req, res) {
  var u = new URL(req.url);
  return c.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { var o = new URL(k.url); return o.pathname === u.pathname && o.search !== u.search && o.origin === u.origin; })
      .map(function (k) { return c.delete(k); }));
  }).then(function () { return c.put(req, res); });
}

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var u = new URL(req.url);

  /* Google Fonts: cache first */
  if (u.hostname === 'fonts.googleapis.com' || u.hostname === 'fonts.gstatic.com') {
    e.respondWith(caches.open(CACHE).then(function (c) {
      return c.match(req).then(function (hit) {
        return hit || fetch(req).then(function (r) { if (r.ok || r.type === 'opaque') c.put(req, r.clone()); return r; });
      });
    }));
    return;
  }
  if (u.origin !== location.origin) return;  /* analytics etc.: browser default */

  /* pages: network first, then the saved copy, then the saved feed */
  if (req.mode === 'navigate') {
    var key = u.pathname.replace(/index\.html$/, '');
    e.respondWith(fetch(req).then(function (r) {
      if (r.ok && key.indexOf('/learn/') === 0) { var copy = r.clone(); caches.open(CACHE).then(function (c) { c.put(key, copy); }); }
      return r;
    }).catch(function () {
      return caches.match(key).then(function (hit) { return hit || caches.match('/learn/daily/'); });
    }));
    return;
  }

  /* site and learn files: versioned = cache first; others = network first */
  if (/^\/(assets|learn)\//.test(u.pathname)) {
    var versioned = /[?&]v=/.test(u.search);
    e.respondWith(caches.open(CACHE).then(function (c) {
      var net = fetch(req).then(function (r) { if (r.ok) (versioned ? putVersioned(c, req, r.clone()) : c.put(req, r.clone())); return r; });
      if (!versioned) return net.catch(function () { return c.match(req, { ignoreSearch: true }); });
      return c.match(req).then(function (hit) { return hit || net; });
    }));
  }
});
