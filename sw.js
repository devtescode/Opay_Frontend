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
            ]);
        })
    );
    self.skipWaiting(); // Activate the service worker immediately
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request).then(function(response) {
            return response || fetch(event.request);
        })
    );
});
