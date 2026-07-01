const CACHE = 'smriti-v13';

const PRECACHE = [
  '/',
  '/index.html',
  '/assets/css/main.css',
  '/assets/js/constants.js',
  '/assets/js/app.js',
  '/assets/js/modules/i18n.js',
  '/assets/js/modules/reader.js',
  '/assets/js/modules/avadhaanam.js',
  '/assets/js/modules/meanings.js',
  '/assets/js/modules/audio.js',
  '/assets/js/modules/settings.js',
  '/data/gita-index.json',
  '/data/texts/vsn/nakshatras.json'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // Network-first for chapter JSON and ekadashi calendar (fresh data, fall back offline)
  if (url.pathname.startsWith('/data/chapters/') || url.pathname === '/data/ekadashi.json') {
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
