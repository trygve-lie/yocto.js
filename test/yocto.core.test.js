var buster  = this.buster   || require("buster"),
    yocto   = this.yocto    || require("../src/yocto.js");

var testCase = buster.testCase("yocto.js Test - Core", {

    "library initialization - should return a object": function() {
        var db = yocto.db(); 
        buster.assert.isObject(db);
    },

    "set options - should return a object": function() {
        var db = yocto.db({uuid:'id'}); 
        buster.assert.isObject(db);
    }    

    // TODO: Add test for not beeing able to override name in config.
    // TODO: Test that object without matching uuid is not fucking up (type: not causing error due to key as ex obj.id missing)
    // TODO: Test for duplicte uuids. If config is _NOT_ provided duplicate uuids should be returned. If config is provided only a single uuid object should be returned

});