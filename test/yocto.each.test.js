buster.testCase("yocto.js Test - Each", {

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

        this.testTimeout = 100; // in milliseconds
    },

    tearDown: function() {
        delete this.db;
        delete this.objs;
    },


    "put().each() - after loop, number of objects should be 2 and both _id_ should match the ids of the inserted objects": function(done) {
        var newObjs = [
            {id: "NOR_01225", lat: 60.15918, lng: 10.25634, name: "Local Place, Hønefoss", street: "Amtmann Meinichs Gate", streetNumber: "3", points: 4, open24h:true, free: false, maxTime: 8},
            {id: "NOR_00039", lat: 60.46547, lng:  5.32418, name: "Åsane Storsenter, Bergen", street: "Åsane senter", streetNumber: "16", points: 2, open24h: false, free: true, maxTime: 1}
        ];

        var objs = [];

        this.db.put(newObjs).each(function(obj){
            objs.push(obj);
        });

        setTimeout(function(){
            buster.assert.equals(objs.length, 2);
            buster.assert.equals(objs[0].id, 'NOR_01225');
            buster.assert.equals(objs[1].id, 'NOR_00039');
            done();
        }, this.testTimeout);
    },


    "get().each() - after loop, number of objects should be 2 and both _free_ should be true": function(done) {
        var objs = [];
        this.db.get({free:false}).each(function(obj){
            objs.push(obj);
        });

        setTimeout(function(){
            buster.assert.equals(objs.length, 2);
            buster.assert.equals(objs[0].free, false);
            buster.assert.equals(objs[1].free, false);
            done();
        }, this.testTimeout);
    },


    "take().each() - after loop, number of objects should be 2 and both _free_ should be true": function(done) {
        var objs = [];
        this.db.take({free:false}).each(function(obj){
            objs.push(obj);
        });

        setTimeout(function(){
            buster.assert.equals(objs.length, 2);
            buster.assert.equals(objs[0].free, false);
            buster.assert.equals(objs[1].free, false);
            done();
        }, this.testTimeout);
    },


    "get().sort().each() - after loop, number of objects should be 2 and _id_ should be in sorted order": function(done) {
        var objs = [];
        this.db.get({free:false}).sort('id').each(function(obj){
            objs.push(obj);
        });

        setTimeout(function(){
            buster.assert.equals(objs.length, 2);
            buster.assert.equals(objs[0].id, 'NOR_00725');
            buster.assert.equals(objs[1].id, 'NOR_01359');
            done();
        }, this.testTimeout);
    }

});