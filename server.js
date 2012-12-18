var send = require('send')
var http = require('http')
var path = require('path')
var url = require('url')
var app = require('express')()
var lasthour = require('./src/lasthour')
var today = require('./src/today')

var server = http.createServer(app).listen(process.env.PORT || 8000);

app.get('/now', function(req, res) {
  res.send(lasthour.get())
})

app.get('/today', function(req, res) {
  res.send(today.get())
})

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

