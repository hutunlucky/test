var VERSION = 'v2';

// 缓存
self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(VERSION).then(function (cache) {
            console.log('Opened cache');
            return cache.addAll([
                './sw-demo.html',
                './script/jquery.min.js',
                './img/mm.png'
            ]);
        })
    );
});

// 缓存更新
self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.map(function (cacheName) {
                    // 如果当前版本和缓存版本不一致
                    if (cacheName !== VERSION) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// 捕获请求并返回缓存数据
self.addEventListener('fetch', function (event) {
    event.respondWith(caches.match(event.request).catch(function () {
        console.log("fetch cache.match catch")       
        console.log(event.request)
        return fetch(event.request);
    }).then(function (response) {
        console.log("fetch cache.match then")
        console.log(event.request)
        console.log(response)
        console.log(caches)
        
        if (response) {
            caches.open(VERSION).then(function (cache) {
                cache.put(event.request, response);
            });
            return response.clone();
        }
        return fetch(event.request);
    }).catch(function () {        
        console.log("fetch event.respondWith catch")
        return caches.match('./img/mm.png');
    }));
});