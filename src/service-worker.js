const CORE_CACHE_NAME = 'core-cache';
const CORE_ASSETS = [
    '/index.css',
    '/index.js',
    '/offline/'
];

// Precache static assets
self.addEventListener('install', event => {
    //
    // Assignment 2
    //
});

// Delete outdated core caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.open(CORE_CACHE_NAME).then(cache => {
            return cache.keys().then(requests => {
                const outdatedCoreCaches = requests.filter(request => {
                    return !CORE_ASSETS.includes(getPathName(request.url));
                });

                console.info('Deleting outdated core caches', outdatedCoreCaches);
                outdatedCoreCaches.map(cacheName => {
                    return cache.delete(cacheName)
                });
            })
        })
    )
});

self.addEventListener('fetch', event => {
    const request = event.request;
    if (isCoreGetRequest(request)) {
        console.info('Core get request: ', request.url);
        //
        // Assignment 2
        //
    } else if (isHtmlGetRequest(request)) {
        console.info('HTML get request', request.url);
        //
        // Assignment 2
        //
    } else if (isApiGetRequest(request)) {
        console.info('Api get request: ', request.url);
        event.respondWith(tryCacheThenNetwork(request, 'api-cache'));
    } else if (request.headers.get('accept').indexOf('image/*') > -1) {
        console.info('Image request: ', request.url);
        event.respondWith(tryCacheThenNetwork(request, 'image-cache'));
    } else if (request.method !== 'GET') {
        // Just pass on to the server
        event.respondWith(fetch(request))
    }
});

// HELPERS

/**
 * Tries to get a response for a request from cache storage. If it can't find one, get the response from the network.
 *
 * @param {Object} request      The request object
 * @param {String} cacheName    The unique cache key in cache storage
 * @returns {Promise}           Resolves with response object
 */
function tryCacheThenNetwork(request, cacheName) {
    if (!cacheName) {
        return fetch(request);
    }
    return caches.open(cacheName)
        .then(cache => cache.match(request))
        .then(response => response ? response : fetch(request))
}

/**
 * Checks if a request is a core GET request
 *
 * @param {Object} request      The request object
 * @returns {Boolean}           Boolean value indicating whether the request is in the core mapping
 */
function isCoreGetRequest(request) {
    return request.method === 'GET' && CORE_ASSETS.includes(getPathName(request.url));
}

/**
 * Checks if a request is a GET and HTML request
 *
 * @param {Object} request      The request object
 * @returns {Boolean}           Boolean value indicating whether the request is a GET and HTML request
 */
function isHtmlGetRequest(request) {
    return request.method === 'GET' && (request.headers.get('accept') !== null && request.headers.get('accept').indexOf('text/html') > -1);
}

/**
 * Checks if a request is a GET and HTML request
 *
 * @param {Object} request      The request object
 * @returns {Boolean}           Boolean value indicating whether the request is a GET and HTML request
 */
function isApiGetRequest(request) {
    return request.method === 'GET' && request.url.indexOf('?ajax=true') > -1 ;
}

/**
 * Get a pathname from a full URL by stripping off domain
 *
 * @param {Object} requestUrl       The request object, e.g. https://www.mydomain.com/index.css
 * @returns {String}                Relative url to the domain, e.g. index.css
 */
function getPathName(requestUrl) {
    const url = new URL(requestUrl);
    return url.pathname;
}

/**
 * This is boilerplate, instructing the service worker to take control as soon
 * as it can.
 */
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', () => self.clients.claim());
