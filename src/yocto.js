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
            array       : function(value) {return value instanceof Array;},
            object      : function(value) {return value instanceof Object;},
            function    : function(value) {return typeof value === 'function';},
            string      : function(value) {return typeof value === 'string';},
            number      : function(value) {return typeof value === 'number';}
    };



    // This object is passed into each function in the chain as a single function variable.
    // Each function in the chain can then manipulate the object before it returns it.
    // The manipulated returned object is then passed on as a variable to the next function
    // in the chain.
    // {
    //      objects     : [],
    //      object      : {},
    //      index       : Number,
    //      obj         : obj,
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
            if (is.function(parameters.template[key])) {
                return parameters.template[key].call(this, parameters.objects[parameters.index][key], is);

            } else {
                return parameters.objects[parameters.index][key] === parameters.template[key];

            }
        });

        if (parameters.match) {
            parameters.object = parameters.objects[parameters.index];
        }

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
            parameters.callback.call(null, parameters.object || parameters.objects[parameters.index]);
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
                object      : undefined,
                index       : i,
                template    : template,
                match       : true,
                callback    : callback
            });

            if (item.match) {
                if (l != objects.length) {
                    l = objects.length;
                    i--;
                }
                result.push(item.object);
            }
        }

        return result;
    }


    var db = {
        objects         : [],
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

            if (is.array(obj)) {

                // Filter out non object entries.
                obj = obj.filter(function(element){
                    return (is.object(element) && !is.array(element));
                });

                // Merge appended array into internal objects array.
                this.objects = this.objects.concat(obj);
                this.appendedObjs = this.appendedObjs.concat(obj);
            }

            // Single object applied
            if (is.object(obj) && !is.array(obj)) {
                this.objects.push(obj);
                this.appendedObjs.push(obj);
            }


            if (onSuccess && is.function(onSuccess)) {
                onSuccess.call(this, this.appendedObjs);
                this.appendedObjs = [];
            }

            return this;
        },



        // Get object(s) from the database based on a template object

        get : function(template, onSuccess) {

            if (template){this.query = template;}

            this.chain.push(n_get);

            if (onSuccess && is.function(onSuccess)) {
                onSuccess.call(this, n_each(this.objects, this.query, this.chain));
                this.chain = [];
                this.query = {};
            }

            return this;
        },



        // Takes matching objects out of the database

        take : function(template, onSuccess) {

            if (template){this.query = template;}

            this.chain.push(n_get);
            this.chain.push(n_take);

            if (onSuccess && is.function(onSuccess)) {
                onSuccess.call(this, n_each(this.objects, this.query, this.chain));
                this.chain = [];
                this.query = {};
            }

            return this;
        },



        // Loop over each item in a returned list of records

        each : function(onEach) {

            this.chain.push(n_callback);

            if (onEach && is.function(onEach)) {
                n_each((this.appendedObjs.length === 0) ? this.objects : this.appendedObjs, this.query, this.chain, onEach);
                this.appendedObjs = [];
            }

            this.chain = [];
            this.query = {};

            return this;
        },



        // Drop all database records in memory.

        drop : function(onSuccess) {
            this.objects.splice(0, this.objects.length);
            if (onSuccess && is.function(onSuccess)) {
                onSuccess.call(this);
            }
            return this;
        },



        // Drop all database records memory and in localstorage.

        destroy : function() {

        },



        // Sort a return from the database based on a objects property name

        sort : function(key, onSuccess) {

            var arr = (this.next.length === 0) ? 'objects' : 'next';

            if (is.string(key)) {
                this.next = this[arr].sort(function(object1, object2) {
                    var key1 = '',
                        key2 = '';

                    if (is.object(object1) && is.object(object2) && object1 && object2) {
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

            if (onSuccess && is.function(onSuccess)) {
                onSuccess.call(this, this.next);
                // arrayRemove(this.next, 0, this.next.length);
            }

            return this;
        },



        // Saves a list of records to localstorage
        // Takes the following object as configuration:
        // {
        //     type : 'local' || 'session'
        //     name : ''
        // }

        save : function(config, onSuccess) {

            var type    = 'localStorage',
                objects = n_each(this.objects, this.query, this.chain);

            if (config && config[type] === 'session') {
                type = 'sessionStorage';
            }

            if (config && is.string(config.name)) {
                window[type].setItem(config.name, JSON.stringify({
                    creator     : this.config.name,
                    timestamp   : +new Date(),
                    objects     : objects
                }));

            } else {
                throw new Error('Yocto tried to store data to ' + type + ' but no name was provided!');
            }

            if (onSuccess && is.function(onSuccess)) {
                onSuccess.call(this, objects);
            }

            this.chain = [];
            this.query = {};

            return this;
        }

    };



    exports.db = function createYocto() {
        return Object.create(db);
    };


})(typeof exports === 'undefined' ? this.yocto = {}: exports);