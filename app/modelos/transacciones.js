const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');  //cifrado de claves

const transaccionSchema = new mongoose.Schema({
  transacciones: {
    idtrx: {
    	type: Number,
        autoIncrement: true,
        //primaryKey: true
    },
    monto: Number,
    tipoMoneda: String,
    detalle: String,
    comercio: String,
    idReferidor: String,
    fechaTransaccion: Date,
    status:{ type: String, default: 'N'}
  }
});

// Declaracion del modelo de bd
module.exports = mongoose.model('transaccion', transaccionSchema);