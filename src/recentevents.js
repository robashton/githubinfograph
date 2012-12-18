module.exports = (function() {
  var state = {
    events: []
  }
  var http = require('http')
  var url = require('url')
  var host = ''
  var port = 0
  var limit = 20


  function updateEvents() {
    var newEvents = []
    var pendingEvents = []

    function getEventsFrom(path) {
      var request = http.get({
          host: host,
          port: port,
          path: path
        }, 
      function(res) {
        var json = ''
        res.on('data', function(data) {
          json += data
        })
        res.on('end', function() {
          var stream = JSON.parse(json)
          readEventsFromStream(stream)
        })
      })
    }

    function readEventsFromStream(stream) {
      var events = stream.entries
      while(events.length > 0) {
        var ev = events.pop()
        pendingEvents.push(ev)
      }

      if(pendingEvents.length < limit) {
        for(var i = 0; i < stream.links.length; i++) {
          var link = stream.links[i]
          if(link.relation === 'next') {
            var path = url.parse(link.uri).pathname
            getEventsFrom(path + '?format=json')
          }
        }
      }
      else {
        downloadEvents()
      }
    }

    function downloadEvents() {
      var ev = pendingEvents.shift()
      var idstr = ev.id.substr(ev.id.lastIndexOf('/') + 1)
      http.get({
          host: host,
          port: port,
          path: '/streams/github/event/' + idstr + '?format=json'
        }, function(res) {
        var json = ''
        res.on('data', function(data) {
          json += data
        })
        res.on('end', function() {
          newEvents.push(JSON.parse(json).data)
        })
        if(pendingEvents.length > 0)
          downloadEvents()
        else
          state.events = newEvents
      })
    }

    getEventsFrom('/streams/github?format=json')
  }

  return {
    start: function(h, p, l) {
      host = h
      port = p
      limit = l
      setInterval(updateEvents, 5000)
    },
    get: function() {
      return state.events
    }
  }
})()

