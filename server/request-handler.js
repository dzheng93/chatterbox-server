/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.

var crypto = require('crypto');

var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};

var messages = {results: [{username: 'Fred', roomname: 'lobby', text: 'Fred was here', objectId: 1337, createdAt: 1969}]};

module.exports.requestHandler = function(request, response) {
  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
  console.log('Serving request type ' + request.method + ' for url ' + request.url);

  // The outgoing status.
  var GETStatus = 200;
  var POSTStatus = 201;
  var FAILStatus = 404;
  var UNALLOWStatus = 405; 

  // check the endpoint
  var headers = defaultCorsHeaders;
  headers['Content-Type'] = 'application/json';

  if (request.url === '/classes/messages') {
    if (request.method === 'GET' || request.method === 'OPTIONS') {
      response.writeHead(GETStatus, headers);
      // only return thirty most recent posted messages
      var recentMsgs = messages.results.slice(0, 29);
      var returnToClient = {results: recentMsgs};
      response.end(JSON.stringify(returnToClient));
    } else if (request.method === 'POST') {

      request.on('data', function (data) {
        var currentDate = (new Date()).valueOf().toString();
        var random = Math.random().toString();
        var uniqueN = crypto.createHash('sha1').update(currentDate + random).digest('hex');
        var newMsg = JSON.parse(data);

        newMsg.createdAt = currentDate;
        newMsg.objectId = uniqueN;
        messages.results.unshift(newMsg);
      });

      request.on('end', function () {
        response.writeHead(POSTStatus, headers);
        response.end(JSON.stringify(messages));
      });
      
    } else if (request.method === 'DELETE') {
      response.writeHead(UNALLOWStatus, headers);
      response.end('405 Method Not Allowed - Message Atom');
    } 
  } else {
    response.writeHead(FAILStatus, headers);
    response.end('404 Not Found');
  }  
};