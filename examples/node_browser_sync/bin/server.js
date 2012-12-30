var http            = require('http'),
	fs 				= require('fs'),
    express 		= require('express'),
    app 			= express(),
    yocto			= require('../../../'),
    port            = process.argv[2] ? process.argv[2] : 8000,
    docRoot         = './public';

// Timestamp A: 1356882813331

var db = yocto.db({uuid:'code'});

fs.readFile('../mock_data/data.json', "binary", function(error, data) {
    var parsed = JSON.parse(data);
    db.put(parsed.codes, function(objs) {
    	console.log('Inserted ' + objs.length + ' objects into database');
    })
});


// Configure application

app.configure('all',function () {
    app.use(express.static(docRoot));
    app.use('/js/yocto', express.static('../../src/'));
});


// REST API - Status

app.get('/api/status', function(req, res, next) {
	db.status(function(obj){
	    res.json({result:obj});
	});
});


// REST API - Get
// Examples:
// - http://localhost:8000/api/get?sc=OR&cn=Douglas&name=Roseburg
// - http://localhost:8000/api/get?code=97837

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