self.addEventListener("install", () => {
  console.log("Service Worker installing - Started");
  console.log("Service Worker installing - Completed");
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker activating - Started");
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          console.log(`Deleting old cache: ${cacheName}`);
          return caches.delete(cacheName);
        })
      ).then(() => {
        console.log(
          "Service Worker activating - Completed (Old caches cleared)"
        );
      });
    })
  );
});

// Fetch event handler removed to avoid "no-op fetch handler" warning
// If caching is needed in the future, implement proper fetch handling here
