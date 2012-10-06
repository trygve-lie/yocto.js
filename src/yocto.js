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


	// Object equality - Check if objects _looks_ alike. Ex: {foo: 'bar'} === {foo: 'bar'}
	// Source: Underscore - DocumentCloud Licensed - http://underscorejs.org/

	function isEqual(objA, objB) {

		function eq(a, b, aStack, bStack) {
			// Identical objects are equal. `0 === -0`, but they aren't identical.
			// See the Harmony `egal` proposal: http://wiki.ecmascript.org/doku.php?id=harmony:egal.
			if (a === b) {
				return a !== 0 || 1 / a == 1 / b;
			}
		
			// A strict comparison is necessary because `null == undefined`.
			if (a == null || b == null) {
				return a === b;
			}

			// Compare `[[Class]]` names.
			var className = Object.prototype.toString.call(a);
			if (className != Object.prototype.toString.call(b)) {
				return false;	
			}

			switch (className) {
				// Strings, numbers, dates, and booleans are compared by value.
				case '[object String]':
					// Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
					// equivalent to `new String("5")`.
					return a == String(b);
				case '[object Number]':
					// `NaN`s are equivalent, but non-reflexive. An `egal` comparison is performed for
					// other numeric values.
					return a != +a ? b != +b : (a == 0 ? 1 / a == 1 / b : a == +b);
				case '[object Date]':
				case '[object Boolean]':
					// Coerce dates and booleans to numeric primitive values. Dates are compared by their
					// millisecond representations. Note that invalid dates with millisecond representations
					// of `NaN` are not equivalent.
					return +a == +b;
				// RegExps are compared by their source patterns and flags.
				case '[object RegExp]':
					return a.source == b.source &&
						a.global == b.global &&
						a.multiline == b.multiline &&
						a.ignoreCase == b.ignoreCase;
			}
			
			if (typeof a != 'object' || typeof b != 'object') {
				return false;	
			}

			// Assume equality for cyclic structures. The algorithm for detecting cyclic
			// structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
			var length = aStack.length;
			while (length--) {
				// Linear search. Performance is inversely proportional to the number of
				// unique nested structures.
				if (aStack[length] == a) {
					return bStack[length] == b;
				} 
			}
			
			// Add the first object to the stack of traversed objects.
			aStack.push(a);
			bStack.push(b);
		
			var size = 0, 
				result = true;
			// Recursively compare objects and arrays.
			if (className == '[object Array]') {
				// Compare array lengths to determine if a deep comparison is necessary.
				size = a.length;
				result = size == b.length;
				if (result) {
					// Deep compare the contents, ignoring non-numeric properties.
					while (size--) {
						if (!(result = eq(a[size], b[size], aStack, bStack))) break;
					}
				}
			} else {
				// Objects with different constructors are not equivalent, but `Object`s
				// from different frames are.
				var aCtor = a.constructor, bCtor = b.constructor;
				if (aCtor !== bCtor && !(isFunction(aCtor) && (aCtor instanceof aCtor) &&
										isFunction(bCtor) && (bCtor instanceof bCtor))) {
					return false;
				}
				// Deep compare objects.
				for (var key in a) {
					if (hasOwnProperty.call(a, key)) {
						// Count the expected number of properties.
						size++;
						// Deep compare each member.
						if (!(result = hasOwnProperty.call(b, key) && eq(a[key], b[key], aStack, bStack))) {
							break;
						}
					}
				}
				
				// Ensure that both objects contain the same number of properties.
				if (result) {
					for (key in b) {
						if (hasOwnProperty.call(b, key) && !(size--)) {
							break;
						} 
					}
					result = !size;
				}
			}
			// Remove the first object from the stack of traversed objects.
			aStack.pop();
			bStack.pop();
			return result;
		}		

		// Init recursion
		return function init(a, b) {
			return eq(a, b, [], []);
		}(objA, objB);
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



		// Drop all records in the database

		drop : function() {			
			arrayRemove(this.objects, 0, this.objects.length);
			arrayRemove(this.next, 0, this.next.length);
			return this;
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

		get : function(template, onSuccess, time) {

			var arr = (this.next.length === 0) ? 'objects' : 'next';

			if (isObject(template) && !isArray(template)) {	
				this.next = this[arr].filter(function(obj) {
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



		// Sort a return from the database based on a objects property name

		sort : function(key, onSuccess) {

			var arr = (this.next.length === 0) ? 'objects' : 'next';

			if (isString(key)) {
				this.next = this[arr].sort(function(object1, object2) {
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

		save : function(name, onSuccess) {

// TODO: Do not save if this.next is null!

			if(name && isString(name)) {
				window.localStorage.setItem(name, JSON.stringify({
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