self.addEventListener('install', event => {
    self.waitUntil(self.skipWaiting());
    console.log('Service worker installed!');
});

self.addEventListener('activate', event => {
    console.log('Service worker ready to go!');
});

self.addEventListener('fetch', event => {
    console.log(`🚂 ${event.request.method} request to ${event.request.url}`);
});
