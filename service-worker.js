const CACHE = 'smriti-6ce59eb.202608271706';

const DEV = false;

const PRECACHE = [
  '/',
  '/index.html',
  '/assets/css/main.css',
  '/assets/js/constants.js',
  '/assets/js/app.js',
  '/assets/js/modules/i18n.js',
  '/assets/js/modules/reader.js',
  '/assets/js/modules/avadhaanam.js',
  '/assets/js/modules/settings.js',
  '/data/bg/content/gita-index.json',
  '/data/vsn/content/nakshatras.json'
];

// JS, CSS, HTML — stale-while-revalidate
// Serve cached immediately, fetch fresh in background, update cache silently.
const SWR_EXTS = ['.js', '.css', '.html', ''];

function isSwr(url) {
  const p = url.pathname;
  return SWR_EXTS.some(ext => p.endsWith(ext)) || p === '/';
}

self.addEventListener('install', e => {
  if (DEV) { self.skipWaiting(); return; }
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  if (DEV) { e.waitUntil(self.clients.claim()); return; }
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      // clients.claim() takes control of any open tabs/homescreen window,
      // which fires their `navigator.serviceWorker.controllerchange` event
      // — app.js listens for that directly and auto-reloads, so no custom
      // postMessage broadcast is needed here.
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (DEV) { e.respondWith(fetch(e.request)); return; }

  const url = new URL(e.request.url);

  // Network-first for chapter JSON and calendar (always want fresh data)
  if (url.pathname.startsWith('/data/bg/content/chapters/') ||
      url.pathname === '/data/calendar/content/ekadashi.json') {
    e.respondWith(
      fetch(e.request)
        .then(r => { caches.open(CACHE).then(c => c.put(e.request, r.clone())); return r; })
        .catch(() => caches.match(e.request))
    );
    return;
  }

  // Stale-while-revalidate for JS / CSS / HTML. The revalidation fetch uses
  // {cache: 'no-store'} so it always hits the network — without it, a
  // same-URL asset (bare precached paths, or a ?v= number someone forgot to
  // bump) could keep being satisfied from the browser's own HTTP cache
  // forever, silently defeating this whole revalidation step.
  if (isSwr(url)) {
    e.respondWith(
      caches.open(CACHE).then(cache =>
        cache.match(e.request).then(cached => {
          const fresh = fetch(e.request, { cache: 'no-store' }).then(r => { cache.put(e.request, r.clone()); return r; });
          return cached || fresh;   // serve cached instantly; fresh updates cache for next load
        })
      )
    );
    return;
  }

  // Cache-first for everything else (JSON data, images, fonts)
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).then(nr => {
      caches.open(CACHE).then(c => c.put(e.request, nr.clone()));
      return nr;
    }))
  );
});
