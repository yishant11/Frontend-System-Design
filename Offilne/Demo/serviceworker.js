const CACHE_NAME = "demo-v2";

const CACHE_FILES = [
    "index.html",
    "style.css",
    "script.js"
]


self.addEventListener("install", e => {
    e.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(CACHE_FILES);
        })
    );
    console.log("Installation completed");
});

self.addEventListener("activate", e => {

});

self.addEventListener("fetch", e => {
    // Ignore non-HTTP/HTTPS and non-GET requests (e.g. chrome extensions, websockets)
    if (!e.request.url.startsWith("http") || e.request.method !== "GET") return;

    // offline experince
    // whenever a file is requested
    // 1. fetch from network , update my cache 
    // 2. cache as a fallback

    e.respondWith(
        fetch(e.request).then(res => {
            // update my cache
            const clonedata = res.clone();
            caches.open(CACHE_NAME).then(cache => {
                return cache.put(e.request, clonedata);
            });
            console.log("coming from network", e.request);
            return res;
        }).catch(() => {
            console.log("coming from cache", e.request);
            return caches.match(e.request).then(file => file)
        })
    );
});