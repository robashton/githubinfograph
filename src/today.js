var http = require('http')

var today = {
  totals: {},
  hourly: {}
}

function updateToday() {
  var date = new Date()
  var newYear = date.getUTCFullYear()
  var newMonth = date.getUTCMonth()
  var newDay = date.getUTCDate()
  var dateStr = newYear + '' + newMonth + '' + newDay

  var totals = '/projection/daily_totals/state?partition=' + dateStr
  var hourlyTotals = '/projection/hourly_totals/state?partition=' + dateStr

  var req = http.request({
    host: '127.0.0.1',
    port: 2113,
    path: totals
  }, function(res) {
    if(res.statusCode !== 200) return error(res)
    var json = ''

    res.on('data', function(data) {
      json += data
    })
    res.on('end', function() {
       today.totals = JSON.parse(json)
    })
  })
  req.end()

  req = http.request({
    host: '127.0.0.1',
    port: 2113,
    path: hourlyTotals
  }, function(res) {
    if(res.statusCode !== 200) return error(res)
    var json = ''

    res.on('data', function(data) {
      json += data
    })
    res.on('end', function() {
      today.hourly = JSON.parse(json)
    })
  })
  req.end()


  setTimeout(updateToday, 5000)
}

function error(res) {
  console.log(res)
}

updateToday()

module.exports = {
  get: function() {
    return today
  }
}

