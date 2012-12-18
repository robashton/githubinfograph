var ExpandedEventStream = require('./expandedeventstream')
  // TODO: Construct this out of 'this hour'
  // re-build when hour changes
  , stream = new ExpandedEventStream('127.0.0.1', '2113', 'hour-20121117_23')

var hourlyEvents = []

stream.on('data', function(ev) {
  hourlyEvents.push(ev.data)
})

module.exports = {
  get: function() { return {
     events: hourlyEvents,
     start: new Date('2012', '11', '17', '23'),
     end: new Date('2012', '11', '17', '24')
  }}
}
