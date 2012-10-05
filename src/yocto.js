// yocto.js 0.0.1
// (c) 2012 Trygve Lie
// yocto.js may be freely distributed under the MIT license.


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




	exports.db = function(config) {
		
		if (!(this instanceof exports.db)) {
			return new exports.db(config);
		}

		this.objects	= [];
		this.config		= {
			name : 'yocto'
		};
		
		return this;
	};



	exports.db.prototype = {



		drop : function() {
			this.objects = [];
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
				this.objects = this.objects.concat(obj);

				success = !success;
			}

			// Single object applied

			if (isObject(obj) && !isArray(obj)) {								
				this.objects.push(obj);
				success = !success;
			}

			if (success && onSuccess && isFunction(onSuccess)) {
				onSuccess.call(this, obj);
			}

			return this;
		},



		get : function(template, onSuccess, time) {
			var objects = [];

			if (isObject(template) && !isArray(template)) {	
				objects = this.objects.filter(function(obj) {
					return Object.keys(template).every(function(key) {
						return obj[key] === template[key];
					});
				});
			}

			if (onSuccess && isFunction(onSuccess)) {
				onSuccess.call(this, objects);
			}
			
			return this;
		},



		take : function(template, time) {

			return this;
		},



		sort : function(key, onSuccess) {

			var objects = [];

			if (isString(key)) {
				objects = this.objects.sort(function(object1, object2) {
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
				onSuccess.call(this, objects);
			}
			
			return this;
		}

	};

})(typeof exports === 'undefined' ? this.yocto = {}: exports);