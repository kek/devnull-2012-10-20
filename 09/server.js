var express = require('express');
var url = require('url');
var app = express();
var users = [];


app.get('/', function(req, res){
  res.send('Hello World');
});


app.get('/users', function(req, res){
	console.log(users);
	res.send(users.map(function(user) { return user.uid; }).join("<br>"));
});

app.get('/reg', function(req, res){
  
   	var url_parts = url.parse(req.url, true);
	var query = url_parts.query;

	if (users.filter(function(user) { return user.uid === query.user; }).length > 0) {

		console.log("User already registered");
		res.send("User already registered");
		return;
	}

	var user = {
		uid: query.user,
		pwd: query.password
	};
	
	users.push(user);

	console.log("User added");
	res.send("User added");

});


app.get('/login', function(req, res){
  
   	var url_parts = url.parse(req.url, true);
	var query = url_parts.query;

	var match = users.filter(function(user) { return user.uid === query.user && user.pwd === query.password; }) || [];
	var user = match.pop();
	
	if (user) {
		var token = Math.floor(Math.random() * 10000000);
		user.token = token;
		console.log(user);
		console.log(users);

		console.log("User logged in with token " + token);
		res.send("User added " + token);

	} else {

		console.log("invalid login");
		res.send("invalid login");

	}
});

app.get('/changepassword', function(req, res){
  
   	var url_parts = url.parse(req.url, true);
	var query = url_parts.query;

	var match = users.filter(function(user) { return user.token == query.token && user.uid === query.user  }) || [];

	var user = match.pop();
	
	if (user) {
		user.pwd = query.password;

		console.log("User changed password ");
		res.send("User changed password ");

	} else {

		console.log("invalid token");
		res.send("invalid token");

	}
});
	



app.listen(3000);


console.log('Listening on port 3000');