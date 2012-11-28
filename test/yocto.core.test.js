var testCase = buster.testCase("yocto.js Test - Core", {

    "library initialization - should return a object": function() {
        var db = yocto.db(); 
        buster.assert.isObject(db);
    }

});