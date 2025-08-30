const CACHE_NAME = 'cache-img';
const urlsToCache = [
  '/img/espeto.webp',
  '/img/sopa.webp',
  '/img/coca.webp',
  '/img/vitamina.webp',
  '/img/bud.webp',
  '/img/pudim.webp',
  '/img/batata.webp',
  '/img/agrega.webp',
];

self.addEventListener('install', event => {event.waitUntil(
caches.open(CACHE_NAME)
.then(cache => {
console.log('Cache funcionando');
return cache.addAll(urlsToCache);})
  );
});

self.addEventListener('fetch', event => {
if (event.request.destination === 'image') {event.respondWith(
caches.match(event.request)
.then(response => {
if (response) {
console.log('Imagem do cache:', event.request.url);
return response;}
return fetch(event.request).then(
networkResponse => {
const responseToCache = networkResponse.clone();
caches.open(CACHE_NAME).then(cache => {
cache.put(event.request, responseToCache);});
return networkResponse;});
        })
    );
  }
});
