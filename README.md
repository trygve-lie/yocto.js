# yocto.js

yocto.js is a tiny in-memory database with an tuple space inspired API. In a way its a set of convinient methods to work on a list of objects.

yocto.js is intended to be used in the browser but has methods for persisting and recovering data to and from local storage. Though; yocto.js can also be used in node.js but then without the features of persisting to disk.

yocto.js does utilize some ES5 features. Runtimes which does not have these features, such as older browsers, are still supported by a provided set of ES5 shims. Please see "Non ES5 compability" for further details.



# Working with yocto.js

yocto.js operate on lists of objects. All objects put into the base is then traversed by matching with a template object that contains the keys and values one want to match on.

Internally the database looks like this:

	[
		{album: 'High Visibility', artist: 'The Hellacopters', released: 2000, genre: 'punk rock'},
		{album: 'Basement Apes', artist: 'Gluecifer', released: 2000, genre: 'rock'},
		{album: 'Deathcrush', artist: 'Mayhem', released: 2000, genre: 'black metal'},
		{album: 'Supershitty to the Max', artist: 'The Hellacopters', released: 1997, genre: 'punk rock'},
		{album: 'Comming Down', artist: 'Baby Woodrose', released: 2000, genre 'psychedelic rock'}
	]



## .db() - Creating a database

You create a database by invoking the db method:

	var db = yocto.db();





# Non ES5 compability