// yocto.js 0.0.1
// (c) 2012 Trygve Lie
// yocto.js may be freely distributed under the MIT license.


// TODOS
// - Try to be as destructive as possible. Don't copy!


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

	// Array Remove - By John Resig (MIT Licensed)
	// http://ejohn.org/blog/javascript-array-remove/
	function arrayRemove(array, from, to) {
		var rest = array.slice((to || from) + 1 || array.length);
		array.length = from < 0 ? array.length + from : from;
		return array.push.apply(array, rest);
	}



	exports.db = function(config) {
		
		if (!(this instanceof exports.db)) {
			return new exports.db(config);
		}

		this.objects	= [];
		this.next		= [];
		this.config		= {
			name : 'yocto'
		};
		
		return this;
	};



	exports.db.prototype = {



		drop : function() {			
			arrayRemove(this.objects, 0, this.objects.length);
			arrayRemove(this.next, 0, this.next.length);
			return this;
		},



		put : function(obj, onSuccess) {
			var success = false;
			
			// Array of objects applied

			if (isArray(obj)) {

				// Filter out non object entries. 
				obj = obj.filter(function(element){
					return (isObject(element) && !isArray(element));
				});

				// Merge appended array into internal objects array.
				this.objects	= this.objects.concat.apply(obj);
				this.next		= this.next.concat.apply(obj);
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



		get : function(template, onSuccess, time) {

			if (isObject(template) && !isArray(template)) {	
				this.next = this[(this.next.length === 0) ? 'objects' : 'next'].filter(function(obj) {
					return Object.keys(template).every(function(key) {
						return obj[key] === template[key];
					});
				});
			}


			if (onSuccess && isFunction(onSuccess)) {
				onSuccess.call(this, this.next);
				arrayRemove(this.next, 0, this.next.length);
			}
			
			return this;
		},



		take : function(template, time) {

			return this;
		},



		sort : function(key, onSuccess) {

			if (isString(key)) {
				this.next = this[(this.next.length === 0) ? 'objects' : 'next'].sort(function(object1, object2) {
					var key1 = '',
						key2 = '';

					if (typeof object1 === 'object' && 
						typeof object2 === 'object' && 
						object1 && object2) {
							
							key1 = object1[key];
							key2 = object2[key];
							if (key1 === key2) {
								return object1;
							}
							if (typeof key1 === typeof key2) {
								return key1 < key2 ? -1 : 1;
							}

					} else {
						throw {
							name: 'Error',
							message: 'Expected Object when sorting by ' + key
						};
					}
				});
			}
		
			if (onSuccess && isFunction(onSuccess)) {
				onSuccess.call(this, this.next);
				arrayRemove(this.next, 0, this.next.length);
			}
			
			return this;
		}

	};

})(typeof exports === 'undefined' ? this.yocto = {}: exports);