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
                '/opaydb',  // Cache the welcome page
                '/'
            ]);
        })
    );
    self.skipWaiting(); // Activate the service worker immediately
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request).then(function(response) {
            if (response) {
                return response; // Return cached response
            }
            return fetch(event.request).catch(() => {
                // If fetch fails (offline), serve opaydb as fallback
                return caches.match('/opaydb');
            });
        })
    );
});
