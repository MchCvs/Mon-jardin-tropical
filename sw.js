// Service Worker pour Mon Jardin Tropical
const CACHE_NAME = 'jardin-v4';
const APP_ROOT = self.registration.scope;

const APP_FILES = [
  'index.html',
  'manifest.json',
  'icon-192.png',
  'icon-512.png',
  'icon-96.png',
  'apple-touch-icon.png',
  'favicon.svg',
  'sw.js',
  'suncalc.js'
].map(path => new URL(path, APP_ROOT).href);

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_FILES))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(names =>
      Promise.all(
        names
          .filter(name => name.startsWith('jardin-') && name !== CACHE_NAME)
          .map(name => caches.delete(name))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.open(CACHE_NAME)
      .then(cache => cache.match(event.request))
      .then(response => response || fetch(event.request))
  );
});
