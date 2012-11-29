/*jshint browser:true, strict:true es5:true*/
// yocto.js 0.0.1 - (c) 2012 Trygve Lie - MIT license.


// # Internals
//
//
// ## - Object storage and object structure
//
// All objects is stored in _one_ array which is only allowed to contain objects. Upon insertion
// into the array all non object types is declined by a filter method.
//
// There is no restrictions on the structure of the objects stored in the array so the array can
// hold a wide range of different objects. This does not affect the matching process.
//
// The matching process is done by comparing object keys and values in a template object and each
// object in the array. This matching process does only a shallow match. Deeply nested object
// values will not be compared. Though, doing a deep object structure match can be done by the
// user by providing a dedicated function to a template key to do the match.
// Doing a deep object structure match would probably be overkill for most usecases of yocto so
// doing so is delibertly handed over to the user to implement here/him self.
//
//
// ## - Chaining and function composition
//
// The public API can be chained and the chain is terminated by a callback to a, preferly the
// last, method in the chain.
// Since all objects are stored in an array retreiving the requested arrays will involve looping
// over all objects to match those whit a template. The result of such a request will be a new
// list with the matching objects which the user possible would like to do something upon each
// object. This is a possible double loop.
//
// To reduce possible double loops, functions are upon chaining composed into one function which
// will run inside _one_ loop upon termination of a chain.
//
// When composing function one parameter is sendt as function parameter to a function and then
// returned again. The returned value will then be passed on as function paramter to the next
// function in the composition.
//
// In yocto we pass one object which looks like this through to all composed functions:
// {
//    objects     : [],
//    object      : undefined,
//    result      : [],
//    index       : 0,
//    template    : {},
//    match       : true,
//    callback    : undefined
// }
//
// Each function in the composition can then manipulate this object before its passed on to the
// next function.


