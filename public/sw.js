// Service Worker for PetCalm Offline Capability

const CACHE_NAME = 'petcalm-audio-cache-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
];

self.addEventListener('install', (event) => {
    console.log('[SW] Installing Service Worker...', event);
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[SW] Caching app shell');
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

self.addEventListener('activate', (event) => {
    console.log('[SW] Activating Service Worker...', event);
    return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    const requestUrl = new URL(event.request.url);
    // console.log('[SW] Fetching:', requestUrl.href);

    // Strategy for Audio Files: Cache First, Fallback to Network
    if (requestUrl.pathname.endsWith('.mp3') || requestUrl.hostname.includes('pixabay')) {
        event.respondWith(
            caches.match(event.request).then((cachedResponse) => {
                if (cachedResponse) {
                    // console.log('[SW] Audio found in cache:', requestUrl.href);
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
        // Default strategy for other assets: Stale-While-Revalidate (or Cache-First for static)
        // Using Cache First here simple
        event.respondWith(
            caches.match(event.request).then((response) => {
                return response || fetch(event.request);
            })
        );
    }
});
