var Bicicleta = require('../../models/bicicleta');

exports.bicicleta_list = function(req, res) {

    Bicicleta.allBicis(function(err, bicis) {
        if (err) console.log(err);
        res.status(200).json(bicis);
    })
}

exports.bicicleta_create = function(req, res) {
    var bici = new Bicicleta({
        code: req.body.code,
        color: req.body.color,
        modelo: req.body.modelo,
        ubicacion: [req.body.lat, req.body.lng]
    });
    console.log(bici);
    bici.save(function(err) {
        if (err) console.log(err);
        res.status(200).json(bici);
    });

}

exports.bicicleta_delete = function(req, res) {

    Bicicleta.removeByCode(req.body.code, function(err) {
        if (err) console.log(err);
        res.status(204).send();
    })
}

exports.bicicleta_update = function(req, res) {

    Bicicleta.findByCode(req.params.code, function(err, bici) {
        if (err) console.log(err);
        bici.code = req.body.code;
        bici.color = req.body.color;
        bici.modelo = req.body.modelo;
        bici.ubicacion = [req.body.lat, req.body.lng];
        bici.save(function(err) {
            if (err) console.log(err);
            res.status(200).json(bici);
        })

    })
}