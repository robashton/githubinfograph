var EventStream = require('./eventstream')
  , Stream = require('stream').Stream
  , util = require('util')
  , _ = require('underscore')
  , http = require('http')

var ExpandedEventStream = function(host, port, stream) {
  Stream.call(this)
  this.host = host
  this.port = port
  this.stream = stream
  this.queue = []
  this.eventStream = new EventStream(host, port, stream)
  this.eventStream.on('data', this.onData.bind(this))
  this.readable = true
  this.pumpEventsDeferred()
}

util.inherits(ExpandedEventStream, Stream)

_.extend(ExpandedEventStream.prototype, {
   pumpEventsDeferred: function() {
     setTimeout(this.pumpEvents.bind(this), 500)
   },
   pumpEvents: function() {
     if(this.queue.length === 0)
       return this.pumpEventsDeferred()

     var ev = this.queue.shift()
     var idstr = ev.id.substr(ev.id.lastIndexOf('/') + 1)
     var self = this
     http.get({
        host: this.host,
        port: this.port,
        path: '/streams/' + this.stream + '/event/' + idstr + '?format=json'
      }, 
      function(res) {
        var json = ''
        if(res.statusCode !== 200)
          return self.pumpEventsDeferred()
        res.on('data', function(data) {
          json += data
        })
        res.on('end', function() {
          var parsed = JSON.parse(json)
          self.emit('data', parsed)
          if(self.queue.length > 0)
            self.pumpEvents()
          else
            self.pumpEventsDeferred()
        })
      })
   },
   onData: function(data) {
     this.queue.push(data)
   }
})

module.exports = ExpandedEventStream
