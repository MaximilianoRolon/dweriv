var express = require('express');
var User = require('../models/user');
var router = express.Router();

// Get Homepage
router.get('/',checkAuthentication, function(req, res){
    // console.log(User.getUserByUsername(""));
	if(req.user){
		res.render('index');
	}else{
		res.render('login')
	}
});

function checkAuthentication(req,res,next){
    if(req.isAuthenticated()){
        //if user is looged in, req.isAuthenticated() will return true 
        next();
    } else{
    	req.flash('error_msg','Inicia sesion en dweriv para ingresar a esta pagina');
        res.redirect('/users/login');
    }
}

module.exports = router;