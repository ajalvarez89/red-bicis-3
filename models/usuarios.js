var mongoose = require('mongoose');
var uniquieValidator = require('mongoose-unique-validator');
var Reserva = require('./reserva');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const saltRounds = 10; //aleatoriedad 

const Token = require('../models/token');
const mailer = require('../mailer/mailer')
var Schema = mongoose.Schema;

const validateEmail = function(email) {
    const re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    return re.test(email);
}

var usuarioSchema = new Schema({
    nombre: {
        type: String,
        trim: true, //saca los espacios vacios al principio y el final
        required: [true, 'El nombre es obligatorio']
    },
    email: {
        type: String,
        trim: true,
        required: [true, 'El email es obligatorio'],
        lowercase: true,
        unique: true,
        validate: [validateEmail, 'Por favor ingrese un mail valido'],
        match: [/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i]
    },
    password: {
        type: String,
        required: [true, 'El password es obligatorio']
    },
    passwordResetToken: String,
    passwordResetTokenExpires: Date,
    verificado: {
        type: Boolean,
        default: false
    }
});

usuarioSchema.plugin(uniquieValidator, { message: 'El {PATH} ya existe' });

//antes de hacer el save se ejecuta la funcion
usuarioSchema.pre('save', function(next) {
    if (this.isModified('password')) {
        this.password = bcrypt.hashSync(this.password, saltRounds)
    }
    next();
})

usuarioSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
}

usuarioSchema.methods.reservar = function(biciId, desde, hasta, cb) {
    var reserva = new Reserva({ usuario: this._id, bicicleta: biciId, desde: desde, hasta: hasta });
    console.log(reserva);
    reserva.save(cb);
}

usuarioSchema.methods.enviar_email_bienvenida = function(cb) {
    const token = new Token({ _userId: this.id, token: crypto.randomBytes(16).toString('hex') });
    const email_destination = this.email;
    token.save(function(err) {
        if (err) { return console.log(err.message); }

        const mailOptions = {
            from: 'no-reply@redbicicletas.com',
            to: email_destination,
            subject: 'Verificacion de cuenta',
            text: 'Hola, \n\n' + 'Por favor, para verificar su cuenta haga clic en este link\n' + 'http://localhost:3000' + '\/token/confirmation\/' + token.token + '.\n'
        };

        mailer.sendMail(mailOptions, function(err, info) {
            if (err) { return console.log('Ocurrio un error ' + err.message); }
            console.log('se ha enviado un email de bienvenida a: ' + email_destination)
        });
    });
}
usuarioSchema.methods.resetPassword = function(cb) {
    const token = new Token({ _userId: this.id, token: crypto.randomBytes(16).toString('hex') });
    const email_destination = this.email;
    token.save(function(err) {
        if (err) { return cb(err) }

        const mailOptions = {
            from: 'no-reply@redbicicletas.com',
            to: email_destination,
            subject: 'Reseteo de password',
            text: 'Hola, \n\n' + 'Por favor, para verificar su cuenta haga clic en este link\n' + 'http://localhost:3000' + '\/resetPassword\/' + token.token + '.\n'
        };

        mailer.sendMail(mailOptions, function(err) {
            if (err) { return cb(err) }
            console.log('se ha enviado un mail recuperacion a: ' + email_destination)
        });

    });
}
module.exports = mongoose.model('Usuario', usuarioSchema);