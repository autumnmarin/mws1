var CACHE_NAME = 'apcachev9';
var urlsToCache = [
    '/',
    '/css/styles.css',
    '/img/1.webp',
    '/img/2.webp',
    '/img/3.webp',
    'index.html'
  ];

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});
