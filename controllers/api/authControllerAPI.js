const Usuario = require('../../models/usuarios');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = {
    authenticate: function(req, res, next) {
        Usuario.findOne({ email: req.body.email }, function(err, userInfo) {
            if (err) {
                next(err);
            } else {
                if (userInfo === null) {
                    return res.status(401).json({ status: 'error', message: 'Invaludo email/password', data: null })
                }
                if (userInfo != null && bcrypt.compareSync(req.body.password, userInfo.password)) {
                    //generamos el token con jwt
                    const token = jwt.sign({ id: userInfo._id }, req.app.get('secretKey'), { expiresIn: '7d' });
                    res.status(200).json({ message: 'usuario encontrado', data: { usuario: userInfo, token: token } });
                } else {
                    res.status(401).json({ status: 'error', message: 'Invalido email/password', data: null });
                }
            }
        });
    },

    forgotPassword: function(req, res, next) {
        Usuario.findOne({ email: req.body.email }, function(err, usuario) {
            if (!usuario) return res.status(401).json({ message: 'No existe el usuario', data: null });
            usuario.resetPassword(function(err) {
                if (err) {
                    return next(err);
                }
                res.status(200).json({ message: "se envio un mail para reestablecer el password", data: null })
            })
        })
    }

}