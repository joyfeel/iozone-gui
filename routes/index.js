var express = require('express');
var router = express.Router();
var child_process = require('child_process');

/* GET home page. */
router.get('/', function(req, res, next) {
  
  /*
  res.render('main', { title: 'Express',
  					    description: 'My first app!!!!'
            });
  */

    res.redirect('/public/index.html');
});


router.get('/chatroom', function(req, res, next) {
    res.render('chatroom');
});

router.get('/iozone-input', function(req, res, next) {

    res.json({
        name: 'Carol',
        email: 'kappacha@gmail.com',
        message: 'Unitssss',
        filesize: '2048',
        data:[3, 3, 4, 5, 6, 7, 8]
    });

});

router.post('/iozone-input', function(req, res, next) {
    /*
    var iozone 
    = child_process.spawn('./iozone3_430_Native/iozone', ['-a', '-i 0', '-s ' + req.body.filesize]);
    */
    console.log(req.body.name);
    console.log(req.body.email);
    console.log(req.body.message);
    console.log(req.body.filesize);


    child_process.exec("./iozone3_430_Native/iozone -a -i 0 -s " + req.body.filesize,
                          function(error, stdout, stderr) {
                              console.log('stdout: ' + stdout);
                              console.log('stderr: ' + stderr);
                              if (error !== null) {
                                  console.log('exec error: ' + error);
                                  res.status(500).send({
                                      success: false,
                                      error: true
                                  }); 
                              }
                          });

/*
    iozone.stdout.on('data', function(data) {
        console.log('stdout: ' + data);
    });

    iozone.stderr.on('data', function(data) {
        console.log('stderr: ' + data);
    });

    iozone.on('exit', function(code) {
        console.log('child process exited with code ' + code);
    });
*/  
    console.log('Non-blocking!!!!!!!');
    console.log('Non-blocking!!!!!!!');

    res.status(200).send({
        success: true,
        error: false
    });

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