var http = require('http');
var stdin = process.stdin;
var url = require('url');

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


var serverIndex = 0;

stdin.resume(); // see http://nodejs.org/docs/v0.4.7/api/process.html#process.stdin
stdin.on('data',function(chunk){ // called on each line of input
  var line=chunk.toString().replace(/\n/,'').split(" ");

  var cmd = line[0];
  var param = line.length > 1 ? line[1] : null;

  if (param) {

  	if (cmd === "server") {
  		serverIndex = parseInt(param);
  		console.log("Set server:");
  		console.log(servers[serverIndex]);
  	}

  	if (cmd === "set") {


  		var fn = function() {
	  		var server = servers[serverIndex];
			var options = 	{
				host: server.host,
				port: server.port, 
				path: "/set?value=" + param,
				method: "GET"
			};

	  		console.log("Setting value");

			var rq = http.request(options, function(result) {

				result.on("data", function(data) {
					console.log("Set value to " + server.host + ":" + server.port + " data: ", data.toString());
				});

			});

			rq.on("error", function(error) {
				console.log("Failed to reach server " + server.host + ":" + server.port + " Error: ", error);
				serverIndex = (serverIndex + 1) % servers.length;
				fn();
			});

			rq.end(); 
		}

		fn();
  	}


  } else {

  	if (cmd === "servers") {
  		console.log("Servers: ");
  		console.log(servers);
  		console.log("selected server");
  		console.log(servers[serverIndex]);
  	}
 	if (cmd === "read") {

 		var fn = function() {
	  		var server = servers[serverIndex];
			var options = 	{
				host: server.host,
				port: server.port, 
				path: "/read",
				method: "GET"
			};

	  		console.log("Reading value");

			var rq = http.request(options, function(result) {
				result.on("data", function(data) {
					console.log("Read value from " + server.host + ":" + server.port + " data: ", data.toString());
				});

			});

			rq.on("error", function(error) {
				console.log("Failed to reach server " + server.host + ":" + server.port + " Error: ", error);
				serverIndex = (serverIndex + 1) % servers.length;
				fn();
			});

			rq.end();  		
		}

		fn();
  	}

  }

//  console.log('stdin:received line:', line.split(" "));
}).on('end',function(){ // called when stdin closes (via ^D)
  console.log('stdin:closed');
});



