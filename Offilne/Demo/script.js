// 1. Check and register service worker
if (navigator.serviceWorker) {
    navigator.serviceWorker.register("./serviceworker.js")
        .then((res) => {
            console.log("Service worker registered successfully:", res);
        })
        .catch((err) => {
            console.log("Service worker registration failed:", err);
        });
} else {
    console.log("Service worker not supported in your browser");
}

// 2. In-App UI Toast Helper function
function showInAppToast(title, body) {
    let container = document.getElementById("toast-container");
    if (!container) {
        container = document.createElement("div");
        container.id = "toast-container";
        container.className = "toast-container";
        document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `
        <img src="icon192.png" alt="Devtinder Icon">
        <div class="toast-content">
            <h4>${title}</h4>
            <p>${body}</p>
        </div>
    `;

    container.appendChild(toast);

    // Auto remove toast after 4 seconds
    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateY(-15px)";
        setTimeout(() => toast.remove(), 350);
    }, 4000);
}

// 3. Listen to messages from Service Worker (when DevTools Push button is clicked)
if (navigator.serviceWorker) {
    navigator.serviceWorker.addEventListener("message", (event) => {
        if (event.data && event.data.type === "PUSH_NOTIFICATION") {
            showInAppToast(event.data.title, event.data.body);
        }
    });
}

// 4. Notify Me Button Trigger
const notifyBtn = document.getElementById("notify-btn");

if (notifyBtn) {
    notifyBtn.addEventListener("click", async () => {
        console.log("Current Notification Permission:", Notification.permission);

        // Request permission if not already granted
        if (Notification.permission !== "granted") {
            const permission = await Notification.requestPermission();
            console.log("Permission response:", permission);
            if (permission !== "granted") {
                alert("Permission denied! Please enable notifications in your browser address bar.");
                return;
            }
        }

        const title = "Devtinder Notification 🎉";
        const body = "Hello! Push notification is working perfectly!";

        // A) Show directly on the webpage UI
        showInAppToast(title, body);

        // B) Also trigger OS-level notification via Service Worker
        try {
            const sw = await navigator.serviceWorker.ready;
            await sw.showNotification(title, {
                body: body,
                icon: "icon192.png",
                badge: "icon192.png"
            });
            console.log("Notification triggered successfully!");
        } catch (err) {
            console.error("Error triggering notification:", err);
        }
    });
}