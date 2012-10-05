// Test cases for yocto.js

var testCase = buster.testCase("yocto.js Test", {

    setUp: function() {
        this.db = yocto.db();
    },

    tearDown: function() {
        delete this.db;
    },


    "test library initialization - should return a object": function() {
        buster.assert.isObject(this.db);
    },


    "test put of single object - should return an object array with the length 1": function() {
        this.db.put({foo : 'bar'});
        buster.assert.equals(this.db.objects.length, 1);
    },
 
    "test put of non object - should not be inserted - should an object array with the length 0": function() {
        this.db.put('fail');
        buster.assert.equals(this.db.objects.length, 0);
    },

    "foo": function() {
        this.db.put([{foo : 'bar'}], function(records){
            buster.assert.equals(records.length, 1);
        })
    }


// TESTS TO WRITE
// - put - injection of single objects
// - put - injection of array of objects
// - put - appending single object to existing db
// - put - appending array of objects to existing db
// - put - appending array of objects where one entry is not an object (ex a string)
// - put - appending array of objects where one entry is an array



});