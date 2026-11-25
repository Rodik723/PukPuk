const CACHE_NAME = 'pukpuk-v2'; // Поменяли версию на v2, чтобы браузер понял, что кэш обновился
const ASSETS = [
  './',
  './manifest.json',
  './mascot-mia-idle.png',
  './mascot-mia-happy.png',
  './mascot-mia-surprised.png',
  './mascot-mia-hello.png'
];

self.addEventListener('install', (e) => {
  self.skipWaiting(); // Принудительно активируем новый Service Worker
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => {
      // Если файл есть в кэше — отдаем его, если нет — идем в сеть
      return res || fetch(e.request);
    }).catch(() => {
      // Если сети нет и файла нет в кэше, возвращаем главную страницу
      return caches.match('./');
    })
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
});