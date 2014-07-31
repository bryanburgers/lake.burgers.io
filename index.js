"use strict";

var http = require('http');
var request = require('request');
var mustache = require('mustache');
var fs = require('fs');

var view = fs.readFileSync('view.html', { encoding: 'utf8' });

var server =  http.createServer(function (req, res) {
	request('http://www.lakestatus.com/', function(err, result) {
		if (err) {
			res.writeHead(200, { 'Content-Type': 'text/plain' });
			res.end(err.toString() + '\n' + err.stack);
			return;
		}

		var temp = getTemperature(result.body);
		res.writeHead(200, { 'Content-Type': 'text/html' });
		res.end(mustache.render(view, { temp: temp }));
	});
});

var port = parseInt(process.env.PORT, 10) || 5000;
server.listen(port);

function getTemperature(content) {
	// Quick and dirty. I don't even care.
	var matches = content.match(/id="AJlaketemp"[^>]*>(\d+)/);
	if (matches && matches.length == 2) {
		return matches[1];
	}
}
