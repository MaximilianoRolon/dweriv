var express = require('express');
var User = require('../models/user');
var router = express.Router();
var passport = require("passport");
var localStrategy = require("passport-local").Strategy;

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
		var newUser = new User({
			name: name,
			email: email,
			username: username,
			password: password
		});
		User.createUser(newUser, function(err, newUser){
			if(err) throw err;
			console.log(newUser);
		});
		req.flash('success_msg', 'Se ha registrado exitosamente y ya puede loguearse con su nueva cuenta');
		res.redirect('/users/login');
	}
});

passport.use(new localStrategy(
  function(username, password, done) {
  	User.getUserByUsername(username, function(error, user){
  		if (error) throw error;
  		if (!user){
  				return done(null, false, {message: 'Usuario desconocido'})
  		}
  		User.comparePassword(password, user.password, function(error, isMatch){
  			if(error) throw error;
  			if(isMatch){
  				return done(null, user);
  			}else{
  				return done(null, false, {message: 'Contraseña incorrecta'});
  			}
  		});
  	});
  }));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

router.post('/login', passport.authenticate('local', {successRedirect:"/", failureRedirect:"/users/login", failureFlash: true}),
	function(req, res) {
		res.redirect('/');
	});

router.get('/logout', function(req, res){
	req.logout();
	req.flash('success_msg', 'Sesion terminada');
	res.redirect('/users/login');
});

module.exports = router;