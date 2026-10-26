
const CACHE_NAME = "yooyyaa-hotel-v2";

const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./hotel-login.html",
  "./dashboard.html",
  "./guest-registration.html",
  "./bookings.html",
  "./payments.html",
  "./manifest.json"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(FILES_TO_CACHE))
  );

  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );

  self.clients.claim();
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // Faayilota login fi fuula hoteelaa network irraa haaraa argadhu.
  if (
    url.origin === self.location.origin &&
    (
      url.pathname.endsWith("/hotel-login.html") ||
      url.pathname.endsWith("/dashboard.html")
    )
  ) {
    event.respondWith(
      fetch(event.request, { cache: "no-store" })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request);
    })
  );
});
