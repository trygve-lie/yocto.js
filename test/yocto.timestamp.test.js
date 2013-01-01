var buster  = this.buster   || require("buster"),
    yocto   = this.yocto    || require("../src/yocto.js");


buster.testCase("yocto.js Test - Timestamp", {

    setUp: function() {

        this.db = yocto.db({timestamp:'timestamp'});

        this.objs = [
            {id: "NOR_00633", lat: 63.58871, lng: 10.74054, name: "Frostasenteret, Frosta", street: "Frostasenteret", streetNumber: "", points: 1, open24h: true, free: true, maxTime: 4, is: {}},
            {id: "NOR_01338", lat: 59.92943, lng: 10.46686, name: "Coop Extra, Trondheim", street: "Valkyrieveien", streetNumber: "2", points: 1, open24h: true, free: true, maxTime: 6, is: function(foo){}},
            {id: "NOR_00481", lat: 63.41034, lng: 10.43997, name: "Moholt Storsenter, Trondheim", street: "Brøsetvegen", streetNumber: "177", points: 2, open24h: true, free : true, maxTime: 1, is: "foo"},
            {id: "NOR_00097", lat: 60.79564, lng: 11.08045, name: "Eidsiva Energi, Hamar", street: "Vangsvegen", streetNumber: "73", points: 2, open24h: false, free: true, maxTime: 2, is: 2},
            {id: "NOR_00725", timestamp: 666, lat: 60.15918, lng: 10.25634, name: "Eikliveien, Hønefoss", street: "Osloveien", streetNumber: "1", points: 4, open24h:true, free: false, maxTime: 8, is: ""}
        ];

        this.singleRecordA = {  
            id: "NOR_01359", lat: 63.68496, lng:  9.66531, name: "Brekstad Hurtigladestasjon, Ørland", street: "Landfestet", streetNumber: "1-5", points: 1, open24h: true, free: false, maxTime: 1
        };

        this.singleRecordB = {  
            id: "NOR_01359", timestamp: 667, lat: 63.68496, lng:  9.66531, name: "Brekstad Hurtigladestasjon, Ørland", street: "Landfestet", streetNumber: "1-5", points: 1, open24h: true, free: false, maxTime: 1
        };
    },

    tearDown: function() {
        delete this.db;
        delete this.objs;
        delete this.singleRecordA;
        delete this.singleRecordB;
    },


    "put() single object without timestamp - in callback returned object should have a timestamp key with a numeric value": function(done) {
        this.db.put(this.singleRecordA, function(objs){
            buster.assert.equals(objs.length, 1);
            buster.assert.equals(objs[0].id, "NOR_01359");
            buster.assert.isNumber(objs[0].timestamp);
            done();
        });
    },


    "put() single object with timestamp - in callback returned object should have a timestamp key with the same value as before insertion": function(done) {
        this.db.put(this.singleRecordB, function(objs){
            buster.assert.equals(objs.length, 1);
            buster.assert.equals(objs[0].id, "NOR_01359");
            buster.assert.equals(objs[0].timestamp, 667);
            done();
        });
    },


    "put() multiple objects with and without timestamp - in callback objects without timestamp should have been altered and object without timestamp should not be altered": function(done) {
        this.db.put(this.objs, function(objs){
            buster.assert.equals(objs.length, 5);
            buster.assert.isNumber(objs[0].timestamp);
            buster.assert.isNumber(objs[1].timestamp);
            buster.assert.isNumber(objs[2].timestamp);
            buster.assert.isNumber(objs[3].timestamp);
            buster.assert.equals(objs[4].timestamp, 666);
            done();
        });
    },


    "put().get() multiple objects - in callback one should have matched on the timestamp key value": function(done) {
        this.db.put(this.objs, function(objs){
            buster.assert.equals(objs.length, 5);
        });

        this.db.get({timestamp:666}, function(objs){
            buster.assert.equals(objs[0].id, 'NOR_00725');
            buster.assert.equals(objs[0].timestamp, 666);
            done();
        })
    },


    "put().get() both timestamp and uuid is set in config - in callback timestamp should exist and be anumber": function(done) {
        
        var db = yocto.db({timestamp:'timestamp', uuid:'id'});

        db.put(this.singleRecordA, function(objs){
            buster.assert.equals(objs.length, 1);
        });

        db.get({id:'NOR_01359'}, function(objs){
            buster.assert.equals(objs[0].id, 'NOR_01359');
            buster.assert.isNumber(objs[0].timestamp);
            done();
        })
    }

});