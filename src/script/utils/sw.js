const CACHES_NAME = 'gonote-v1';

const ASSET_TO_CACHES = ['/', '/index.html', '/main.css', '/bundle.main.js', '/public'];

self.addEventListener('install', (event) => {
  console.log('[SW] Installed');
  event.waitUntil(
    caches.open(CACHES_NAME).then((cache) => {
      return cache.addAll(ASSET_TO_CACHES);
    }),
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('[SW] Activated');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((name) => name !== CACHES_NAME).map((name) => caches.delete(name)),
      );
    }),
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((res) => {
      return res || fetch(event.request);
    }),
  );
});

self.addEventListener('push', function (event) {
  const title = 'New Notification';
  const options = {
    body: "You've got a message!",
    icon: './public/notes.png',
    badge: './public/react.png',
    data: '/',
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();

  event.waitUntil(clients.openWindow(event.notification.data || '/'));
});
