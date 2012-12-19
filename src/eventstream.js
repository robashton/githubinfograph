var http = require('http')
var Stream = require('stream').Stream
var util = require('util')
var _ = require('underscore')
var url = require('url')


var EventStream = function(host, port, stream) {
  Stream.call(this)
  this.readable = true
  this.throttle = 1000
  this.host = host
  this.port = port
  this.stream = stream
  this.nextPage = null
  this.bufferSize = 20
  this.onEventsReceived = this.onEventsReceived.bind(this)
  this.pumpEvents = this.pumpEvents.bind(this)
  this.pumpEventsDeferred()
}
util.inherits(EventStream, Stream)

_.extend(EventStream.prototype, {
  pumpEventsDeferred: function() {
    setTimeout(this.pumpEvents, this.throttle)
  },
  pumpEvents: function() {
    var path = ''
    if(this.nextPage) 
      path = this.nextPage + '?format=json'
    else
      path = [ '/streams/', this.stream, 
                '/range/' + (this.bufferSize-1), '/', this.bufferSize, '?format=json' 
               ].join('')

    console.log(path)
    var request = http.get({
      host: this.host,
      port: this.port,
      path: path,
    }, this.onEventsReceived)

    request.on('error', function(err) {
      console.log(err)
      this.pumpEventsDeferred()
    })
    request.end()
  },
  onEventsReceived: function(res) {
    if(res.statusCode !== 200) {
      console.log(res.statusCode)
      return this.pumpEventsDeferred()
    }

    var json = ''
    var self = this
    res.setEncoding('utf8')
    res.on('data', function(data) {
      json += data
    })
    res.on('end', function() {
      var parsed = JSON.parse(json)

      if(parsed.entries.length === self.bufferSize) {
      	for(var i = 0 ; i < parsed.links.length; i++) {
          var link = parsed.links[i]
	  if(link.relation === 'prev') {
	    self.nextPage = url.parse(link.uri).pathname
	  }
        }
        self.processEvents(parsed.entries)
      }
      self.pumpEventsDeferred()
    })
  },
  processEvents: function(events) {
    var count = events.length
    while(events.length > 0) {
      var ev = events.pop()
      this.emit('data', ev)
    }
  },
  parseIdFromEvent: function(ev) {
    var idstr = ev.id.substr(ev.id.lastIndexOf('/') + 1)
    return parseInt(idstr, 10)
  }
})

module.exports = EventStream
