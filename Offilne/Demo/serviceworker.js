const CACHE_NAME = "devtinder-pwa-v1";

const CACHE_FILES = [
    "./",
    "index.html",
    "style.css",
    "script.js",
    "manifest.json",
    "icon192.png",
    "icon192_maskable.png",
    "icon512_rounded.png",
    "icon512_maskable.png"
];

self.addEventListener("install", (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(CACHE_FILES);
        })
    );
    self.skipWaiting();
    console.log("Service Worker: Installation completed");
});

self.addEventListener("activate", (e) => {
    e.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        console.log("Service Worker: Removing old cache", key);
                        return caches.delete(key);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
    console.log("Service Worker: Activated");
});

self.addEventListener("fetch", (e) => {
    // Ignore non-HTTP/HTTPS and non-GET requests (e.g. chrome extensions, websockets)
    if (!e.request.url.startsWith("http") || e.request.method !== "GET") return;

    // Offline experience: Network first, update cache, fallback to cache if offline
    e.respondWith(
        fetch(e.request)
            .then((res) => {
                // Clone response to put into cache
                if (res && res.status === 200) {
                    const clonedata = res.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(e.request, clonedata);
                    });
                }
                console.log("Coming from network:", e.request.url);
                return res;
            })
            .catch(async () => {
                console.log("Coming from cache:", e.request.url);
                const cachedResponse = await caches.match(e.request);
                if (cachedResponse) {
                    return cachedResponse;
                }
                // Fallback for navigation requests if offline
                if (e.request.mode === "navigate") {
                    return caches.match("index.html");
                }
            })
    );
});