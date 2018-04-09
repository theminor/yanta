self.addEventListener('install', e => {
	e.waitUntil(
		caches.open('yanta').then(cache => {
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

// try to fetch on remote first, then use cache if that times out
self.addEventListener('fetch', event => {
	event.respondWith(async () => {
		try {
			let response = await fetch(event.request);
			if (response && response.ok) {
				cache.put(event.request, response);
				return response;
			} else {
				console.warn('failed to fetch ' + event.request.url); 
				return await caches.match(event.request);
			}
		}
		catch(e) {
			console.warn('Error in fetch ' + event.request.url);
			return await caches.match(event.request);
		}
	}());
});

