function perfTest(fn, iterations) {
	var start 	= +new Date(),
		end 	= 0,
		i 		= iterations || 1000;

	while(i--){
		fn();
	}

	end = +new Date();	
	return (end-start);
}


function testGet() {
	var result = perfTest(function(){
		db.get({free:false}, function(arr){
			// console.log(arr.length);
		});
	});
	document.querySelectorAll('#testGet .result')[0].innerHTML = result + 'ms';
}


function testGetEach() {
	var result = perfTest(function(){
		db.get({free:false}).each(function(el){
			// console.log(el);
		});
	});
	document.querySelectorAll('#testGetEach .result')[0].innerHTML = result + 'ms';
}



// Init a database

var db = yocto.db();


// Load data from server

var xhr = new XMLHttpRequest();
xhr.open('GET', '/mock/data.json');
xhr.onload = function(e) {
  var data = JSON.parse(this.response);
  db.put(data.positions, function(arr){
	document.getElementById('info').innerHTML = data.positions.length + ' objects loaded into database';
	document.getElementById('testGet').addEventListener('click', testGet);
	document.getElementById('testGetEach').addEventListener('click', testGetEach);
  });
}
xhr.send();










function getTest() {
	var start = +new Date(),
		end = 0,
		i = 100;

	while(i--){
		db.get({free:false}, function(arr){ });
	}

	end = +new Date();
	console.log((end-start)/1000);
}