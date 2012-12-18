var http = require('http')

var projections = [
  "$streams",
  "$stream_by_category",
  "$by_category",
  "$by_event_type"
]


for(var i = 0 ; i < projections.length; i++) {
  var projection = projections[i]
  startProjection(projection)
}

function startProjection(projection) {
  var disablepath = '/projection/' + projection + '/command/disable'
  var enablepath = '/projection/' + projection + '/command/enable'
  makeRequest(disablepath, function() {
    setTimeout(function() {
      makeRequest(enablepath, function() {

      })
    }, 2000)
  })
}


function makeRequest(path, cb) {
  var req = http.request({
    host: '127.0.0.1',
    port: '2113',
    path: path,
    method: 'POST',
    headers: {
      'accept': 'application/json'
    }
  }, function(res) {
    console.log(path, res.statusCode)
    cb()
  })

  req.on('error', function(err) {
    console.log(path, err)
  })
  req.end()
}
