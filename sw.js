// Service Worker for PetCalm Offline Capability

const CACHE_NAME = 'petcalm-audio-cache-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  // Note: We don't hardcode the mp3s here to avoid massive initial load.
  // We cache them dynamically as the user plays them (Stale-While-Revalidate).
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);

  // Strategy for Audio Files: Cache First, Fallback to Network
  // We identify audio files by extension or the specific CDN domain
  if (requestUrl.pathname.endsWith('.mp3') || requestUrl.hostname.includes('pixabay')) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request).then((networkResponse) => {
          // Clone response to put in cache
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