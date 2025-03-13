// self.addEventListener('fetch',
//     function(event) {
 
//     }
//  )
 
//  self.addEventListener('install',function(event){
 
//  })
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open('opay-cache').then(function(cache) {
            return cache.addAll([
                '/opaydb'  // Cache this first
            ]);
        })
    );
    self.skipWaiting(); // Forces service worker to activate immediately
});

self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheName !== 'opay-cache') {
                        return caches.delete(cacheName); // Delete old caches
                    }
                })
            );
        })
    );
    self.clients.claim(); // Ensures the new service worker takes control
});

self.addEventListener('fetch', function(event) {
    if (event.request.mode === 'navigate') {
        event.respondWith(
            caches.match('/opaydb').then(function(response) {
                return response || fetch(event.request);
            })
        );
    } else {
        event.respondWith(
            caches.match(event.request).then(function(response) {
                return response || fetch(event.request);
            })
        );
    }
});
