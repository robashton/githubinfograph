var http = require('http')

var projections = [
  "$streams",
  "$stream_by_category",
  "$by_category",
  "$by_event_type",
  "partition_by_day_and_hour",
  "daily_totals",
  "hourly_totals"
]


for(var i = 0 ; i < projections.length; i++) {
  var projection = projections[i]
  startProjection(projection)

}
function startProjection(projection) {
  var path = '/projection/' + projection + '/command/enable'

  http.request({
    host: '127.0.0.1',
    port: '2113',
    path: path,
    method: 'POST',
    headers: {
      'accept': 'application/json'
    }
  }, function(res) {
    console.log(path, res.statusCode)
  }).end()
}
