// service-worker.js
const CACHE_NAME = 'drawchat-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/styles.css',
    '/app.js',
    '/manifest.json',
    '/offline-page.html',
    '/favicon.ico',

];

// Install event
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ASSETS_TO_CACHE))
            .then(() => self.skipWaiting())
    );
});

// Activate event
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch event
self.addEventListener('fetch', (event) => {
    // Skip cross-origin requests
    if (!event.request.url.startsWith(self.location.origin)) {
        return;
    }
    // Only handle GET requests per Cache API specs
    // to avoid cashing sensitive data for security reasons
    if (event.request.method !== 'GET') {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    // Return cached response if available
                    return response;
                }

                return fetch(event.request)
                    .then(response => {
                        // Don't cache non-successful responses
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // Clone the response
                        const responseToCache = response.clone();

                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    });
            })
            .catch(() => {
                // Handle errors gracefully: return offline page for navigation requests
                if (event.request.mode === 'navigate') {
                    return caches.match('/offline-page.html');
                }
            })
    );
});

// Background sync for messages
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-messages') {
        event.waitUntil(syncMessages());
    }
});

// Push notification handling
self.addEventListener('push', (event) => {
    // // Parse the data received from the push event
    const data = event.data.json();
    // data ? data.text() : 'New message received',
    // event.data ? event.data.text() : 'New message received',
    const body = data.notification.body || 'New message received';

    // Log that the push notification has been received
    console.log("service-worker: push notification received from server ", data.notification.body);

    const options = {
        body,
        icon: '/favicon.ico',
        badge: '/favicon.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'Open DrawChat'
            },
            {
                action: 'close',
                title: 'Close'
            }
        ]
    };

    event.waitUntil(
        self.registration.showNotification('YuliaDrawChat', options)
    );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

async function syncMessages() {
    try {
        const messages = await getQueuedMessages();
        for (const message of messages) {
            await sendMessage(message);
        }
        await clearQueuedMessages();
    } catch (error) {
        console.error('Error syncing messages:', error);
    }
}

// Helper functions for IndexedDB operations
async function getQueuedMessages() {
    // Implementation would go here
    return [];
}

async function sendMessage(message) {
    // Implementation would go here
}

async function clearQueuedMessages() {
    // Implementation would go here
}
