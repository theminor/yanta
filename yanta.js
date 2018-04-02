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
try { srvSettings = require('./srvSettings.json'); } catch(err) { console.log('Error parsing settings file: ' + err + '. Using default settings.'); }
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
		res.write('404: File Not Found!');
	}
	return res.end();
}

//white-listed static files allowed
const staticFiles = [
	'./yanta.css',
	'node_modules/ace-builds/src/ace.js',
	'node_modules/ace-builds/src/mode-markdown.js'
];

const srv = http.createServer((req, res) => {
	if (req.url.path === '' || req.url.path.endsWith('/')) sendStatic('./index.html');
	else {
		for (let i = 0; i < staticFiles.length; i++) {
			if (req.url.path === staticFiles[i]) sendStatic('./index.html');
		}
	}
});

srv.listen(srvSettings.port);
