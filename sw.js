const CacheName = 'yanta';

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

// Serve Cache if network fails after 3 second timeout
const fromNetwork = (request, timeout) => new Promise((resolve, reject) => {
		let timeoutId = setTimeout(reject, timeout);
		fetch(request).then(response => {
			clearTimeout(timeoutId);
			resolve(response);
		}, reject);
});
const fromCache = request => caches.open(CacheName).then(cache =>
		cache.match(request).then( matching => matching || Promise.reject('no-match'));
);
self.addEventListener('fetch', event => {
	event.respondWith(fromNetwork(event.request, 3000).catch(() => {
		return fromCache(event.request);
	}));
});



/*
function netThenCache(request) {
	return new Promise(async (resolve, reject) => {
		let response;
		let timeoutId = setTimeout(() => {
			console.warn('Timeout fetching '  + request.url + ' from network. Attempting cache.');
			try { resolve(await caches.match(request)); }
			catch(e) { reject('Error fetching ' + request.url + ' from network or from cache: ' + e); }
			return;
		}, 3000);
		try {
			response = await fetch(request);
			clearTimeout(timeoutId);
			if (response && response.ok) {
				cache.put(request, response);
			} else {
				console.warn('failed to fetch ' + request.url); 
				response = null;
			}
		} catch(e) {
			console.warn('Error fetching ' + request.url + ': ' + e);
			response = null;
		} finally {
			if (response) resolve(response);
			else {
				try { resolve(await caches.match(request)); }
				catch(e) { reject('Error fetching ' + request.url + ' from network or from cache: ' + e); }
			}
		}
	});
}
*/


/*
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
*/
