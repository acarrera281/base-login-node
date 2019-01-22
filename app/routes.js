var Usuario = require('./modelos/users');

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

	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect: '/profile',
		failureRedirect: '/signup',
		failureFlash: true // allow flash messages
	}));

	app.get('/profile', isLoggedIn, (req, res) => {
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
    
    app.post('/edit/:id/:userid',(req,res)=>{
				  var id = req.params.id
				  var userid = req.body.userid;
				  console.log("entro");
				  console.log(userid);

				  // Validamos que nombre o descripcion no vengan vacíos
				  if ((userid=== '')) {
				    console.log('ERROR: Campos vacios')
				    return res.send('Hay campos vacíos, revisar')
				  }
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
				      usuarios.local.userid   = userid
				      usuarios.save(onSaved)
				    }
				  }

				  function onSaved (err) {
				    if (err) {
				      console.log(err)
				      return next(err)
				    }
				    return res.redirect('/edit/' + id)
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