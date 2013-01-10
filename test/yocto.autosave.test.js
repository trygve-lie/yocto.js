buster.testCase("yocto.js Test - Autosave", {

    setUp: function() {

        this.objs = [
            {id: "NOR_01359", lat: 63.68496, lng:  9.66531, name: "Brekstad Hurtigladestasjon, Ørland", street: "Landfestet", streetNumber: "1-5", points: 1, open24h: true, free: false, maxTime: 1, is: []},
            {id: "NOR_00633", lat: 63.58871, lng: 10.74054, name: "Frostasenteret, Frosta", street: "Frostasenteret", streetNumber: "", points: 1, open24h: true, free: true, maxTime: 4, is: {}},
            {id: "NOR_01338", lat: 59.92943, lng: 10.46686, name: "Coop Extra, Trondheim", street: "Valkyrieveien", streetNumber: "2", points: 1, open24h: true, free: true, maxTime: 6, is: function(foo){}},
            {id: "NOR_00481", lat: 63.41034, lng: 10.43997, name: "Moholt Storsenter, Trondheim", street: "Brøsetvegen", streetNumber: "177", points: 2, open24h: true, free : true, maxTime: 1, is: "foo"},
            {id: "NOR_00097", lat: 60.79564, lng: 11.08045, name: "Eidsiva Energi, Hamar", street: "Vangsvegen", streetNumber: "73", points: 2, open24h: false, free: true, maxTime: 2, is: 2},
            {id: "NOR_00725", lat: 60.15918, lng: 10.25634, name: "Eikliveien, Hønefoss", street: "Osloveien", streetNumber: "1", points: 4, open24h:true, free: false, maxTime: 8, is: ""}
        ];

    },

    tearDown: function() {
        delete this.objs;
    },


    "autosave on put localStorage - when read, number of objects should be 6, creator should be same as name and timestamp a number": function(done) {
        var conf = {
            name : 'test',
            type : 'local'
        };

        var db = yocto.db({autosave : conf});

        db.put(this.objs, function(objs) {
            var data = window['localStorage'].getItem(conf.name);
            var dataParsed = JSON.parse(data);
            buster.assert.equals(dataParsed.creator, conf.name);
            buster.assert.isNumber(dataParsed.timestamp);
            buster.assert.equals(dataParsed.objects.length, 6);
            window['localStorage'].removeItem(conf.name);
            done();
        });
    },


    "autosave on put sessionStorage - when read, number of objects should be 6, creator should be same as name and timestamp a number": function(done) {
        var conf = {
            name : 'test',
            type : 'session'
        };

        var db = yocto.db({autosave : conf});

        db.put(this.objs, function(objs) {
            var data = window['sessionStorage'].getItem(conf.name);
            var dataParsed = JSON.parse(data);
            buster.assert.equals(dataParsed.creator, conf.name);
            buster.assert.isNumber(dataParsed.timestamp);
            buster.assert.equals(dataParsed.objects.length, 6);
            window['sessionStorage'].removeItem(conf.name);
            done();
        });
    },


    "autosave on take localStorage - when read, number of objects should be 5, creator should be same as name and timestamp a number": function(done) {
        var conf = {
            name : 'test',
            type : 'local'
        };

        var db = yocto.db({autosave : conf});

        db.put(this.objs, function(objs) {
            var data = window['localStorage'].getItem(conf.name);
            var dataParsed = JSON.parse(data);
            buster.assert.equals(dataParsed.creator, conf.name);
            buster.assert.isNumber(dataParsed.timestamp);
            buster.assert.equals(dataParsed.objects.length, 6);
        });

        db.take({id: "NOR_00481"}, function(objs) {
            var data = window['localStorage'].getItem(conf.name);
            var dataParsed = JSON.parse(data);
            buster.assert.equals(dataParsed.creator, conf.name);
            buster.assert.isNumber(dataParsed.timestamp);
            buster.assert.equals(dataParsed.objects.length, 5);
            window['localStorage'].removeItem(conf.name);
            done();
        });
    },


    "autosave on take sessionStorage - when read, number of objects should be 5, creator should be same as name and timestamp a number": function(done) {
        var conf = {
            name : 'test',
            type : 'session'
        };

        var db = yocto.db({autosave : conf});

        db.put(this.objs, function(objs) {
            var data = window['sessionStorage'].getItem(conf.name);
            var dataParsed = JSON.parse(data);
            buster.assert.equals(dataParsed.creator, conf.name);
            buster.assert.isNumber(dataParsed.timestamp);
            buster.assert.equals(dataParsed.objects.length, 6);
        });

        db.take({id: "NOR_00481"}, function(objs) {
            var data = window['sessionStorage'].getItem(conf.name);
            var dataParsed = JSON.parse(data);
            buster.assert.equals(dataParsed.creator, conf.name);
            buster.assert.isNumber(dataParsed.timestamp);
            buster.assert.equals(dataParsed.objects.length, 5);
            window['sessionStorage'].removeItem(conf.name);
            done();
        });
    }

});