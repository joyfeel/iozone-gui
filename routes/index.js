var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('main', { title: 'Express',
  					    description: 'My first app!!!!'
            });
});


router.get('/about', function(req, res, next) {
  res.render('main', { 
  				      title: 'About',
  					   	subtitle: 'About subtitle',
  					   	description: 'About practice'
  					});
});


router.get('/contact', function(req, res, next) {
  res.render('contact', { 
  					    title: 'Contact us',
  							description: 'Send us the email, plz!'
  					});
});

router.get('/practice', function(req, res, next) {
    res.render('practiceBackbone');
});

module.exports = router;