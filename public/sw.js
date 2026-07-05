const CACHE_NAME = "alemah-cache-v1";
const IMAGE_CACHE_NAME = "alemah-image-cache-v1";

const OFFLINE_URL = "/offline";

const ASSETS_TO_CACHE = [
  OFFLINE_URL,
  "/favicon.ico",
  "/next.svg",
  "/vercel.svg",
  "/globe.svg",
];

// 1. Install Event
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[Service Worker] Caching offline shell assets");
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// 2. Activate Event
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME && cache !== IMAGE_CACHE_NAME) {
            console.log("[Service Worker] Clearing old cache:", cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 3. Fetch Event
self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Skip non-GET requests and browser extensions
  if (request.method !== "GET" || !url.protocol.startsWith("http")) {
    return;
  }

  // A. Image Caching Strategy (Cache First)
  if (
    request.destination === "image" || 
    url.hostname.includes("unsplash.com") || 
    url.hostname.includes("cloudinary.com")
  ) {
    event.respondWith(
      caches.open(IMAGE_CACHE_NAME).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            // Fetch clean copy in background to update cache
            fetch(request)
              .then((networkResponse) => {
                if (networkResponse.status === 200) {
                  cache.put(request, networkResponse);
                }
              })
              .catch(() => {});
            return cachedResponse;
          }
          return fetch(request)
            .then((networkResponse) => {
              if (networkResponse.status === 200) {
                cache.put(request, networkResponse.clone());
              }
              return networkResponse;
            })
            .catch(() => caches.match("/favicon.ico")); // fallback default image
        });
      })
    );
    return;
  }

  // B. Pages & API Routes (Network First with Offline Fallback)
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Cache pages successfully loaded from network
        if (response.status === 200 && request.destination === "document") {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // If network fails, try to get from cache
        return caches.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // If page fails and is a document request, return offline shell
          if (request.headers.get("accept").includes("text/html")) {
            return caches.match(OFFLINE_URL);
          }
        });
      })
  );
});

// 4. Push Notification Event Scaffolding
self.addEventListener("push", (event) => {
  let data = { title: "Alemah", body: "Discover our premium textiles." };
  try {
    if (event.data) {
      data = event.data.json();
    }
  } catch {
    data = { title: "Alemah", body: event.data ? event.data.text() : "Discover our premium textiles." };
  }

  const options = {
    body: data.body,
    icon: "/next.svg",
    badge: "/next.svg",
    vibrate: [100, 50, 100],
    data: {
      url: data.url || "/",
    },
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// 5. Notification Click Action
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: "window" }).then((clientList) => {
      const urlToOpen = event.notification.data.url;
      for (const client of clientList) {
        if (client.url === urlToOpen && "focus" in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(urlToOpen);
      }
    })
  );
});
