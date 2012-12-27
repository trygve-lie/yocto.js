var buster  = this.buster   || require("buster"),
    yocto   = this.yocto    || require("../src/yocto.js");


buster.testCase("yocto.js Test - UUID", {

    setUp: function(done) {

        this.db = yocto.db({uuid:'id'});

        this.objs = [
            {id: "NOR_01359", lat: 63.68496, lng:  9.66531, name: "Brekstad Hurtigladestasjon, Ørland", street: "Landfestet", streetNumber: "1-5", points: 1, open24h: true, free: false, maxTime: 1, is: []},
            {id: "NOR_00633", lat: 63.58871, lng: 10.74054, name: "Frostasenteret, Frosta", street: "Frostasenteret", streetNumber: "", points: 1, open24h: true, free: true, maxTime: 4, is: {}},
            {id: "NOR_01338", lat: 59.92943, lng: 10.46686, name: "Coop Extra, Trondheim", street: "Valkyrieveien", streetNumber: "2", points: 1, open24h: true, free: true, maxTime: 6, is: function(foo){}},
            {id: "NOR_00481", lat: 63.41034, lng: 10.43997, name: "Moholt Storsenter, Trondheim", street: "Brøsetvegen", streetNumber: "177", points: 2, open24h: true, free : true, maxTime: 1, is: "foo"},
            {id: "NOR_00097", lat: 60.79564, lng: 11.08045, name: "Eidsiva Energi, Hamar", street: "Vangsvegen", streetNumber: "73", points: 2, open24h: false, free: true, maxTime: 2, is: 2},
            {id: "NOR_00725", lat: 60.15918, lng: 10.25634, name: "Eikliveien, Hønefoss", street: "Osloveien", streetNumber: "1", points: 4, open24h:true, free: false, maxTime: 8, is: ""}
        ];

        this.duplicateObjs = [
            {id: "NOR_01359", lat: 63.68496, lng:  9.66531, name: "Brekstad Hurtigladestasjon, Ørland", street: "Landfestet", streetNumber: "1-5", points: 1, open24h: true, free: false, maxTime: 1, is: []},
            {id: "NOR_00633", lat: 63.58871, lng: 10.74054, name: "Frostasenteret, Frosta", street: "Frostasenteret", streetNumber: "", points: 1, open24h: true, free: true, maxTime: 4, is: {}},
            {id: "NOR_01338", lat: 59.92943, lng: 10.46686, name: "Coop Extra, Trondheim", street: "Valkyrieveien", streetNumber: "2", points: 1, open24h: true, free: true, maxTime: 6, is: function(foo){}},
            {id: "NOR_00481", lat: 63.41034, lng: 10.43997, name: "Moholt Storsenter, Trondheim", street: "Brøsetvegen", streetNumber: "177", points: 2, open24h: true, free : true, maxTime: 1, is: "foo"},
            {id: "NOR_00097", lat: 60.79564, lng: 11.08045, name: "Eidsiva Energi, Hamar", street: "Vangsvegen", streetNumber: "73", points: 2, open24h: false, free: true, maxTime: 2, is: 2},
            {id: "NOR_00725", lat: 60.15918, lng: 10.25634, name: "Eikliveien, Hønefoss", street: "Osloveien", streetNumber: "1", points: 4, open24h:true, free: false, maxTime: 8, is: ""}
        ];

        this.db.put(this.objs).put(this.duplicateObjs, function(objs){
            done();
        });
        
        this.testTimeout = 100; // in milliseconds
    },

    tearDown: function() {
        delete this.db;
        delete this.objs;
        delete this.duplicateObjs;
        delete this.testTimeout;
    },


    "get() - in callback, returned number of objects should be 1 and _id_ of returned object should be NOR_00097": function(done) {
        this.db.get({id: "NOR_00097"}, function(objs) {
            buster.assert.equals(objs.length, 1);
            buster.assert.equals(objs[0].id, "NOR_00097");
            done();
        });
    },


    "get().each() - after loop, number of objects should be 1 and _id_ of returned object should be NOR_00097": function(done) {

        var objs = [];

        this.db.get({id: "NOR_00097"}).each(function(obj){
            objs.push(obj);
        });

        setTimeout(function(){
            buster.assert.equals(objs.length, 1);
            buster.assert.equals(objs[0].id, "NOR_00097");
            done();
        }, this.testTimeout);
    },


    "take() - in callback, returned number of objects should be 2 and _id_ of both objects should be NOR_00097": function(done) {
        var self = this;

        this.db.take({id: "NOR_00097"}, function(objs) {
            buster.assert.equals(objs.length, 2);
            buster.assert.equals(objs[0].id, "NOR_00097");
            buster.assert.equals(objs[1].id, "NOR_00097");
           done();
        });
/*
        setTimeout(function(){
            self.db.get({id: "NOR_00097"}, function(objs) {
                buster.assert.equals(objs.length, 0);
                //buster.assert.equals(objs[0].id, "NOR_00097");
                done();
            });
        }, this.testTimeout);
*/

    }/*,


    "take().each() - after loop, number of objects should be 2 and _id_ of returned object should be NOR_00097": function(done) {
 
        var objs = [];

        this.db.take({id: "NOR_00097"}).each(function(obj){
            objs.push(obj);
        });

        setTimeout(function(){
            buster.assert.equals(objs.length, 1);
            buster.assert.equals(objs[0].id, "NOR_00097");
            done();
        }, this.testTimeout);

    }
*/
});