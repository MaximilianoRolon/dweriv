var express = require('express');
var router = express.Router();

// Get Homepage
router.get('/',checkAuthentication, function(req, res){
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
    	req.flash('error_msg','No has iniciado sesion en dweriv');
        res.redirect('/users/login');
    }
}

module.exports = router;