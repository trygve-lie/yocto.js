var http            = require('http'),
	urlparser       = require('url'),
	fs 				= require('fs'),
    connect         = require('connect'),
    port            = process.argv[2] ? process.argv[2] : 8000,
    docRoot         = './public';


function scripts(request, response, next) {

    var parsedUrl = request.urlparsed = urlparser.parse(request.url, true);

    if (parsedUrl.pathname === '/js/yocto.js') {
        fs.readFile('../../src/yocto.js', "binary", function(error, data) {
		    response.writeHead(200, {'Content-Type': 'text/javascript', 'Content-Length': data.length});
		    response.write(data, "binary");
		    response.end();
		    return;
        });

    } else if (parsedUrl.pathname === '/js/es5.js') {
        fs.readFile('../../src/es5.js', "binary", function(error, data) {
		    response.writeHead(200, {'Content-Type': 'text/javascript', 'Content-Length': data.length});
		    response.write(data, "binary");
		    response.end();
		    return;
        });

    } else if (parsedUrl.pathname === '/mock/data.json') {
        fs.readFile('../mock_data/data.json', "binary", function(error, data) {
		    response.writeHead(200, {'Content-Type': 'application/json', 'Content-Length': data.length});
		    response.write(data, "binary");
		    response.end();
		    return;
        });

    } else {
	    next();
	    return;
    }
}

var httpServer = connect().use(
		scripts
	).use(
        connect.static(docRoot)
    ).listen(port);

console.log('Server running at http://localhost:' + (port) + '/');