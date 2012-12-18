var ExpandedEventStream = require('./expandedeventstream')

var stream = null
  , day = 0
  , hour = 0
  , month = 0
  , year = 0
  , hourlyEvents = []

function updateStream() {
  var date = new Date()
  var newYear = date.getUTCFullYear()
  var newMonth = date.getUTCMonth()
  var newDay = date.getUTCDate()
  var newHour = date.getUTCHours() 

  if(hour !== newHour) {
    day = newDay
    hour = newHour
    month = newMonth
    year = newYear

    console.log(day, hour, month, year)
    hourlyEvents = []
    if(stream) stream.off('data', pushEvent)
    stream = new ExpandedEventStream('127.0.0.1', '2113', 
                  ['hour-', year,month,day,'_',hour].join(''))
    stream.on('data', pushEvent)
  }
  setTimeout(updateStream, 20000)
}

updateStream()

function pushEvent(ev) {
  hourlyEvents.push(ev.data)
}

module.exports = {
  get: function() { 
    var start = new Date(year, month, day, hour)
    var end = new Date()
    end.setTime(start.getTime() + (60*60*1000))
    return {
       events: hourlyEvents,
       start: start,
       end: end
     }
   }
}
