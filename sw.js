// Service Worker for PetCalm Offline Capability

const CACHE_NAME = 'petcalm-audio-cache-v3';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  // Pre-cache local sound files for true offline support
  '/sounds/gentle-rain.mp3',
  '/sounds/forest-birds.mp3',
  '/sounds/ocean-waves.mp3',
  '/sounds/creek-water.mp3',
  '/sounds/heartbeat.mp3',
  '/sounds/soft-piano.mp3',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // Clean up old caches
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);

  // Strategy for Audio Files: Cache First, Fallback to Network
  if (requestUrl.pathname.endsWith('.mp3') || requestUrl.pathname.startsWith('/sounds/')) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request).then((networkResponse) => {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
          return networkResponse;
        });
      })
    );
  } else {
    // Default strategy for other assets
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  }
});
