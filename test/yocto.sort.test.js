buster.testCase("yocto.js Test - Take", {

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


    "sort selection - in callback returned number of objects should be 2 and _id_ should be in sorted order": function(done) {
        this.db.get({free:false}).sort('id', function(objs){
            buster.assert.equals(objs.length, 2);            
            buster.assert.equals(objs[0].id, 'NOR_00725');
            buster.assert.equals(objs[1].id, 'NOR_01359');
            done();
        });
    },


    "sort string - in callback returned number of objects should be 6 and _id_ should be in sorted order": function(done) {
        this.db.get({}).sort('id', function(objs){
            buster.assert.equals(objs.length, 6);
            buster.assert.equals(objs[0].id, 'NOR_00097');
            buster.assert.equals(objs[1].id, 'NOR_00481');
            buster.assert.equals(objs[2].id, 'NOR_00633');
            buster.assert.equals(objs[3].id, 'NOR_00725');
            buster.assert.equals(objs[4].id, 'NOR_01338');
            buster.assert.equals(objs[5].id, 'NOR_01359');
            done();
        });
    },


    "sort number - in callback returned number of objects should be 6 and _maxTime_ should be in sorted order": function(done) {
        this.db.get({}).sort('maxTime', function(objs){
            buster.assert.equals(objs.length, 6);
            buster.assert.equals(objs[0].maxTime, 1);
            buster.assert.equals(objs[1].maxTime, 1);
            buster.assert.equals(objs[2].maxTime, 2);
            buster.assert.equals(objs[3].maxTime, 4);
            buster.assert.equals(objs[4].maxTime, 6);
            buster.assert.equals(objs[5].maxTime, 8);
            done();
        });
    },


    "sort boolean - in callback returned number of objects should be 6 and _free_ should be in sorted order": function(done) {
        this.db.get({}).sort('free', function(objs){
            buster.assert.equals(objs.length, 6);
            buster.assert.equals(objs[0].free, false);
            buster.assert.equals(objs[1].free, false);
            buster.assert.equals(objs[2].free, true);
            buster.assert.equals(objs[3].free, true);
            buster.assert.equals(objs[4].free, true);
            buster.assert.equals(objs[5].free, true);
            done();
        });
    }

});