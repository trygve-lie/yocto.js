var fs      = require("fs");

var package =  JSON.parse(fs.readFileSync('./package.json'));
console.log('===========================');
console.log('Name:', package.name);
console.log('Version:', package.version);
console.log('===========================');



namespace("lint", function(){

    desc('run jshint on all js files');
    task('all', [], function() {
        var input = new jake.FileList();
        input.include('./src/yocto.js');

        var cmd = ['jshint ' + input.toArray().join(' ') + "||:"];
            jake.exec(cmd, function(){
                console.log('verify is done');
            }, {printStdout: true});
    });

});



namespace("min", function(){

    desc('run uglifyjs on only yocto.js');
    task('yocto', [], function() {
        var output  = 'build/yocto.min.' + package.version + '.js';
        var input   = new jake.FileList();
        input.include('src/yocto.js');

        var cmd = ['uglifyjs ' + input.toArray().join(' ') + ' -o ' + output + ' --source-map ' + output + '.map -c dead-code=true,unsafe=true -m'];
            jake.exec(cmd, function(){
                console.log('min:yocto is done');
            }, {printStdout: true});
    });


    desc('run uglifyjs on yocto.js and es5.js');
    task('yocto-es5', [], function() {
        var output  = 'build/yocto.es5.min.' + package.version + '.js';
        var input   = new jake.FileList();
        input.include('src/es5.js');
        input.include('src/yocto.js');

        var cmd = ['uglifyjs ' + input.toArray().join(' ') + ' -o ' + output + ' --source-map ' + output + '.map -c dead-code=true,unsafe=true -m'];
            jake.exec(cmd, function(){
                console.log('min:yocto-es5 is done');
            }, {printStdout: true});
    });

});



desc("Run all minify tasks");
task('minify', [], function() {
    jake.Task["min:yocto"].invoke();
    jake.Task["min:yocto-es5"].invoke();
});