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
//    onEach      : undefined
// }
//
// Each function in the composition can then manipulate this object before its passed on to the
// next function.


(function(exports){

    "use strict";


    function Yocto(options) {

        var config      = {
                name : 'yocto'
            },

            chain       = [],
            
            core        = {
                objects     : [],
                uuids       : {},
                
                template    : {},
                
                object      : undefined,
                index       : 0,
                match       : false,
                onEach      : undefined,
                
                result      : [],
                onEnd       : undefined
            };



        // Environment checks

        var has = {
            storage : function() {
              var tmp = '__ytest';
              try {
                  localStorage.setItem(tmp, tmp);
                  localStorage.removeItem(tmp);
                  return true;
              } catch(e) {
                  return false;
              }
            }
        };


        // Convenient "is" checks
        // These checks is also passed on to any functions in a template

        var is = {
                arr     : function(value) {return value instanceof Array;},
                obj     : function(value) {return value instanceof Object;},
                fn      : function(value) {return typeof value === 'function';},
                str     : function(value) {return typeof value === 'string';},
                num     : function(value) {return typeof value === 'number';},
                empty   : function(obj) {
                    if (obj === null) {return true;}
                    if (is.arr(obj) || is.str(obj)) {return obj.length === 0;}
                    if (is.obj(obj)) {return Object.keys(obj).length === 0;}
                    return true;
                }
        };


        function reset(coreObj) {
            coreObj.template    = {};
            
            coreObj.object      = undefined;
            coreObj.index       = 0;
            coreObj.match       = false;
            coreObj.onEach      = undefined;
            
            coreObj.result      = [];
            coreObj.onEnd       = undefined;
        }



        // Compose an array of composition functions into one function

        function compose() {

            var funcs = arguments;

            return function() {
                var i       = 0,
                    l       = funcs.length,
                    args    = arguments;

                for (i = 0; i < l; i += 1) {
                    args = [funcs[i].apply(this, args)];
                }

                return args[0];
            };

        }


        // Composition function for matching an object with a template based on key matching

        function keysMatch(coreObj) {
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

        function arrayRemove(coreObj) {
            if (coreObj.match) {
                coreObj.object = coreObj.objects.splice(coreObj.index, 1)[0];
                coreObj.index--;
            }
            return coreObj;
        }


        // Removing an object from the uuid hash

        function hashRemove(coreObj) {
            var key = coreObj.template[config.uuid];
            delete coreObj.uuids[key];
            return coreObj;
        }


        // Composition function for executing onEach callback

        function doOnEach(coreObj) {
            if (coreObj.match) {
                coreObj.onEach.call(null, coreObj.object);
            }
            return coreObj;
        }


        // Look up objects in the object array
        // Takes the array of composition functions and runs the composed function in one loop

        function arrayLookup(coreObj, chainArr) {

            var composedFunction    = compose.apply(null, chainArr),
                runOnResult         = (coreObj.result.length !== 0) || false,
                objs                = runOnResult ? coreObj.result : coreObj.objects,
                result              = [],
                l                   = objs.length;

            for (coreObj.index = 0; coreObj.index < l; coreObj.index += 1) {
                coreObj.object   = objs[coreObj.index];

                composedFunction(coreObj);

                if (coreObj.match) {

                    // When taking objects out of the tuple we need to compensate for
                    // the objects taken out to prevent out of bound error.
                    // This compensation should only be done on the tuple object array.
                    if (!runOnResult && l != objs.length) {
                        l = objs.length;
                    }

                    result.push(coreObj.object);
                }
            }

            coreObj.result = result;

            if (coreObj.onEnd) {
                coreObj.onEnd.call(null, coreObj.result);
            }

            return coreObj;
        }


        // Look up an object in the uuid hash

        function hashLookup(coreObj, chainArr) {

            var composedFunction    = compose.apply(null, chainArr),
                uuid                = coreObj.template[config.uuid];

            coreObj.object = coreObj.uuids[uuid];
            composedFunction(coreObj);
            
            if (coreObj.match) {
                coreObj.result.push(coreObj.object);
            }

            if (coreObj.onEnd) {
                coreObj.onEnd.call(null, coreObj.result);
            }

            return coreObj;
        }


        // Lookup for switching between looking up in the array or hash

        function lookup(coreObj, chainArr) {
            if (config.uuid && coreObj.template[config.uuid]) {
                return hashLookup(coreObj, chainArr);
            } else {
                return arrayLookup(coreObj, chainArr);
            }
        }


        // Set storage type to use base on a config object

        function setStorageType(config) {
            if (config && config.type === 'session') {
                return 'sessionStorage';
            } else {
                return 'localStorage';
            }
        }


        // Set config - Do not allow override of "name"

        if (is.obj(options) && is.obj(config)) {
            Object.keys(options).every(function(key){
                if (key !== 'name') {
                    config[key] = options[key];
                }
            });
        }



        // Public methods

        return {

            // Put a single object or an array of objects into the database

            put : function(obj, onSuccess) {

                var id  = '',
                    i   = 0,
                    l   = 0;

                core.match = true;

                // Array of objects applied
                if (is.arr(obj)) {

                    // Filter out non object entries.
                    obj = obj.filter(function(element){
                        return (is.obj(element) && !is.arr(element));
                    });

                    // Merge appended array into internal objects array.
                    core.objects    = core.objects.concat(obj);
                    core.result     = core.result.concat(obj);

// Set uuid in map
                    if (config.uuid) {
                        l = obj.length;
                        for (i = 0; i < l; i += 1) {
                            id = obj[i][config.uuid];
                            core.uuids[obj[i][config.uuid]] = obj[i];
                        }
                    }
                }

                // Single object applied
                if (is.obj(obj) && !is.arr(obj)) {
                    core.objects.push(obj);
                    core.result.push(obj);

// Set uuid in map
                    if (config.uuid) {
                        id = obj[config.uuid];
                        core.uuids[obj[config.uuid]] = obj;
                    }

                }

                if (onSuccess && is.fn(onSuccess)) {
                    onSuccess.call(this, core.result);
                    core.result = [];
                }

                return this;
            },


            // Get object(s) from the database based on a template object

            get : function(template, onSuccess) {
                core.template   = template || {};
                chain.push(keysMatch);

                core.onEnd = onSuccess;

                if (onSuccess && is.fn(onSuccess)) {
                    lookup(core, chain);
                    reset(core);
                    chain = [];
                }

                return this;
            },


            // Takes matching objects out of the database

            take : function(template, onSuccess) {
                core.template = template || {};
                chain.push(keysMatch);
                chain.push(arrayRemove);
                chain.push(hashRemove);

                core.onEnd = onSuccess;

                if (onSuccess && is.fn(onSuccess)) {
                    arrayLookup(core, chain);
                    reset(core);
                    chain = [];
                }

                return this;
            },


            // Loop over each object in a returned list of objects

            each : function(onEach) {
                chain.push(doOnEach);

                core.onEach = onEach;

                if (onEach && is.fn(onEach)) {
                    lookup(core, chain);
                    reset(core);
                    chain = [];
                }

                return this;
            },


            // Drop all database records in memory.

            drop : function(onSuccess) {
                core.objects.splice(0, core.objects.length);
                core.uuids = {};

                if (onSuccess && is.fn(onSuccess)) {
                    onSuccess.call(null);
                    reset(core);
                    chain = [];
                }
                return this;
            },


            // Drop all database records in memory and in localStorage.
            // Takes the following object as configuration:
            // {
            //     type : 'local' || 'session'
            //     name : ''
            // }

            destroy : function(config, onSuccess) {
                var type    = setStorageType(config);

                if (config && is.str(config.name) && has.storage()) {
                    window[type].removeItem(config.name);
                }

                this.drop(onSuccess);

                return this;
            },


            // Sort a returned list of objects based on a objects property name
// TODO: use a method parameter instead of access "core.result" directly?????
// TODO: move inner function into standalone function
            sort : function(key, onSuccess) {

                core.onEnd = function(){

                    core.result = core.result.sort(function sortByObjectKey(object1, object2) {
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
                        onSuccess.call(null, core.result);
                    }
                };

                if (onSuccess && is.fn(onSuccess)) {
                    lookup(core, chain);
                    reset(core);
                    chain = [];
                }

                return this;
            },


            // Save a list of records to localstorage
            // Takes the following object as configuration:
            // {
            //     type : 'local' || 'session'
            //     name : ''
            // }
// TODO: use a method parameter instead of access "core.result" directly?????
// TODO: move inner function into standalone function
            save : function(config, onSuccess) {

                var type = setStorageType(config);

                if (config && is.str(config.name) && has.storage()) {

                    core.onEnd = function(){
                        window[type].setItem(config.name, JSON.stringify({
                            creator     : config.name,
                            timestamp   : +new Date(),
                            objects     : core.result
                        }));

                        if (onSuccess && is.fn(onSuccess)) {
                            onSuccess.call(null, core.result);
                        }
                    };

                    if (onSuccess && is.fn(onSuccess)) {
                        lookup(core, chain);
                        reset(core);
                        chain = [];
                    }

                }

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

                if (config && is.str(config.name) && has.storage()) {
                    loadedData = window[type].getItem(config.name);
                    parsedData = JSON.parse(loadedData);
                }

                this.put(is.empty(parsedData) ? [] : parsedData.objects, onLoaded);

                return this;
            }

        };

    }


    exports.db = function createYocto(options) {
        return new Yocto(options);
    };


})(typeof exports === 'undefined' ? this.yocto = {}: exports);