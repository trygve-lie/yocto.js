var buster  = this.buster   || require("buster"),
    yocto   = this.yocto    || require("../src/yocto.js");

buster.testCase("yocto.js Test - Get", {

    setUp: function(done) {
        this.db = yocto.db();

        this.objs = [
            {id: "NOR_01359", lat: 63.68496, lng:  9.66531, name: "Brekstad Hurtigladestasjon, Ørland", street: "Landfestet", streetNumber: "1-5", points: 1, open24h: true, free: false, maxTime: 1, is: []},
            {id: "NOR_00633", lat: 63.58871, lng: 10.74054, name: "Frostasenteret, Frosta", street: "Frostasenteret", streetNumber: "", points: 1, open24h: true, free: true, maxTime: 4, is: {}},
            {id: "NOR_01338", lat: 59.92943, lng: 10.46686, name: "Coop Extra, Trondheim", street: "Valkyrieveien", streetNumber: "2", points: 1, open24h: true, free: true, maxTime: 6, is: function(foo){}},
            {id: "NOR_00481", lat: 63.41034, lng: 10.43997, name: "Moholt Storsenter, Trondheim", street: "Brøsetvegen", streetNumber: "177", points: 2, open24h: true, free : true, maxTime: 1, is: "foo"},
            {id: "NOR_00097", lat: 60.79564, lng: 11.08045, name: "Eidsiva Energi, Hamar", street: "Vangsvegen", streetNumber: "73", points: 2, open24h: false, free: true, maxTime: 2, is: 2},
            {id: "NOR_00725", lat: 60.15918, lng: 10.25634, name: "Eikliveien, Hønefoss", street: "Osloveien", streetNumber: "1", points: 4, open24h:true, free: false, maxTime: 8, is: ""}
        ];

        this.db.put(this.objs, function(objs){
            done();
        });

    },

    tearDown: function() {
        delete this.db;
        delete this.objs;
    },


    "no keys defined - in callback returned number of objects should be 6": function(done) {
        this.db.get({}, function(objs){
            buster.assert.equals(objs.length, 6);
            done();
        });
    },


    "single key - in callback returned number of objects should be 1 and its _id_ should have the value NOR_00481": function(done) {
        this.db.get({id : "NOR_00481"}, function(objs){
            buster.assert.equals(objs.length, 1);
            buster.assert.equals(objs[0].id, 'NOR_00481');
            done();
        });
    },


    "multiple keys - in callback, returned number of objects should be 1. _open24h_ should be false and _free_ should be true": function(done) {
        this.db.get({open24h: false, free: true}, function(objs) {
            buster.assert.equals(objs.length, 1);
            buster.assert.equals(objs[0].open24h, false);
            buster.assert.equals(objs[0].free, true);
            done();
        })
    },


    "multiple objects - in callback, returned number of objects should be 3. _points_ should be 1": function(done) {
        this.db.get({points: 1}, function(objs) {
            buster.assert.equals(objs.length, 3);
            buster.assert.equals(objs[0].points, 1);
            buster.assert.equals(objs[1].points, 1);
            buster.assert.equals(objs[2].points, 1);
            done();
        })
    },


    "function as key vaule - in callback, returned number of objects should be 1. _name_ should be Coop Extra, Trondheim": function(done) {
        function testName(obj, is){
            return (obj.substring(0,4) === 'Coop');
        }

        this.db.get({name: testName}, function(objs) {
            buster.assert.equals(objs.length, 1);
            buster.assert.equals(objs[0].name, 'Coop Extra, Trondheim');
            done();
        })
    },


    "function as key vaule - is.arr check - in callback, returned number of objects should be 1. _id_ should be NOR_01359": function(done) {
        function isTest(obj, is){
            return is.arr(obj);
        }

        this.db.get({is: isTest}, function(objs) {
            buster.assert.equals(objs.length, 1);
            buster.assert.equals(objs[0].id, 'NOR_01359');
            done();
        })
    },

/*
    "function as key vaule - is.obj check - in callback, returned number of objects should be 1. _id_ should be NOR_00633": function(done) {
        function isTest(obj, is){
            return is.obj(obj);
        }

        this.db.get({is: isTest}, function(objs) {
            buster.log(objs);
            buster.assert.equals(objs.length, 1);
            buster.assert.equals(objs[0].id, 'NOR_00633');
            done();
        })
    },
*/

    "function as key vaule - is.fn check - in callback, returned number of objects should be 1. _id_ should be NOR_01338": function(done) {
        function isTest(obj, is){
            return is.fn(obj);
        }

        this.db.get({is: isTest}, function(objs) {
            buster.assert.equals(objs.length, 1);
            buster.assert.equals(objs[0].id, 'NOR_01338');
            done();
        })
    },


    "function as key vaule - is.str check - in callback, returned number of objects should be 2. _id_ should be NOR_00481 and NOR_00725": function(done) {
        function isTest(obj, is){
            return is.str(obj);
        }

        this.db.get({is: isTest}, function(objs) {
            buster.assert.equals(objs.length, 2);
            buster.assert.equals(objs[0].id, 'NOR_00481');
            buster.assert.equals(objs[1].id, 'NOR_00725');
            done();
        })
    },


    "function as key vaule - is.num check - in callback, returned number of objects should be 1. _id_ should be NOR_00097": function(done) {
        function isTest(obj, is){
            return is.num(obj);
        }

        this.db.get({is: isTest}, function(objs) {
            buster.assert.equals(objs.length, 1);
            buster.assert.equals(objs[0].id, 'NOR_00097');
            done();
        })
    },

/*
    "function as key vaule - is.empty check - in callback, returned number of objects should be 1. _id_ should be NOR_00725": function(done) {
        function isTest(obj, is){
            return is.empty(obj);
        }

        this.db.get({is: isTest}, function(objs) {

            buster.assert.equals(objs.length, 1);
            buster.assert.equals(objs[0].id, 'NOR_00725');
            done();
        })
    }
*/

});