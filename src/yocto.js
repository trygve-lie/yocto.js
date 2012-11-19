/*jshint browser:true, strict:true es5:true*/

// yocto.js 0.0.1
// (c) 2012 Trygve Lie
// yocto.js may be freely distributed under the MIT license.


// TODOS:
// - Try to be as destructive as possible.

(function(exports){

    "use strict";


    // Check if a value is an Object

    function isObject(value) {
        return value instanceof Object;
    }


    // Check if a value is an Function

    function isFunction(value) {
        return typeof value === 'function';
    }


    // Check if a value is a Array

    function isArray(value) {
        return value instanceof Array;
    }


    // Check if a value is a String

    function isString(value) {
        return typeof value === 'string';
    }


    // Check if runtime environment has localstorage

    function hasLocalStorage() {
        return !!(window.hasOwnProperty && window.hasOwnProperty('localStorage'));
    }




    // Array Remove -
    // Source: John Resig - MIT Licensed - http://ejohn.org/blog/javascript-array-remove/

    function arrayRemove(array, from, to) {
        var rest = array.slice((to || from) + 1 || array.length);
        array.length = from < 0 ? array.length + from : from;
        return array.push.apply(array, rest);
    }





    // NEW FUNCTIONS
    // This object is passed into each function in the chain as a single function variable.
    // Each function in the chain can then manipulate the object before it returns it.
    // The manipulated returned object is then passed on as a variable to the next function
    // in the chain.
    // {
    //      objects     : [],
    //      index       : Number,
    //      obj         : obj,
    //      template    : {},
    //      match       : ture,
    //      callback    : function(){}
    // }

    function compose(fnArray) {
        return function() {
            var i       = 0,
                l       = fnArray.length,
                result  = arguments;

            for (i = 0; i < l; i += 1) {
                result = [fnArray[i].apply(this,result)];
            }

            return result[0];
        };
    }


    function filter(arr, match){
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].text === match) {
                return true;
            }
        }
        return false;
    }


    function n_get(parameters) {
        parameters.match = Object.keys(parameters.template).every(function(key) {
            if (isFunction(parameters.template[key])) {
//TODO: Return null or this here???
                return parameters.template[key].call(null, parameters.objects[parameters.index][key]);
            } else {
                return parameters.objects[parameters.index][key] === parameters.template[key];
            }
        });
        return parameters;
    }

// NBNBNBNBNB: CAN'T DELETE WHILE LOOPING!!!!!!!!!!!!
    function n_take(parameters) {

        if (parameters.match) {
            arrayRemove(parameters.objects, parameters.index);
        }

        return parameters;
    }


    function n_callback(parameters) {
        if (parameters.match) {
            parameters.callback.call(null, parameters.objects[parameters.index]);
        }
        return parameters;
    }


    function n_each(objects, template, chain, callback) {
        var fn      = compose(chain),
            i       = 0,
            l       = objects.length,
            result  = [],
            item    = {};

        for (i = 0; i < l; i += 1) {            

            item = fn({
                objects     : objects,
                index       : i,
                template    : template,
                match       : true,
                callback    : callback
            });

            if (item.match) {
                result.push(objects[i]);
            }
        }

        return result;
    }





// TODO: Add onLoad and onError functions to trigger when loading from localstorage
    exports.db = function(config) {

        if (!(this instanceof exports.db)) {
            return new exports.db(config);
        }

        this.objects    = [];
        this.next       = [];
        this.observers  = [];
        this.config     = {
            name : 'yocto'
        };


        // NEW FUNCTIONS
        this.chain          = [];
        this.query          = {};
        this.appendedObjs   = [];



        return this;
    };


    exports.db.prototype = {



        // NEW FUNCTIONS

        // Put a single object or an array of objects into the database

        n_put : function(obj, onSuccess) {

            // Array of objects applied

            if (isArray(obj)) {

                // Filter out non object entries.
                obj = obj.filter(function(element){
                    return (isObject(element) && !isArray(element));
                });

                // Merge appended array into internal objects array.
                this.objects = this.objects.concat(obj);
                this.appendedObjs = this.appendedObjs.concat(obj);
            }

            // Single object applied
            if (isObject(obj) && !isArray(obj)) {
                this.objects.push(obj);
                this.appendedObjs.push(obj);
            }


            if (onSuccess && isFunction(onSuccess)) {
                onSuccess.call(this, this.appendedObjs);
                this.appendedObjs = [];
            }

            return this;
        },


        // Get object(s) from the database based on a template object

        n_get : function(template, onSuccess) {

            if (template){this.query = template;}

            this.chain.push(n_get);

            if (onSuccess && isFunction(onSuccess)) {

                var result = n_each(this.objects, this.query, this.chain);
                onSuccess.call(this, result);

                this.chain = [];
                this.query = {};
            }

            return this;
        },


        // Takes matching objects out of the database

        n_take : function(template, onSuccess) {

            if (template){this.query = template;}

            this.chain.push(n_get);
            this.chain.push(n_take);

            if (onSuccess && isFunction(onSuccess)) {

                var result = n_each(this.objects, this.query, this.chain);
                onSuccess.call(this, result);

                this.chain = [];
                this.query = {};
            }

            return this;
        },


        // Loop over each item in a returned list of records

        n_each : function(onEach) {

            this.chain.push(n_callback);

            if (onEach && isFunction(onEach)) {
                n_each((this.appendedObjs.length === 0) ? this.objects : this.appendedObjs, this.query, this.chain, onEach);
                this.appendedObjs = [];
            }

            this.chain = [];
            this.query = {};

            return this;
        },














        // Drop all database records memory.
        // Data stored in localstorage is NOT removed!

        drop : function() {
            arrayRemove(this.objects, 0, this.objects.length);
            arrayRemove(this.next, 0, this.next.length);
            return this;
        },



        // Drop all database records memory and in localstorage.

        destroy : function() {

        },







        // Sort a return from the database based on a objects property name

        sort : function(key, onSuccess) {

            var arr = (this.next.length === 0) ? 'objects' : 'next';

            if (isString(key)) {
                this.next = this[arr].sort(function(object1, object2) {
                    var key1 = '',
                        key2 = '';

                    if (isObject(object1) && isObject(object2) && object1 && object2) {
                        key1 = object1[key];
                        key2 = object2[key];
                        if (key1 === key2) {
                            return object1;
                        }
                        if (typeof key1 === typeof key2) {
                            return key1 < key2 ? -1 : 1;
                        }
                    }

                });
            }

            if (onSuccess && isFunction(onSuccess)) {
                onSuccess.call(this, this.next);
                arrayRemove(this.next, 0, this.next.length);
            }

            return this;
        },




        // Saves a list of records to localstorage

        save : function(config, onSuccess) {

// TODO: Do not save if this.next is null!

            var type = 'localStorage';
            if (config && config[type] === 'session') {
                type = 'sessionStorage';
            }

            if (config && isString(config.name)) {
                window[type].setItem(config.name, JSON.stringify({
                    creator     : 'yocto',
                    timestamp   : +new Date(),
                    records     : this.next
                }));
            }

            if (onSuccess && isFunction(onSuccess)) {

            }

            return this;
        },


        is : {
            arr : isArray,
            fn  : isFunction,
            obj : isObject,
            str : isString
        }

    };


})(typeof exports === 'undefined' ? this.yocto = {}: exports);