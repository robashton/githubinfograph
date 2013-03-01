var postEvent = require('./es')
var https = require('https')

var eventQueue = [];
var timeUntilNextEvents = 10000;
var remaining = 0
var last_created_at = new Date();
var config = require('../config')
 ,  auth = config.auth

var fetchRepoInfo = function(name, cb) {
 var request = https.get({ host: 'api.github.com', path: '/repos/' + name + auth}, function(res) {
    var data = '';
    res.on('data', function (chunk) {
      data += chunk;
    });
    res.on('end', function() {
      cb(JSON.parse(data));
    });
  }).on('error', function(e) {
    console.error(e);
  });
};

var createDataFromPushEvent = function(data, cb) {
  fetchRepoInfo(data.repo.name, function(repo) {
    cb({
      language: repo.language,
      actor: data.actor,
      repo: data.repo,
      payload: data.payload
    });
  });
};

var processEvent = function(event) {
  if(event.created_at < last_created_at) {
    console.log('Skipping event', event.created_at);
    return;
  }
  console.log('Processing event', event.created_at, ':', event.type);
  last_created_at = event.created_at;
  eventQueue.push(event)
};

var processData = function(data) {
  var eventArray = JSON.parse(data);
  for(var i = eventArray.length-1 ; i >= 0; i--) {
    processEvent(eventArray[i]);
  }
};

var downloadEvents = function() {
  console.log('DOWNLOADING')
 var request = https.get({ host: 'api.github.com', path: '/events' + auth}, function(res) {
    if(res.statusCode === 403) {
       timeUntilNextEvents = timeUntilNextEvents * 2
       setTimeout(downloadEvents, timeUntilNextEvents)
       console.log('Being denied, waiting longer', timeUntilNextEvents)
       return
    }
    var data = '';
    res.on('data', function (chunk) {
      data += chunk;
    });
    res.on('end', function() {
      processData(data);
    });
  }).on('error', function(e) {
    console.error(e);
  }).end();

  console.log('Waiting ' + timeUntilNextEvents + 'ms until next poll')
  setTimeout(downloadEvents, timeUntilNextEvents);

};

var broadcastEvent = function() {
  if(eventQueue.length === 0) 
    return setTimeout(broadcastEvent, 500);
  var event = eventQueue.shift();
  postEvent({
    host: "127.0.0.1",
    port: 2113,
    stream: "github",
    eventType: event.type,
    data: event,
    success: function(id, corr, res) {
      console.log('success', res)
    },
    error: function(err) {
      console.log(err)
    }
  })
  setTimeout(broadcastEvent, 10)
};

module.exports = {
  start: function() {
    downloadEvents();
    broadcastEvent();
  }
}

