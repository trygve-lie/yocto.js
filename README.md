# yocto.js
======

yocto.js is a tiny in-memory database with an tuple space inspired API. In a way its a set of convinient methods to work on a list of objects.

yocto.js is intended to be used in the browser but has methods for persisting and recovering data to and from local storage. Though; yocto.js can also be used in node.js but then without the features of persisting to disk.

yocto.js does utilize some ES5 features. Runtimes which does not have these features, such as older browsers, are still supported by a provided set of ES5 shims. Please see "Non ES5 compability" for further details.



# Working with yocto.js
======

yocto.js operate on lists of objects. All objects put into the base is then traversed by matching with a template object that contains the keys and values one want to match on.

Internally the database looks like this:

	[
		{id: 0, album: 'High Visibility', artist: 'The Hellacopters', year: 2002, style: 'Punk rock'},
		{id: 1, album: 'Tender Is the Savage', artist: 'Gluecifer', year: 2000, style: 'Rock'},
		{id: 2, album: 'Deathcrush', artist: 'Mayhem', year: 1987, style: 'Black metal'},
		{id: 3, album: 'Supershitty to the Max!', artist: 'The Hellacopters', year: 1996, style: 'Punk rock'},
		{id: 4, album: 'Money for Soul', artist: 'Baby Woodrose', year: 2003, style 'Psychedelic rock'}
	]

A template used to look up objects in the database can look like this:

	{
		artist: 'The Hellacopters',
		year: 1996
	}

If this template is passed on to one of the methods for finding objects in yocto.js, it will match with one object in the above example database. The method executing the match will then fire a callback method where the following list is provided to the callback:

	[
		{id: 3, album: 'Supershitty to the Max!', artist: 'The Hellacopters', year: 1996, style: 'Punk rock'}
	]



## Chaining

Almost all methods in yocto.js is chained. When using chaining each method in the chain work on the returned result from the previous method in the chain. The chain is terminated by executing a callback where one want to do something on the final result.

In this example, again working on the above database, we get all objects in the database where the artist is "The Hellacopters" and then we sort the result on the property "year" before we loop over each item:

	db.get({artist: 'The Hellacopters'}).sort('year').each(function(obj){
		console.log(obj.artist + ' did release ' + obj.album + ' in ' + obj.year.toString());
	})



# API
======

yocto.js has the following methods:


## .db() - Creating a database

You create a database by invoking the db method:

	var db = yocto.db();

All further methods does then operate on the assigned variable.



## .put() - Put data into the database

One can put a single object into the database by passing it as the first parameter to the put() method. The second parameter to the put method is a onSuccess callback where the value for the first argument to the callback is an array of the data put into the database.

	db.put({}, function(arr){

	});

Instead of putting just a single object into the database one can also put a whole array of objects:

	db.put([{},{},{}], function(arr){

	});

Multiple calls to the put method will append data to the database.



## .get() - Get data from the database

One can get data from the database by passing a template object as the first parameter to the get() method. The key/values given in the template object will be used to exactly match with keys/values objects in the database. The second parameter to the get method is a onSuccess callback where the value for the first argument to the callback is an array of the data the get method found in the database.

	db.get({}, function(arr){

	});



## .take() - Take data out of the database

One can take data from the database by passing a template object as the first parameter to the take() method. The key/values given in the template object will be used to exactly match with keys/values objects in the database. The second parameter to the take method is a onSuccess callback where the value for the first argument to the callback is an array of the data the take method found in the database.

	db.take({}, function(arr){

	});

The take() method takes data out of the database. All matches of the take method is removed from the database. take() can also be looked upon as deleting data in the database.



## .sort() - Sort any list of objects

One can sort any list by passing which object parameter one want to sort on as a string to the first parameter to the sort() method. The second parameter to the take method is a onSuccess callback where the value for the first argument to the callback is an array of the sorted list of objects.

	.sort('', function(arr){
		
	});



## .search - Search for partial string occurances

To be documented!



## .each - Loop over each object in a list

To be documented!



## .observe - Observe if an object matching a template enters or leaves the database

Not implemented yet!!



## .save - Persist data in the client

To be documented!



## .drop - Delete all in memory data

To be documented!



## .destroy - Delete all in memory and persisted data

Not implemented yet!!



# Examples:

To be documented!



# Non ES5 compability

To be documented!