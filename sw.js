/* sw.js - Force Update Version v3.2 */
const CACHE_NAME = 'm-shop-v3-force-update';
const ASSETS = [
  './',
  'index.html',
  'manifest.json',
  'icon-512.png'
];

// ติดตั้งและบังคับใช้ทันที (Skip Waiting)
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// ล้าง Cache เก่าทิ้งทั้งหมดเมื่อมีการอัพเดทใหม่
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// โหลดข้อมูลล่าสุดเสมอ (Network First)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response && response.status === 200 && response.type === 'basic') {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
