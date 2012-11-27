/*jshint browser:true, strict:true es5:true*/

// yocto.js 0.0.1
// (c) 2012 Trygve Lie
// yocto.js may be freely distributed under the MIT license.

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



    // This object is passed into each function in the chain as a single function variable.
    // Each function in the chain can then manipulate the object before it returns it.
    // The manipulated returned object is then passed on as a variable to the next function
    // in the chain.
    // {
    //      objects     : [],
    //      object      : {},
    //      index       : Number,
    //      template    : {},
    //      match       : true,
    //      callback    : function(){}
    // }

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



    function match(parameters) {
        parameters.match = Object.keys(parameters.template).every(function(key) {
            if (is.fn(parameters.template[key])) {
                return parameters.template[key].call(this, parameters.object[key], is);

            } else {
                return parameters.object[key] === parameters.template[key];

            }
        });
        return parameters;
    }


    function remove(parameters) {
        if (parameters.match) {
            parameters.object = parameters.objects.splice(parameters.index, 1)[0];
        }
        return parameters;
    }


    function callback(parameters) {
        if (parameters.match) {
            parameters.callback.call(null, parameters.object);
        }
        return parameters;
    }


    function loop(parameters, chain, onLoopEnd) {

        var composedFunction    = compose(chain),
            runOnResult         = (parameters.result.length !== 0) || false,
            objs                = runOnResult ? parameters.result : parameters.objects,
            i                   = 0,
            l                   = objs.length;

        for (i = 0; i < l; i += 1) {
            parameters.index    = i;
            parameters.object   = objs[i];

            composedFunction(parameters);

            if (parameters.match) {
                // When taking objects out of the tuple we need to compensate for
                // the objects taken out to prevent out of bound error.
                // This compensation should only be done on the tuple object array.
                if (!runOnResult && l != objs.length) {
                    l = objs.length;
                    i--;
                }
                parameters.result.push(parameters.object);
            }
        }

        if (onLoopEnd) {
            onLoopEnd.call(null, parameters.result);
        }

        parameters.result = [];

        return parameters;
    }


    var db = {

        config          : {
            name : 'yocto'
        },

        chain           : [],
        observers       : [],

        parameters : {
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

            // Array of objects applied
            if (is.arr(obj)) {

                // Filter out non object entries.
                obj = obj.filter(function(element){
                    return (is.obj(element) && !is.arr(element));
                });

                // Merge appended array into internal objects array.
                this.parameters.objects = this.parameters.objects.concat(obj);
                this.parameters.result = this.parameters.result.concat(obj);
            }

            // Single object applied
            if (is.obj(obj) && !is.arr(obj)) {
                this.parameters.objects.push(obj);
                this.parameters.result.push(obj);
            }

            if (onSuccess && is.fn(onSuccess)) {
                onSuccess.call(this, this.parameters.result);
                this.parameters.result = [];
            }

            return this;
        },



        // Get object(s) from the database based on a template object

        get : function(template, onSuccess) {
            this.parameters.template = template || {};
            this.chain.push(match);

            if (onSuccess && is.fn(onSuccess)) {
                loop(this.parameters, this.chain, onSuccess);
            }

            return this;
        },



        // Takes matching objects out of the database

        take : function(template, onSuccess) {
            this.parameters.template = template || {};
            this.chain.push(match);
            this.chain.push(remove);

            if (onSuccess && is.fn(onSuccess)) {
                loop(this.parameters, this.chain, onSuccess);
            }

            return this;
        },



        // Loop over each item in a returned list of records

        each : function(onEach) {
            this.chain.push(callback);

            if (onEach && is.fn(onEach)) {
                this.parameters.callback = onEach;
                loop(this.parameters, this.chain);
            }

            this.chain = [];
            return this;
        },



        // Drop all database records in memory.

        drop : function(onSuccess) {
            this.parameters.objects.splice(0, this.parameters.objects.length);
            if (onSuccess && is.fn(onSuccess)) {
                onSuccess.call(null);
            }
            return this;
        },



        // Drop all database records memory and in localstorage.

        destroy : function(name) {
            // if "name" is provided, delete single storage
            // if "name" is NOT provided, loop trough all storages, find those containing "creator === yocto"
            // and delete all of them
        },



        // Sort a return from the database based on a objects property name

        sort : function(key, onSuccess) {
            var self    = this,
                sorted  = [];

            if (is.str(key)) {
                loop(this.parameters, this.chain, function(result){
                    
                    sorted = result.sort(function(object1, object2) {
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

                this.parameters.result = sorted;
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
                type    = 'localStorage';

            if (config && config[type] === 'session') {
                type = 'sessionStorage';
            }

            if (config && is.str(config.name) && has.localStorage()) {

                loop(this.parameters, this.chain, function(result){
                    window[type].setItem(config.name, JSON.stringify({
                        creator     : self.config.name,
                        timestamp   : +new Date(),
                        objects     : result
                    }));

                    if (onSuccess && is.fn(onSuccess)) {
                        onSuccess.call(self, result);
                    }
                });

            } else {
                throw new Error('Yocto tried to store data to ' + type + ' but no name was provided!');
            }

            this.chain = [];

            return this;
        },



        // Load a list of records from localstorage

        load : function(config, onLoaded) {

            var type        = 'localStorage',
                loadedData  = '',
                parsedData  = {};

            if (config && config[type] === 'session') {
                type = 'sessionStorage';
            }

            if (config && is.str(config.name) && has.localStorage()) {
                loadedData = window[type].getItem(config.name);
                parsedData = JSON.parse(loadedData);

                // Merge appended array into internal objects array.
                if (parsedData.creator === this.config.name) {
                    this.parameters.objects = this.parameters.objects.concat(parsedData.objects);
                    this.parameters.result = this.parameters.result.concat(parsedData.objects);
                }

            } else {
                throw new Error('Yocto tried to read data from ' + type + ' but no name was provided!');
            }

            if (onLoaded && is.fn(onLoaded)) {
                onLoaded.call(this, this.parameters.result);
                this.parameters.result = [];
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