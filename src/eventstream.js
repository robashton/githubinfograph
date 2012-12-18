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

      for(var i = 0 ; i < parsed.links.length; i++) {
        var link = parsed.links[i]
        if(link.relation === 'prev') {
          self.nextPage = url.parse(link.uri).pathname
        }
      }

      self.processEvents(parsed.entries)
    })
  },
  processEvents: function(events) {
    var count = events.length
    events.pop()
    while(events.length > 0) {
      var ev = events.pop()
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
