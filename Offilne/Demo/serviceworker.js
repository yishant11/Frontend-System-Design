const CACHE_NAME = "devtinder-pwa-v4";

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

// 1. Install Event: Cache static files & activate immediately
self.addEventListener("install", (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(CACHE_FILES);
        })
    );
    self.skipWaiting();
    console.log("Service Worker: Installed & skipWaiting called");
});

// 2. Activate Event: Clean old caches and claim clients
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
    console.log("Service Worker: Activated & Claimed");
});

// 3. Fetch Event: Network first with cache fallback
self.addEventListener("fetch", (e) => {
    if (!e.request.url.startsWith("http") || e.request.method !== "GET") return;

    e.respondWith(
        fetch(e.request)
            .then((res) => {
                if (res && res.status === 200) {
                    const clonedata = res.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(e.request, clonedata);
                    });
                }
                return res;
            })
            .catch(async () => {
                const cachedResponse = await caches.match(e.request);
                if (cachedResponse) {
                    return cachedResponse;
                }
                if (e.request.mode === "navigate") {
                    return caches.match("index.html");
                }
            })
    );
});

// 4. Push Event: Listen for incoming push messages
self.addEventListener("push", (e) => {
    console.log("Service Worker: Push event received!", e);
    const message = e.data ? e.data.text() : "New notification from Devtinder! 🎉";
    
    // A) Broadcast to all open tabs so the UI displays the In-App Toast
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
        clientList.forEach((client) => {
            client.postMessage({
                type: "PUSH_NOTIFICATION",
                title: "Devtinder Push 🎉",
                body: message
            });
        });
    });

    // B) Show OS-level notification
    e.waitUntil(
        self.registration.showNotification("Devtinder Notification", {
            body: message,
            icon: "icon192.png",
            badge: "icon192.png"
        }).then(() => {
            console.log("Notification shown successfully!");
        }).catch((err) => {
            console.error("Failed to show notification:", err);
        })
    );
});

// 5. Notification Click Event: Focus or open the app when clicked
self.addEventListener("notificationclick", (e) => {
    console.log("Notification clicked!");
    e.notification.close();
    e.waitUntil(
        clients.matchAll({ type: "window" }).then((clientList) => {
            for (const client of clientList) {
                if ("focus" in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow("./");
            }
        })
    );
});