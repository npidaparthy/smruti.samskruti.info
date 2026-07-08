const CACHE = 'smriti-v20';

// Set to true during local testing to skip all caching (network-only).
// Set back to false before committing/deploying.
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

self.addEventListener('install', e => {
  if (DEV) { self.skipWaiting(); return; }
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  if (DEV) { e.waitUntil(self.clients.claim()); return; }
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  // DEV mode: always go to network, no caching
  if (DEV) { e.respondWith(fetch(e.request)); return; }

  const url = new URL(e.request.url);

  // Network-first for chapter JSON and ekadashi calendar (fresh data, fall back offline)
  if (url.pathname.startsWith('/data/bg/content/chapters/') || url.pathname === '/data/calendar/content/ekadashi.json') {
    e.respondWith(
      fetch(e.request)
        .then(r => { caches.open(CACHE).then(c => c.put(e.request, r.clone())); return r; })
        .catch(() => caches.match(e.request))
    );
    return;
  }

  // Cache-first for everything else
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).then(nr => {
      caches.open(CACHE).then(c => c.put(e.request, nr.clone()));
      return nr;
    }))
  );
});
