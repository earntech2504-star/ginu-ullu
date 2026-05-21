const CACHE = 'ginu-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];
self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)));
});
self.addEventListener('activate', e => {
  e.waitUntil(self.clients.claim());
});
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(res => {
      return res || fetch(e.request).then(networkRes => {
        if(networkRes && networkRes.status === 200 && e.request.method === 'GET'){
          const copy = networkRes.clone();
          caches.open(CACHE).then(cache => cache.put(e.request, copy));
        }
        return networkRes;
      }).catch(()=> caches.match('./index.html'));
    })
  );
});
