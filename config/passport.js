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

  // Signup
  passport.use('local-signup', new LocalStrategy({  //Este es el metodo que permite registrar el usuario
    usernameField: 'userid',
    passwordField: 'password',
    passReqToCallback : true 
  },
  function (req, userid, password, done) {  //permite la  busqueda del registro para ver si esta previamente guardado, de lo contrario lo ingresa
    User.findOne({'local.userid': userid}, function (err, user) {
      if (err) {
        return done(err);
      }
      if (user) {
        return done(null, false, req.flash('signupMessage', 'El usuario ya existe'));
      } else {
        var newUser = new User();
        newUser.local.userid = userid;
        newUser.local.password = newUser.generateHash(password);
        newUser.save(function (err) {   //una vez que lo ingresa, procede a guardar el registro
          if (err) { throw err; }
          return done(null, newUser);
        });
      }
    });
  }));

  // login
  passport.use('local-login', new LocalStrategy({
    usernameField: 'userid',
    passwordField: 'password',
    passReqToCallback: true
  },
  function (req, userid, password, done) {
    User.findOne({'local.userid': userid}, function (err, user) {
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