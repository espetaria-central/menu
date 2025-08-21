const CACHE_NAME = 'cache-img';
const urlsToCache = [
  '/menu/',
  '/menu/img/espeto.jpg',
  '/menu/img/sopa.jpg',
  '/menu/img/coca.jpg',
  '/menu/img/vitamina.jpg',
  '/menu/img/bud.jpg',
  '/menu/img/pudim.jpg',
  '/menu/img/burger.jpg',
  '/menu/img/batata.jpg',
  '/menu/img/agrega.jpg',
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
