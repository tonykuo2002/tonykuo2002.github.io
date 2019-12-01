// CODELAB: Add list of files to cache here.
const CACHE_NAME = 'shell-content';
const FILES_TO_CACHE = [
  '/offline.html',
];

// CODELAB: Precache static resources here.
self.addEventListener('install', function(evt) {
  console.log('[ServiceWorker] Install');
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker] Pre-caching offline page');
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  
  // CODELAB: Remove previous cached data from disk.
  evt.waitUntil(
      caches.keys().then((keyList) => {
        return Promise.all(keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[ServiceWorker] Removing old cache', key);
            return caches.delete(key);
          }
        }));
      })
  );  
});

self.addEventListener('fetch', function(event) {
    // CODELAB: Add fetch event handler here.
    if (event.request.mode !== 'navigate') {
      // Not a page navigation, bail.
      return;
    }
    event.respondWith(
        fetch(event.request)
            .catch(() => {
              return caches.open(CACHE_NAME)
                  .then((cache) => {
                    return cache.match('offline.html');
                  });
            })
    );
});

