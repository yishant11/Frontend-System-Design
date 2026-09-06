// check if service worker is suppoted in your browser or not
if (navigator.serviceWorker) {


    // Registering sw to the browser
    navigator.serviceWorker.register("./serviceworker.js")
        .then((res) => {
            console.log("Service worker registered", res)
        })
        .catch((err) => {
            console.log("Service worker not registered", err)
        })
} else {
    console.log("Service worker not supported in your browser")
}