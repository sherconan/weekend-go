// Weekend-Go Service Worker v29 — nuclear cache reset + auto-reload clients (2026-05-22)
const CACHE_NAME = 'weekend-go-v29';
const IMAGE_CACHE_NAME = 'weekend-go-images-v7';
const MAX_IMAGE_CACHE = 120;

const CORE_ASSETS = [
  '/', '/index.html', '/planner.html', '/dest.html', '/stats.html', '/compare.html', '/achievements.html',
  '/css/styles.css', '/css/theme-dark.css',
  '/config/cities.js', '/js/cities-dataset.js',
  '/js/data.js', '/js/data-extra.js', '/js/data-extra2.js',
  '/js/data-beijing-500.js', '/js/data-beijing-expand.js',
  '/js/data-beijing-hidden.js', '/js/data-beijing-tales.js',
  '/js/data-beijing-new2026.js',
  '/js/data-shenzhen.js', '/js/data-weihai.js', '/js/data-suzhou.js',
  '/js/data-tianjin.js', '/js/data-qingdao.js',
  '/js/data-chengdu.js', '/js/data-hangzhou.js',
  '/js/data-chongqing.js', '/js/data-enshi.js',
  '/js/data-shared-cross-city.js',
  '/js/data-legends-shenzhen.js', '/js/data-legends-weihai.js',
  '/js/data-legends-suzhou.js', '/js/data-legends-qingdao.js',
  '/js/data-legends-tianjin.js', '/js/data-legends-chengdu.js',
  '/js/data-legends-hangzhou.js',
  '/js/data-legends-chongqing.js', '/js/data-legends-enshi.js',
  '/js/xhs-data.js', '/js/xhs-voices.js',
  '/js/visuals.js', '/js/images.js',
  '/js/stamp-designs.js', '/js/stamp.js',
  '/js/legends.js', '/js/app.js',
  '/js/planner.js', '/js/dest.js', '/js/compare.js', '/js/seasonal.js', '/js/theme.js', '/js/achievements.js', '/js/recent.js',
  '/manifest.json'
];

const OFFLINE_FALLBACK = '/offline.html';

// Install: pre-cache core, tolerate individual fetch failures
self.addEventListener('install', (event) => {
  event.waitUntil(
    // v29 nuclear: nuke ALL caches first (even keep set), then rebuild from network
    caches.keys()
      .then((keys) => Promise.all(keys.map((k) => caches.delete(k))))
      .then(() => caches.open(CACHE_NAME))
      .then((cache) =>
        Promise.all(CORE_ASSETS.map((url) =>
          fetch(url, { cache: 'reload' })
            .then((r) => r.ok ? cache.put(url, r) : null)
            .catch(() => null)
        )).then(() => cache.add(OFFLINE_FALLBACK).catch(() => null))
      )
  );
  self.skipWaiting();
});

// Activate: purge old caches + tell all clients to reload (one-shot per upgrade)
self.addEventListener('activate', (event) => {
  const keep = new Set([CACHE_NAME, IMAGE_CACHE_NAME]);
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => !keep.has(k)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
      .then(() => self.clients.matchAll({ type: 'window' }))
      .then((clients) => clients.forEach((c) => c.postMessage({ type: 'SW_UPDATED', version: 'v29' })))
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || url.origin !== self.location.origin) return;

  // Images: cache-first with LRU
  if (/\.(webp|jpg|jpeg|png|svg|gif)$/i.test(url.pathname)) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request).then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(IMAGE_CACHE_NAME).then((cache) => {
              cache.put(event.request, clone);
              cache.keys().then((keys) => {
                if (keys.length > MAX_IMAGE_CACHE) {
                  const toDelete = keys.length - MAX_IMAGE_CACHE;
                  for (let i = 0; i < toDelete; i++) cache.delete(keys[i]);
                }
              });
            });
          }
          return response;
        }).catch(() => caches.match(event.request));
      })
    );
    return;
  }

  // HTML: network-first with cache fallback, fallback to offline.html
  if (event.request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(event.request, { cache: 'no-cache' })
        .then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() =>
          caches.match(event.request).then((c) => c || caches.match(OFFLINE_FALLBACK))
        )
    );
    return;
  }

  // Data JS: stale-while-revalidate (cache-first, background refresh)
  if (url.pathname.startsWith('/js/data') || url.pathname.startsWith('/config/')) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        const network = fetch(event.request).then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        }).catch(() => cached);
        return cached || network;
      })
    );
    return;
  }

  // Other assets: cache-first
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request).then((response) => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => cached);
    })
  );
});

// Allow page to trigger cache warming for new images viewed
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'PRECACHE_IMAGES' && Array.isArray(event.data.urls)) {
    caches.open(IMAGE_CACHE_NAME).then((cache) => {
      event.data.urls.forEach((u) => cache.add(u).catch(() => {}));
    });
  }
});
