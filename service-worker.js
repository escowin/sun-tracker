// service worker enables offline functionality
// development note: clear storage in devTools whenever changes are made to service worker
const APP_PREFIX = "SunTracker-";
const VERSION = "2.7.2";
const CACHE_NAME = APP_PREFIX + VERSION;

// cache of essential files (exclude service-worker.js so update checks fetch fresh)
const FILES_TO_CACHE = [
  "./index.html",
  "./dist/manifest.json",
  "./dist/app.bundle.js",
  "./src/css/retro.css",
];

// installs service worker; skipWaiting() lets new SW take over immediately
self.addEventListener("install", (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
  );
});

// activates new SW and cleans old caches; claim() takes control of open pages
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keyList) =>
      Promise.all(
        keyList
          .filter((key) => key.startsWith(APP_PREFIX) && key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// fetches cache data; always fetch SW script from network so updates work
self.addEventListener("fetch", (e) => {
  if (e.request.url.includes("service-worker.js")) {
    e.respondWith(fetch(e.request));
    return;
  }
  e.respondWith(
    caches.match(e.request).then((cached) => cached || fetch(e.request))
  );
});
