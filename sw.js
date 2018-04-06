self.addEventListener('install', e => {
	e.waitUntil(
		caches.open('yanta').then(cache => {
			// return cache.addAll([
			cache.add('./').catch(console.log('./'));
			cache.add('./index.html').catch(console.log('./index.html'));
			cache.add('./index.js').catch(console.log('./index.js'));
			cache.add('./index.css').catch(console.log('./index.css'));
			cache.add('./ace/ace.js').catch(console.log('./ace/ace.js'));
			cache.add('./ace/mode-markdown.js').catch(console.log('./ace/mode-markdown.js'));
			cache.add('./theme-yanta.js').catch(console.log('./theme-yanta.js'));
			/*
				'./',
				'./index.html',
				'./index.js',
				'./index.css',
				'./ace/ace.js',
				'./ace/mode-markdown.js',
				'./theme-yanta.js'
			*/
			// ]);
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
