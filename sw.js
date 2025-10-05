const CACHE_NAME = 'soft-shiraz-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/movies.json',
  '/series.json',
  '/latest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
