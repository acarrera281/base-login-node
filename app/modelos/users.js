const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');  //cifrado de claves

const userSchema = new mongoose.Schema({
  local: {
    nombre: String,
    apellido: String,
    rut: String,
    tipo_rut: String,
    email: String,
    password: String,
    fecha_nac: Date,
    sexo: String,
    //banco: String,
    //num_cta: String,
    //tipo_cta: String,
    //email_banco: String,
    //comision: { type: Number, default: 0 },
    //status:{ type: String, default: 'Pendiente'}
  }
});

// " MEtodo que Recibe clave usuario y retorna el cifrado de la clave"
userSchema.methods.generateHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// "Valida la contraseña del usuario"
userSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.local.password);
};

// Declaracion del modelo de bd
module.exports = mongoose.model('User', userSchema);