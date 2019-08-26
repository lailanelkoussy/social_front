importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

workbox.precaching.precacheAndRoute([]);

workbox.routing.registerRoute(
    new RegExp(('\\.png$')),
    new workbox.strategies.CacheFirst()
);

workbox.routing.registerRoute(
    new RegExp('http://localhost:8762/'),
    new workbox.strategies.NetworkFirst()
);

const bgSyncPlugin = new workbox.backgroundSync.Plugin('myQueueName', {
    maxRetentionTime: 60 //(specified in minutes)
});

workbox.routing.registerRoute(
    new RegExp('http://localhost:8762/'),
    new workbox.strategies.NetworkOnly({
        plugins: [bgSyncPlugin]
    }),
    'POST'
);