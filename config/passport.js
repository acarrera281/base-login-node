const LocalStrategy = require('passport-local').Strategy;

const User = require('../app/modelos/users');

module.exports = function (passport) {  //recibe el logueo del usuario y guarda los datos para no pedirlos a cada momento

  passport.serializeUser(function (user, done) {  //recibe los datos del usuario
    done(null, user.id);
  });

  // used to deserialize user
  passport.deserializeUser(function (id, done) {  //recibe el ide y lo busca en la base de datos para verificar el registro del usaurio
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });

  // login
  passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  function (req, email, password, done) {
    User.findOne({'local.email': email}, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, req.flash('loginMessage', 'El usuario no existe'))
      }
      if (!user.validPassword(password)) {
        return done(null, false, req.flash('loginMessage', 'Clave invalida'));
      }
      return done(null, user);
    });
  }));
}