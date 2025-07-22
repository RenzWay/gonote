self.addEventListener("install", (event) => {
  console.log("[SW] Installed");
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("[SW] Activated");
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((res) => {
      return res || fetch(event.request);
    })
  );
});

self.addEventListener("push", function (event) {
  const title = "New Notification";
  const options = {
    body: "You've got a message!",
    icon: "./public/notes.png",
    badge: "./public/react.png",
    data: "/",
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();

  event.waitUntil(clients.openWindow(event.notification.data || "/"));
});
