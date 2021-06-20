const CACHE_NAME ="Static-cache-v2";
const DATA_CACHE_NAME ="data-cache-v1";
const FILES_TO_CACHE = [


]

self.addEventListener("install", function (evt) {
    evt.waitUntil(
        caches.open(DATA_CACHE_NAME).then((cache) => cache.add("/api/icons"))
        );
        evt.waitUntil(
            caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
          );
      
          // tell the browser to activate this service worker immediately once it
          // has finished installing
          self.skipWaiting();
        });
        self.addEventListener("activate", function(evt) {
            evt.waitUntil(
              caches.keys().then(keyList => {
                return Promise.all(
                  keyList.map(key => {
                    if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
                      console.log("Removing old cache data", key);
                      return caches.delete(key);
                    }
                  })
                );
              })
            );
        
            self.clients.claim();
          });

        self.addEventListener('fetch', function(evt) {
            // code to handle requests goes here
            if (evt.request.url.includes("/api"))   {
            evt.respondWith(
                caches.open(DATA_CACHE_NAME).then (cache => {
                    return fetch(evt.request)
                    .then (response => {
                        if (response.status ===200) {
                            cache.put(evt.request.url, response.clone());
                        }
                        return response
                    })
                    .catch (err =>{
                        return cache.match (evt.request)

                    });
                }).catch (err => console.log(err))
            )
            return;

            }
            });
            evt.respondWith(
                caches.open(CACHE_NAME).then(cache => {
                  return cache.match(evt.request).then(response => {
                    return response || fetch(evt.request);
                  });
                })
              );