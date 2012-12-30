// Helper - Load data

function loadData(onLoaded){
  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/mock/data.json');

  xhr.onloadstart = function(e){
    document.getElementById('info').innerHTML = 'Info: Loading objects from server';
  }

  xhr.onloadend = function(e) {
    var data = JSON.parse(this.response);
    document.getElementById('info').innerHTML = 'Info: Loaded ' + data.codes.length + ' objects from server';
    onLoaded.call(null, data);
  }

  xhr.onerror = function(e) {
    document.getElementById('info').innerHTML = 'Info: Loading objects from server failed!';
  }

  xhr.send();
}



// Test - Create database with no configuration

var database = function(ev) {

  var el    = ev.target,
      text  = el.innerHTML;

  var bench = Benchmark(text, {
    'fn' : function() {
      var db = yocto.db();
    },

    'onStart' : function(event) {
      el.setAttribute('class', 'running');
      el.innerHTML = text + ' - Running';
    },

    'onComplete' : function(event) {
      el.setAttribute('class', 'done');
      el.innerHTML = String(event.target);
      el.removeEventListener('click', database);
    }
  }).run({'async': true});

}
document.getElementById('db').addEventListener('click', database);



// Test - Create database with no configuration and put() test data set into database

var put = function(ev) {

  var el    = ev.target,
      text  = el.innerHTML;

  loadData(function(objs){

    var bench = Benchmark(text, {
      'fn' : function() {
        var db = yocto.db();
        db.put(objs.codes, function(objs){
          // Do nothing. Just meachure speed
        });
      },

      'onStart' : function(event) {
        el.setAttribute('class', 'running');
        el.innerHTML = text + ' - Running';
      },

      'onComplete' : function(event) {
        el.setAttribute('class', 'done');
        el.innerHTML = String(event.target);
        el.removeEventListener('click', put);
      }
    }).run({'async': true});

  });

}
document.getElementById('put').addEventListener('click', put);



// Test - Create database with uuid and put() test data set into database

var put_uuid = function(ev) {

  var el    = ev.target,
      text  = el.innerHTML;

  loadData(function(objs){

    var bench = Benchmark(text, {
      'fn' : function() {
        var db = yocto.db({uuid:'code'});
        db.put(objs.codes, function(objs){
          // Do nothing. Just meachure speed
        });
      },

      'onStart' : function(event) {
        el.setAttribute('class', 'running');
        el.innerHTML = text + ' - Running';
      },

      'onComplete' : function(event) {
        el.setAttribute('class', 'done');
        el.innerHTML = String(event.target);
        el.removeEventListener('click', put_uuid);
      }
    }).run({'async': true});

  });

}
document.getElementById('put:uuid').addEventListener('click', put_uuid);



// Test - Create database with uuid and put() test data set into database

var put_timestamp = function(ev) {

  var el    = ev.target,
      text  = el.innerHTML;

  loadData(function(objs){

    var bench = Benchmark(text, {
      'fn' : function() {
        var db = yocto.db({timestamp:'timestamp'});
        db.put(objs.codes, function(objs){
          // Do nothing. Just meachure speed
        });
      },

      'onStart' : function(event) {
        el.setAttribute('class', 'running');
        el.innerHTML = text + ' - Running';
      },

      'onComplete' : function(event) {
        el.setAttribute('class', 'done');
        el.innerHTML = String(event.target);
        el.removeEventListener('click', put_timestamp);
      }
    }).run({'async': true});

  });

}
document.getElementById('put:timestamp').addEventListener('click', put_timestamp);



// Test - get() with one object key in the template and no uuid enabled

var get = function(ev) {

  var db    = yocto.db(),
      el    = ev.target,
      text  = el.innerHTML;

  loadData(function(objs){
    db.put(objs.codes, function(){});

    var bench = Benchmark(text, {

      'fn' : function() {
        db.get({code:19003}, function(arr){
          // Do nothing. Just meachure speed
        });
      },

      'onStart' : function(event) {
        el.setAttribute('class', 'running');
        el.innerHTML = text + ' - Running';
      },

      'onComplete' : function(event) {
        el.setAttribute('class', 'done');
        el.innerHTML = String(event.target);
        el.removeEventListener('click', get);
      }
    }).run({'async': true});

  });

}
document.getElementById('get').addEventListener('click', get);



// Test - get() with one object key in the template and with uuid enabled

var get_uuid = function(ev) {

  var db    = yocto.db({uuid:'code'}),
      el    = ev.target,
      text  = el.innerHTML;

  loadData(function(objs){
    db.put(objs.codes, function(){});

    var bench = Benchmark(text, {

      'fn' : function() {
        db.get({code:19003}, function(arr){
          // Do nothing. Just meachure speed
        });
      },

      'onStart' : function(event) {
        el.setAttribute('class', 'running');
        el.innerHTML = text + ' - Running';
      },

      'onComplete' : function(event) {
        el.setAttribute('class', 'done');
        el.innerHTML = String(event.target);
        el.removeEventListener('click', get_uuid);
      }
    }).run({'async': true});

  });

}
document.getElementById('get:uuid').addEventListener('click', get_uuid);



// Test - get().each() with one object key in the template and no uuid enabled

var get_each = function(ev) {

  var db    = yocto.db(),
      el    = ev.target,
      text  = el.innerHTML;

  loadData(function(objs){
    db.put(objs.codes, function(){});

    var bench = Benchmark(text, {

      'fn' : function() {
        db.get({code:19003}).each(function(obj){
          // Do nothing. Just meachure speed
        });
      },

      'onStart' : function(event) {
        el.setAttribute('class', 'running');
        el.innerHTML = text + ' - Running';
      },

      'onComplete' : function(event) {
        el.setAttribute('class', 'done');
        el.innerHTML = String(event.target);
        el.removeEventListener('click', get_each);
      }
    }).run({'async': true});

  });

}
document.getElementById('get:each').addEventListener('click', get_each);