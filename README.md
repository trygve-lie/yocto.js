# yocto.js

yocto.js is a tiny in-memory database with an [tuple space inspired API](http://code.google.com/p/gruple/wiki/TuplespaceUsage). In a way its a set of convinient methods to work on a list of objects.

yocto.js is intended to be used in the browser but has methods for persisting and recovering data to and from local storage. Though; yocto.js can also be used in [node.js](http://nodejs.org/) but then without the features of persisting to disk.

yocto.js does utilize some ES5 features. Runtimes which does not have these features, such as older browsers, are still supported by a provided set of ES5 shims. Please see "Non ES5 compability" for further details.



## Working with yocto.js

yocto.js operate on lists of objects. All objects put into the base is then traversed by matching with a template object that contains the keys and values one want to match on.

Lets say we want to have a database of [LP Records](http://en.wikipedia.org/wiki/LP_record). This can be represented as a list of objects like this:

```javascript
[
	{id: 0, album: 'High Visibility', artist: 'The Hellacopters', year: 2002, style: 'Punk rock'},
	{id: 1, album: 'Tender Is the Savage', artist: 'Gluecifer', year: 2000, style: 'Rock'},
	{id: 2, album: 'Deathcrush', artist: 'Mayhem', year: 1987, style: 'Black metal'},
	{id: 3, album: 'Supershitty to the Max!', artist: 'The Hellacopters', year: 1996, style: 'Punk rock'},
	{id: 4, album: 'Money for Soul', artist: 'Baby Woodrose', year: 2003, style 'Psychedelic rock'}
]
```

A template object used to look up objects in the database can then look like this:

```javascript
{
	artist: 'The Hellacopters',
	year: 1996
}
```

If this template is passed on to one of the methods for finding objects in yocto.js, it will match with one object in the above example database. The method executing the match will then fire a callback method where the following list is provided to the callback:

```javascript
[
	{id: 3, album: 'Supershitty to the Max!', artist: 'The Hellacopters', year: 1996, style: 'Punk rock'}
]
```



### Chaining

The interface of yocto.js aims to be [fluent](http://en.wikipedia.org/wiki/Fluent_interface) so almost all methods can be chained. When using chaining each method in the chain work on the returned result from the previous method in the chain. The chain is terminated by executing a callback where one want to do something on the final result.

In this example, again working on the above database, we get all objects in the database where the artist is "The Hellacopters" and then we sort the result on the property "year" before we loop over each item:

```javascript
db.get({artist: 'The Hellacopters'}).sort('year').each(function(obj){
	console.log(obj.artist + ' did release ' + obj.album + ' in ' + obj.year.toString());
})
```



## API

yocto.js has the following methods:



### .db() - Creating a database

You create a database by invoking the db method:

```javascript
var db = yocto.db();
```

All further methods does then operate on the assigned variable.



### .put() - Put data into the database

One can put a single object into the database by passing it as the first parameter to the put() method. The second parameter to the put() method is a callback where the value for the first argument to the callback is an array of the data put into the database.

```javascript
db.put({}, function(arr){ });
```

Instead of putting just a single object into the database one can also put a whole array of objects:

```javascript
db.put([{},{},{}], function(arr){ });
```

Multiple calls to the put method will append data to the database.



### .get() - Get data from the database

One can get data from the database by passing a template object as the first parameter to the get() method. The key/values given in the template object will be used to exactly match with keys/values objects in the database. The second parameter to the get method is a callback where the value for the first argument to the callback is an array of the data the get method found in the database.

```javascript
db.get({}, function(arr){ });
```



### .take() - Take data out of the database

Takes data from the database by passing a template object as the first parameter to the take() method. The key/values given in the template object will be used to exactly match with keys/values objects in the database. The second parameter to the take method is a callback where the value for the first argument to the callback is an array of the data the take method found in the database.

```javascript
db.take({}, function(arr){ });
```

The take() method takes data out of the database. All matchingobjects of the take method is removed from the database. take() can also be looked upon as deleting data in the database.



### .sort() - Sort any list of objects

Sorts any list by passing which object parameter to sort on to the first parameter to the sort() method. The second parameter to the take method is a callback where the value for the first argument to the callback is an array of the sorted list of objects.

```javascript
db.sort('', function(arr){ });
```



### .search() - Search for partial string occurances

Searches object key values in the database by passing a template object as the first parameter to the seach() method. The search will only perform on string values and is case insensitive. The second parameter to the search method is a callback where the value for the first argument to the callback is an array of the data the search method found in the database.

```javascript
db.search({}, function(arr){ });
```



### .each() - Loop over each object in a list

Loops over each object in any list. The first argument to the each() method is a callback where the value for the first argument is the object in the iteration.

```javascript
db.each(function(obj){ });
```



### .save() - Persist data in the client

Saves the whole database or an array of objects to localstorage if localstorage is available in the run time. The first argument to the save() method is an config object for interacting with the storage. The second parameter to the save() method is a callback where the value for the first argument to the callback is an array of the data the save() method stored.

```javascript
db.save({}, function(arr){ });
```

The config object has the following parameters:

 - name - A string with the name the data should be stored under.
 - type - 'local' or 'session'. If 'local' is provided the data will be stored on the 'localStorage' object. If 'session' is provided, the data will be stored on the 'sessionStorage' object.

The save() method will save data as an stringified object in localstorage. The object looks like this:

```javascript
{
	creator		: 'yocto',
	timestamp	: num,
	records		: []
}
```

'creator' is a reference to what wrote the object. 'timestamp' is number of milliseconds since the epoch and 'records' is the list of objects stored.

NB: Do note that saving to localstorage is blocking.



### .drop() - Delete all in memory data

Deletes all database records in memory. Persisted data are not deleted.

```javascript
db.drop();
```



### .destroy() - Delete all in memory and persisted data

Not implemented yet!!



### .observe() - Observe if objects enters or leaves the database

Not implemented yet!



## Examples:

To be made!



## Non ES5 compability and JSON support

yocto.js utalize some new ES5 methods when working with lists and objects. These are not nesseserly pressent in older browsers. The good news is that these ES5 methods can be added by shims to older browsers.

yocto.js use the following ES5 methods: 
 - Object.keys
 - Array.every
 - Array.indexOf
 - Array.filter

yocto.js provide a separate es5.js file containing just these methods as a shim for older browsers. This shim extends the native types in the run time. If you need to support older browsers and don't already have a shim for the above methods, please include the es5.js shim file in your project also.

To see if you need to include the ES5 shims in your build, please see [Kangax's ECMAScript 5 compatibility table](http://kangax.github.com/es5-compat-table/).

All methods in the es5.js shim file is taken from the [JavaScript documentation on the Mozilla Developer Network](https://developer.mozilla.org/en-US/docs/JavaScript). There is other ES5 shims out there which also can be used; [es5-shim.js](https://github.com/kriskowal/es5-shim) should also work.

yocto.js does also use native JSON.parse() and JSON.stringify() to persist data in the client. This is also absent in some older browsers but can also be shimmed in in the same way as the ES5 features.  If you need to support older browsers and don't already have a shim for JSON.parse() and JSON.stringify() in your project, I recommend that you include [JSON-js](https://github.com/douglascrockford/JSON-js) in your project.



## About and contribution

This small library did spinn out of the fact that I saw myself doing a lot of simmilar tasks on lists in different applications. I've found myself fetching a lot of generic lists of objects from a server and then wanting to select subsets in them without doing a round trip to the server. I've also found myself using localstorage to store these lists and object in the client to reduce round trips to a server. So; this small library came out of small needs I had and I found the API used in a tuple space to kinda fit the operations I do. 

There is probably plenty of room to improve both in the API, the code, performance, tests, doc etc, etc so if you have any ideas and feedback on how to make this small library better, please feel free to create an issue or submit a pull request!



## License

MIT License
Copyright (c) Trygve Lie