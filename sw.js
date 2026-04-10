const CACHE_NAME = 'weekend-go-v9';
const IMAGE_CACHE_NAME = 'weekend-go-images-v1';
const MAX_IMAGE_CACHE = 80; // max images to cache
const ASSETS = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/js/data.js',
  '/js/data-extra.js',
  '/js/data-extra2.js',
  '/js/data-beijing-500.js',
  '/js/data-beijing-expand.js',
  '/js/data-beijing-hidden.js',
  '/js/data-beijing-tales.js',
  '/js/data-beijing-new2026.js',
  '/js/data-shenzhen.js',
  '/js/data-weihai.js',
  '/js/xhs-data.js',
  '/js/visuals.js',
  '/js/images.js',
  '/js/stamp-designs.js',
  '/js/stamp.js',
  '/js/legends.js',
  '/js/app.js',
  '/manifest.json'
];

// Pre-cache core assets on install
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Clean old caches on activate
self.addEventListener('activate', (event) => {
  const keep = new Set([CACHE_NAME, IMAGE_CACHE_NAME]);
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => !keep.has(k)).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Network-first for HTML, cache-first for assets
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Skip non-GET and cross-origin
  if (event.request.method !== 'GET' || url.origin !== self.location.origin) return;

  // Images (.webp, .jpg, .png, .svg): cache-first with dedicated image cache and LRU eviction
  if (/\.(webp|jpg|jpeg|png|svg|gif)$/i.test(url.pathname)) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request).then((response) => {
          const clone = response.clone();
          caches.open(IMAGE_CACHE_NAME).then((cache) => {
            cache.put(event.request, clone);
            // LRU eviction: trim oldest entries when cache is full
            cache.keys().then((keys) => {
              if (keys.length > MAX_IMAGE_CACHE) {
                const toDelete = keys.length - MAX_IMAGE_CACHE;
                for (let i = 0; i < toDelete; i++) {
                  cache.delete(keys[i]);
                }
              }
            });
          });
          return response;
        });
      })
    );
    return;
  }

  // HTML: network-first with cache fallback
  if (event.request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Other assets: cache-first
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request).then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        return response;
      });
    })
  );
});
