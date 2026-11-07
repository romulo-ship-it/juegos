// Futbolito Súper Fútbol · versión 1.7.1
const CACHE = "futbolito-1.7.1";
const FILES = ["./", "index.html", "manifest.webmanifest", "icon-192.png", "icon-512.png",
  "maskable-512.png", "apple-touch-icon.png", "archivo.woff2", "favicon.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith("futbolito-") && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
// la página se pide primero a la red (así llegan las actualizaciones) y si no hay internet sale de la caché
self.addEventListener("fetch", e => {
  const r = e.request; if (r.method !== "GET" || new URL(r.url).origin !== location.origin) return;
  if (r.mode === "navigate") {
    e.respondWith(fetch(r).then(res => { const c = res.clone(); caches.open(CACHE).then(x => x.put("index.html", c)); return res; })
      .catch(() => caches.match("index.html")));
    return;
  }
  e.respondWith(caches.match(r).then(hit => hit || fetch(r)));
});
