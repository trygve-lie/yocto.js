var testCase = buster.testCase("yocto.js Test - Put", {

    setUp: function() {
        //this.db = yocto.db();
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



    "single object and run callback - in callback length of returned array should be 1": function(done) {
        var db = yocto.db();

        db.put(this.singleRecordA, function(records) {
            buster.assert.equals(records.length, 1);
            done();
        });
    },


    "multiple single objects and run callback - in callback length of returned array should be 2": function(done) {
        var db = yocto.db();

        db.put(this.singleRecordA).put(this.singleRecordB, function(records) {
            buster.assert.equals(records.length, 2);
            done();
        });
    },


    "single array with objects and run callback - in callback length of returned array should be 3": function(done) {
        var db = yocto.db();

        db.put(this.arrayOfRecordsA, function(records) {
            buster.assert.equals(records.length, 3);
            done();
        });
    },


    "multiple arrays with objects and run callback - in callback length of returned array should be 5": function(done) {
        var db = yocto.db();

        db.put(this.arrayOfRecordsA).put(this.arrayOfRecordsB, function(records) {
            buster.assert.equals(records.length, 5);
            done();
        });
    },


    "single object and not run callback - after execution _result_ should have a length of 1": function() {
        var db = yocto.db();
        db.put(this.singleRecordA);
        buster.assert.equals(db.parameters.result.length, 1);

        // Terminate chain
        db.each(function(e){});  
    },


    "single array with objects and not run callback - after execution _result_ should have a length of 3": function() {
        var db = yocto.db();
        db.put(this.arrayOfRecordsA);
        buster.assert.equals(db.parameters.result.length, 3);

        // Terminate chain
        db.each(function(e){});  
    },


    "single non object - after execution _result_ should have a length of 0": function(done) {
        var db = yocto.db();

        db.put(this.singleRecordNonObject, function(records){
            buster.assert.equals(records.length, 0);
            done();
        });

        buster.assert.equals(db.parameters.result.length, 0);
    },


    "single array with non objects - after execution _result_ should have a length of 0": function(done) {
        var db = yocto.db();

        db.put(this.arrayOfRecordsWithNonObjects, function(records){
            buster.assert.equals(records.length, 0);
            done();
        });

        buster.assert.equals(db.parameters.result.length, 0);
    }

});