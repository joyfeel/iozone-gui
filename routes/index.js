var express = require('express');
var router = express.Router();


var iozone = require('./modules/iozone-parser.js');


/* GET home page. */
router.get('/', function(req, res, next) {
  
    /*
    res.render('main', { title: 'Express',
    					    description: 'My first app!!!!'
            });
    */

    res.redirect('/public/index.html');
});


//front-end to back-end
router.post('/iozone-input', function(req, res, next) {
    //1.exec iozone
    //2.save the data to csv
    //3.
    //console.log(res);

    return iozone.process (req.body, res);  

    //console.log('Non-blocking!!!!!!!');

/*
    res.status(200).send({
        success: true,
        error: false
    });
*/
});


router.get('/iozone-input', function(req, res, next) {
    res.json({
        name: 'Carol',
        email: 'kappacha@gmail.com',
        message: 'Unitssss',
        filesize: '2048',
        data:[  
          {x:0, y:100}, 
          {x:10, y:154}, 
          {x:20, y:288}, 
          {x:30, y:187}, 
          {x:40, y:235}, 
          {x:50, y:198}, 
          {x:60, y:172}, 
          {x:70, y:134}, 
          {x:80, y:94}, 
          {x:90, y:88}
        ]
    });
});


router.get('/chatroom', function(req, res, next) {
    res.render('chatroom');
});


router.post('/123/contact/1', function(req, res, next) {
  console.log("backend 1@@!!!");
  
  console.log(req.body.name);
  console.log(req.body.email);
  console.log(req.body.message);

  res.render('contact', { 
  					    name: req.body.name,
  						email: req.body.email,
                        message: req.body.message
  					});
  
  console.log("backend 2!!!");
});

router.get('/chatroom', function(req, res, next) {
    res.render('chatroom');
});

module.exports = router;