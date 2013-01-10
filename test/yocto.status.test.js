var buster  = this.buster   || require("buster"),
    yocto   = this.yocto    || require("../src/yocto.js");


buster.testCase("yocto.js Test - Status", {

    setUp: function() {
        this.objs = [
            {id: "NOR_01359", timestamp: 1000, lat: 63.68496, lng:  9.66531, name: "Brekstad Hurtigladestasjon, Ørland", street: "Landfestet", streetNumber: "1-5", points: 1, open24h: true, free: false, maxTime: 1, is: []},
            {id: "NOR_00633", timestamp: 1010, lat: 63.58871, lng: 10.74054, name: "Frostasenteret, Frosta", street: "Frostasenteret", streetNumber: "", points: 1, open24h: true, free: true, maxTime: 4, is: {}},
            {id: "NOR_01338", timestamp: 1100, lat: 59.92943, lng: 10.46686, name: "Coop Extra, Trondheim", street: "Valkyrieveien", streetNumber: "2", points: 1, open24h: true, free: true, maxTime: 6, is: function(foo){}},
            {id: "NOR_00481", timestamp: 1030, lat: 63.41034, lng: 10.43997, name: "Moholt Storsenter, Trondheim", street: "Brøsetvegen", streetNumber: "177", points: 2, open24h: true, free : true, maxTime: 1, is: "foo"},
            {id: "NOR_00097", timestamp: 1001, lat: 60.79564, lng: 11.08045, name: "Eidsiva Energi, Hamar", street: "Vangsvegen", streetNumber: "73", points: 2, open24h: false, free: true, maxTime: 2, is: 2},
            {id: "NOR_00725", timestamp: 1011, lat: 60.15918, lng: 10.25634, name: "Eikliveien, Hønefoss", street: "Osloveien", streetNumber: "1", points: 4, open24h:true, free: false, maxTime: 8, is: ""}
        ];
    },

    tearDown: function() {
        delete this.objs;
    },


    "status() - in callback, returned values should reflect whats put into the database": function(done) {
        var db = yocto.db({uuid:'id', timestamp:'timestamp'});
        
        db.put(this.objs, function(objs){

        });

        db.status(function(obj) {
            buster.assert.equals(obj.count, 6);
            buster.assert.isNumber(obj.updated);
            done();
        });
    },

    "status().highest timestamping turned on - in callback highest timestamp should be 1100": function(done) {
        var db = yocto.db({uuid:'id', timestamp:'timestamp'});
        
        db.put(this.objs, function(objs){

        });

        db.status(function(obj){
            buster.assert.equals(obj.latest, 1100);
            done();
        });
    },

    "status().highest timestamping turned off - in callback timestamp should be -1": function(done) {
        var db = yocto.db({uuid:'id'});
        
        db.put(this.objs, function(objs){

        });

        db.status(function(obj){
            buster.assert.equals(obj.latest, -1);
            done();
        });
    }

});