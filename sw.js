// self.addEventListener('fetch',
//     function(event) {
 
//     }
//  )
 
//  self.addEventListener('install',function(event){
 
//  })
self.addEventListener("install", function (event) {
    event.waitUntil(
        caches.open("opay-cache").then(function (cache) {
            return cache.addAll([
                "/opaydb",  // Force caching the welcome page
            ]);
        })
    );
    self.skipWaiting(); // Activate the service worker immediately
});

self.addEventListener("fetch", function (event) {
    event.respondWith(
        caches.match(event.request).then(function (response) {
            if (response) {
                return response;
            }
            return fetch(event.request).catch(() => caches.match("/opaydb"));
        })
    );
});

