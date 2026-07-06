const CACHE_NAME = 'jurnal-yuyun-v3';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './logo.svg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting(); // Force the waiting service worker to become the active service worker.
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName); // Clean up old caches
          }
        })
      );
    })
  );
  self.clients.claim(); // Claim control immediately for current clients
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached response if found, otherwise fetch from network
        return response || fetch(event.request).catch(() => {
          // Ignore fetch errors to ensure offline capability
        });
      })
  );
});
