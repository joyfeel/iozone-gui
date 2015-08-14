var child_process = require('child_process');

function test (req_body) {
    child_process.exec("./iozone3_430_Native/iozone -a -i 0 -s " 
                        + req_body.filesize
                        + " -Rab out.wks",
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
	child_process.exec("./iozone3_430_Native/iozone -a -i 0 -s"
						+ req_body.filesize 
						+ " -Rab QQQQQ.wks",
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
*/
}


exports.test = test;