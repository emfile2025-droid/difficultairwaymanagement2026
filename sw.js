/* AirwayGuard PWA | Service Worker | キャッシュ版管理でオフライン対応 */

const CACHE_NAME = 'airway-guard-v1';
const URLS = [
  './',
  './index.html',
  './airway_guard_v2_1.html',
  './manifest.json',
  './apple-touch-icon.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(URLS))
      .then(() => self.skipWaiting())
      .catch((err) => console.warn('SW install cache addAll failed:', err))
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names
          .filter((n) => n !== CACHE_NAME)
          .map((n) => caches.delete(n))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then((cached) =>
      cached ? Promise.resolve(cached) : fetch(e.request)
    )
  );
});
