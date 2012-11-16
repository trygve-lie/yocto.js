// Test cases for yocto.js

var testCase = buster.testCase("yocto.js Test", {

    setUp: function() {
        this.db = yocto.db();
        this.singleRecordA = {  id: "NOR_01359",
                                lat: 63.68496,
                                lng:  9.66531,
                                name: "Brekstad Hurtigladestasjon, Ørland",
                                street: "Landfestet",
                                streetNumber: "1-5",
                                points: 1,
                                open24h: true,
                                free: false,
                                maxTime: 1
                            };

        this.singleRecordB = {  id: "NOR_00633",
                                lat: 63.58871,
                                lng: 10.74054,
                                name: "Frostasenteret, Frosta",
                                street: "Frostasenteret",
                                streetNumber: "",
                                points: 1,
                                open24h: true,
                                free: true,
                                maxTime: 4
                            };

        this.arrayOfRecordsA = [
            {id: "NOR_01338", lat: 59.92943, lng: 10.46686, name: "Coop Extra, Trondheim", street: "Valkyrieveien", streetNumber: "2", points: 1, open24h: true, free: true, maxTime: 6},
            {id: "NOR_00481", lat: 63.41034, lng: 10.43997, name: "Moholt Storsenter, Trondheim", street: "Brøsetvegen", streetNumber: "177", points: 2, open24h: true, free : true, maxTime: 1},
            {id: "NOR_00097", lat: 60.79564, lng: 11.08045, name: "Eidsiva Energi, Hamar", street: "Vangsvegen", streetNumber: "73", points: 2, open24h: false, free: true, maxTime: 2}
        ];

        this.arrayOfRecordsB = [
            {id: "NOR_00725", lat: 60.15918, lng: 10.25634, name: "Eikliveien, Hønefoss", street: "Osloveien", streetNumber: "1", points: 4, open24h:true, free: false, maxTime: 8},
            {id: "NOR_00039", lat: 60.46547, lng:  5.32418, name: "Åsane Storsenter, Bergen", street: "Åsane senter", streetNumber: "16", points: 2, open24h: false, free: true, maxTime: 1}

        ];

        this.arrayOfRecordsWithNonObjects = ['a', true, 42];

        this.singleRecordNonObject = 42;
    },

    tearDown: function() {
        delete this.db;
        delete this.singleRecordA;
        delete this.singleRecordB;
        delete this.arrayOfRecordsA;
        delete this.arrayOfRecordsB;
        delete this.arrayOfRecordsWithNonObjects;
        delete this.singleRecordNonObject;
    },



    // ### NEW FEATURES
    "test chain a": function() {
        this.db.n_get(100, function(records) {
            buster.assert.equals(records, 110);
        });
    },


    "test chain a + c": function() {
        this.db.n_get(100).n_each(function(records) {
            buster.assert.equals(records, 130);
        });
    },


    "test chain a + b + c": function() {
        this.db.n_get(100).n_take().n_each(function(records) {
            buster.assert.equals(records, 135);
        });
    },


    "test functional a + b + c": function() {
        this.db.n_get(100);
        this.db.n_take();
        this.db.n_each(function(records) {
            buster.assert.equals(records, 135);
        });
    },




    // ### CORE

    "test library initialization - should return a object": function() {
        buster.assert.isObject(this.db);
    },



    // ### PUT

    "test put of one single object and run callback - in callback _objects_ and _next_ should be 1, after execution _objects_ should be 1 and _next_ 0": function() {
        var self = this;

        this.db.put(this.singleRecordA, function(records) {
            buster.assert.equals(self.db.objects.length, 1);
            buster.assert.equals(self.db.next.length, 1);
        });

        buster.assert.equals(this.db.objects.length, 1);
        buster.assert.equals(this.db.next.length, 0);
    },


    "test put of multiple single objects and run callback - in callback _objects_ and _next_ should be 2, after execution _objects_ should be 2 and _next_ 0": function() {
        var self = this;

        this.db.put(this.singleRecordA).put(this.singleRecordB, function(records) {
            buster.assert.equals(self.db.objects.length, 2);
            buster.assert.equals(self.db.next.length, 2);
        });

        buster.assert.equals(this.db.objects.length, 2);
        buster.assert.equals(this.db.next.length, 0);
    },


    "test put of single array with objects and run callback - in callback _objects_ and _next_ should be 3, after execution _objects_ should be 3 and _next_ 0": function() {
        var self = this;

        this.db.put(this.arrayOfRecordsA, function(records) {
            buster.assert.equals(self.db.objects.length, 3);
            buster.assert.equals(self.db.next.length, 3);
        });

        buster.assert.equals(this.db.objects.length, 3);
        buster.assert.equals(this.db.next.length, 0);
    },


    "test put of multiple arrays with objects and run callback - in callback _objects_ and _next_ should be 5, after execution _objects_ should be 5 and _next_ 0": function() {
        var self = this;

        this.db.put(this.arrayOfRecordsA).put(this.arrayOfRecordsB, function(records) {
            buster.assert.equals(self.db.objects.length, 5);
            buster.assert.equals(self.db.next.length, 5);
        });

        buster.assert.equals(this.db.objects.length, 5);
        buster.assert.equals(this.db.next.length, 0);
    },


    "test put of one single object and not run callback - after execution _objects_ should be 1 and _next_ 1": function() {
        var self = this;

        this.db.put(this.singleRecordA);

        buster.assert.equals(this.db.objects.length, 1);
        buster.assert.equals(this.db.next.length, 1);
    },


    "test put of single array with objects and not run callback - after execution _objects_ should be 3 and _next_ 3": function() {
        var self = this;

        this.db.put(this.arrayOfRecordsA);

        buster.assert.equals(this.db.objects.length, 3);
        buster.assert.equals(this.db.next.length, 3);
    },


    "test put of single non object - in callback and after execution _objects_ and _next_ should be 0": function() {
        var self = this;

        this.db.put(this.singleRecordNonObject, function(records){
            buster.assert.equals(self.db.objects.length, 0);
            buster.assert.equals(self.db.next.length, 0);
        });

        buster.assert.equals(this.db.objects.length, 0);
        buster.assert.equals(this.db.next.length, 0);
    },


    "test put of single array with non objects - in callback and after execution _objects_ and _next_ should be 0": function() {
        var self = this;

        this.db.put(this.arrayOfRecordsWithNonObjects, function(records){
            buster.assert.equals(self.db.objects.length, 0);
            buster.assert.equals(self.db.next.length, 0);
        });

        buster.assert.equals(this.db.objects.length, 0);
        buster.assert.equals(this.db.next.length, 0);
    },



    // ### GET

    "test get of single object - in callback returned number of objects should be 1 and its _id_ should have the value NOR_00481": function() {
        this.db.put(this.arrayOfRecordsA).get({id : "NOR_00481"}, function(records){
            buster.assert.equals(records.length, 1);
            buster.assert.equals(records[0].id, 'NOR_00481');
        })
    },


    "test get of multiple objects - in callback, returned number of objects should be 2 and _open24h_ and _free_ should be true": function() {

        this.db.put(this.arrayOfRecordsA).put(this.arrayOfRecordsB).get({open24h: true, free: true}, function(records) {
            buster.assert.equals(records.length, 2);
            buster.assert.equals(records[0].free, true);
            buster.assert.equals(records[0].open24h, true);
            buster.assert.equals(records[1].free, true);
            buster.assert.equals(records[1].open24h, true);
        })
    },



    // ### SORT

    "test sort on strings": function() {
        this.db.put(this.arrayOfRecordsA).put(this.arrayOfRecordsB).sort('id', function(records) {
            buster.assert.equals(records[0].id, 'NOR_00039');
            buster.assert.equals(records[1].id, 'NOR_00097');
            buster.assert.equals(records[2].id, 'NOR_00481');
            buster.assert.equals(records[3].id, 'NOR_00725');
            buster.assert.equals(records[4].id, 'NOR_01338');
        });
    }


/*
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


    // ### DROP



    // ### DESTROY



    // ### SAVE


// TESTS TO WRITE
// - all - misc form for chaining


});