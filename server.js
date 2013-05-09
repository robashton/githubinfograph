var send = require('send')
var http = require('http')
var path = require('path')
var url = require('url')
var app = require('express')()

var port = process.env.PORT || 8001

http.createServer(app).listen(port);

app.use(
  function(req, res) {
    function error(err) {
      res.statusCode = err.status || 500
      res.end(err.message)
    }
    function redirect() {
      res.statusCode = 301
      res.setHeader('Location', req.url + '/')
      res.end('Redirecting to ' + req.url + '/')
    }
    send(req, url.parse(req.url).pathname)
      .root(path.join(__dirname, 'site'))
      .on('error', error)
      .on('directory', redirect)
      .pipe(res)
  }
)

