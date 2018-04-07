'use strict';
const {promisify} = require('util');
const fs = require('fs');
const readFileAsync = promisify(fs.readFile);
let http;
let cache = {};

// default settings:
let srvSettings = {
	port: 45464,													// Server Port
	urlBase: '/yanta',												// url base for hosting
	useHttps: false,												// use https instead of http (requires cert and key)
	key: '/path/to/key.pem',										// https key
	cert: '/path/to/cert.pem',										// https certificate
	storageDir: '/path/to/storage',									// directory to store notes in
	userName: 'user',												// username for basic authentication
	password: 'secret'												// password for basic authentication
};
try { srvSettings = Object.assign(srvSettings, require('./srvSettings.json')); }	// load alternate settings from srvSettings.json, if it exists
catch(err) { console.warn('Error parsing settings file: ' + err + '. Using default settings.'); }
if (srvSettings.useHttps) {
	http = require('https'); 
	srvSettings.key = fs.readFileSync(srvSettings.key);
	srvSettings.cert = fs.readFileSync(srvSettings.cert);
} else http = require('http');

const srv = http.createServer((req, res) => { 						// create simple server
	async function sendStatic(file) {								// response function
		let contentType = 'text/plain';
		if (file.endsWith('.js')) contentType = 'text/javascript';
		else if (file.endsWith('.css')) contentType = 'text/css';
		else if (file.endsWith('.json')) contentType = 'application/json';
		else if (file.endsWith('.png')) contentType = 'image/png';
		else if (file.endsWith('.html')) contentType = 'text/html';
		if (!cache[file]) {
			try { cache[file] = await readFileAsync(file, {encoding: 'utf8'}); }
			catch (err) {
				cache[file] = null;
				console.warn('Error in sendStatic(): ' + err);
				res.statusCode = 200;
				res.writeHead(404, 'Not Found');
				return res.end('404 Not Found: ' + err);
			}
		}
		res.statusCode = 200;
		res.writeHead(200, {'Content-Type': contentType });
		res.end(cache[file], 'utf-8');
	}
	
	var auth = req.headers['authorization'];
	if (auth) {
		let [usr, pswd] = (new Buffer(auth.replace('Basic ', ''), 'base64')).toString('utf8').split(':');		// remove 'Basic ', then convert to base 64, then split "username:password"
		if (usr === srvSettings.userName && pswd === srvSettings.password) {
			let path = req.url.replace(srvSettings.urlBase, '');			// basic routing
			if (req.method === 'PUT' && path.startsWith('/docs/')) {
				path = '.' + path;
				cache[path] = null;
				let dta = '';
				req.on('error', err => console.error(err));
				req.on('data', chunk => dta += chunk);
				return req.on('end', () => fs.writeFile(path, dta, (err) => { if (err) console.error('error writing file to ' + path + ': ' + err); }));
			}
			if (path === '' || path === '/') return sendStatic('./index.html');
			if (path.endsWith('theme-yanta.js')) return sendStatic('./theme-yanta.js');
			if (path.startsWith('/ace/')) return sendStatic('./node_modules/ace-builds/src/' + path.replace('/ace/', ''));
			if (path.startsWith('/icons/') || path.startsWith('/docs/')) return sendStatic('.' + path);
			if (path.endsWith('.html') || path.endsWith('.css') || (path.endsWith('.json') && !path.endsWith('srvSettings.json')) || path.endsWith('.txt') || (path.endsWith('.js') && !path.endsWith('yanta.js')) ) return sendStatic('.' + path);			
		} else {
			console.warn('Failed Login at ' + new Date().toLocaleString() + ' from ip ' + (req.header('x-forwarded-for') || req.connection.remoteAddress));
			res.statusCode = 403;
			res.writeHead(403, 'Login Failed');
			return res.end('403 Login Failed');
		}
	} else {														// authentication is needed
		res.statusCode = 401;
		res.setHeader('WWW-Authenticate', 'Basic realm="yanta"');
		return res.end('Login Required');
	}
});
srv.listen(srvSettings.port);
