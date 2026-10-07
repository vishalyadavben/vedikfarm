/*
 * Vedik Farms service worker - deliberately minimal.
 * It only does two things: lets the browser treat the site as an installable app, and shows
 * a friendly page if someone opens the shop with no connection.
 * It never caches products, prices, carts, orders or any API call, so customers can't be shown stale data.
 */
const OFFLINE_CACHE = 'vf-offline-v1';
const OFFLINE_URL = '/offline.html';

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      try {
        const res = await fetch(OFFLINE_URL, { cache: 'reload' });
        const html = await res.text();
        // Only keep it if it really is our offline page (not the app's index.html served by a catch-all rule).
        if (res.ok && html.includes('vf-offline')) {
          const cache = await caches.open(OFFLINE_CACHE);
          // Store a fresh copy: a response that went through a redirect can't be used to answer a page navigation.
          await cache.put(OFFLINE_URL, new Response(html, { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } }));
        }
      } catch (e) {
        /* offline while installing - the shop still works online */
      }
      await self.skipWaiting();
    })()
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => k !== OFFLINE_CACHE).map((k) => caches.delete(k)));
      await self.clients.claim();
    })()
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  // Only page navigations get the offline fallback; images, scripts and API calls are left entirely to the network.
  if (req.mode !== 'navigate') return;
  event.respondWith(
    fetch(req).catch(async () => {
      const cached = await caches.match(OFFLINE_URL);
      return cached || new Response('You are offline. Please check your connection and try again.', {
        status: 503,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      });
    })
  );
});
