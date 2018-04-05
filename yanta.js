'use strict';
const {promisify} = require('util');
const fs = require('fs');
const readFileAsync = promisify(fs.readFile);
let http;
let cache = {};

// default settings:
let srvSettings = {
	port: 45464,						// Server Port
	urlBase: '/yanta',					// url base for hosting
	useHttps: false,					// use https instead of http (requires cert and key)
	key: '/path/to/key.pem',			// https key
	cert: '/path/to/cert.pem',			// https certificate
	storageDir: '/path/to/storage'		// directory to store notes in
};
try { srvSettings = Object.assign(srvSettings, require('./srvSettings.json')); }
catch(err) { console.log('Error parsing settings file: ' + err + '. Using default settings.'); }
if (srvSettings.useHttps) {
	http = require('https'); 
	srvSettings.key = fs.readFileSync(srvSettings.key);
	srvSettings.cert = fs.readFileSync(srvSettings.cert);
} else http = require('http');

// simple server
const srv = http.createServer((req, res) => {
	async function sendStatic(file) {
		let contentType = 'text/html';
		if (file.endsWith('.js')) contentType = 'text/javascript';
		else if (file.endsWith('.css')) contentType = 'text/css';
		else if (file.endsWith('.json')) contentType = 'application/json';
		else if (file.endsWith('.png')) contentType = 'image/png';
		if (!cache[file]) {
			try { cache[file] = await readFileAsync(file, {encoding: 'utf8'}); }
			catch (err) {
				res.writeHead(500, 'Internal Server Error');
				res.end('Error: ' + err);
				console.log('Error in sendStatic(): ' + err);
				console.log('Request was: ' + JSON.stringify(req));
				console.log('Response was: ' + JSON.stringify(res));
				return err;
			}
		}
		res.statusCode = 200;
		res.writeHead(200, {'Content-Type': contentType });
		res.end(cache[file], 'utf-8');
	}
	let path = req.url.replace(srvSettings.urlBase, '');
	if (path === '' || path === '/') sendStatic('./index.html');
	else if (path.startsWith('/ace/')) sendStatic('./node_modules/ace-builds/src/' + path.replace('/ace/', ''));
	else if (path.startsWith('/icons/')) sendStatic('.' + path);
	else if (path.endsWith('.html') || path.endsWith('.css') || path.endsWith('.json') || (path.endsWith('.js') && !path.endsWith('yanta.js')) ) sendStatic('.' + path);
});
srv.listen(srvSettings.port);
