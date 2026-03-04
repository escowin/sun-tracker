// service worker enables offline functionality
// development note: clear storage in devTools whenever changes are made to service worker
const APP_PREFIX = "SunTracker-";
const VERSION = "2.7.2";
const CACHE_NAME = APP_PREFIX + VERSION;

// cache of essential files
const FILES_TO_CACHE = [
  "./index.html",
  "./service-worker.js",
  "./dist/manifest.json",
  "./dist/app.bundle.js",
  "./dist/assets/img/background.jpg",
];

// installs service worker; skipWaiting() lets new SW take over immediately
self.addEventListener("install", (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log(CACHE_NAME + " cache installed");
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

// activates new SW and cleans old caches; claim() takes control of open pages
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keyList) =>
      Promise.all(
        keyList
          .filter((key) => key.startsWith(APP_PREFIX) && key !== CACHE_NAME)
          .map((key) => {
            console.log("cache deleted:", key);
            return caches.delete(key);
          })
      )
    ).then(() => self.clients.claim())
  );
});

// fetches cache data
self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((cached) => cached || fetch(e.request))
  );
});
