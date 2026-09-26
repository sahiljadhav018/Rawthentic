// Smart Tour Connect - Enhanced PWA Service Worker
const CACHE_NAME = 'stc-app-v2';
const ASSETS = [
  './',
  './index.html',
  './logo.png',
  './logo_192.png',
  './logo_512.png',
  './manifest.json'
];

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS).catch(() => {}))
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.map((k) => (k !== CACHE_NAME ? caches.delete(k) : null))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  // Allow API requests to go straight to network
  if (e.request.url.includes('/api/') || e.request.url.includes('crudcrud.com') || e.request.method !== 'GET') {
    return;
  }
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
