// yocto.js 0.0.1
// (c) 2012 Trygve Lie
// yocto.js may be freely distributed under the MIT license.


// TODOS:
// - Try to be as destructive as possible.

/*global window:true */

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



	function compose(fnArray) {
	    return function() {
	        var i 		= fnArray.length,
	        	result 	= arguments;
	        while(i--) {
	            result = [fnArray[i].apply(this,result)];
	        }
	        return result[0];
	    };
	};





	function objectRemove(obj, template, key, orgArray, index){
		if (obj[key] === template[key]) {
			arrayRemove(orgArray, index);
			return true;
		} else {
			return false;
		}
	}

	function objectEqual(obj, template, key) {
		return obj[key] === template[key];
	}


	function objectMap(obj, template) {
		return Object.keys(template).every(function(key) {
			return objectEqual(obj, template, key)
		});
	}

	// Array Remove -
	// Source: John Resig - MIT Licensed - http://ejohn.org/blog/javascript-array-remove/

	function arrayRemove(array, from, to) {
		var rest = array.slice((to || from) + 1 || array.length);
		array.length = from < 0 ? array.length + from : from;
		return array.push.apply(array, rest);
	}



	function arrayMap(arr, template) {
		return arr.filter(function(obj, index, orgArray) {
			return objectMap(obj, template);
		});
	}




// TODO: Add onLoad and onError functions to trigger when loading from localstorage
	exports.db = function(config) {

		if (!(this instanceof exports.db)) {
			return new exports.db(config);
		}

		this.objects	= [];
		this.next		= [];
		this.observers	= [];
		this.config		= {
			name : 'yocto'
		};

		return this;
	};



	exports.db.prototype = {



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



		// Put a single object or an array of objects into the database

		put : function(obj, onSuccess) {
			var success = false;

			// Array of objects applied

			if (isArray(obj)) {

				// Filter out non object entries.
				obj = obj.filter(function(element){
					return (isObject(element) && !isArray(element));
				});

				// Merge appended array into internal objects array.
				this.objects	= this.objects.concat(obj);
				this.next		= this.next.concat(obj);
				success = !success;
			}

			// Single object applied

			if (isObject(obj) && !isArray(obj)) {
				this.objects.push(obj);
				this.next.push(obj);
				success = !success;
			}

			if (success && onSuccess && isFunction(onSuccess)) {
				onSuccess.call(this, this.next);
				arrayRemove(this.next, 0, this.next.length);
			}

			return this;
		},



		// Get object(s) from the database based on a template object

		get : function(template, onSuccess) {

			var arr = (this.next.length === 0) ? 'objects' : 'next';

			if (isObject(template) && !isArray(template)) {
				this.next = arrayMap(this[arr], template);
			}


			if (onSuccess && isFunction(onSuccess)) {
				onSuccess.call(this, this.next);
				arrayRemove(this.next, 0, this.next.length);
			}

			return this;
		},



		// Takes matching objects out of the database

		take : function(template, onSuccess) {

			if (isObject(template) && !isArray(template)) {
				this.next = arrayMap(this[arr], template);

/*
				this.next = this.objects.filter(function(obj, index, orgArray) {
					return Object.keys(template).every(function(key) {
						if (obj[key] === template[key]) {
							arrayRemove(orgArray, index);
							return true;
						} else {
							return false;
						}
					});
				});
*/
			}

			if (onSuccess && isFunction(onSuccess)) {
				onSuccess.call(this, this.next);
				arrayRemove(this.next, 0, this.next.length);
			}

			return this;
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



		// Loop over each item in a returned list of records

		each : function(onEach) {
			var arr	= (this.next.length === 0) ? 'objects' : 'next',
				i	= 0,
				l	= this[arr].length;

			if (onEach && isFunction(onEach)) {
				for (i = 0; i < l; i += 1) {
					onEach.call(this, this[arr][i]);
				}
			}

			return this;
		},



		// Saves a list of records to localstorage

		save : function(config, onSuccess) {

// TODO: Do not save if this.next is null!

			var type = 'localStorage';
			if (config && config['type'] === 'session') {
				type = 'sessionStorage';
			}

			if (config && isString(config.name)) {
				window[type].setItem(config.name, JSON.stringify({
					creator		: 'yocto',
					timestamp	: +new Date(),
					records		: this.next
				}));
			}

			if (onSuccess && isFunction(onSuccess)) {

			}

			return this;
		}

	};


})(typeof exports === 'undefined' ? this.yocto = {}: exports);