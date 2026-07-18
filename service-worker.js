const CACHE_NAME = "coc-archive-v2";
const FILES_TO_CACHE = ["./index.html", "./manifest.json"];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting(); // don't wait for old tabs to close before installing
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()) // take control of already-open pages right away, not just new ones
  );
});

self.addEventListener("fetch", (e) => {
  // Only cache same-origin requests (the app shell), never the Apps Script API
  if (e.request.url.startsWith(self.location.origin)) {
    e.respondWith(
      caches.match(e.request).then((cached) => cached || fetch(e.request))
    );
  }
});
