//adapted from code from https://alexandroperez.github.io/mws-walkthrough/

import DBHelper from "./dbhelper";
import dbPromise from "./dbpromise";

function handleClick() {
  const restaurantId = this.dataset.id;
  const fav = this.getAttribute('aria-pressed') == 'true';
  const url = `${DBHelper.DATABASE_URL}/restaurants/${restaurantId}/?is_favorite=${!fav}`;
  const PUT = {method: 'PUT'};


  if ('serviceWorker' in navigator && 'SyncManager' in window) {
    // if service worker and SyncManager are supported then
    // TODO: use Background Sync to sync data with API server
    // STEP 2 Update data in idb, to reflect the restaurant as favorite or not.
    // You need to update two properties isfavorite and updatedAt
    dbPromise.getRestaurants(restaurantId).then(restaurant => {
      restaurant.is_favorite = !fav;
      restaurant.updatedAt = new Date().toISOString();
      return restaurant;
    }).then(restaurant => {
      dbPromise.putRestaurants(restaurant);
      // change state of favorite button.
      this.setAttribute('aria-pressed', restaurant.is_favorite);
      // STEP 3 In an new idb store named offline-favorites store updated restaurant
      dbPromise.putOfflineFavorite(restaurant);
    });

    // STEP 4
    navigator.serviceWorker.ready.then(function(reg) {
      return reg.sync.register('syncFavorite');
    }).catch(function() {
      // system was unable to register for a sync, this could be an OS-level restriction
      // just do a regular fetch to the PUT API endpoint.
      console.log('posting data as if background sync is not supported');
      return fetch(url, PUT).then(response => {
        if (!response.ok) return Promise.reject("We couldn't mark restaurant as favorite.");
        return response.json();
      }).then(updatedRestaurant => {
        // update restaurant on idb
        dbPromise.putRestaurants(updatedRestaurant);
        // change state of toggle button
        this.setAttribute('aria-pressed', !fav);
      });
    });

  } else {
    // If window.SyncManager or navigator.serviceWorker aren't supported, just do a regular fetch to the PUT API endpoint.
    console.log('posting data as if background sync is not supported');
    return fetch(url, PUT).then(response => {
      if (!response.ok) return Promise.reject("We couldn't mark restaurant as favorite.");
      return response.json();
    }).then(updatedRestaurant => {
      // update restaurant on idb
      dbPromise.putRestaurants(updatedRestaurant);
      // change state of toggle button
      this.setAttribute('aria-pressed', !fav);
    });
  }

}


export default function favoriteButton(restaurant) {
  const button = document.createElement('button');
  button.innerHTML = "&#x2764;"; // this is the heart symbol in hex code
  button.className = "fav"; // you can use this class name to style your button
  button.dataset.id = restaurant.id; // store restaurant id in dataset for later
  button.setAttribute('aria-label', `Mark ${restaurant.name} as a favorite`);
  button.setAttribute('aria-pressed', restaurant.is_favorite);
  button.onclick = handleClick;

  return button;
}
