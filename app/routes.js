var Usuario = require('./modelos/users');
var Transaccion = require('./modelos/transacciones');

const LocalStrategy = require('passport-local').Strategy;

module.exports = (app, passport)=>{
	
	//Direccionamiento a la vista principal
	app.get('/',(req,res)=>{
		res.render('index');
	});

	//direccionamiento a la vista para loguear usuarios
	app.get('/login', (req, res) => {
		//res.render('login', {
		//	message: req.flash('loginMessage')
		//});
		res.render('login');
	});

	app.post('/login', passport.authenticate('local-login', {  
		successRedirect: '/profile',
		failureRedirect: '/login',
		failureFlash: true
	}));

	app.get('/signup', (req, res) => {
		res.render('signup', {
			message: req.flash('signupMessage')
		});
		//res.render('signup');
	});

	/*app.post('/signup', passport.authenticate('local-signup', {
		successRedirect: '/profile',
		failureRedirect: '/signup',
		failureFlash: true // allow flash messages
	}));*/

	app.post('/signup', function(req, res){

        var nombre = req.body.nombre;
        var apellido = req.body.apellido;
        var rut = req.body.rut;
        var tipo_rut = req.body.tipo_rut;
        var email = req.body.email;
        var fecha_nac = req.body.fecha_nac;
        var sexo = req.body.sexo;
        var banco = req.body.banco;
        var num_cta = req.body.num_cta;
        var tipo_cta = req.body.tipo_cta;
        var email_banco = req.body.email_banco;
        var password = req.body.password;
        if ((nombre=== '')||(apellido=== '')||(rut=== '')||(tipo_rut=== '')||(email=== '')||(password=== '')||(fecha_nac=== '')) {
				    console.log('ERROR: Campos vacios')
				    return res.send('Hay campos vacíos, revisar')
		}
        Usuario.findOne({'local.email': email}, function (err, user) {
			      if (err) {
			      	console.log("entro en ERROR");
			        return(err);
			      }
			      if (user) {
			        return(req.flash('signupMessage', 'El usuario ya existe'));
			      } else {
			      	var newUser = new Usuario();
			        newUser.local.nombre = nombre;
			        newUser.local.apellido = apellido;
			        newUser.local.rut = rut;
			        newUser.local.tipo_rut = tipo_rut;
			        newUser.local.email = email;
			        newUser.local.fecha_nac = fecha_nac;
			        newUser.local.sexo = sexo;
			        newUser.local.banco = banco;
			        newUser.local.num_cta = num_cta;
			        newUser.local.tipo_cta = tipo_cta;
			        newUser.local.email_banco = email_banco;
			        newUser.local.password = newUser.generateHash(password);
			        newUser.save(function (done) {   //una vez que lo ingresa, procede a guardar el registro
			          res.redirect('/profile');
			        });
			      }
		    });
	});

	app.get('/register/transaccion', (req, res) => {
		res.render('transaccion', {
			message: req.flash('signupMessage')
		});
		//res.render('signup');
	});

	app.post('/register/transaccion', function(req, res){

        var monto = req.body.monto;
        var tipoMoneda = req.body.tipoMoneda;
        var detalle = req.body.detalle;
        var comercio = req.body.comercio;
        var referidor = req.body.referidor;
        var fechaTransaccion = req.body.fechaTransaccion;
        
        var newTransaccion = new Transaccion();
			newTransaccion.transacciones.monto = monto;
			newTransaccion.transacciones.tipoMoneda = tipoMoneda;
			newTransaccion.transacciones.detalle = detalle;
			newTransaccion.transacciones.comercio = comercio;
			newTransaccion.transacciones.referidor = referidor;
			newTransaccion.transacciones.fechaTransaccion = fechaTransaccion;
			newTransaccion.save(function (done) {   //una vez que lo ingresa, procede a guardar el registro
			    res.redirect('/');
			});
    });

	app.get('/profile', isLoggedIn, (req, res) => {
		console.log("entro a profile");
		console.log(req.user);
		res.render('profile', {
			user: req.user
		});
	});

	app.get('/logout', (req, res) => {
		req.logout();
		res.redirect('/');
	});

	app.get('/list', (req, res) => {
		Usuario.find(gotUsers)
  		function gotUsers (err, usuarios) {
    		if (err) {
      		console.log(err)
      		return next()
    	}
    	return res.render('list', {title: 'Lista de Usuarios', usuarios: usuarios});
  		}
	});

	app.get('/edit/:id',(req,res)=>{
		// Obtención del parámetro id desde la url
  		var id = req.params.id
  		Usuario.findById(id, gotUsers)
		function gotUsers (err, usuarios) {
	    	if (err) {
	      		console.log(err)
	      		//return next(err)
	    	}
	    	return res.render('edit', {title: 'Usuario', usuarios: usuarios})
  		}
  	});
    
    app.post('/edit/:id/:comision',(req,res)=>{
				  var comision = req.body.comision;
				  var id = req.body.id;
				  console.log("entro a comision");
				  console.log(comision);
				  console.log(id);
				  Usuario.findById(id, gotUsers)

				  function gotUsers (err, usuarios) {
				    if (err) {
				      console.log(err)
				      return next(err)
				    }
				    if (!usuarios) {
				      console.log('ERROR: ID no existe')
				      return res.send('ID Inválida!')
				    } else {
				      usuarios.local.comision   = comision,
				      usuarios.local.status     = 'OK'
				      usuarios.save(onSaved)
				    }
				  }

				  function onSaved (err) {
				    if (err) {
				      console.log(err)
				      return next(err)
				    }
				    return res.redirect('/list');
				    //return res.redirect('/edit/' + id)
				  }
	});

	app.get('/delete/:id',(req,res)=>{
	  	var id = req.params.id

	  	Usuario.findById(id, gotUsers)

	  	function gotUsers (err, usuarios) {
	    	if (err) {
	      	console.log(err)
	      	return next(err)
	    	}

			    if (!usuarios) {
			      return res.send('Invalid ID. (De algún otro lado la sacaste tú...)')
			    }

			    // Tenemos el producto, eliminemoslo
			    usuarios.remove(onRemoved)
			  }

			  function onRemoved (err) {
			    if (err) {
			      console.log(err)
			      return next(err)
			   }

			    return res.redirect('/')
			  }
	});

				  
};

function isLoggedIn (req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}

	res.redirect('/');

};