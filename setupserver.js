var fs = require('fs')
var http = require('http')
var path = require('path')

fs.readdir('projections', function(err, files) {
  for(var i = 0 ; i < files.length; i++) {
    processFile(files[i])
  }
})

function processFile(file) {
  var name = file.substr(0, file.indexOf('.'))
  var fullfile = path.join('projections', file)
  fs.readFile(fullfile, 'utf8', function(err, data) {
      var request = http.request({
        host: '127.0.0.1', 
        port: 2113,
        method: 'POST',
        path: '/projections/continuous?emit=yes&enabled=yes&name=' + name,
        headers: {
          'accept': 'application/json',
          'content-length': data.length
        }
      }, function(res) {
        console.log(name, res.statusCode)
      })
      request.write(data)
      request.end()
  })
}
