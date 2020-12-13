var Bicicleta = require('../../models/bicicleta');
var request = require('request');
var server = require('../../bin/www');

describe('Bicicleta API', () => {

    afterEach(function(done) {
        Bicicleta.deleteMany({}, function(err, success) {
            if (err) console.log(err);
            done(err);
        });
    });

    describe('GET BICICLETAS /', () => {
        it('Status 200', (done) => {

            Bicicleta.allBicis(function(err, bicis) {
                if (err) console.log(err);
                expect(bicis.length).toBe(0);

                var bici = Bicicleta.createInstance(1, "verde", "urbana", [-34.5, -54.1]);
                //var bici2 = Bicicleta.createInstance(2, "roja", "montaña", [-34.5, -54.1]);

                Bicicleta.add(bici, function(err) {
                    if (err) console.log(err)
                    request.get('http://localhost:3000/api/bicicletas', function(error, response, body) {
                        expect(response.statusCode).toBe(200);
                        done();
                    });
                });
            });
        });
    });

    describe('POST BICICLETAS /create', () => {
        it('Status 200', (done) => {
            var headers = { 'Content-Type': 'application/json' };
            var aBici = '{"code": 1,"color": "rojo", "modelo": "urbana","lat": -38.961204, "lng": -68.240558}';
            request.post({
                headers: headers,
                url: 'http://localhost:3000/api/bicicletas/create',
                body: aBici
            }, function(error, response, body) {
                console.log(body)
                expect(response.statusCode).toBe(200);
                done();
            })
        });
    });

    describe('DELETE BICICLETA /delete', () => {
        it('Status 204', (done) => {
            Bicicleta.allBicis(function(err, bicis) {
                if (err) console.log(err);
                expect(bicis.length).toBe(0);

                var bici = Bicicleta.createInstance(1, "verde", "urbana", [-38.961204, -68.240558]);
                Bicicleta.add(bici, function(err) {
                    if (err) console.log(err)
                    var headers = { 'Content-Type': 'application/json' };
                    var aBici = '{"code": 1}';
                    request.delete({
                        headers: headers,
                        url: 'http://localhost:3000/api/bicicletas/delete',
                        body: aBici
                    }, function(error, response, body) {
                        expect(response.statusCode).toBe(204);
                        done();
                    });
                });
            });
        });
    });

    describe('UPDATE Bicleta /:code/update', () => {
        it('Status 200', (done) => {
            Bicicleta.allBicis(function(err, bicis) {
                if (err) console.log(err);
                expect(bicis.length).toBe(0);
                var bici = Bicicleta.createInstance(1, "verde", "urbana", [-38.961204, -68.240558]);

                Bicicleta.add(bici, function(err) {
                    var headers = { 'Content-Type': 'application/json' };
                    var body = '{"code": 1,"color": "verde", "modelo": "montaña","lat": -38.961204, "lng": -68.240558}';
                    var url = 'http://localhost:3000/api/bicicletas/1/update';

                    request.post({
                        headers: headers,
                        body: body,
                        url: url
                    }, function(err, response, bici) {
                        expect(response.statusCode).toBe(200);
                        console.log(bici)
                        expect(JSON.parse(bici).color).toBe('verde');
                        expect(JSON.parse(bici).modelo).toBe('montaña');
                        done();
                    });
                });

            });
        })
    })

    //HACER DELETE y UPDATE
});