(function(exports){

    "use strict";


    // Environment checks

    var has = {
        localStorage    : function() {return !!(window.hasOwnProperty && window.hasOwnProperty('localStorage'));}
    };


    // Convenient "is" checks
    // These checks is also passed on to any functions in a template

    var is = {
            arr     : function(value) {return value instanceof Array;},
            obj     : function(value) {return value instanceof Object;},
            fn      : function(value) {return typeof value === 'function';},
            str     : function(value) {return typeof value === 'string';},
            num     : function(value) {return typeof value === 'number';}
    };


    // Compose an array of composition functions into one function

    function compose(functions) {
        return function() {
            var i       = 0,
                l       = functions.length,
                result  = arguments;

            for (i = 0; i < l; i += 1) {
                result = [functions[i].apply(this,result)];
            }

            return result[0];
        };
    }


    // Composition function for matching an object with a template

    function match(coreObj) {
        coreObj.match = Object.keys(coreObj.template).every(function(key) {
            if (is.fn(coreObj.template[key])) {
                return coreObj.template[key].call(this, coreObj.object[key], is);

            } else {
                return coreObj.object[key] === coreObj.template[key];

            }
        });
        return coreObj;
    }


    // Composition function for removing an object from the storage array

    function remove(coreObj) {
        if (coreObj.match) {
            coreObj.object = coreObj.objects.splice(coreObj.index, 1)[0];
        }
        return coreObj;
    }


    // Composition function for executing a callback

    function callback(coreObj) {
        if (coreObj.match) {
            coreObj.callback.call(null, coreObj.object);
        }
        return coreObj;
    }


    // Single loop
    // Takes the array of composition functions and runs the composed function in one loop

    function loop(coreObj, chain, onLoopEnd) {

        var composedFunction    = compose(chain),
            runOnResult         = (coreObj.result.length !== 0) || false,
            objs                = runOnResult ? coreObj.result : coreObj.objects,
            i                   = 0,
            l                   = objs.length;

        for (i = 0; i < l; i += 1) {
            coreObj.index    = i;
            coreObj.object   = objs[i];

            composedFunction(coreObj);

            if (coreObj.match) {
                // When taking objects out of the tuple we need to compensate for
                // the objects taken out to prevent out of bound error.
                // This compensation should only be done on the tuple object array.
                if (!runOnResult && l != objs.length) {
                    l = objs.length;
                    i--;
                }
                coreObj.result.push(coreObj.object);
            }
        }

        if (onLoopEnd) {
            onLoopEnd.call(null, coreObj.result);
        }

        coreObj.result = [];

        return coreObj;
    }


    // Set storage type to use base on a config object

    function setStorageType(config) {
        if (config && config.type === 'session') {
            return 'sessionStorage';
        } else {
            return 'localStorage';
        }
    }



    var db = {

        config          : {
            name : 'yocto'
        },

        chain           : [],
        observers       : [],

        core : {
            objects     : [],
            object      : undefined,
            result      : [],
            index       : 0,
            template    : {},
            match       : true,
            callback    : undefined
        },


        // Put a single object or an array of objects into the database

        put : function(obj, onSuccess) {

            var core = this.core;

            // Array of objects applied
            if (is.arr(obj)) {

                // Filter out non object entries.
                obj = obj.filter(function(element){
                    return (is.obj(element) && !is.arr(element));
                });

                // Merge appended array into internal objects array.
                core.objects    = core.objects.concat(obj);
                core.result     = core.result.concat(obj);
            }

            // Single object applied
            if (is.obj(obj) && !is.arr(obj)) {
                core.objects.push(obj);
                core.result.push(obj);
            }

            if (onSuccess && is.fn(onSuccess)) {
                onSuccess.call(this, core.result);
                core.result = [];
            }

            return this;
        },


        // Get object(s) from the database based on a template object

        get : function(template, onSuccess) {
            this.core.template = template || {};
            this.chain.push(match);

            if (onSuccess && is.fn(onSuccess)) {
                loop(this.core, this.chain, onSuccess);
            }

            return this;
        },


        // Takes matching objects out of the database

        take : function(template, onSuccess) {
            this.core.template = template || {};
            this.chain.push(match);
            this.chain.push(remove);

            if (onSuccess && is.fn(onSuccess)) {
                loop(this.core, this.chain, onSuccess);
            }

            return this;
        },


        // Loop over each object in a returned list of objects

        each : function(onEach) {
            this.chain.push(callback);

            if (onEach && is.fn(onEach)) {
                this.core.callback = onEach;
                loop(this.core, this.chain);
            }

            this.chain = [];
            return this;
        },


        // Drop all database records in memory.

        drop : function(onSuccess) {
            this.core.objects.splice(0, this.core.objects.length);
            if (onSuccess && is.fn(onSuccess)) {
                onSuccess.call(null);
            }
            return this;
        },


        // Drop all database records in memory and in localstorage.
        // Takes the following object as configuration:
        // {
        //     type : 'local' || 'session'
        //     name : ''
        // }

        destroy : function(config, onSuccess) {
            var self    = this,
                type    = setStorageType(config);

            if (config && is.str(config.name) && has.localStorage()) {
                window[type].removeItem(config.name);
            }

            this.drop(onSuccess);

            return this;
        },


        // Sort a returned list of objects based on a objects property name

        sort : function(key, onSuccess) {
            var self    = this,
                sorted  = [];

            if (is.str(key)) {
                loop(this.core, this.chain, function(result){

                    sorted = result.sort(function sortByObjectKey(object1, object2) {
                        var key1 = '',
                            key2 = '';

                        if (is.obj(object1) && is.obj(object2) && object1 && object2) {
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

                    if (onSuccess && is.fn(onSuccess)) {
                        onSuccess.call(self, sorted);
                        sorted = [];
                    }
                });

                this.core.result = sorted;
            }

            return this;
        },


        // Save a list of records to localstorage
        // Takes the following object as configuration:
        // {
        //     type : 'local' || 'session'
        //     name : ''
        // }

        save : function(config, onSuccess) {

            var self    = this,
                type    = setStorageType(config);

            if (config && is.str(config.name) && has.localStorage()) {

                loop(this.core, this.chain, function(result){
                    window[type].setItem(config.name, JSON.stringify({
                        creator     : self.config.name,
                        timestamp   : +new Date(),
                        objects     : result
                    }));

                    if (onSuccess && is.fn(onSuccess)) {
                        onSuccess.call(self, result);
                    }
                });

            }

            this.chain = [];

            return this;
        },


        // Load a list of records from localstorage
        // Takes the following object as configuration:
        // {
        //     type : 'local' || 'session'
        //     name : ''
        // }

        load : function(config, onLoaded) {

            var type        = setStorageType(config),
                loadedData  = '',
                parsedData  = {};

            if (config && is.str(config.name) && has.localStorage()) {
                loadedData = window[type].getItem(config.name);
                parsedData = JSON.parse(loadedData);

                // Merge appended array into internal objects array.
                if (parsedData.creator === this.config.name) {
                    this.core.objects = this.core.objects.concat(parsedData.objects);
                    this.core.result = this.core.result.concat(parsedData.objects);
                }

            }

            if (onLoaded && is.fn(onLoaded)) {
                onLoaded.call(this, this.core.result);
                this.core.result = [];
            }

            return this;
        },


        observe : function() {

        },


        unobserve : function() {

        }

    };


    exports.db = function createYocto() {
        return Object.create(db);
    };


})(typeof exports === 'undefined' ? this.yocto = {}: exports);