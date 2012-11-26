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



    function n_get(parameters) {
        parameters.match = Object.keys(parameters.template).every(function(key) {
            if (is.fn(parameters.template[key])) {
                return parameters.template[key].call(this, parameters.object[key], is);

            } else {
                return parameters.object[key] === parameters.template[key];

            }
        });
/*
        if (parameters.match) {
            parameters.object = parameters.objects[parameters.index];
        }
*/
        return parameters;
    }


    function n_take(parameters) {
        if (parameters.match) {
            parameters.object = parameters.objects.splice(parameters.index, 1)[0];
        }
        return parameters;
    }


    function n_callback(parameters) {
        if (parameters.match) {
            parameters.callback.call(null, parameters.object);
        }
        return parameters;
    }


    function n_each(parameters, chain, callback) {
        var fn      = compose(chain),
            objs    = (parameters.result.length === 0) ? parameters.objects : parameters.result,
            i       = 0,
            l       = objs.length;
//            result  = [],
//            item    = {};
// console.log('A', l, objs);
// console.log('F', parameters.result.length);        


        for (i = 0; i < l; i += 1) {

            parameters.index    = i;
            parameters.object   = objs[i];

            fn(parameters);
/*
            item = fn({
                objects     : objects,
                object      : undefined,
                index       : i,
                template    : template,
                match       : true,
                callback    : callback
            });
*/
/*
            if (item.match) {
                if (l != parameters.objects.length) {
                    l = parameters.objects.length;
                    i--;
                }
                result.push(item.object);
            }
*/

            if (parameters.match) {
                parameters.result.push(objs[i]);
            }

        }


        if (callback) {
            callback.call(this, parameters.result);
        }

        parameters.result = [];

        return parameters.result;
    }


    var db = {
        
        tuple : {
            objects : [],
            index   : {}
        },

        parameters : {
            objects     : [],
            object      : undefined,
            result      : [],
            index       : 0,
            template    : {},
            match       : true,
            callback    : undefined
        },


        // objects         : [],
        next            : [],
        observers       : [],
        config          : {
            name : 'yocto'
        },


        // NEW FUNCTIONS
        chain           : [],
        query           : {},
        appendedObjs    : [],



        // Put a single object or an array of objects into the database

        put : function(obj, onSuccess) {

            // Array of objects applied

            if (is.arr(obj)) {

                // Filter out non object entries.
                obj = obj.filter(function(element){
                    return (is.obj(element) && !is.arr(element));
                });

                // Merge appended array into internal objects array.
                this.tuple.objects = this.tuple.objects.concat(obj);
                this.parameters.result = this.parameters.result.concat(obj);
            }

            // Single object applied
            if (is.obj(obj) && !is.arr(obj)) {
                this.tuple.objects.push(obj);
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

            if (template){this.parameters.template = template;}

            this.parameters.objects = this.tuple.objects;

            this.chain.push(n_get);

            if (onSuccess && is.fn(onSuccess)) {
                
//                onSuccess.call(this, n_each(this.parameters, this.chain));
//                this.chain = [];
//                this.parameters.template = {};
                n_each(this.parameters, this.chain, onSuccess);
            }

            return this;
        },



        // Takes matching objects out of the database

        take : function(template, onSuccess) {

            if (template){this.query = template;}

            this.chain.push(n_get);
            this.chain.push(n_take);

            if (onSuccess && is.fn(onSuccess)) {
                onSuccess.call(this, n_each(this.tuple.objects, this.query, this.chain));
                this.chain = [];
                this.query = {};
            }

            return this;
        },



        // Loop over each item in a returned list of records

        each : function(onEach) {

            this.chain.push(n_callback);

            this.parameters.objects = this.tuple.objects;
            this.parameters.callback = onEach;

            if (onEach && is.fn(onEach)) {

                n_each(this.parameters, this.chain)
//                 n_each((this.appendedObjs.length === 0) ? this.tuple.objects : this.appendedObjs, this.query, this.chain, onEach);
//                this.appendedObjs = [];
                this.parameters.result = [];
            }

            this.chain = [];
            this.query = {};

            return this;
        },



        // Drop all database records in memory.

        drop : function(onSuccess) {
            this.tuple.objects.splice(0, this.tuple.objects.length);
            if (onSuccess && is.fn(onSuccess)) {
                onSuccess.call(this);
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

            var arr = (this.next.length === 0) ? 'objects' : 'next';

            if (is.str(key)) {
                this.next = this[arr].sort(function(object1, object2) {
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
            }

            if (onSuccess && is.fn(onSuccess)) {
                onSuccess.call(this, this.next);
                // arrayRemove(this.next, 0, this.next.length);
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

            var type    = 'localStorage',
                objects = n_each(this.tuple.objects, this.query, this.chain);

            if (config && config[type] === 'session') {
                type = 'sessionStorage';
            }

            if (config && is.str(config.name)) {

                if (has.localStorage()) {
                    window[type].setItem(config.name, JSON.stringify({
                        creator     : this.config.name,
                        timestamp   : +new Date(),
                        objects     : objects
                    }));
                }

            } else {
                throw new Error('Yocto tried to store data to ' + type + ' but no name was provided!');
            }

            if (onSuccess && is.fn(onSuccess)) {
                onSuccess.call(this, objects);
            }

            this.chain = [];
            this.query = {};

            return this;
        },



        // Load a list of records from localstorage

        load : function(config, onLoaded) {

            var type        = 'localStorage',
                loadedData  = '',
                parsedData  = [];

            if (config && config[type] === 'session') {
                type = 'sessionStorage';
            }

            if (config && is.str(config.name)) {

                if (has.localStorage()) {
                    loadedData = window[type].getItem(config.name);
                    parsedData = JSON.parse(loadedData);

                    // Merge appended array into internal objects array.
                    if (parsedData.creator === this.config.name) {
                        this.tuple.objects = this.tuple.objects.concat(parsedData.objects);
                        this.appendedObjs = this.appendedObjs.concat(parsedData.objects);
                    }
                }

            } else {
                throw new Error('Yocto tried to read data from ' + type + ' but no name was provided!');
            }

            if (onLoaded && is.fn(onLoaded)) {
                onLoaded.call(this, this.appendedObjs);
                this.appendedObjs = [];
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