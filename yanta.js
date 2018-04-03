'use strict';
const {promisify} = require('util');
const fs = require('fs');
const path = require('path');
const readFileAsync = promisify(fs.readFile);
let http;

// default settings:
let srvSettings = {
	port: 45464,
	useHttps: true,
	key: fs.readFileSync('/path/to/key.pem'),
	cert: fs.readFileSync('/path/to/cert.pem')
};
try { srvSettings = Object.assign(srvSettings, require('./srvSettings.json')); }
catch(err) { console.log('Error parsing settings file: ' + err + '. Using default settings.'); }
if (srvSettings.useHttps) http = require('https'); else http = require('http');

async function sendStatic(file, res) {
    try {
        const data = await readFileAsync(file, {encoding: 'utf8'});
		res.statusCode = 200;
		res.writeHead(200);
		res.write(data);
    }
    catch (err) {
		res.writeHead(404, 'Not Found');
		res.write('404: File Not Found');
	}
	return res.end();
}

const srv = http.createServer((req, res) => {
	let path = req.url.path;
	if (path === '' || path.endsWith('/')) sendStatic('./index.html');
	else if (path.includes('/ace/')) sendStatic('./node_modules/ace-builds/src/' + path.substring(path.lastIndexOf('/ace/') + 5));
	else if (path.includes('/icons/')) sendStatic('.' + path);
	else if (path.endsWith('.html') || path.endsWith('.js') || path.endsWith('.css') || path.endsWith('.json')) sendStatic('.' + path);
});

srv.listen(srvSettings.port);
