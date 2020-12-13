const mongoose = require('mongoose');
const { model } = require('./reserva');

const Schema = mongoose.Schema;
const TokenSchema = new Schema({
    _userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Usuario' },
    token: { type: String, required: true },
    createdAt: { type: Date, required: true, default: Date.now, expired: 43200 }
})

module.exports = mongoose.model('Token', TokenSchema);