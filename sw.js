const CACHE_NAME = 'nov-mdtotco-v15';
const URLS = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png'];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(URLS))); self.skipWaiting(); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))); self.clients.claim(); });
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request).then(cached => {
    if (cached) return cached;
    return fetch(e.request).then(r => {
      if (r.ok && new URL(e.request.url).origin === self.location.origin) {
        const copy = r.clone(); caches.open(CACHE_NAME).then(c => c.put(e.request, copy));
      }
      return r;
    }).catch(() => caches.match('./index.html'));
  }));
});
