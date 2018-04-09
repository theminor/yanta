const CacheName = 'yanta';
const TimeOutMs = 2000;

self.addEventListener('install', e => {
	e.waitUntil(
		caches.open(CacheName).then(cache => {
			let urls = [
				'./',
				'./index.html',
				'./index.css',
				'./ace/ace.js',
				'./ace/mode-markdown.js',
				'./theme-yanta.js',
				'./icons/yata-192.png'
			];
			return cache.addAll(urls.map(url => new Request(url, {credentials: 'same-origin'})));
		})
	);
});

self.addEventListener('activate', event => {
	event.waitUntil(self.clients.claim());
});

// Serve Cache if network fails after TimeOutMs
const fromNetwork = (request, timeout) => new Promise((resolve, reject) => {
	let timeoutId = setTimeout(reject, timeout);
	fetch(request).then(response => {
		clearTimeout(timeoutId);
		resolve(response);
	}, reject);
});
const fromCache = request => caches.open(CacheName).then(
	cache => cache.match(request).then(matching => matching || Promise.reject('no-match'));
);
self.addEventListener('fetch', event => {
	event.respondWith(fromNetwork(event.request, 3000).catch(() => fromCache(event.request); ));
});
