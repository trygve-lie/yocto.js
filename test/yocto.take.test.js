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


    "single object - in callback returned number of objects should be 1 and a get on all objects after take should be 5": function(done) {
        this.db.take({id : "NOR_00481"}, function(objs){
            buster.assert.equals(objs.length, 1);
            buster.assert.equals(objs[0].id, 'NOR_00481');
        });

        this.db.get({}, function(objs){
            buster.assert.equals(objs.length, 5);
            done();
        });

    },


    "multiple objects - in callback returned number of objects should be 5 and a get on all objects after take should be 1": function(done) {
        this.db.take({open24h : true}, function(objs){
            buster.assert.equals(objs.length, 5);
        });

        this.db.get({}, function(objs){
            buster.assert.equals(objs.length, 1);
            done();
        });

    },


    "all objects - in callback returned number of objects should be 6 and a get on all objects after take should be 0": function(done) {
        this.db.take({}, function(objs){
            buster.assert.equals(objs.length, 6);
        });

        this.db.get({}, function(objs){
            buster.assert.equals(objs.length, 0);
            done();
        });

    }    

});