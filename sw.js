// sw.js
const CACHE_NAME = 'softshiraz-web-v1';
const urlsToCache = [
  '/',
  '/web/',
  '/web/index.html',
  // اگر فایل‌های CSS، JS، تصاویر ثابت دیگه‌ای دارید اضافه کنید
  // مثلاً:
  // '/web/style.css',
  // '/web/logo.png',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache باز شد');
        return cache.addAll(urlsToCache);
      })
  );
  // این باعث میشه SW بلافاصله فعال بشه
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
  console.log('SW فعال شد');
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // اگر در cache بود برگردون
        if (response) {
          return response;
        }
        // در غیر این صورت از شبکه بگیر
        return fetch(event.request);
      })
  );
});
