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
    }


// TESTS TO WRITE
// - put - injection of single objects
// - put - injection of array of objects
// - put - appending single object to existing db
// - put - appending array of objects to existing db
// - put - appending array of objects where one entry is not an object (ex a string)
// - put - appending array of objects where one entry is an array










/*
    "test document capture - should return the DOM HTML document element" : function () {
        buster.assert.tagName(this.application.docEl, 'HTML');
    },


    "test vendor prefix - should return a string with the browsers prefix" : function () {
        buster.assert.isString(this.application.vendorPrefix);
    },


    "test application cache - should append a cache key, set a value, update the value and remove it" : function () {

        this.application.appCache['foo'] = 'bar';
        buster.assert.equals(this.application.appCache.foo, 'bar');

        this.application.appCache.foo = 'xyz';
        buster.assert.equals(this.application.appCache.foo, 'xyz');

        delete this.application.appCache.foo;
        buster.refute.defined( this.application.appCache.foo );
    },


    "test support object - should return a object" : function () {
        buster.assert.isObject( this.application.support );
    },


    "test support history - should return a boolean value" : function  () {
        buster.assert.isBoolean(this.application.support.history);
    },


    "test support locale storage - should return a boolean value" : function  () {
        buster.assert.equals(typeof this.application.support.localStorage, 'boolean');
    },


    "test support geo location - should return a boolean value" : function  () {
        buster.assert.equals(typeof this.application.support.geoLocation, 'boolean');
    },


    "test support application cache - should return a boolean value" : function  () {
        buster.assert.equals(typeof this.application.support.appCache, 'boolean');
    },


    "test support overflow scrolling - should return a boolean value" : function  () {
        buster.assert.equals(typeof this.application.support.overflowScrolling, 'boolean');
    }
*/

});