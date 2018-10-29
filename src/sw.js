import DBHelper from './js/dbhelper'
import dbPromise from './js/dbpromise'

var CACHE_NAME = 'apcachev9';
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

self.addEventListener('sync', function(event) {
  if (event.tag == 'syncFavorite') {
    event.waitUntil(syncFavorites());
  }
});

function syncFavorites() {
  // TODO: STEP 5 open offline-favorites store
  // for each record stored there, do a PUT request to the API.
  // If the user is online, this will happen right away. If the user was offline
  console.log('syncFavorites sync detected');
  return dbPromise.getOfflineFavorites().then(offlineFavoriteRestaurants => {
    console.log('test sync favorites');

    offlineFavoriteRestaurants.forEach(restaurant => {

      const url = `${DBHelper.DATABASE_URL}/restaurants/${restaurant.id}/?is_favorite=${restaurant.is_favorite}`;
      const PUT = {method: 'PUT'};
      return fetch(url, PUT).then(response => {
        console.log('got fetch response');
        if (!response.ok) return Promise.reject("We couldn't mark restaurant as favorite.");
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
