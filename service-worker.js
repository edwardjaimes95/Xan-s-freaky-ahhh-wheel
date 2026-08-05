const CACHE = "xans-wheel-v4-7-live-options";

const FILES = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./assets/rewards/cuddle.png",
  "./assets/rewards/snack.png",
  "./assets/rewards/movie.png",
  "./assets/rewards/massage.png",
  "./assets/rewards/date.png",
  "./assets/rewards/mystery.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(FILES))
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE)
          .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  if (url.pathname.endsWith("/wheel-options.json")) {
    event.respondWith(
      fetch(event.request, { cache: "no-store" })
        .then(response => {
          if (!response.ok) {
            throw new Error(`wheel-options.json returned ${response.status}`);
          }

          const copy = response.clone();
          caches.open(CACHE).then(cache => {
            cache.put("./wheel-options.json", copy);
          });

          return response;
        })
        .catch(() => caches.match("./wheel-options.json"))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;

      return fetch(event.request).then(response => {
        const copy = response.clone();
        caches.open(CACHE).then(cache => cache.put(event.request, copy));
        return response;
      });
    })
  );
});
