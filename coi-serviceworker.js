// coi-serviceworker.js
if (typeof window !== "undefined") {
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register(window.document.currentScript.src).then((reg) => {
            reg.addEventListener("updatefound", () => {
                location.reload();
            });
            if (reg.active && !navigator.serviceWorker.controller) {
                location.reload();
            }
        });
    }
} else {
    self.addEventListener("install", () => self.skipWaiting());
    self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));
    self.addEventListener("fetch", (e) => {
        if (e.request.cache === "only-if-cached" && e.request.mode !== "same-origin") return;
        e.respondWith(
            fetch(e.request).then((res) => {
                if (res.status === 0) return res;
                const headers = new Headers(res.headers);
                headers.set("Cross-Origin-Opener-Policy", "same-origin");
                headers.set("Cross-Origin-Embedder-Policy", "require-corp");
                return new Response(res.body, { status: res.status, statusText: res.statusText, headers });
            }).catch((err) => console.error(err))
        );
    });
}
