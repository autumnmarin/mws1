//adapted from code from https://alexandroperez.github.io/mws-walkthrough/

import idb from 'idb';

const dbPromise = {
  db: idb.open('restaurant-reviews-db', 3, function(upgradeDb) {
    switch (upgradeDb.oldVersion) {
      case 0:
        upgradeDb.createObjectStore('restaurants', { keyPath: 'id' });
      case 1:
        upgradeDb.createObjectStore('reviews', { keyPath: 'id' })
          .createIndex('restaurant_id', 'restaurant_id');
      case 2:
        upgradeDb.createObjectStore('offline-favorites', { keyPath: 'id' } )
      case 3:
        upgradeDb.createObjectStore('offline-reviews', {autoIncrement: true} )
          .createIndex('restaurant_id', 'restaurant_id');
      }
  }),

  /**
   * Save a restaurant(s) using promises. If second argument passed is true, data will be force updated
   */
  putRestaurants(restaurants, forceUpdate = false) {
    if (!restaurants.push) restaurants = [restaurants];
    return this.db.then(db => {
      const store = db.transaction('restaurants', 'readwrite').objectStore('restaurants');
      Promise.all(restaurants.map(networkRestaurant => {
        return store.get(networkRestaurant.id).then(idbRestaurant => {
          if (forceUpdate) return store.put(networkRestaurant);
          if (!idbRestaurant || new Date(networkRestaurant.updatedAt) > new Date(idbRestaurant.updatedAt)) {
            return store.put(networkRestaurant);
          }
        });
      })).then(function () {
        return store.complete;
      });
    });
  },

  /**
   * Get a restaurant by id, if no id, give all
   */
  getRestaurants(id = undefined) {
    return this.db.then(db => {
      const store = db.transaction('restaurants').objectStore('restaurants');
      if (id) return store.get(Number(id));
      return store.getAll();
    });
  },

  /**
   * Save a review or array of reviews into idb, using promises
   */
  putReviews(reviews) {
    if (!reviews.push) reviews = [reviews];
    return this.db.then(db => {
      const store = db.transaction('reviews', 'readwrite').objectStore('reviews');
      Promise.all(reviews.map(networkReview => {
        return store.get(networkReview.id).then(idbReview => {
          if (!idbReview || new Date(networkReview.updatedAt) > new Date(idbReview.updatedAt)) {
            return store.put(networkReview);
          }
        });
      })).then(function () {
        return store.complete;
      });
    });
  },

  /**
   * Get all reviews for a specific restaurant, by its id, using promises.
   */
  getReviewsForRestaurant(id) {
    return this.db.then(db => {
      const storeIndex = db.transaction('reviews').objectStore('reviews').index('restaurant_id');
      return storeIndex.getAll(Number(id));
    });
  },

  getOfflineFavorites() {
    return this.db.then(db => {
      const store = db.transaction('offline-favorites').objectStore('offline-favorites');
      return store.getAll();
    });
  },

  putOfflineFavorite(data) {
    return this.db.then(db => {
      const store = db.transaction('offline-favorites', 'readwrite').objectStore('offline-favorites');
      store.put(data);
    })
  },

  clearOfflineFavorites(){
    return this.db.then(db => {
        const store = db.transaction('offline-favorites', 'readwrite').objectStore('offline-favorites');
        return store.clear();
    })
  },

};

export default dbPromise;
