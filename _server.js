/*
var http = require("http");


function onRequest(request, response) {
  response.writeHead(200, {"Content-Type": "text/html"});
  if (request.url != '/favicon.ico') {
	  console.log(request.url);
      response.write(request.url);
  }
  response.end();
}


http.createServer(onRequest).listen(8888);

console.log("Server has started.");
*/

var http = require('http');
var fs = require('fs');


http.createServer(function(req, res){

}).listen(8888);


/*
http.createServer(function(request, response) {  
	var reqURL = request.url;
    reqURL = reqURL.substring(1);	
	if (reqURL != 'favicon.ico') {
	  console.log(reqURL);
	  if (reqURL == '') reqURL = 'index.html';
      if (reqURL != 'internal/index.html') {
	    response.writeHeader(200, {"Content-Type": "text/html; charset=utf-8"});  
		var readSream = fs.createReadStream(reqURL,'utf8');
        readSream.pipe(response);
	  } else  {
		response.writeHeader(401, {"Content-Type": "text/html"});  
		response.write('401 Forbidden');
	  } 
	}
}).listen(8888);
*/

console.log("Server has started.");