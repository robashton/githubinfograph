var http = require('http')
var Stream = require('stream').Stream
var util = require('util')
var _ = require('underscore')


var EventStream = function(host, port, stream) {
  Stream.call(this)
  this.readable = true
  this.throttle = 1000
  this.host = host
  this.port = port
  this.stream = stream
  this.lastid = 0
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
    var path = [ '/streams/', this.stream, 
                '/range/',  (this.lastid + (this.bufferSize-1)), '/', this.bufferSize, '?format=json' 
               ].join('')
    var request = http.get({
      host: this.host,
      port: this.port,
      path: path,
    }, this.onEventsReceived)

    request.on('error', function(err) {
      console.log(err)
    })
  },
  onEventsReceived: function(res) {
    var json = ''
    var self = this
    res.setEncoding('utf8')
    res.on('data', function(data) {
      json += data
    })
    res.on('end', function() {
      var parsed = JSON.parse(json)
      self.processEvents(parsed.entries)
    })
  },
  processEvents: function(events) {
    var count = events.length
    events.pop()
    while(events.length > 0) {
      var ev = events.pop()
      this.lastid = this.parseIdFromEvent(ev)
      this.emit('data', ev)
    }
    if(count === this.bufferSize)
      this.pumpEvents()
    else
      this.pumpEventsDeferred()
  },
  parseIdFromEvent: function(ev) {
    var idstr = ev.id.substr(ev.id.lastIndexOf('/') + 1)
    return parseInt(idstr, 10)
  }
})

module.exports = EventStream
