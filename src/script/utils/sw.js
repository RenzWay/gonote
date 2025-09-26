// Ubah versi cache setiap kali ada update
const CACHES_NAME = 'gonote-v2'; // Increment versi ini setiap deploy

const ASSET_TO_CACHES = ['/', '/index.html', '/main.css', '/bundle.main.js', '/public'];

self.addEventListener('install', (event) => {
  console.log('[SW] Installed');
  event.waitUntil(
    caches.open(CACHES_NAME).then((cache) => {
      return cache.addAll(ASSET_TO_CACHES);
    }),
  );
  // Force aktivasi SW baru segera
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('[SW] Activated');
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== CACHES_NAME)
            .map((name) => {
              console.log('[SW] Deleting old cache:', name);
              return caches.delete(name);
            }),
        );
      })
      .then(() => {
        // Ambil kontrol semua client yang ada
        return self.clients.claim();
      }),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      // Strategy: Network First for HTML files, Cache First for assets
      if (
        request.destination === 'document' ||
        request.url.includes('.html') ||
        request.url.endsWith('/')
      ) {
        // Network First strategy untuk HTML
        return fetch(request)
          .then((networkResponse) => {
            // Update cache dengan response terbaru
            if (networkResponse.status === 200) {
              const responseClone = networkResponse.clone();
              caches.open(CACHES_NAME).then((cache) => {
                cache.put(request, responseClone);
              });
            }
            return networkResponse;
          })
          .catch(() => {
            // Fallback ke cache jika network gagal
            return (
              cachedResponse ||
              new Response('Offline', {
                status: 503,
                statusText: 'Service Unavailable',
              })
            );
          });
      } else {
        // Cache First strategy untuk assets (CSS, JS, images)
        if (cachedResponse) {
          // Tapi tetap cek update di background
          fetch(request)
            .then((networkResponse) => {
              if (networkResponse.status === 200) {
                caches.open(CACHES_NAME).then((cache) => {
                  cache.put(request, networkResponse.clone());
                });
              }
            })
            .catch(() => {
              // Ignore network errors untuk background update
            });

          return cachedResponse;
        }

        // Jika tidak ada di cache, ambil dari network
        return fetch(request).then((networkResponse) => {
          if (networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHES_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        });
      }
    }),
  );
});

// Handle update tersedia
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
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
