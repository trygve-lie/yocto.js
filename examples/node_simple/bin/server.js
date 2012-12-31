var http            = require('http'),
	fs 				= require('fs'),
    connect         = require('connect'),
    express 		= require('express'),
    app 			= express(),
    yocto			= require('../../../'),
    port            = process.argv[2] ? process.argv[2] : 8000,
    docRoot         = './public';


// Create database

var db = yocto.db({uuid:'code'});


// Load data from file and into database

fs.readFile('../mock_data/data.json', "binary", function(error, data) {
    var parsed = JSON.parse(data);
    db.put(parsed.codes, function(objs) {
    	console.log('Inserted ' + objs.length + ' objects into database');
    })
});


// Configure application

app.configure('all',function () {
    app.use(express.static(docRoot));
});


// REST API - Status

app.get('/api/status', function(req, res, next) {
	db.status(function(obj){
	    res.json({result:obj});
	});
});


// REST API - Get

app.get('/api/get', function(req, res, next) {
	db.get(req.query, function(objs){
	    res.json({result:objs});
	});
});


// Start server

var httpServer = http.createServer(app).listen(port);
console.info('Server running at http://localhost:' + port + '/');


// Prevent exceptions to bubble up to the top and eventually kill the server

process.on("uncaughtException", function (err) {
    console.warn(err.stack);
});