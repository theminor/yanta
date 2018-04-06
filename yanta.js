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
catch(err) { console.log('Error parsing settings file: ' + err + '. Using default settings.'); }
if (srvSettings.useHttps) {
	http = require('https'); 
	srvSettings.key = fs.readFileSync(srvSettings.key);
	srvSettings.cert = fs.readFileSync(srvSettings.cert);
} else http = require('http');

const srv = http.createServer((req, res) => { 						// create simple server
	async function sendStatic(file) {								// response function
		let contentType = 'text/html';
		if (file.endsWith('.js')) contentType = 'text/javascript';
		else if (file.endsWith('.css')) contentType = 'text/css';
		else if (file.endsWith('.json')) contentType = 'application/json';
		else if (file.endsWith('.png')) contentType = 'image/png';
		else if (file.endsWith('.txt')) contentType = 'text/plain';
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
	
	var auth = req.headers['authorization'];
	if (auth) {
		let [usr, pswd] = (new Buffer(auth.replace('Basic ', ''), 'base64')).toString('utf8').split(':');		// remove 'Basic ', then convert to base 64, then split "username:password"
		if (usr === srvSettings.userName && pswd === srvSettings.password) {
			let path = req.url.replace(srvSettings.urlBase, '');			// basic routing
			if (path === '' || path === '/') sendStatic('./index.html');
			else if (path.endsWith('theme-yanta.js')) sendStatic('./theme-yanta.js');
			else if (path.startsWith('/ace/')) sendStatic('./node_modules/ace-builds/src/' + path.replace('/ace/', ''));
			else if (path.startsWith('/icons/') || path.startsWith('/oauth/')) sendStatic('.' + path);
			else if (path.endsWith('.html') || path.endsWith('.css') || (path.endsWith('.json') && !path.endsWith('srvSettings.json')) || path.endsWith('.txt') || (path.endsWith('.js') && !path.endsWith('yanta.js')) ) sendStatic('.' + path);			
		} else {
			res.statusCode = 403;
			return res.end('Login Failed');
		}
	} else {														// authentication is needed
		res.statusCode = 401;
		res.setHeader('WWW-Authenticate', 'Basic realm="yanta"');
		return res.end('Login Required');
	}
});
srv.listen(srvSettings.port);
