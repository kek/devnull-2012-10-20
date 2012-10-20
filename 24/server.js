var express = require('express');
var http = require('http');
var url = require('url');
var app = express();

var servers = [
	{
		host: "10.200.0.66",
		port: 4000
	},
	{
		host: "10.200.0.66",
		port: 4001
	},
	{
		host: "10.200.0.54",
		port: 4000
	}	
];

var superValue = null;

var port = process.env.PORT;

app.get('/servers', function(req, res){
	res.set("Content-Type", "text/json");
	res.send(JSON.stringify(servers));
});

app.get('/read', function(req, res){
	res.set("Content-Type", "text/json");
	res.send(JSON.stringify(superValue));
});

app.get('/set', function(req, res){
	var url_parts = url.parse(req.url, true);
	var query = url_parts.query;
	var value = query && query.value || null;

	console.log("Trying to set value " + value);

	// Only update when value is not the same
	if (value !== superValue) {
		superValue = value;

		var self;

		servers.forEach(function(server) {
			var options = 	{
				host: server.host,
				port: server.port, 
				path: "/set?value=" + value,
				method: "GET"
			};

			var rq = http.request(options, function(result) {
				console.log("Set value to " + server.host + ":" + server.port);
			});

			rq.on("error", function(error) {
				console.log("Failed to set value to " + server.host + ":" + server.port + " Error: ", error);
			});

			rq.end();

		});

		res.send("Value set to: '" + superValue + "'");
	} else {

		res.send("No update");

	}

});


app.listen(port);
console.log('Listening on port ', port);