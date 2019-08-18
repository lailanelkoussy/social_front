importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

workbox.precaching.precacheAndRoute([]);

workbox.routing.registerRoute(
    new RegExp(('\\.png$')),
    new workbox.strategies.CacheFirst()
);

workbox.routing.registerRoute(
    new RegExp('http://localhost:8762/'),
    new workbox.strategies.StaleWhileRevalidate()
);