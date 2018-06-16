var CACHE_NAME = 'my-site-cache-v1';
var urlsToCache = [
  '/test/',
  '/test/styles/main.css',
  '/test/script/main.js'
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

self.addEventListener('message', function(event) {
  var promise = self.clients.matchAll()
      .then(function(clientList) {
          var senderId = event.source ? event.source.id: 'unknown';
          if (!event.source) {
              console.log('event.source is null; we don\'t know the sender of the ' +
          'message');
          }
          clientList.forEach(function(client) {
              if (client.id !== senderId) {
                  return;
              }

              client.postMessage({
                  client: senderId,
                  message: event.data
              })
          })
      })
  if (event.waitUntil) {
      event.waitUntil(promise);
  }
});


self.addEventListener('activate', function(event) {
  event.waitUntil(self.clients.claim());
})