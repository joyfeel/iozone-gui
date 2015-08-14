var child_process = require('child_process');
XLSX = require('xlsx');

function execute (req_body) {
    child_process.exec("iozone3_430_Native/iozone -a -i 0 -s " 
                        + req_body.filesize
                        + " -Rab 123.xls",
                          function(error, stdout, stderr) {
                              console.log('stdout: ' + stdout);
                              console.log('stderr: ' + stderr);
                              if (error !== null) {
                                  console.log('exec error: ' + error);
                                  res.status(500).send({
                                      success: false,
                                      error: true
                                  }); 
                              } else {
                              	//var workbook = XLSX.readFile('123.xls', {type:"binary"});
								//var obj = xlsx.parse('123.xls'); // parses a file
								//console.log(workbook);
								//console.log(JSON.stringify(workbook));
                              }
                          });


    
}

function xls_parser () {


}


exports.execute = execute;