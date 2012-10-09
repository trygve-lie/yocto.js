# yocto.js

yocto.js is a tiny in-memory database with an tuple space inspired API. In a way its a set of convinient methods to work on a list of objects.

yocto.js is intended to be used in the browser but has methods for persisting and recovering data to and from local storage. Though; yocto.js can also be used in node.js but then without the features of persisting to disk.

yocto.js does utilize some ES5 features. Runtimes which does not have these features, such as older browsers, are still supported by a provided set of ES5 shims. Please see "Non ES5 compability" for further details.



# Working with yocto.js

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

If this template was passed on to one of the methods for finding objects in yocto.js, it would match with one object in the above example database. The method would return a list like this:

	[
		{id: 3, album: 'Supershitty to the Max!', artist: 'The Hellacopters', year: 1996, style: 'Punk rock'},
	]

Almost all methods in yocto.js is chained. When using chaining each method in the chain work on the returned result from the previous method in the chain. The chain is terminated by executing a callback where one want to do something on the final result.

In this example, again working on the above database, we get all objects in the database where the artist is "The Hellacopters" and then we sort the result on the property "year" before we loop over each item:

	db.get({artist: 'The Hellacopters'}).sort('year').each(function(obj){
		console.log(obj.artist + ' did release ' + obj.album + ' in ' + obj.year.toString());
	})



## .db() - Creating a database

You create a database by invoking the db method:

	var db = yocto.db();



## .put() - Put data into the database

One can put a single




# Non ES5 compability