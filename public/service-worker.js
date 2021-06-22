// 
//This is where I want to be able to save the offline info
// const CACHE_NAME ="Static-cache-v2";
// const DATA_CACHE_NAME ="data-cache-v1";
const FILES_TO_CACHE = [
    "/db.js",
    "/index.html",
    "/index.js",
    "/manifest.webmanifest",
    "/service-worker.js",
    "/styles.css",
    "/",
    "/icons/icon-192x192.png",
    "/icons/icon-512x512.png"

]
const PRECACHE = 'precache-v1';
const RUNTIME = 'runtime';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(PRECACHE)
      .then((cache) => cache.addAll(FILES_TO_CACHE))
      .then(self.skipWaiting())
  );
});

// self.addEventListener("install", function (evt) {
//     evt.waitUntil(
//         caches.open(DATA_CACHE_NAME).then((cache) => cache.add("/api"))
//         );
//         evt.waitUntil(
//             caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
//           );
      
//           // tell the browser to activate this service worker immediately once it
//           // has finished installing
//           self.skipWaiting();
//         });
self.addEventListener('activate', (event) => {
    const currentCaches = [PRECACHE, RUNTIME];
    event.waitUntil(
      caches
        .keys()
        .then((cacheNames) => {
          return cacheNames.filter((cacheName) => !currentCaches.includes(cacheName));
        })
        .then((cachesToDelete) => {
          return Promise.all(
            cachesToDelete.map((cacheToDelete) => {
              return caches.delete(cacheToDelete);
            })
          );
        })
        .then(() => self.clients.claim())
    );
  });
  
  self.addEventListener('fetch', (event) => {
    if (event.request.url.startsWith(self.location.origin)) {
      event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
  
          return caches.open(RUNTIME).then((cache) => {
            return fetch(event.request).then((response) => {
              return cache.put(event.request, response.clone()).then(() => {
                return response;
              });
            });
          });
        })
      );
    }
  });
  