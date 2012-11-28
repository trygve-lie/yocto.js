var testCase = buster.testCase("yocto.js Test - Get", {

    setUp: function() {
        // this.db = yocto.db();

        this.objs = [
            {id: "NOR_01359", lat: 63.68496, lng:  9.66531, name: "Brekstad Hurtigladestasjon, Ørland", street: "Landfestet", streetNumber: "1-5", points: 1, open24h: true, free: false, maxTime: 1},
            {id: "NOR_00633", lat: 63.58871, lng: 10.74054, name: "Frostasenteret, Frosta", street: "Frostasenteret", streetNumber: "", points: 1, open24h: true, free: true, maxTime: 4},
            {id: "NOR_01338", lat: 59.92943, lng: 10.46686, name: "Coop Extra, Trondheim", street: "Valkyrieveien", streetNumber: "2", points: 1, open24h: true, free: true, maxTime: 6},
            {id: "NOR_00481", lat: 63.41034, lng: 10.43997, name: "Moholt Storsenter, Trondheim", street: "Brøsetvegen", streetNumber: "177", points: 2, open24h: true, free : true, maxTime: 1},
            {id: "NOR_00097", lat: 60.79564, lng: 11.08045, name: "Eidsiva Energi, Hamar", street: "Vangsvegen", streetNumber: "73", points: 2, open24h: false, free: true, maxTime: 2},
            {id: "NOR_00725", lat: 60.15918, lng: 10.25634, name: "Eikliveien, Hønefoss", street: "Osloveien", streetNumber: "1", points: 4, open24h:true, free: false, maxTime: 8}
        ];


    },

    tearDown: function() {
        //delete this.db;
        // delete this.objs;
    },



    "single object - in callback returned number of objects should be 1 and its _id_ should have the value NOR_00481": function(done) {
        // var self = this;
        var db = yocto.db();

        db.put(this.objs, function(records) { 
            // Do nothing

            db.get({id : "NOR_00481"}, function(r){
    // console.log(self.db.parameters.objects.length);
                buster.assert.equals(r.length, 1);
                buster.assert.equals(r[0].id, 'NOR_00481');
                done();
            });

            // done();
        });



    }/*,


    "test get of multiple objects - in callback, returned number of objects should be 2 and _open24h_ and _free_ should be true": function() {

        this.db.put(this.arrayOfRecordsA).put(this.arrayOfRecordsB).get({open24h: true, free: true}, function(records) {
            buster.assert.equals(records.length, 2);
            buster.assert.equals(records[0].free, true);
            buster.assert.equals(records[0].open24h, true);
            buster.assert.equals(records[1].free, true);
            buster.assert.equals(records[1].open24h, true);
        })
    },



    // ### TAKE

    "test take of single object - in callback, returned number of objects should be 1 and equal to the one taken, after execution _objects_ should be one less": function() {
        var self = this;

        this.db.put(this.arrayOfRecordsA).take({id: 'NOR_00481'}, function(records) {
            buster.assert.equals(records.length, 1);
            buster.assert.equals(records[0].id, 'NOR_00481');
            buster.assert.equals(self.db.objects.length, 2);
        });

    }
*/

    // ### SORT
/*
    "test sort on strings": function() {
        this.db.put(this.arrayOfRecordsA).put(this.arrayOfRecordsB).sort('id', function(records) {
            buster.assert.equals(records[0].id, 'NOR_00039');
            buster.assert.equals(records[1].id, 'NOR_00097');
            buster.assert.equals(records[2].id, 'NOR_00481');
            buster.assert.equals(records[3].id, 'NOR_00725');
            buster.assert.equals(records[4].id, 'NOR_01338');
        });
    },
*/


});