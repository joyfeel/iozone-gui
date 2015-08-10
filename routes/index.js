var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  
  /*
  res.render('main', { title: 'Express',
  					    description: 'My first app!!!!'
            });
  */

  res.redirect('/public/index.html');
});


router.get('/about', function(req, res, next) {
  res.render('main', { 
  				      title: 'About1',
  					   	subtitle: 'About subtitle1',
  					   	description: 'About practice1'
  					});
});


router.get('/contact', function(req, res, next) {
  res.render('contact', { 
  					    title: 'Contact us',
  							description: 'Send us the email, plz!'
  					});
});

router.get('/chatroom', function(req, res, next) {
    res.render('chatroom');
});

module.exports = router;