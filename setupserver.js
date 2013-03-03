var fs = require('fs')
var http = require('http')
var path = require('path')

if(process.env.emitters) {
  fs.readdir('emitters', function(err, files) {
    var i = 0
    console.log('Found ', files.length, 'files')
    function processNext() {
      if(i >= files.length) return
      console.log('Processing file ', i)
      processFile(files[i++], processNext)
    }
    processNext()
  })
}
else {
  fs.readdir('projections', function(err, files) {
    var i = 0
    console.log('Found ', files.length, 'files')
    function processNext() {
      if(i >= files.length) return
      console.log('Processing file ', i)
      processFile(files[i++], processNext)
    }
    processNext()
  })
}


function deleteProjection(name, cb) {
  var req = http.request({
    host: '127.0.0.1', 
    port: 2113,
    method: 'DELETE',
    path: '/projections/' + name,
    headers: {
      'accept': 'application/json'
    }
    }, function(res) {
      console.log('Deleting succeeded', name)
      cb()
    });
  req.on('error', function(err) {
    console.log('Deleting failed', name, err)
    cb()
  })
  req.end()
}

function createProjection(name, data, cb) {
  console.log('Creating ', name)
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
    console.log('Creating succeeded', name)
    cb()
  })
  request.on('error', function(err) {
    console.log('Creating failed', name, err)
  })
  request.write(data)
  request.end()
}

function processFile(file, cb) {
  var name = file.substr(0, file.indexOf('.'))
  var fullfile = path.join('projections', file)
  fs.readFile(fullfile, 'utf8', function(err, data) {
    deleteProjection(name, function() {
      createProjection(name, data, cb)
    })
  })
}
