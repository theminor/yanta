'use strict';
const {promisify} = require('util');
const fs = require('fs');
const readFileAsync = promisify(fs.readFile);
let http;

// default settings:
let srvSettings = {
	port: 45464,
	useHttps: true,
	key: '/path/to/key.pem',
	cert: '/path/to/cert.pem'
};
try { srvSettings = Object.assign(srvSettings, require('./srvSettings.json')); }
catch(err) { console.log('Error parsing settings file: ' + err + '. Using default settings.'); }
if (srvSettings.useHttps) {
	http = require('https'); 
	srvSettings.key = fs.readFileSync(srvSettings.key);
	srvSettings.cert = fs.readFileSync(srvSettings.cert);
} else http = require('http');

const srv = http.createServer((req, res) => {
	async function sendStatic(file) {
		let contentType = 'text/html';
		if (file.endsWith('.js')) contentType = 'text/javascript';
		else if (file.endsWith('.css')) contentType = 'text/css';
		else if (file.endsWith('.json')) contentType = 'application/json';
		else if (file.endsWith('.png')) contentType = 'image/png';		
		try {
			const data = await readFileAsync(file, {encoding: 'utf8'});
			res.statusCode = 200;
			res.writeHead(200, {'Content-Type': contentType });
			res.end(data, 'utf-8');
		}
		catch (err) {
			res.writeHead(500, 'Internal Server Error');
			res.end('Error: ' + err);
			console.log('Error in sendStatic(): ' + err);
			console.log('Request was: ' + JSON.stringify(req));
			console.log('Response was: ' + JSON.stringify(res));
		}
	}
	if (req.url === '' || req.url.endsWith('/')) sendStatic('./index.html');
	else if (req.url.includes('/ace/')) sendStatic('./node_modules/ace-builds/src/' + req.url.substring(req.url.lastIndexOf('/ace/') + 5));
	else if (req.url.includes('/icons/')) sendStatic('.' + req.url);
	else if (req.url.endsWith('.html') || req.url.endsWith('.js') || req.url.endsWith('.css') || req.url.endsWith('.json')) sendStatic('.' + req.url);
});

srv.listen(srvSettings.port);
