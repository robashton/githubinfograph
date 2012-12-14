var ExpandedEventStream = require('./expandedeventstream')
  , stream = new ExpandedEventStream('127.0.0.1', '2113', 'hour-20121114_13')

stream.on('data', function(ev) {
  console.log(ev.eventNumber)
})
