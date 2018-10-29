import DBHelper from './js/dbhelper'
import dbPromise from './js/dbpromise'

//files to cache
var CACHE_NAME = 'RRcache';
var urlsToCache = [
    '/',
    '/css/styles.css',
    '/img/1.webp',
    '/img/2.webp',
    '/img/3.webp',
    '/img/4.webp',
    '/img/5.webp',
    '/img/6.webp',
    '/img/7.webp',
    '/img/8.webp',
    '/img/9.webp',
    '/img/10.webp',
    '/img/undefined.webp',
    '/js/main.js',
    '/js/restaurant_info.js',
    'index.html',
    'manifest.json',
    'restaurant.html',
    'restaurant.html?id=1',
    'restaurant.html?id=2',
    'restaurant.html?id=3',
    'restaurant.html?id=4',
    'restaurant.html?id=5',
    'restaurant.html?id=6',
    'restaurant.html?id=7',
    'restaurant.html?id=8',
    'restaurant.html?id=9',
    'restaurant.html?id=10',
  ];

//Event listenter for, return addAll
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

//Event listener for fetch
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

//Event listener for background sync
self.addEventListener('sync', function(event) {
  if (event.tag == 'syncFavorite') {
    event.waitUntil(syncFavorites());
  }
});

//Event listener for syncing favorites
function syncFavorites() {
  return dbPromise.getOfflineFavorites().then(offlineFavoriteRestaurants => {
    offlineFavoriteRestaurants.forEach(restaurant => {
      const url = `${DBHelper.DATABASE_URL}/restaurants/${restaurant.id}/?is_favorite=${restaurant.is_favorite}`;
      const PUT = {method: 'PUT'};
      return fetch(url, PUT).then(response => {
        console.log('Fetch response received');
        if (!response.ok) return Promise.reject("Cannot save favorite");
        return response.json();
      }).then(updatedRestaurant => {
        // update restaurant on idb
        dbPromise.putRestaurants(updatedRestaurant, true);
      });
    });

  }).then(function(){
    dbPromise.clearOfflineFavorites();
  })
}
