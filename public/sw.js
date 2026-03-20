// GALENDER 서비스 워커 — PWA + 푸시 알림 처리

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request));
});

// 푸시 알림 수신 처리
self.addEventListener('push', (event) => {
  if (!event.data) return;

  const data = event.data.json();
  const title = data.title ?? 'GALENDER';
  const options = {
    body: data.body ?? '새 알림이 있습니다.',
    icon: '/galenderciapp.png',
    badge: '/galenderciapp.png',
    data: { url: data.url ?? '/' },
    requireInteraction: false,
    tag: data.tag ?? 'galender-push',
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// 알림 클릭 시 해당 URL 열기
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url ?? '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});
