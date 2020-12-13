var mongoose = require('mongoose');
var Bicicleta = require('../../models/bicicleta');

describe('Testing Bicicletas', function() {

    beforeAll(function(done) {
        var mongoDB = 'mongodb://localhost/testdb';
        mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

        const db = mongoose.connection;
        db.on('error', console.error.bind(console, 'conection error'));
        db.once('open', function() {
            console.log('We are connected to test database');
            done();
        });
    });

    afterEach(function(done) {
        Bicicleta.deleteMany({}, function(err, success) {
            if (err) console.log(err);
            done(err);
        });
    });

    describe('Bicicleta.createInstance', () => {
        it('crea una instancia de Bicicleta', () => {
            var bici = Bicicleta.createInstance(1, "verde", "urbana", [-34.5, -54.1]);

            expect(bici.code).toBe(1);
            expect(bici.color).toBe("verde");
            expect(bici.modelo).toBe("urbana");
            expect(bici.ubicacion[0]).toBe(-34.5);
            expect(bici.ubicacion[1]).toBe(-54.1);
        })
    });

    describe('Bicicletas.allBicis', () => {
        it('comieza vacia', (done) => {
            Bicicleta.allBicis(function(err, bicis) {
                expect(bicis.length).toBe(0);
                done(err);
            });
        });
    });

    describe('Bicicletas.add', () => {
        it('agrega solo una bici', (done) => {
            var aBici = new Bicicleta({ code: 1, color: "verde", modelo: "urbana" });
            Bicicleta.add(aBici, function(err, newBici) {
                if (err) console.log(err);
                Bicicleta.allBicis(function(err, bicis) {
                    expect(bicis.length).toEqual(1);
                    expect(bicis[0].code).toEqual(aBici.code);
                    done(err);
                });
            });
        });
    });

    describe('Bicicleta.findByCode', () => {
        it('debe devolver la bici con code 1', (done) => {
            Bicicleta.allBicis(function(err, bicis) {
                expect(bicis.length).toBe(0);

                var aBici = new Bicicleta({ code: 1, color: "verde", modelo: "urbana" });
                Bicicleta.add(aBici, function(err, newBici) {
                    if (err) console.log(err);

                    var aBici2 = new Bicicleta({ code: 2, color: "roja", modelo: "urbana" });
                    Bicicleta.add(aBici2, function(err, newBici) {
                        if (err) console.log(err);
                        Bicicleta.findByCode(1, function(err, targetBici) {
                            expect(targetBici.code).toBe(aBici.code);
                            expect(targetBici.color).toBe(aBici.color);
                            expect(targetBici.modelo).toBe(aBici.modelo);

                            done(err);
                        });
                    });
                });
            });
        });
    });
    //Hacer removeByCode 

    describe('Bicicleta.removeByCode', () => {
        it('debe eliminar la bici con code 1', (done) => {
            Bicicleta.allBicis(function(err, bicis) {
                expect(bicis.length).toBe(0);

                var aBici = new Bicicleta({ code: 1, color: "verde", modelo: "urbana" });
                Bicicleta.add(aBici, function(err, newBici) {
                    if (err) console.log(err);

                    var aBici2 = new Bicicleta({ code: 2, color: "roja", modelo: "urbana" });
                    Bicicleta.add(aBici2, function(err, newBici) {

                        if (err) console.log(err);
                        Bicicleta.removeByCode(2, function(err) {
                            Bicicleta.allBicis(function(err, bicicletas) {
                                expect(bicicletas.length).toBe(1);
                                done(err);
                            })
                        });
                    });
                });
            });
        });
    });
});