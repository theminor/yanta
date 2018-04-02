self.addEventListener('install', e => {
	e.waitUntil(
		caches.open('yanta').then(cache => {
			return cache.addAll([
			  './',
			  './index.html',
			  './yanta.css',
			  './node_modules/ace-builds/src/ace.js',
			  './node_modules/ace-builds/src/mode-markdown.js',
			  './theme-yanta.js'
			]);
		})
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
