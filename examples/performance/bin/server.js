var http            = require('http'),
    connect         = require('connect'),
    port            = process.argv[2] ? process.argv[2] : 8000,
    docRoot         = './public';

var httpServer = connect().use(
        connect.static(docRoot)
    ).listen(port);

console.log('Server running at http://localhost:' + (port) + '/');