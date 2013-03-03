var es = require('./src/es')

for(var i =0 ;i < 50; i++) {
  es({
    eventType: "PonyJumped",
    stream: "ponies",
    data: {
      PonyName: "derpy",
      Height: Math.random() * 5 + 5,
      Distance: Math.random() * 10 + 10
    },
    host: '127.0.0.1',
    port: 2113,
    error: function(err) {
      console.log(err)
    },
    success: function() {
      console.log('huzzah')
    }
  })
}
