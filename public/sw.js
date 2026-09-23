// Service Worker for Jaxen Dutta Portfolio PWA
const CACHE_NAME = "jaxen-pwa-v1";

const STATIC_ASSETS = [
    "/",
    "/offline",
    "/favicon.ico",
    "/favicon.png",
    "/favicon-32x32.png",
    "/icon-48.png",
    "/icon-96.png",
    "/icon-192.png",
    "/icon-512.png",
    "/icon-maskable-512.png",
    "/apple-touch-icon.png",
];

// Install Event - Pre-cache core shell and offline assets
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(STATIC_ASSETS);
        })
    );
    self.skipWaiting();
});

// Activate Event - Clean up stale caches
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => caches.delete(name))
            );
        })
    );
    self.clients.claim();
});

// Fetch Event - Handle navigations and static caching
self.addEventListener("fetch", (event) => {
    if (event.request.method !== "GET") return;

    const url = new URL(event.request.url);

    // Bypass Next.js HMR, development endpoints, and API routes
    if (
        url.pathname.startsWith("/_next/webpack-hmr") ||
        url.pathname.startsWith("/_next/static/development") ||
        url.pathname.startsWith("/api/")
    ) {
        return;
    }

    // Navigation requests (HTML pages): Network-first -> Cache fallback -> Offline fallback
    if (event.request.mode === "navigate") {
        event.respondWith(
            fetch(event.request)
                .then((response) => {
                    if (response && response.status === 200) {
                        const responseClone = response.clone();
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(event.request, responseClone);
                        });
                    }
                    return response;
                })
                .catch(() => {
                    return caches.match(event.request).then((cachedResponse) => {
                        if (cachedResponse) return cachedResponse;
                        return caches.match("/offline");
                    });
                })
        );
        return;
    }

    // Static assets (CSS, JS, Fonts, Images): Cache-first with background network revalidation
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                // Background update
                fetch(event.request)
                    .then((networkResponse) => {
                        if (networkResponse && networkResponse.status === 200) {
                            caches.open(CACHE_NAME).then((cache) => {
                                cache.put(event.request, networkResponse);
                            });
                        }
                    })
                    .catch(() => {});
                return cachedResponse;
            }

            return fetch(event.request)
                .then((response) => {
                    if (response && response.status === 200) {
                        const responseClone = response.clone();
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(event.request, responseClone);
                        });
                    }
                    return response;
                })
                .catch(() => {
                    return new Response("Network unavailable", {
                        status: 503,
                        statusText: "Service Unavailable",
                        headers: { "Content-Type": "text/plain" },
                    });
                });
        })
    );
});
