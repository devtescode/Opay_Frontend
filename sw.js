// self.addEventListener('fetch',
//     function(event) {
 
//     }
//  )
 
//  self.addEventListener('install',function(event){
 
//  })
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    return caches.delete(cacheName); // Delete old caches
                })
            );
        }).then(() => {
            return caches.open('opay-cache').then(function(cache) {
                return cache.addAll([
                    '/opaydb',  // Cache the welcome page
                ]);
            });
        })
    );
    self.skipWaiting(); // Force immediate activation
});

self.addEventListener('activate', function(event) {
    event.waitUntil(self.clients.claim()); // Ensure the new SW takes control immediately
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request).then(function(response) {
            return response || fetch(event.request);
        })
    );
});
