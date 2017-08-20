var express = require('express');
var router = express.Router();

// Get register
router.get('/register', function(req, res){
	res.render('register');
});

// Get login
router.get('/login', function(req, res){
	res.render('login');
});

// Post register
router.post('/register', function(req, res){
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;

	// Validation
	req.checkBody('name', 'Es necesario completar el campo nombre').notEmpty();
	req.checkBody('email', 'Es necesario completar el campo email').notEmpty();
	req.checkBody('email', 'El email ingresado no es valido').isEmail();
	req.checkBody('username', 'Es necesario completar el campo usuario').notEmpty();
	req.checkBody('password', 'Es necesario completar el campo password').notEmpty();
	req.checkBody('password2', 'Las contraseñas no coinciden').equals(req.body.password);

	var errors = req.validationErrors();
	if (errors) {
		res.render('register', {
			errors:errors
		});
	}else{
		console.log("No hay errores");
	}
});

module.exports = router;