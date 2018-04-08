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
		let response;
		try { response = await fetch(event.request); }
		catch(e) { console.warn('failed to fetch ' + event.request.url); }
		finally {
			if (response && response.ok) return cache.put(event.request, response);
			else return caches.match(event.request);
		}
	});
});


/*
self.addEventListener('fetch', event => {
	event.respondWith(
		caches.match(event.request, {ignoreSearch:true}).then(response => {
			return response || fetch(event.request);
		})
	);
});
*/

/*
// network, then cache, if timeout
self.addEventListener('fetch', event => {
	event.respondWith(
		return fetch(event.request).then((response) => {
			if (response.ok) { return cache.put(event.request, response); }
			else { return caches.match(event.request); }
		}).catch(() => { 
			return caches.match(event.request);
		})
	);
});
*/

/*
// network, then cache, if timeout
self.addEventListener('fetch', event => {
	event.respondWith(
		caches.match(event.request, {ignoreSearch:true}).then((response) => {

			fetch(event.request).then((response) => {
				if (response.ok) { return cache.put(event.request, response); }
				else { return caches.match(event.request); }
			}).catch(() => { 
				return caches.match(event.request);
			})
			
			
		})
		
		
		

	);
});
*/
