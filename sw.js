self.addEventListener('install', e => {
	e.waitUntil(
		caches.open('yanta').then(cache => {
			let urls = [
				'./',
				'./index.html',
				'./index.js',
				'./index.css',
				'./ace/ace.js',
				'./ace/mode-markdown.js',
				'./theme-yanta.js'
			];
			return cache.addAll(urls.map(url => new Request(url, {credentials: 'same-origin'})));
		});
	);
});

self.addEventListener('activate', event => {
	event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
	event.respondWith(
		caches.match(event.request, {ignoreSearch:true}).then(response => {
			return response || fetch(event.request);
		})
	);
});
