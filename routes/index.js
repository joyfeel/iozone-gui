var express = require('express');
var router = express.Router();

//var d3 = require('d3');

var iozone = require('./modules/iozone-parser.js');
var registerEmmc = require('./modules/register-emmc.js');
var getEmmc = require('./modules/get-emmc.js');

//res.status(200).json({status:"ok"});
//res.status(500).json({status:"not ok"})


router.post('/iozone-register', function(req, res, next) {
    console.log("Register...");

    return registerEmmc.store(req, res);
});

//front-end to back-end
router.get('/iozone-input', function(req, res, next) {
    console.log("Get the data from db to generate the emmc & flash field");
    //return res.status(200).json({status:"ok"});  

    return getEmmc.get(req, res);
});


//front-end to back-end
router.post('/iozone-input', function(req, res, next) {
    console.log("Press save");
    return iozone.process (req, res);  
});


//back-end to front-end
router.get('/iozone-report', function(req, res, next) {

/*
    return iozone.process (req.body, res, function() {
        res.send ();
    });  
*/
    res.send([{
        reportname: 'Test case 1',
        description: 'This is an urgent case',
        testmode: 'write/re-write',
        filesize: '128m',
        recordsize: '512k',
        data:[  
          [6, 20],
          [490, 90],
          [250, 50],
          [100, 33],
          [330, 95],
          [410, 12],
          [475, 44],
          [25, 67],
          [85, 21],
          [220, 88],
          [500, 150]
        ]
    },{
        reportname: 'Test case 2',
        description: 'This is an urgent case',
        testmode: 'write/re-write',
        filesize: '128m',
        recordsize: '512k',
        data:[  
          [5, 20],
          [490, 90],
          [250, 50],
          [100, 33],
          [330, 95],
          [410, 12],
          [475, 44],
          [25, 67],
          [85, 21],
          [220, 88],
          [500, 150]
        ]
    },{
        reportname: 'Test case 1',
        description: 'This is an urgent case',
        testmode: 'write/re-write',
        filesize: '128m',
        recordsize: '512k',
        data:[  
          [5, 20],
          [490, 90],
          [250, 50],
          [100, 33],
          [330, 95],
          [410, 12],
          [475, 44],
          [25, 67],
          [85, 21],
          [220, 88],
          [500, 150]
        ]
    },{
        reportname: 'Test case 1',
        description: 'This is an urgent case',
        testmode: 'write/re-write',
        filesize: '128m',
        recordsize: '512k',
        data:[  
          [5, 20],
          [490, 90],
          [250, 50],
          [100, 33],
          [330, 95],
          [410, 12],
          [475, 44],
          [25, 67],
          [85, 21],
          [220, 88],
          [500, 150]
        ]
    },{
        reportname: 'Test case 1',
        description: 'This is an urgent case',
        testmode: 'write/re-write',
        filesize: '128m',
        recordsize: '512k',
        data:[  
          [5, 20],
          [490, 90],
          [250, 50],
          [100, 33],
          [330, 95],
          [410, 12],
          [475, 44],
          [25, 67],
          [85, 21],
          [220, 88],
          [500, 150]
        ]
    }])
    /*
    res.json({
        reportname: 'Carol',
        description: 'Unitssss',
        filesize: '2048',
        data:[  
          [5, 20],
          [490, 90],
          [250, 50],
          [100, 33],
          [330, 95],
          [410, 12],
          [475, 44],
          [25, 67],
          [85, 21],
          [220, 88],
          [600, 150]
        ],
        testmode: 'Xyxd'
    },{
        reportname: 'XDDDD',
        description: 'Unit123132ssss',
        filesize: '2048',
        data:[  
          [5, 20],
          [490, 90],
          [250, 50],
          [100, 33],
          [330, 95],
          [410, 12],
          [475, 44],
          [25, 67],
          [85, 21],
          [220, 88],
          [600, 150]
        ],
        testmode: 'Xyxd'
    });
    */
});

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